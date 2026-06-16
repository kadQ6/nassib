"use server";

import { updateRoomMeta } from "@/lib/nassib";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  roomId: z.string(),
  name: z.string().min(1).optional(),
  functionalRole: z.string().optional(),
  clinicalActivity: z.string().optional(),
});

export async function updateRoomMetaAction(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Données invalides" };

  const ok = updateRoomMeta(parsed.data.roomId, {
    name: parsed.data.name,
    functionalRole: parsed.data.functionalRole,
    clinicalActivity: parsed.data.clinicalActivity,
  });
  if (!ok) return { ok: false as const, error: "Local introuvable" };

  revalidatePath(`/locaux/${parsed.data.roomId}`);
  revalidatePath("/locaux");
  revalidatePath("/besoins-techniques");
  return { ok: true as const };
}
