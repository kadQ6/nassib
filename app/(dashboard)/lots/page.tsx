"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Phone,
  User,
  FileText,
  CheckSquare,
  AlertCircle,
  ChevronRight,
  Zap,
  Wind,
  Droplets,
  FlaskConical,
  Wrench,
  Cpu,
  HardHat,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts"

// ─── Types ─────────────────────────────────────────────────────────────────────

type LotStatus = "en_cours" | "suspendu" | "termine" | "non_demarre"

type Lot = {
  id: string
  code: string
  name: string
  category: string
  contractor: string
  contact: string
  phone: string
  budget: number
  progress: number
  status: LotStatus
  color: string
  alertCount: number
  docsValid: number
  docsTotal: number
  reservations: number
  tasks: number
  tasksDone: number
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const lots: Lot[] = [
  {
    id: "lot-gc", code: "LOT-GC", name: "Gros Œuvre / Structure", category: "GC",
    contractor: "SETAB Construction", contact: "M. Ahmed Hassan", phone: "+253 77 01 23 45",
    budget: 185000000, progress: 65, status: "en_cours", color: "#6B7280",
    alertCount: 0, docsValid: 8, docsTotal: 12, reservations: 3, tasks: 12, tasksDone: 7,
  },
  {
    id: "lot-cfo", code: "LOT-CFO", name: "Courants Forts (Électricité)", category: "CFO",
    contractor: "ElecPro Djibouti", contact: "M. Ibrahim Ali", phone: "+253 77 11 22 33",
    budget: 95000000, progress: 40, status: "en_cours", color: "#F59E0B",
    alertCount: 2, docsValid: 5, docsTotal: 15, reservations: 5, tasks: 18, tasksDone: 7,
  },
  {
    id: "lot-cfa", code: "LOT-CFA", name: "Courants Faibles", category: "CFA",
    contractor: "TechSécurité", contact: "M. Omar Wais", phone: "+253 77 22 33 44",
    budget: 45000000, progress: 25, status: "en_cours", color: "#8B5CF6",
    alertCount: 1, docsValid: 3, docsTotal: 8, reservations: 2, tasks: 10, tasksDone: 3,
  },
  {
    id: "lot-cvc", code: "LOT-CVC", name: "Climatisation & Ventilation", category: "CVC",
    contractor: "ClimaMed", contact: "M. Youssouf Guedi", phone: "+253 77 33 44 55",
    budget: 120000000, progress: 30, status: "en_cours", color: "#06B6D4",
    alertCount: 3, docsValid: 4, docsTotal: 14, reservations: 4, tasks: 15, tasksDone: 4,
  },
  {
    id: "lot-plb", code: "LOT-PLB", name: "Plomberie Sanitaire", category: "PLOMBERIE",
    contractor: "AquaMed", contact: "M. Djibrile Aden", phone: "+253 77 44 55 66",
    budget: 55000000, progress: 45, status: "en_cours", color: "#3B82F6",
    alertCount: 1, docsValid: 6, docsTotal: 9, reservations: 3, tasks: 12, tasksDone: 5,
  },
  {
    id: "lot-flu", code: "LOT-FLU", name: "Fluides Médicaux", category: "FLUIDES",
    contractor: "MedGaz", contact: "M. Abdi Robleh", phone: "+253 77 55 66 77",
    budget: 38000000, progress: 20, status: "en_cours", color: "#EF4444",
    alertCount: 4, docsValid: 1, docsTotal: 8, reservations: 6, tasks: 8, tasksDone: 2,
  },
  {
    id: "lot-vrd", code: "LOT-VRD", name: "VRD & Aménagements Extérieurs", category: "VRD",
    contractor: "SETAB Construction", contact: "M. Ahmed Hassan", phone: "+253 77 01 23 45",
    budget: 72000000, progress: 55, status: "en_cours", color: "#10B981",
    alertCount: 0, docsValid: 7, docsTotal: 10, reservations: 1, tasks: 9, tasksDone: 5,
  },
  {
    id: "lot-bio", code: "LOT-BIO", name: "Équipements Biomédicaux", category: "BIOMÉDICAL",
    contractor: "MediEquip", contact: "Dr. Fatouma Said", phone: "+253 77 66 77 88",
    budget: 240000000, progress: 15, status: "en_cours", color: "#EC4899",
    alertCount: 2, docsValid: 2, docsTotal: 12, reservations: 2, tasks: 15, tasksDone: 2,
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatBudget(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)} M DJF`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} k DJF`
  return `${amount} DJF`
}

function getLotIcon(category: string): React.ElementType {
  switch (category) {
    case "GC": return HardHat
    case "CFO": return Zap
    case "CFA": return Cpu
    case "CVC": return Wind
    case "PLOMBERIE": return Droplets
    case "FLUIDES": return FlaskConical
    case "VRD": return Layers
    case "BIOMÉDICAL": return Wrench
    default: return Wrench
  }
}

const mockAlerts: Record<string, string[]> = {
  "lot-cfo": [
    "Plan d'exécution TGBT non validé par le BET",
    "Mise en service groupe électrogène reportée au J+15",
  ],
  "lot-cfa": [
    "Schéma SSI en attente de validation bureau de contrôle",
  ],
  "lot-cvc": [
    "CTA bloc opératoire — livraison fournisseur retardée",
    "Essais aérauliques salle opératoire non programmés",
    "Qualification ISO 5 bloc à planifier",
  ],
  "lot-plb": [
    "Test pression réseau ECS non réalisé",
  ],
  "lot-flu": [
    "Analyse qualité O2 non effectuée",
    "PV étanchéité vide médical manquant",
    "Centrale O2 — réception fournisseur à programmer",
    "DOE fluides médicaux non soumis",
  ],
  "lot-bio": [
    "Commande équipements bloc césarienne à confirmer",
    "Planning installation équipements à valider avec MO",
  ],
}

const mockTasks: Record<string, { label: string; done: boolean }[]> = {
  "lot-gc": [
    { label: "Fondations terminées", done: true },
    { label: "Structure R+1 coulée", done: true },
    { label: "Structure R+2 coulée", done: true },
    { label: "Toiture-terrasse étanchéifiée", done: true },
    { label: "Maçonnerie RDC complète", done: true },
    { label: "Maçonnerie R+1 complète", done: true },
    { label: "Maçonnerie R+2 en cours", done: false },
    { label: "Façades en cours", done: false },
    { label: "Cloisonnements RDC", done: false },
    { label: "Cloisonnements R+1", done: false },
    { label: "Réceptions intermédiaires GC", done: false },
    { label: "DOE Gros œuvre", done: false },
  ],
  "lot-cfo": [
    { label: "Cheminement principal CFO posé", done: true },
    { label: "TGBT livré", done: true },
    { label: "Tableau RDC posé", done: true },
    { label: "Câblage RDC en cours", done: true },
    { label: "Groupe électrogène livré", done: true },
    { label: "Tableau R+1 posé", done: true },
    { label: "Câblage R+1", done: true },
    { label: "Raccordement TGBT", done: false },
    { label: "Essais réseau BT", done: false },
    { label: "Mise en service groupe", done: false },
    { label: "Essais éclairage", done: false },
    { label: "Contrôle bureau de vérification", done: false },
    { label: "PV mise en service", done: false },
    { label: "DOE électricité", done: false },
    { label: "Formation exploitant", done: false },
    { label: "Levée réserves commission sécu", done: false },
    { label: "Dossier CONSUEL", done: false },
    { label: "Réception finale CFO", done: false },
  ],
}

// ─── Lot Detail Dialog ─────────────────────────────────────────────────────────

function LotDetailDialog({ lot, onClose }: { lot: Lot | null; onClose: () => void }) {
  if (!lot) return null

  const LotIcon = getLotIcon(lot.category)
  const tasks = mockTasks[lot.id] ?? Array.from({ length: lot.tasks }, (_, i) => ({
    label: `Tâche ${i + 1}`,
    done: i < lot.tasksDone,
  }))
  const alerts = mockAlerts[lot.id] ?? []

  const radialData = [
    { name: "Avancement travaux", value: lot.progress, fill: lot.color },
    { name: "Budget consommé", value: Math.round(lot.progress * 0.85), fill: `${lot.color}88` },
  ]

  return (
    <Dialog open={!!lot} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <LotIcon className="w-5 h-5" style={{ color: lot.color }} />
            <span className="font-mono text-base">{lot.code}</span>
            <span className="text-slate-700">{lot.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Contractor info */}
          <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Entreprise</p>
              <p className="text-sm font-semibold text-slate-800">{lot.contractor}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Contact</p>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />{lot.contact}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Téléphone</p>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />{lot.phone}
              </p>
            </div>
          </div>

          {/* Radial chart */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Avancement vs Consommation budget</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="80%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#f1f5f9" }} />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Points d&apos;alerte ({alerts.length})
              </p>
              <div className="space-y-2">
                {alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-slate-500" />
              Tâches ({lot.tasksDone}/{lot.tasks})
            </p>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden max-h-56 overflow-y-auto">
              {tasks.map((task, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 ${task.done ? "bg-green-50/50" : "bg-white"}`}>
                  <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${task.done ? "bg-green-500" : "border-2 border-slate-300"}`}>
                    {task.done && <span className="text-white text-[10px] leading-none font-bold">✓</span>}
                  </div>
                  <span className={`text-sm ${task.done ? "text-green-700 line-through" : "text-slate-700"}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Budget", value: formatBudget(lot.budget), color: "text-slate-700", bg: "bg-slate-50" },
              { label: "Documents", value: `${lot.docsValid}/${lot.docsTotal}`, color: lot.docsValid < lot.docsTotal ? "text-amber-700" : "text-green-700", bg: lot.docsValid < lot.docsTotal ? "bg-amber-50" : "bg-green-50" },
              { label: "Réserves", value: String(lot.reservations), color: lot.reservations > 0 ? "text-red-700" : "text-green-700", bg: lot.reservations > 0 ? "bg-red-50" : "bg-green-50" },
              { label: "Avancement", value: `${lot.progress}%`, color: "text-slate-700", bg: "bg-slate-50" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-lg p-3`}>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className={`text-base font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 flex-wrap">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
            <FileText className="w-4 h-4 mr-1.5" />Documents
          </Button>
          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <AlertTriangle className="w-4 h-4 mr-1.5" />Réserves ({lot.reservations})
          </Button>
          <Button className="bg-slate-800 hover:bg-slate-900 text-white">
            Modifier le statut
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Lot Card ──────────────────────────────────────────────────────────────────

function LotCard({ lot, onDetail }: { lot: Lot; onDetail: () => void }) {
  const LotIcon = getLotIcon(lot.category)
  const alerts = mockAlerts[lot.id] ?? []

  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Colored left border */}
        <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: lot.color }} />
        <div className="flex-1 p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-2 flex-wrap">
            <LotIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: lot.color }} />
            <span
              className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: lot.color }}
            >
              {lot.code}
            </span>
            <span className="text-sm font-semibold text-slate-800 flex-1">{lot.name}</span>
            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">En cours</Badge>
            {lot.alertCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                {lot.alertCount} alerte{lot.alertCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Contractor */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5 text-slate-400" />
              {lot.contractor}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {lot.contact}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {lot.phone}
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Avancement travaux</span>
              <span className="text-xs font-bold text-slate-700">{lot.progress}%</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${lot.progress}%`, backgroundColor: lot.color }}
              />
            </div>
          </div>

          {/* Stats mini-row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Avancement", value: `${lot.progress}%`, colorClass: "text-slate-700" },
              { label: "Docs", value: `${lot.docsValid}/${lot.docsTotal}`, colorClass: lot.docsValid < lot.docsTotal ? "text-amber-700" : "text-green-700" },
              { label: "Tâches", value: `${lot.tasksDone}/${lot.tasks}`, colorClass: "text-slate-700" },
              { label: "Réserves", value: String(lot.reservations), colorClass: lot.reservations > 0 ? "text-red-700" : "text-green-700" },
            ].map(({ label, value, colorClass }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-400 leading-tight">{label}</p>
                <p className={`text-sm font-bold ${colorClass}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Alert items preview */}
          {lot.alertCount > 0 && alerts.slice(0, 2).map((alert, i) => (
            <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-tight">{alert}</p>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onDetail}>
              <ChevronRight className="w-3.5 h-3.5" />Voir détail
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" />Documents
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`gap-1.5 text-xs ${lot.reservations > 0 ? "border-red-300 text-red-600 hover:bg-red-50" : ""}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />Réserves
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LotsPage() {
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null)

  const totalBudget = lots.reduce((acc, l) => acc + l.budget, 0)
  const avgProgress = Math.round(lots.reduce((acc, l) => acc + l.progress, 0) / lots.length)
  const totalAlerts = lots.reduce((acc, l) => acc + l.alertCount, 0)

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Lots Techniques MEP
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Suivi par lot — Polyclinique Cité Nassib</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Lots actifs", value: String(lots.length), color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Budget total", value: formatBudget(totalBudget), color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Avancement moy.", value: `${avgProgress}%`, color: "text-green-700", bg: "bg-green-50" },
          { label: "Alertes ouvertes", value: String(totalAlerts), color: totalAlerts > 0 ? "text-red-700" : "text-green-700", bg: totalAlerts > 0 ? "bg-red-50" : "bg-green-50" },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className={`${bg} border-0 shadow-sm`}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-xl font-bold ${color} mt-0.5`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rule banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-lg p-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900 mb-0.5">Règle fondamentale OPC</p>
          <p className="text-sm text-amber-800">
            Aucune zone ne peut passer en &laquo;&nbsp;Prête pour finition&nbsp;&raquo; tant que les réseaux encastrés,
            essais intermédiaires et validations techniques de ce lot ne sont pas terminés et validés par l&apos;OPC.
          </p>
        </div>
      </div>

      {/* Lots grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} onDetail={() => setSelectedLot(lot)} />
        ))}
      </div>

      {/* Detail dialog */}
      <LotDetailDialog lot={selectedLot} onClose={() => setSelectedLot(null)} />
    </div>
  )
}
