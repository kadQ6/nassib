"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Wrench,
  Zap,
  Radio,
  Wind,
  Droplets,
  FlaskConical,
  Construction,
  Stethoscope,
  Phone,
  Euro,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  Shield,
} from "lucide-react"
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type LotStatus = "not_started" | "in_progress" | "completed" | "delayed"

interface LotAlert {
  severity: "warning" | "critical"
  message: string
}

interface LotDocument {
  name: string
  status: "validated" | "pending" | "rejected"
  date: string
}

interface LotTask {
  name: string
  progress: number
  status: "not_started" | "in_progress" | "completed" | "delayed" | "blocked" | "not_planned"
}

interface Lot {
  id: string
  code: string
  name: string
  contractor: string
  contact: string
  budget_mdz: number // millions DZD
  progress: number
  status: LotStatus
  color: string
  icon: string
  docs_validated: number
  docs_total: number
  open_reserves: number
  remaining_tasks: number
  alerts: LotAlert[]
  tasks: LotTask[]
  documents: LotDocument[]
  description: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LOTS: Lot[] = [
  {
    id: "L01", code: "LOT-GC", name: "Gros Œuvre", contractor: "SETAB Construction",
    contact: "M. Benabdallah · +213 55 123 4567",
    budget_mdz: 420, progress: 65, status: "in_progress",
    color: "#6B7280", icon: "Construction",
    docs_validated: 18, docs_total: 22, open_reserves: 3, remaining_tasks: 8,
    alerts: [],
    description: "Terrassement, fondations, structure béton armé, maçonnerie, cloisonnement, toiture.",
    tasks: [
      { name: "Structure béton R+1", progress: 85, status: "in_progress" },
      { name: "Cloisonnement RDC", progress: 60, status: "in_progress" },
      { name: "Faux plafonds urgences", progress: 0, status: "not_started" },
      { name: "Carrelage bloc opératoire", progress: 0, status: "not_started" },
    ],
    documents: [
      { name: "Plan d'exécution GO rev.C", status: "validated", date: "15/10/2025" },
      { name: "Note de calcul structure R+1", status: "validated", date: "02/11/2025" },
      { name: "Soumet. matériaux béton", status: "pending", date: "12/01/2026" },
    ],
  },
  {
    id: "L02", code: "LOT-CFO", name: "Électricité Courant Fort", contractor: "ElecPro SARL",
    contact: "K. Aïssaoui · +213 55 234 5678",
    budget_mdz: 185, progress: 40, status: "delayed",
    color: "#F59E0B", icon: "Zap",
    docs_validated: 8, docs_total: 15, open_reserves: 5, remaining_tasks: 14,
    alerts: [
      { severity: "warning", message: "TGBT livré avec 3 semaines de retard" },
      { severity: "warning", message: "Plan d'exécution CFO R+1 non encore soumis" },
    ],
    description: "TGBT, câblages courant fort, éclairage, prises, onduleurs, groupe électrogène.",
    tasks: [
      { name: "TGBT installation", progress: 70, status: "delayed" },
      { name: "Câblage CFO RDC", progress: 45, status: "delayed" },
      { name: "Câblage CFO R+1", progress: 20, status: "in_progress" },
      { name: "Éclairage blocs opératoires", progress: 5, status: "in_progress" },
    ],
    documents: [
      { name: "PE-CFO-RDC rev.B", status: "validated", date: "10/11/2025" },
      { name: "Note schéma TGBT", status: "validated", date: "05/12/2025" },
      { name: "PE-CFO-R+1", status: "pending", date: "08/01/2026" },
    ],
  },
  {
    id: "L03", code: "LOT-CFA", name: "Courant Faible", contractor: "TechSécurité",
    contact: "N. Ouali · +213 55 345 6789",
    budget_mdz: 95, progress: 25, status: "in_progress",
    color: "#10B981", icon: "Radio",
    docs_validated: 5, docs_total: 12, open_reserves: 2, remaining_tasks: 18,
    alerts: [],
    description: "SSI (détection incendie), VDI, contrôle d'accès, vidéosurveillance, infirmerie call.",
    tasks: [
      { name: "Réseau VDI RDC", progress: 40, status: "in_progress" },
      { name: "SSI — détection RDC", progress: 20, status: "in_progress" },
      { name: "Contrôle d'accès", progress: 0, status: "not_started" },
      { name: "Système d'appel infirmières", progress: 0, status: "not_started" },
    ],
    documents: [
      { name: "Schéma SSI rev.A", status: "validated", date: "20/11/2025" },
      { name: "Plan VDI RDC", status: "pending", date: "05/01/2026" },
      { name: "Cahier recette SSI", status: "pending", date: "N/A" },
    ],
  },
  {
    id: "L04", code: "LOT-CVC", name: "Climatisation / CVC", contractor: "ClimaMed",
    contact: "A. Hamdani · +213 55 456 7890",
    budget_mdz: 220, progress: 30, status: "delayed",
    color: "#8B5CF6", icon: "Wind",
    docs_validated: 6, docs_total: 18, open_reserves: 7, remaining_tasks: 22,
    alerts: [
      { severity: "critical", message: "Retard critique — CVC bloc opératoire non démarré" },
      { severity: "warning", message: "Livraison unités CTA prévue fév. 2026 — délai serré" },
      { severity: "warning", message: "3 réserves non levées depuis >30j" },
    ],
    description: "Centrales de traitement d'air, ventilation mécanique, réseau gaines, refroidissement.",
    tasks: [
      { name: "CVC bloc césarienne", progress: 5, status: "delayed" },
      { name: "Réseau CVC R+1", progress: 30, status: "in_progress" },
      { name: "Ventilation SSPI", progress: 15, status: "in_progress" },
      { name: "Essais CVC complets", progress: 0, status: "not_started" },
    ],
    documents: [
      { name: "PE-CVC gén. rev.B", status: "validated", date: "15/10/2025" },
      { name: "Note dimensionnement CTA", status: "validated", date: "08/11/2025" },
      { name: "Plans gaines R+1", status: "pending", date: "10/01/2026" },
    ],
  },
  {
    id: "L05", code: "LOT-PLB", name: "Plomberie Sanitaire", contractor: "AquaMed",
    contact: "R. Meziane · +213 55 567 8901",
    budget_mdz: 110, progress: 45, status: "in_progress",
    color: "#06B6D4", icon: "Droplets",
    docs_validated: 10, docs_total: 14, open_reserves: 3, remaining_tasks: 10,
    alerts: [],
    description: "Réseaux EF/EC, évacuations, sanitaires, réseau sprinklers incendie, bâche à eau.",
    tasks: [
      { name: "Plomberie sanitaire R+1", progress: 35, status: "in_progress" },
      { name: "Réseau sprinklers", progress: 20, status: "delayed" },
      { name: "Essais plomberie", progress: 0, status: "not_planned" },
      { name: "Réservoir eau incendie", progress: 60, status: "in_progress" },
    ],
    documents: [
      { name: "Isométrique EF/EC RDC", status: "validated", date: "01/11/2025" },
      { name: "Plan sprinklers", status: "validated", date: "20/11/2025" },
      { name: "PV essais pression", status: "pending", date: "N/A" },
    ],
  },
  {
    id: "L06", code: "LOT-FLU", name: "Fluides Médicaux", contractor: "MedGaz Algeria",
    contact: "S. Benali · +213 55 678 9012",
    budget_mdz: 145, progress: 20, status: "delayed",
    color: "#EF4444", icon: "FlaskConical",
    docs_validated: 3, docs_total: 14, open_reserves: 8, remaining_tasks: 28,
    alerts: [
      { severity: "critical", message: "Centrale O2 — livraison fournisseur reportée à mars 2026" },
      { severity: "critical", message: "Fluides bloc opératoire BLOQUÉ — impact sur chemin critique" },
    ],
    description: "O2, vide médical, air comprimé médical — production, distribution, prises murales.",
    tasks: [
      { name: "Centrale production O2", progress: 10, status: "blocked" },
      { name: "Réseau O2 RDC", progress: 10, status: "blocked" },
      { name: "Réseau vide médical", progress: 0, status: "blocked" },
      { name: "Prises médicales bloc", progress: 0, status: "not_started" },
    ],
    documents: [
      { name: "Schéma réseau O2 rev.A", status: "validated", date: "12/11/2025" },
      { name: "Plan implantation centrales", status: "validated", date: "25/11/2025" },
      { name: "Certification EN ISO 7396", status: "pending", date: "N/A" },
    ],
  },
  {
    id: "L07", code: "LOT-VRD", name: "VRD", contractor: "SETAB Construction",
    contact: "M. Benabdallah · +213 55 123 4567",
    budget_mdz: 75, progress: 55, status: "in_progress",
    color: "#6366F1", icon: "Construction",
    docs_validated: 9, docs_total: 11, open_reserves: 1, remaining_tasks: 5,
    alerts: [],
    description: "Voirie, réseaux divers, terrassements extérieurs, parkings, clôture, éclairage extérieur.",
    tasks: [
      { name: "Voirie parkings", progress: 70, status: "in_progress" },
      { name: "Réseaux EU/EP extérieurs", progress: 55, status: "in_progress" },
      { name: "Éclairage extérieur", progress: 10, status: "in_progress" },
      { name: "Clôture et portails", progress: 80, status: "in_progress" },
    ],
    documents: [
      { name: "Plan VRD général", status: "validated", date: "01/09/2025" },
      { name: "Note hydraulique EP", status: "validated", date: "10/09/2025" },
      { name: "PV réception voirie", status: "pending", date: "N/A" },
    ],
  },
  {
    id: "L08", code: "LOT-BIO", name: "Bioméd", contractor: "MediEquip Algérie",
    contact: "Dr. Cherif · +213 55 789 0123",
    budget_mdz: 380, progress: 15, status: "in_progress",
    color: "#14B8A6", icon: "Stethoscope",
    docs_validated: 2, docs_total: 20, open_reserves: 0, remaining_tasks: 35,
    alerts: [],
    description: "Équipements biomédicaux — imagerie, chirurgie, monitoring, lab, stérilisation.",
    tasks: [
      { name: "Appareils monitoring soins", progress: 0, status: "not_started" },
      { name: "Équipements bloc opératoire", progress: 5, status: "in_progress" },
      { name: "Imagerie médicale IRM", progress: 10, status: "in_progress" },
      { name: "Stérilisateurs autoclave", progress: 0, status: "not_started" },
    ],
    documents: [
      { name: "Liste équipements rev.1", status: "validated", date: "05/12/2025" },
      { name: "Cahier charges biomédical", status: "validated", date: "12/12/2025" },
      { name: "BPU équipements", status: "pending", date: "15/01/2026" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusLabel(s: LotStatus): string {
  return { not_started: "Non démarré", in_progress: "En cours", completed: "Terminé", delayed: "En retard" }[s]
}

function statusBadgeClass(s: LotStatus): string {
  return {
    not_started: "bg-gray-100 text-gray-600 border border-gray-200",
    in_progress: "bg-blue-50 text-blue-700 border border-blue-200",
    completed: "bg-green-50 text-green-700 border border-green-200",
    delayed: "bg-red-50 text-red-700 border border-red-200",
  }[s]
}

function taskStatusColor(s: LotTask["status"]): string {
  const map: Record<LotTask["status"], string> = {
    not_started: "bg-gray-200",
    in_progress: "bg-blue-500",
    completed: "bg-green-500",
    delayed: "bg-red-500",
    blocked: "bg-orange-500",
    not_planned: "bg-slate-300",
  }
  return map[s] ?? "bg-gray-200"
}

function LotIcon({ icon, color }: { icon: string; color: string }) {
  const iconClass = "w-5 h-5 text-white"
  const IconComponent = (() => {
    switch (icon) {
      case "Zap": return <Zap className={iconClass} />
      case "Radio": return <Radio className={iconClass} />
      case "Wind": return <Wind className={iconClass} />
      case "Droplets": return <Droplets className={iconClass} />
      case "FlaskConical": return <FlaskConical className={iconClass} />
      case "Stethoscope": return <Stethoscope className={iconClass} />
      default: return <Wrench className={iconClass} />
    }
  })()
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
      {IconComponent}
    </div>
  )
}

interface RadialTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { name: string; value: number; fill: string } }>
}

function RadialTooltip({ active, payload }: RadialTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow px-3 py-2 text-xs">
        <strong>{payload[0].payload.name}</strong>: {payload[0].payload.value}%
      </div>
    )
  }
  return null
}

