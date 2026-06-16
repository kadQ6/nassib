import type { AppRole } from "@/lib/constants/roles";
import type {
  RESERVE_PRIORITIES,
  RESERVE_STATUSES,
  ROOM_STATUSES,
} from "@/lib/constants/statuses";

export type RoomStatus = (typeof ROOM_STATUSES)[number];
export type ReservePriority = (typeof RESERVE_PRIORITIES)[number];
export type ReserveStatus = (typeof RESERVE_STATUSES)[number];

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: "draft" | "active" | "suspended" | "completed" | "archived";
  plannedStart: string;
  plannedEnd: string;
  contractAmount: number;
  progressPct: number;
}

export interface Lot {
  id: string;
  projectId: string;
  code: string;
  name: string;
  tradeType: string;
  status: string;
  contractor: string;
  progressPct: number;
  contractAmount: number;
  plannedStart: string;
  plannedEnd: string;
}

export interface WbsNode {
  id: string;
  projectId: string;
  parentId: string | null;
  code: string;
  name: string;
  level: number;
  progressPct: number;
  children?: WbsNode[];
}

export interface Task {
  id: string;
  wbsNodeId: string;
  projectId: string;
  lotId?: string;
  name: string;
  status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
  progressPct: number;
  plannedStart: string;
  plannedEnd: string;
  durationDays: number;
  isCritical: boolean;
}

export interface Room {
  id: string;
  projectId: string;
  storey: string;
  department: string;
  code: string;
  name: string;
  roomType: string;
  areaM2: number;
  status: RoomStatus;
  progressPct: number;
  checklistDone: number;
  checklistTotal: number;
  equipmentInstalled: number;
  equipmentPlanned: number;
  reservesOpen: number;
}

export interface Reserve {
  id: string;
  projectId: string;
  roomId?: string;
  lotId?: string;
  title: string;
  description: string;
  status: ReserveStatus;
  priority: ReservePriority;
  locationDetail: string;
  dueDate: string;
  reportedAt: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  name: string;
  category: string;
  version: string;
  lotCode?: string;
  roomCode?: string;
  uploadedAt: string;
}

export interface ProcurementItem {
  id: string;
  projectId: string;
  reference: string;
  description: string;
  supplier: string;
  lotCode: string;
  qtyOrdered: number;
  qtyDelivered: number;
  unit: string;
  status: string;
  expectedDate: string;
}

export interface EquipmentInstance {
  id: string;
  projectId: string;
  assetCode: string;
  name: string;
  manufacturer: string;
  model: string;
  roomCode?: string;
  lotCode: string;
  status: string;
  criticality: "A" | "B" | "C";
  deviceClass: string;
}

export interface TestRun {
  id: string;
  projectId: string;
  protocolName: string;
  lotCode: string;
  roomCode?: string;
  normReference: string;
  status: "planned" | "in_progress" | "passed" | "failed" | "conditional";
  scheduledDate: string;
}

export interface BoqItem {
  id: string;
  projectId: string;
  lotCode: string;
  code: string;
  description: string;
  unit: string;
  qtyContract: number;
  qtyExecuted: number;
  unitPrice: number;
}

export interface Payment {
  id: string;
  projectId: string;
  lotCode: string;
  reference: string;
  periodStart: string;
  periodEnd: string;
  amountHt: number;
  status: string;
}

export interface DashboardKpis {
  projectProgress: number;
  openReserves: number;
  criticalReserves: number;
  delayedTasks: number;
  pendingDeliveries: number;
  equipmentPendingCommissioning: number;
  budgetConsumedPct: number;
  nextMilestone: string;
  nextMilestoneDate: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}
