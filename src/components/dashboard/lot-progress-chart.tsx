"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MepLot } from "@/types/nassib";

export function LotProgressChart({ lots }: { lots: MepLot[] }) {
  const data = lots.map((l) => ({
    name: l.code.replace("LOT-", ""),
    progress: l.progressPct,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#003F72]">Avancement par lot MEP</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${v}%`, "Avancement"]} />
            <Bar dataKey="progress" fill="#0891B2" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
