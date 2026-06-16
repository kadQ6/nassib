import type { PlanningTask } from "@/types/nassib";

export interface PlanningAlert {
  taskId: string;
  taskName: string;
  type:
    | "late"
    | "no_owner"
    | "no_predecessor"
    | "no_proof"
    | "blocking"
    | "mep_too_late"
    | "ceiling_before_mep"
    | "test_before_install";
  message: string;
  severity: "info" | "warning" | "critical";
}

export function generatePlanningAlerts(tasks: PlanningTask[]): PlanningAlert[] {
  const alerts: PlanningAlert[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  for (const task of tasks) {
    const end = new Date(task.plannedEnd);
    if (
      task.status !== "completed" &&
      end < today &&
      task.progressPct < 100
    ) {
      alerts.push({
        taskId: task.id,
        taskName: task.name,
        type: "late",
        message: `Tâche en retard — échéance ${task.plannedEnd}`,
        severity: "critical",
      });
    }

    if (!task.responsible) {
      alerts.push({
        taskId: task.id,
        taskName: task.name,
        type: "no_owner",
        message: "Aucun responsable assigné",
        severity: "warning",
      });
    }

    if (
      task.predecessors.length === 0 &&
      !task.isMilestone &&
      task.phaseId !== "phase-01"
    ) {
      alerts.push({
        taskId: task.id,
        taskName: task.name,
        type: "no_predecessor",
        message: "Pas de prédécesseur logique défini",
        severity: "info",
      });
    }

    if (task.status === "completed" && !task.hasProof) {
      alerts.push({
        taskId: task.id,
        taskName: task.name,
        type: "no_proof",
        message: "Tâche terminée sans preuve / photo",
        severity: "warning",
      });
    }

    if (task.status === "blocked") {
      alerts.push({
        taskId: task.id,
        taskName: task.name,
        type: "blocking",
        message: "Tâche bloquante pour d'autres lots",
        severity: "critical",
      });
    }

    for (const predId of task.predecessors) {
      const pred = taskMap.get(predId);
      if (pred && pred.status !== "completed" && task.status === "in_progress") {
        alerts.push({
          taskId: task.id,
          taskName: task.name,
          type: "blocking",
          message: `Dépend de « ${pred.name} » non terminée`,
          severity: "warning",
        });
      }
    }
  }

  const ceiling = tasks.find((t) => t.name.toLowerCase().includes("faux plafond"));
  const mepEmbedded = tasks.find((t) =>
    t.name.toLowerCase().includes("réseaux encastrés"),
  );
  if (
    ceiling &&
    mepEmbedded &&
    ceiling.status === "in_progress" &&
    mepEmbedded.progressPct < 100
  ) {
    alerts.push({
      taskId: ceiling.id,
      taskName: ceiling.name,
      type: "ceiling_before_mep",
      message: "Fermeture faux plafond avant validation réseaux encastrés MEP",
      severity: "critical",
    });
  }

  const testTasks = tasks.filter((t) =>
    t.name.toLowerCase().includes("essai"),
  );
  for (const test of testTasks) {
    const install = tasks.find(
      (t) =>
        t.lotCode === test.lotCode &&
        t.name.toLowerCase().includes("installation") &&
        t.progressPct < 80,
    );
    if (install && test.status !== "not_started") {
      alerts.push({
        taskId: test.id,
        taskName: test.name,
        message: `Essai programmé avant fin installation (${install.name})`,
        type: "test_before_install",
        severity: "critical",
      });
    }
  }

  return alerts;
}
