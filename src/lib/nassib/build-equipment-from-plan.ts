import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import type { NassibEquipment } from "@/types/nassib";
import { isMepFixtureName } from "./bed-headboard-mep";
import {
  assetPrefix,
  classifyInventoryKind,
  medicalFurnitureGroup,
  resolveInventoryMepProfile,
} from "./inventory-rules";

/** Inventaire complet issu des croquis — équipements médicaux + mobilier, sans marque ni modèle */
export function buildEquipmentFromPlan(): NassibEquipment[] {
  const list: NassibEquipment[] = [];
  const counters: Record<string, number> = {};

  for (const room of PLAN_ROOM_CATALOG) {
    const roomHasMedicalGas = room.needs.medicalGas;

    for (const slot of room.layout) {
      if (slot.category === "technical" && !isMepFixtureName(slot.name)) continue;

      const kind = classifyInventoryKind(slot.name, slot.category);
      const mep = resolveInventoryMepProfile(slot.name, kind, roomHasMedicalGas);
      const prefix = assetPrefix(kind);
      const furnGroup =
        kind === "medical_furniture" ? medicalFurnitureGroup(slot.name) : undefined;

      for (let i = 0; i < slot.qty; i++) {
        counters[prefix] = (counters[prefix] ?? 0) + 1;
        const n = counters[prefix]!;
        const suffix = slot.qty > 1 ? `-${String(i + 1).padStart(2, "0")}` : "";

        list.push({
          id: `inv-${room.code.toLowerCase()}-${prefix.toLowerCase()}-${n}`,
          assetCode: `${prefix}-${room.code}-${String(n).padStart(3, "0")}${suffix}`,
          name: slot.name,
          service: room.department,
          roomCode: room.code,
          inventoryKind: kind,
          medicalFurnitureGroup: furnGroup,
          brand: "",
          model: "",
          qty: 1,
          supplier: "",
          unitPrice: null,
          status: "to_define",
          prerequisitesMet: false,
          installPhase: mep.installPhase,
          constructionGate: mep.constructionGate,
          mepDependencies: mep.mepDependencies,
          constructionNote: mep.constructionNote,
          electricalNeed: mep.electricalNeed,
          networkNeed: mep.networkNeed,
          plumbingNeed: mep.plumbingNeed,
          medicalGasNeed: mep.medicalGasNeed,
          cvcNeed: mep.cvcNeed,
          expectedDelivery: "",
        });
      }
    }
  }

  return list;
}