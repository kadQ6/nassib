"use client"

import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Calendar,
  Map,
  Wrench,
  Droplets,
  Activity,
  Package,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  Users,
  CheckSquare,
  Shield,
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  Info,
  CalendarClock,
  Flag,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const progressData = [
  { month: "Juin '25",  planned: 5,  actual: 4  },
  { month: "Juil '25", planned: 10, actual: 9  },
  { month: "Août '25", planned: 16, actual: 14 },
  { month: "Sep '25",  planned: 22, actual: 19 },
  { month: "Oct '25",  planned: 28, actual: 24 },
  { month: "Nov '25",  planned: 34, actual: 29 },
  { month: "Déc '25",  planned: 39, actual: 33 },
  { month: "Jan '26",  planned: 45, actual: 38 },
  { month: "Fév '26",  planned: 51, actual: null },
  { month: "Mar '26",  planned: 57, actual: null },
  { month: "Avr '26",  planned: 63, actual: null },
  { month: "Mai '26",  planned: 69, actual: null },
  { month: "Juin '26", planned: 75, actual: null },
  { month: "Juil '26", planned: 81, actual: null },
  { month: "Août '26", planned: 87, actual: null },
  { month: "Sep '26",  planned: 91, actual: null },
  { month: "Oct '26",  planned: 95, actual: null },
  { month: "Nov '26",  planned: 98, actual: null },
  { month: "Déc '26",  planned: 99, actual: null },
  { month: "Jan '27",  planned: 100, actual: null },
]

const IMC_BREAKDOWN = [
  { label: "Planning",      score: 16, max: 25, color: "bg-blue-500"   },
  { label: "Qualité",       score: 14, max: 20, color: "bg-emerald-500" },
  { label: "Appros",        score: 10, max: 15, color: "bg-orange-500"  },
  { label: "Technique",     score: 14, max: 20, color: "bg-violet-500"  },
  { label: "Financier",     score:  7, max: 10, color: "bg-slate-500"   },
  { label: "Documentation", score:  6, max: 10, color: "bg-amber-500"   },
]

const lastEvents = [
  {
    id: 1,
    type: "reserve",
    icon: AlertCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    title: "Réserve critique ouverte — Bloc Opératoire B",
    description: "Défaut d'étanchéité détecté sur le plafond de la salle 02",
    time: "Il y a 2h",
    severity: "critical" as const,
  },
  {
    id: 2,
    type: "document",
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "Plan d'exécution LOT-04 soumis pour validation",
    description: "Plans CVC révision B — 47 plans soumis",
    time: "Il y a 4h",
    severity: "info" as const,
  },
  {
    id: 3,
    type: "appro",
    icon: Truck,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    title: "Livraison critique en retard — Fluides médicaux",
    description: "Central vide médical — délai repoussé au 15/02/2026",
    time: "Il y a 6h",
    severity: "warning" as const,
  },
  {
    id: 4,
    type: "meeting",
    icon: Users,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
    title: "Compte rendu réunion de chantier n°24 publié",
    description: "14 actions assignées suite à la réunion du 10/01/2026",
    time: "Hier",
    severity: "info" as const,
  },
  {
    id: 5,
    type: "task",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
    title: "Milestone atteint — Structure béton R+2 terminée",
    description: "Phase 4.0 complétée avec 3 jours d'avance",
    time: "Il y a 2j",
    severity: "success" as const,
  },
]

const upcomingMilestones = [
  {
    id: 1,
    name: "Réception toiture et étanchéité",
    date: "28/02/2026",
    daysLeft: 46,
    progress: 72,
    status: "on_track" as const,
  },
  {
    id: 2,
    name: "Fin installation CVC — Zones critiques",
    date: "15/03/2026",
    daysLeft: 61,
    progress: 45,
    status: "at_risk" as const,
  },
  {
    id: 3,
    name: "Mise en service fluides médicaux",
    date: "30/06/2026",
    daysLeft: 168,
    progress: 18,
    status: "pending" as const,
  },
  {
    id: 4,
    name: "Réception provisoire des Blocs Opératoires",
    date: "31/10/2026",
    daysLeft: 291,
    progress: 8,
    status: "pending" as const,
  },
  {
    id: 5,
    name: "Livraison finale et réception définitive",
    date: "31/01/2027",
    daysLeft: 383,
    progress: 3,
    status: "pending" as const,
  },
]

