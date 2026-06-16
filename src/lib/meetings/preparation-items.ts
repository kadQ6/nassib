export type MeetingPrepCategory = "boq" | "planning" | "technique" | "decision_moa";

export interface MeetingPreparationItem {
  id: string;
  title: string;
  detail: string;
  category: MeetingPrepCategory;
  /** Locaux concernés si applicable */
  scope?: string;
}

/**
 * Points à porter en réunion — complétés / retirés au fil des CR.
 * Source : orientations MOA / MOE — Polyclinique Nassib.
 */
export const ACTIVE_MEETING_PREPARATION: MeetingPreparationItem[] = [
  {
    id: "boq-ventilateurs-plafond",
    title: "BOQ — ne pas réviser pour ventilateurs plafond (locaux soignés)",
    detail:
      "Aucun ventilateur plafond supplémentaire à prévoir dans l'hôpital (chambres, urgences, bloc, soins). " +
      "Ne pas mettre à jour le BOQ contractuel pour ajouter des ventilateurs en zones cliniques. " +
      "Maintien éventuel uniquement en salles d'attente (ATT-01, ATT-R1) et certains bureaux administratifs " +
      "déjà prévus au planning CVC initial — à confirmer avec MOA / MOE avant toute ligne BOQ.",
    category: "boq",
    scope: "ATT-01, ATT-R1, bureaux admin · exclusion zones soignées",
  },
];

export function meetingPrepCategoryLabel(cat: MeetingPrepCategory): string {
  switch (cat) {
    case "boq":
      return "BOQ";
    case "planning":
      return "Planning";
    case "technique":
      return "Technique";
    case "decision_moa":
      return "Décision MOA";
  }
}

export function formatPrepItemForAgenda(item: MeetingPreparationItem): string {
  return `[${meetingPrepCategoryLabel(item.category)}] ${item.title} — ${item.detail}`;
}
