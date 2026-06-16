import type { EquipmentImplementationSlot } from "@/types/programme";
import type { NassibEquipment } from "@/types/nassib";
import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";

function kindToSlotCategory(
  kind: NassibEquipment["inventoryKind"],
): EquipmentImplementationSlot["category"] {
  if (kind === "biomedical") return "biomedical";
  if (kind === "office_furniture") return "it";
  return "furniture";
}

/** Schéma d'implantation — plans équipements Nassib (180526) */
export function buildEquipmentSchema(
  equipment: NassibEquipment[],
): EquipmentImplementationSlot[] {
  return equipment.map((eq) => ({
    id: `slot-${eq.id}`,
    roomCode: eq.roomCode ?? "STE-01",
    category: kindToSlotCategory(eq.inventoryKind),
    name: eq.name,
    qty: eq.qty,
    linkedEquipmentId: eq.id,
    installPhase: eq.installPhase,
    dependencies: eq.mepDependencies,
  }));
}

/** Slots techniques issus du plan (hors inventaire principal) */
export function appendTechnicalPlanSlots(
  slots: EquipmentImplementationSlot[],
): EquipmentImplementationSlot[] {
  const extra = [...slots];
  for (const def of PLAN_ROOM_CATALOG) {
    for (const [i, item] of def.layout.entries()) {
      if (item.category !== "technical") continue;
      extra.push({
        id: `slot-technical-${def.code}-${i}`,
        roomCode: def.code,
        category: "technical",
        name: item.name,
        qty: item.qty,
        installPhase: "mep_embedded",
        dependencies: ["GO", "FLUIDES", "CVC"],
      });
    }
  }
  return extra;
}
