import type {
  BoqLine,
  DailyReport,
  MepLot,
  MedicalGasNetwork,
  Meeting,
  NassibDocument,
  NassibEquipment,
  NassibProcurement,
  NassibProject,
  NassibReserve,
  NassibTest,
  Risk,
  SiteEvent,
} from "@/types/nassib";
import { NASSIB_PROJECT_ID } from "./constants";
import { DEFAULT_COMPANY } from "@/lib/constants/project-roles";
import { POLYCLINIQUE_BOQ } from "@/data/nassib/boq-polyclinique";
import { NASSIB_MEETINGS_SEED } from "@/data/nassib/meetings-seed";

/** Entreprise titulaire du marché (source BOQ contractuel). */
const CONTRACTOR = "DJI-FU SARL";

function mepLot(
  id: string,
  code: string,
  name: string,
  trade: MepLot["trade"],
  zones: string[],
  company = CONTRACTOR,
): MepLot {
  return {
    id,
    projectId: NASSIB_PROJECT_ID,
    code,
    name,
    trade,
    company,
    responsible: "À renseigner",
    progressPct: 0,
    documentsValidated: 0,
    documentsTotal: 0,
    zonesImpacted: zones,
    reservesOpen: 0,
    intermediateTestsDone: 0,
    intermediateTestsTotal: 0,
    finalTestsDone: 0,
    finalTestsTotal: 0,
    doeStatus: "missing",
    receptionPvStatus: "none",
  };
}

export const NASSIB_PROJECT: NassibProject = {
  id: NASSIB_PROJECT_ID,
  name: "Polyclinique Nassib",
  code: "NASSIB-POLY-2025",
  location: "Djibouti",
  client: "Fondation Ismail Omar Guelleh (FIOG)",
  status: "active",
  contractAmount: 644_801_997,
  budgetConsumed: 0,
  progressPlanned: 45,
  progressActual: 45,
  schedule: {
    contractStart: "2025-06-01",
    contractEnd: "2027-01-31",
    realisticEnd: "2027-01-31",
    internalTargetEnd: "2027-01-31",
    forecastEnd: "2027-01-31",
    marginDays: 0,
    riskLevel: "high",
  },
};

/** Lots alignés sur le BOQ contractuel — sans données d'avancement inventées. */
export const NASSIB_MEP_LOTS: MepLot[] = [
  mepLot("lot-go", "LOT-GO", "Gros et second œuvre", "GO", ["Z-ADM", "Z-URG", "Z-BLC", "Z-VRD"]),
  mepLot("lot-cfo", "LOT-CFO", "Courant fort", "CFO", ["Z-ADM", "Z-URG", "Z-BLC", "Z-VRD"]),
  mepLot("lot-cfa", "LOT-CFA", "Courant faible / VDI", "CFA", ["Z-ADM", "Z-URG", "Z-IMG"]),
  mepLot("lot-ssi", "LOT-SSI", "Sécurité incendie", "SSI", ["Z-URG", "Z-BLC", "Z-CIR"]),
  mepLot("lot-cctv", "LOT-CCTV", "Vidéosurveillance", "CCTV", ["Z-ADM", "Z-URG"]),
  mepLot("lot-plomb", "LOT-PLOMB", "Plomberie sanitaire", "PLOMB", ["Z-URG", "Z-BLC", "Z-GYN", "Z-STE"]),
  mepLot("lot-cvc", "LOT-CVC", "CVC / ventilation", "CVC", ["Z-URG", "Z-BLC", "Z-IMG", "Z-VRD"]),
  mepLot("lot-fluides", "LOT-FLUIDES", "Fluides médicaux", "FLUIDES", ["Z-URG", "Z-BLC", "Z-GYN", "Z-VRD"]),
  mepLot("lot-vrd", "LOT-VRD", "VRD & locaux techniques", "VRD", ["Z-VRD"]),
  mepLot("lot-divers", "LOT-DIVERS", "Divers / VRD finitions", "GO", ["Z-VRD"]),
  mepLot("lot-bio", "LOT-BIO", "Équipements biomédicaux", "BIOMEDICAL", ["Z-BLC", "Z-STE", "Z-IMG"], DEFAULT_COMPANY),
];

