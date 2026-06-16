"use server";

import { addEquipment, removeEquipment, updateEquipment } from "@/lib/nassib";
import type { NassibEquipment } from "@/types/nassib";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const equipmentSchema = z.object({
  assetCode: z.string(),
  name: z.string(),
  service: z.string(),
  roomCode: z.string(),
  inventoryKind: z.enum(["biomedical", "medical_furniture", "office_furniture"]),
  qty: z.number().int().positive(),
  status: z.enum([
    "to_define",
    "spec_pending",
    "ordered",
    "manufacturing",
    "in_transit",
    "customs",
    "delivered",
    "installed",
    "tested",
    "commissioned",
    "accepted",
    "validated",
    "blocked",
  ]),
  prerequisitesMet: z.boolean(),
});

export async function updateEquipmentAction(
  id: string,
  patch: Partial<
    Pick<
      NassibEquipment,
      | "name"
      | "assetCode"
      | "status"
      | "prerequisitesMet"
      | "brand"
      | "model"
      | "supplier"
      | "unitPrice"
      | "inventoryKind"
    >
  >,
) {
  const ok = updateEquipment(id, patch);
  revalidatePath("/equipements");
  revalidatePath("/equipements/recap");
  revalidatePath("/equipements/financier");
  revalidatePath("/locaux");
  revalidatePath("/approvisionnements");
  revalidatePath("/budget");
  revalidatePath("/logistique");
  return { ok };
}

export async function addEquipmentAction(data: z.infer<typeof equipmentSchema>) {
  const parsed = equipmentSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const };
  const created = addEquipment({
    ...parsed.data,
    brand: "",
    model: "",
    supplier: "",
    unitPrice: null,
    expectedDelivery: "",
    installPhase: "finishes",
    constructionGate: "after_finishes",
    mepDependencies: ["GO"],
  });
  revalidatePath("/equipements");
  revalidatePath("/equipements/recap");
  revalidatePath("/equipements/financier");
  revalidatePath("/locaux");
  return { ok: true as const, equipment: created };
}

export async function removeEquipmentAction(id: string) {
  const ok = removeEquipment(id);
  revalidatePath("/equipements");
  revalidatePath("/equipements/recap");
  return { ok };
}
