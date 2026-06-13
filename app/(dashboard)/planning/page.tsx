"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Plus,
  Calendar,
  Filter,
  ChevronDown,
  X,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = "not_started" | "in_progress" | "completed" | "delayed" | "blocked" | "not_planned"
type LotCode = "LOT-GC" | "LOT-CFO" | "LOT-CFA" | "LOT-CVC" | "LOT-PLB" | "LOT-FLU" | "LOT-VRD" | "LOT-BIO"
type PhaseCode = "4.0" | "5.0" | "12.0" | "13.0" | "14.0" | "15.0" | "16.0" | "26.0"

interface PlanningTask {
  id: string
  wbs_code: string
  name: string
  lot: LotCode
  responsible: string
  planned_start: string
  planned_end: string
  duration: number
  progress: number
  status: TaskStatus
  margin: number
  phase: PhaseCode
  is_critical: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TASKS: PlanningTask[] = [
  {
    id: "T01", wbs_code: "4.2.1", name: "Structure béton RDC", lot: "LOT-GC",
    responsible: "M. Belkacemi", planned_start: "2025-06-01", planned_end: "2025-09-15",
    duration: 106, progress: 100, status: "completed", margin: 0, phase: "4.0", is_critical: false,
  },
  {
    id: "T02", wbs_code: "4.2.2", name: "Structure béton R+1", lot: "LOT-GC",
    responsible: "M. Belkacemi", planned_start: "2025-09-16", planned_end: "2025-12-01",
    duration: 76, progress: 85, status: "in_progress", margin: 3, phase: "4.0", is_critical: false,
  },
  {
    id: "T03", wbs_code: "5.1.1", name: "Cloisonnement RDC", lot: "LOT-GC",
    responsible: "M. Tlemçani", planned_start: "2025-10-01", planned_end: "2025-12-15",
    duration: 75, progress: 60, status: "in_progress", margin: 5, phase: "5.0", is_critical: false,
  },
  {
    id: "T04", wbs_code: "14.1.1", name: "Installations CFO RDC", lot: "LOT-CFO",
    responsible: "K. Aïssaoui", planned_start: "2025-11-01", planned_end: "2026-02-28",
    duration: 119, progress: 45, status: "delayed", margin: -8, phase: "14.0", is_critical: true,
  },
  {
    id: "T05", wbs_code: "14.1.2", name: "Installations CFO R+1", lot: "LOT-CFO",
    responsible: "K. Aïssaoui", planned_start: "2025-12-01", planned_end: "2026-03-31",
    duration: 120, progress: 20, status: "in_progress", margin: 2, phase: "14.0", is_critical: false,
  },
  {
    id: "T06", wbs_code: "13.1.1", name: "Réseau CVC niveau R+1", lot: "LOT-CVC",
    responsible: "A. Hamdani", planned_start: "2025-11-15", planned_end: "2026-03-15",
    duration: 120, progress: 30, status: "in_progress", margin: 4, phase: "13.0", is_critical: false,
  },
  {
    id: "T07", wbs_code: "16.1.1", name: "Fluides médicaux bloc", lot: "LOT-FLU",
    responsible: "S. Benali", planned_start: "2025-12-01", planned_end: "2026-06-30",
    duration: 211, progress: 10, status: "blocked", margin: -15, phase: "16.0", is_critical: true,
  },
  {
    id: "T08", wbs_code: "10.2.1", name: "Faux plafonds urgences", lot: "LOT-GC",
    responsible: "M. Tlemçani", planned_start: "2026-02-01", planned_end: "2026-04-30",
    duration: 88, progress: 0, status: "not_started", margin: 10, phase: "5.0", is_critical: false,
  },
  {
    id: "T09", wbs_code: "12.2.1", name: "Essais plomberie", lot: "LOT-PLB",
    responsible: "R. Meziane", planned_start: "2026-05-01", planned_end: "2026-06-15",
    duration: 45, progress: 0, status: "not_planned", margin: 7, phase: "12.0", is_critical: false,
  },
  {
    id: "T10", wbs_code: "13.2.2", name: "CVC bloc césarienne", lot: "LOT-CVC",
    responsible: "A. Hamdani", planned_start: "2026-01-01", planned_end: "2026-04-30",
    duration: 119, progress: 5, status: "in_progress", margin: 3, phase: "13.0", is_critical: true,
  },
  {
    id: "T11", wbs_code: "15.1.1", name: "Réseau CFA courants faibles", lot: "LOT-CFA",
    responsible: "N. Ouali", planned_start: "2025-12-15", planned_end: "2026-04-30",
    duration: 136, progress: 25, status: "in_progress", margin: 6, phase: "15.0", is_critical: false,
  },
  {
    id: "T12", wbs_code: "16.2.1", name: "Oxygène médical RDC", lot: "LOT-FLU",
    responsible: "S. Benali", planned_start: "2026-01-15", planned_end: "2026-05-31",
    duration: 136, progress: 5, status: "blocked", margin: -20, phase: "16.0", is_critical: true,
  },
  {
    id: "T13", wbs_code: "12.1.2", name: "Plomberie sanitaire R+1", lot: "LOT-PLB",
    responsible: "R. Meziane", planned_start: "2025-12-01", planned_end: "2026-03-15",
    duration: 104, progress: 35, status: "in_progress", margin: 2, phase: "12.0", is_critical: false,
  },
  {
    id: "T14", wbs_code: "14.2.3", name: "Tableau électrique TGBT", lot: "LOT-CFO",
    responsible: "K. Aïssaoui", planned_start: "2025-10-01", planned_end: "2025-12-31",
    duration: 91, progress: 70, status: "delayed", margin: -5, phase: "14.0", is_critical: true,
  },
  {
    id: "T15", wbs_code: "5.2.1", name: "Carrelage bloc opératoire", lot: "LOT-GC",
    responsible: "M. Tlemçani", planned_start: "2026-03-01", planned_end: "2026-05-31",
    duration: 91, progress: 0, status: "not_started", margin: 8, phase: "5.0", is_critical: false,
  },
  {
    id: "T16", wbs_code: "26.1.1", name: "Essais CVC complets", lot: "LOT-CVC",
    responsible: "A. Hamdani", planned_start: "2026-07-01", planned_end: "2026-08-31",
    duration: 61, progress: 0, status: "not_planned", margin: 12, phase: "26.0", is_critical: false,
  },
  {
    id: "T17", wbs_code: "15.2.1", name: "SSI — Détection incendie RDC", lot: "LOT-CFA",
    responsible: "N. Ouali", planned_start: "2026-02-01", planned_end: "2026-05-15",
    duration: 103, progress: 0, status: "not_started", margin: 5, phase: "15.0", is_critical: false,
  },
  {
    id: "T18", wbs_code: "16.3.1", name: "Vide médical bloc", lot: "LOT-FLU",
    responsible: "S. Benali", planned_start: "2026-02-01", planned_end: "2026-07-31",
    duration: 180, progress: 0, status: "blocked", margin: -10, phase: "16.0", is_critical: true,
  },
  {
    id: "T19", wbs_code: "13.3.1", name: "Ventilation salle de réveil", lot: "LOT-CVC",
    responsible: "A. Hamdani", planned_start: "2026-01-15", planned_end: "2026-04-15",
    duration: 90, progress: 15, status: "in_progress", margin: 7, phase: "13.0", is_critical: false,
  },
  {
    id: "T20", wbs_code: "12.3.1", name: "Réseau incendie sprinklers", lot: "LOT-PLB",
    responsible: "R. Meziane", planned_start: "2026-01-01", planned_end: "2026-04-30",
    duration: 119, progress: 20, status: "delayed", margin: -3, phase: "12.0", is_critical: true,
  },
]

// Project timeline: Jun 2025 – Jan 2027
const PROJECT_START = new Date("2025-06-01")
const PROJECT_END = new Date("2027-01-31")
const TODAY = new Date("2026-01-13")

const TOTAL_DAYS = Math.ceil((PROJECT_END.getTime() - PROJECT_START.getTime()) / 86400000)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusLabel(s: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    not_started: "Non démarré",
    in_progress: "En cours",
    completed: "Terminé",
    delayed: "En retard",
    blocked: "Bloqué",
    not_planned: "Non planifié",
  }
  return map[s]
}

