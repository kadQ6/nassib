/**
 * Planning général des travaux — source officielle
 * Fichier : Planning general des travaux 05 06 2026.pdf
 * Projet : Polyclinique Nassib · 01/06/2025 → 31/01/2027
 */
import type { PlanningTask, WbsPhase } from "@/types/nassib";
import { NASSIB_PROJECT_ID } from "@/lib/nassib/constants";

type RawRow = {
  n: number;
  wbs: string;
  name: string;
  pct: number;
  days: number;
  start: string;
  end: string;
  preds?: number[];
  phase: string;
};

const ROWS: RawRow[] = [
  { n: 1, wbs: "1", name: "Polyclinique Nassib", pct: 45, days: 610, start: "2025-06-01", end: "2027-01-31", phase: "phase-root" },
  { n: 2, wbs: "1.1", name: "Préparation", pct: 100, days: 61, start: "2025-06-01", end: "2025-07-31", phase: "phase-11" },
  { n: 3, wbs: "1.1.1", name: "Le dessin du planning de construction", pct: 100, days: 25, start: "2025-06-01", end: "2025-06-25", phase: "phase-11" },
  { n: 4, wbs: "1.1.2", name: "Mise à la disposition des points de contrôle par le MOA", pct: 100, days: 1, start: "2025-06-01", end: "2025-06-01", phase: "phase-11" },
  { n: 5, wbs: "1.1.3", name: "Implantation de l'ouvrage", pct: 100, days: 1, start: "2025-06-02", end: "2025-06-02", preds: [4], phase: "phase-11" },
  { n: 6, wbs: "1.1.4", name: "Conception et validation des plans de terrassement", pct: 100, days: 5, start: "2025-06-03", end: "2025-06-07", preds: [5], phase: "phase-11" },
  { n: 7, wbs: "1.1.5", name: "Clôture temporaire", pct: 100, days: 5, start: "2025-06-01", end: "2025-06-05", phase: "phase-11" },
  { n: 8, wbs: "1.1.6", name: "Installation de chantier", pct: 100, days: 7, start: "2025-06-08", end: "2025-06-14", preds: [6], phase: "phase-11" },
  { n: 9, wbs: "1.1.7", name: "Implantation et topographie du projet", pct: 100, days: 3, start: "2025-06-26", end: "2025-06-28", preds: [3], phase: "phase-11" },
  { n: 10, wbs: "1.1.8", name: "Excavation des fondations", pct: 100, days: 10, start: "2025-06-29", end: "2025-07-08", preds: [9], phase: "phase-11" },
  { n: 11, wbs: "1.1.9", name: "Remblai de fondation et essai de compactage", pct: 100, days: 23, start: "2025-07-09", end: "2025-07-31", preds: [10], phase: "phase-11" },
  { n: 12, wbs: "1.2", name: "Fondation et tuyauterie enterrée", pct: 100, days: 85, start: "2025-08-01", end: "2025-10-24", phase: "phase-12" },
  { n: 13, wbs: "1.2.1", name: "Radier fondation — poutres et semelles (armature, coffrage)", pct: 100, days: 60, start: "2025-08-01", end: "2025-09-29", preds: [11], phase: "phase-12" },
  { n: 14, wbs: "1.2.2", name: "Installation tuyaux alimentation eau et sanitaires", pct: 100, days: 15, start: "2025-09-30", end: "2025-10-14", preds: [13], phase: "phase-12" },
  { n: 15, wbs: "1.2.3", name: "Fondation radier — béton", pct: 100, days: 2, start: "2025-10-15", end: "2025-10-16", preds: [14], phase: "phase-12" },
  { n: 16, wbs: "1.2.4", name: "Fondation — étanchéité E3", pct: 100, days: 1, start: "2025-10-24", end: "2025-10-24", preds: [15], phase: "phase-12" },
  { n: 17, wbs: "1.3", name: "Structure principale en béton", pct: 100, days: 195, start: "2025-10-25", end: "2026-05-07", phase: "phase-13" },
  { n: 18, wbs: "1.3.1", name: "Mur de cisaillement RDC, colonnes cadre (3,95 m)", pct: 100, days: 40, start: "2025-10-25", end: "2025-12-03", preds: [16], phase: "phase-13" },
  { n: 19, wbs: "1.3.2", name: "Toit RDC, poutres (3,95 m)", pct: 100, days: 30, start: "2025-12-04", end: "2026-01-02", preds: [18], phase: "phase-13" },
  { n: 20, wbs: "1.3.3", name: "Mur cisaillement R+1, colonnes cadre (7,95 m)", pct: 100, days: 40, start: "2026-01-03", end: "2026-02-11", preds: [19], phase: "phase-13" },
  { n: 21, wbs: "1.3.4", name: "Toit, poutres R+1 (7,95 m)", pct: 100, days: 30, start: "2026-02-12", end: "2026-03-13", preds: [20], phase: "phase-13" },
  { n: 22, wbs: "1.3.5", name: "Parapet de toiture (9,3 m)", pct: 100, days: 15, start: "2026-03-14", end: "2026-03-28", preds: [21], phase: "phase-13" },
  { n: 23, wbs: "1.3.6", name: "Travaux d'étanchéité de toiture", pct: 100, days: 40, start: "2026-03-29", end: "2026-05-07", preds: [22], phase: "phase-13" },
  { n: 24, wbs: "1.4", name: "Travaux de décoration", pct: 21, days: 187, start: "2026-04-01", end: "2026-10-04", phase: "phase-14" },
  { n: 25, wbs: "1.4.1", name: "Travaux de cloisons", pct: 90, days: 72, start: "2026-04-01", end: "2026-07-15", phase: "phase-14" },
  { n: 26, wbs: "1.4.2", name: "Travaux d'enduisage", pct: 0, days: 60, start: "2026-07-16", end: "2026-09-13", preds: [25], phase: "phase-14" },
  { n: 27, wbs: "1.4.3", name: "Portes & fenêtres", pct: 0, days: 45, start: "2026-07-17", end: "2026-08-30", preds: [25], phase: "phase-14" },
  { n: 28, wbs: "1.4.4", name: "Travaux de peinture", pct: 0, days: 62, start: "2026-07-16", end: "2026-09-15", preds: [25], phase: "phase-14" },
  { n: 29, wbs: "1.4.5", name: "Pose de carrelage", pct: 0, days: 60, start: "2026-07-20", end: "2026-09-17", preds: [25], phase: "phase-14" },
  { n: 30, wbs: "1.4.6", name: "Pose des rampes d'escalier", pct: 0, days: 15, start: "2026-09-20", end: "2026-10-04", preds: [29], phase: "phase-14" },
  { n: 31, wbs: "1.5", name: "Travaux d'installation d'équipement", pct: 0, days: 154, start: "2026-08-01", end: "2027-01-01", phase: "phase-15" },
  { n: 32, wbs: "1.5.1", name: "Installation unités intérieures climatiseurs", pct: 0, days: 20, start: "2026-08-01", end: "2026-08-20", phase: "phase-15" },
  { n: 33, wbs: "1.5.2", name: "Équipements ventilation et renouvellement d'air", pct: 0, days: 20, start: "2026-08-31", end: "2026-09-19", preds: [32], phase: "phase-15" },
  { n: 34, wbs: "1.5.3", name: "Installation des luminaires", pct: 0, days: 20, start: "2026-09-20", end: "2026-10-09", preds: [33], phase: "phase-15" },
  { n: 35, wbs: "1.5.4", name: "Installation interrupteurs et prises de courant", pct: 0, days: 20, start: "2026-10-10", end: "2026-10-29", preds: [34], phase: "phase-15" },
  { n: 36, wbs: "1.5.5", name: "Installation boîte de distribution", pct: 0, days: 7, start: "2026-10-30", end: "2026-11-05", preds: [35], phase: "phase-15" },
  { n: 37, wbs: "1.5.6", name: "Installation des sanitaires", pct: 0, days: 7, start: "2026-11-06", end: "2026-11-12", preds: [36], phase: "phase-15" },
  { n: 38, wbs: "1.5.7", name: "Cuve eau et surpresseur", pct: 0, days: 10, start: "2026-11-13", end: "2026-11-22", preds: [37], phase: "phase-15" },
  { n: 39, wbs: "1.5.8", name: "Installation système sécurité incendie", pct: 0, days: 10, start: "2026-11-23", end: "2026-12-02", preds: [38], phase: "phase-15" },
  { n: 40, wbs: "1.5.9", name: "Installation système CCTV", pct: 0, days: 10, start: "2026-12-03", end: "2026-12-12", preds: [39], phase: "phase-15" },
  { n: 41, wbs: "1.5.10", name: "Installation réseaux VDI-IP", pct: 0, days: 10, start: "2026-12-13", end: "2026-12-22", preds: [40], phase: "phase-15" },
  { n: 42, wbs: "1.5.11", name: "Installation armoires salle technique courant faible", pct: 0, days: 10, start: "2026-12-23", end: "2027-01-01", preds: [41], phase: "phase-15" },
  { n: 43, wbs: "1.6", name: "VRD", pct: 0, days: 42, start: "2026-10-01", end: "2026-11-11", phase: "phase-16" },
  { n: 44, wbs: "1.6.1", name: "Canalisations eaux pluviales et usées", pct: 0, days: 15, start: "2026-10-01", end: "2026-10-15", phase: "phase-16" },
  { n: 45, wbs: "1.6.2", name: "Fouille & compactage chaussée", pct: 0, days: 10, start: "2026-10-16", end: "2026-10-25", preds: [44], phase: "phase-16" },
  { n: 46, wbs: "1.6.3", name: "Bordures, dallettes, regards, avaloirs", pct: 0, days: 15, start: "2026-10-26", end: "2026-11-09", preds: [45], phase: "phase-16" },
  { n: 47, wbs: "1.6.4", name: "Travaux de bitumage", pct: 0, days: 2, start: "2026-11-10", end: "2026-11-11", preds: [46], phase: "phase-16" },
  { n: 48, wbs: "1.6.5", name: "Arbres", pct: 0, days: 10, start: "2026-11-01", end: "2026-11-10", phase: "phase-16" },
  { n: 49, wbs: "1.7", name: "Travaux de mise en service", pct: 0, days: 72, start: "2026-11-01", end: "2027-01-11", phase: "phase-17" },
  { n: 50, wbs: "1.7.1", name: "Essai réseaux eau, évacuation et drainage", pct: 0, days: 3, start: "2026-11-01", end: "2026-11-03", phase: "phase-17" },
  { n: 51, wbs: "1.7.2", name: "Essai système courant fort", pct: 0, days: 3, start: "2026-12-01", end: "2026-12-03", phase: "phase-17" },
  { n: 52, wbs: "1.7.3", name: "Essai système sécurité incendie", pct: 0, days: 10, start: "2026-12-04", end: "2026-12-13", preds: [51], phase: "phase-17" },
  { n: 53, wbs: "1.7.4", name: "Essai système courant faible", pct: 0, days: 10, start: "2026-12-14", end: "2026-12-23", preds: [52], phase: "phase-17" },
  { n: 54, wbs: "1.7.5", name: "Essai système CVC", pct: 0, days: 10, start: "2026-12-24", end: "2027-01-02", preds: [53], phase: "phase-17" },
  { n: 55, wbs: "1.7.6", name: "Essai réseau fluide médicale", pct: 0, days: 9, start: "2027-01-03", end: "2027-01-11", preds: [54], phase: "phase-17" },
  { n: 56, wbs: "1.8", name: "Réception des travaux", pct: 0, days: 20, start: "2027-01-12", end: "2027-01-31", phase: "phase-18" },
  { n: 57, wbs: "1.8.1", name: "Réception des travaux", pct: 0, days: 20, start: "2027-01-12", end: "2027-01-31", preds: [50, 51, 52, 53, 54, 55, 48], phase: "phase-18" },
];

