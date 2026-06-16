import type { Meeting, PlanningTask } from "@/types/nassib";
import {
  ACTIVE_MEETING_PREPARATION,
  type MeetingPreparationItem,
} from "./preparation-items";

export interface WeeklyMeetingDraft {
  id: string;
  meetingNumber: number;
  meetingDate: string;
  generatedAt: string;
  pastWeekObjectives: string[];
  nextWeekObjectives: string[];
  /** Points à préparer / arbitrer lors de la prochaine réunion */
  preparationItems: MeetingPreparationItem[];
  checklist: {
    id: string;
    label: string;
    checked: boolean;
    category: "planning" | "quality" | "logistics" | "safety";
  }[];
  fields: {
    id: string;
    label: string;
    value: string;
    required: boolean;
  }[];
}

function weekBounds(base = new Date()) {
  const d = new Date(base);
  const day = d.getDay();
  const diffToSaturday = (6 - day + 7) % 7 || 7;
  const saturday = new Date(d);
  saturday.setDate(d.getDate() + diffToSaturday);
  saturday.setHours(8, 0, 0, 0);
  const pastStart = new Date(saturday);
  pastStart.setDate(saturday.getDate() - 7);
  return { saturday, pastStart };
}

function tasksInRange(tasks: PlanningTask[], start: Date, end: Date) {
  return tasks.filter((t) => {
    const ps = new Date(t.plannedStart);
    const pe = new Date(t.plannedEnd);
    return ps <= end && pe >= start;
  });
}

export function generateWeeklyMeetingDraft(
  tasks: PlanningTask[],
  existingMeetings: Meeting[],
  baseDate = new Date(),
): WeeklyMeetingDraft {
  const { saturday, pastStart } = weekBounds(baseDate);
  const pastEnd = new Date(saturday);
  pastEnd.setDate(saturday.getDate() - 1);
  const nextEnd = new Date(saturday);
  nextEnd.setDate(saturday.getDate() + 6);

  const pastTasks = tasksInRange(tasks, pastStart, pastEnd);
  const nextTasks = tasksInRange(tasks, saturday, nextEnd);

  const meetingNumber =
    existingMeetings.filter((m) =>
      m.title.toLowerCase().includes("hebdomadaire"),
    ).length + 1;

  return {
    id: `draft-${saturday.toISOString().slice(0, 10)}`,
    meetingNumber,
    meetingDate: saturday.toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    pastWeekObjectives: pastTasks.slice(0, 8).map(
      (t) => `[${t.lotCode ?? "—"}] ${t.name} — ${t.progressPct}%`,
    ),
    nextWeekObjectives: nextTasks.slice(0, 8).map(
      (t) => `[${t.lotCode ?? "—"}] ${t.name} (${t.plannedStart} → ${t.plannedEnd})`,
    ),
    preparationItems: [...ACTIVE_MEETING_PREPARATION],
    checklist: [
      { id: "c1", label: "Point avancement planning (Gantt)", checked: false, category: "planning" },
      { id: "c2", label: "Réserves ouvertes / critiques", checked: false, category: "quality" },
      { id: "c3", label: "Livraisons prévues semaine", checked: false, category: "logistics" },
      { id: "c4", label: "Essais / réceptions prévus", checked: false, category: "quality" },
      { id: "c5", label: "Sécurité chantier / EPI", checked: false, category: "safety" },
      { id: "c6", label: "Coordination lots MEP", checked: false, category: "planning" },
      { id: "c7", label: "Documents en attente validation MOE", checked: false, category: "quality" },
      { id: "c8", label: "Points MOA / décisions requises", checked: false, category: "planning" },
      {
        id: "c9",
        label: "BOQ ventilateurs plafond — pas de révision zones soignées (cf. éléments à préparer)",
        checked: false,
        category: "planning",
      },
    ],
    fields: [
      { id: "f1", label: "Participants présents", value: "", required: true },
      { id: "f2", label: "Travaux réalisés semaine écoulée", value: "", required: true },
      { id: "f3", label: "Blocages / risques identifiés", value: "", required: false },
      { id: "f4", label: "Décisions prises", value: "", required: true },
      { id: "f5", label: "Actions à suivre (resp. + échéance)", value: "", required: true },
      { id: "f6", label: "Objectifs semaine à venir", value: "", required: true },
    ],
  };
}

export function draftToMeetingCr(
  draft: WeeklyMeetingDraft,
  filled: WeeklyMeetingDraft,
): Meeting {
  const decisions = filled.fields
    .filter((f) => f.id === "f4" && f.value.trim())
    .map((f) => f.value.trim());
  const actionsRaw = filled.fields.find((f) => f.id === "f5")?.value ?? "";
  const actions = actionsRaw
    .split("\n")
    .filter(Boolean)
    .map((line, i) => {
      const [desc, rest] = line.split("—").map((s) => s.trim());
      const due = rest?.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? draft.meetingDate;
      return {
        id: `a-${draft.id}-${i}`,
        description: desc || line,
        responsible: rest?.replace(/\d{4}-\d{2}-\d{2}/, "").trim() || "À assigner",
        dueDate: due,
        status: "in_progress" as const,
      };
    });

  return {
    id: `mtg-${draft.meetingDate}`,
    date: draft.meetingDate,
    reference: `R${String(draft.meetingNumber).padStart(2, "0")}`,
    category: "chantier" as const,
    status: "completed" as const,
    location: "Salle de réunion chantier",
    title: `CR Réunion chantier n°${String(draft.meetingNumber).padStart(2, "0")} du ${draft.meetingDate}`,
    participants: (filled.fields.find((f) => f.id === "f1")?.value ?? "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean),
    agenda: [
      ...draft.preparationItems.map(
        (p) => `À préparer : [${p.title}] ${p.detail}`,
      ),
      ...draft.pastWeekObjectives.map((o) => `Bilan : ${o}`),
      ...draft.nextWeekObjectives.map((o) => `Prévision : ${o}`),
    ],
    decisions,
    blockingPoints: (filled.fields.find((f) => f.id === "f3")?.value ?? "")
      .split("\n")
      .filter(Boolean),
    actions,
  };
}

/** Vendredi 18h → génération automatique du modèle pour le samedi matin */
export function shouldAutoGenerateDraft(now = new Date()): boolean {
  const day = now.getDay();
  const hour = now.getHours();
  return day === 5 && hour >= 18;
}
