"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BOQ_META,
  boqBudgetPieData,
  boqChartData,
  boqDashboardKpis,
  buildBoqCorpsEtatRows,
  type BoqCorpsEtatRow,
} from "@/lib/nassib/boq-dashboard";
import { formatDate, formatFdj, cn } from "@/lib/utils";

function BoqKpiRow({ kpis }: { kpis: ReturnType<typeof boqDashboardKpis> }) {
  const items = [
    {
      label: "Budget total HT",
      value: formatFdj(kpis.totalHt),
      sub: `${kpis.corpsCount} corps d'état`,
      icon: DollarSign,
      valueClass: "text-[#003F72]",
      iconClass: "bg-[#003F72]/10 text-[#003F72]",
    },
    {
      label: "Acomptes versés",
      value: formatFdj(kpis.totalAcomptes),
      sub: `${kpis.acomptesPct} % du marché`,
      icon: CreditCard,
      valueClass: "text-emerald-600",
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Reste à payer",
      value: formatFdj(kpis.totalReste),
      sub: `${kpis.restePct} % du marché`,
      icon: TrendingUp,
      valueClass: "text-[#F97316]",
      iconClass: "bg-orange-100 text-[#F97316]",
    },
    {
      label: "Avancement global",
      value: `${kpis.globalProgressPct}%`,
      sub: "Tous corps d'état",
      icon: Activity,
      valueClass: "text-violet-600",
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              item.iconClass,
            )}
          >
            <item.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className={cn("truncate text-lg font-bold", item.valueClass)}>
              {item.value}
            </p>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="text-xs text-slate-400">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BoqCharts({ rows }: { rows: BoqCorpsEtatRow[] }) {
  const barData = useMemo(() => boqChartData(rows), [rows]);
  const pieData = useMemo(() => boqBudgetPieData(rows), [rows]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-[#003F72]">
          Avancement par corps d&apos;état (%)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => [`${v}%`, "Avancement"]} />
              <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.code} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-[#003F72]">
          Répartition du budget
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, _n, item) => {
                  const amount = typeof v === "number" ? v : 0;
                  const pct = (item?.payload as { pct?: number })?.pct ?? 0;
                  return [formatFdj(amount), `${pct}%`];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {pieData.map((d) => (
            <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.fill }}
              />
              {d.name} — {d.pct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CorpsEtatRow({
  row,
  expanded,
  onToggle,
}: {
  row: BoqCorpsEtatRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
        onClick={onToggle}
      >
        <td className="py-3 pl-3 pr-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </td>
        <td className="py-3 pr-3 font-semibold text-slate-800">{row.code}</td>
        <td className="max-w-xs py-3 pr-3 text-slate-700">{row.designation}</td>
        <td className="py-3 pr-3">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              row.typeBadgeClass,
            )}
          >
            {row.type}
          </span>
        </td>
        <td className="py-3 pr-3 font-medium text-slate-800">
          {formatFdj(row.amountHt)}
        </td>
        <td className="py-3 pr-3 font-medium text-emerald-600">
          {formatFdj(row.acomptes)}
        </td>
        <td className="py-3 pr-3 font-medium text-[#F97316]">
          {formatFdj(row.reste)}
        </td>
        <td className="py-3 pr-3">
          <div className="flex min-w-[100px] items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0891B2]"
                style={{ width: `${row.progressPct}%` }}
              />
            </div>
            <span className="w-8 text-xs font-semibold text-slate-600">
              {row.progressPct}%
            </span>
          </div>
        </td>
        <td className="py-3 pr-3">
          <Badge variant="info">En cours</Badge>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50/80">
          <td colSpan={9} className="px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Postes — {row.children.length} ligne(s)
            </p>
            <div className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-slate-500">
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">Qté</th>
                    <th className="px-3 py-2">PU HT</th>
                    <th className="px-3 py-2">Montant HT</th>
                  </tr>
                </thead>
                <tbody>
                  {row.children.slice(0, 50).map((line) => (
                    <tr key={line.id} className="border-b border-slate-50">
                      <td className="px-3 py-1.5 font-mono text-xs">{line.code}</td>
                      <td className="px-3 py-1.5">{line.description}</td>
                      <td className="px-3 py-1.5">
                        {line.qtyContract} {line.unit}
                      </td>
                      <td className="px-3 py-1.5">{formatFdj(line.unitPrice)}</td>
                      <td className="px-3 py-1.5">
                        {formatFdj(line.qtyContract * line.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {row.children.length > 50 && (
                <p className="p-2 text-center text-xs text-slate-400">
                  … {row.children.length - 50} lignes supplémentaires
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function BoqDashboard({ boqLines }: { boqLines?: import("@/types/nassib").BoqLine[] }) {
  const rows = useMemo(
    () => buildBoqCorpsEtatRows(boqLines),
    [boqLines],
  );
  const kpis = useMemo(() => boqDashboardKpis(rows), [rows]);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003F72]">
            BOQ — Bordereau des prix
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Polyclinique Cité Nassib · {BOQ_META.emitter} ·{" "}
            {formatDate(BOQ_META.validatedAt)} · Total HT :{" "}
            {formatFdj(BOQ_META.totalHt)}
          </p>
        </div>
        <Badge variant="brand">{kpis.corpsCount} corps d&apos;état</Badge>
      </div>

      <BoqKpiRow kpis={kpis} />

      <BoqCharts rows={rows} />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-[#003F72]">
            Détail des corps d&apos;état — cliquez pour voir les postes
          </h3>
          <Link href="/boq/paiements">
            <Button variant="outline" size="sm">
              Documents de paiement →
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="w-8 py-3 pl-3" />
                <th className="py-3 pr-3">Code</th>
                <th className="py-3 pr-3">Désignation</th>
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Montant HT (FDJ)</th>
                <th className="py-3 pr-3">Acomptes</th>
                <th className="py-3 pr-3">Reste</th>
                <th className="py-3 pr-3">Avancement</th>
                <th className="py-3 pr-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <CorpsEtatRow
                  key={row.code}
                  row={row}
                  expanded={expanded === row.code}
                  onToggle={() =>
                    setExpanded((c) => (c === row.code ? null : row.code))
                  }
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                <td colSpan={4} className="py-3 pl-3 pr-3 text-[#003F72]">
                  TOTAL HT — {BOQ_META.emitter}
                </td>
                <td className="py-3 pr-3 text-[#003F72]">
                  {formatFdj(kpis.totalHt)}
                </td>
                <td className="py-3 pr-3 text-emerald-600">
                  {formatFdj(kpis.totalAcomptes)}
                </td>
                <td className="py-3 pr-3 text-[#F97316]">
                  {formatFdj(kpis.totalReste)}
                </td>
                <td colSpan={2} className="py-3 pr-3 text-slate-600">
                  {kpis.globalProgressPct} % global
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
