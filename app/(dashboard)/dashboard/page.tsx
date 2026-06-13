"use client"

import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Calendar,
  Map,
  Wrench,
  Droplet,
  Activity,
  Package,
  AlertTriangle,
  Folder,
  DollarSign,
  Users,
  BookOpen,
  CheckSquare,
  Shield,
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const progressData = [
  { month: "Juin '25", planned: 5, actual: 4 },
  { month: "Juil '25", planned: 10, actual: 9 },
  { month: "Août '25", planned: 16, actual: 14 },
  { month: "Sep '25", planned: 22, actual: 19 },
  { month: "Oct '25", planned: 28, actual: 24 },
  { month: "Nov '25", planned: 34, actual: 29 },
  { month: "Déc '25", planned: 39, actual: 33 },
  { month: "Jan '26", planned: 45, actual: 38 },
]

const lastEvents = [
  {
    id: 1,
    type: "reserve",
    title: "Réserve critique ouverte — Bloc Opératoire B",
    description: "Défaut d'étanchéité détecté sur le plafond de la salle 02",
    time: "Il y a 2h",
    severity: "critical",
  },
  {
    id: 2,
    type: "document",
    title: "Plan d'exécution LOT-04 soumis pour validation",
    description: "Plans CVC révision B — 47 plans soumis",
    time: "Il y a 4h",
    severity: "info",
  },
  {
    id: 3,
    type: "appro",
    title: "Livraison critique en retard — Fluides médicaux",
    description: "Central vide médical — délai repoussé au 15/02/2026",
    time: "Il y a 6h",
    severity: "warning",
  },
  {
    id: 4,
    type: "meeting",
    title: "Compte rendu réunion de chantier n°24 publié",
    description: "14 actions assignées suite à la réunion du 10/01/2026",
    time: "Hier",
    severity: "info",
  },
  {
    id: 5,
    type: "task",
    title: "Milestone atteint — Structure béton R+2 terminée",
    description: "Phase 4.0 complétée avec 3 jours d'avance",
    time: "Il y a 2j",
    severity: "success",
  },
]

const milestones = [
  {
    id: 1,
    name: "Réception toiture et étanchéité",
    date: "28/02/2026",
    daysLeft: 46,
    status: "pending",
    progress: 72,
  },
  {
    id: 2,
    name: "Fin installation CVC — Zones critiques",
    date: "15/03/2026",
    daysLeft: 61,
    status: "pending",
    progress: 45,
  },
  {
    id: 3,
    name: "Mise en service fluides médicaux",
    date: "30/06/2026",
    daysLeft: 168,
    status: "pending",
    progress: 18,
  },
  {
    id: 4,
    name: "Réception provisoire des Blocs Opératoires",
    date: "31/10/2026",
    daysLeft: 291,
    status: "pending",
    progress: 8,
  },
]

