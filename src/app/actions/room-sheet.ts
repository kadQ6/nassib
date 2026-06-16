"use server";

import { revalidatePath } from "next/cache";
import { updateRoomSheet } from "@/lib/nassib";
import { updateRoomSheetSchema } from "@/lib/validations/room-sheet.schema";
import type { RoomSheetPatch } from "@/types/room-sheet";

export async function updateRoomSheetAction(
  roomId: string,
  patch: RoomSheetPatch,
) {
  const parsed = updateRoomSheetSchema.safeParse({ roomId, patch });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const updated = updateRoomSheet(parsed.data.roomId, parsed.data.patch as RoomSheetPatch);
  if (!updated) {
    return { ok: false as const, error: { roomId: ["Local introuvable"] } };
  }

  revalidatePath(`/locaux/${roomId}`);
  revalidatePath("/locaux");
  return { ok: true as const, sheet: updated };
}
