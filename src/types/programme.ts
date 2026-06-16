import type { NassibRoom } from "@/types/nassib";

export type BaselineStatus = "validated" | "locked" | "revision_pending";

export interface ValidatedBaseline {
  projectPhase: "execution";
  chantierStartedAt: string;
  planFinal: {
    version: string;
    validatedAt: string;
    documentRef: string;
    status: BaselineStatus;
  };
  boq: {
    version: string;
    validatedAt: string;
    totalAmount: number;
    lineCount: number;
    status: BaselineStatus;
  };
  dispatch: {
    version: string;
    validatedAt: string;
    roomCount: number;
    status: BaselineStatus;
  };
  equipmentSchema: {
    version: string;
    validatedAt: string;
    slotCount: number;
    status: BaselineStatus;
  };
}

export interface RoomStaffing {
  nurses: number;
  doctors: number;
  aides: number;
  admin: number;
}

export interface GasOutletsPlan {
  o2: number;
  vacuum: number;
  medicalAir: number;
}

export type RoomTechnicalNeeds = NassibRoom["needs"] & {
  vdi: boolean;
  biomedicalEquipment: boolean;
};

export interface RoomDispatch {
  roomCode: string;
  roomId: string;
  assignedRole: string;
  clinicalActivity: string;
  dispatchRevision: number;
  validatedAt: string;
  staffing: RoomStaffing;
  needs: RoomTechnicalNeeds;
  gasOutlets: GasOutletsPlan;
}

export type EquipmentSlotCategory =
  | "biomedical"
  | "furniture"
  | "it"
  | "technical";

export type InstallPhase =
  | "rough_in"
  | "mep_embedded"
  | "finishes"
  | "commissioning";

export interface EquipmentImplementationSlot {
  id: string;
  roomCode: string;
  category: EquipmentSlotCategory;
  name: string;
  qty: number;
  linkedEquipmentId?: string;
  installPhase: InstallPhase;
  dependencies: string[];
}

export type DerivedPackageType =
  | "mep_deployment"
  | "equipment_install"
  | "gas_production"
  | "procurement"
  | "testing"
  | "logistics"
  | "coordination";

export interface DerivedWorkPackage {
  id: string;
  type: DerivedPackageType;
  sourceRoomCode?: string;
  sourceEquipmentId?: string;
  lotCode: string;
  title: string;
  description: string;
  plannedStart: string;
  plannedEnd: string;
  status: "pending" | "in_progress" | "blocked" | "done";
  priority: "normal" | "high" | "critical";
  links: { module: string; href: string };
}

export interface ProgrammeRevision {
  id: string;
  date: string;
  scope: "dispatch" | "equipment" | "boq" | "plan";
  roomCode?: string;
  description: string;
  impact: string;
  status: "proposed" | "approved" | "rejected";
}

export interface ProgrammeDerivationSummary {
  totalPackages: number;
  mepTasks: number;
  equipmentInstalls: number;
  procurements: number;
  logistics: number;
  tests: number;
  gasOutletsRequired: GasOutletsPlan;
  o2ProductionSteps: number;
  openRevisions: number;
  roomsWithPendingInstall: number;
}

export interface ProgrammeDerivation {
  generatedAt: string;
  baselineVersion: string;
  packages: DerivedWorkPackage[];
  summary: ProgrammeDerivationSummary;
  revisions: ProgrammeRevision[];
}

export interface ProgrammeContext {
  baseline: ValidatedBaseline;
  dispatches: RoomDispatch[];
  equipmentSlots: EquipmentImplementationSlot[];
  derivation: ProgrammeDerivation;
}