const moduleCards = [
  {
    href: "/dashboard/planning",
    label: "Planning & Gantt",
    icon: Calendar,
    color: "bg-blue-500",
    stat: "38%",
    statLabel: "avancement réel",
    alert: null,
  },
  {
    href: "/dashboard/zones",
    label: "Zones & Locaux",
    icon: Map,
    color: "bg-emerald-500",
    stat: "17",
    statLabel: "zones suivies",
    alert: null,
  },
  {
    href: "/dashboard/lots",
    label: "Lots Techniques",
    icon: Wrench,
    color: "bg-violet-500",
    stat: "10",
    statLabel: "lots actifs",
    alert: 2,
  },
  {
    href: "/dashboard/fluides",
    label: "Fluides Médicaux",
    icon: Droplet,
    color: "bg-cyan-500",
    stat: "24%",
    statLabel: "progression",
    alert: 1,
  },
  {
    href: "/dashboard/equipements",
    label: "Équipements Bio",
    icon: Activity,
    color: "bg-teal-500",
    stat: "142",
    statLabel: "équipements",
    alert: null,
  },
  {
    href: "/dashboard/approvisionnements",
    label: "Approvisionnements",
    icon: Package,
    color: "bg-orange-500",
    stat: "4",
    statLabel: "commandes critiques",
    alert: 4,
  },
  {
    href: "/dashboard/reserves",
    label: "Réserves & NC",
    icon: AlertTriangle,
    color: "bg-red-500",
    stat: "23",
    statLabel: "réserves ouvertes",
    alert: 5,
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    icon: Folder,
    color: "bg-amber-500",
    stat: "12",
    statLabel: "en attente validation",
    alert: 12,
  },
  {
    href: "/dashboard/budget",
    label: "Budget & BOQ",
    icon: DollarSign,
    color: "bg-slate-600",
    stat: "42%",
    statLabel: "budget consommé",
    alert: null,
  },
  {
    href: "/dashboard/reunions",
    label: "Réunions",
    icon: Users,
    color: "bg-indigo-500",
    stat: "14",
    statLabel: "actions ouvertes",
    alert: null,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  color,
}: {
  label: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color: string
}) {
  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-4">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">{label}</p>
        <div className="flex items-end justify-between">
          <p className={`text-2xl font-bold ${color}`}>
            {value}
            {unit && <span className="text-base font-medium ml-0.5">{unit}</span>}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-500"
            }`}>
              {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : null}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AlertCard({
  label,
  count,
  sublabel,
  color,
  bgColor,
  href,
}: {
  label: string
  count: number
  sublabel: string
  color: string
  bgColor: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className={`${bgColor} border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
            <p className={`text-sm font-semibold ${color}`}>{label}</p>
            <p className={`text-xs ${color} opacity-70`}>{sublabel}</p>
          </div>
          <ChevronRight className={`w-5 h-5 ${color} opacity-50`} />
        </CardContent>
      </Card>
    </Link>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-600">
              {entry.name === "planned" ? "Prévu" : "Réel"}: <strong>{entry.value}%</strong>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const imc = 67 // Indice de Maîtrise Chantier

  const imcColor =
    imc >= 80 ? "text-green-600" : imc >= 60 ? "text-amber-600" : "text-red-600"
  const imcBg =
    imc >= 80 ? "bg-green-50 border-green-200" : imc >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
  const imcLabel =
    imc >= 80 ? "Maîtrise satisfaisante" : imc >= 60 ? "Vigilance requise" : "Situation critique"
  const imcProgressColor =
    imc >= 80 ? "bg-green-500" : imc >= 60 ? "bg-amber-500" : "bg-red-500"

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Tableau de Bord
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Polyclinique Cité Nassib ·{" "}
            <span className="font-medium">01/06/2025 → 31/01/2027</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5" />
          Mis à jour le 13/01/2026
        </div>
      </div>

      {/* Top row: IMC + key metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* IMC Gauge */}
        <Card className={`lg:col-span-1 border ${imcBg} shadow-sm`}>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">
              Indice de Maîtrise Chantier
            </p>
            <div className="relative inline-flex items-center justify-center">
              <div className={`text-5xl font-black ${imcColor}`}>{imc}</div>
              <div className={`absolute -top-1 -right-4 text-lg font-bold ${imcColor}`}>/100</div>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-3">
              <div
                className={`${imcProgressColor} h-3 rounded-full transition-all`}
                style={{ width: `${imc}%` }}
              />
            </div>
            <p className={`mt-2 text-sm font-semibold ${imcColor}`}>{imcLabel}</p>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Avancement prévu"
            value={45}
            unit="%"
            color="text-blue-600"
          />
          <MetricCard
            label="Avancement réel"
            value={38}
            unit="%"
            trend="down"
            trendValue="-7 pts"
            color="text-amber-600"
          />
          <MetricCard
            label="Écart planning"
            value="-7"
            unit=" pts"
            trend="down"
            trendValue="En retard"
            color="text-red-600"
          />
          <MetricCard
            label="Budget consommé"
            value={42}
            unit="%"
            color="text-slate-700"
          />
        </div>
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <AlertCard
          count={8}
          label="tâches en retard"
          sublabel="dont 2 critiques"
          color="text-red-700"
          bgColor="bg-red-50"
          href="/dashboard/planning"
        />
        <AlertCard
          count={23}
          label="réserves ouvertes"
          sublabel="5 critiques"
          color="text-red-700"
          bgColor="bg-red-50"
          href="/dashboard/reserves"
        />
        <AlertCard
          count={5}
          label="réserves critiques"
          sublabel="délai dépassé"
          color="text-orange-700"
          bgColor="bg-orange-50"
          href="/dashboard/reserves"
        />
        <AlertCard
          count={12}
          label="docs en attente"
          sublabel="validation requise"
          color="text-amber-700"
          bgColor="bg-amber-50"
          href="/dashboard/documents"
        />
        <AlertCard
          count={4}
          label="appros critiques"
          sublabel="livraison risquée"
          color="text-purple-700"
          bgColor="bg-purple-50"
          href="/dashboard/approvisionnements"
        />
      </div>

      {/* Chart + Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress chart */}
        <Card className="lg:col-span-2 bg-white shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Avancement Prévu vs Réel
              </CardTitle>
              <Badge variant="warning" className="text-xs">
                Retard: 7 pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-slate-600">
                      {value === "planned" ? "Prévu" : "Réel"}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorPlanned)"
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#colorActual)"
                  dot={{ r: 3, fill: "#F59E0B", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Prochains Jalons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((m) => (
              <div key={m.id} className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-slate-700 leading-tight">{m.name}</p>
                  <span className={`text-xs font-semibold flex-shrink-0 ${
                    m.daysLeft <= 30 ? "text-red-600" : m.daysLeft <= 60 ? "text-amber-600" : "text-slate-500"
                  }`}>
                    J-{m.daysLeft}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        m.progress >= 80 ? "bg-green-500" : m.progress >= 50 ? "bg-blue-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{m.progress}%</span>
                </div>
                <p className="text-xs text-slate-400">{m.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Module cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Accès rapide aux modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {moduleCards.map((mod) => {
            const Icon = mod.icon
            return (
              <Link key={mod.href} href={mod.href}>
                <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${mod.color} rounded-lg w-9 h-9 flex items-center justify-center shadow-sm`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {mod.alert && mod.alert > 0 ? (
                        <span className="text-xs font-bold bg-red-100 text-red-700 rounded-full px-1.5 py-0.5">
                          {mod.alert}
                        </span>
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">
                      {mod.label}
                    </p>
                    <p className="text-lg font-bold text-slate-900">{mod.stat}</p>
                    <p className="text-xs text-slate-400">{mod.statLabel}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Last events */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Derniers Événements
            </CardTitle>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {lastEvents.map((event, idx) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 py-3 ${
                  idx < lastEvents.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  event.severity === "critical" ? "bg-red-500" :
                  event.severity === "warning" ? "bg-amber-500" :
                  event.severity === "success" ? "bg-green-500" :
                  "bg-blue-500"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 leading-tight">
                    {event.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {event.description}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lots progress */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Avancement par Lot Technique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { code: "LOT-01", name: "Gros Œuvre et Structure", progress: 78, color: "bg-slate-500", status: "in_progress" },
              { code: "LOT-02", name: "Menuiseries Aluminium", progress: 52, color: "bg-blue-500", status: "in_progress" },
              { code: "LOT-03", name: "Plomberie Sanitaire", progress: 44, color: "bg-cyan-500", status: "in_progress" },
              { code: "LOT-04", name: "Génie Climatique CVC", progress: 31, color: "bg-violet-500", status: "delayed" },
              { code: "LOT-05", name: "Électricité CF", progress: 36, color: "bg-amber-500", status: "in_progress" },
              { code: "LOT-06", name: "Courants Faibles GTB", progress: 22, color: "bg-green-500", status: "in_progress" },
              { code: "LOT-07", name: "Fluides Médicaux", progress: 18, color: "bg-red-500", status: "delayed" },
              { code: "LOT-08", name: "Revêtements et Carrelages", progress: 41, color: "bg-orange-500", status: "in_progress" },
              { code: "LOT-09", name: "Peinture et Finitions", progress: 28, color: "bg-pink-500", status: "in_progress" },
              { code: "LOT-10", name: "Équipements Biomédicaux", progress: 8, color: "bg-teal-500", status: "not_started" },
            ].map((lot) => (
              <div key={lot.code} className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0">
                  <span className="text-xs font-mono font-semibold text-slate-500">{lot.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-700 truncate">{lot.name}</span>
                    <span className={`text-xs font-semibold ml-2 flex-shrink-0 ${
                      lot.status === "delayed" ? "text-red-600" : "text-slate-600"
                    }`}>
                      {lot.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`${lot.color} h-1.5 rounded-full ${
                        lot.status === "delayed" ? "opacity-70" : ""
                      }`}
                      style={{ width: `${lot.progress}%` }}
                    />
                  </div>
                </div>
                {lot.status === "delayed" && (
                  <span className="text-xs bg-red-100 text-red-600 rounded px-1.5 py-0.5 font-medium flex-shrink-0">
                    Retard
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
