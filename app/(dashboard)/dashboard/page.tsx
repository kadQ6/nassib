"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// ─── Static demo data ─────────────────────────────────────────────────────────

const lotData = [
  { lot: "Gros Œuvre", avancement: 65 },
  { lot: "CFO",        avancement: 40 },
  { lot: "CFA",        avancement: 30 },
  { lot: "VDI",        avancement: 25 },
  { lot: "Gaz méd.",  avancement: 20 },
  { lot: "Plomberie", avancement: 35 },
  { lot: "CVC",        avancement: 25 },
  { lot: "Biomédical", avancement: 15 },
]

const reserveData = [
  { name: "Bloquante", value: 1 },
  { name: "Majeure",   value: 2 },
  { name: "Mineure",   value: 3 },
]

const RESERVE_COLORS = ["#ef4444", "#f97316", "#eab308"]

const statutLocaux = [
  { label: "En attente", count: 22, color: "bg-slate-300",  textColor: "text-slate-600" },
  { label: "En cours",   count: 20, color: "bg-blue-400",   textColor: "text-blue-700"  },
  { label: "Terminés",   count: 2,  color: "bg-emerald-500",textColor: "text-emerald-700"},
  { label: "Bloqués",    count: 1,  color: "bg-red-500",    textColor: "text-red-700"   },
]

const echeances = [
  {
    date: "20/06/2026",
    description: "Réception murs Bloc Opératoire A",
    responsable: "M. Kader",
    statut: "En cours",
    statutColor: "bg-blue-100 text-blue-700",
  },
  {
    date: "30/06/2026",
    description: "Livraison équipements CVC Zone 2",
    responsable: "Entreprise BTP+",
    statut: "En attente",
    statutColor: "bg-slate-100 text-slate-600",
  },
  {
    date: "15/07/2026",
    description: "Essais réseau VDI — Étage R+1",
    responsable: "M. Hamid",
    statut: "Planifié",
    statutColor: "bg-amber-100 text-amber-700",
  },
  {
    date: "01/08/2026",
    description: "Réception provisoire gaz médicaux",
    responsable: "Bureau de contrôle",
    statut: "En attente",
    statutColor: "bg-slate-100 text-slate-600",
  },
  {
    date: "31/08/2026",
    description: "Clôture BOQ Lot Plomberie",
    responsable: "M. Riad",
    statut: "Non démarré",
    statutColor: "bg-red-100 text-red-600",
  },
]

// ─── Custom bar tooltip ───────────────────────────────────────────────────────

interface BarTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-blue-600 font-bold">{payload[0].value}% avancement</p>
      </div>
    )
  }
  return null
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const totalLocaux = statutLocaux.reduce((s, x) => s + x.count, 0)

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tableau de bord — Polyclinique Cité Nassib
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Suivi en temps réel du chantier
        </p>
      </div>

      {/* ── Row 1: KPI cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

        {/* Avancement global */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Avancement global
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-blue-600 tabular-nums leading-none">
              42
            </span>
            <span className="text-xl font-bold text-blue-400">%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-700"
              style={{ width: "42%" }}
            />
          </div>
        </div>

        {/* Locaux terminés */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Locaux terminés
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-emerald-600 tabular-nums leading-none">
              2
            </span>
            <span className="text-xl font-bold text-slate-400">/ 45</span>
          </div>
          <p className="text-xs text-slate-400">locaux réceptionnés</p>
        </div>

        {/* Réserves ouvertes */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Réserves ouvertes
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-red-600 tabular-nums leading-none">
              5
            </span>
          </div>
          <p className="text-xs text-red-500 font-medium">dont 1 bloquante</p>
        </div>

        {/* Commandes en cours */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Commandes en cours
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-amber-600 tabular-nums leading-none">
              3
            </span>
          </div>
          <p className="text-xs text-slate-400">bons de commande actifs</p>
        </div>

        {/* Budget total */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Budget total
          </p>
          <div className="flex items-end gap-1 leading-none">
            <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">
              644,8M
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">FDJ — marché DJI FU SARL</p>
        </div>
      </div>

      {/* ── Row 2: Bar chart — Avancement par lot ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Avancement par lot (%)
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={lotData}
            margin={{ top: 8, right: 16, left: -20, bottom: 0 }}
            barCategoryGap="35%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="lot"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "#F1F5F9" }} />
            <Bar
              dataKey="avancement"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 3: Pie chart + Statut locaux ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Réserves par gravité */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">
            Réserves par gravité
          </h2>
          <div className="flex items-center justify-center">
            <PieChart width={280} height={220}>
              <Pie
                data={reserveData}
                cx={130}
                cy={100}
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {reserveData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RESERVE_COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${Number(value ?? 0)} réserve${Number(value ?? 0) > 1 ? 's' : ''}`, String(name)] as [string, string]}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              />
            </PieChart>
          </div>
        </div>

        {/* Statut des locaux */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-5">
            Statut des locaux
          </h2>
          <div className="space-y-4">
            {statutLocaux.map((item) => {
              const pct = Math.round((item.count / totalLocaux) * 100)
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${item.textColor}`}>
                      {item.label}
                    </span>
                    <span className="text-slate-600 font-semibold tabular-nums">
                      {item.count} local{item.count > 1 ? "ux" : ""}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{pct}% du total</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Row 4: Prochaines échéances ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Prochaines échéances
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-400 pb-3 pr-4 whitespace-nowrap">
                  Date
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-400 pb-3 pr-4">
                  Description
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-400 pb-3 pr-4 whitespace-nowrap">
                  Responsable
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-400 pb-3 whitespace-nowrap">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {echeances.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 font-medium">
                    {row.description}
                  </td>
                  <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                    {row.responsable}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.statutColor}`}
                    >
                      {row.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
