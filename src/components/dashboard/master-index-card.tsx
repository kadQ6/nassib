import type { MasterIndex } from "@/types/nassib";
import { cn, formatPercent } from "@/lib/utils";

const LEVEL_CONFIG = {
  green: { label: "Chantier maîtrisé", bg: "bg-emerald-500", ring: "ring-emerald-200", text: "text-emerald-700" },
  orange: { label: "Vigilance", bg: "bg-amber-500", ring: "ring-amber-200", text: "text-amber-700" },
  red: { label: "Situation critique", bg: "bg-red-500", ring: "ring-red-200", text: "text-red-700" },
};

export function MasterIndexCard({ index }: { index: MasterIndex }) {
  const cfg = LEVEL_CONFIG[index.level];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Indice de maîtrise chantier</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-[#003F72]">{index.score}</span>
            <span className="text-lg text-slate-400">/100</span>
          </div>
          <p className={cn("mt-2 text-sm font-semibold", cfg.text)}>{cfg.label}</p>
        </div>
        <div
          className={cn(
            "relative mx-auto flex h-28 w-28 items-center justify-center rounded-full ring-8 sm:mx-0",
            cfg.ring,
          )}
        >
          <div
            className={cn("absolute inset-0 rounded-full opacity-20", cfg.bg)}
            style={{
              background: `conic-gradient(${index.level === "green" ? "#10b981" : index.level === "orange" ? "#f59e0b" : "#ef4444"} ${index.score * 3.6}deg, #e2e8f0 0deg)`,
            }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-bold text-[#003F72]">
            {Math.round(index.score)}
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(
          [
            ["Planning", index.breakdown.planning, 25],
            ["Qualité", index.breakdown.quality, 20],
            ["Appro.", index.breakdown.procurement, 15],
            ["Technique", index.breakdown.technical, 20],
            ["Financier", index.breakdown.financial, 10],
            ["DOE/Docs", index.breakdown.documentation, 10],
          ] as const
        ).map(([label, value, max]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-lg font-semibold text-[#003F72]">
              {value.toFixed(1)}
              <span className="text-xs font-normal text-slate-400">/{max}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KpiStrip({
  items,
}: {
  items: { label: string; value: string; sub?: string; variant?: "default" | "warning" | "danger" }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-bold",
              item.variant === "danger"
                ? "text-red-600"
                : item.variant === "warning"
                  ? "text-amber-600"
                  : "text-[#003F72]",
            )}
          >
            {item.value}
          </p>
          {item.sub && <p className="text-xs text-slate-500">{item.sub}</p>}
        </div>
      ))}
    </div>
  );
}

export function ProgressCompare({
  planned,
  actual,
}: {
  planned: number;
  actual: number;
}) {
  const gap = actual - planned;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-[#003F72]">Avancement prévu vs réel</h3>
      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600">Prévu à date</span>
            <span className="font-medium">{formatPercent(planned, 1)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-400" style={{ width: `${planned}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600">Réel</span>
            <span className="font-medium text-[#0891B2]">{formatPercent(actual, 1)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#0891B2]" style={{ width: `${actual}%` }} />
          </div>
        </div>
        <p
          className={cn(
            "text-sm font-medium",
            gap >= 0 ? "text-emerald-600" : "text-red-600",
          )}
        >
          Écart : {gap >= 0 ? "+" : ""}
          {formatPercent(gap, 1)}
        </p>
      </div>
    </div>
  );
}
