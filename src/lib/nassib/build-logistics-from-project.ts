import type {
  LogisticsCategory,
  NassibEquipment,
  NassibLogisticsLine,
  NassibProcurement,
} from "@/types/nassib";
import { ROLE_LOGISTIQUE } from "@/lib/constants/project-roles";
import {
  equipmentStatusToLogisticsStatus,
  INTERNAL_FLOW_STEPS,
  isProcurementValidatedForLogistics,
  logisticsStatusFromProcurement,
  logisticsStatusToFlowStep,
} from "./logistics-internal";

function storageZoneForRoom(roomCode: string): string {
  const c = roomCode.toUpperCase();
  if (c.includes("PHA")) return "PHA-01";
  if (c.includes("URG")) return "STK-URG";
  if (c.includes("TEC")) return "TEC-01";
  if (c.includes("BLC") || c.includes("STE") || c.includes("SSP")) return "STK-BLOC";
  if (c.includes("NEO")) return "STK-NEO";
  return "STK-CENTRAL";
}

function categoryFromProcurement(
  proc: NassibProcurement,
  eq?: NassibEquipment,
): LogisticsCategory {
  if (proc.lotCode.includes("FLUIDES")) return "zone_supply";
  if (eq?.inventoryKind === "medical_furniture") return "medical_furniture";
  if (eq?.inventoryKind === "office_furniture") return "office_furniture";
  return "clinical_dm";
}

function logisticsCriticality(
  proc: NassibProcurement,
  eq?: NassibEquipment,
): NassibLogisticsLine["criticality"] {
  if (proc.criticality !== "normal") return proc.criticality;
  if (eq?.status === "blocked") return "critical";
  return "normal";
}

function lineFromValidatedProcurement(
  proc: NassibProcurement,
  equipment: NassibEquipment[],
): NassibLogisticsLine | null {
  const eq =
    proc.sourceType === "equipment" && proc.sourceId
      ? equipment.find((e) => e.id === proc.sourceId)
      : undefined;
  const targetRoom = proc.roomCode ?? eq?.roomCode;
  if (!targetRoom) return null;

  const status = eq
    ? equipmentStatusToLogisticsStatus(eq.status)
    : logisticsStatusFromProcurement(proc);

  return {
    id: eq ? `log-eq-${eq.id}` : `log-proc-${proc.id}`,
    reference: proc.reference,
    description: proc.description,
    category: categoryFromProcurement(proc, eq),
    sourceType: eq ? "equipment" : "procurement",
    sourceId: eq?.id ?? proc.id,
    procurementId: proc.id,
    qty: proc.qty,
    storageZone: storageZoneForRoom(targetRoom),
    targetRoomCode: targetRoom,
    status,
    flowStep: logisticsStatusToFlowStep(status),
    criticality: logisticsCriticality(proc, eq),
    plannedTransferDate: proc.expectedDate,
    actualTransferDate: proc.actualDate ?? eq?.actualDelivery,
    responsible: ROLE_LOGISTIQUE,
  };
}

/**
 * Logistique interne vide au démarrage.
 * Les mouvements n'apparaissent que lorsque la commande est validée
 * (dédouanement ODD ≥ étape 11).
 */
export function buildLogisticsFromProject(
  equipment: NassibEquipment[],
  procurement: NassibProcurement[],
): NassibLogisticsLine[] {
  const lines: NassibLogisticsLine[] = [];

  for (const proc of procurement) {
    if (!isProcurementValidatedForLogistics(proc)) continue;
    const line = lineFromValidatedProcurement(proc, equipment);
    if (line) lines.push(line);
  }

  return lines;
}

export type LogisticsKpis = ReturnType<typeof logisticsKpis>;

export function logisticsKpis(lines: NassibLogisticsLine[]) {
  const byFlow = INTERNAL_FLOW_STEPS.map((_, i) => ({
    step: i + 1,
    count: lines.filter((l) => l.flowStep === i + 1).length,
  }));
  return {
    total: lines.length,
    pendingImport: 0,
    inStockOrTransfer: lines.filter((l) => l.flowStep >= 4 && l.flowStep <= 6).length,
    inPlace: lines.filter((l) => l.flowStep >= 8).length,
    clinicalDm: lines.filter((l) => l.category === "clinical_dm").length,
    medicalFurniture: lines.filter((l) => l.category === "medical_furniture").length,
    officeFurniture: lines.filter((l) => l.category === "office_furniture").length,
    zoneSupply: lines.filter((l) => l.category === "zone_supply").length,
    critical: lines.filter((l) => l.criticality === "critical").length,
    zones: lines.length > 0 ? new Set(lines.map((l) => l.storageZone)).size : 0,
    byFlow,
  };
}
