"use server";

import { updateBoqPayment, approveBoqPaymentBatch } from "@/lib/nassib";
import type { BoqLine } from "@/types/nassib";
import { revalidatePath } from "next/cache";

export async function updateBoqPaymentAction(
  id: string,
  patch: Partial<
    Pick<
      BoqLine,
      | "paymentRequested"
      | "paymentApproved"
      | "paymentPaid"
      | "qtyValidated"
      | "qtyExecuted"
    >
  >,
) {
  const ok = updateBoqPayment(id, patch);
  revalidatePath("/boq/paiements");
  revalidatePath("/boq");
  revalidatePath("/taches");
  revalidatePath("/projet");
  return { ok };
}

export async function submitBoqPaymentRequestAction(id: string, amount: number) {
  const ok = updateBoqPayment(id, {
    paymentRequested: Math.max(0, Math.round(amount)),
  });
  revalidatePath("/boq/paiements");
  revalidatePath("/taches");
  return { ok };
}

export async function approveBoqPaymentAction(id: string, amount?: number) {
  const store = await import("@/lib/nassib").then((m) => m.getNassibBundle());
  const line = store.boq.find((l) => l.id === id);
  if (!line) return { ok: false };
  const approved =
    amount !== undefined
      ? Math.min(Math.max(0, Math.round(amount)), line.paymentRequested)
      : line.paymentRequested;
  const ok = updateBoqPayment(id, { paymentApproved: approved });
  revalidatePath("/boq/paiements");
  revalidatePath("/taches");
  return { ok };
}

export async function markBoqPaymentPaidAction(id: string, amount?: number) {
  const store = await import("@/lib/nassib").then((m) => m.getNassibBundle());
  const line = store.boq.find((l) => l.id === id);
  if (!line) return { ok: false };
  const net =
    line.paymentApproved -
    Math.round((line.paymentApproved * line.retentionPct) / 100);
  const paid =
    amount !== undefined
      ? Math.min(Math.max(0, Math.round(amount)), net)
      : net;
  const ok = updateBoqPayment(id, { paymentPaid: paid });
  revalidatePath("/boq/paiements");
  return { ok };
}

export async function approveAllPendingInGroupAction(recapCode: string) {
  const count = approveBoqPaymentBatch(recapCode);
  revalidatePath("/boq/paiements");
  revalidatePath("/taches");
  return { ok: true, count };
}
