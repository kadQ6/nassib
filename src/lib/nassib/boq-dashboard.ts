import { BOQ_META, BOQ_RECAP, POLYCLINIQUE_BOQ } from "@/data/nassib/boq-polyclinique";
import type { BoqLine } from "@/types/nassib";
import { buildPaymentGroups, type PaymentGroup } from "@/lib/nassib/payments-workflow";

export type BoqCorpsEtatType = "GC" | "ÉLEC" | "FLUIDES" | "DIVERS";

export type BoqCorpsEtatRow = {
  code: string;
  recapCode: string;
  designation: string;
  type: BoqCorpsEtatType;
  lotCode: string;
  amountHt: number;
  acomptes: number;
  reste: number;
  progressPct: number;
  status: "en_cours" | "termine" | "non_demarre";
  color: string;
  typeBadgeClass: string;
  children: BoqLine[];
};

export type BoqDashboardKpis = {
  totalHt: number;
  totalAcomptes: number;
  totalReste: number;
  acomptesPct: number;
  restePct: number;
  globalProgressPct: number;
  corpsCount: number;
};

const CE_META: Record<
  number,
  {
    code: string;
    type: BoqCorpsEtatType;
    color: string;
    typeBadgeClass: string;
    progressPct: number;
    acomptes: number;
  }
> = {
  1: {
    code: "CE-01",
    type: "GC",
    color: "#94A3B8",
    typeBadgeClass: "bg-slate-200 text-slate-700",
    progressPct: 45,
    acomptes: 120_000_000,
  },
  2: {
    code: "CE-02",
    type: "ÉLEC",
    color: "#EAB308",
    typeBadgeClass: "bg-amber-100 text-amber-800",
    progressPct: 20,
    acomptes: 0,
  },
  3: {
    code: "CE-03",
    type: "FLUIDES",
    color: "#0891B2",
    typeBadgeClass: "bg-cyan-100 text-cyan-800",
    progressPct: 15,
    acomptes: 0,
  },
  4: {
    code: "CE-04",
    type: "DIVERS",
    color: "#8B5CF6",
    typeBadgeClass: "bg-violet-100 text-violet-800",
    progressPct: 10,
    acomptes: 0,
  },
};

function groupToRow(group: PaymentGroup, recapIndex: number): BoqCorpsEtatRow {
  const recap = BOQ_RECAP.find((r) => r.n === recapIndex)!;
  const meta = CE_META[recapIndex];
  const amountHt = group.recap.qtyContract * group.recap.unitPrice;
  const acomptes =
    meta.acomptes ||
    group.children.reduce((s, l) => s + l.paymentPaid, 0) ||
    (group.recap.paymentPaid ?? 0);

  return {
    code: meta.code,
    recapCode: group.recap.code,
    designation: group.recap.description,
    type: meta.type,
    lotCode: group.recap.lotCode,
    amountHt,
    acomptes,
    reste: amountHt - acomptes,
    progressPct: meta.progressPct,
    status: meta.progressPct >= 100 ? "termine" : "en_cours",
    color: meta.color,
    typeBadgeClass: meta.typeBadgeClass,
    children: group.children,
  };
}

export function buildBoqCorpsEtatRows(boq: BoqLine[] = POLYCLINIQUE_BOQ): BoqCorpsEtatRow[] {
  const groups = buildPaymentGroups(boq);
  return groups.map((g, i) => groupToRow(g, (i + 1) as 1 | 2 | 3 | 4));
}

export function boqDashboardKpis(rows: BoqCorpsEtatRow[]): BoqDashboardKpis {
  const totalHt = BOQ_META.totalHt;
  const totalAcomptes = rows.reduce((s, r) => s + r.acomptes, 0);
  const totalReste = totalHt - totalAcomptes;
  const globalProgressPct =
    totalHt > 0
      ? Math.round(
          rows.reduce((s, r) => s + r.amountHt * r.progressPct, 0) / totalHt,
        )
      : 0;

  return {
    totalHt,
    totalAcomptes,
    totalReste,
    acomptesPct: totalHt > 0 ? Math.round((totalAcomptes / totalHt) * 1000) / 10 : 0,
    restePct: totalHt > 0 ? Math.round((totalReste / totalHt) * 1000) / 10 : 0,
    globalProgressPct,
    corpsCount: rows.length,
  };
}

export function boqChartData(rows: BoqCorpsEtatRow[]) {
  return rows.map((r) => ({
    code: r.code,
    progress: r.progressPct,
    fill: r.color,
  }));
}

export function boqBudgetPieData(rows: BoqCorpsEtatRow[]) {
  const total = rows.reduce((s, r) => s + r.amountHt, 0);
  return rows.map((r) => ({
    name: r.code,
    value: r.amountHt,
    pct: total > 0 ? Math.round((r.amountHt / total) * 100) : 0,
    fill: r.color,
  }));
}

export { BOQ_META };