function statusBadgeVariant(s: TaskStatus): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" {
  const map: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
    not_started: "secondary",
    in_progress: "info",
    completed: "success",
    delayed: "destructive",
    blocked: "warning",
    not_planned: "outline",
  }
  return map[s]
}

function ganttBarColor(s: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    not_started: "#9CA3AF",
    in_progress: "#3B82F6",
    completed: "#22C55E",
    delayed: "#EF4444",
    blocked: "#F97316",
    not_planned: "#CBD5E1",
  }
  return map[s]
}

function dayOffset(dateStr: string): number {
  const d = new Date(dateStr)
  return Math.max(0, Math.ceil((d.getTime() - PROJECT_START.getTime()) / 86400000))
}

function pct(days: number): string {
  return `${((days / TOTAL_DAYS) * 100).toFixed(2)}%`
}

function lotName(code: LotCode): string {
  const map: Record<LotCode, string> = {
    "LOT-GC": "Gros Œuvre",
    "LOT-CFO": "Courant Fort",
    "LOT-CFA": "Courant Faible",
    "LOT-CVC": "Climatisation",
    "LOT-PLB": "Plomberie",
    "LOT-FLU": "Fluides Méd.",
    "LOT-VRD": "VRD",
    "LOT-BIO": "Biomédical",
  }
  return map[code]
}

