"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LotBoqSection } from "@/lib/nassib/lot-boq-analytics";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#003F72", "#0891B2", "#0ea5e9", "#38bdf8", "#64748b", "#94a3b8"];

export function LotBoqBreakdownChart({ sections }: { sections: LotBoqSection[] }) {
  const data = sections.slice(0, 8).map((s) => ({
    name: s.label.length > 22 ? `${s.label.slice(0, 20)}…` : s.label,
    fullName: s.label,
    amount: s.amountHt,
    pct: s.pctOfLot,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
        Aucune ligne BOQ pour ce lot
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
            tick={{ fontSize: 11 }}
          />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(v, _n, item) => [
              `${formatCurrency(Number(v), "DJF")} (${(item.payload as { pct: number }).pct.toFixed(1)} %)`,
              "Montant HT",
            ]}
            labelFormatter={(_l, payload) =>
              payload?.[0] ? (payload[0].payload as { fullName: string }).fullName : ""
            }
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
