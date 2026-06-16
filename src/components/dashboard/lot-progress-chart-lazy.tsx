"use client";

import dynamic from "next/dynamic";
import type { MepLot } from "@/types/nassib";

const Chart = dynamic(
  () =>
    import("./lot-progress-chart").then((m) => m.LotProgressChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[#003F72]">Avancement par lot MEP</h3>
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
    ),
  },
);

export function LotProgressChartLazy({ lots }: { lots: MepLot[] }) {
  return <Chart lots={lots} />;
}
