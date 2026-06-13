"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  MapPin,
  Gauge,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// ─── Types ─────────────────────────────────────────────────────────────────────

type FluidConnectionType = "prise_murale" | "vanne_sectionnement" | "source"
type FluidConnectionStatus = "installed" | "pending" | "tested"

type FluidConnection = {
  id: string
  room: string
  zone: string
  type: FluidConnectionType
  status: FluidConnectionStatus
}

type FluidSystem = {
  id: string
  type: "O2" | "VIDE" | "AIR_MEDICAL"
  name: string
  color: string
  bgColor: string
  source: string
  sourceRoom: string
  networkInstalled: boolean
  pressureTestDone: boolean
  leakageTestDone: boolean
  identificationDone: boolean
  pvSigned: boolean
  doeSubmitted: boolean
  brasageDone: boolean
  outletsDone: boolean
  qualityAnalysisDone: boolean
  connections: FluidConnection[]
  progress: number
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const fluidSystems: FluidSystem[] = [
  {
    id: "o2",
    type: "O2",
    name: "Oxygène Médical",
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    source: "Centrale O2 médicale 2×50L",
    sourceRoom: "Local Fluides SS",
    networkInstalled: true,
    brasageDone: false,
    pressureTestDone: false,
    leakageTestDone: false,
    identificationDone: false,
    outletsDone: false,
    qualityAnalysisDone: false,
    pvSigned: false,
    doeSubmitted: false,
    progress: 25,
    connections: [
      { id: "o2-1", room: "Salle Opératoire", zone: "Bloc Césarienne", type: "prise_murale", status: "pending" },
      { id: "o2-2", room: "SSPI", zone: "Bloc Césarienne", type: "prise_murale", status: "pending" },
      { id: "o2-3", room: "Box Urgences 1", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "o2-4", room: "Box Urgences 2", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "o2-5", room: "Salle Déchocage", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "o2-6", room: "Chambre 101", zone: "Hospitalisation", type: "prise_murale", status: "pending" },
      { id: "o2-7", room: "Chambre 102", zone: "Hospitalisation", type: "prise_murale", status: "pending" },
      { id: "o2-8", room: "Local Fluides SS", zone: "Locaux Techniques", type: "source", status: "installed" },
    ],
  },
  {
    id: "vide",
    type: "VIDE",
    name: "Vide Médical",
    color: "#8B5CF6",
    bgColor: "bg-purple-50",
    source: "Centrale aspiration 2×pompes",
    sourceRoom: "Local Fluides SS",
    networkInstalled: true,
    brasageDone: false,
    pressureTestDone: false,
    leakageTestDone: false,
    identificationDone: false,
    outletsDone: false,
    qualityAnalysisDone: false,
    pvSigned: false,
    doeSubmitted: false,
    progress: 20,
    connections: [
      { id: "v-1", room: "Salle Opératoire", zone: "Bloc Césarienne", type: "prise_murale", status: "pending" },
      { id: "v-2", room: "SSPI", zone: "Bloc Césarienne", type: "prise_murale", status: "pending" },
      { id: "v-3", room: "Box Urgences 1", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "v-4", room: "Box Urgences 2", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "v-5", room: "Salle Déchocage", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "v-6", room: "Local Fluides SS", zone: "Locaux Techniques", type: "source", status: "installed" },
    ],
  },
  {
    id: "air",
    type: "AIR_MEDICAL",
    name: "Air Médical",
    color: "#10B981",
    bgColor: "bg-green-50",
    source: "Compresseur air médical 2×",
    sourceRoom: "Local Fluides SS",
    networkInstalled: false,
    brasageDone: false,
    pressureTestDone: false,
    leakageTestDone: false,
    identificationDone: false,
    outletsDone: false,
    qualityAnalysisDone: false,
    pvSigned: false,
    doeSubmitted: false,
    progress: 10,
    connections: [
      { id: "a-1", room: "Salle Opératoire", zone: "Bloc Césarienne", type: "prise_murale", status: "pending" },
      { id: "a-2", room: "SSPI", zone: "Bloc Césarienne", type: "prise_murale", status: "pending" },
      { id: "a-3", room: "Box Urgences 1", zone: "Urgences", type: "prise_murale", status: "pending" },
      { id: "a-4", room: "Local Fluides SS", zone: "Locaux Techniques", type: "source", status: "pending" },
    ],
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function connectionTypeLabel(t: FluidConnectionType): string {
  switch (t) {
    case "prise_murale": return "Prise murale"
    case "vanne_sectionnement": return "Vanne sectionnement"
    case "source": return "Source / Centrale"
  }
}

function connectionStatusConfig(s: FluidConnectionStatus): { label: string; className: string } {
  switch (s) {
    case "installed": return { label: "Installée", className: "bg-blue-100 text-blue-700 border-0" }
    case "tested": return { label: "Testée", className: "bg-green-100 text-green-700 border-0" }
    case "pending": return { label: "En attente", className: "bg-amber-100 text-amber-700 border-0" }
  }
}

function getTypeIcon(type: FluidSystem["type"]) {
  switch (type) {
    case "O2": return "O₂"
    case "VIDE": return "∅"
    case "AIR_MEDICAL": return "Ar"
  }
}

// ─── Checklist Item ────────────────────────────────────────────────────────────

function CheckItem({ label, done, critical = false }: { label: string; done: boolean; critical?: boolean }) {
  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${done ? "bg-green-50" : critical ? "bg-red-50" : "bg-slate-50"}`}>
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
      ) : (
        <XCircle className={`w-4 h-4 flex-shrink-0 ${critical ? "text-red-500" : "text-slate-400"}`} />
      )}
      <span className={`text-sm ${done ? "text-green-800" : critical ? "text-red-700 font-medium" : "text-slate-600"}`}>
        {label}
      </span>
      {!done && critical && (
        <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
          CRITIQUE
        </span>
      )}
    </div>
  )
}

// ─── Fluid System Card ─────────────────────────────────────────────────────────

function FluidSystemCard({ system }: { system: FluidSystem }) {
  const [connectionsOpen, setConnectionsOpen] = useState(false)

  const installedCount = system.connections.filter((c) => c.status === "installed" || c.status === "tested").length
  const testedCount = system.connections.filter((c) => c.status === "tested").length

  const criticalIncomplete = !system.pvSigned || !system.qualityAnalysisDone || !system.leakageTestDone

  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden flex flex-col">
      {/* Colored header */}
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: system.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-black text-lg leading-none">{getTypeIcon(system.type)}</span>
            </div>
            <div>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">{system.type.replace("_", " ")}</p>
              <h3 className="text-base font-bold">{system.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black">{system.progress}%</p>
            <p className="text-xs opacity-80">avancement</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4 flex-1">
        {/* Source info */}
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Source</p>
          <p className="text-sm font-semibold text-slate-800">{system.source}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />{system.sourceRoom}
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Avancement global</span>
            <span className="text-xs font-bold text-slate-700">{system.progress}%</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${system.progress}%`, backgroundColor: system.color }}
            />
          </div>
        </div>

        {/* Validation checklist */}
        <div>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Checklist validation</p>
          <div className="space-y-1">
            <CheckItem label="Plan validé" done={true} />
            <CheckItem label="Réservations validées" done={true} />
            <CheckItem label="Réseau posé" done={system.networkInstalled} critical={!system.networkInstalled} />
            <CheckItem label="Brasage terminé" done={system.brasageDone} critical={!system.brasageDone} />
            <CheckItem label="Test pression réalisé" done={system.pressureTestDone} critical={!system.pressureTestDone} />
            <CheckItem label="Test étanchéité réalisé" done={system.leakageTestDone} critical={!system.leakageTestDone} />
            <CheckItem label="Repérage / Identification" done={system.identificationDone} />
            <CheckItem label="Prises installées" done={system.outletsDone} critical={!system.outletsDone} />
            <CheckItem label="Analyse qualité gaz" done={system.qualityAnalysisDone} critical={!system.qualityAnalysisDone} />
            <CheckItem label="PV signé organisme agréé" done={system.pvSigned} critical={!system.pvSigned} />
            <CheckItem label="DOE remis" done={system.doeSubmitted} />
          </div>
        </div>

        {/* Connections accordion */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setConnectionsOpen(!connectionsOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
          >
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-500" />
              Points de connexion
              <span className="text-xs text-slate-500 font-normal">
                ({installedCount}/{system.connections.length} installées)
              </span>
            </span>
            {connectionsOpen
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>
          {connectionsOpen && (
            <div className="divide-y divide-slate-100">
              {system.connections.map((conn) => {
                const statusCfg = connectionStatusConfig(conn.status)
                return (
                  <div key={conn.id} className="px-3 py-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{conn.room}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{conn.zone}
                        <span className="text-slate-300 mx-1">·</span>
                        {connectionTypeLabel(conn.type)}
                      </p>
                    </div>
                    <Badge className={`${statusCfg.className} text-xs flex-shrink-0`}>{statusCfg.label}</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Status warning */}
        {criticalIncomplete && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">
              Éléments critiques non complétés — mise en service interdite sans validation complète et PV signé.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FluidesMedicauxPage() {
  const avgProgress = Math.round(fluidSystems.reduce((acc, s) => acc + s.progress, 0) / fluidSystems.length)

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            Fluides Médicaux
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">O₂ — Vide — Air médical — Polyclinique Cité Nassib</p>
        </div>
      </div>

      {/* Critical danger banner */}
      <div className="flex items-start gap-3 bg-red-50 border-2 border-red-400 rounded-lg p-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-base">⛔</span>
        </div>
        <div>
          <p className="text-sm font-bold text-red-900 mb-0.5">CRITIQUE — Sécurité vitale</p>
          <p className="text-sm text-red-800">
            Les fluides médicaux sont des équipements de sécurité vitale.
            Aucune mise en service sans validation complète et PV signé par organisme agréé.
          </p>
        </div>
      </div>

      {/* Global progress overview */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">Avancement global — Fluides médicaux</p>
          <div className="space-y-3">
            {fluidSystems.map((system) => (
              <div key={system.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: system.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">{system.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{system.progress}%</span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${system.progress}%`, backgroundColor: system.color }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-600">Moyenne globale</span>
                <span className="text-sm font-bold text-slate-800">{avgProgress}%</span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-500"
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {fluidSystems.map((system) => {
          const checklistTotal = 11
          const checklistDone = [
            true, // plan validé
            true, // réservations validées
            system.networkInstalled,
            system.brasageDone,
            system.pressureTestDone,
            system.leakageTestDone,
            system.identificationDone,
            system.outletsDone,
            system.qualityAnalysisDone,
            system.pvSigned,
            system.doeSubmitted,
          ].filter(Boolean).length
          return (
            <div
              key={system.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: `${system.color}40`, backgroundColor: `${system.color}10` }}
            >
              <span style={{ color: system.color }} className="font-bold">{system.name}</span>
              <span className="text-slate-500">—</span>
              <span className="text-slate-700">{checklistDone}/{checklistTotal} validations</span>
              {checklistDone < checklistTotal && (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
          )
        })}
      </div>

      {/* Fluid system cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {fluidSystems.map((system) => (
          <FluidSystemCard key={system.id} system={system} />
        ))}
      </div>
    </div>
  )
}
