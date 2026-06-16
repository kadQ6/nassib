import type { BoqLine } from "@/types/nassib";
import { BOQ_META } from "@/data/nassib/boq-polyclinique";

export type PaymentLineStatus =
  | "idle"
  | "pending_moa"
  | "pending_finance"
  | "partial"
  | "settled";

export interface PaymentGroup {
  recap: BoqLine;
  children: BoqLine[];
}

export interface PaymentKpis {
  totalRequested: number;
  totalApproved: number;
  totalPaid: number;
  totalRetention: number;
  pendingMoa: number;
  pendingFinance: number;
  activeSituations: number;
  lineCount: number;
}

export function lineContractAmount(line: BoqLine): number {
  return line.qtyContract * line.unitPrice;
}

export function lineSituationBase(line: BoqLine): number {
  return line.qtyValidated * line.unitPrice;
}

export function lineRetentionAmount(line: BoqLine): number {
  return Math.round((line.paymentApproved * line.retentionPct) / 100);
}

export function lineNetPayable(line: BoqLine): number {
  return Math.max(0, line.paymentApproved - lineRetentionAmount(line));
}

export function paymentLineStatus(line: BoqLine): PaymentLineStatus {
  if (line.paymentRequested <= 0 && line.paymentApproved <= 0 && line.paymentPaid <= 0) {
    return "idle";
  }
  if (line.paymentRequested > line.paymentApproved) return "pending_moa";
  if (line.paymentApproved > line.paymentPaid) {
    return line.paymentPaid > 0 ? "partial" : "pending_finance";
  }
  if (line.paymentPaid > 0 && line.paymentPaid >= lineNetPayable(line)) return "settled";
  return "idle";
}

export const PAYMENT_STATUS_LABELS: Record<PaymentLineStatus, string> = {
  idle: "Non engagé",
  pending_moa: "Attente MOA",
  pending_finance: "À payer",
  partial: "Paiement partiel",
  settled: "Soldé",
};

export function buildPaymentGroups(boq: BoqLine[]): PaymentGroup[] {
  const groups: PaymentGroup[] = [];
  let current: PaymentGroup | null = null;

  for (const line of boq) {
    if (line.code.startsWith("RECAP")) {
      current = { recap: line, children: [] };
      groups.push(current);
    } else if (current) {
      current.children.push(line);
    }
  }

  return groups;
}

export function sumGroupField(
  group: PaymentGroup,
  field: "paymentRequested" | "paymentApproved" | "paymentPaid",
): number {
  return group.children.reduce((s, l) => s + l[field], 0);
}

export function paymentKpis(boq: BoqLine[]): PaymentKpis {
  const detail = boq.filter((l) => !l.code.startsWith("RECAP"));
  let totalRequested = 0;
  let totalApproved = 0;
  let totalPaid = 0;
  let totalRetention = 0;
  let pendingMoa = 0;
  let pendingFinance = 0;

  for (const line of detail) {
    totalRequested += line.paymentRequested;
    totalApproved += line.paymentApproved;
    totalPaid += line.paymentPaid;
    totalRetention += lineRetentionAmount(line);

    const status = paymentLineStatus(line);
    if (status === "pending_moa") {
      pendingMoa += line.paymentRequested - line.paymentApproved;
    }
    if (status === "pending_finance" || status === "partial") {
      pendingFinance += lineNetPayable(line) - line.paymentPaid;
    }
  }

  const withActivity = detail.filter((l) => paymentLineStatus(l) !== "idle").length;

  return {
    totalRequested,
    totalApproved,
    totalPaid,
    totalRetention,
    pendingMoa,
    pendingFinance,
    activeSituations: withActivity,
    lineCount: detail.length,
  };
}

export function exportPaymentsCsv(boq: BoqLine[]): string {
  const header =
    "Code;Description;Lot;Montant contractuel;Demandé;Approuvé;Payé;Retenue %;Statut";
  const rows = boq
    .filter((l) => !l.code.startsWith("RECAP"))
    .map((l) =>
      [
        l.code,
        `"${l.description.replace(/"/g, '""')}"`,
        l.lotCode,
        lineContractAmount(l),
        l.paymentRequested,
        l.paymentApproved,
        l.paymentPaid,
        l.retentionPct,
        PAYMENT_STATUS_LABELS[paymentLineStatus(l)],
      ].join(";"),
    );
  return [header, ...rows].join("\n");
}

export const PAYMENTS_META = {
  currency: BOQ_META.currency,
  workflow: "MOE → MOA → Finance",
  source: BOQ_META.sourceFile,
} as const;
