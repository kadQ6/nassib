import type { MasterIndex, MasterIndexLevel } from "@/types/nassib";

export interface MasterIndexInput {
  /** 0-100 — SPI planning (réel / prévu à date, plafonné) */
  planningScore: number;
  /** 0-100 — réserves + checklists locaux */
  qualityScore: number;
  /** 0-100 — approvisionnements ou statut équipements */
  procurementScore: number;
  /** 0-100 — lots MEP + fluides + locaux */
  technicalScore: number;
  /** 0-100 — CPI ou neutre si pas de paiement */
  financialScore: number;
  /** 0-100 — documents validés */
  documentationScore: number;
}

const WEIGHTS = {
  planning: 25,
  quality: 20,
  procurement: 15,
  technical: 20,
  financial: 10,
  documentation: 10,
} as const;

export function calculateMasterIndex(input: MasterIndexInput): MasterIndex {
  const breakdown = {
    planning: (input.planningScore / 100) * WEIGHTS.planning,
    quality: (input.qualityScore / 100) * WEIGHTS.quality,
    procurement: (input.procurementScore / 100) * WEIGHTS.procurement,
    technical: (input.technicalScore / 100) * WEIGHTS.technical,
    financial: (input.financialScore / 100) * WEIGHTS.financial,
    documentation: (input.documentationScore / 100) * WEIGHTS.documentation,
  };

  const score = Math.round(
    (breakdown.planning +
      breakdown.quality +
      breakdown.procurement +
      breakdown.technical +
      breakdown.financial +
      breakdown.documentation) *
      10,
  ) / 10;

  let level: MasterIndexLevel = "green";
  if (score < 60) level = "red";
  else if (score < 80) level = "orange";

  return { score, level, breakdown };
}

function extractWbs(name: string): string | null {
  const match = name.match(/^\[([\d.]+)\]/);
  return match?.[1] ?? null;
}

function taskDurationDays(task: {
  durationDays?: number;
  plannedStart: string;
  plannedEnd: string;
}): number {
  if (task.durationDays && task.durationDays > 0) return task.durationDays;
  const start = new Date(task.plannedStart).getTime();
  const end = new Date(task.plannedEnd).getTime();
  return Math.max(1, Math.round((end - start) / 86400000));
}

/** Tâches feuilles du Gantt — exclut le sommaire racine [1]. */
export function planningLeafTasks<T extends { name: string }>(
  tasks: T[],
): T[] {
  const allWbs = tasks
    .map((t) => extractWbs(t.name))
    .filter((w): w is string => Boolean(w));

  return tasks.filter((t) => {
    const wbs = extractWbs(t.name);
    if (!wbs || wbs === "1") return false;
    return !allWbs.some((other) => other !== wbs && other.startsWith(`${wbs}.`));
  });
}

/** Avancement réel pondéré par durée (tâches feuilles) — aligné PDF planning. */
export function durationWeightedActualProgress(
  tasks: {
    name: string;
    progressPct: number;
    durationDays?: number;
    plannedStart: string;
    plannedEnd: string;
  }[],
): number {
  const leaves = planningLeafTasks(tasks);
  if (leaves.length === 0) return 0;

  let weight = 0;
  let earned = 0;
  for (const t of leaves) {
    const days = taskDurationDays(t);
    weight += days;
    earned += t.progressPct * days;
  }
  return weight > 0 ? Math.round((earned / weight) * 10) / 10 : 0;
}

/** Avancement prévu à date — pondéré par durée des tâches feuilles. */
export function durationWeightedPlannedProgress(
  tasks: {
    name: string;
    plannedStart: string;
    plannedEnd: string;
    durationDays?: number;
  }[],
  asOf: Date = new Date(),
): number {
  const leaves = planningLeafTasks(tasks);
  if (leaves.length === 0) return 0;

  const ts = asOf.getTime();
  let weight = 0;
  let earned = 0;

  for (const t of leaves) {
    const days = taskDurationDays(t);
    weight += days;
    const start = new Date(t.plannedStart).getTime();
    const end = new Date(t.plannedEnd).getTime();
    const duration = Math.max(end - start, 86400000);

    if (ts >= end) earned += days;
    else if (ts > start) earned += ((ts - start) / duration) * days;
  }

  return weight > 0 ? Math.round((earned / weight) * 1000) / 10 : 0;
}

/** SPI = min(100, réel / prévu × 100) */
export function spiScore(actual: number, planned: number): number {
  if (planned <= 0) return 100;
  return Math.min(100, Math.round((actual / planned) * 1000) / 10);
}

/** @deprecated Utiliser durationWeightedActualProgress */
export function actualProgress(tasks: { progressPct: number }[]): number {
  if (tasks.length === 0) return 0;
  const avg = tasks.reduce((s, t) => s + t.progressPct, 0) / tasks.length;
  return Math.round(avg * 10) / 10;
}

/** @deprecated Utiliser durationWeightedPlannedProgress */
export function plannedProgressAtDate(
  tasks: {
    name?: string;
    plannedStart: string;
    plannedEnd: string;
    durationDays?: number;
  }[],
  asOf: Date = new Date(),
): number {
  return durationWeightedPlannedProgress(
    tasks.map((t, i) => ({
      ...t,
      name: t.name ?? `[leaf-${i}]`,
    })),
    asOf,
  );
}

export function scheduleVarianceDays(
  contractEnd: string,
  forecastEnd: string,
): number {
  const contract = new Date(contractEnd).getTime();
  const forecast = new Date(forecastEnd).getTime();
  return Math.round((forecast - contract) / 86400000);
}

export function receptionReadinessScore(input: {
  roomsValidated: number;
  roomsTotal: number;
  criticalReservesOpen: number;
  testsValidated: number;
  testsTotal: number;
  doeCompletePct: number;
}): number {
  const roomScore =
    input.roomsTotal > 0
      ? (input.roomsValidated / input.roomsTotal) * 100
      : 0;
  const testScore =
    input.testsTotal > 0
      ? (input.testsValidated / input.testsTotal) * 100
      : 0;
  const reservePenalty = Math.min(input.criticalReservesOpen * 5, 30);
  const raw =
    roomScore * 0.35 +
    testScore * 0.35 +
    input.doeCompletePct * 0.2 +
    (100 - reservePenalty) * 0.1;
  return Math.max(0, Math.round(raw * 10) / 10);
}

export { WEIGHTS as MASTER_INDEX_WEIGHTS };
