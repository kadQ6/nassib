"use server";

import {
  advanceCommissioningPhase,
  updateCommissioningPhase,
} from "@/lib/nassib";
import type { CommissioningPhaseId, CommissioningPhaseStatus } from "@/types/nassib";
import { revalidatePath } from "next/cache";

const PATHS = [
  "/installation-dm",
  "/logistique",
  "/equipements",
  "/equipements/recap",
  "/essais",
  "/reserves",
  "/taches",
  "/reception",
  "/mise-en-exploitation",
  "/locaux",
  "/projet",
  "/programme",
];

function revalidateAll() {
  for (const p of PATHS) revalidatePath(p);
}

export async function updateCommissioningPhaseAction(
  id: string,
  phaseId: CommissioningPhaseId,
  status: CommissioningPhaseStatus,
) {
  const ok = updateCommissioningPhase(id, phaseId, status);
  revalidateAll();
  return { ok };
}

export async function advanceCommissioningPhaseAction(
  id: string,
  phaseId: CommissioningPhaseId,
) {
  const ok = advanceCommissioningPhase(id, phaseId);
  revalidateAll();
  return { ok };
}
