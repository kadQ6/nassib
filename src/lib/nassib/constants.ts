import type { WbsPhase } from "@/types/nassib";

export const NASSIB_PROJECT_ID = "proj-nassib-01";

/** Niveaux du bâtiment principal — Polyclinique Nassib (RDC + 1 étage). */
export const NASSIB_BUILDING_LEVELS = ["RDC", "R+1"] as const;

/** Niveaux pilotables incluant VRD / locaux techniques extérieurs. */
export const NASSIB_SITE_LEVELS = [...NASSIB_BUILDING_LEVELS, "exterieur"] as const;

export type NassibBuildingLevel = (typeof NASSIB_BUILDING_LEVELS)[number];
export type NassibSiteLevel = (typeof NASSIB_SITE_LEVELS)[number];

/** Incrémenter pour forcer le rechargement du store en mémoire après reset seed. */
export const NASSIB_STORE_VERSION = "polyclinique-nassib-installation-dm-v5-2026-06";

export const WBS_PHASES: WbsPhase[] = [
  { id: "phase-01", code: "1", name: "Préparation", sortOrder: 1, progressPct: 100, plannedStart: "2025-06-01", plannedEnd: "2025-07-15" },
  { id: "phase-02", code: "2", name: "Terrassement / implantation", sortOrder: 2, progressPct: 100, plannedStart: "2025-07-01", plannedEnd: "2025-08-31" },
  { id: "phase-03", code: "3", name: "Fondations", sortOrder: 3, progressPct: 95, plannedStart: "2025-08-01", plannedEnd: "2025-10-31" },
  { id: "phase-04", code: "4", name: "Structure béton", sortOrder: 4, progressPct: 88, plannedStart: "2025-10-01", plannedEnd: "2026-03-31" },
  { id: "phase-05", code: "5", name: "Étanchéité toiture", sortOrder: 5, progressPct: 72, plannedStart: "2026-02-01", plannedEnd: "2026-05-31" },
  { id: "phase-06", code: "6", name: "Cloisons / maçonnerie intérieure", sortOrder: 6, progressPct: 65, plannedStart: "2026-01-15", plannedEnd: "2026-07-31" },
  { id: "phase-07", code: "7", name: "Réseaux encastrés MEP", sortOrder: 7, progressPct: 42, plannedStart: "2026-04-01", plannedEnd: "2026-09-30" },
  { id: "phase-08", code: "8", name: "CFO — courant fort", sortOrder: 8, progressPct: 38, plannedStart: "2026-05-01", plannedEnd: "2026-10-31" },
  { id: "phase-09", code: "9", name: "CFA — courant faible", sortOrder: 9, progressPct: 25, plannedStart: "2026-06-01", plannedEnd: "2026-11-30" },
  { id: "phase-10", code: "10", name: "SSI", sortOrder: 10, progressPct: 18, plannedStart: "2026-06-15", plannedEnd: "2026-12-15" },
  { id: "phase-11", code: "11", name: "VDI / IP", sortOrder: 11, progressPct: 15, plannedStart: "2026-06-15", plannedEnd: "2026-12-31" },
  { id: "phase-12", code: "12", name: "Plomberie sanitaire", sortOrder: 12, progressPct: 35, plannedStart: "2026-05-15", plannedEnd: "2026-10-31" },
  { id: "phase-13", code: "13", name: "Évacuation / drainage", sortOrder: 13, progressPct: 40, plannedStart: "2026-04-15", plannedEnd: "2026-09-30" },
  { id: "phase-14", code: "14", name: "CVC / climatisation / ventilation", sortOrder: 14, progressPct: 22, plannedStart: "2026-06-01", plannedEnd: "2026-12-31" },
  { id: "phase-15", code: "15", name: "Fluides médicaux", sortOrder: 15, progressPct: 12, plannedStart: "2026-07-01", plannedEnd: "2027-01-15" },
  { id: "phase-16", code: "16", name: "Faux plafonds", sortOrder: 16, progressPct: 8, plannedStart: "2026-09-01", plannedEnd: "2027-01-31" },
  { id: "phase-17", code: "17", name: "Sols / carrelage", sortOrder: 17, progressPct: 5, plannedStart: "2026-10-01", plannedEnd: "2027-02-15" },
  { id: "phase-18", code: "18", name: "Menuiseries", sortOrder: 18, progressPct: 10, plannedStart: "2026-08-01", plannedEnd: "2027-01-31" },
  { id: "phase-19", code: "19", name: "Peinture", sortOrder: 19, progressPct: 0, plannedStart: "2026-11-01", plannedEnd: "2027-02-28" },
  { id: "phase-20", code: "20", name: "Sanitaires", sortOrder: 20, progressPct: 0, plannedStart: "2026-11-15", plannedEnd: "2027-02-28" },
  { id: "phase-21", code: "21", name: "VRD", sortOrder: 21, progressPct: 55, plannedStart: "2025-09-01", plannedEnd: "2026-08-31" },
  { id: "phase-22", code: "22", name: "Équipements techniques", sortOrder: 22, progressPct: 15, plannedStart: "2026-08-01", plannedEnd: "2027-01-31" },
  { id: "phase-23", code: "23", name: "Équipements biomédicaux", sortOrder: 23, progressPct: 8, plannedStart: "2026-09-01", plannedEnd: "2027-01-31" },
  { id: "phase-24", code: "24", name: "Essais par système", sortOrder: 24, progressPct: 0, plannedStart: "2026-12-01", plannedEnd: "2027-01-31" },
  { id: "phase-25", code: "25", name: "OPR", sortOrder: 25, progressPct: 0, plannedStart: "2027-01-01", plannedEnd: "2027-01-20" },
  { id: "phase-26", code: "26", name: "Réception provisoire", sortOrder: 26, progressPct: 0, plannedStart: "2027-01-15", plannedEnd: "2027-01-25" },
  { id: "phase-27", code: "27", name: "Levée des réserves", sortOrder: 27, progressPct: 0, plannedStart: "2027-01-20", plannedEnd: "2027-01-31" },
  { id: "phase-28", code: "28", name: "Mise en exploitation", sortOrder: 28, progressPct: 0, plannedStart: "2027-01-25", plannedEnd: "2027-01-31" },
];

