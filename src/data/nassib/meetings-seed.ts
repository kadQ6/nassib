import type { Meeting, MeetingAction } from "@/types/nassib";

const PARTICIPANTS_STANDARD = [
  "MOA — FIOG",
  "MOE — K'BIO Conseil",
  "OPC — À désigner",
  "DJI-FU SARL",
  "Bureau de contrôle",
  "Lots MEP (CFO, CVC, fluides)",
  "Architecte",
  "Sécurité chantier",
];

function action(
  id: string,
  description: string,
  responsible: string,
  dueDate: string,
  status: MeetingAction["status"],
): MeetingAction {
  return { id, description, responsible, dueDate, status };
}

function weeklyMeeting(
  num: number,
  date: string,
  status: Meeting["status"],
  actions: MeetingAction[] = [],
): Meeting {
  const ref = `R${String(num).padStart(2, "0")}`;
  return {
    id: `mtg-${ref.toLowerCase()}`,
    reference: ref,
    date,
    title: `Réunion hebdomadaire N°${num}`,
    category: "chantier",
    status,
    location: "Salle de réunion chantier",
    participants: PARTICIPANTS_STANDARD,
    agenda: [
      "Point avancement planning (Gantt)",
      "Réserves ouvertes / critiques",
      "Livraisons prévues semaine",
      "Coordination lots MEP",
    ],
    decisions:
      status === "completed"
        ? ["Validation du planning semaine N+1", "Levée de réserve sous réserve essais"]
        : [],
    blockingPoints:
      status === "completed" ? ["Retard livraison gaines CVC étage R+1"] : [],
    actions,
  };
}

/** Historique réunions chantier Polyclinique Nassib */
export const NASSIB_MEETINGS_SEED: Meeting[] = [
  weeklyMeeting(25, "2026-06-16", "planned"),
  {
    id: "mtg-r-opr",
    reference: "R_OPR",
    date: "2026-06-25",
    title: "Réunion OPR",
    category: "technique",
    status: "planned",
    location: "Salle de réunion chantier",
    participants: PARTICIPANTS_STANDARD,
    agenda: ["Revue plans OPR bloc opératoire", "Points fluides médicaux", "Planning essais"],
    decisions: [],
    blockingPoints: [],
    actions: [],
  },
  {
    id: "mtg-coord-mep-juin",
    reference: "R-CVC",
    date: "2026-06-20",
    title: "Point coordination lots MEP",
    category: "coordination",
    status: "planned",
    location: "Base vie chantier",
    participants: PARTICIPANTS_STANDARD.slice(0, 6),
    agenda: ["Interfaces CVC / plomberie / fluides", "Calendrier percements"],
    decisions: [],
    blockingPoints: [],
    actions: [],
  },
  weeklyMeeting(24, "2026-06-07", "completed", [
    action("a-r24-1", "Transmettre DOE provisoire lot CFO", "DJI-FU", "2026-06-14", "in_progress"),
    action("a-r24-2", "Valider révision ventilateurs plafond", "K'BIO", "2026-06-12", "overdue"),
    action("a-r24-3", "Planifier essai étanchéité réseau O₂", "Lot fluides", "2026-06-20", "in_progress"),
    action("a-r24-4", "Levée réserve porte technique R+1", "GO", "2026-06-10", "done"),
  ]),
  {
    id: "mtg-cvc-fluides",
    reference: "R-CVF",
    date: "2026-06-01",
    title: "Coordination CVC + Fluides",
    category: "coordination",
    status: "completed",
    location: "Salle de réunion chantier",
    participants: PARTICIPANTS_STANDARD.slice(0, 7),
    agenda: ["Passe-câbles bloc", "Arrivées fluides médicaux urgences"],
    decisions: ["Report percement sas stérilisation au 15/06"],
    blockingPoints: ["Attente validation MOA sur tracé réseau O₂"],
    actions: [
      action("a-cvf-1", "Mise à jour plan réseau O₂ RDC", "K'BIO", "2026-06-08", "done"),
      action("a-cvf-2", "Commande vannes zone urgences", "Lot fluides", "2026-06-15", "in_progress"),
    ],
  },
  {
    id: "mtg-moa-archi",
    reference: "R-MOA",
    date: "2026-05-27",
    title: "Visite MOA + Architecte",
    category: "chantier",
    status: "completed",
    location: "Chantier — accueil RDC",
    participants: ["MOA — FIOG", "Architecte", "MOE — K'BIO", "DJI-FU SARL"],
    agenda: ["Visite zones soignées", "Finitions façades", "Planning livraison équipements"],
    decisions: ["Validation teintes sols couloirs administratif"],
    blockingPoints: [],
    actions: [
      action("a-moa-1", "Note de synthèse visite MOA", "K'BIO", "2026-06-03", "done"),
    ],
  },
  weeklyMeeting(23, "2026-05-31", "completed", [
    action("a-r23-1", "CR réserves bloc opératoire", "K'BIO", "2026-06-05", "overdue"),
    action("a-r23-2", "Livraison armoires techniques R+1", "CFO", "2026-06-12", "in_progress"),
  ]),
  weeklyMeeting(22, "2026-05-24", "completed", [
    action("a-r22-1", "Essai pression réseau air médical", "Fluides", "2026-06-01", "done"),
  ]),
  weeklyMeeting(21, "2026-05-17", "completed"),
  weeklyMeeting(20, "2026-05-10", "completed"),
  weeklyMeeting(19, "2026-05-03", "completed"),
  weeklyMeeting(18, "2026-04-26", "completed"),
  weeklyMeeting(17, "2026-04-19", "completed"),
  weeklyMeeting(16, "2026-04-12", "completed"),
  weeklyMeeting(15, "2026-04-05", "completed"),
  weeklyMeeting(14, "2026-03-29", "completed"),
  weeklyMeeting(13, "2026-03-22", "completed"),
  weeklyMeeting(12, "2026-03-15", "completed"),
];
