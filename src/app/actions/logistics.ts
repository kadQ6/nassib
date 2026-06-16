"use server";

import { updateLogistics } from "@/lib/nassib";
import type { NassibLogisticsLine } from "@/types/nassib";
import { revalidatePath } from "next/cache";

export async function updateLogisticsAction(
  id: string,
  patch: Partial<
    Pick<
      NassibLogisticsLine,
      | "status"
      | "flowStep"
      | "storageZone"
      | "plannedTransferDate"
      | "actualTransferDate"
      | "responsible"
    >
  >,
) {
  const ok = updateLogistics(id, patch);
  revalidatePath("/logistique");
  revalidatePath("/approvisionnements");
  revalidatePath("/programme");
  revalidatePath("/programme/derivations");
  revalidatePath("/locaux");
  return { ok };
}