// ─── Lot Detail Panel ─────────────────────────────────────────────────────────

function LotDetailPanel({ lot, onClose }: { lot: Lot; onClose: () => void }) {
  const radialData = [{ name: lot.name, value: lot.progress, fill: lot.color }]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />
      {/* Panel */}
      <div className="w-full max-w-lg bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <LotIcon icon={lot.icon} color={lot.color} />
            <div>
              <p className="text-xs font-mono text-slate-400">{lot.code}</p>
              <h2 className="text-base font-bold text-slate-900">{lot.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Alerts */}
          {lot.alerts.length > 0 && (
            <div className="space-y-2">
              {lot.alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-2 rounded-lg p-3 border text-xs ${
                  alert.severity === "critical"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                    alert.severity === "critical" ? "text-red-500" : "text-amber-500"
                  }`} />
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* General info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-xs">
              <p className="text-slate-500 flex items-center gap-1 mb-1"><Wrench className="w-3 h-3" />Entreprise</p>
              <p className="font-semibold text-slate-800">{lot.contractor}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-xs">
              <p className="text-slate-500 flex items-center gap-1 mb-1"><Phone className="w-3 h-3" />Contact</p>
              <p className="font-medium text-slate-800">{lot.contact}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-xs">
              <p className="text-slate-500 flex items-center gap-1 mb-1"><Euro className="w-3 h-3" />Budget</p>
              <p className="font-bold text-slate-800">{lot.budget_mdz} MDZ</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-xs">
              <p className="text-slate-500 mb-1">Statut</p>
              <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${statusBadgeClass(lot.status)}`}>
                {statusLabel(lot.status)}
              </span>
            </div>
          </div>

          {/* Radial chart */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Avancement global</p>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="55%"
                    outerRadius="90%"
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#F1F5F9" }} />
                    <Tooltip content={<RadialTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="text-4xl font-black" style={{ color: lot.color }}>{lot.progress}%</div>
                <p className="text-xs text-slate-500 mt-1">{lot.description}</p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Tâches en cours</p>
            <div className="space-y-2">
              {lot.tasks.map((task, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-700">{task.name}</span>
                    <span className="text-xs font-medium text-slate-600">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`${taskStatusColor(task.status)} h-1.5 rounded-full transition-all`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Documents ({lot.docs_validated}/{lot.docs_total} validés)
            </p>
            <div className="space-y-1.5">
              {lot.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    {doc.status === "validated"
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      : doc.status === "rejected"
                      ? <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                    <span className="text-slate-700">{doc.name}</span>
                  </div>
                  <span className="text-slate-400 ml-2">{doc.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lot Card ─────────────────────────────────────────────────────────────────

function LotCard({ lot, onClick }: { lot: Lot; onClick: () => void }) {
  const isCritical = lot.code === "LOT-FLU"
  const hasAlerts = lot.alerts.length > 0

  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left w-full bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group",
        isCritical ? "border-red-300 ring-1 ring-red-200" :
        hasAlerts ? "border-amber-200" :
        "border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <LotIcon icon={lot.icon} color={lot.color} />
          <div>
            <p className="text-xs font-mono text-slate-400">{lot.code}</p>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{lot.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{lot.contractor}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-xs rounded-md px-1.5 py-0.5 font-medium ${statusBadgeClass(lot.status)}`}>
            {statusLabel(lot.status)}
          </span>
          {isCritical && (
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
              🔴 Critique
            </span>
          )}
          {!isCritical && lot.alerts.length > 0 && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
              ⚠ {lot.alerts.length} alerte(s)
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Avancement</span>
          <span className="text-sm font-bold" style={{ color: lot.color }}>{lot.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all"
            style={{ width: `${lot.progress}%`, backgroundColor: lot.color }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-500">Docs validés</p>
          <p className="text-sm font-bold text-slate-800">{lot.docs_validated}<span className="text-xs text-slate-400">/{lot.docs_total}</span></p>
        </div>
        <div className={cn("text-center rounded-lg p-2", lot.open_reserves > 3 ? "bg-red-50" : "bg-slate-50")}>
          <p className="text-xs text-slate-500">Réserves</p>
          <p className={cn("text-sm font-bold", lot.open_reserves > 3 ? "text-red-700" : "text-slate-800")}>
            {lot.open_reserves}
          </p>
        </div>
        <div className="text-center bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-500">Tâches rest.</p>
          <p className="text-sm font-bold text-slate-800">{lot.remaining_tasks}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-end text-xs text-blue-600 group-hover:text-blue-700 font-medium gap-1">
        Voir détail <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LotsPage() {
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null)

  const totalAlerts = LOTS.reduce((sum, l) => sum + l.alerts.length, 0)
  const criticalLots = LOTS.filter(l => l.alerts.some(a => a.severity === "critical"))
  const avgProgress = Math.round(LOTS.reduce((sum, l) => sum + l.progress, 0) / LOTS.length)

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lots Techniques MEP</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {LOTS.length} lots · Avancement moyen: {avgProgress}% · {totalAlerts} alertes actives
          </p>
        </div>
        {totalAlerts > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {totalAlerts} alertes — {criticalLots.length} lot(s) critique(s)
          </div>
        )}
      </div>

      {/* "Règle d'or" banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900">Règle d&apos;or chantier</p>
          <p className="text-xs text-amber-800 mt-0.5">
            Aucune zone ne peut passer en &quot;prête pour finition&quot; si les réseaux encastrés et essais intermédiaires ne sont pas terminés.
            Validation obligatoire par le conducteur de travaux avant toute fermeture de doublage.
          </p>
        </div>
      </div>

      {/* Lot grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {LOTS.map(lot => (
          <LotCard key={lot.id} lot={lot} onClick={() => setSelectedLot(lot)} />
        ))}
      </div>

      {/* Detail Panel */}
      {selectedLot && (
        <LotDetailPanel lot={selectedLot} onClose={() => setSelectedLot(null)} />
      )}
    </div>
  )
}
