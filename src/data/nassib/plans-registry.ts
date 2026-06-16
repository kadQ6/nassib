import { BOQ_META } from "@/data/nassib/boq-polyclinique";
import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import { PLAN_METADATA } from "@/data/nassib/plan-layouts";
import {
  NASSIB_BUILDING_LEVELS,
  type NassibBuildingLevel,
} from "@/lib/nassib/constants";

export type PlanDocumentStatus = "validated" | "in_progress";

export type PlanDocumentType = "architectural" | "implantation";

export type PlanLevel = NassibBuildingLevel;

/** Codes locaux liés à chaque planche — partition du catalogue PLAN_ROOM_CATALOG (hors VRD). */
const PLAN_ROOM_CODES: Record<string, readonly string[]> = {
  "pl-rdc-urg": [
    "BOX-01",
    "BOX-02",
    "BOX-03",
    "BOX-04",
    "DECH-01",
    "PCH-01",
    "INF-URG",
    "MLAB-01",
    "BUR-URG1",
    "BUR-URG2",
  ],
  "pl-rdc-urg-sup": ["STK-URG", "VES-H", "VES-F"],
  "pl-rdc-sas": ["SAS-URG"],
  "pl-rdc-img": ["SAS-IMG", "IMG-01"],
  "pl-rdc-cs": [
    "ACC-01",
    "ADM-01",
    "CAI-01",
    "ATT-01",
    "BCS-01",
    "BCS-02",
    "BCS-03",
    "BCS-04",
    "DEN-01",
    "LAB-01",
    "PHA-01",
  ],
  "pl-rdc-gyn": ["BGYN-01", "BGYN-02"],
  "pl-rdc-mat-trv": [
    "PRE-01",
    "PRE-02",
    "PRE-03",
    "TRV-01",
    "TRV-02",
    "TRV-03",
    "INF-MAT",
  ],
  "pl-rdc-bloc": ["BLC-01", "SAS-BLC", "REV-01", "STE-01"],
  "pl-rdc-mat-bur": ["BMAT-01", "BMAT-02", "MAG-01"],
  "pl-mat-ch": [
    "MAT-01",
    "MAT-02",
    "MAT-03",
    "MAT-04",
    "MAT-05",
    "MAT-06",
    "MAT-07",
    "MAT-08",
    "MAT-09",
    "MAT-10",
    "MAT-11",
    "MAT-12",
    "MAT-13",
    "MAT-14",
    "BIB-01",
  ],
  "pl-r1-mat-adm": [
    "ACC-R1",
    "ATT-R1",
    "ADM-R1",
    "BUR-R1-1",
    "BUR-R1-2",
    "BUR-R1-3",
    "BUR-R1-4",
    "BUR-R1-5",
  ],
  "pl-r1-hos": [
    "HOS-01",
    "HOS-02",
    "HOS-03",
    "HOS-04",
    "HOS-05",
    "HOS-06",
    "HOS-07",
    "HDJ-01",
    "INF-R1",
  ],
};

type PlanEntryDef = {
  id: string;
  reference: string;
  title: string;
  /** Niveau principal affiché sur la carte */
  level: PlanLevel;
  /** Niveaux couverts (filtres) — ex. chambres maternité RDC + R+1 */
  levels: readonly PlanLevel[];
  docType: PlanDocumentType;
  version: string;
  revisionDate: string;
  status: PlanDocumentStatus;
  sourceFile: string;
  downloadFile?: string;
  sourceSheet: string;
};

const REVISION = BOQ_META.validatedAt;

