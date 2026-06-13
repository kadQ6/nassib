"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  Filter,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Zap,
  Droplets,
  Wifi,
  Wind,
  Package,
  Plus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ─────────────────────────────────────────────────────────────────────

type EquipStatus = "À définir" | "Validé" | "Commandé" | "Livré" | "Installé" | "Mis en service"

interface Prerequisite {
  label: string
  status: "ok" | "nok" | "pending"
}

interface EquipItem {
  id: string
  code: string
  designation: string
  zone: string
  local: string
  fournisseur: string
  statut: EquipStatus
  livraisonPrevue: string
  quantite: number
  categorie: string
  puissance: string
  poids: string
  dimensions: string
  prerequisites: Prerequisite[]
  instructions: string
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockEquipements: EquipItem[] = [
  {
    id: "1", code: "EBM-001", designation: "Table d'accouchement électrique", zone: "Bloc Obstétrique", local: "Salle d'accouchement SA-01",
    fournisseur: "SCHMITZ & SOEHNE", statut: "Commandé", livraisonPrevue: "15/03/2026", quantite: 3, categorie: "Obstétrique",
    puissance: "400W", poids: "180 kg", dimensions: "2000×900×800 mm",
    prerequisites: [
      { label: "CFO — Prise 230V/16A étanche", status: "ok" },
      { label: "Réseau — RJ45 Cat6A", status: "pending" },
      { label: "Plomberie — Point d'eau + évacuation", status: "ok" },
      { label: "Fluides — O2 + Vide médical + Air comprimé", status: "nok" },
      { label: "CVC — Temp ambiante 20-26°C", status: "pending" },
    ],
    instructions: "Livraison par palette. Accès par monte-charge service. Installation par technicien agréé fournisseur. Tests fonctionnels avec sage-femme référente.",
  },
  {
    id: "2", code: "EBM-002", designation: "Couveuse néonatale intensive", zone: "Néonatologie", local: "Unité néonatologie soins intensifs",
    fournisseur: "DRAGER MEDICAL", statut: "Commandé", livraisonPrevue: "01/04/2026", quantite: 4, categorie: "Néonatologie",
    puissance: "600W", poids: "95 kg", dimensions: "1100×620×1350 mm",
    prerequisites: [
      { label: "CFO — Circuit dédié 230V/10A non interruptible", status: "ok" },
      { label: "Réseau — Port réseau hôpital", status: "nok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — O2 + Vide médical", status: "nok" },
      { label: "CVC — Filtration HEPA classe ISO 7", status: "pending" },
    ],
    instructions: "Déconditionnement en salle propre. Étalonnage capteurs T° et humidité par technicien biomédical avant mise en service.",
  },
  {
    id: "3", code: "EBM-003", designation: "Moniteur multiparamètres", zone: "Urgences", local: "Box Urgences BU-01 à BU-06",
    fournisseur: "PHILIPS HEALTHCARE", statut: "Livré", livraisonPrevue: "10/01/2026", quantite: 6, categorie: "Surveillance",
    puissance: "120W", poids: "12 kg", dimensions: "380×290×250 mm",
    prerequisites: [
      { label: "CFO — Prise 230V/10A avec terre", status: "ok" },
      { label: "Réseau — RJ45 VLAN médical", status: "nok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — O2 si capnographie", status: "pending" },
      { label: "CVC — Pas de contrainte spécifique", status: "ok" },
    ],
    instructions: "Configuration centrale de monitoring à paramétrer par ingénieur biomédical. Intégration DPI selon protocole informatique hôpital.",
  },
  {
    id: "4", code: "EBM-004", designation: "Défibrillateur semi-automatique", zone: "Urgences", local: "Urgences — Zone Déchocage",
    fournisseur: "ZOLL MEDICAL", statut: "Livré", livraisonPrevue: "10/01/2026", quantite: 2, categorie: "Réanimation",
    puissance: "200W max", poids: "6 kg", dimensions: "310×230×145 mm",
    prerequisites: [
      { label: "CFO — Prise de charge 230V", status: "ok" },
      { label: "Réseau — Non requis", status: "ok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — Non requis", status: "ok" },
      { label: "CVC — Pas de contrainte", status: "ok" },
    ],
    instructions: "Vérification batteries et électrodes avant mise en service. Test hebdomadaire automatique. Formation personnel obligatoire.",
  },
  {
    id: "5", code: "EBM-005", designation: "Échographe obstétrical", zone: "Gynécologie", local: "Consultation Gynécologie GYN-01",
    fournisseur: "GE HEALTHCARE", statut: "Commandé", livraisonPrevue: "20/03/2026", quantite: 1, categorie: "Imagerie",
    puissance: "800W", poids: "140 kg", dimensions: "500×700×1600 mm",
    prerequisites: [
      { label: "CFO — Circuit dédié 230V/16A", status: "ok" },
      { label: "Réseau — PACS et réseau hôpital", status: "nok" },
      { label: "Plomberie — Lavabo dans salle", status: "ok" },
      { label: "Fluides — Non requis", status: "ok" },
      { label: "CVC — Pièce climatisée < 26°C", status: "pending" },
    ],
    instructions: "Installation et qualification par ingénieur GE. Formation échographiste par application specialist. Connexion PACS obligatoire avant utilisation.",
  },
  {
    id: "6", code: "EBM-006", designation: "Table opératoire césarienne", zone: "Bloc Opératoire", local: "Salle opératoire BO-01 et BO-02",
    fournisseur: "MAQUET GETINGE", statut: "Commandé", livraisonPrevue: "01/04/2026", quantite: 2, categorie: "Chirurgie",
    puissance: "1200W", poids: "360 kg", dimensions: "2100×560×700/1050 mm",
    prerequisites: [
      { label: "CFO — 3×400V/16A tête de lit", status: "pending" },
      { label: "Réseau — Non requis", status: "ok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — O2 + Vide + Air (têtes de colonne)", status: "nok" },
      { label: "CVC — Salle classe ISO 5 ou 7", status: "nok" },
    ],
    instructions: "Ancrage sol par technicien MAQUET. Qualification OQ et PQ obligatoires. Test de fonctionnement en présence chirurgien référent.",
  },
  {
    id: "7", code: "EBM-007", designation: "Autoclave vapeur 134L", zone: "Stérilisation", local: "Salle stérilisation STER-01",
    fournisseur: "STERNE INDUSTRIE", statut: "À définir", livraisonPrevue: "15/05/2026", quantite: 1, categorie: "Stérilisation",
    puissance: "9000W", poids: "580 kg", dimensions: "1400×760×1200 mm",
    prerequisites: [
      { label: "CFO — Triphasé 400V/32A avec disjoncteur dédié", status: "nok" },
      { label: "Réseau — Non requis", status: "ok" },
      { label: "Plomberie — Alimentation EF DN25 + vidange DN40", status: "nok" },
      { label: "Fluides — Alimentation vapeur ou GV électrique", status: "nok" },
      { label: "CVC — Extraction vapeur obligatoire", status: "nok" },
    ],
    instructions: "Génie civil préalable : dalle renforcée 1000 kg/m². Qualification IQ, OQ, PQ selon EN 285. Certification obligatoire avant utilisation.",
  },
  {
    id: "8", code: "EBM-008", designation: "Analyseur biochimie automatisé", zone: "Laboratoire", local: "Laboratoire biochimie LABO-01",
    fournisseur: "BECKMAN COULTER", statut: "Validé", livraisonPrevue: "01/06/2026", quantite: 1, categorie: "Laboratoire",
    puissance: "2000W", poids: "320 kg", dimensions: "1700×720×1200 mm",
    prerequisites: [
      { label: "CFO — Circuit 230V/20A stabilisé + onduleur", status: "pending" },
      { label: "Réseau — LAN hôpital + SIL", status: "nok" },
      { label: "Plomberie — EF + EU déchets liquides chimiques", status: "pending" },
      { label: "Fluides — Eau de qualité RO", status: "nok" },
      { label: "CVC — Temp 18-26°C, HR 20-80%", status: "pending" },
    ],
    instructions: "Installation par Application Specialist BECKMAN. Qualification analytique avec biochimiste référent. Connexion SIL avant mise en service.",
  },
  {
    id: "9", code: "EBM-009", designation: "Groupe électrogène 250 KVA", zone: "Local Technique", local: "Local GE extérieur Est",
    fournisseur: "SDMO KOHLER", statut: "Commandé", livraisonPrevue: "01/02/2026", quantite: 1, categorie: "Énergie",
    puissance: "250 KVA / 200 kW", poids: "2800 kg", dimensions: "3500×1100×1800 mm",
    prerequisites: [
      { label: "CFO — TGBT raccordement inverseur", status: "pending" },
      { label: "Réseau — Non requis", status: "ok" },
      { label: "Plomberie — Système dépollution huiles", status: "nok" },
      { label: "Fluides — Cuve fioul 1000L enterrée", status: "nok" },
      { label: "CVC — Ventilation locale, extraction gaz", status: "pending" },
    ],
    instructions: "Génie civil : dalle 200mm armée. Canalisation d'échappement vers extérieur. Test de charge 100% avant réception. Certification APAVE.",
  },
  {
    id: "10", code: "EBM-010", designation: "UPS (onduleur) 80 KVA", zone: "Local Technique", local: "Local onduleurs RDC-T02",
    fournisseur: "SCHNEIDER ELECTRIC", statut: "Commandé", livraisonPrevue: "01/02/2026", quantite: 1, categorie: "Énergie",
    puissance: "80 KVA", poids: "780 kg", dimensions: "800×800×1800 mm",
    prerequisites: [
      { label: "CFO — TGBT jeu de barres prioritaire", status: "pending" },
      { label: "Réseau — Supervision SCADA", status: "nok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — Non requis", status: "ok" },
      { label: "CVC — Climatisation local < 25°C obligatoire", status: "nok" },
    ],
    instructions: "Installation et mise en service par électricien habilité HT. Tests sur batteries 1h autonomie. Intégration supervision GTB.",
  },
  {
    id: "11", code: "EBM-011", designation: "Moniteur multiparamètres (Hospit)", zone: "Hospitalisation", local: "Chambres R+1 H-01 à H-12",
    fournisseur: "PHILIPS HEALTHCARE", statut: "Commandé", livraisonPrevue: "15/03/2026", quantite: 6, categorie: "Surveillance",
    puissance: "120W", poids: "12 kg", dimensions: "380×290×250 mm",
    prerequisites: [
      { label: "CFO — Prise tête de lit 230V/10A", status: "ok" },
      { label: "Réseau — RJ45 VLAN médical", status: "nok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — O2 mural si SpO2 ext.", status: "ok" },
      { label: "CVC — Pas de contrainte", status: "ok" },
    ],
    instructions: "Configuration réseau par DSI avant mise en service. Intégration centrale de monitoring urgences.",
  },
  {
    id: "12", code: "EBM-012", designation: "Table d'accouchement électrique", zone: "Bloc Obstétrique", local: "Salle d'accouchement SA-02",
    fournisseur: "SCHMITZ & SOEHNE", statut: "Commandé", livraisonPrevue: "15/03/2026", quantite: 3, categorie: "Obstétrique",
    puissance: "400W", poids: "180 kg", dimensions: "2000×900×800 mm",
    prerequisites: [
      { label: "CFO — Prise 230V/16A étanche", status: "ok" },
      { label: "Réseau — RJ45 Cat6A", status: "pending" },
      { label: "Plomberie — Point d'eau + évacuation", status: "ok" },
      { label: "Fluides — O2 + Vide médical + Air comprimé", status: "nok" },
      { label: "CVC — Temp ambiante 20-26°C", status: "pending" },
    ],
    instructions: "Même modèle que EBM-001. Installation groupée par technicien agréé.",
  },
  {
    id: "13", code: "EBM-013", designation: "Couveuse néonatale (Néonatologie)", zone: "Néonatologie", local: "Néonatologie N-05 à N-08",
    fournisseur: "DRAGER MEDICAL", statut: "À définir", livraisonPrevue: "01/05/2026", quantite: 4, categorie: "Néonatologie",
    puissance: "600W", poids: "95 kg", dimensions: "1100×620×1350 mm",
    prerequisites: [
      { label: "CFO — Circuit non interruptible", status: "pending" },
      { label: "Réseau — VLAN médical", status: "nok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — O2 + Vide", status: "nok" },
      { label: "CVC — ISO 7 en cours de qualification", status: "nok" },
    ],
    instructions: "Livraison différée après qualification HVAC néonatologie.",
  },
  {
    id: "14", code: "EBM-014", designation: "Lampe scialytique LED double", zone: "Bloc Opératoire", local: "Salle BO-01 et BO-02",
    fournisseur: "BERCHTOLD STRYKER", statut: "Validé", livraisonPrevue: "01/04/2026", quantite: 2, categorie: "Chirurgie",
    puissance: "500W", poids: "42 kg", dimensions: "Portée 1200mm",
    prerequisites: [
      { label: "CFO — Alimentation plafond 230V dédiée", status: "pending" },
      { label: "Réseau — Connexion écran chirurgien", status: "nok" },
      { label: "Plomberie — Non requis", status: "ok" },
      { label: "Fluides — Non requis", status: "ok" },
      { label: "CVC — Intégration caisson plafond technique", status: "nok" },
    ],
    instructions: "Fixation au plafond technique béton par spécialiste. Réglage intensité et IRc selon protocole chirurgical.",
  },
  {
    id: "15", code: "EBM-015", designation: "Centrale traitement d'air bloc", zone: "Bloc Opératoire", local: "Local CTA toiture R+3",
    fournisseur: "CARRIER FRANCE", statut: "Bloqué", livraisonPrevue: "15/02/2026", quantite: 1, categorie: "Infrastructure",
    puissance: "22 kW", poids: "1850 kg", dimensions: "5200×2200×2100 mm",
    prerequisites: [
      { label: "CFO — Tableau divisionnaire CTA 400V/63A", status: "nok" },
      { label: "Réseau — Régulation GTB BACnet", status: "nok" },
      { label: "Plomberie — Alimentation eau glacée DN50", status: "nok" },
      { label: "Fluides — Non requis", status: "ok" },
      { label: "CVC — Dalle toiture renforcée 2500 kg/m²", status: "nok" },
    ],
    instructions: "BLOQUÉ: prérequis génie civil non validés. Levage par grue. Raccordement groupes froid 90 kW. Qualification aéraulique ISO 5 obligatoire.",
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_ORDER: EquipStatus[] = ["À définir", "Validé", "Commandé", "Livré", "Installé", "Mis en service"]

const statusColors: Record<EquipStatus, string> = {
  "À définir": "bg-slate-100 text-slate-700",
  Validé: "bg-blue-100 text-blue-700",
  Commandé: "bg-amber-100 text-amber-700",
  Livré: "bg-purple-100 text-purple-700",
  Installé: "bg-teal-100 text-teal-700",
  "Mis en service": "bg-green-100 text-green-700",
}

function StatusBadge({ statut }: { statut: EquipStatus }) {
  return <Badge className={`${statusColors[statut]} border-0 text-xs`}>{statut}</Badge>
}

function StatusProgress({ statut }: { statut: EquipStatus }) {
  const idx = STATUS_ORDER.indexOf(statut)
  const pct = Math.round(((idx + 1) / STATUS_ORDER.length) * 100)
  const colors = ["bg-slate-400", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-teal-500", "bg-green-500"]
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
        <div className={`h-1.5 rounded-full ${colors[idx]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  )
}

const prereqIcons: Record<string, React.ReactNode> = {
  CFO: <Zap className="w-3.5 h-3.5" />,
  Réseau: <Wifi className="w-3.5 h-3.5" />,
  Plomberie: <Droplets className="w-3.5 h-3.5" />,
  Fluides: <Wind className="w-3.5 h-3.5" />,
  CVC: <Wind className="w-3.5 h-3.5" />,
}

// ─── Equipment Detail Modal ────────────────────────────────────────────────────

function EquipDetailModal({ equip, onClose }: { equip: EquipItem | null; onClose: () => void }) {
  if (!equip) return null
  const unmetPrereqs = equip.prerequisites.filter((p) => p.status === "nok")
  const allMet = unmetPrereqs.length === 0

  return (
    <Dialog open={!!equip} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-slate-500">{equip.code}</span>
            <span>{equip.designation}</span>
            <StatusBadge statut={equip.statut} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Alert if prereqs not met */}
          {!allMet && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">
                {unmetPrereqs.length} prérequis non satisfait{unmetPrereqs.length > 1 ? "s" : ""} — Installation impossible avant levée des blocages.
              </p>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Zone", value: equip.zone },
              { label: "Local", value: equip.local },
              { label: "Fournisseur", value: equip.fournisseur },
              { label: "Quantité", value: `${equip.quantite} unité${equip.quantite > 1 ? "s" : ""}` },
              { label: "Puissance", value: equip.puissance },
              { label: "Poids", value: equip.poids },
              { label: "Dimensions", value: equip.dimensions },
              { label: "Livraison prévue", value: equip.livraisonPrevue },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Workflow */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Workflow</p>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {STATUS_ORDER.map((s, i) => {
                const currentIdx = STATUS_ORDER.indexOf(equip.statut)
                const isDone = i <= currentIdx
                return (
                  <div key={s} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${isDone ? statusColors[s] : "bg-slate-100 text-slate-400"}`}>{s}</div>
                    {i < STATUS_ORDER.length - 1 && <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isDone && i < currentIdx ? "text-slate-500" : "text-slate-300"}`} />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Prérequis d&apos;installation</p>
            <div className="space-y-2">
              {equip.prerequisites.map((p, i) => {
                const lotKey = p.label.split(" — ")[0].split(" (")[0].trim()
                const icon = prereqIcons[lotKey] ?? <Package className="w-3.5 h-3.5" />
                return (
                  <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border ${p.status === "ok" ? "bg-green-50 border-green-200" : p.status === "nok" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                    <div className={`flex-shrink-0 mt-0.5 ${p.status === "ok" ? "text-green-600" : p.status === "nok" ? "text-red-600" : "text-amber-600"}`}>
                      {icon}
                    </div>
                    <p className="text-xs text-slate-700 flex-1">{p.label}</p>
                    <div className="flex-shrink-0">
                      {p.status === "ok" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : p.status === "nok" ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-amber-400" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Instructions d&apos;installation</p>
            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 leading-relaxed">{equip.instructions}</p>
          </div>
        </div>
        <DialogFooter className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button variant="outline">PV Livraison</Button>
          <Button variant="outline">PV Installation</Button>
          <Button disabled={!allMet} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />Valider Mise en Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function EquipementsPage() {
  const [filterZone, setFilterZone] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterCategorie, setFilterCategorie] = useState("all")
  const [selectedEquip, setSelectedEquip] = useState<EquipItem | null>(null)

  const filtered = mockEquipements.filter((e) => {
    if (filterZone !== "all" && e.zone !== filterZone) return false
    if (filterStatut !== "all" && e.statut !== filterStatut) return false
    if (filterCategorie !== "all" && e.categorie !== filterCategorie) return false
    return true
  })

  const zones = [...new Set(mockEquipements.map((e) => e.zone))]
  const categories = [...new Set(mockEquipements.map((e) => e.categorie))]

  const stats = {
    total: mockEquipements.length,
    commandes: mockEquipements.filter((e) => e.statut === "Commandé").length,
    livres: mockEquipements.filter((e) => e.statut === "Livré").length,
    installes: mockEquipements.filter((e) => e.statut === "Installé").length,
    bloques: mockEquipements.filter((e) => e.statut === "Bloqué" || (e.prerequisites.some((p) => p.status === "nok") && e.statut !== "Mis en service")).length,
  }

  // Alert: equipment with unmet prerequisites
  const alertEquip = mockEquipements.filter(
    (e) => e.prerequisites.some((p) => p.status === "nok") && !["À définir", "Mis en service"].includes(e.statut)
  )

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" />
            Équipements Biomédicaux
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Suivi installation et mise en service — Polyclinique Cité Nassib</p>
        </div>
        <Button size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />Ajouter Équipement
        </Button>
      </div>

      {/* Alert banner */}
      {alertEquip.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {alertEquip.length} équipement{alertEquip.length > 1 ? "s" : ""} avec prérequis non validés
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {alertEquip.map((e) => e.code).join(", ")} — Installation bloquée jusqu&apos;à levée des prérequis.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Commandés", value: stats.commandes, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Livrés", value: stats.livres, color: "text-purple-700", bg: "bg-purple-50" },
          { label: "Installés", value: stats.installes, color: "text-teal-700", bg: "bg-teal-50" },
          { label: "Prérequis NOK", value: stats.bloques, color: "text-red-700", bg: "bg-red-50" },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className={`${bg} border-0 shadow-sm`}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        <Select value={filterZone} onValueChange={setFilterZone}>
          <SelectTrigger className="h-8 text-xs w-44"><SelectValue placeholder="Zone" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les zones</SelectItem>
            {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatut} onValueChange={setFilterStatut}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {STATUS_ORDER.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCategorie} onValueChange={setFilterCategorie}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["Code", "Désignation", "Zone / Local", "Fournisseur", "Statut / Progression", "Livraison Prévue", "Prérequis", ""].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, idx) => {
                const nokCount = e.prerequisites.filter((p) => p.status === "nok").length
                const okCount = e.prerequisites.filter((p) => p.status === "ok").length
                const total = e.prerequisites.length
                return (
                  <tr
                    key={e.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${idx % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                    onClick={() => setSelectedEquip(e)}
                  >
                    <td className="px-3 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{e.code}</td>
                    <td className="px-3 py-3 max-w-[180px]">
                      <p className="text-xs font-semibold text-slate-800 truncate">{e.designation}</p>
                      <p className="text-xs text-slate-400">{e.categorie} · qté: {e.quantite}</p>
                    </td>
                    <td className="px-3 py-3 max-w-[160px]">
                      <p className="text-xs font-medium text-slate-700 truncate">{e.zone}</p>
                      <p className="text-xs text-slate-400 truncate">{e.local}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{e.fournisseur}</td>
                    <td className="px-3 py-3 min-w-[160px]">
                      <StatusBadge statut={e.statut} />
                      <div className="mt-1.5"><StatusProgress statut={e.statut} /></div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{e.livraisonPrevue}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${nokCount > 0 ? "text-red-600" : "text-green-600"}`}>
                          {okCount}/{total}
                        </span>
                        {nokCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        {nokCount === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                    </td>
                    <td className="px-3 py-3"><ChevronRight className="w-4 h-4 text-slate-300" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">Aucun équipement trouvé.</div>
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-500">
          {filtered.length} équipement{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
        </div>
      </Card>

      <EquipDetailModal equip={selectedEquip} onClose={() => setSelectedEquip(null)} />
    </div>
  )
}
