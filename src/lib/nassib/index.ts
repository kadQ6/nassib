import { PLAN_ROOM_CATALOG, getProjectMedicalGasTotals } from "@/data/nassib/plan-catalog";
import {
  computeDashboardMetrics,
  syncMepLotsFromPlanning,
} from "@/lib/calculations/dashboard-metrics";
import { buildProgrammeContext } from "@/lib/programme";
import { buildAllRoomSheets, generateRoomSheet } from "@/lib/room-sheet/generator";
import { mergeRoomSheet } from "@/lib/room-sheet/merge";
import { buildRoomRegistry } from "@/lib/room-hub";
import type { BoqLine, NassibActionTask, NassibBundle, NassibCommissioningLine, NassibLogisticsLine, NassibProcurement, NassibReserve, NassibTest } from "@/types/nassib";
import type { CommissioningPhaseId, CommissioningPhaseStatus } from "@/types/nassib";
import type { RoomSheetPatch, RoomTechnicalSheet } from "@/types/room-sheet";
import type { CreateReserveInput } from "@/lib/validations/reserve.schema";
import { DEFAULT_COMPANY, ROLE_LOGISTIQUE } from "@/lib/constants/project-roles";
import { buildEquipmentFromPlan } from "./build-equipment-from-plan";
import { buildProcurementFromProject } from "./build-procurement-from-project";
import { buildLogisticsFromProject } from "./build-logistics-from-project";
import {
  buildCommissioningFromProject,
  equipmentStatusFromCommissioning,
  mergeCommissioningLines,
  computeCommissioningProgress,
  computeOverallStatus,
} from "./build-commissioning-from-project";
import {
  equipmentStatusToLogisticsStatus,
  isProcurementValidatedForLogistics,
  logisticsStatusFromProcurement,
  logisticsStatusToFlowStep,
} from "./logistics-internal";
import {
  equipmentStatusToProcurementStatus,
  procurementStatusToOddStep,
} from "./procurement-odd";
import { PLANNING_GANTT_PHASES, PLANNING_GANTT_TASKS } from "@/data/nassib/planning-gantt-2026";
import {
  NASSIB_BOQ,
  NASSIB_DAILY_REPORTS,
  NASSIB_DOCUMENTS,
  NASSIB_EVENTS,
  NASSIB_MEDICAL_GAS,
  NASSIB_MEETINGS,
  NASSIB_MEP_LOTS,
  NASSIB_PROJECT,
  NASSIB_RESERVES,
  NASSIB_RISKS,
  NASSIB_TESTS,
} from "./entities";
import { NASSIB_ROOMS, NASSIB_ZONES } from "./rooms";
import { NASSIB_STORE_VERSION } from "./constants";
import {
  buildActionTasksFromProject,
  syncActionTasks,
} from "./task-automation";
import { buildTestsFromProject } from "./build-tests-from-project";
import { computeMedicalGasProgress } from "./medical-gas-workflow";
import { enrichPlanningTasks } from "./enrich-planning-tasks";

const MEMBERS = [
  { id: "m-1", name: "Kader OMAR", email: "kader@kbio-conseil.com", role: "project_manager" as const, company: DEFAULT_COMPANY },
  { id: "m-2", name: "Fabrice HAKITIMANA", email: "fabrice@kbio-conseil.com", role: "biomedical" as const, company: DEFAULT_COMPANY },
  { id: "m-3", name: "Dr. Nassib", email: "direction@polyclinique-nassib.dj", role: "maitre_ouvrage" as const, company: "Polyclinique Nassib" },
  { id: "m-4", name: "Ahmed OPC", email: "opc@kbio-conseil.com", role: "opc" as const, company: DEFAULT_COMPANY },
];

function enrichRooms(rooms: NassibBundle["rooms"]) {
  rooms.forEach((room) => {
    const checklistPct =
      room.checklistTotal > 0
        ? (room.checklistDone / room.checklistTotal) * 100
        : 0;
    room.progressPct = Math.round(
      checklistPct * 0.6 +
        (room.status === "handover"
          ? 40
          : room.status === "testing"
            ? 30
            : room.status === "equipment"
              ? 20
              : 10),
    );
  });
}

