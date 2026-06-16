/**
 * Vue exécutive Gantt — regroupement MOA / OPC
 * Alignée sur le planning contractuel Nassib (DJI-FU 05/06/2026)
 */
import { PLANNING_GANTT_META } from "./planning-gantt-2026";

export type GanttExecutiveTask = {
  id: string;
  name: string;
  progressPct: number;
  start: string;
  end: string;
};

export type GanttExecutiveGroup = {
  id: string;
  name: string;
  progressPct: number;
  defaultExpanded?: boolean;
  tasks: GanttExecutiveTask[];
};

export const PLANNING_EXECUTIVE_GROUPS: GanttExecutiveGroup[] = [
  {
    id: "go",
    name: "Gros Œuvre",
    progressPct: 75,
    defaultExpanded: true,
    tasks: [
      {
        id: "go-1",
        name: "Fondations et radier",
        progressPct: 100,
        start: "2025-08-01",
        end: "2025-10-24",
      },
      {
        id: "go-2",
        name: "Structure béton armé",
        progressPct: 100,
        start: "2025-10-25",
        end: "2026-05-07",
      },
      {
        id: "go-3",
        name: "Maçonnerie briques",
        progressPct: 60,
        start: "2026-04-01",
        end: "2026-07-15",
      },
      {
        id: "go-4",
        name: "Enduits et crépis",
        progressPct: 30,
        start: "2026-07-16",
        end: "2026-09-13",
      },
    ],
  },
  {
    id: "so",
    name: "Second Œuvre",
    progressPct: 30,
    defaultExpanded: true,
    tasks: [
      {
        id: "so-1",
        name: "Cloisons et doublages",
        progressPct: 50,
        start: "2026-04-01",
        end: "2026-07-15",
      },
      {
        id: "so-2",
        name: "Menuiseries intérieures",
        progressPct: 20,
        start: "2026-07-17",
        end: "2026-08-30",
      },
      {
        id: "so-3",
        name: "Revêtements sols",
        progressPct: 10,
        start: "2026-07-20",
        end: "2026-09-17",
      },
      {
        id: "so-4",
        name: "Peintures et finitions",
        progressPct: 0,
        start: "2026-07-16",
        end: "2026-09-15",
      },
    ],
  },
  {
    id: "mep",
    name: "Lots MEP (CE-02 / CE-03)",
    progressPct: 18,
    defaultExpanded: false,
    tasks: [
      {
        id: "mep-1",
        name: "Réseaux encastrés & plomberie",
        progressPct: 35,
        start: "2026-05-15",
        end: "2026-10-31",
      },
      {
        id: "mep-2",
        name: "CFO — courant fort",
        progressPct: 38,
        start: "2026-08-01",
        end: "2026-11-05",
      },
      {
        id: "mep-3",
        name: "CVC / ventilation",
        progressPct: 22,
        start: "2026-08-01",
        end: "2026-12-31",
      },
      {
        id: "mep-4",
        name: "CFA / SSI / VDI",
        progressPct: 15,
        start: "2026-09-20",
        end: "2027-01-01",
      },
      {
        id: "mep-5",
        name: "Fluides médicaux",
        progressPct: 12,
        start: "2026-07-01",
        end: "2027-01-15",
      },
    ],
  },
  {
    id: "bio",
    name: "Équipements Biomédicaux",
    progressPct: 5,
    defaultExpanded: false,
    tasks: [
      {
        id: "bio-1",
        name: "Approvisionnement & réception DM",
        progressPct: 8,
        start: "2026-09-01",
        end: "2027-01-15",
      },
      {
        id: "bio-2",
        name: "Installation par locaux",
        progressPct: 5,
        start: "2026-10-01",
        end: "2027-01-31",
      },
    ],
  },
  {
    id: "essais",
    name: "Essais & Réception",
    progressPct: 0,
    defaultExpanded: false,
    tasks: [
      {
        id: "es-1",
        name: "Essais systèmes (CFO, CFA, SSI, CVC, FM)",
        progressPct: 0,
        start: "2026-11-01",
        end: "2027-01-11",
      },
      {
        id: "es-2",
        name: "OPR & réception travaux",
        progressPct: 0,
        start: "2027-01-12",
        end: "2027-01-31",
      },
    ],
  },
];

export const PLANNING_EXECUTIVE_META = {
  title: "Planning Général — Gantt",
  projectName: "Polyclinique Cité Nassib",
  timelineStart: "2024-10-01",
  timelineEnd: "2026-12-31",
  overallProgressPct: PLANNING_GANTT_META.overallProgressPct,
};

/** Corps d'état BOQ (RECAP-01 → RECAP-04) — CE-01 à CE-04 */
export type CorpsEtatProgress = {
  code: string;
  label: string;
  progressPct: number;
  color: string;
};

export function buildCorpsEtatProgress(
  groups: GanttExecutiveGroup[],
): CorpsEtatProgress[] {
  const groupPct = (id: string) =>
    groups.find((g) => g.id === id)?.progressPct ?? 0;
  const taskPct = (groupId: string, taskId: string) =>
    groups
      .find((g) => g.id === groupId)
      ?.tasks.find((t) => t.id === taskId)?.progressPct ?? 0;

  const avg = (...values: number[]) =>
    values.length === 0
      ? 0
      : Math.round(values.reduce((s, v) => s + v, 0) / values.length);

  return [
    {
      code: "CE-01",
      label: "Gros et second œuvre",
      progressPct: avg(groupPct("go"), groupPct("so")),
      color: "#E8914C",
    },
    {
      code: "CE-02",
      label: "Électricité — CFA — SSI",
      progressPct: avg(taskPct("mep", "mep-2"), taskPct("mep", "mep-4")),
      color: "#D4A855",
    },
    {
      code: "CE-03",
      label: "Fluides — climatisations",
      progressPct: avg(taskPct("mep", "mep-3"), taskPct("mep", "mep-5")),
      color: "#67B7D1",
    },
    {
      code: "CE-04",
      label: "Divers",
      progressPct: avg(groupPct("bio"), groupPct("essais")),
      color: "#8B9CB3",
    },
  ];
}

export const PLANNING_CORPS_ETAT_PROGRESS = buildCorpsEtatProgress(
  PLANNING_EXECUTIVE_GROUPS,
);
