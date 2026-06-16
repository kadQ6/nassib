import type { Meeting } from "@/types/nassib";

export type MeetingKpis = {
  total: number;
  upcoming: number;
  actionsInProgress: number;
  actionsOverdue: number;
};

export function meetingKpis(
  meetings: Meeting[],
  today = new Date(),
): MeetingKpis {
  const todayStr = today.toISOString().slice(0, 10);
  const allActions = meetings.flatMap((m) => m.actions);

  return {
    total: meetings.length,
    upcoming: meetings.filter(
      (m) => m.status === "planned" && m.date >= todayStr,
    ).length,
    actionsInProgress: allActions.filter((a) =>
      ["open", "in_progress"].includes(a.status),
    ).length,
    actionsOverdue: allActions.filter((a) => a.status === "overdue").length,
  };
}

export function splitMeetingsByTime(
  meetings: Meeting[],
  today = new Date(),
): { upcoming: Meeting[]; past: Meeting[] } {
  const todayStr = today.toISOString().slice(0, 10);
  const upcoming = meetings
    .filter((m) => m.status === "planned" && m.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = meetings
    .filter((m) => m.status === "completed" || m.date < todayStr)
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

export function formatMeetingDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export const MEETING_CATEGORY_LABELS: Record<Meeting["category"], string> = {
  chantier: "Chantier",
  technique: "Technique",
  coordination: "Coordination",
};

export const MEETING_CATEGORY_COLORS: Record<Meeting["category"], string> = {
  chantier: "bg-[#003F72] text-white",
  technique: "bg-amber-100 text-amber-800",
  coordination: "bg-cyan-100 text-cyan-800",
};