function buildDashboard(state: NassibBundle): NassibBundle["dashboard"] {
  syncMepLotsFromPlanning(state);
  return computeDashboardMetrics(state).dashboard;
}

function createSeedBundle(): NassibBundle {
  const project = structuredClone(NASSIB_PROJECT);
  const rooms = structuredClone(NASSIB_ROOMS);
  enrichRooms(rooms);

  const medicalGas = structuredClone(NASSIB_MEDICAL_GAS);
  const gasTotals = getProjectMedicalGasTotals();
  for (const net of medicalGas) {
    if (net.type === "O2") net.outletsPlanned = gasTotals.o2Outlets;
    if (net.type === "vacuum") net.outletsPlanned = gasTotals.vacuumOutlets;
    if (net.type === "medical_air") net.outletsPlanned = gasTotals.medicalAirOutlets;
  }

  const equipment = buildEquipmentFromPlan();
  const procurement = buildProcurementFromProject(equipment);
  const planningTasks = enrichPlanningTasks(structuredClone(PLANNING_GANTT_TASKS));

  const state: NassibBundle = {
    project,
    schedule: project.schedule,
    phases: structuredClone(PLANNING_GANTT_PHASES),
    tasks: planningTasks,
    actionTasks: [],
    dismissedActionTaskIds: [],
    zones: structuredClone(NASSIB_ZONES),
    rooms,
    roomSheets: buildAllRoomSheets(PLAN_ROOM_CATALOG),
    roomMetaOverrides: {},
    mepLots: structuredClone(NASSIB_MEP_LOTS),
    medicalGas,
    equipment,
    procurement,
    logistics: buildLogisticsFromProject(equipment, procurement),
    commissioning: [],
    reserves: structuredClone(NASSIB_RESERVES),
    documents: structuredClone(NASSIB_DOCUMENTS),
    boq: structuredClone(NASSIB_BOQ),
    tests: buildTestsFromProject(),
    meetings: structuredClone(NASSIB_MEETINGS),
    dailyReports: structuredClone(NASSIB_DAILY_REPORTS),
    risks: structuredClone(NASSIB_RISKS),
    events: structuredClone(NASSIB_EVENTS),
    members: structuredClone(MEMBERS),
    dashboard: {
      projectProgressPlanned: 0,
      projectProgressActual: 0,
      scheduleVarianceDays: 0,
      budgetVariancePct: 0,
      delayedTasks: 0,
      openReserves: 0,
      criticalReserves: 0,
      documentsPendingValidation: 0,
      criticalProcurements: 0,
      nextMeeting: "",
      nextMeetingDate: "",
      nextMilestone: "",
      nextMilestoneDate: "",
      masterIndex: {
        score: 0,
        level: "orange",
        breakdown: {
          planning: 0,
          quality: 0,
          procurement: 0,
          technical: 0,
          financial: 0,
          documentation: 0,
        },
      },
    },
    programme: {} as NassibBundle["programme"],
    roomRegistry: {} as NassibBundle["roomRegistry"],
  };

  state.programme = buildProgrammeContext(state);
  state.commissioning = buildCommissioningFromProject(
    state.equipment,
    state.logistics,
    state.tests,
    state.reserves,
  );
  state.actionTasks = buildActionTasksFromProject({
    boq: state.boq,
    revisions: state.programme.derivation.revisions,
    reserves: state.reserves,
    meetings: state.meetings,
    dismissedIds: state.dismissedActionTaskIds,
  });
  state.roomRegistry = buildRoomRegistry(state);
  state.dashboard = buildDashboard(state);
  return state;
}

export function refreshRoomRegistry() {
  const store = getStore();
  store.roomRegistry = buildRoomRegistry(store);
}

const globalStore = globalThis as typeof globalThis & {
  __nassibStore?: NassibBundle;
  __nassibStoreVersion?: string;
};

