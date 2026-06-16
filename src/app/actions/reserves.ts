"use server";

import { revalidatePath } from "next/cache";
import { addReserve, updateReserveStatus } from "@/lib/nassib";
import {
  createReserveSchema,
  updateReserveStatusSchema,
} from "@/lib/validations/reserve.schema";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function createReserveAction(
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    roomCode: formData.get("roomCode") || undefined,
    zone: formData.get("zone"),
    lotCode: formData.get("lotCode"),
    company: formData.get("company"),
    severity: formData.get("severity"),
    type: formData.get("type"),
    correctiveAction: formData.get("correctiveAction"),
    assignedTo: formData.get("assignedTo"),
    dueDate: formData.get("dueDate"),
    blocksReception: formData.get("blocksReception") === "on",
  };

  const parsed = createReserveSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Données invalides",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const reserve = addReserve(parsed.data);
    revalidatePath("/");
    revalidatePath("/reserves");
    return {
      ok: true,
      message: `Réserve ${reserve.number} créée avec succès`,
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Erreur lors de la création",
    };
  }
}

export async function updateReserveStatusAction(
  id: string,
  status: string,
): Promise<ActionResult> {
  const parsed = updateReserveStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    return { ok: false, message: "Statut invalide" };
  }

  const updated = updateReserveStatus(parsed.data.id, parsed.data.status);
  if (!updated) {
    return { ok: false, message: "Réserve introuvable" };
  }

  revalidatePath("/");
  revalidatePath("/reserves");
  return { ok: true, message: "Statut mis à jour" };
}
