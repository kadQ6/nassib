import type { InventoryKind, NassibEquipment } from "@/types/nassib";

/** Cadres d'affichage module 8 — pilotage chantier */
export type InventoryDisplayGroup = "clinical_medical" | "office";

export const DISPLAY_GROUP_LABELS: Record<InventoryDisplayGroup, string> = {
  clinical_medical: "Équipements et mobilier médicaux",
  office: "Mobilier bureau",
};

export const DISPLAY_GROUP_DESCRIPTIONS: Record<InventoryDisplayGroup, string> = {
  clinical_medical:
    "DM biomédicaux, lits, brancards, tables patient, chariots de soin, autoclaves…",
  office:
    "Bureaux, chaises, fauteuils, rangements, postes PC, imprimantes, écrans…",
};

export function displayGroup(kind: InventoryKind): InventoryDisplayGroup {
  return kind === "office_furniture" ? "office" : "clinical_medical";
}

export function filterByDisplayGroup(
  items: NassibEquipment[],
  group: InventoryDisplayGroup,
): NassibEquipment[] {
  return items.filter((eq) => displayGroup(eq.inventoryKind) === group);
}

export function countByDisplayGroup(items: NassibEquipment[]) {
  const clinical = filterByDisplayGroup(items, "clinical_medical");
  const office = filterByDisplayGroup(items, "office");
  return {
    clinical_medical: {
      total: clinical.length,
      biomedical: clinical.filter((e) => e.inventoryKind === "biomedical").length,
      medicalFurniture: clinical.filter((e) => e.inventoryKind === "medical_furniture")
        .length,
    },
    office: { total: office.length },
    all: items.length,
  };
}