function ensureRoomSheets(store: NassibBundle) {
  if (!store.roomSheets) {
    store.roomSheets = buildAllRoomSheets(PLAN_ROOM_CATALOG);
    return true;
  }
  let changed = false;
  for (const room of store.rooms) {
    if (!store.roomSheets[room.id]) {
      const def =
        PLAN_ROOM_CATALOG.find((d) => d.id === room.id) ??
        PLAN_ROOM_CATALOG.find((d) => d.code === room.code);
      if (def) {
        store.roomSheets[room.id] = generateRoomSheet(def);
        changed = true;
      }
    }
  }
  return changed;
}

function getStore(): NassibBundle {
  if (
    !globalStore.__nassibStore ||
    globalStore.__nassibStoreVersion !== NASSIB_STORE_VERSION
  ) {
    globalStore.__nassibStore = createSeedBundle();
    globalStore.__nassibStoreVersion = NASSIB_STORE_VERSION;
  }
  const store = globalStore.__nassibStore;
  if (ensureRoomSheets(store)) {
    store.roomRegistry = buildRoomRegistry(store);
  }
  if (!store.commissioning) {
    store.commissioning = buildCommissioningFromProject(
      store.equipment,
      store.logistics,
      store.tests,
      store.reserves,
    );
  }
  return store;
}

export function getNassibBundle(): NassibBundle {
  return getStore();
}

export function refreshDashboard() {
  const store = getStore();
  store.dashboard = buildDashboard(store);
}

export function addReserve(input: CreateReserveInput): NassibReserve {
  const store = getStore();
  const seq = store.reserves.length + 1;
  const today = new Date().toISOString().slice(0, 10);

  const reserve: NassibReserve = {
    id: `res-new-${Date.now()}`,
    number: `RES-2026-${String(seq).padStart(3, "0")}`,
    date: today,
    roomCode: input.roomCode,
    zone: input.zone,
    lotCode: input.lotCode,
    company: input.company,
    title: input.title,
    description: input.description,
    severity: input.severity,
    type: input.type,
    correctiveAction: input.correctiveAction,
    assignedTo: input.assignedTo,
    dueDate: input.dueDate,
    status: "open",
    blocksReception: input.blocksReception ?? input.severity === "critical",
  };

  store.reserves.unshift(reserve);

  if (input.roomCode) {
    const room = store.rooms.find((r) => r.code === input.roomCode);
    if (room) room.reservesOpen += 1;
  }

  const lot = store.mepLots.find((l) => l.code === input.lotCode);
  if (lot) lot.reservesOpen += 1;

  store.events.unshift({
    id: `ev-${Date.now()}`,
    date: today,
    type: "reserve",
    message: `Nouvelle réserve ${reserve.number} — ${reserve.title}`,
    module: "reserves",
  });

  refreshRoomRegistry();
  refreshDashboard();
  return reserve;
}

export function updateRoomSheet(
  roomId: string,
  patch: RoomSheetPatch,
): RoomTechnicalSheet | null {
  const store = getStore();
  const current = store.roomSheets[roomId];
  if (!current) return null;

  const updated = mergeRoomSheet(current, patch);
  store.roomSheets[roomId] = updated;

  const room = store.rooms.find((r) => r.id === roomId);
  if (room && patch.surfaces?.floorAreaM2 !== undefined) {
    const area =
      typeof patch.surfaces.floorAreaM2 === "number"
        ? patch.surfaces.floorAreaM2
        : patch.surfaces.floorAreaM2.value;
    room.areaM2 = area;
  }

  refreshRoomRegistry();
  return updated;
}

export function updateRoomMeta(
  roomId: string,
  patch: { name?: string; functionalRole?: string; clinicalActivity?: string },
): boolean {
  const store = getStore();
  const room = store.rooms.find((r) => r.id === roomId);
  if (!room) return false;

  if (patch.name !== undefined) room.name = patch.name;
  if (!store.roomMetaOverrides) store.roomMetaOverrides = {};
  store.roomMetaOverrides[roomId] = {
    ...store.roomMetaOverrides[roomId],
    ...(patch.functionalRole !== undefined && { functionalRole: patch.functionalRole }),
    ...(patch.clinicalActivity !== undefined && { clinicalActivity: patch.clinicalActivity }),
  };

  refreshRoomRegistry();
  return true;
}

