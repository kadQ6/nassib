"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  TrendingUp,
} from "lucide-react";
import { CorpsEtatProgressChart } from "@/components/planning/corps-etat-progress-chart";
import { Badge } from "@/components/ui/badge";
import {
  buildCorpsEtatCards,
  corpsEtatChartItems,
  corpsEtatKpis,
  type CorpsEtatCard,
  type CorpsEtatTaskItem,
} from "@/lib/nassib/corps-etat-workspace";
import type { NassibRoom, PlanningTask, BoqLine } from "@/types/nassib";
import { formatFdj, cn } from "@/lib/utils";

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

function TaskRow({ task }: { task: CorpsEtatTaskItem }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {task.status === "done" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
      )}
      <span
        className={cn(
          task.status === "done" ? "text-slate-700" : "text-slate-600",
        )}
      >
        {task.label}
        {task.status === "in_progress" && task.progressPct != null && (
          <span className="ml-1 text-slate-400">({task.progressPct}%)</span>
        )}
      </span>
    </li>
  );
}

function CorpsEtatCardItem({
  card,
  expanded,
  onToggle,
}: {
  card: CorpsEtatCard;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tasksDone = card.tasks.filter((t) => t.status === "done").length;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50/80"
      >
        {expanded ? (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">{card.code}</span>
            <span className="text-slate-600">· {card.shortTitle}</span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                card.typeBadgeClass,
              )}
            >
              {card.tradeBadge}
            </span>
            <Badge variant="info">En cours</Badge>
          </div>
          <p className="text-xs text-slate-500">
            {card.contractor} · {formatShortDate(card.dateStart)} →{" "}
            {formatShortDate(card.dateEnd)}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold text-[#003F72]">{formatFdj(card.amountHt)}</p>
            <div className="flex min-w-[140px] flex-1 items-center gap-2 sm:max-w-xs">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#2563EB]"
                  style={{ width: `${card.progressPct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {card.progressPct}%
              </span>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="grid gap-4 border-t border-slate-100 bg-slate-50/50 p-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Locaux concernés ({card.rooms.length})
            </p>
            <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
              {card.rooms.map((r) => (
                <li key={r.code} className="flex items-center gap-2 text-slate-700">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0891B2]" />
                  {r.name}
                </li>
              ))}
              {card.rooms.length === 0 && (
                <li className="text-slate-400">Aucun local rattaché</li>
              )}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Avancement tâches ({tasksDone}/{card.tasks.length})
            </p>
            <ul className="space-y-2">
              {card.tasks.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function CorpsEtatWorkspace({
  rooms,
  tasks,
  boq,
}: {
  rooms: NassibRoom[];
  tasks: PlanningTask[];
  boq: BoqLine[];
}) {
  const cards = useMemo(
    () => buildCorpsEtatCards(rooms, tasks, boq),
    [rooms, tasks, boq],
  );
  const kpis = useMemo(() => corpsEtatKpis(cards), [cards]);
  const chartItems = useMemo(() => corpsEtatChartItems(cards), [cards]);
  const [expanded, setExpanded] = useState<string | null>("CE-02");

  const kpiRow = [
    {
      label: "Total marchés",
      value: formatFdj(kpis.totalHt),
      sub: `${kpis.total} corps d'état`,
      icon: Briefcase,
      iconClass: "bg-[#003F72]/10 text-[#003F72]",
      valueClass: "text-[#003F72]",
    },
    {
      label: "Avancement global",
      value: `${kpis.globalProgress}%`,
      sub: "Moyenne pondérée",
      icon: TrendingUp,
      iconClass: "bg-violet-100 text-violet-600",
      valueClass: "text-violet-600",
    },
    {
      label: "Lots en cours",
      value: `${kpis.active} / ${kpis.total}`,
      sub: "Tous actifs",
      icon: Activity,
      iconClass: "bg-emerald-100 text-emerald-600",
      valueClass: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#003F72]">Corps d&apos;état</h1>
          <p className="mt-1 text-sm text-slate-500">
            Polyclinique Cité Nassib · {kpis.total} corps d&apos;état — DJI FU SARL
          </p>
        </div>
        <Badge variant="info">Juin 2026</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {kpiRow.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                item.iconClass,
              )}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className={cn("text-lg font-bold", item.valueClass)}>{item.value}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-xs text-slate-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_min(340px,32%)]">
        <div className="space-y-3">
          {cards.map((card) => (
            <CorpsEtatCardItem
              key={card.code}
              card={card}
              expanded={expanded === card.code}
              onToggle={() =>
                setExpanded((c) => (c === card.code ? null : card.code))
              }
            />
          ))}
        </div>

        <CorpsEtatProgressChart items={chartItems} className="xl:sticky xl:top-4" />
      </div>
    </div>
  );
}
