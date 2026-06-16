"use client";

import type { CorpsEtatProgress } from "@/data/nassib/planning-gantt-executive";
import { cn } from "@/lib/utils";

const CX = 130;
const CY = 118;
const STROKE = 11;
const GAP = 14;

function ringRadius(index: number) {
  const outer = 96;
  return outer - index * (STROKE + GAP);
}

function ProgressRing({
  item,
  index,
}: {
  item: CorpsEtatProgress;
  index: number;
}) {
  const r = ringRadius(index);
  const c = 2 * Math.PI * r;
  const filled = (item.progressPct / 100) * c;
  const midAngle = ((item.progressPct / 200) * 360 - 90) * (Math.PI / 180);
  const lx = CX + r * Math.cos(midAngle);
  const ly = CY + r * Math.sin(midAngle);

  return (
    <g>
      <circle
        cx={CX}
        cy={CY}
        r={r}
        fill="none"
        stroke="#E8ECF0"
        strokeWidth={STROKE}
      />
      {item.progressPct > 0 && (
        <circle
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={item.color}
          strokeWidth={STROKE}
          strokeDasharray={`${filled} ${c - filled}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      )}
      {item.progressPct > 8 && (
        <text
          x={lx}
          y={ly}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-600 text-[10px] font-semibold"
        >
          {item.progressPct}
        </text>
      )}
    </g>
  );
}

export function CorpsEtatProgressChart({
  items,
  title = "Avancement par corps d'état",
  className,
}: {
  items: CorpsEtatProgress[];
  title?: string;
  className?: string;
}) {
  const ordered = [...items].reverse();

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-[#003F72]">{title}</h3>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <svg
          viewBox="0 0 260 220"
          className="mx-auto h-[160px] w-[160px] shrink-0 sm:mx-0"
          role="img"
          aria-label={title}
        >
          {ordered.map((item, i) => (
            <ProgressRing key={item.code} item={item} index={i} />
          ))}
          <g transform={`translate(${CX - 44}, ${CY + 22})`}>
            {items.map((item, i) => (
              <g key={item.code} transform={`translate(0, ${i * 14})`}>
                <rect x={0} y={1} width={8} height={8} rx={1.5} fill={item.color} />
                <text x={12} y={9} className="fill-slate-600 text-[9px]">
                  {item.code}
                </text>
              </g>
            ))}
          </g>
        </svg>

        <div className="min-w-0 flex-1 space-y-2.5">
          {items.map((item) => (
            <div key={item.code} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="w-11 shrink-0 text-xs font-medium text-slate-700">
                {item.code}
              </span>
              <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${item.progressPct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-xs font-semibold text-slate-600">
                {item.progressPct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