export function updateEquipment(
  id: string,
  patch: Partial<import("@/types/nassib").NassibEquipment>,
): boolean {
  const store = getStore();
  const eq = store.equipment.find((e) => e.id === id);
  if (!eq) return false;
  Object.assign(eq, patch);
  syncLinkedProcurement(id);
  syncLinkedLogisticsFromEquipment(id);
  refreshCommissioningLines();
  refreshActionTasks(getStore());
  refreshRoomRegistry();
  return true;
}

function syncLinkedProcurement(equipmentId: string) {
  const store = getStore();
  const eq = store.equipment.find((e) => e.id === equipmentId);
  const proc = store.procurement.find(
    (p) => p.sourceType === "equipment" && p.sourceId === equipmentId,
  );
  if (!eq || !proc) return;

  const status = equipmentStatusToProcurementStatus(eq.status);
  proc.status = status;
  proc.oddStep = procurementStatusToOddStep(status);
  proc.techValidated = Boolean(eq.brand && eq.model);
  proc.proposedRef =
    eq.brand || eq.model
      ? [eq.brand, eq.model].filter(Boolean).join(" ").trim()
      : eq.name;
  proc.supplier = eq.supplier || proc.supplier;
  proc.expectedDate = eq.expectedDelivery || proc.expectedDate;
  proc.actualDate = eq.actualDelivery;
  proc.planningImpact = !["received", "installed"].includes(status);
  if (eq.unitPrice != null) {
    proc.boqAmountHt = eq.unitPrice * eq.qty;
  }
  syncLinkedLogisticsFromEquipment(equipmentId);
}

function removeLogisticsForProcurement(procurementId: string) {
  const store = getStore();
  store.logistics = store.logistics.filter(
    (l) =>
      l.procurementId !== procurementId &&
      !(l.sourceType === "procurement" && l.sourceId === procurementId),
  );
}

function syncLinkedLogisticsFromEquipment(equipmentId: string) {
  const store = getStore();
  const proc = store.procurement.find(
    (p) => p.sourceType === "equipment" && p.sourceId === equipmentId,
  );
  if (proc) {
    syncLinkedLogisticsFromProcurement(proc.id);
    return;
  }
  store.logistics = store.logistics.filter(
    (l) => !(l.sourceType === "equipment" && l.sourceId === equipmentId),
  );
}

function syncLinkedLogisticsFromProcurement(procurementId: string) {
  const store = getStore();
  const proc = store.procurement.find((p) => p.id === procurementId);
  if (!proc) return;

  if (!isProcurementValidatedForLogistics(proc)) {
    removeLogisticsForProcurement(procurementId);
    return;
  }

  const eq =
    proc.sourceType === "equipment" && proc.sourceId
      ? store.equipment.find((e) => e.id === proc.sourceId)
      : undefined;
  const targetRoom = proc.roomCode ?? eq?.roomCode;
  if (!targetRoom) return;

  const lineId = eq ? `log-eq-${eq.id}` : `log-proc-${proc.id}`;
  const log = store.logistics.find((l) => l.id === lineId);

  const status = eq
    ? equipmentStatusToLogisticsStatus(eq.status)
    : logisticsStatusFromProcurement(proc);

  if (!log) {
    store.logistics.push({
      id: lineId,
      reference: proc.reference,
      description: proc.description,
      category: proc.lotCode.includes("FLUIDES")
        ? "zone_supply"
        : eq?.inventoryKind === "medical_furniture"
          ? "medical_furniture"
          : eq?.inventoryKind === "office_furniture"
            ? "office_furniture"
            : "clinical_dm",
      sourceType: eq ? "equipment" : "procurement",
      sourceId: eq?.id ?? proc.id,
      procurementId: proc.id,
      qty: proc.qty,
      storageZone: targetRoom.includes("TEC")
        ? "TEC-01"
        : targetRoom.includes("URG")
          ? "STK-URG"
          : targetRoom.includes("PHA")
            ? "PHA-01"
            : "STK-CENTRAL",
      targetRoomCode: targetRoom,
      status,
      flowStep: logisticsStatusToFlowStep(status),
      criticality: proc.criticality,
      plannedTransferDate: proc.expectedDate,
      actualTransferDate: proc.actualDate ?? eq?.actualDelivery,
      responsible: ROLE_LOGISTIQUE,
    });
    return;
  }

  log.status = status;
  log.flowStep = logisticsStatusToFlowStep(status);
  log.plannedTransferDate = proc.expectedDate;
  log.actualTransferDate = proc.actualDate ?? eq?.actualDelivery;
  log.description = proc.description;
  log.reference = proc.reference;
}

