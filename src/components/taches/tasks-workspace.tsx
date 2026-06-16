"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import {
  refreshActionTasksAction,
} from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  accentColor,
  buildChantierTaskBoard,
  formatTaskDueDate,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  taskBoardKpis,
  type TaskBoardItem,
  type TaskBoardStatus,
} from "@/lib/taches/task-board";
import type { NassibActionTask } from "@/types/nassib";
import { cn } from "@/lib/utils";

type StatusTab = TaskBoardStatus | "all";

const STATUS_TABS: { id: StatusTab; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "in_progress", label: "En cours" },
  { id: "overdue", label: "En retard" },
  { id: "done", label: "Terminé" },
  { id: "not_started", label: "Non démarré" },
];

const PRIORITY_BADGE: Record<TaskBoardItem["priority"], string> = {
  low: "bg-slate-100 text-slate-600",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const STATUS_BADGE: Record<TaskBoardStatus, string> = {
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-emerald-100 text-emerald-800",
  not_started: "bg-slate-100 text-slate-600",
  overdue: "bg-red-100 text-red-800",
};

function TaskCard({ task }: { task: TaskBoardItem }) {
  const accent = accentColor(task.priority, task.status);

  return (
    <article
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {task.code}
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              PRIORITY_BADGE[task.priority],
            )}
          >
            {TASK_PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            STATUS_BADGE[task.status],
          )}
        >
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>

      <h3 className="mb-3 font-semibold leading-snug text-slate-900">
        {task.title}
      </h3>

      <ul className="mb-4 space-y-1.5 text-sm text-slate-500">
        <li className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          {task.category}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {task.location}
        </li>
        <li className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 shrink-0" />
          {task.responsible}
        </li>
        <li className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          Fin prévue : {formatTaskDueDate(task.dueDate)}
        </li>
      </ul>

      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-slate-600">Avancement</span>
          <span className="font-semibold text-slate-800">{task.progressPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${task.progressPct}%`, backgroundColor: accent }}
          />
        </div>
      </div>
    </article>
  );
}

export function TasksWorkspace({
  actionTasks: _actionTasks,
}: {
  actionTasks: NassibActionTask[];
  kpis?: unknown;
  roomCodeToId?: Record<string, string>;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [pending, startTransition] = useTransition();

  const allItems = useMemo(() => buildChantierTaskBoard(), []);
  const kpis = useMemo(() => taskBoardKpis(allItems), [allItems]);

  const categories = useMemo(
    () => [...new Set(allItems.map((t) => t.category))].sort(),
    [allItems],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allItems.filter((t) => {
      if (statusTab !== "all" && t.status !== statusTab) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.responsible.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      );
    });
  }, [allItems, search, categoryFilter, statusTab]);

  function handleRefresh() {
    startTransition(async () => {
      await refreshActionTasksAction();
      window.location.reload();
    });
  }

  const kpiCards = [
    {
      label: "Total tâches",
      value: kpis.total,
      icon: ClipboardList,
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      label: "En cours",
      value: kpis.inProgress,
      icon: Clock,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "En retard",
      value: kpis.overdue,
      icon: AlertTriangle,
      iconClass: "bg-red-100 text-red-600",
    },
    {
      label: "Terminées",
      value: kpis.done,
      icon: CheckCircle2,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#003F72]">
          Tâches — Suivi des actions chantier
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Polyclinique Cité Nassib — Avancement par tâche et responsable
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                k.iconClass,
              )}
            >
              <k.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{k.value}</p>
              <p className="text-sm text-slate-500">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-slate-200">
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? kpis.total
                : kpis[
                    tab.id === "in_progress"
                      ? "inProgress"
                      : tab.id === "not_started"
                        ? "notStarted"
                        : tab.id
                  ];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={cn(
                  "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                  statusTab === tab.id
                    ? "border-[#003F72] text-[#003F72]"
                    : "border-transparent text-slate-500 hover:text-slate-700",
                )}
              >
                {tab.label}{" "}
                <span className="text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Rechercher tâche, code, responsable…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md flex-1"
        />
        <select
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Toutes</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length} tâche{filtered.length > 1 ? "s" : ""} affichée
          {filtered.length > 1 ? "s" : ""}
        </span>
        <Button variant="outline" size="sm" disabled={pending} onClick={handleRefresh}>
          Sync actions
        </Button>
        <Link href="/planning">
          <Button variant="outline" size="sm">
            Planning →
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">
          Aucune tâche pour ce filtre.
        </p>
      )}
    </div>
  );
}
