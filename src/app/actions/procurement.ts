"use server";

import { updateProcurement } from "@/lib/nassib";
import type { NassibProcurement } from "@/types/nassib";
import { revalidatePath } from "next/cache";

export async function updateProcurementAction(
  id: string,
  patch: Partial<
    Pick<
      NassibProcurement,
      | "status"
      | "oddStep"
      | "techValidated"
      | "supplier"
      | "expectedDate"
      | "orderDate"
      | "proposedRef"
      | "responsible"
    >
  >,
) {
  const ok = updateProcurement(id, patch);
  revalidatePath("/approvisionnements");
  revalidatePath("/budget");
  revalidatePath("/programme");
  revalidatePath("/programme/derivations");
  revalidatePath("/locaux");
  revalidatePath("/logistique");
  return { ok };
}
