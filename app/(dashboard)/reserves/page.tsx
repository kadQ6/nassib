"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  Download,
  LayoutList,
  Columns3,
  X,
  MessageSquare,
  Camera,
  ChevronRight,
  CalendarDays,
  User,
  Tag,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ─────────────────────────────────────────────────────────────────────

type Severity = "critique" | "majeure" | "mineure"
type Status = "Ouverte" | "En Cours" | "Corrigée" | "À Vérifier" | "Levée"
type ReserveLot = "GC" | "CFO" | "CVC" | "PLB" | "FLU" | "MEN" | "REV" | "SEU"

interface Reserve {
  id: string
  numero: string
  date: string
  local: string
  lot: ReserveLot
  description: string
  gravite: Severity
  type: string
  responsable: string
  echeance: string
  statut: Status
  joursOuverts: number
  actionRequise: string
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockReserves: Reserve[] = [
  {
    id: "1", numero: "RES-001", date: "02/12/2025", local: "Escalier R+1", lot: "GC",
    description: "Fissures béton apparent escalier R+1 — fissures de 3mm sur voile porteur",
    gravite: "critique", type: "Structure", responsable: "SMCE BTP", echeance: "15/01/2026",
    statut: "Ouverte", joursOuverts: 42, actionRequise: "Injection résine époxy et reprise béton sous contrôle bureau d'études",
  },
  {
    id: "2", numero: "RES-002", date: "05/12/2025", local: "Salle Serveurs RDC", lot: "CFO",
    description: "Câblage électrique non protégé salle serveurs — chemins de câbles ouverts",
    gravite: "critique", type: "Sécurité électrique", responsable: "ELECTRO MAG", echeance: "10/01/2026",
    statut: "En Cours", joursOuverts: 39, actionRequise: "Pose chemins de câbles avec couvercle et mise à la terre",
  },
  {
    id: "3", numero: "RES-003", date: "08/12/2025", local: "Salle de Réveil Bloc", lot: "FLU",
    description: "Robinetterie O2 non repérée salle de réveil — prises non identifiées",
    gravite: "critique", type: "Fluides Médicaux", responsable: "FLUIDEX", echeance: "20/01/2026",
    statut: "Ouverte", joursOuverts: 36, actionRequise: "Pose plaques d'identification normalisées NF S 90-116",
  },
  {
    id: "4", numero: "RES-004", date: "10/12/2025", local: "Sous-sol — Local technique", lot: "PLB",
    description: "Fuite détectée réseau EF sous-sol — débit estimé 0,5 L/min",
    gravite: "majeure", type: "Plomberie", responsable: "SANIPLOMB", echeance: "25/01/2026",
    statut: "En Cours", joursOuverts: 34, actionRequise: "Localisation précise et remplacement raccord défectueux",
  },
  {
    id: "5", numero: "RES-005", date: "12/12/2025", local: "WC Personnel RDC", lot: "CFO",
    description: "Luminaire absent WC personnel RDC — implantation prévue au plan",
    gravite: "mineure", type: "Éclairage", responsable: "ELECTRO MAG", echeance: "15/02/2026",
    statut: "Ouverte", joursOuverts: 32, actionRequise: "Fourniture et pose luminaire LED selon plan d'exécution",
  },
  {
    id: "6", numero: "RES-006", date: "15/12/2025", local: "Bloc Opératoire 01", lot: "CVC",
    description: "Grille de soufflage décentrée dans plafond salle BO-01",
    gravite: "majeure", type: "Aéraulique", responsable: "CLIMAFROID", echeance: "30/01/2026",
    statut: "À Vérifier", joursOuverts: 29, actionRequise: "Repositionnement grille et reprise plafond",
  },
  {
    id: "7", numero: "RES-007", date: "18/12/2025", local: "Couloir Urgences", lot: "REV",
    description: "Carrelage non conforme couloir urgences — teinte différente du CCTP",
    gravite: "mineure", type: "Revêtements", responsable: "CERAMITEC", echeance: "28/02/2026",
    statut: "Ouverte", joursOuverts: 26, actionRequise: "Dépose et repose carrelage conforme référence CCTP art. 4.2",
  },
  {
    id: "8", numero: "RES-008", date: "20/12/2025", local: "Salle d'accouchement 01", lot: "PLB",
    description: "Siphon de sol non posé salle d'accouchement SA-01",
    gravite: "majeure", type: "Plomberie", responsable: "SANIPLOMB", echeance: "20/01/2026",
    statut: "Ouverte", joursOuverts: 24, actionRequise: "Fourniture et pose siphon de sol inox DN 50",
  },
  {
    id: "9", numero: "RES-009", date: "22/12/2025", local: "Local TGBT", lot: "CFO",
    description: "Repérage barrettes de terre TGBT incomplet — 3 barrettes non identifiées",
    gravite: "critique", type: "Sécurité électrique", responsable: "ELECTRO MAG", echeance: "12/01/2026",
    statut: "En Cours", joursOuverts: 22, actionRequise: "Étiquetage complet et mise à jour schéma unifilaire",
  },
  {
    id: "10", numero: "RES-010", date: "24/12/2025", local: "Néonatologie — Chambre N-02", lot: "CVC",
    description: "Thermostat ambiance absent chambre néonatologie N-02",
    gravite: "majeure", type: "Régulation", responsable: "CLIMAFROID", echeance: "05/02/2026",
    statut: "Ouverte", joursOuverts: 20, actionRequise: "Pose et câblage thermostat ambiance modèle validé en coordination",
  },
  {
    id: "11", numero: "RES-011", date: "26/12/2025", local: "Façade Nord Niveau R+2", lot: "MEN",
    description: "Joint d'étanchéité menuiserie façade nord R+2 — décollement observé",
    gravite: "majeure", type: "Étanchéité", responsable: "ALUMITEC", echeance: "10/02/2026",
    statut: "Corrigée", joursOuverts: 18, actionRequise: "Reprise joint silicone neutre selon DTA",
  },
  {
    id: "12", numero: "RES-012", date: "28/12/2025", local: "Escalier Secours R+1→R+2", lot: "SEU",
    description: "Bloc de sécurité éclairage BAES absent cage escalier secours",
    gravite: "critique", type: "Sécurité incendie", responsable: "SECURELEC", echeance: "08/01/2026",
    statut: "Levée", joursOuverts: 0, actionRequise: "Pose BAES conforme NF C 71-800",
  },
  {
    id: "13", numero: "RES-013", date: "02/01/2026", local: "Consultation Gynéco 03", lot: "CFO",
    description: "Prise RJ45 non posée salle consultation gynécologie 03",
    gravite: "mineure", type: "Courants faibles", responsable: "ELECTRO MAG", echeance: "28/02/2026",
    statut: "Ouverte", joursOuverts: 11, actionRequise: "Pose 2 prises RJ45 Cat6A selon plan réseau",
  },
  {
    id: "14", numero: "RES-014", date: "04/01/2026", local: "Pharmacie RDC", lot: "CVC",
    description: "Bouche d'extraction insuffisante pharmacie — débit mesuré 120 m³/h vs 250 requis",
    gravite: "majeure", type: "Ventilation", responsable: "CLIMAFROID", echeance: "25/01/2026",
    statut: "En Cours", joursOuverts: 9, actionRequise: "Remplacement bouche et rééquilibrage réseau aéraulique",
  },
  {
    id: "15", numero: "RES-015", date: "05/01/2026", local: "Salle Stérilisation", lot: "PLB",
    description: "Raccordement EU autoclave non conforme — pente insuffisante 0,5% vs 1% requis",
    gravite: "majeure", type: "Plomberie", responsable: "SANIPLOMB", echeance: "20/02/2026",
    statut: "Ouverte", joursOuverts: 8, actionRequise: "Reprise collecteur EU avec pente réglementaire",
  },
  {
    id: "16", numero: "RES-016", date: "06/01/2026", local: "Labo — Hématologie", lot: "FLU",
    description: "Réseau air comprimé médical non testé labo hématologie",
    gravite: "majeure", type: "Fluides Médicaux", responsable: "FLUIDEX", echeance: "31/01/2026",
    statut: "À Vérifier", joursOuverts: 7, actionRequise: "Test pression 6 bars 24h et procès-verbal",
  },
  {
    id: "17", numero: "RES-017", date: "07/01/2026", local: "Couloir Hospit R+1", lot: "REV",
    description: "Peinture murs couloir hospitalisation R+1 non achevée — 40 ml manquants",
    gravite: "mineure", type: "Finitions", responsable: "PEINTURE PRO", echeance: "15/02/2026",
    statut: "Ouverte", joursOuverts: 6, actionRequise: "Achèvement peinture lessivable classe 3 couleur RAL 9010",
  },
  {
    id: "18", numero: "RES-018", date: "08/01/2026", local: "Bloc Opératoire 02", lot: "CFO",
    description: "Luminaire salle opératoire BO-02 non conforme — IRC < 90 requis",
    gravite: "majeure", type: "Éclairage", responsable: "ELECTRO MAG", echeance: "10/02/2026",
    statut: "Corrigée", joursOuverts: 0, actionRequise: "Remplacement luminaires par modèle IRC ≥ 90 référence catalogue validé",
  },
  {
    id: "19", numero: "RES-019", date: "10/01/2026", local: "Toiture Terrasse R+3", lot: "GC",
    description: "Relevé d'étanchéité insuffisant en périphérie toiture-terrasse — hauteur 10cm vs 15cm",
    gravite: "majeure", type: "Étanchéité", responsable: "SMCE BTP", echeance: "05/02/2026",
    statut: "Levée", joursOuverts: 0, actionRequise: "Reprise relevé étanchéité selon DTU 20.12",
  },
  {
    id: "20", numero: "RES-020", date: "12/01/2026", local: "Urgences — Déchocage", lot: "FLU",
    description: "Centrale vide médical déchocage — pression résidu 55 kPa vs 40 kPa maxi",
    gravite: "critique", type: "Fluides Médicaux", responsable: "FLUIDEX", echeance: "18/01/2026",
    statut: "En Cours", joursOuverts: 1, actionRequise: "Réglage soupape et re-test pressions selon NF EN ISO 7396-1",
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function SeverityBadge({ gravite }: { gravite: Severity }) {
  if (gravite === "critique") return <Badge className="bg-red-100 text-red-800 border-0 text-xs">Critique</Badge>
  if (gravite === "majeure") return <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">Majeure</Badge>
  return <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">Mineure</Badge>
}

function StatusBadge({ statut }: { statut: Status }) {
  const map: Record<Status, string> = {
    Ouverte: "bg-red-100 text-red-700",
    "En Cours": "bg-blue-100 text-blue-700",
    Corrigée: "bg-purple-100 text-purple-700",
    "À Vérifier": "bg-amber-100 text-amber-700",
    Levée: "bg-green-100 text-green-700",
  }
  return <Badge className={`${map[statut]} border-0 text-xs`}>{statut}</Badge>
}

const KANBAN_COLUMNS: Status[] = ["Ouverte", "En Cours", "Corrigée", "À Vérifier", "Levée"]

const kanbanColors: Record<Status, string> = {
  Ouverte: "border-red-300 bg-red-50",
  "En Cours": "border-blue-300 bg-blue-50",
  Corrigée: "border-purple-300 bg-purple-50",
  "À Vérifier": "border-amber-300 bg-amber-50",
  Levée: "border-green-300 bg-green-50",
}

const allLots: ReserveLot[] = ["GC", "CFO", "CVC", "PLB", "FLU", "MEN", "REV", "SEU"]

// ─── Modal: New Reserve ────────────────────────────────────────────────────────

function NewReserveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Réserve</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Description *</Label>
            <Textarea placeholder="Décrire le défaut constaté..." className="mt-1" rows={3} />
          </div>
          <div>
            <Label>Local / Zone</Label>
            <Input placeholder="ex: Salle BO-01" className="mt-1" />
          </div>
          <div>
            <Label>Lot</Label>
            <Select>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir un lot" /></SelectTrigger>
              <SelectContent>
                {allLots.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Gravité</Label>
            <Select>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir la gravité" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="critique">Critique</SelectItem>
                <SelectItem value="majeure">Majeure</SelectItem>
                <SelectItem value="mineure">Mineure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Input placeholder="ex: Structure, Étanchéité..." className="mt-1" />
          </div>
          <div>
            <Label>Responsable</Label>
            <Input placeholder="Entreprise responsable" className="mt-1" />
          </div>
          <div>
            <Label>Échéance</Label>
            <Input type="date" className="mt-1" />
          </div>
          <div className="col-span-2">
            <Label>Action requise</Label>
            <Textarea placeholder="Décrire l'action corrective attendue..." className="mt-1" rows={2} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={onClose}>Créer la réserve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Modal: Reserve Detail ─────────────────────────────────────────────────────

function ReserveDetailModal({ reserve, onClose }: { reserve: Reserve | null; onClose: () => void }) {
  const mockComments = [
    { author: "Chef de Projet", date: "03/12/2025", text: "Réserve ouverte suite visite chantier hebdomadaire." },
    { author: "Conducteur Travaux", date: "08/12/2025", text: "Entreprise notifiée, intervention programmée pour semaine prochaine." },
    { author: "SMCE BTP", date: "14/12/2025", text: "Matériaux commandés, intervention prévue le 20/12." },
  ]
  if (!reserve) return null
  return (
    <Dialog open={!!reserve} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span>{reserve.numero}</span>
            <SeverityBadge gravite={reserve.gravite} />
            <StatusBadge statut={reserve.statut} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Description</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{reserve.description}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Local", value: reserve.local, icon: Tag },
              { label: "Lot", value: reserve.lot, icon: Tag },
              { label: "Type", value: reserve.type, icon: Tag },
              { label: "Responsable", value: reserve.responsable, icon: User },
              { label: "Date", value: reserve.date, icon: CalendarDays },
              { label: "Échéance", value: reserve.echeance, icon: CalendarDays },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Action requise</p>
            <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3">{reserve.actionRequise}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4" />Photos (Avant / Après)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["Photo avant", "Photo après"].map((label) => (
                <div key={label} className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />Commentaires ({mockComments.length})
            </p>
            <div className="space-y-2">
              {mockComments.map((c, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{c.author}</span>
                    <span className="text-xs text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{c.text}</p>
                </div>
              ))}
              <Textarea placeholder="Ajouter un commentaire..." rows={2} className="text-sm" />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">Demander vérification</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />Lever la réserve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ReservesPage() {
  const [view, setView] = useState<"table" | "kanban">("table")
  const [filterLot, setFilterLot] = useState("all")
  const [filterGravite, setFilterGravite] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedReserve, setSelectedReserve] = useState<Reserve | null>(null)
  const [newReserveOpen, setNewReserveOpen] = useState(false)

  const filtered = mockReserves.filter((r) => {
    if (filterLot !== "all" && r.lot !== filterLot) return false
    if (filterGravite !== "all" && r.gravite !== filterGravite) return false
    if (filterStatut !== "all" && r.statut !== filterStatut) return false
    if (filterType !== "all" && r.type !== filterType) return false
    return true
  })

  const stats = {
    total: mockReserves.length,
    critiques: mockReserves.filter((r) => r.gravite === "critique").length,
    enRetard: mockReserves.filter((r) => r.joursOuverts > 30 && r.statut !== "Levée").length,
    leveesMonth: mockReserves.filter((r) => r.statut === "Levée").length,
  }

  const hasFilters = filterLot !== "all" || filterGravite !== "all" || filterStatut !== "all" || filterType !== "all"
  const uniqueTypes = [...new Set(mockReserves.map((r) => r.type))]

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Registre des Réserves
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Réserves & Non-Conformités — Polyclinique Cité Nassib</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />Excel
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setNewReserveOpen(true)}>
            <Plus className="w-4 h-4" />Nouvelle Réserve
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-700", bg: "bg-slate-50", Icon: AlertTriangle },
          { label: "Critiques", value: stats.critiques, color: "text-red-700", bg: "bg-red-50", Icon: AlertTriangle },
          { label: "En retard", value: stats.enRetard, color: "text-orange-700", bg: "bg-orange-50", Icon: Clock },
          { label: "Levées ce mois", value: stats.leveesMonth, color: "text-green-700", bg: "bg-green-50", Icon: CheckCircle2 },
        ].map(({ label, value, color, bg, Icon }) => (
          <Card key={label} className={`${bg} border-0 shadow-sm`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              <Icon className={`w-6 h-6 ${color} opacity-40`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar + View toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <Select value={filterLot} onValueChange={setFilterLot}>
            <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Lot" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les lots</SelectItem>
              {allLots.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterGravite} onValueChange={setFilterGravite}>
            <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Gravité" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes gravités</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
              <SelectItem value="majeure">Majeure</SelectItem>
              <SelectItem value="mineure">Mineure</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              {KANBAN_COLUMNS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              {uniqueTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <button
              onClick={() => { setFilterLot("all"); setFilterGravite("all"); setFilterStatut("all"); setFilterType("all") }}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />Effacer
            </button>
          )}
        </div>
        <div className="flex items-center border rounded-lg overflow-hidden flex-shrink-0">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${view === "table" ? "bg-slate-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutList className="w-3.5 h-3.5" />Table
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${view === "kanban" ? "bg-slate-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            <Columns3 className="w-3.5 h-3.5" />Kanban
          </button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <Card className="shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["N°", "Date", "Local", "Lot", "Description", "Gravité", "Type", "Responsable", "Échéance", "Statut", ""].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${idx % 2 !== 0 ? "bg-slate-50/40" : ""} ${r.gravite === "critique" && r.statut !== "Levée" ? "bg-red-50/30 hover:bg-red-50/50" : ""}`}
                    onClick={() => setSelectedReserve(r)}
                  >
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-500 whitespace-nowrap">{r.numero}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-700 max-w-[140px] truncate">{r.local}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{r.lot}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-700 max-w-[220px]">
                      <p className="truncate">{r.description}</p>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><SeverityBadge gravite={r.gravite} /></td>
                    <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{r.type}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{r.responsable}</td>
                    <td className={`px-3 py-2.5 text-xs whitespace-nowrap font-medium ${r.joursOuverts > 30 && r.statut !== "Levée" ? "text-red-600" : "text-slate-500"}`}>
                      {r.echeance}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><StatusBadge statut={r.statut} /></td>
                    <td className="px-3 py-2.5"><ChevronRight className="w-4 h-4 text-slate-300" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">Aucune réserve trouvée avec ces filtres.</div>
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-500">
            {filtered.length} réserve{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}
          </div>
        </Card>
      )}

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {KANBAN_COLUMNS.map((col) => {
            const items = filtered.filter((r) => r.statut === col)
            return (
              <div key={col} className="space-y-2">
                <div className={`rounded-lg border px-3 py-2 ${kanbanColors[col]}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{col}</span>
                    <span className="text-xs font-bold text-slate-600 bg-white rounded-full px-1.5 py-0.5">{items.length}</span>
                  </div>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {items.map((r) => (
                    <Card key={r.id} className="shadow-sm cursor-pointer hover:shadow-md transition-shadow border-slate-200" onClick={() => setSelectedReserve(r)}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-mono text-slate-500">{r.numero}</span>
                          <SeverityBadge gravite={r.gravite} />
                        </div>
                        <p className="text-xs text-slate-700 line-clamp-2 leading-snug">{r.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-mono">{r.lot}</span>
                          {r.joursOuverts > 0 && (
                            <span className={`text-xs font-medium flex items-center gap-0.5 ${r.joursOuverts > 30 ? "text-red-600" : "text-slate-500"}`}>
                              <Clock className="w-3 h-3" />{r.joursOuverts}j
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <NewReserveModal open={newReserveOpen} onClose={() => setNewReserveOpen(false)} />
      <ReserveDetailModal reserve={selectedReserve} onClose={() => setSelectedReserve(null)} />
    </div>
  )
}
