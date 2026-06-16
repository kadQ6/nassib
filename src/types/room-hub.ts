import type {
  BoqLine,
  MepLot,
  NassibActionTask,
  NassibDocument,
  NassibEquipment,
  NassibProcurement,
  NassibReserve,
  NassibRoom,
  NassibTest,
  PlanningTask,
  Zone,
} from "@/types/nassib";
import type { DerivedWorkPackage, EquipmentImplementationSlot } from "@/types/programme";
import type { RoomTechnicalSheet } from "@/types/room-sheet";

/** Besoins techniques complets par local — unité de pilotage */
export interface RoomFullNeeds {
  cfo: boolean;
  cfa: boolean;
  vdi: boolean;
  medicalGas: boolean;
  o2Outlets: number;
  vacuumOutlets: number;
  medicalAirOutlets: number;
  plumbing: boolean;
  cvc: boolean;
  ventilation: boolean;
  ssi: boolean;
  biomedicalEquipment: boolean;
  medicalFurniture: boolean;
  adminFurniture: boolean;
  itEquipment: boolean;
}

export interface RoomStaffing {
  nurses: number;
  doctors: number;
  aides: number;
  admin: number;
}

export type RoomReceptionStatus =
  | "not_started"
  | "in_progress"
  | "opr_pending"
  | "provisional"
  | "received"
  | "operational";

export type RoomTechnicalPhase =
  | "shell"
  | "rough_in"
  | "mep_embedded"
  | "finishes"
  | "equipment"
  | "testing"
  | "ready_handover"
  | "handover"
  | "occupied";

/** Profil fonctionnel validé — point de départ du dispatching */
export interface RoomProfile {
  functionalRole: string;
  department: string;
  departmentCode: string;
  clinicalActivity: string;
  dispatchRevision: number;
  validatedAt: string;
  staffing: RoomStaffing;
  needs: RoomFullNeeds;
  prerequisites: string[];
  receptionStatus: RoomReceptionStatus;
  planReference: string;
}

/** Toutes les entités rattachées à un local */
export interface RoomCrossLinks {
  tasks: PlanningTask[];
  actionTasks: NassibActionTask[];
  lots: MepLot[];
  boqLines: BoqLine[];
  equipmentBiomedical: NassibEquipment[];
  /** Inventaire complet local — équipements + mobilier (plan implantation) */
  inventory: NassibEquipment[];
  equipmentTechnical: EquipmentImplementationSlot[];
  furniture: EquipmentImplementationSlot[];
  itAssets: EquipmentImplementationSlot[];
  procurement: NassibProcurement[];
  documents: NassibDocument[];
  reserves: NassibReserve[];
  tests: NassibTest[];
  derivedPackages: DerivedWorkPackage[];
}

export interface RoomHubMetrics {
  technicalProgress: number;
  checklistPct: number;
  openReserves: number;
  criticalReserves: number;
  pendingDeliveries: number;
  blockedEquipment: number;
  documentsPending: number;
  tasksTotal: number;
  tasksLate: number;
  testsPending: number;
  boqAmount: number;
}

/** Unité centrale de pilotage — room by room */
export interface RoomHub {
  room: NassibRoom;
  zone: Zone;
  profile: RoomProfile;
  /** Fiche technique complète (surfaces, finitions, MEP…) — modifiable */
  sheet: RoomTechnicalSheet;
  links: RoomCrossLinks;
  metrics: RoomHubMetrics;
}

export interface ProjectBaseline {
  planVersion: string;
  planValidatedAt: string;
  boqVersion: string;
  boqValidatedAt: string;
  planningVersion: string;
  planningValidatedAt: string;
  dispatchVersion: string;
  dispatchValidatedAt: string;
  chantierStartedAt: string;
  roomCount: number;
}

export interface RoomRegistry {
  baseline: ProjectBaseline;
  rooms: RoomHub[];
  totals: {
    rooms: number;
    openReserves: number;
    pendingTests: number;
    equipmentToInstall: number;
    receptionReady: number;
  };
}