export const PLANNING_GANTT_META = {
  sourceFile: "Planning general des travaux 05 06 2026.pdf",
  exportedAt: "2026-06-05",
  projectStart: "2025-06-01",
  projectEnd: "2027-01-31",
  overallProgressPct: 45,
};

function mapStatus(pct: number): PlanningTask["status"] {
  if (pct >= 100) return "completed";
  if (pct > 0) return "in_progress";
  return "not_started";
}

function idFor(n: number) {
  return `gantt-${String(n).padStart(2, "0")}`;
}

export const PLANNING_GANTT_PHASES: WbsPhase[] = [
  { id: "phase-11", code: "1.1", name: "Préparation", sortOrder: 1, progressPct: 100, plannedStart: "2025-06-01", plannedEnd: "2025-07-31" },
  { id: "phase-12", code: "1.2", name: "Fondation et tuyauterie enterrée", sortOrder: 2, progressPct: 100, plannedStart: "2025-08-01", plannedEnd: "2025-10-24" },
  { id: "phase-13", code: "1.3", name: "Structure principale en béton", sortOrder: 3, progressPct: 100, plannedStart: "2025-10-25", plannedEnd: "2026-05-07" },
  { id: "phase-14", code: "1.4", name: "Travaux de décoration", sortOrder: 4, progressPct: 21, plannedStart: "2026-04-01", plannedEnd: "2026-10-04" },
  { id: "phase-15", code: "1.5", name: "Installation d'équipement", sortOrder: 5, progressPct: 0, plannedStart: "2026-08-01", plannedEnd: "2027-01-01" },
  { id: "phase-16", code: "1.6", name: "VRD", sortOrder: 6, progressPct: 0, plannedStart: "2026-10-01", plannedEnd: "2026-11-11" },
  { id: "phase-17", code: "1.7", name: "Mise en service", sortOrder: 7, progressPct: 0, plannedStart: "2026-11-01", plannedEnd: "2027-01-11" },
  { id: "phase-18", code: "1.8", name: "Réception des travaux", sortOrder: 8, progressPct: 0, plannedStart: "2027-01-12", plannedEnd: "2027-01-31" },
];

