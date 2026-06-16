import type {
  CommissioningOverallStatus,
  CommissioningPhaseId,
  CommissioningPhaseStatus,
  NassibCommissioningLine,
} from "@/types/nassib";

export const COMMISSIONING_PHASE_LABELS: Record<CommissioningPhaseId, string> = {
  installation: "Installation",
  commissioning: "Mise en service",
  training: "Formation",
};

export const COMMISSIONING_PHASE_STATUS_LABELS: Record<
  CommissioningPhaseStatus,
  string
> = {
  locked: "En attente logistique",
  pending: "À planifier",
  in_progress: "En cours",
  done: "Validé",
  blocked: "Bloqué (NC)",
};

export const COMMISSIONING_OVERALL_LABELS: Record<
  CommissioningOverallStatus,
  string
> = {
  waiting_logistics: "Attente logistique",
  in_progress: "En cours",
  ready_for_exploitation: "Prêt exploitation",
  blocked: "Bloqué",
};

export const COMMISSIONING_STATUS_VARIANT: Record<
  CommissioningPhaseStatus,
  "default" | "info" | "success" | "warning" | "danger"
> = {
  locked: "default",
  pending: "warning",
  in_progress: "info",
  done: "success",
  blocked: "danger",
};

export const COMMISSIONING_OVERALL_VARIANT: Record<
  CommissioningOverallStatus,
  "default" | "info" | "success" | "warning" | "danger"
> = {
  waiting_logistics: "default",
  in_progress: "info",
  ready_for_exploitation: "success",
  blocked: "danger",
};

export function commissioningKpis(lines: NassibCommissioningLine[]) {
  const total = lines.length;
  const waitingLogistics = lines.filter(
    (l) => l.overallStatus === "waiting_logistics",
  ).length;
  const inProgress = lines.filter((l) => l.overallStatus === "in_progress").length;
  const ready = lines.filter(
    (l) => l.overallStatus === "ready_for_exploitation",
  ).length;
  const blocked = lines.filter((l) => l.overallStatus === "blocked").length;
  const avgProgress =
    total > 0
      ? Math.round(lines.reduce((s, l) => s + l.progressPct, 0) / total)
      : 0;
  const installationDone = lines.filter(
    (l) => l.phases.installation.status === "done",
  ).length;
  const commissioningDone = lines.filter(
    (l) => l.phases.commissioning.status === "done",
  ).length;
  const trainingDone = lines.filter(
    (l) => l.phases.training.status === "done",
  ).length;
  return {
    total,
    waitingLogistics,
    inProgress,
    ready,
    blocked,
    avgProgress,
    installationDone,
    commissioningDone,
    trainingDone,
  };
}

export function exportCommissioningCsv(lines: NassibCommissioningLine[]): string {
  const header =
    "Code;Désignation;Local;Installation;Mise en service;Formation;Avancement %;Statut global";
  const rows = lines.map((l) =>
    [
      l.assetCode,
      l.description,
      l.roomCode,
      COMMISSIONING_PHASE_STATUS_LABELS[l.phases.installation.status],
      COMMISSIONING_PHASE_STATUS_LABELS[l.phases.commissioning.status],
      COMMISSIONING_PHASE_STATUS_LABELS[l.phases.training.status],
      l.progressPct,
      COMMISSIONING_OVERALL_LABELS[l.overallStatus],
    ].join(";"),
  );
  return [header, ...rows].join("\n");
}
