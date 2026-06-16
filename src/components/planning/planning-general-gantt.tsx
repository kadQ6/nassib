"use client";

import { useMemo, useState } from "react";
import {
  CalendarRange,
  ChevronDown,
  ChevronRight,
  Clock,
  Wrench,
} from "lucide-react";
import type {
  GanttExecutiveGroup,
  GanttExecutiveTask,
} from "@/data/nassib/planning-gantt-executive";

const LABEL_WIDTH = 300;
const MONTH_WIDTH = 52;
const ROW_H = 36;
const GROUP_ROW_H = 40;

type MonthCol = { key: string; label: string; start: number; end: number };

function buildMonths(startIso: string, endIso: string): MonthCol[] {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const months: MonthCol[] = [];

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const colStart = cursor.getTime();
    const colEnd = new Date(y, m + 1, 0, 23, 59, 59).getTime();
    months.push({
      key: `${y}-${m}`,
      label: cursor.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      start: colStart,
      end: colEnd,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function barStyle(
  task: GanttExecutiveTask,
  rangeStart: number,
  rangeEnd: number,
): { left: number; width: number } {
  const span = rangeEnd - rangeStart || 1;
  const t0 = new Date(task.start).getTime();
  const t1 = new Date(task.end).getTime();
  const left = ((t0 - rangeStart) / span) * 100;
  const width = ((t1 - t0) / span) * 100;
  return {
    left: Math.max(0, Math.min(left, 100)),
    width: Math.max(Math.min(width, 100 - left), 1.5),
  };
}

function groupSpan(tasks: GanttExecutiveTask[]) {
  const starts = tasks.map((t) => new Date(t.start).getTime());
  const ends = tasks.map((t) => new Date(t.end).getTime());
  return { start: Math.min(...starts), end: Math.max(...ends) };
}

function GroupIcon({ id }: { id: string }) {
  if (id === "bio" || id === "essais") {
    return <CalendarRange className="h-4 w-4 shrink-0 text-[#0891B2]" />;
  }
  if (id === "mep") {
    return <Wrench className="h-4 w-4 shrink-0 text-[#0891B2]" />;
  }
  return <Clock className="h-4 w-4 shrink-0 text-[#0891B2]" />;
}

function TaskBar({
  task,
  rangeStart,
  rangeEnd,
}: {
  task: GanttExecutiveTask;
  rangeStart: number;
  rangeEnd: number;
}) {
  const { left, width } = barStyle(task, rangeStart, rangeEnd);
  const pct = task.progressPct;
  const done = pct >= 100;
  const idle = pct <= 0;

  return (
    <div
      className="absolute top-1/2 h-5 -translate-y-1/2 overflow-hidden rounded-sm"
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      {idle ? (
        <div className="h-full rounded-sm border border-slate-200 bg-slate-100/80" />
      ) : done ? (
        <div className="flex h-full items-center rounded-sm bg-emerald-500 px-1.5 text-[10px] font-semibold text-white">
          {pct}%
        </div>
      ) : (
        <div className="relative h-full rounded-sm bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 flex items-center rounded-sm bg-[#2563EB] px-1.5 text-[10px] font-semibold text-white"
            style={{ width: `${Math.max(pct, 12)}%` }}
          >
            {pct}%
          </div>
        </div>
      )}
    </div>
  );
}

function GroupSummaryBar({
  progressPct,
  start,
  end,
  rangeStart,
  rangeEnd,
}: {
  progressPct: number;
  start: number;
  end: number;
  rangeStart: number;
  rangeEnd: number;
}) {
  const span = rangeEnd - rangeStart || 1;
  const left = ((start - rangeStart) / span) * 100;
  const width = ((end - start) / span) * 100;

  return (
    <div
      className="absolute top-1/2 h-6 -translate-y-1/2 overflow-hidden rounded-md bg-slate-200/90"
      style={{ left: `${left}%`, width: `${Math.max(width, 2)}%` }}
    >
      <div
        className="h-full rounded-md bg-slate-400/90 transition-all"
        style={{ width: `${progressPct}%` }}
      />
    </div>
  );
}

export function PlanningGeneralGantt({
  groups,
  projectName,
  timelineStart,
  timelineEnd,
}: {
  groups: GanttExecutiveGroup[];
  projectName: string;
  timelineStart: string;
  timelineEnd: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.defaultExpanded ?? false])),
  );

  const months = useMemo(
    () => buildMonths(timelineStart, timelineEnd),
    [timelineStart, timelineEnd],
  );
  const rangeStart = new Date(timelineStart).getTime();
  const rangeEnd = new Date(timelineEnd).getTime();
  const timelineWidth = months.length * MONTH_WIDTH;

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-[#003F72]">Planning Général — Gantt</h2>
        <p className="text-sm text-slate-500">{projectName}</p>
      </div>

      <div className="max-h-[min(560px,calc(100vh-16rem))] overflow-auto">
        <div style={{ minWidth: LABEL_WIDTH + timelineWidth }}>
          {/* En-tête mois */}
          <div
            className="grid border-b border-slate-100 bg-slate-50/80"
            style={{ gridTemplateColumns: `${LABEL_WIDTH}px ${timelineWidth}px` }}
          >
            <div className="border-r border-slate-100 px-4 py-2" />
            <div className="flex">
              {months.map((m) => (
                <div
                  key={m.key}
                  className="shrink-0 border-r border-slate-100 px-1 py-2 text-center text-[11px] font-medium capitalize text-slate-500"
                  style={{ width: MONTH_WIDTH }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {groups.map((group) => {
            const isOpen = expanded[group.id];
            const span = groupSpan(group.tasks);

            return (
              <div key={group.id}>
                {/* Ligne phase */}
                <div
                  className="grid border-b border-slate-100 bg-white hover:bg-slate-50/50"
                  style={{
                    gridTemplateColumns: `${LABEL_WIDTH}px ${timelineWidth}px`,
                    minHeight: GROUP_ROW_H,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(group.id)}
                    className="flex items-center gap-2 border-r border-slate-100 px-4 text-left"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                    <GroupIcon id={group.id} />
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {group.name}
                    </span>
                    <span className="ml-auto shrink-0 pr-2 text-sm font-medium text-slate-500">
                      {group.progressPct}%
                    </span>
                  </button>
                  <div className="relative" style={{ width: timelineWidth }}>
                    {months.map((m, i) => (
                      <div
                        key={m.key}
                        className="absolute inset-y-0 border-r border-slate-100/80"
                        style={{ left: i * MONTH_WIDTH, width: MONTH_WIDTH }}
                      />
                    ))}
                    <GroupSummaryBar
                      progressPct={group.progressPct}
                      start={span.start}
                      end={span.end}
                      rangeStart={rangeStart}
                      rangeEnd={rangeEnd}
                    />
                  </div>
                </div>

                {/* Tâches */}
                {isOpen &&
                  group.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="grid border-b border-slate-50 bg-white"
                      style={{
                        gridTemplateColumns: `${LABEL_WIDTH}px ${timelineWidth}px`,
                        minHeight: ROW_H,
                      }}
                    >
                      <div className="flex items-center border-r border-slate-100 pl-11 pr-4">
                        <span className="truncate text-sm text-slate-700">{task.name}</span>
                        <span className="ml-auto shrink-0 pl-2 text-sm text-slate-400">
                          {task.progressPct}%
                        </span>
                      </div>
                      <div className="relative" style={{ width: timelineWidth }}>
                        {months.map((m, i) => (
                          <div
                            key={m.key}
                            className="absolute inset-y-0 border-r border-slate-50"
                            style={{ left: i * MONTH_WIDTH, width: MONTH_WIDTH }}
                          />
                        ))}
                        <TaskBar
                          task={task}
                          rangeStart={rangeStart}
                          rangeEnd={rangeEnd}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