const ENTRIES: PlanEntryDef[] = [
  {
    id: "pl-rdc-urg",
    reference: "PL-RDC-URG",
    title:
      "Plan RDC — Urgences (Box 1-4, Déchocage, Petit Chir, Infirmerie, Labo, Bureaux)",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-URGENCES-BOXES.png",
    sourceSheet: "URGENCES-BOXES",
  },
  {
    id: "pl-rdc-urg-sup",
    reference: "PL-RDC-URG-SUP",
    title: "Plan RDC — Urgences (Support, stock, vestiaires)",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-URGENCES-SUPPORT.png",
    sourceSheet: "URGENCES-SUPPORT",
  },
  {
    id: "pl-rdc-sas",
    reference: "PL-RDC-SAS",
    title: "Plan RDC — Sas accueil urgences",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-SAS-URG.png",
    sourceSheet: "SAS-URG",
  },
  {
    id: "pl-rdc-img",
    reference: "PL-RDC-IMG",
    title: "Plan RDC — Imagerie médicale (radiologie, sas patient)",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-IMAGERIE.png",
    sourceSheet: "IMAGERIE",
  },
  {
    id: "pl-rdc-cs",
    reference: "PL-RDC-CS",
    title: "Plan RDC — Consultations (support, attente, dentaire, labo, pharmacie)",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "in_progress",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-CONSULTATIONS-SUPPORT.png",
    sourceSheet: "CONSULTATIONS-SUPPORT",
  },
  {
    id: "pl-rdc-gyn",
    reference: "PL-RDC-GYN",
    title: "Plan RDC — Consultations GYN + bureaux",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-CONSULTATIONS-CS-GYN.png",
    sourceSheet: "CONSULTATIONS-CS-GYN",
  },
  {
    id: "pl-rdc-mat-trv",
    reference: "PL-RDC-MAT-TRV",
    title: "Plan RDC — Maternité (pré-travail, salles travail, infirmerie)",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "in_progress",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-MATERNITE-TRAVAIL.png",
    sourceSheet: "MATERNITE-TRAVAIL",
  },
  {
    id: "pl-rdc-bloc",
    reference: "PL-RDC-BLOC",
    title: "Plan RDC — Bloc césarienne, réveil & stérilisation",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-BLOC-REVEIL.png",
    sourceSheet: "BLOC-REVEIL",
  },
  {
    id: "pl-rdc-mat-bur",
    reference: "PL-RDC-MAT-BUR",
    title: "Plan RDC — Bureaux maternité & magasin",
    level: "RDC",
    levels: ["RDC"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "in_progress",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-BUREAU-MAT.png",
    sourceSheet: "BUREAU-MAT",
  },
  {
    id: "pl-mat-ch",
    reference: "PL-MAT-CH",
    title: "Plan maternité — Chambres (RDC 1-8, R+1 9-14) & biberonnerie",
    level: "R+1",
    levels: ["RDC", "R+1"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "in_progress",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-MATERNITE-CHAMBRES-A.png",
    sourceSheet: "MATERNITE-CHAMBRES-A",
  },
  {
    id: "pl-r1-mat-adm",
    reference: "PL-R+1-MAT-ADM",
    title: "Plan R+1 — Maternité admin & attente",
    level: "R+1",
    levels: ["R+1"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-MATERNITE-ADMIN-R1.png",
    sourceSheet: "MATERNITE-ADMIN-R1",
  },
  {
    id: "pl-r1-hos",
    reference: "PL-R+1-HOS",
    title: "Plan R+1 — Hospitalisation médicale & HDJ",
    level: "R+1",
    levels: ["R+1"],
    docType: "architectural",
    version: "vA",
    revisionDate: REVISION,
    status: "validated",
    sourceFile: "/plans/_sources/KBIO-DJI-SRC-HOSPITALISATION-R1.png",
    sourceSheet: "HOSPITALISATION-R1",
    downloadFile: PLAN_METADATA.r1Pdf,
  },
];

const catalogByCode = new Map(
  PLAN_ROOM_CATALOG.map((room) => [room.code, room]),
);

function resolveLinkedRooms(planId: string) {
  const codes = PLAN_ROOM_CODES[planId] ?? [];
  return codes
    .map((code) => catalogByCode.get(code))
    .filter((room): room is NonNullable<typeof room> => room != null);
}

export type PlanDocumentView = PlanEntryDef & {
  linkedRoomCodes: string[];
  linkedRoomsCount: number;
};

export function buildPlanDocuments(): PlanDocumentView[] {
  return ENTRIES.map((entry) => {
    const linked = resolveLinkedRooms(entry.id);
    return {
      ...entry,
      linkedRoomCodes: linked.map((r) => r.code),
      linkedRoomsCount: linked.length,
    };
  });
}

/** Locaux du bâtiment (RDC + R+1) — hors VRD extérieur. */
export function countBuildingRooms() {
  return PLAN_ROOM_CATALOG.filter((r) => r.level !== "exterieur").length;
}

/** Vérifie que tous les locaux bâtiment sont rattachés à une planche. */
export function verifyPlansRoomCoverage() {
  const assigned = new Set<string>();
  for (const entry of ENTRIES) {
    for (const code of PLAN_ROOM_CODES[entry.id] ?? []) {
      assigned.add(code);
    }
  }
  const buildingRooms = PLAN_ROOM_CATALOG.filter((r) => r.level !== "exterieur");
  const missing = buildingRooms.filter((r) => !assigned.has(r.code));
  const unknown = [...assigned].filter((code) => !catalogByCode.has(code));
  return { missing, unknown, assignedCount: assigned.size };
}

export type PlansBoardKpis = {
  total: number;
  validated: number;
  inProgress: number;
  lastRevision: string;
  buildingRooms: number;
  linkedRooms: number;
};

export function plansBoardKpis(plans: PlanDocumentView[]): PlansBoardKpis {
  const linkedRooms = new Set(plans.flatMap((p) => p.linkedRoomCodes)).size;
  return {
    total: plans.length,
    validated: plans.filter((p) => p.status === "validated").length,
    inProgress: plans.filter((p) => p.status === "in_progress").length,
    lastRevision: REVISION,
    buildingRooms: countBuildingRooms(),
    linkedRooms,
  };
}

export function formatPlanRevisionDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function planMatchesLevel(
  plan: PlanDocumentView,
  level: PlanLevel | "all",
) {
  if (level === "all") return true;
  return plan.levels.includes(level);
}

export const PLANS_BOARD_META = {
  enterprise: BOQ_META.emitter,
  project: PLAN_METADATA.project,
  subtitle: "Données réelles extraites des plans de masse",
  buildingLevels: NASSIB_BUILDING_LEVELS,
};

export { NASSIB_BUILDING_LEVELS };
