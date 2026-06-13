"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Activity,
  Wind,
  Layers,
  MapPin,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckState = "done" | "partial" | "pending"
type FluidType = "oxygen" | "vacuum" | "air"

interface ChecklistItem {
  label: string
  state: CheckState
}

interface FluidConnection {
  room_code: string
  room_name: string
  floor: string
  valve_points: number
  status: "installed" | "pending" | "not_started"
  notes?: string
}

interface FluidCard {
  id: FluidType
  name: string
  shortName: string
  source_location: string
  standard: string
  network_progress: number
  status: "not_started" | "installation" | "testing" | "certified" | "operational"
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  icon: "oxygen" | "vacuum" | "air"
  checklist: ChecklistItem[]
  connections: FluidConnection[]
  missing_critical: string[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FLUID_DATA: FluidCard[] = [
  {
    id: "oxygen",
    name: "Oxygène Médical (O2)",
    shortName: "O2",
    source_location: "Centrale O2 — Sous-sol, local technique Z05",
    standard: "EN ISO 7396-1 · NF S90-155",
    network_progress: 18,
    status: "installation",
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: "oxygen",
    checklist: [
      { label: "Plan réseau validé", state: "done" },
      { label: "Réservations structures validées", state: "done" },
      { label: "Réseau cuivre posé (partiel)", state: "partial" },
      { label: "Brasage terminé", state: "pending" },
      { label: "Test pression réalisé", state: "pending" },
      { label: "Test étanchéité réalisé", state: "pending" },
      { label: "Repérage réalisé", state: "pending" },
      { label: "Prises et détendeurs installés", state: "pending" },
      { label: "Analyse qualité gaz (pureté)", state: "pending" },
      { label: "PV de recette signé", state: "pending" },
      { label: "DOE remis au maître d'ouvrage", state: "pending" },
    ],
    connections: [
      { room_code: "Z03-01", room_name: "Bloc Césarienne — Salle opératoire", floor: "R+1", valve_points: 4, status: "not_started", notes: "Priorité absolue — chemin critique" },
      { room_code: "Z03-02", room_name: "Bloc Césarienne — SSPI", floor: "R+1", valve_points: 3, status: "not_started" },
      { room_code: "Z02-01", room_name: "Urgences — Box n°1", floor: "RDC", valve_points: 2, status: "pending", notes: "Tuyauterie posée, brasage en attente" },
      { room_code: "Z02-02", room_name: "Urgences — Box n°2", floor: "RDC", valve_points: 2, status: "pending" },
      { room_code: "Z02-03", room_name: "Urgences — Déchocage", floor: "RDC", valve_points: 3, status: "not_started" },
      { room_code: "Z04-01", room_name: "Hospitalisation — Chambre A", floor: "R+1", valve_points: 1, status: "pending" },
      { room_code: "Z04-02", room_name: "Hospitalisation — Chambre B", floor: "R+1", valve_points: 1, status: "pending" },
      { room_code: "Z05-01", room_name: "Local technique — Centrale O2", floor: "SS", valve_points: 0, status: "not_started", notes: "Centrale en attente de livraison (mars 2026)" },
    ],
    missing_critical: [
      "Centrale O2 non livrée — livraison prévue mars 2026",
      "Réseau bloc opératoire non démarré",
      "Aucun test pression effectué",
    ],
  },
  {
    id: "vacuum",
    name: "Vide Médical (VMC)",
    shortName: "Vide",
    source_location: "Groupe de vide — Sous-sol, local technique Z05",
    standard: "EN ISO 7396-1 · HTM 02-01",
    network_progress: 8,
    status: "not_started",
    color: "#8B5CF6",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-700",
    icon: "vacuum",
    checklist: [
      { label: "Plan réseau validé", state: "done" },
      { label: "Réservations structures validées", state: "done" },
      { label: "Réseau cuivre posé (partiel)", state: "partial" },
      { label: "Brasage terminé", state: "pending" },
      { label: "Test pression réalisé", state: "pending" },
      { label: "Test étanchéité réalisé", state: "pending" },
      { label: "Repérage réalisé", state: "pending" },
      { label: "Prises vide installées", state: "pending" },
      { label: "Test dépression groupe vide", state: "pending" },
      { label: "PV de recette signé", state: "pending" },
      { label: "DOE remis au maître d'ouvrage", state: "pending" },
    ],
    connections: [
      { room_code: "Z03-01", room_name: "Bloc Césarienne — Salle opératoire", floor: "R+1", valve_points: 3, status: "not_started", notes: "Critique — dépendant de LOT-FLU" },
      { room_code: "Z03-02", room_name: "Bloc Césarienne — SSPI", floor: "R+1", valve_points: 2, status: "not_started" },
      { room_code: "Z02-01", room_name: "Urgences — Box n°1", floor: "RDC", valve_points: 1, status: "pending" },
      { room_code: "Z02-02", room_name: "Urgences — Box n°2", floor: "RDC", valve_points: 1, status: "pending" },
      { room_code: "Z02-03", room_name: "Urgences — Déchocage", floor: "RDC", valve_points: 2, status: "not_started" },
      { room_code: "Z05-01", room_name: "Local technique — Groupe vide", floor: "SS", valve_points: 0, status: "not_started", notes: "Groupe vide non installé" },
    ],
    missing_critical: [
      "Groupe de vide médical non installé",
      "Aucune tuyauterie vide posée en zone critique",
      "Planning non finalisé avec MedGaz Algeria",
    ],
  },
  {
    id: "air",
    name: "Air Médical Comprimé",
    shortName: "Air Méd.",
    source_location: "Compresseurs médicaux — Sous-sol, local technique Z05",
    standard: "EN ISO 7396-1 · EN 12021",
    network_progress: 5,
    status: "not_started",
    color: "#10B981",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    icon: "air",
    checklist: [
      { label: "Plan réseau validé", state: "done" },
      { label: "Réservations structures validées", state: "partial" },
      { label: "Réseau cuivre posé", state: "pending" },
      { label: "Brasage terminé", state: "pending" },
      { label: "Test pression réalisé", state: "pending" },
      { label: "Test étanchéité réalisé", state: "pending" },
      { label: "Repérage réalisé", state: "pending" },
      { label: "Prises air médical installées", state: "pending" },
      { label: "Analyse qualité air (humidité, CO)", state: "pending" },
      { label: "PV de recette signé", state: "pending" },
      { label: "DOE remis au maître d'ouvrage", state: "pending" },
    ],
    connections: [
      { room_code: "Z03-01", room_name: "Bloc Césarienne — Salle opératoire", floor: "R+1", valve_points: 2, status: "not_started", notes: "Air médical obligatoire au bloc" },
      { room_code: "Z03-02", room_name: "Bloc Césarienne — SSPI", floor: "R+1", valve_points: 1, status: "not_started" },
      { room_code: "Z02-03", room_name: "Urgences — Déchocage", floor: "RDC", valve_points: 1, status: "not_started" },
      { room_code: "Z05-01", room_name: "Local technique — Compresseurs", floor: "SS", valve_points: 0, status: "not_started", notes: "Compresseurs non commandés" },
    ],
    missing_critical: [
      "Compresseurs médicaux non encore commandés",
      "Réservations R+1 partiellement validées",
      "Aucune intervention terrain démarrée",
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fluidStatusLabel(s: FluidCard["status"]): string {
  return {
    not_started: "Non démarré",
    installation: "Installation",
    testing: "Essais",
    certified: "Certifié",
    operational: "Opérationnel",
  }[s]
}

function fluidStatusBadge(s: FluidCard["status"]): string {
  return {
    not_started: "bg-gray-100 text-gray-600 border-gray-200",
    installation: "bg-blue-50 text-blue-700 border-blue-200",
    testing: "bg-amber-50 text-amber-700 border-amber-200",
    certified: "bg-green-50 text-green-700 border-green-200",
    operational: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[s]
}

function connectionStatusColor(s: FluidConnection["status"]): string {
  return {
    installed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    not_started: "bg-gray-100 text-gray-600",
  }[s]
}

function connectionStatusLabel(s: FluidConnection["status"]): string {
  return { installed: "Installé", pending: "En attente", not_started: "Non démarré" }[s]
}

function FluidTypeIcon({ type, color }: { type: FluidCard["icon"]; color: string }) {
  const iconClass = "w-6 h-6 text-white"
  const icon = (() => {
    switch (type) {
      case "oxygen": return <Activity className={iconClass} />
      case "vacuum": return <Layers className={iconClass} />
      case "air": return <Wind className={iconClass} />
    }
  })()
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
  )
}

function CheckItem({ item }: { item: ChecklistItem }) {
  const done = item.state === "done"
  const partial = item.state === "partial"
  return (
    <div className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs ${
      done ? "bg-green-50" : partial ? "bg-amber-50" : ""
    }`}>
      {done
        ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        : partial
        ? <CircleDashed className="w-4 h-4 text-amber-500 flex-shrink-0" />
        : <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
      <span className={
        done ? "text-green-800 font-medium" :
        partial ? "text-amber-800" :
        "text-gray-500"
      }>
        {item.label}
      </span>
      {partial && <span className="ml-auto text-xs text-amber-600 font-medium">Partiel</span>}
    </div>
  )
}

// ─── Fluid Card Component ─────────────────────────────────────────────────────

function FluidNetworkCard({ fluid }: { fluid: FluidCard }) {
  const [showConnections, setShowConnections] = useState(false)
  const [showChecklist, setShowChecklist] = useState(true)

  const doneCount = fluid.checklist.filter(c => c.state === "done").length
  const totalCount = fluid.checklist.length
  const installedConns = fluid.connections.filter(c => c.status === "installed").length
  const totalPoints = fluid.connections.reduce((s, c) => s + c.valve_points, 0)

  return (
    <Card className={`bg-white shadow-sm border ${fluid.borderColor}`}>
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-start gap-4">
          <FluidTypeIcon type={fluid.icon} color={fluid.color} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  {fluid.name}
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{fluid.standard}</p>
              </div>
              <span className={`text-xs rounded-md px-1.5 py-0.5 border font-semibold flex-shrink-0 ${fluidStatusBadge(fluid.status)}`}>
                {fluidStatusLabel(fluid.status)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{fluid.source_location}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Avancement réseau</span>
            <span className="text-sm font-bold" style={{ color: fluid.color }}>
              {fluid.network_progress}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${fluid.network_progress}%`, backgroundColor: fluid.color }}
            />
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-500">Validation</p>
            <p className="text-sm font-bold text-slate-800">
              {doneCount}<span className="text-xs text-slate-400">/{totalCount}</span>
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-500">Locaux</p>
            <p className="text-sm font-bold text-slate-800">
              {installedConns}<span className="text-xs text-slate-400">/{fluid.connections.length}</span>
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-500">Prises prévues</p>
            <p className="text-sm font-bold text-slate-800">{totalPoints}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">
        {/* Alerts */}
        {fluid.missing_critical.length > 0 && (
          <div className="space-y-1.5">
            {fluid.missing_critical.map((msg, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                {msg}
              </div>
            ))}
          </div>
        )}

        {/* Checklist toggle */}
        <div>
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 mb-2 hover:text-slate-900"
          >
            <span className="flex items-center gap-1.5">
              Checklist de validation ({doneCount}/{totalCount})
              <span className={`ml-1 inline-block w-2 h-2 rounded-full ${
                doneCount === totalCount ? "bg-green-500" :
                doneCount > 2 ? "bg-amber-500" :
                "bg-red-500"
              }`} />
            </span>
            {showChecklist ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {showChecklist && (
            <div className="space-y-0.5">
              {fluid.checklist.map((item, i) => (
                <CheckItem key={i} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Connections toggle */}
        <div>
          <button
            onClick={() => setShowConnections(!showConnections)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 mb-2 hover:text-slate-900"
          >
            <span>Locaux / Points de raccordement ({fluid.connections.length})</span>
            {showConnections ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {showConnections && (
            <div className="space-y-2">
              {fluid.connections.map((conn, i) => (
                <div key={i} className="bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-slate-400">{conn.room_code}</span>
                        <span className="text-xs font-medium text-slate-800 truncate">{conn.room_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> {conn.floor}
                        </span>
                        {conn.valve_points > 0 && (
                          <span className="text-xs text-slate-500">
                            · {conn.valve_points} prise(s)
                          </span>
                        )}
                      </div>
                      {conn.notes && (
                        <p className="text-xs text-amber-700 mt-1 italic">{conn.notes}</p>
                      )}
                    </div>
                    <span className={`text-xs rounded px-1.5 py-0.5 font-medium flex-shrink-0 ${connectionStatusColor(conn.status)}`}>
                      {connectionStatusLabel(conn.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Validation Summary ───────────────────────────────────────────────────────

function ValidationSummary({ fluids }: { fluids: FluidCard[] }) {
  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Tableau de validation — Fluides médicaux
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-3 py-2 font-semibold text-slate-600">Étape</th>
                {fluids.map(f => (
                  <th key={f.id} className="text-center px-3 py-2 font-semibold" style={{ color: f.color }}>
                    {f.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fluids[0].checklist.map((item, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-700">{item.label}</td>
                  {fluids.map(f => {
                    const state = f.checklist[rowIdx]?.state ?? "pending"
                    return (
                      <td key={f.id} className="px-3 py-2 text-center">
                        {state === "done"
                          ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                          : state === "partial"
                          ? <CircleDashed className="w-4 h-4 text-amber-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-gray-300 mx-auto" />}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FluidesPage() {
  const totalProgress = Math.round(
    FLUID_DATA.reduce((s, f) => s + f.network_progress, 0) / FLUID_DATA.length
  )
  const totalPoints = FLUID_DATA.reduce(
    (s, f) => s + f.connections.reduce((cs, c) => cs + c.valve_points, 0), 0
  )
  const criticalAlerts = FLUID_DATA.reduce((s, f) => s + f.missing_critical.length, 0)

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Fluides Médicaux</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Lot LOT-FLU · MedGaz Algeria · {totalPoints} prises prévues
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-center bg-white border border-slate-200 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-500">Avancement moyen</p>
            <p className="text-lg font-bold text-red-600">{totalProgress}%</p>
          </div>
        </div>
      </div>

      {/* Critical info banner */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-400 rounded-xl px-5 py-4">
        <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-900 uppercase tracking-wide">
            Zone critique — Validation obligatoire avant mise en service
          </p>
          <p className="text-xs text-red-800 mt-1">
            Les réseaux de fluides médicaux (O2, vide, air comprimé) sont soumis à certification obligatoire
            par un organisme agréé conformément à l&apos;EN ISO 7396-1. Aucune mise en service ne peut avoir lieu
            sans PV de recette signé et DOE remis. Toute anomalie doit être signalée immédiatement au conducteur de travaux.
          </p>
          {criticalAlerts > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              {criticalAlerts} points critiques non résolus sur ce lot
            </div>
          )}
        </div>
      </div>

      {/* Global alert strip */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          <strong>Attention:</strong> Le LOT-FLU est sur le chemin critique du projet.
          Tout retard sur ce lot impacte directement la date de mise en service du bloc opératoire
          et des urgences. Réunion de coordination hebdomadaire obligatoire avec MedGaz Algeria.
        </p>
      </div>

      {/* Fluid cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {FLUID_DATA.map(fluid => (
          <FluidNetworkCard key={fluid.id} fluid={fluid} />
        ))}
      </div>

      {/* Validation Summary table */}
      <ValidationSummary fluids={FLUID_DATA} />

      {/* Footer note */}
      <div className="text-xs text-slate-400 text-center pb-2">
        Données mises à jour le 13/01/2026 · LOT-FLU · MedGaz Algeria
        · Norme de référence: EN ISO 7396-1, NF S90-155, HTM 02-01
      </div>
    </div>
  )
}