export const ZONE_DEFINITIONS = [
  { id: "zone-admin", code: "Z-ADM", name: "Accueil / Administration", function: "accueil_admin" as const },
  { id: "zone-urg", code: "Z-URG", name: "Urgences", function: "urgences" as const },
  { id: "zone-img", code: "Z-IMG", name: "Imagerie", function: "imagerie" as const },
  { id: "zone-lab", code: "Z-LAB", name: "Laboratoire", function: "laboratoire" as const },
  { id: "zone-cons", code: "Z-CON", name: "Consultations", function: "consultations" as const },
  { id: "zone-gyn", code: "Z-GYN", name: "Gynéco-obstétrique", function: "gyneco_obstetrique" as const },
  { id: "zone-mat", code: "Z-MAT", name: "Maternité — chambres", function: "gyneco_obstetrique" as const },
  { id: "zone-bloc", code: "Z-BLC", name: "Bloc césarienne", function: "bloc_cesarienne" as const },
  { id: "zone-sspi", code: "Z-SSP", name: "SSPI", function: "sspi" as const },
  { id: "zone-ster", code: "Z-STE", name: "Stérilisation", function: "sterilisation" as const },
  { id: "zone-hosp", code: "Z-HOS", name: "Hospitalisation", function: "hospitalisation" as const },
  { id: "zone-neo", code: "Z-NEO", name: "Néonatologie", function: "neonatologie" as const },
  { id: "zone-pharma", code: "Z-PHA", name: "Pharmacie", function: "pharmacie" as const },
  { id: "zone-circ", code: "Z-CIR", name: "Circulations", function: "circulation" as const },
  { id: "zone-vrd", code: "Z-VRD", name: "VRD & locaux techniques (arrière bâtiment)", function: "vrd_exterieur" as const },
];
