import type { RoomLevel, ZoneFunction } from "@/types/nassib";
import type { RoomFullNeeds, RoomReceptionStatus, RoomStaffing } from "@/types/room-hub";

export type PlanSheet = "A-01" | "A-02" | "VRD-01";

export type LayoutCategory = "biomedical" | "furniture" | "it" | "technical";

export interface LayoutItem {
  name: string;
  category: LayoutCategory;
  qty: number;
}

export interface PlanRoomDef {
  id: string;
  code: string;
  name: string;
  level: RoomLevel;
  zoneId: string;
  zoneFunction: ZoneFunction;
  areaM2: number;
  planSheet: PlanSheet;
  functionalRole: string;
  clinicalActivity: string;
  department: string;
  lots: string[];
  needs: RoomFullNeeds;
  staffing: RoomStaffing;
  prerequisites: string[];
  receptionStatus: RoomReceptionStatus;
  layout: LayoutItem[];
  /** Avancement chantier simulé (données terrain juin 2026) */
  status: import("@/types/nassib").NassibRoom["status"];
  checklistDone: number;
  checklistTotal: number;
  reservesOpen: number;
}