// Gantt months labels
function buildMonthTicks(): { label: string; left: string }[] {
  const ticks: { label: string; left: string }[] = []
  const cur = new Date(PROJECT_START)
  cur.setDate(1)
  while (cur <= PROJECT_END) {
    const offset = Math.max(0, Math.ceil((cur.getTime() - PROJECT_START.getTime()) / 86400000))
    ticks.push({
      label: cur.toLocaleString("fr-FR", { month: "short", year: "2-digit" }),
      left: pct(offset),
    })
    cur.setMonth(cur.getMonth() + 1)
  }
  return ticks
}

const MONTH_TICKS = buildMonthTicks()
const TODAY_LEFT = pct(dayOffset(TODAY.toISOString().split("T")[0]))

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value, status }: { value: number; status: TaskStatus }) {
  const color =
    status === "completed" ? "bg-green-500" :
    status === "delayed" ? "bg-red-500" :
    status === "blocked" ? "bg-orange-500" :
    "bg-blue-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[60px]">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-600 w-8 text-right font-medium">{value}%</span>
    </div>
  )
}

function MarginBadge({ margin }: { margin: number }) {
  if (margin < 0) return <span className="text-xs font-semibold text-red-600">{margin}j</span>
  if (margin === 0) return <span className="text-xs font-semibold text-amber-600">0j</span>
  return <span className="text-xs font-semibold text-green-600">+{margin}j</span>
}

interface NewTaskFormData {
  wbs_code: string
  name: string
  lot: LotCode
  responsible: string
  planned_start: string
  planned_end: string
}

function NewTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<NewTaskFormData>({
    wbs_code: "", name: "", lot: "LOT-GC", responsible: "",
    planned_start: "2026-02-01", planned_end: "2026-04-30",
  })
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle Tâche Planning</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Code WBS</label>
              <input
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 14.1.3"
                value={form.wbs_code}
                onChange={(e) => setForm({ ...form, wbs_code: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Lot</label>
              <select
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.lot}
                onChange={(e) => setForm({ ...form, lot: e.target.value as LotCode })}
              >
                {(["LOT-GC","LOT-CFO","LOT-CFA","LOT-CVC","LOT-PLB","LOT-FLU","LOT-VRD","LOT-BIO"] as LotCode[]).map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Nom de la tâche</label>
            <input
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description de la tâche..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Responsable</label>
            <input
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du responsable"
              value={form.responsible}
              onChange={(e) => setForm({ ...form, responsible: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Début prévu</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.planned_start}
                onChange={(e) => setForm({ ...form, planned_start: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Fin prévue</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.planned_end}
                onChange={(e) => setForm({ ...form, planned_end: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Créer la tâche
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlanningPage() {
  const [activeTab, setActiveTab] = useState("wbs")
  const [filterLot, setFilterLot] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [newTaskOpen, setNewTaskOpen] = useState(false)

  const filtered = TASKS.filter((t) => {
    if (filterLot !== "all" && t.lot !== filterLot) return false
    if (filterStatus !== "all" && t.status !== filterStatus) return false
    return true
  })

  const delayed = TASKS.filter((t) => t.status === "delayed" || t.status === "blocked")
  const critical = TASKS.filter((t) => t.is_critical)
  const onTrack = TASKS.filter((t) => t.status === "in_progress" && t.margin >= 0)
  const completed = TASKS.filter((t) => t.status === "completed")

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Planning & Gantt</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Polyclinique Cité Nassib · Juin 2025 → Jan 2027
          </p>
        </div>
        <div className="flex items-center gap-2">
          {delayed.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {delayed.length} tâche(s) en alerte
            </div>
          )}
          <button
            onClick={() => setNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          className="border border-slate-200 rounded-md px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterLot}
          onChange={(e) => setFilterLot(e.target.value)}
        >
          <option value="all">Tous les lots</option>
          {(["LOT-GC","LOT-CFO","LOT-CFA","LOT-CVC","LOT-PLB","LOT-FLU","LOT-VRD","LOT-BIO"] as LotCode[]).map(l => (
            <option key={l} value={l}>{l} — {lotName(l)}</option>
          ))}
        </select>
        <select
          className="border border-slate-200 rounded-md px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="not_started">Non démarré</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
          <option value="delayed">En retard</option>
          <option value="blocked">Bloqué</option>
          <option value="not_planned">Non planifié</option>
        </select>
        {(filterLot !== "all" || filterStatus !== "all") && (
          <button
            onClick={() => { setFilterLot("all"); setFilterStatus("all") }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 rounded-md px-2 py-1.5"
          >
            <X className="w-3 h-3" /> Réinitialiser
          </button>
        )}
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} tâche(s)</span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="wbs">Tableau WBS</TabsTrigger>
          <TabsTrigger value="gantt">Diagramme Gantt</TabsTrigger>
          <TabsTrigger value="recap">Récapitulatif</TabsTrigger>
        </TabsList>

        {/* ── WBS TABLE TAB ── */}
        <TabsContent value="wbs">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Code WBS</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 min-w-[200px]">Tâche</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Lot</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Responsable</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Début Prévu</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Fin Prévue</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600">Durée</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 min-w-[120px]">% Avancement</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600">Statut</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600">Marge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((task, idx) => (
                      <tr
                        key={task.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          task.status === "delayed" ? "bg-red-50/30" :
                          task.status === "blocked" ? "bg-orange-50/30" : ""
                        }`}
                      >
                        <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                          {task.wbs_code}
                          {task.is_critical && <span className="ml-1 text-red-500">●</span>}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-800">
                          {task.name}
                          {(task.status === "delayed" || task.status === "blocked") && (
                            <AlertTriangle className="inline-block ml-1.5 w-3 h-3 text-red-500" />
                          )}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="font-mono text-slate-500">{task.lot}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{task.responsible}</td>
                        <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap font-mono">
                          {new Date(task.planned_start).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap font-mono">
                          {new Date(task.planned_end).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{task.duration}j</td>
                        <td className="px-3 py-2.5">
                          <ProgressBar value={task.progress} status={task.status} />
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant={statusBadgeVariant(task.status)} className="text-xs whitespace-nowrap">
                            {statusLabel(task.status)}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5">
                          <MarginBadge margin={task.margin} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── GANTT TAB ── */}
        <TabsContent value="gantt">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader className="pb-2 px-4 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Diagramme de Gantt — Polyclinique Cité Nassib
                </CardTitle>
                <div className="flex items-center gap-4 text-xs">
                  {[
                    { color: "bg-blue-500", label: "En cours" },
                    { color: "bg-green-500", label: "Terminé" },
                    { color: "bg-red-500", label: "En retard" },
                    { color: "bg-gray-400", label: "Non démarré" },
                    { color: "bg-orange-500", label: "Bloqué" },
                  ].map((l) => (
                    <span key={l.label} className="flex items-center gap-1 text-slate-600">
                      <span className={`w-3 h-2 rounded-sm ${l.color} inline-block`} />
                      {l.label}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-0.5 h-4 bg-red-500 inline-block" />
                    Aujourd&apos;hui
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Month header */}
                  <div className="flex border-b border-slate-200 bg-slate-50">
                    <div className="w-56 flex-shrink-0 px-3 py-2 text-xs font-semibold text-slate-600 border-r border-slate-200">
                      Tâche
                    </div>
                    <div className="flex-1 relative h-8">
                      {MONTH_TICKS.map((tick, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 flex items-center"
                          style={{ left: tick.left }}
                        >
                          <span className="text-xs text-slate-500 pl-1 whitespace-nowrap">{tick.label}</span>
                          <div className="absolute top-0 bottom-0 w-px bg-slate-200" />
                        </div>
                      ))}
                      {/* Today line in header */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500/60 z-10"
                        style={{ left: TODAY_LEFT }}
                      />
                    </div>
                  </div>

                  {/* Task rows */}
                  {filtered.map((task) => {
                    const startPct = pct(dayOffset(task.planned_start))
                    const widthPct = pct(task.duration)
                    const barColor = ganttBarColor(task.status)
                    return (
                      <div key={task.id} className="flex border-b border-slate-100 hover:bg-slate-50/50">
                        <div className="w-56 flex-shrink-0 px-3 py-1.5 border-r border-slate-100">
                          <div className="flex items-center gap-1">
                            {task.is_critical && <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />}
                            <span className="text-xs text-slate-700 truncate" title={task.name}>{task.name}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{task.wbs_code}</span>
                        </div>
                        <div className="flex-1 relative" style={{ height: "42px" }}>
                          {/* Month grid lines */}
                          {MONTH_TICKS.map((tick, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 w-px bg-slate-100"
                              style={{ left: tick.left }}
                            />
                          ))}
                          {/* Today line */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500/40 z-10"
                            style={{ left: TODAY_LEFT }}
                          />
                          {/* Gantt bar */}
                          <div
                            className="absolute top-[8px] rounded-sm flex items-center overflow-hidden"
                            style={{
                              left: startPct,
                              width: widthPct,
                              height: "26px",
                              backgroundColor: barColor,
                              minWidth: "4px",
                            }}
                            title={`${task.name} — ${task.planned_start} → ${task.planned_end}`}
                          >
                            {/* Progress fill overlay */}
                            {task.progress > 0 && (
                              <div
                                className="absolute top-0 left-0 bottom-0 bg-black/20 rounded-l-sm"
                                style={{ width: `${task.progress}%` }}
                              />
                            )}
                            <span className="relative z-10 text-white text-xs font-medium px-1.5 truncate">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RÉCAPITULATIF TAB ── */}
        <TabsContent value="recap">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-slate-800">{TASKS.length}</div>
                <div className="text-sm text-slate-500 mt-1">Tâches totales</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div className="bg-blue-500 h-1.5 rounded-full w-full" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{onTrack.length + completed.length}</div>
                <div className="text-sm text-slate-500 mt-1">Dans les délais</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${((onTrack.length + completed.length) / TASKS.length) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-red-100">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{delayed.length}</div>
                <div className="text-sm text-slate-500 mt-1">En retard / Bloqué</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(delayed.length / TASKS.length) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-orange-100">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{critical.length}</div>
                <div className="text-sm text-slate-500 mt-1">Chemin critique</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(critical.length / TASKS.length) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par statut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-800">Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(["completed", "in_progress", "delayed", "blocked", "not_started", "not_planned"] as TaskStatus[]).map((s) => {
                    const count = TASKS.filter(t => t.status === s).length
                    const pctVal = Math.round((count / TASKS.length) * 100)
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <Badge variant={statusBadgeVariant(s)} className="w-28 justify-center text-xs">
                          {statusLabel(s)}
                        </Badge>
                        <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              s === "completed" ? "bg-green-500" :
                              s === "in_progress" ? "bg-blue-500" :
                              s === "delayed" ? "bg-red-500" :
                              s === "blocked" ? "bg-orange-500" :
                              "bg-gray-300"
                            }`}
                            style={{ width: `${pctVal}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-12 text-right">{count} ({pctVal}%)</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-800">Tâches en alerte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {delayed.map((task) => (
                    <div key={task.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-800">{task.name}</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          {task.lot} · {task.responsible}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={statusBadgeVariant(task.status)} className="text-xs">
                          {statusLabel(task.status)}
                        </Badge>
                        <MarginBadge margin={task.margin} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <NewTaskModal open={newTaskOpen} onClose={() => setNewTaskOpen(false)} />
    </div>
  )
}
