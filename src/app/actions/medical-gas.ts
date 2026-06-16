"use server";

import { updateMedicalGasChecklist } from "@/lib/nassib";
import { revalidatePath } from "next/cache";

export async function toggleMedicalGasChecklistAction(
  networkId: string,
  key: string,
  done: boolean,
) {
  const ok = updateMedicalGasChecklist(networkId, key, done);
  revalidatePath("/fluides-medicaux");
  revalidatePath("/besoins-techniques");
  revalidatePath("/projet");
  revalidatePath("/suivi-chantier");
  return { ok };
}