export function updateProcurement(
  id: string,
  patch: Partial<NassibProcurement>,
): boolean {
  const store = getStore();
  const line = store.procurement.find((p) => p.id === id);
  if (!line) return false;

  Object.assign(line, patch);
  if (patch.status !== undefined) {
    line.oddStep = procurementStatusToOddStep(patch.status);
    line.planningImpact = !["received", "installed"].includes(patch.status);
  }
  if (patch.oddStep !== undefined && patch.status === undefined) {
    line.oddStep = Math.min(13, Math.max(1, patch.oddStep));
  }

  syncLinkedLogisticsFromProcurement(id);
  refreshActionTasks(store);
  refreshRoomRegistry();
  refreshDashboard();
  return true;
}

function refreshActionTasks(store: NassibBundle) {
  store.actionTasks = syncActionTasks(
    store.actionTasks ?? [],
    store.dismissedActionTaskIds ?? [],
    {
      boq: store.boq,
      revisions: store.programme.derivation.revisions,
      reserves: store.reserves,
      meetings: store.meetings,
    },
  );
}

export function updateActionTask(
  id: string,
  patch: Partial<NassibActionTask>,
): boolean {
  const store = getStore();
  const task = store.actionTasks.find((t) => t.id === id);
  if (!task) return false;
  Object.assign(task, patch);
  refreshRoomRegistry();
  return true;
}

export function addActionTask(
  item: Omit<NassibActionTask, "id" | "autoGenerated" | "origin">,
): NassibActionTask {
  const store = getStore();
  const task: NassibActionTask = {
    ...item,
    id: `manual-${Date.now()}`,
    autoGenerated: false,
    origin: "manual",
  };
  store.actionTasks.push(task);
  refreshRoomRegistry();
  return task;
}

export function deleteActionTask(id: string): boolean {
  const store = getStore();
  const task = store.actionTasks.find((t) => t.id === id);
  if (!task) return false;

  if (task.autoGenerated) {
    if (!store.dismissedActionTaskIds) store.dismissedActionTaskIds = [];
    if (!store.dismissedActionTaskIds.includes(id)) {
      store.dismissedActionTaskIds.push(id);
    }
  }

  store.actionTasks = store.actionTasks.filter((t) => t.id !== id);
  refreshRoomRegistry();
  return true;
}

export function refreshActionTasksStore() {
  const store = getStore();
  refreshActionTasks(store);
  refreshRoomRegistry();
}

export function updateLogistics(
  id: string,
  patch: Partial<NassibLogisticsLine>,
): boolean {
  const store = getStore();
  const line = store.logistics.find((l) => l.id === id);
  if (!line) return false;

  Object.assign(line, patch);
  if (patch.status !== undefined) {
    line.flowStep = logisticsStatusToFlowStep(patch.status);
  }
  if (patch.flowStep !== undefined && patch.status === undefined) {
    line.flowStep = Math.min(8, Math.max(0, patch.flowStep));
  }

  refreshCommissioningLines();
  refreshActionTasks(store);
  refreshRoomRegistry();
  return true;
}

export function refreshCommissioningLines() {
  const store = getStore();
  const built = buildCommissioningFromProject(
    store.equipment,
    store.logistics,
    store.tests,
    store.reserves,
  );
  store.commissioning = mergeCommissioningLines(
    built,
    store.commissioning ?? [],
  );
}