const GAS_CHECKLIST: MedicalGasNetwork["checklist"] = {
  plan_validated: false,
  reservations_validated: false,
  network_installed: false,
  brazing_done: false,
  pressure_test: false,
  leak_test: false,
  labeling_done: false,
  outlets_installed: false,
  gas_analysis: false,
  pv_signed: false,
  doe_delivered: false,
};

export const NASSIB_MEDICAL_GAS: MedicalGasNetwork[] = [
  {
    id: "mg-o2",
    type: "O2",
    source: "Unité de production d'oxygène — TEC-01",
    technicalRoom: "TEC-01",
    outletsPlanned: 46,
    outletsInstalled: 0,
    progressPct: 0,
    checklist: { ...GAS_CHECKLIST },
  },
  {
    id: "mg-vac",
    type: "vacuum",
    source: "Réseau de vide médical",
    technicalRoom: "TEC-01",
    outletsPlanned: 46,
    outletsInstalled: 0,
    progressPct: 0,
    checklist: { ...GAS_CHECKLIST },
  },
  {
    id: "mg-air",
    type: "medical_air",
    source: "Réseau d'air comprimé médical",
    technicalRoom: "TEC-01",
    outletsPlanned: 46,
    outletsInstalled: 0,
    progressPct: 0,
    checklist: { ...GAS_CHECKLIST },
  },
];

/** Équipements générés depuis les croquis — voir buildEquipmentFromPlan() */
export const NASSIB_EQUIPMENT: NassibEquipment[] = [];

export const NASSIB_PROCUREMENT: NassibProcurement[] = [];

/** Réserves saisies en chantier — aucune donnée pré-remplie. */
export const NASSIB_RESERVES: NassibReserve[] = [];

/** Documents sources contractuels et plans — sans inventaire fictif. */
export const NASSIB_DOCUMENTS: NassibDocument[] = [
  {
    id: "doc-1",
    name: "Plan RDC — Polyclinique Nassib",
    docType: "Plans architecte",
    version: "A-01",
    date: "2026-04-26",
    emitter: "DJI-FU SARL / MOE",
    validationStatus: "approved",
    isObsolete: false,
  },
  {
    id: "doc-1b",
    name: "Plan R+1 — Polyclinique Nassib",
    docType: "Plans architecte",
    version: "A-02",
    date: "2026-04-26",
    emitter: "DJI-FU SARL / MOE",
    validationStatus: "approved",
    isObsolete: false,
  },
  {
    id: "doc-1c",
    name: "Schémas implantation équipements",
    docType: "Plans implantation",
    version: "180526",
    date: "2026-05-18",
    emitter: "MOE implantation",
    validationStatus: "approved",
    isObsolete: false,
  },
  {
    id: "doc-boq",
    name: "BOQ contractuel polyclinique",
    docType: "BOQ",
    version: "2024-10-27",
    date: "2024-10-27",
    emitter: "DJI-FU SARL",
    validationStatus: "approved",
    isObsolete: false,
  },
  {
    id: "doc-gantt",
    name: "Planning général des travaux",
    docType: "Planning",
    version: "2026-06-05",
    date: "2026-06-05",
    emitter: "MOE / OPC",
    validationStatus: "approved",
    isObsolete: false,
  },
];

export const NASSIB_BOQ: BoqLine[] = POLYCLINIQUE_BOQ;

export const NASSIB_TESTS: NassibTest[] = [];

export const NASSIB_MEETINGS: Meeting[] = NASSIB_MEETINGS_SEED;

export const NASSIB_DAILY_REPORTS: DailyReport[] = [];

export const NASSIB_RISKS: Risk[] = [];

export const NASSIB_EVENTS: SiteEvent[] = [];
