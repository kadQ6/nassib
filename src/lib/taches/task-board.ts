import { PLANNING_EXECUTIVE_GROUPS } from "@/data/nassib/planning-gantt-executive";
import { DEFAULT_COMPANY } from "@/lib/constants/project-roles";
import { ACTION_TASK_ORIGIN_LABELS } from "@/lib/nassib/task-automation";
import type { NassibActionTask } from "@/types/nassib";

export type TaskBoardStatus =
  | "in_progress"
  | "done"
  | "not_started"
  | "overdue";

export type TaskBoardPriority = "low" | "normal" | "high" | "critical";

export type TaskBoardItem = {
  id: string;
  code: string;
  title: string;
  category: string;
  location: string;
  responsible: string;
  dueDate: string;
  progressPct: number;
  status: TaskBoardStatus;
  priority: TaskBoardPriority;
  kind: "chantier" | "action";
  sourceTask?: NassibActionTask;
};

const TODAY = new Date("2026-06-13");

/** 12 tâches chantier pilotées — alignées planning exécutif */
const CHANTIER_TASK_IDS = [
  "go-2",
  "go-3",
  "go-4",
  "so-1",
  "so-2",
  "so-3",
  "mep-1",
  "mep-2",
  "go-1",
  "so-4",
  "es-1",
  "es-2",
] as const;

const ENRICHMENTS: Record<
  string,
  Partial<Pick<TaskBoardItem, "title" | "location" | "priority">>
> = {
  "go-1": { title: "Fondations et radier — gros béton", location: "RDC Global" },
  "go-2": {
    title: "Structure béton armé — voiles et dalles R+1",
    location: "R+1 Global",
    priority: "high",
  },
  "go-3": {
    title: "Maçonnerie briques — enveloppe",
    location: "RDC → R+1",
    priority: "high",
  },
  "go-4": { title: "Enduits et crépis façades", location: "Façades" },
  "so-1": { title: "Cloisons et doublages", location: "Zones soignées" },
  "so-2": { title: "Menuiseries intérieures", location: "Administratif" },
  "so-3": { title: "Revêtements de sols", location: "Consultations" },
  "so-4": { title: "Peintures et finitions", location: "Global" },
  "mep-1": {
    title: "Réseaux encastrés & plomberie",
    location: "R+1",
    priority: "normal",
  },
  "mep-2": {
    title: "CFO — courant fort TGBT",
    location: "Local TGBT",
    priority: "critical",
  },
  "es-1": { title: "Essais systèmes CFO / CVC / FM", location: "Global" },
  "es-2": { title: "OPR & réception travaux", location: "Chantier" },
};

function inferStatus(
  progressPct: number,
  endDate: string,
): TaskBoardStatus {
  if (progressPct >= 100) return "done";
  if (progressPct <= 0 && new Date(endDate) > TODAY) return "not_started";
  if (progressPct > 0 && progressPct < 100) {
    if (new Date(endDate) < TODAY) return "overdue";
    return "in_progress";
  }
  if (new Date(endDate) < TODAY) return "overdue";
  return "not_started";
}

function inferPriority(
  progressPct: number,
  groupName: string,
): TaskBoardPriority {
  if (groupName.includes("MEP") && progressPct < 25) return "critical";
  if (progressPct > 0 && progressPct < 40) return "high";
  return "normal";
}

export function buildChantierTaskBoard(): TaskBoardItem[] {
  const taskById = new Map<string, { task: (typeof PLANNING_EXECUTIVE_GROUPS)[0]["tasks"][0]; groupName: string }>();
  for (const group of PLANNING_EXECUTIVE_GROUPS) {
    for (const task of group.tasks) {
      taskById.set(task.id, { task, groupName: group.name });
    }
  }

  return CHANTIER_TASK_IDS.map((taskId, index) => {
    const found = taskById.get(taskId);
    if (!found) {
      throw new Error(`Missing chantier task: ${taskId}`);
    }
    const { task, groupName } = found;
    const extra = ENRICHMENTS[task.id] ?? {};
    const progressPct = task.progressPct;
    return {
      id: task.id,
      code: `T-${String(index + 1).padStart(3, "0")}`,
      title: extra.title ?? task.name,
      category: groupName.replace("Lots MEP (CE-02 / CE-03)", "CE-03 Fluides"),
      location: extra.location ?? "Chantier global",
      responsible: DEFAULT_COMPANY,
      dueDate: task.end,
      progressPct,
      status: inferStatus(progressPct, task.end),
      priority: extra.priority ?? inferPriority(progressPct, groupName),
      kind: "chantier" as const,
    };
  });
}

export function actionTaskToBoardItem(
  task: NassibActionTask,
  codeIndex: number,
): TaskBoardItem {
  const progressPct =
    task.status === "done"
      ? 100
      : task.status === "in_progress"
        ? 50
        : 0;
  const isOverdue =
    task.status !== "done" &&
    task.status !== "cancelled" &&
    new Date(task.dueDate) < TODAY;

  return {
    id: task.id,
    code: `A-${String(codeIndex).padStart(3, "0")}`,
    title: task.title,
    category: ACTION_TASK_ORIGIN_LABELS[task.origin],
    location: task.roomCode ?? task.lotCode ?? "—",
    responsible: task.responsible,
    dueDate: task.dueDate,
    progressPct,
    status: isOverdue
      ? "overdue"
      : task.status === "done"
        ? "done"
        : task.status === "in_progress"
          ? "in_progress"
          : progressPct === 0
            ? "not_started"
            : "in_progress",
    priority: task.priority,
    kind: "action",
    sourceTask: task,
  };
}

export function buildTaskBoard(actionTasks: NassibActionTask[]): TaskBoardItem[] {
  const chantier = buildChantierTaskBoard();
  const actions = actionTasks
    .filter((t) => t.status !== "cancelled")
    .map((t, i) => actionTaskToBoardItem(t, i + 1));
  return [...chantier, ...actions];
}

export type TaskBoardKpis = {
  total: number;
  inProgress: number;
  overdue: number;
  done: number;
  notStarted: number;
};

export function taskBoardKpis(items: TaskBoardItem[]): TaskBoardKpis {
  return {
    total: items.length,
    inProgress: items.filter((t) => t.status === "in_progress").length,
    overdue: items.filter((t) => t.status === "overdue").length,
    done: items.filter((t) => t.status === "done").length,
    notStarted: items.filter((t) => t.status === "not_started").length,
  };
}

export const TASK_STATUS_LABELS: Record<TaskBoardStatus, string> = {
  in_progress: "En cours",
  done: "Terminé",
  not_started: "Non démarré",
  overdue: "En retard",
};

export const TASK_PRIORITY_LABELS: Record<TaskBoardPriority, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  critical: "Critique",
};

export function formatTaskDueDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function accentColor(
  priority: TaskBoardPriority,
  status: TaskBoardStatus,
): string {
  if (status === "done") return "#22C55E";
  if (status === "overdue") return "#EF4444";
  if (priority === "critical") return "#DC2626";
  if (priority === "high") return "#F97316";
  if (status === "in_progress") return "#2563EB";
  return "#94A3B8";
}