export const PLANNING_GANTT_TASKS: PlanningTask[] = ROWS.map((r) => ({
  id: idFor(r.n),
  projectId: NASSIB_PROJECT_ID,
  phaseId: r.phase,
  wbsCode: r.wbs,
  name: `[${r.wbs}] ${r.name}`,
  responsible: "OPC DJI-FU",
  company: "DJI-FU SARL",
  status: mapStatus(r.pct),
  progressPct: r.pct,
  plannedStart: r.start,
  plannedEnd: r.end,
  baselineStart: r.start,
  baselineEnd: r.end,
  durationDays: r.days,
  isCritical: r.n === 1 || r.wbs.startsWith("1.3") || r.wbs.startsWith("1.7") || r.wbs.startsWith("1.8"),
  isMilestone: r.wbs === "1.8.1" || r.wbs === "1",
  hasProof: r.pct >= 100,
  predecessors: (r.preds ?? []).map(idFor),
  alerts: [],
  lotCode: r.wbs.startsWith("1.5") ? "LOT-MEP" : r.wbs.startsWith("1.6") ? "LOT-VRD" : r.wbs.startsWith("1.7") ? "LOT-ESSAIS" : undefined,
}));

export const PLANNING_GANTT_WARNINGS = [
  "Avancement global projet : 45 % — fin contractuelle 31/01/2027.",
  "Décoration (1.4) : 21 % — cloisons 90 %, enduits/peinture/carrelage non démarrés.",
  "Installations équipements (1.5) : 0 % — chemin critique MEP/CVC/CFA/SSI.",
  "VRD (1.6) et mise en service (1.7) : non démarrés — fenêtre serrée Q4 2026 / Q1 2027.",
  "Réception (1.8) conditionnée à 7 essais + VRD — prédécesseurs multiples.",
];
