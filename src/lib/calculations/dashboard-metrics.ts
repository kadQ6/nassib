import type { BoqLine, NassibBundle } from "@/types/nassib";
import { PLANNING_GANTT_META } from "@/data/nassib/planning-gantt-2026";
import {
  calculateMasterIndex,
  durationWeightedActualProgress,
  durationWeightedPlannedProgress,
  scheduleVarianceDays,
  spiScore,
} from "@/lib/calculations/master-index";
import { buildLotDetailAnalytics } from "@/lib/nassib/lot-boq-analytics";
import { generatePlanningAlerts } from "@/lib/calculations/planning-alerts";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** Checklists locaux — moyenne % points validés */
function roomChecklistScore(rooms: NassibBundle["rooms"]): number {
  if (rooms.length === 0) return 0;
  const scores = rooms.map((r) =>
    r.checklistTotal > 0 ? (r.checklistDone / r.checklistTotal) * 100 : 0,
  );
  return round1(scores.reduce((s, v) => s + v, 0) / scores.length);
}

/** Qualité : réserves + checklists locaux */
function qualityScore(state: NassibBundle): number {
  const { reserves, rooms } = state;
  const checklist = roomChecklistScore(rooms);

  if (reserves.length === 0) {
    // Pas de réserve saisie — on ne force pas 100 % : checklists + marge si chantier propre
    return round1(Math.min(100, checklist * 0.6 + 40));
  }

  const closed = reserves.filter((r) =>
    ["closed", "levée", "corrected"].includes(r.status),
  ).length;
  const open = reserves.filter(
    (r) => !["closed", "levée"].includes(r.status),
  );
  const criticalOpen = open.filter((r) => r.severity === "critical").length;
  const closureRate = (closed / reserves.length) * 100;
  const penalty = Math.min(open.length * 4 + criticalOpen * 12, 40);
  return round1(Math.max(0, closureRate * 0.6 + checklist * 0.4 - penalty));
}

/** Approvisionnements : lignes BOQ avec suivi, sinon statut équipements */
function procurementScore(state: NassibBundle): number {
  const { procurement, equipment } = state;

  if (procurement.length > 0) {
    const onTrack = procurement.filter(
      (p) =>
        !p.planningImpact ||
        ["received", "installed", "customs_cleared"].includes(p.status),
    ).length;
    return round1((onTrack / procurement.length) * 100);
  }

  if (equipment.length === 0) return 50;

  const defined = equipment.filter(
    (e) => !["to_define", "blocked"].includes(e.status),
  ).length;
  if (defined === 0) {
    // Inventaire plan validé, commandes non lancées — score intermédiaire
    return 55;
  }
  return round1((defined / equipment.length) * 100);
}

/**
 * Technique : avancement planning par lot MEP (Gantt) + fluides médicaux + locaux.
 * Ne pas utiliser mepLots.progressPct à 0 % tant que non saisi en chantier.
 */
function technicalScore(state: NassibBundle): number {
  const { mepLots, boq, tasks, rooms, zones, medicalGas } = state;

  const lotPlanning = mepLots
    .map((lot) =>
      buildLotDetailAnalytics(lot, boq, tasks, rooms, zones).planningAvgPct,
    )
    .filter((p) => p > 0);

  const lotAvg =
    lotPlanning.length > 0
      ? lotPlanning.reduce((s, p) => s + p, 0) / lotPlanning.length
      : 0;

  const gasAvg =
    medicalGas.length > 0
      ? medicalGas.reduce((s, g) => s + g.progressPct, 0) / medicalGas.length
      : 0;

  const roomAvg =
    rooms.length > 0
      ? rooms.reduce((s, r) => s + r.progressPct, 0) / rooms.length
      : 0;

  return round1(lotAvg * 0.55 + gasAvg * 0.2 + roomAvg * 0.25);
}

function totalBoqPaid(boq: BoqLine[]): number {
  return boq.reduce((s, l) => s + (l.paymentPaid ?? 0), 0);
}

/**
 * Financier : indice coût/performance (CPI) si paiements saisis,
 * sinon score neutre (pas de pénalité avant premier décompte).
 */
function financialScore(
  progressActual: number,
  contractAmount: number,
  budgetConsumed: number,
  boq: BoqLine[],
): number {
  const paid = budgetConsumed > 0 ? budgetConsumed : totalBoqPaid(boq);

  if (paid <= 0 || contractAmount <= 0) {
    return 75;
  }

  const earnedPct = progressActual;
  const spentPct = (paid / contractAmount) * 100;
  if (spentPct <= 0) return 75;

  const cpi = earnedPct / spentPct;
  return round1(Math.min(100, Math.max(0, cpi * 100)));
}

