"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  MapPin,
  Users,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import type { Meeting } from "@/types/nassib";
import {
  formatMeetingDate,
  MEETING_CATEGORY_COLORS,
  MEETING_CATEGORY_LABELS,
  type MeetingKpis,
} from "@/lib/meetings/meeting-stats";
import { cn } from "@/lib/utils";

export function MeetingKpiRow({ kpis }: { kpis: MeetingKpis }) {
  const items = [
    {
      label: "Total réunions",
      value: kpis.total,
      icon: ClipboardList,
      iconClass: "text-[#003F72] bg-[#003F72]/10",
    },
    {
      label: "À venir",
      value: kpis.upcoming,
      icon: Clock,
      iconClass: "text-violet-600 bg-violet-100",
    },
    {
      label: "Actions en cours",
      value: kpis.actionsInProgress,
      icon: CheckCircle2,
      iconClass: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Actions en retard",
      value: kpis.actionsOverdue,
      icon: AlertTriangle,
      iconClass: "text-red-600 bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              item.iconClass,
            )}
          >
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: "cards" | "list";
  onChange: (mode: "cards" | "list") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("cards")}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "cards"
            ? "bg-[#003F72] text-white"
            : "text-slate-600 hover:bg-slate-50",
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Vue cartes
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "list"
            ? "bg-[#003F72] text-white"
            : "text-slate-600 hover:bg-slate-50",
        )}
      >
        <List className="h-4 w-4" />
        Vue liste
      </button>
    </div>
  );
}

export function MeetingCard({
  meeting,
  onClick,
}: {
  meeting: Meeting;
  onClick?: () => void;
}) {
  const isPlanned = meeting.status === "planned";
  const actionCount = meeting.actions.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
              MEETING_CATEGORY_COLORS[meeting.category],
            )}
          >
            {MEETING_CATEGORY_LABELS[meeting.category]}
          </span>
          {isPlanned ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              <Clock className="h-3 w-3" />
              Planifiée
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              Terminée
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-400">
          {meeting.reference}
        </span>
      </div>

      <h3 className="mb-3 font-semibold text-slate-900">{meeting.title}</h3>

      <div className="mb-4 space-y-1.5 text-sm text-slate-500">
        <p className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
          {formatMeetingDate(meeting.date)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          {meeting.location}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {meeting.participants.length} participants
        </span>
        {!isPlanned && actionCount > 0 && (
          <span>{actionCount} action{actionCount > 1 ? "s" : ""}</span>
        )}
      </div>
    </button>
  );
}

export function MeetingListRow({
  meeting,
  onClick,
}: {
  meeting: Meeting;
  onClick?: () => void;
}) {
  const isPlanned = meeting.status === "planned";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-slate-100 px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-slate-50"
    >
      <span className="w-14 shrink-0 font-medium text-slate-400">
        {meeting.reference}
      </span>
      <span
        className={cn(
          "hidden w-24 shrink-0 rounded-md px-2 py-0.5 text-center text-xs font-medium sm:inline-block",
          MEETING_CATEGORY_COLORS[meeting.category],
        )}
      >
        {MEETING_CATEGORY_LABELS[meeting.category]}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium text-slate-900">
        {meeting.title}
      </span>
      <span className="hidden shrink-0 text-slate-500 md:inline">
        {formatMeetingDate(meeting.date)}
      </span>
      <span className="hidden shrink-0 text-slate-500 lg:inline">
        {meeting.participants.length} p.
      </span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
          isPlanned
            ? "bg-slate-100 text-slate-600"
            : "bg-emerald-100 text-emerald-800",
        )}
      >
        {isPlanned ? "Planifiée" : "Terminée"}
      </span>
    </button>
  );
}

export function MeetingSection({
  title,
  meetings,
  viewMode,
  onSelect,
}: {
  title: string;
  meetings: Meeting[];
  viewMode: "cards" | "list";
  onSelect: (meeting: Meeting) => void;
}) {
  if (meetings.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      {viewMode === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} onClick={() => onSelect(m)} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {meetings.map((m) => (
            <MeetingListRow
              key={m.id}
              meeting={m}
              onClick={() => onSelect(m)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
