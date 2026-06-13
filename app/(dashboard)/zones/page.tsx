"use client"

import { useState } from "react"
import {
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Zap,
  Wifi,
  Wind,
  Droplets,
  FlaskConical,
  ShieldAlert,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// ─── Types ─────────────────────────────────────────────────────────────────────

type RoomStatus =
  | "non_commence"
  | "en_travaux"
  | "termine_brut"
  | "finitions"
  | "validation_technique"
  | "pret_reception"
  | "livre"

type MEPNeeds = {
  cfo: boolean
  cfa: boolean
  cvc: boolean
  plomberie: boolean
  fluides: boolean
  ssi: boolean
}

type Room = {
  id: string
  code: string
  name: string
  area: number
  status: RoomStatus
  progress: number
  needs: MEPNeeds
  done: MEPNeeds
  reservations: number
  equipment: number
  notes?: string
}

type Zone = {
  id: string
  code: string
  name: string
  floor: string
  area: number
  status: RoomStatus
  progress: number
  rooms: Room[]
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const defaultNeeds = (): MEPNeeds => ({
  cfo: false,
  cfa: false,
  cvc: false,
  plomberie: false,
  fluides: false,
  ssi: false,
})

const defaultDone = (): MEPNeeds => ({
  cfo: false,
  cfa: false,
  cvc: false,
  plomberie: false,
  fluides: false,
  ssi: false,
})

const zones: Zone[] = [
  {
    id: "z01",
    code: "Z01",
    name: "Accueil / Administration",
    floor: "RDC",
    area: 680,
    status: "finitions",
    progress: 65,
    rooms: [
      {
        id: "b001", code: "B001", name: "Hall d'accueil", area: 120, status: "finitions", progress: 70,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true },
        done: { ...defaultDone(), cfo: true, cfa: true },
        reservations: 1, equipment: 3,
        notes: "Revêtement sol en cours de pose.",
      },
      {
        id: "b002", code: "B002", name: "Bureau admission", area: 25, status: "finitions", progress: 75,
        needs: { ...defaultNeeds(), cfo: true, cfa: true },
        done: { ...defaultDone(), cfo: true, cfa: true },
        reservations: 0, equipment: 2,
      },
      {
        id: "b003", code: "B003", name: "Salle d'attente", area: 80, status: "en_travaux", progress: 50,
        needs: { ...defaultNeeds(), cfo: true, cvc: true },
        done: { ...defaultDone(), cfo: true },
        reservations: 2, equipment: 0,
        notes: "Cloisons en cours.",
      },
      {
        id: "b004", code: "B004", name: "Bureau direction", area: 30, status: "pret_reception", progress: 90,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true },
        done: { ...defaultDone(), cfo: true, cfa: true, cvc: true },
        reservations: 0, equipment: 4,
      },
      {
        id: "b005", code: "B005", name: "Secrétariat", area: 20, status: "finitions", progress: 80,
        needs: { ...defaultNeeds(), cfo: true, cfa: true },
        done: { ...defaultDone(), cfo: true, cfa: true },
        reservations: 0, equipment: 3,
      },
      {
        id: "b006", code: "B006", name: "Salle réunion admin", area: 35, status: "termine_brut", progress: 40,
        needs: { ...defaultNeeds(), cfo: true, cvc: true },
        done: { ...defaultDone(), cfo: false },
        reservations: 1, equipment: 0,
      },
    ],
  },
  {
    id: "z02",
    code: "Z02",
    name: "Urgences",
    floor: "RDC",
    area: 420,
    status: "en_travaux",
    progress: 35,
    rooms: [
      {
        id: "u001", code: "U001", name: "Box urgences 1", area: 18, status: "en_travaux", progress: 30,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true, plomberie: true, fluides: true },
        done: { ...defaultDone(), cfo: false },
        reservations: 2, equipment: 1,
        notes: "Réseau fluides médicaux en attente.",
      },
      {
        id: "u002", code: "U002", name: "Box urgences 2", area: 18, status: "en_travaux", progress: 30,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true, plomberie: true, fluides: true },
        done: { ...defaultDone(), cfo: false },
        reservations: 2, equipment: 1,
      },
      {
        id: "u003", code: "U003", name: "Salle déchocage", area: 40, status: "en_travaux", progress: 25,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true, plomberie: true, fluides: true, ssi: true },
        done: { ...defaultDone() },
        reservations: 3, equipment: 2,
        notes: "Zone critique — toutes MEP requises.",
      },
    ],
  },
  {
    id: "z03",
    code: "Z03",
    name: "Bloc Césarienne",
    floor: "R+1",
    area: 280,
    status: "en_travaux",
    progress: 20,
    rooms: [
      {
        id: "bl001", code: "BL001", name: "Salle opératoire", area: 55, status: "en_travaux", progress: 20,
        needs: { cfo: true, cfa: true, cvc: true, plomberie: true, fluides: true, ssi: true },
        done: { ...defaultDone() },
        reservations: 4, equipment: 0,
        notes: "Toutes corps d'état requis. Priorité absolue.",
      },
      {
        id: "bl002", code: "BL002", name: "SSPI", area: 35, status: "non_commence", progress: 0,
        needs: { ...defaultNeeds(), cfo: true, cvc: true, fluides: true },
        done: { ...defaultDone() },
        reservations: 0, equipment: 0,
      },
      {
        id: "bl003", code: "BL003", name: "Salle réveil", area: 30, status: "non_commence", progress: 0,
        needs: { ...defaultNeeds(), cfo: true, cvc: true, fluides: true },
        done: { ...defaultDone() },
        reservations: 0, equipment: 0,
      },
    ],
  },
  {
    id: "z04",
    code: "Z04",
    name: "Hospitalisation",
    floor: "R+1",
    area: 480,
    status: "finitions",
    progress: 55,
    rooms: [
      {
        id: "h001", code: "H001", name: "Chambre 101", area: 22, status: "finitions", progress: 60,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true, fluides: true },
        done: { ...defaultDone(), cfo: true, cfa: true },
        reservations: 1, equipment: 2,
      },
      {
        id: "h002", code: "H002", name: "Chambre 102", area: 22, status: "finitions", progress: 60,
        needs: { ...defaultNeeds(), cfo: true, cfa: true, cvc: true, fluides: true },
        done: { ...defaultDone(), cfo: true, cfa: true },
        reservations: 1, equipment: 2,
      },
    ],
  },
  {
    id: "z05",
    code: "Z05",
    name: "Locaux Techniques",
    floor: "SS",
    area: 450,
    status: "pret_reception",
    progress: 70,
    rooms: [
      {
        id: "t001", code: "T001", name: "Local CTA", area: 80, status: "pret_reception", progress: 85,
        needs: { ...defaultNeeds(), cfo: true, cvc: true },
        done: { ...defaultDone(), cfo: true, cvc: true },
        reservations: 0, equipment: 5,
        notes: "Centrale de traitement d'air installée.",
      },
    ],
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getStatusConfig(status: RoomStatus) {
  switch (status) {
    case "non_commence":
      return { label: "Non commencé", className: "bg-gray-100 text-gray-700 border-0" }
    case "en_travaux":
      return { label: "En travaux", className: "bg-yellow-100 text-yellow-800 border-0" }
    case "termine_brut":
      return { label: "Terminé brut", className: "bg-orange-100 text-orange-800 border-0" }
    case "finitions":
      return { label: "Finitions", className: "bg-blue-100 text-blue-800 border-0" }
    case "validation_technique":
      return { label: "Validation technique", className: "bg-purple-100 text-purple-800 border-0" }
    case "pret_reception":
      return { label: "Prêt réception", className: "bg-green-100 text-green-800 border-0" }
    case "livre":
      return { label: "Livré", className: "bg-emerald-100 text-emerald-800 border-0" }
  }
}

function getProgressColor(status: RoomStatus) {
  switch (status) {
    case "non_commence": return "bg-gray-300"
    case "en_travaux": return "bg-yellow-400"
    case "termine_brut": return "bg-orange-400"
    case "finitions": return "bg-blue-400"
    case "validation_technique": return "bg-purple-400"
    case "pret_reception": return "bg-green-400"
    case "livre": return "bg-emerald-500"
  }
}

const MEP_ITEMS: { key: keyof MEPNeeds; label: string; Icon: React.ElementType }[] = [
  { key: "cfo", label: "CFO", Icon: Zap },
  { key: "cfa", label: "CFA", Icon: Wifi },
  { key: "cvc", label: "CVC", Icon: Wind },
  { key: "plomberie", label: "Plom", Icon: Droplets },
  { key: "fluides", label: "Fluides", Icon: FlaskConical },
  { key: "ssi", label: "SSI", Icon: ShieldAlert },
]

function MEPChecklist({ needs, done }: { needs: MEPNeeds; done: MEPNeeds }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {MEP_ITEMS.map(({ key, label, Icon }) => {
        if (!needs[key]) {
          return (
            <span key={key} className="flex items-center gap-0.5 text-xs text-slate-300 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </span>
          )
        }
        return (
          <span
            key={key}
            className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border ${
              done[key]
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {done[key] ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>{label}</span>
          </span>
        )
      })}
    </div>
  )
}

// ─── Room Detail Modal ─────────────────────────────────────────────────────────

function RoomDetailModal({ room, zone, onClose }: { room: Room | null; zone: Zone | null; onClose: () => void }) {
  if (!room || !zone) return null
  const statusCfg = getStatusConfig(room.status)
  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-base">{room.code}</span>
            <span className="text-slate-700">{room.name}</span>
            <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Zone", value: `${zone.code} — ${zone.name}` },
              { label: "Niveau", value: zone.floor },
              { label: "Surface", value: `${room.area} m²` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold text-slate-700">Avancement</p>
              <span className="text-sm font-bold text-slate-800">{room.progress}%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(room.status)}`}
                style={{ width: `${room.progress}%` }}
              />
            </div>
          </div>

          {/* MEP Checklist detail */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Corps d'état (MEP)</p>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
              {MEP_ITEMS.map(({ key, label, Icon }) => (
                <div key={key} className={`flex items-center justify-between px-3 py-2 ${!room.needs[key] ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">{label}</span>
                  </div>
                  {!room.needs[key] ? (
                    <span className="text-xs text-slate-400">Non requis</span>
                  ) : room.done[key] ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 className="w-4 h-4" />Terminé
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                      <XCircle className="w-4 h-4" />En attente
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${room.reservations > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              <AlertCircle className="w-4 h-4" />
              {room.reservations} réserve{room.reservations !== 1 ? "s" : ""}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${room.equipment > 0 ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-500"}`}>
              <Building2 className="w-4 h-4" />
              {room.equipment} équipement{room.equipment !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Notes */}
          {room.notes && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Notes</p>
              <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3">{room.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">Ajouter une réserve</Button>
          <Button className="bg-slate-800 hover:bg-slate-900 text-white">Modifier le statut</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Room Card ─────────────────────────────────────────────────────────────────

function RoomCard({ room, zone, onSelect }: { room: Room; zone: Zone; onSelect: () => void }) {
  const statusCfg = getStatusConfig(room.status)
  const progressColor = getProgressColor(room.status)

  return (
    <Card
      className="shadow-sm border-slate-200 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
      onClick={onSelect}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{room.code}</span>
            <p className="text-sm font-semibold text-slate-800 mt-1 leading-tight">{room.name}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
        </div>

        {/* Area + floor */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            {room.area} m²
          </span>
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            {zone.floor}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Avancement</span>
            <span className="text-xs font-bold text-slate-700">{room.progress}%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${progressColor}`}
              style={{ width: `${room.progress}%` }}
            />
          </div>
        </div>

        {/* Status badge */}
        <Badge className={`${statusCfg.className} text-xs`}>{statusCfg.label}</Badge>

        {/* MEP icons */}
        <MEPChecklist needs={room.needs} done={room.done} />

        {/* Reservations + equipment */}
        <div className="flex items-center gap-2 pt-1">
          {room.reservations > 0 && (
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {room.reservations} réserve{room.reservations !== 1 ? "s" : ""}
            </span>
          )}
          {room.equipment > 0 && (
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {room.equipment} équip.
            </span>
          )}
          {room.reservations === 0 && room.equipment === 0 && (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ZonesPage() {
  const [selectedZoneId, setSelectedZoneId] = useState("z01")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedRoomZone, setSelectedRoomZone] = useState<Zone | null>(null)

  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? zones[0]

  const totalRooms = zones.reduce((acc, z) => acc + z.rooms.length, 0)
  const avgProgress = Math.round(zones.reduce((acc, z) => acc + z.progress, 0) / zones.length)

  const allRoomsFlat = zones.flatMap((z) => z.rooms)
  const readyCount = allRoomsFlat.filter((r) => r.status === "pret_reception" || r.status === "livre").length
  const activeCount = allRoomsFlat.filter((r) => r.status === "en_travaux" || r.status === "finitions").length

  function handleRoomClick(room: Room, zone: Zone) {
    setSelectedRoom(room)
    setSelectedRoomZone(zone)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Zones & Locaux
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Suivi pièce par pièce — Polyclinique Cité Nassib</p>
        </div>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Zones", value: zones.length, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Locaux", value: totalRooms, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "En cours", value: activeCount, color: "text-yellow-700", bg: "bg-yellow-50" },
          { label: "Prêts", value: readyCount, color: "text-green-700", bg: "bg-green-50" },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className={`${bg} border-0 shadow-sm`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              {label === "Zones" && <Building2 className={`w-6 h-6 ${color} opacity-40`} />}
              {label === "Locaux" && <MapPin className={`w-6 h-6 ${color} opacity-40`} />}
              {label === "En cours" && <AlertCircle className={`w-6 h-6 ${color} opacity-40`} />}
              {label === "Prêts" && <CheckCircle2 className={`w-6 h-6 ${color} opacity-40`} />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Avancement global */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Avancement global du projet</span>
            <span className="text-sm font-bold text-slate-900">{avgProgress}%</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Zone tabs */}
      <div className="flex flex-wrap gap-2">
        {zones.map((zone) => {
          const statusCfg = getStatusConfig(zone.status)
          const isActive = zone.id === selectedZoneId
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                isActive
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="font-mono">{zone.code}</span>
              <span className="hidden sm:inline">{zone.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {zone.progress}%
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected zone summary */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{selectedZone.code}</span>
                <h2 className="text-lg font-bold text-slate-900">{selectedZone.name}</h2>
                <Badge className={`${getStatusConfig(selectedZone.status).className} text-xs`}>
                  {getStatusConfig(selectedZone.status).label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{selectedZone.floor}</span>
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-400" />{selectedZone.area} m²</span>
                <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-slate-400" />{selectedZone.rooms.length} local{selectedZone.rooms.length !== 1 ? "ux" : ""}</span>
              </div>
            </div>
            <div className="min-w-[180px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Avancement</span>
                <span className="text-sm font-bold text-slate-800">{selectedZone.progress}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${getProgressColor(selectedZone.status)}`}
                  style={{ width: `${selectedZone.progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room grid */}
      {selectedZone.rooms.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">Aucun local défini pour cette zone.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {selectedZone.rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              zone={selectedZone}
              onSelect={() => handleRoomClick(room, selectedZone)}
            />
          ))}
        </div>
      )}

      {/* Room detail modal */}
      <RoomDetailModal
        room={selectedRoom}
        zone={selectedRoomZone}
        onClose={() => { setSelectedRoom(null); setSelectedRoomZone(null) }}
      />
    </div>
  )
}
