"use client"

import { useState } from "react"
import {
  MapPin,
  Filter,
  X,
  Check,
  AlertTriangle,
  ChevronRight,
  Building2,
  Layers,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomStatus = "not_started" | "in_progress" | "finished" | "delivered"
type FloorCode = "RDC" | "R+1" | "SS"

interface TradeStatus {
  cfo: boolean
  cvc: boolean
  plb: boolean
  ssi: boolean
  flu: boolean
}

interface RoomData {
  id: string
  code: string
  name: string
  area_sqm: number
  functional_use: string
  status: RoomStatus
  progress: number
  trades: TradeStatus
  pending_items: string[]
  notes?: string
}

interface ZoneData {
  id: string
  code: string
  name: string
  floor: FloorCode
  area_sqm: number
  functional_type: string
  progress: number
  status: RoomStatus
  rooms: RoomData[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ZONES: ZoneData[] = [
  {
    id: "Z01", code: "Z01", name: "Accueil / Administration", floor: "RDC",
    area_sqm: 420, functional_type: "Administration", progress: 55, status: "in_progress",
    rooms: [
      {
        id: "R01", code: "Z01-01", name: "Hall d'accueil", area_sqm: 80, functional_use: "Accueil public",
        status: "in_progress", progress: 70,
        trades: { cfo: true, cvc: true, plb: false, ssi: true, flu: false },
        pending_items: ["Plomberie: points d'eau à compléter", "Fluides: non applicable"],
      },
      {
        id: "R02", code: "Z01-02", name: "Secrétariat médical", area_sqm: 35, functional_use: "Administration",
        status: "in_progress", progress: 60,
        trades: { cfo: true, cvc: true, plb: true, ssi: false, flu: false },
        pending_items: ["SSI: pose détecteurs en attente"],
      },
      {
        id: "R03", code: "Z01-03", name: "Salle d'attente", area_sqm: 55, functional_use: "Attente patients",
        status: "in_progress", progress: 65,
        trades: { cfo: true, cvc: true, plb: false, ssi: false, flu: false },
        pending_items: ["Plomberie: non prévu", "SSI: câblage en cours"],
      },
      {
        id: "R04", code: "Z01-04", name: "Bureau directeur médical", area_sqm: 25, functional_use: "Direction",
        status: "finished", progress: 100,
        trades: { cfo: true, cvc: true, plb: true, ssi: true, flu: false },
        pending_items: [],
      },
      {
        id: "R05", code: "Z01-05", name: "Salle de réunion", area_sqm: 40, functional_use: "Réunion",
        status: "in_progress", progress: 50,
        trades: { cfo: true, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["CVC: gaines en attente de passage", "Plomberie: non prévu", "SSI: non démarré"],
      },
      {
        id: "R06", code: "Z01-06", name: "Sanitaires RDC", area_sqm: 18, functional_use: "Sanitaires",
        status: "not_started", progress: 0,
        trades: { cfo: false, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["Tous les corps d'état: non démarrés"],
      },
    ],
  },
  {
    id: "Z02", code: "Z02", name: "Urgences", floor: "RDC",
    area_sqm: 320, functional_type: "Urgences médicales", progress: 30, status: "in_progress",
    rooms: [
      {
        id: "R07", code: "Z02-01", name: "Box urgences n°1", area_sqm: 20, functional_use: "Soins urgence",
        status: "in_progress", progress: 35,
        trades: { cfo: true, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["CVC: en attente LOT-CVC", "Plomberie: réservations faites", "SSI: non démarré", "Fluides: O2 + vide en attente"],
        notes: "Zone critique — fluides médicaux obligatoires",
      },
      {
        id: "R08", code: "Z02-02", name: "Box urgences n°2", area_sqm: 20, functional_use: "Soins urgence",
        status: "in_progress", progress: 35,
        trades: { cfo: true, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["CVC: en attente LOT-CVC", "Plomberie: réservations faites", "SSI: non démarré", "Fluides: O2 + vide en attente"],
      },
      {
        id: "R09", code: "Z02-03", name: "Salle de déchocage", area_sqm: 35, functional_use: "Déchocage",
        status: "not_started", progress: 0,
        trades: { cfo: false, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["Tous les corps d'état: non démarrés"],
        notes: "Priorité absolue — chemin critique",
      },
    ],
  },
  {
    id: "Z03", code: "Z03", name: "Bloc Césarienne", floor: "R+1",
    area_sqm: 280, functional_type: "Bloc opératoire", progress: 15, status: "in_progress",
    rooms: [
      {
        id: "R10", code: "Z03-01", name: "Salle opératoire principale", area_sqm: 42, functional_use: "Chirurgie",
        status: "in_progress", progress: 15,
        trades: { cfo: true, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["CVC: réseau bloqué (LOT-FLU)", "Plomberie: en cours", "SSI: non démarré", "Fluides: O2 + vide + air med. obligatoires"],
        notes: "Zone ultra-critique — validation ADE obligatoire",
      },
      {
        id: "R11", code: "Z03-02", name: "Salle de réveil (SSPI)", area_sqm: 30, functional_use: "Post-op",
        status: "in_progress", progress: 10,
        trades: { cfo: true, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["CVC: ventilation SSPI bloquée", "Fluides: 4 prises O2 prévues"],
      },
      {
        id: "R12", code: "Z03-03", name: "Sas lavage chirurgical", area_sqm: 12, functional_use: "Préparation",
        status: "not_started", progress: 0,
        trades: { cfo: false, cvc: false, plb: false, ssi: false, flu: false },
        pending_items: ["Tous corps d'état: non démarrés"],
      },
    ],
  },
  {
    id: "Z04", code: "Z04", name: "Hospitalisation", floor: "R+1",
    area_sqm: 560, functional_type: "Hébergement patients", progress: 40, status: "in_progress",
    rooms: [
      {
        id: "R13", code: "Z04-01", name: "Chambre double A", area_sqm: 28, functional_use: "Hospitalisation",
        status: "in_progress", progress: 50,
        trades: { cfo: true, cvc: true, plb: true, ssi: false, flu: false },
        pending_items: ["SSI: câblage non démarré", "Fluides: O2 mural en attente"],
      },
      {
        id: "R14", code: "Z04-02", name: "Chambre simple B", area_sqm: 18, functional_use: "Hospitalisation",
        status: "in_progress", progress: 55,
        trades: { cfo: true, cvc: true, plb: true, ssi: true, flu: false },
        pending_items: ["Fluides: O2 mural en attente"],
      },
    ],
  },
  {
    id: "Z05", code: "Z05", name: "Locaux Techniques", floor: "SS",
    area_sqm: 450, functional_type: "Technique MEP", progress: 65, status: "in_progress",
    rooms: [
      {
        id: "R15", code: "Z05-01", name: "Chaufferie / Centrale CVC", area_sqm: 120, functional_use: "Technique",
        status: "in_progress", progress: 65,
        trades: { cfo: true, cvc: true, plb: true, ssi: true, flu: false },
        pending_items: ["Fluides: centrale O2 en cours d'installation"],
        notes: "Centrale technique principale",
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roomStatusLabel(s: RoomStatus): string {
  return { not_started: "Non démarré", in_progress: "En cours", finished: "Terminé", delivered: "Livré" }[s]
}

function roomStatusColor(s: RoomStatus): string {
  return {
    not_started: "bg-gray-100 text-gray-600 border-gray-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    finished: "bg-green-50 text-green-700 border-green-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[s]
}

function roomCardBorder(s: RoomStatus): string {
  return {
    not_started: "border-l-gray-300",
    in_progress: "border-l-blue-500",
    finished: "border-l-green-500",
    delivered: "border-l-emerald-500",
  }[s]
}

function progressColor(p: number): string {
  if (p >= 80) return "bg-green-500"
  if (p >= 50) return "bg-blue-500"
  if (p >= 20) return "bg-amber-500"
  return "bg-gray-300"
}

const TRADE_LABELS: Record<keyof TradeStatus, string> = {
  cfo: "CFO",
  cvc: "CVC",
  plb: "Plomb.",
  ssi: "SSI",
  flu: "Fluides",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ZoneSummaryCard({ zone, selected, onClick }: {
  zone: ZoneData
  selected: boolean
  onClick: () => void
}) {
  const alertCount = zone.rooms.filter(r => r.status === "not_started" || r.pending_items.length > 0).length
  return (
    <button
      onClick={onClick}
      className={`text-left w-full border rounded-xl p-4 transition-all ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-xs font-mono text-slate-400">{zone.code}</span>
          <h3 className="text-sm font-semibold text-slate-800 leading-tight mt-0.5">{zone.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs rounded-md px-1.5 py-0.5 border font-medium ${roomStatusColor(zone.status)}`}>
            {roomStatusLabel(zone.status)}
          </span>
          {alertCount > 0 && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
              ⚠ {alertCount}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <Layers className="w-3 h-3" />
        <span>{zone.floor}</span>
        <span>·</span>
        <span>{zone.area_sqm} m²</span>
        <span>·</span>
        <span>{zone.rooms.length} locaux</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-100 rounded-full h-2">
          <div
            className={`${progressColor(zone.progress)} h-2 rounded-full transition-all`}
            style={{ width: `${zone.progress}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${selected ? "text-blue-700" : "text-slate-600"}`}>
          {zone.progress}%
        </span>
      </div>
    </button>
  )
}

function TradeChip({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border font-medium ${
      done
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-gray-50 text-gray-500 border-gray-200"
    }`}>
      {done
        ? <Check className="w-3 h-3" />
        : <X className="w-3 h-3" />}
      {label}
    </div>
  )
}

function RoomDetailModal({ room, onClose }: { room: RoomData | null; onClose: () => void }) {
  if (!room) return null
  return (
    <Dialog open={!!room} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-500">{room.code}</span>
            <span>{room.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status + progress */}
          <div className="flex items-center justify-between">
            <span className={`text-xs rounded-md px-2 py-1 border font-medium ${roomStatusColor(room.status)}`}>
              {roomStatusLabel(room.status)}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-100 rounded-full h-2">
                <div
                  className={`${progressColor(room.progress)} h-2 rounded-full`}
                  style={{ width: `${room.progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">{room.progress}%</span>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 mb-1">Surface</p>
              <p className="font-semibold text-slate-800">{room.area_sqm} m²</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 mb-1">Usage fonctionnel</p>
              <p className="font-semibold text-slate-800">{room.functional_use}</p>
            </div>
          </div>

          {/* Trades */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Corps d&apos;état</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(room.trades) as (keyof TradeStatus)[]).map(t => (
                <TradeChip key={t} label={TRADE_LABELS[t]} done={room.trades[t]} />
              ))}
            </div>
          </div>

          {/* Pending items */}
          {room.pending_items.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Points en attente ({room.pending_items.length})
              </p>
              <ul className="space-y-1.5">
                {room.pending_items.map((item, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2 bg-amber-50 rounded p-2 border border-amber-100">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {room.notes && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">Note</p>
              <p className="text-xs text-blue-800">{room.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ZonesPage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("Z01")
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null)
  const [filterFloor, setFilterFloor] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const selectedZone = ZONES.find(z => z.id === selectedZoneId) ?? ZONES[0]

  const filteredZones = ZONES.filter(z => {
    if (filterFloor !== "all" && z.floor !== filterFloor) return false
    if (filterStatus !== "all" && z.status !== filterStatus) return false
    return true
  })

  const allRooms = ZONES.flatMap(z => z.rooms)
  const totalRooms = allRooms.length
  const finishedRooms = allRooms.filter(r => r.status === "finished" || r.status === "delivered").length
  const inProgressRooms = allRooms.filter(r => r.status === "in_progress").length

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Zones & Locaux</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {ZONES.length} zones · {totalRooms} locaux · {finishedRooms} terminés · {inProgressRooms} en cours
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1.5">
            <Check className="w-3 h-3" />
            {finishedRooms} terminés
          </div>
          <div className="flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5">
            <Building2 className="w-3 h-3" />
            {inProgressRooms} en cours
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-500 font-medium">Légende statut local :</span>
        {(["not_started", "in_progress", "finished", "delivered"] as RoomStatus[]).map(s => (
          <span key={s} className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 border font-medium ${roomStatusColor(s)}`}>
            {roomStatusLabel(s)}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          className="border border-slate-200 rounded-md px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
        >
          <option value="all">Tous les niveaux</option>
          <option value="SS">Sous-sol (SS)</option>
          <option value="RDC">RDC</option>
          <option value="R+1">R+1</option>
        </select>
        <select
          className="border border-slate-200 rounded-md px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="not_started">Non démarré</option>
          <option value="in_progress">En cours</option>
          <option value="finished">Terminé</option>
          <option value="delivered">Livré</option>
        </select>
        {(filterFloor !== "all" || filterStatus !== "all") && (
          <button
            onClick={() => { setFilterFloor("all"); setFilterStatus("all") }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 rounded-md px-2 py-1.5"
          >
            <X className="w-3 h-3" /> Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Zone selector */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Zones fonctionnelles
          </h2>
          {filteredZones.map(zone => (
            <ZoneSummaryCard
              key={zone.id}
              zone={zone}
              selected={selectedZoneId === zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
            />
          ))}
        </div>

        {/* Room grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {selectedZone.name}
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {selectedZone.floor} · {selectedZone.area_sqm} m²
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedZone.rooms.length} locaux · {selectedZone.functional_type}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-100 rounded-full h-2">
                <div
                  className={`${progressColor(selectedZone.progress)} h-2 rounded-full`}
                  style={{ width: `${selectedZone.progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-700">{selectedZone.progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {selectedZone.rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`text-left border-l-4 border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all hover:border-r-blue-100 ${roomCardBorder(room.status)}`}
              >
                {/* Room header */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-slate-400">{room.code}</p>
                    <p className="text-sm font-semibold text-slate-800 leading-tight truncate" title={room.name}>
                      {room.name}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                </div>

                {/* Area + use */}
                <p className="text-xs text-slate-500 mb-2">{room.area_sqm} m² · {room.functional_use}</p>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`${progressColor(room.progress)} h-1.5 rounded-full`}
                      style={{ width: `${room.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{room.progress}%</span>
                </div>

                {/* Trades */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {(Object.keys(room.trades) as (keyof TradeStatus)[]).map(t => (
                    <div
                      key={t}
                      className={`flex items-center gap-0.5 text-xs px-1 py-0.5 rounded ${
                        room.trades[t]
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                      title={room.trades[t] ? `${TRADE_LABELS[t]}: OK` : `${TRADE_LABELS[t]}: en attente`}
                    >
                      {room.trades[t] ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                      {TRADE_LABELS[t]}
                    </div>
                  ))}
                </div>

                {/* Status + alerts */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs rounded px-1.5 py-0.5 border font-medium ${roomStatusColor(room.status)}`}>
                    {roomStatusLabel(room.status)}
                  </span>
                  {room.pending_items.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle className="w-3 h-3" />
                      {room.pending_items.length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </div>
  )
}