const moduleCards = [
  {
    href: "/dashboard/planning",
    label: "Planning & Gantt",
    icon: Calendar,
    colorClass: "bg-blue-500",
    ringClass: "ring-blue-100",
    stat: "38%",
    statLabel: "avancement réel",
    badge: { label: "8 retards", variant: "destructive" as const },
  },
  {
    href: "/dashboard/lots",
    label: "Lots Techniques",
    icon: Wrench,
    colorClass: "bg-orange-500",
    ringClass: "ring-orange-100",
    stat: "10",
    statLabel: "lots actifs",
    badge: { label: "5 alertes", variant: "warning" as const },
  },
  {
    href: "/dashboard/reserves",
    label: "Réserves & NC",
    icon: AlertTriangle,
    colorClass: "bg-red-500",
    ringClass: "ring-red-100",
    stat: "23",
    statLabel: "réserves ouvertes",
    badge: { label: "5 critiques", variant: "destructive" as const },
  },
  {
    href: "/dashboard/budget",
    label: "Budget & Paiements",
    icon: DollarSign,
    colorClass: "bg-slate-600",
    ringClass: "ring-slate-100",
    stat: "42%",
    statLabel: "budget consommé",
    badge: null,
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    icon: FolderOpen,
    colorClass: "bg-amber-500",
    ringClass: "ring-amber-100",
    stat: "12",
    statLabel: "en attente validation",
    badge: { label: "12 en attente", variant: "warning" as const },
  },
  {
    href: "/dashboard/approvisionnements",
    label: "Approvisionnements",
    icon: Package,
    colorClass: "bg-purple-500",
    ringClass: "ring-purple-100",
    stat: "4",
    statLabel: "commandes critiques",
    badge: { label: "4 critiques", variant: "destructive" as const },
  },
  {
    href: "/dashboard/equipements",
    label: "Équipements Bioméd.",
    icon: Activity,
    colorClass: "bg-teal-500",
    ringClass: "ring-teal-100",
    stat: "142",
    statLabel: "équipements planifiés",
    badge: null,
  },
  {
    href: "/dashboard/essais",
    label: "Réception / OPR",
    icon: CheckSquare,
    colorClass: "bg-gray-500",
    ringClass: "ring-gray-100",
    stat: "0",
    statLabel: "OPR programmées",
    badge: null,
  },
  {
    href: "/dashboard/reunions",
    label: "Réunions",
    icon: Users,
    colorClass: "bg-cyan-600",
    ringClass: "ring-cyan-100",
    stat: "14",
    statLabel: "actions ouvertes",
    badge: null,
  },
  {
    href: "/dashboard/risques",
    label: "Risques",
    icon: Shield,
    colorClass: "bg-rose-600",
    ringClass: "ring-rose-100",
    stat: "18",
    statLabel: "risques identifiés",
    badge: { label: "3 critiques", variant: "destructive" as const },
  },
]

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number | null; color: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    const filtered = payload.filter((p) => p.value !== null)
    if (!filtered.length) return null
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-semibold text-slate-600 mb-2">{label}</p>
        {filtered.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-slate-600">
              {entry.name === "planned" ? "Prévu" : "Réel"}:{" "}
              <strong className="text-slate-800">{entry.value}%</strong>
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
  const IMC_SCORE = 67

  const imcColor =
    IMC_SCORE >= 80
      ? "text-green-600"
      : IMC_SCORE >= 60
      ? "text-orange-500"
      : "text-red-600"

  const imcBorderColor =
    IMC_SCORE >= 80
      ? "border-green-200"
      : IMC_SCORE >= 60
      ? "border-orange-200"
      : "border-red-200"

  const imcBg =
    IMC_SCORE >= 80
      ? "bg-green-50"
      : IMC_SCORE >= 60
      ? "bg-orange-50"
      : "bg-red-50"

  const imcBarColor =
    IMC_SCORE >= 80
      ? "bg-green-500"
      : IMC_SCORE >= 60
      ? "bg-orange-500"
      : "bg-red-500"

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* ── Section 1: Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tableau de Bord Chantier
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Polyclinique Cité Nassib —{" "}
            <span className="text-slate-600 font-medium">Suivi temps réel</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Mise à jour: 13 juin 2026
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 font-medium">
            <CalendarClock className="w-3.5 h-3.5" />
            01/06/2025 → 31/01/2027
          </span>
        </div>
      </div>

      {/* ── Section 2: IMC Score Card ─────────────────────────────────────────── */}
      <Card className={`border ${imcBorderColor} ${imcBg} shadow-sm`}>
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Score + label */}
            <div className="flex-shrink-0 text-center lg:text-left lg:w-52">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Indice de Maîtrise Chantier
              </p>
              <div className="flex items-baseline gap-1 justify-center lg:justify-start">
                <span className={`text-6xl font-black tabular-nums leading-none ${imcColor}`}>
                  {IMC_SCORE}
                </span>
                <span className={`text-2xl font-bold ${imcColor} opacity-60`}>/100</span>
              </div>
              <div className="mt-3 w-full bg-white/70 rounded-full h-3 overflow-hidden">
                <div
                  className={`${imcBarColor} h-3 rounded-full transition-all duration-700`}
                  style={{ width: `${IMC_SCORE}%` }}
                />
              </div>
              <p className={`mt-2 text-sm font-semibold ${imcColor}`}>
                ⚠ Vigilance — Des ajustements sont nécessaires
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {IMC_BREAKDOWN.map((item) => {
                const pct = Math.round((item.score / item.max) * 100)
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        {item.score}
                        <span className="text-slate-400 font-normal">/{item.max}</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/80 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">{pct}%</p>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: 5 Key Metric Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Avancement Prévu */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
              Avancement Prévu
            </p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-3xl font-black text-blue-600 tabular-nums leading-none">
                45
                <span className="text-xl font-bold">%</span>
              </span>
              <TrendingUp className="w-5 h-5 text-blue-300 mb-0.5" />
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>

        {/* 2. Avancement Réel */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
              Avancement Réel
            </p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-3xl font-black text-emerald-600 tabular-nums leading-none">
                38
                <span className="text-xl font-bold">%</span>
              </span>
              <Badge className="mb-0.5 bg-red-100 text-red-700 border-0 text-xs font-bold px-1.5 py-0.5">
                -7%
              </Badge>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "38%" }} />
            </div>
            <p className="text-xs text-red-500 font-medium mt-1">
              Écart: -7 pts vs prévu
            </p>
          </CardContent>
        </Card>

        {/* 3. Budget Consommé */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
              Budget Consommé
            </p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-3xl font-black text-slate-700 tabular-nums leading-none">
                42
                <span className="text-xl font-bold">%</span>
              </span>
              <TrendingUp className="w-5 h-5 text-slate-300 mb-0.5" />
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: "42%" }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">357M / 850M DJF</p>
          </CardContent>
        </Card>

        {/* 4. Réserves Ouvertes */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
              Réserves Ouvertes
            </p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-3xl font-black text-red-600 tabular-nums leading-none">
                23
              </span>
              <AlertTriangle className="w-5 h-5 text-red-200 mb-0.5" />
            </div>
            <p className="text-xs text-red-500 font-semibold mt-1.5">
              dont 5 critiques
            </p>
            <Link
              href="/dashboard/reserves"
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-0.5 mt-0.5 transition-colors"
            >
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>

        {/* 5. Tâches en Retard */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
              Tâches en Retard
            </p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-3xl font-black text-orange-600 tabular-nums leading-none">
                8
              </span>
              <TrendingDown className="w-5 h-5 text-orange-200 mb-0.5" />
            </div>
            <p className="text-xs text-orange-500 font-semibold mt-1.5">
              dont 2 critiques
            </p>
            <Link
              href="/dashboard/planning"
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-0.5 mt-0.5 transition-colors"
            >
              Voir planning <ChevronRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 4: Progress Chart ─────────────────────────────────────────── */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-2 px-5 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold text-slate-800">
              Courbe d&apos;Avancement — Prévu vs Réel
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="info" className="text-xs">
                Janv 2026 — Semaine 2
              </Badge>
              <Badge variant="warning" className="text-xs">
                Retard: 7 pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={progressData}
              margin={{ top: 10, right: 20, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                formatter={(value) =>
                  value === "planned" ? "Prévu" : "Réel"
                }
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="6 3"
                fill="url(#gradPlanned)"
                dot={false}
                activeDot={{ r: 4, fill: "#3B82F6" }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#gradActual)"
                dot={false}
                activeDot={{ r: 5, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Section 5: Module Cards Grid (2x5) ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
            Accès aux Modules
          </h2>
          <span className="text-xs text-slate-400">{moduleCards.length} modules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {moduleCards.map((mod) => {
            const Icon = mod.icon
            return (
              <Link key={mod.href} href={mod.href} className="group">
                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                    {/* Icon + arrow */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`${mod.colorClass} rounded-xl w-10 h-10 flex items-center justify-center shadow-sm ring-4 ${mod.ringClass} flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {mod.badge ? (
                        <Badge
                          variant={mod.badge.variant}
                          className="text-[10px] font-bold px-1.5 py-0.5 leading-none"
                        >
                          {mod.badge.label}
                        </Badge>
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors mt-0.5" />
                      )}
                    </div>

                    {/* Label + stat */}
                    <div>
                      <p className="text-xs font-semibold text-slate-700 leading-tight mb-1.5">
                        {mod.label}
                      </p>
                      <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">
                        {mod.stat}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.statLabel}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Section 6: Two columns — Events + Milestones ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Derniers Événements */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                Derniers Événements
              </CardTitle>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 transition-colors">
                Voir tout <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-0 divide-y divide-slate-50">
              {lastEvents.map((event) => {
                const Icon = event.icon
                return (
                  <div key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg ${event.iconBg} flex items-center justify-center mt-0.5`}
                    >
                      <Icon className={`w-4 h-4 ${event.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 leading-snug">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {event.description}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap pt-0.5">
                      {event.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Prochaines Échéances */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Flag className="w-4 h-4 text-slate-400" />
                Prochaines Échéances
              </CardTitle>
              <Link
                href="/dashboard/planning"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 transition-colors"
              >
                Planning <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {upcomingMilestones.map((m) => {
                const urgencyColor =
                  m.daysLeft <= 30
                    ? "text-red-600 bg-red-50"
                    : m.daysLeft <= 60
                    ? "text-orange-600 bg-orange-50"
                    : "text-slate-500 bg-slate-100"

                const barColor =
                  m.progress >= 70
                    ? "bg-green-500"
                    : m.progress >= 40
                    ? "bg-blue-500"
                    : m.progress >= 20
                    ? "bg-amber-500"
                    : "bg-slate-300"

                return (
                  <div key={m.id} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-700 leading-snug flex-1">
                        {m.name}
                      </p>
                      <span
                        className={`text-xs font-bold flex-shrink-0 rounded-md px-1.5 py-0.5 leading-none ${urgencyColor}`}
                      >
                        J-{m.daysLeft}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-9 text-right font-medium tabular-nums">
                        {m.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" />
                      {m.date}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Avancement par Lot Technique (bonus section) ──────────────────────── */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-2 px-5 pt-5">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Avancement par Lot Technique
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { code: "LOT-01", name: "Gros Œuvre et Structure",  progress: 78, color: "bg-slate-500",  status: "in_progress" },
              { code: "LOT-02", name: "Menuiseries Aluminium",     progress: 52, color: "bg-blue-500",   status: "in_progress" },
              { code: "LOT-03", name: "Plomberie Sanitaire",       progress: 44, color: "bg-cyan-500",   status: "in_progress" },
              { code: "LOT-04", name: "Génie Climatique CVC",      progress: 31, color: "bg-violet-500", status: "delayed"     },
              { code: "LOT-05", name: "Électricité CF",            progress: 36, color: "bg-amber-500",  status: "in_progress" },
              { code: "LOT-06", name: "Courants Faibles GTB",      progress: 22, color: "bg-green-500",  status: "in_progress" },
              { code: "LOT-07", name: "Fluides Médicaux",          progress: 18, color: "bg-red-500",    status: "delayed"     },
              { code: "LOT-08", name: "Revêtements et Carrelages", progress: 41, color: "bg-orange-500", status: "in_progress" },
              { code: "LOT-09", name: "Peinture et Finitions",     progress: 28, color: "bg-pink-500",   status: "in_progress" },
              { code: "LOT-10", name: "Équipements Biomédicaux",   progress:  8, color: "bg-teal-500",   status: "not_started" },
            ].map((lot) => (
              <div key={lot.code} className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-400">{lot.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-700 truncate">{lot.name}</span>
                    <span
                      className={`text-xs font-bold ml-2 flex-shrink-0 tabular-nums ${
                        lot.status === "delayed" ? "text-red-600" : "text-slate-600"
                      }`}
                    >
                      {lot.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${lot.color} h-1.5 rounded-full ${
                        lot.status === "delayed" ? "opacity-70" : ""
                      }`}
                      style={{ width: `${lot.progress}%` }}
                    />
                  </div>
                </div>
                {lot.status === "delayed" && (
                  <span className="text-[10px] bg-red-100 text-red-600 rounded px-1.5 py-0.5 font-bold flex-shrink-0">
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