export function updateCommissioningPhase(
  id: string,
  phaseId: CommissioningPhaseId,
  status: CommissioningPhaseStatus,
): boolean {
  const store = getStore();
  const line = store.commissioning.find((c) => c.id === id);
  if (!line) return false;

  const phase = line.phases[phaseId];
  if (status === "in_progress" || status === "done") {
    if (phaseId === "installation" && !line.logisticsReady) return false;
    if (
      phaseId === "commissioning" &&
      line.phases.installation.status !== "done" &&
      status === "done"
    ) {
      return false;
    }
    if (
      phaseId === "training" &&
      line.phases.commissioning.status !== "done" &&
      status === "done"
    ) {
      return false;
    }
  }

  phase.status = status;
  const today = new Date().toISOString().slice(0, 10);
  if (status === "done") phase.actualDate = today;
  if (status === "in_progress" && !phase.actualDate) {
    phase.plannedDate = phase.plannedDate ?? today;
  }

  line.progressPct = computeCommissioningProgress(line.phases);
  line.overallStatus = computeOverallStatus(line);

  const eq = store.equipment.find((e) => e.id === line.equipmentId);
  if (eq) {
    const nextStatus = equipmentStatusFromCommissioning(line.phases);
    if (nextStatus) eq.status = nextStatus;
  }

  refreshRoomRegistry();
  refreshActionTasks(store);
  return true;
}

export function advanceCommissioningPhase(
  id: string,
  phaseId: CommissioningPhaseId,
): boolean {
  const store = getStore();
  const line = store.commissioning.find((c) => c.id === id);
  if (!line) return false;

  const current = line.phases[phaseId].status;
  let next: CommissioningPhaseStatus | null = null;
  if (current === "locked" && line.logisticsReady) next = "pending";
  else if (current === "pending") next = "in_progress";
  else if (current === "in_progress") next = "done";
  if (!next) return false;
  return updateCommissioningPhase(id, phaseId, next);
}

export function addEquipment(
  item: Omit<import("@/types/nassib").NassibEquipment, "id">,
): import("@/types/nassib").NassibEquipment {
  const store = getStore();
  const eq = { ...item, id: `eq-${Date.now()}` };
  store.equipment.push(eq);
  refreshRoomRegistry();
  return eq;
}

export function removeEquipment(id: string): boolean {
  const store = getStore();
  const idx = store.equipment.findIndex((e) => e.id === id);
  if (idx < 0) return false;
  store.equipment.splice(idx, 1);
  refreshRoomRegistry();
  return true;
}

export function getRoomSheet(roomId: string): RoomTechnicalSheet | undefined {
  return getStore().roomSheets[roomId];
}

export function updateReserveStatus(
  id: string,
  status: NassibReserve["status"],
): boolean {
  const store = getStore();
  const reserve = store.reserves.find((r) => r.id === id);
  if (!reserve) return false;

  const wasOpen = !["closed", "levée"].includes(reserve.status);
  reserve.status = status;
  const isClosed = ["closed", "levée"].includes(status);

  if (wasOpen && isClosed && reserve.roomCode) {
    const room = store.rooms.find((r) => r.code === reserve.roomCode);
    if (room && room.reservesOpen > 0) room.reservesOpen -= 1;
  }

  refreshActionTasks(store);
  refreshRoomRegistry();
  refreshDashboard();
  return true;
}

