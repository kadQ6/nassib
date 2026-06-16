"use server";

import { updateTest } from "@/lib/nassib";
import type { NassibTest } from "@/types/nassib";
import { revalidatePath } from "next/cache";

export async function updateTestAction(
  id: string,
  patch: Partial<
    Pick<NassibTest, "result" | "actualDate" | "reservesLinked" | "responsible">
  >,
) {
  const ok = updateTest(id, patch);
  revalidatePath("/essais");
  revalidatePath("/reception");
  revalidatePath("/locaux");
  revalidatePath("/projet");
  return { ok };
}

export async function advanceTestResultAction(
  id: string,
  result: NassibTest["result"],
) {
  const today = new Date().toISOString().slice(0, 10);
  const patch: Partial<NassibTest> = { result };
  if (["conform", "validated", "non_conform"].includes(result)) {
    patch.actualDate = today;
  }
  const ok = updateTest(id, patch);
  revalidatePath("/essais");
  revalidatePath("/reception");
  revalidatePath("/locaux");
  return { ok };
}
