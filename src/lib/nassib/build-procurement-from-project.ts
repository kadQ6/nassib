import { POLYCLINIQUE_BOQ_DETAIL } from "@/data/nassib/boq-polyclinique";
import type { BoqLine, NassibEquipment, NassibProcurement } from "@/types/nassib";
import {
  DEFAULT_COMPANY,
  ROLE_ACHATS,
  ROLE_BIOMEDICAL,
} from "@/lib/constants/project-roles";
import {
  equipmentStatusToProcurementStatus,
  ODD_STEPS,
  procurementStatusToOddStep,
} from "./procurement-odd";

const BOQ_IMPORT_ANCHORS: { code: string; lotCode: string; criticality: NassibProcurement["criticality"] }[] = [
  { code: "FM-2.9.1", lotCode: "LOT-FLUIDES", criticality: "critical" },
  { code: "FM-2.9.4", lotCode: "LOT-FLUIDES", criticality: "high" },
  { code: "FM-2.9.5", lotCode: "LOT-FLUIDES", criticality: "high" },
];

function boqLine(code: string): BoqLine | undefined {
  return POLYCLINIQUE_BOQ_DETAIL.find((l) => l.code === code);
}

function equipmentLot(eq: NassibEquipment): string {
  const n = eq.name.toLowerCase();
  if (n.includes("générateur") || n.includes("tableau") || n.includes("potter")) {
    return "LOT-CFO";
  }
  if (n.includes("autoclave") || n.includes("laveur") || n.includes("scialytique")) {
    return "LOT-BIO";
  }
  if (eq.mepDependencies.includes("FLUIDES") || eq.medicalGasNeed) {
    return "LOT-FLUIDES";
  }
  return "LOT-BIO";
}

function equipmentCriticality(eq: NassibEquipment): NassibProcurement["criticality"] {
  if (eq.status === "blocked") return "critical";
  const n = eq.name.toLowerCase();
  if (
    n.includes("scialytique") ||
    n.includes("table de chirurgie") ||
    n.includes("ventilateur") ||
    n.includes("respirateur") ||
    n.includes("autoclave")
  ) {
    return "critical";
  }
  if (eq.medicalGasNeed || eq.installPhase === "mep_embedded") return "high";
  return "normal";
}

function proposedRef(eq: NassibEquipment): string {
  if (eq.brand || eq.model) {
    return [eq.brand, eq.model].filter(Boolean).join(" ").trim();
  }
  return eq.name;
}

/**
 * Lignes d'achat générées depuis le programme :
 * - équipements biomédicaux du plan d'implantation
 * - ancres BOQ import (centrale O₂, fluides médicaux)
 */
export function buildProcurementFromProject(
  equipment: NassibEquipment[],
): NassibProcurement[] {
  const lines: NassibProcurement[] = [];

  for (const anchor of BOQ_IMPORT_ANCHORS) {
    const bl = boqLine(anchor.code);
    if (!bl) continue;
    const status = "boq_check";
    lines.push({
      id: `proc-boq-${bl.id}`,
      reference: `BOQ-${bl.code}`,
      lotCode: anchor.lotCode,
      description: bl.description,
      supplier: "À sourcer",
      qty: bl.qtyContract,
      expectedDate: "2026-10-31",
      status,
      criticality: anchor.criticality,
      planningImpact: true,
      responsible: ROLE_ACHATS,
      sourceType: "boq",
      sourceId: bl.id,
      boqCode: bl.code,
      oddStep: procurementStatusToOddStep(status),
      techValidated: false,
      proposedRef: bl.description,
      importRequired: true,
      boqAmountHt: bl.qtyContract * bl.unitPrice,
    });
  }

  const biomedical = equipment.filter((e) => e.inventoryKind === "biomedical");
  for (const eq of biomedical) {
    const status = equipmentStatusToProcurementStatus(eq.status);
    lines.push({
      id: `proc-eq-${eq.id}`,
      reference: eq.assetCode,
      lotCode: equipmentLot(eq),
      description: eq.name,
      supplier: eq.supplier || "À définir",
      qty: eq.qty,
      orderDate: eq.status === "ordered" ? "2026-06-01" : undefined,
      expectedDate: eq.expectedDelivery || "2026-11-30",
      actualDate: eq.actualDelivery,
      status,
      criticality: equipmentCriticality(eq),
      planningImpact: !["received", "installed"].includes(status),
      responsible: ROLE_BIOMEDICAL,
      sourceType: "equipment",
      sourceId: eq.id,
      roomCode: eq.roomCode,
      oddStep: procurementStatusToOddStep(status),
      techValidated: Boolean(eq.brand && eq.model),
      proposedRef: proposedRef(eq),
      importRequired: true,
      boqAmountHt: eq.unitPrice != null ? eq.unitPrice * eq.qty : null,
    });
  }

  return lines;
}

export type ProcurementKpis = ReturnType<typeof procurementKpis>;

export function procurementKpis(lines: NassibProcurement[]) {
  const byOdd = ODD_STEPS.map((_, i) => ({
    step: i + 1,
    count: lines.filter((l) => l.oddStep === i + 1).length,
  }));
  return {
    total: lines.length,
    fromEquipment: lines.filter((l) => l.sourceType === "equipment").length,
    fromBoq: lines.filter((l) => l.sourceType === "boq").length,
    needAction: lines.filter((l) => l.oddStep <= 3).length,
    inImport: lines.filter((l) => l.oddStep >= 6 && l.oddStep <= 11).length,
    received: lines.filter((l) => l.oddStep >= 13).length,
    critical: lines.filter((l) => l.criticality === "critical").length,
    boqLinkedAmount: lines.reduce((s, l) => s + (l.boqAmountHt ?? 0), 0),
    byOdd,
  };
}