export function updateBoqPayment(
  id: string,
  patch: Partial<
    Pick<
      BoqLine,
      | "paymentRequested"
      | "paymentApproved"
      | "paymentPaid"
      | "qtyValidated"
      | "qtyExecuted"
    >
  >,
): boolean {
  const store = getStore();
  const line = store.boq.find((l) => l.id === id);
  if (!line) return false;

  if (patch.paymentApproved !== undefined) {
    line.paymentApproved = Math.min(
      Math.max(0, patch.paymentApproved),
      line.paymentRequested || patch.paymentApproved,
    );
  }
  if (patch.paymentRequested !== undefined) {
    line.paymentRequested = Math.max(0, patch.paymentRequested);
    if (line.paymentApproved > line.paymentRequested) {
      line.paymentApproved = line.paymentRequested;
    }
    if (line.paymentPaid > line.paymentApproved) {
      line.paymentPaid = line.paymentApproved;
    }
  }
  if (patch.paymentPaid !== undefined) {
    const maxPaid = Math.max(0, line.paymentApproved);
    line.paymentPaid = Math.min(Math.max(0, patch.paymentPaid), maxPaid);
  }
  if (patch.qtyValidated !== undefined) line.qtyValidated = patch.qtyValidated;
  if (patch.qtyExecuted !== undefined) line.qtyExecuted = patch.qtyExecuted;

  refreshActionTasks(store);
  refreshDashboard();
  return true;
}

/** Approuve toutes les lignes en attente MOA d'un corps d'état (RECAP-xx). */
export function approveBoqPaymentBatch(recapCode: string): number {
  const store = getStore();
  const groups: { recap: BoqLine | null; children: BoqLine[] }[] = [];
  let current: (typeof groups)[0] | null = null;

  for (const line of store.boq) {
    if (line.code.startsWith("RECAP")) {
      current = { recap: line, children: [] };
      groups.push(current);
    } else if (current) {
      current.children.push(line);
    }
  }

  const group = groups.find((g) => g.recap?.code === recapCode);
  if (!group) return 0;

  let count = 0;
  for (const line of group.children) {
    if (line.paymentRequested > line.paymentApproved) {
      line.paymentApproved = line.paymentRequested;
      count += 1;
    }
  }

  if (count > 0) {
    refreshActionTasks(store);
    refreshDashboard();
  }
  return count;
}

export function updateTest(
  id: string,
  patch: Partial<
    Pick<NassibTest, "result" | "actualDate" | "reservesLinked" | "responsible">
  >,
): boolean {
  const store = getStore();
  const test = store.tests.find((t) => t.id === id);
  if (!test) return false;

  Object.assign(test, patch);
  refreshRoomRegistry();
  refreshDashboard();
  return true;
}

export function updateMedicalGasChecklist(
  id: string,
  key: string,
  done: boolean,
): boolean {
  const store = getStore();
  const net = store.medicalGas.find((g) => g.id === id);
  if (!net || !(key in net.checklist)) return false;

  net.checklist[key] = done;
  if (key === "outlets_installed") {
    net.outletsInstalled = done ? net.outletsPlanned : 0;
  }
  net.progressPct = computeMedicalGasProgress(net);
  refreshDashboard();
  return true;
}

export function resetNassibStore() {
  globalStore.__nassibStore = createSeedBundle();
  globalStore.__nassibStoreVersion = NASSIB_STORE_VERSION;
}

/** @deprecated Use getNassibBundle */
export function getDemoProjectBundle() {
  const b = getNassibBundle();
  return {
    project: b.project,
    lots: b.mepLots,
    wbs: b.phases.map((p) => ({
      ...p,
      children: undefined,
      level: 1,
      parentId: null,
      projectId: b.project.id,
    })),
    tasks: b.tasks,
    rooms: b.rooms,
    reserves: b.reserves,
    documents: b.documents,
    procurement: b.procurement,
    equipment: b.equipment,
    tests: b.tests,
    boq: b.boq,
    payments: [],
    members: b.members,
    kpis: {
      projectProgress: b.dashboard.projectProgressActual,
      openReserves: b.dashboard.openReserves,
      criticalReserves: b.dashboard.criticalReserves,
      delayedTasks: b.dashboard.delayedTasks,
      pendingDeliveries: b.dashboard.criticalProcurements,
      equipmentPendingCommissioning: b.equipment.filter(
        (e) => e.status === "installed",
      ).length,
      budgetConsumedPct: Math.round(
        (b.project.budgetConsumed / b.project.contractAmount) * 100,
      ),
      nextMilestone: b.dashboard.nextMilestone,
      nextMilestoneDate: b.dashboard.nextMilestoneDate,
    },
  };
}