function documentationScore(documents: NassibBundle["documents"]): number {
  const active = documents.filter((d) => !d.isObsolete);
  if (active.length === 0) return 0;
  const approved = active.filter((d) => d.validationStatus === "approved").length;
  return round1((approved / active.length) * 100);
}

export interface DashboardScoreInputs {
  planningScore: number;
  qualityScore: number;
  procurementScore: number;
  technicalScore: number;
  financialScore: number;
  documentationScore: number;
  progressActual: number;
  progressPlanned: number;
  spi: number;
  financialNote: string;
}

export function computeDashboardMetrics(state: NassibBundle): {
  dashboard: NassibBundle["dashboard"];
  inputs: DashboardScoreInputs;
} {
  const { tasks, reserves, documents, procurement, project, boq } = state;

  const progressPlanned = durationWeightedPlannedProgress(tasks);
  const progressActual =
    durationWeightedActualProgress(tasks) || PLANNING_GANTT_META.overallProgressPct;
  const spi = spiScore(progressActual, progressPlanned);

  project.progressPlanned = progressPlanned;
  project.progressActual = progressActual;

  const openReserves = reserves.filter(
    (r) => !["closed", "levée"].includes(r.status),
  ).length;
  const criticalReserves = reserves.filter(
    (r) => r.severity === "critical" && !["closed", "levée"].includes(r.status),
  ).length;
  const delayedTasks = tasks.filter(
    (t) =>
      t.status === "blocked" ||
      generatePlanningAlerts([t]).some((a) => a.type === "late"),
  ).length;
  const docsPending = documents.filter(
    (d) =>
      ["submitted", "in_review"].includes(d.validationStatus) && !d.isObsolete,
  ).length;
  const criticalProc = procurement.filter(
    (p) =>
      p.criticality === "critical" &&
      !["delivered", "installed", "delivered_complete"].includes(p.status),
  ).length;

  const paid = project.budgetConsumed > 0 ? project.budgetConsumed : totalBoqPaid(boq);
  const budgetPct =
    project.contractAmount > 0 ? (paid / project.contractAmount) * 100 : 0;
  const budgetVariance = round1(budgetPct - progressActual);

  const qScore = qualityScore(state);
  const pScore = procurementScore(state);
  const tScore = technicalScore(state);
  const fScore = financialScore(
    progressActual,
    project.contractAmount,
    project.budgetConsumed,
    boq,
  );
  const dScore = documentationScore(documents);

  const financialNote =
    paid <= 0
      ? "Aucun paiement saisi — score neutre en attente des décomptes"
      : `CPI physique/financier · consommé ${round1(budgetPct)} % vs réel ${progressActual} %`;

  const inputs: DashboardScoreInputs = {
    planningScore: spi,
    qualityScore: qScore,
    procurementScore: pScore,
    technicalScore: tScore,
    financialScore: fScore,
    documentationScore: dScore,
    progressActual,
    progressPlanned,
    spi,
    financialNote,
  };

  return {
    inputs,
    dashboard: {
      projectProgressPlanned: progressPlanned,
      projectProgressActual: progressActual,
      scheduleVarianceDays: scheduleVarianceDays(
        project.schedule.contractEnd,
        project.schedule.forecastEnd,
      ),
      budgetVariancePct: budgetVariance,
      delayedTasks,
      openReserves,
      criticalReserves,
      documentsPendingValidation: docsPending,
      criticalProcurements: criticalProc,
      nextMeeting: "Réunion chantier n°13",
      nextMeetingDate: "2026-06-17",
      nextMilestone:
        "Réunion — confirmer absence ventilateurs plafond BOQ (hors attente / bureaux) · réseaux MEP RDC urgences",
      nextMilestoneDate: "2026-06-17",
      masterIndex: calculateMasterIndex({
        planningScore: spi,
        qualityScore: qScore,
        procurementScore: pScore,
        technicalScore: tScore,
        financialScore: fScore,
        documentationScore: dScore,
      }),
    },
  };
}

/** Met à jour mepLots.progressPct depuis le planning Gantt (source officielle). */
export function syncMepLotsFromPlanning(state: NassibBundle): void {
  for (const lot of state.mepLots) {
    const analytics = buildLotDetailAnalytics(
      lot,
      state.boq,
      state.tasks,
      state.rooms,
      state.zones,
    );
    if (analytics.planningAvgPct > 0) {
      lot.progressPct = Math.round(analytics.planningAvgPct);
    }
  }
}
