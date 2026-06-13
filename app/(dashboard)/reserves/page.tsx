"use client"

import { useState } from "react"
import {
  Eye,
  Plus,
  Filter,
  LayoutList,
  Columns,
  Download,
  FileText,
  Table2,
  ImageIcon,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// ─── Types ─────────────────────────────────────────────────────────────────────

type Gravite = "critique" | "majeure" | "mineure"
type Statut = "open" | "in_progress" | "resolved" | "closed" | "contested"
type Lot = "GC" | "CFO" | "CVC" | "PLB" | "FLU" | "CF" | "REV" | "PEI"

interface Reserve {
  id: string
  ref: string
  date: string
  local: string
  lot: Lot
  description: string
  gravite: Gravite
  type: string
  responsable: string
  echeance: string
  statut: Statut
  actionRequise: string
  joursOuverts: number
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const RESERVES: Reserve[] = [
  {
    id: "1",
    ref: "RES-001",
    date: "02/01/2026",
    local: "Escalier R+1",
    lot: "GC",
    description: "Fissures béton apparent escalier R+1",
    gravite: "critique",
    type: "Structural",
    responsable: "STPB SARL",
    echeance: "10/01/2026",
    statut: "open",
    actionRequise: "Injection résine époxy et reprise béton sur fissures > 0,3 mm. Contrôle par bureau de contrôle avant validation.",
    joursOuverts: 11,
  },
  {
    id: "2",
    ref: "RES-002",
    date: "03/01/2026",
    local: "Salle serveurs",
    lot: "CFO",
    description: "Câblage électrique non protégé salle serveurs",
    gravite: "critique",
    type: "Sécurité",
    responsable: "Elec Pro",
    echeance: "08/01/2026",
    statut: "in_progress",
    actionRequise: "Pose de chemins de câbles et conduits IRL conformes à la norme NF C 15-100. Fourniture du PV de conformité.",
    joursOuverts: 10,
  },
  {
    id: "3",
    ref: "RES-003",
    date: "04/01/2026",
    local: "Salle réveil",
    lot: "FLU",
    description: "Robinetterie O2 non repérée salle de réveil",
    gravite: "critique",
    type: "Fluides médicaux",
    responsable: "MedGaz",
    echeance: "12/01/2026",
    statut: "open",
    actionRequise: "Pose des étiquettes de repérage réglementaires sur toutes les prises de fluides médicaux. Validation par organisme habilité.",
    joursOuverts: 9,
  },
  {
    id: "4",
    ref: "RES-004",
    date: "05/01/2026",
    local: "Sous-sol",
    lot: "PLB",
    description: "Fuite détectée réseau EF sous-sol",
    gravite: "majeure",
    type: "Plomberie",
    responsable: "AquaPlomb",
    echeance: "15/01/2026",
    statut: "in_progress",
    actionRequise: "Localisation et reprise du joint défectueux sur la conduite DN50. Essai d'étanchéité 10 bars après réparation.",
    joursOuverts: 8,
  },
  {
    id: "5",
    ref: "RES-005",
    date: "06/01/2026",
    local: "WC personnel RDC",
    lot: "CFO",
    description: "Luminaire absent WC personnel RDC",
    gravite: "mineure",
    type: "Électricité",
    responsable: "Elec Pro",
    echeance: "20/01/2026",
    statut: "open",
    actionRequise: "Fourniture et pose d'un luminaire étanche IP54 conforme au plan d'éclairage. Vérification de la mise à la terre.",
    joursOuverts: 7,
  },
  {
    id: "6",
    ref: "RES-006",
    date: "07/01/2026",
    local: "Bloc opératoire A",
    lot: "CVC",
    description: "Débit d'air insuffisant bloc opératoire A — mesure à 1 800 m³/h au lieu de 2 200 m³/h",
    gravite: "critique",
    type: "CVC",
    responsable: "ClimaTech",
    echeance: "18/01/2026",
    statut: "in_progress",
    actionRequise: "Réglage des registres de distribution et vérification de la centrale de traitement d'air. PV de mesure après réglage.",
    joursOuverts: 6,
  },
  {
    id: "7",
    ref: "RES-007",
    date: "08/01/2026",
    local: "Couloir R+2",
    lot: "REV",
    description: "Carrelage décollé couloir principal R+2 — 4 m² concernés",
    gravite: "majeure",
    type: "Revêtement",
    responsable: "FiniBâti",
    echeance: "22/01/2026",
    statut: "open",
    actionRequise: "Dépose et repose du carrelage avec mise en œuvre de la colle appropriée. Essai de sonnage après séchage complet.",
    joursOuverts: 5,
  },
  {
    id: "8",
    ref: "RES-008",
    date: "08/01/2026",
    local: "Salle de stérilisation",
    lot: "PLB",
    description: "Pression réseau EC insuffisante — 1,2 bar au lieu de 2 bar requis",
    gravite: "majeure",
    type: "Plomberie",
    responsable: "AquaPlomb",
    echeance: "25/01/2026",
    statut: "contested",
    actionRequise: "Vérification du réducteur de pression et réglage. Si dysfonctionnement confirmé, remplacement de l'organe défectueux.",
    joursOuverts: 5,
  },
  {
    id: "9",
    ref: "RES-009",
    date: "09/01/2026",
    local: "Réception principale",
    lot: "CF",
    description: "Détecteur incendie manquant zone réception — 2 têtes non posées",
    gravite: "critique",
    type: "Sécurité incendie",
    responsable: "SafeFire",
    echeance: "14/01/2026",
    statut: "resolved",
    actionRequise: "Pose des 2 têtes détectrices fumée manquantes et raccordement au tableau de signalisation. Test de fonctionnement.",
    joursOuverts: 4,
  },
  {
    id: "10",
    ref: "RES-010",
    date: "09/01/2026",
    local: "Parking sous-sol",
    lot: "GC",
    description: "Infiltration d'eau joint de dilatation parking sous-sol — niveau P1",
    gravite: "majeure",
    type: "Étanchéité",
    responsable: "STPB SARL",
    echeance: "28/01/2026",
    statut: "open",
    actionRequise: "Reprise de l'étanchéité du joint de dilatation avec profilé hydrogonflant et protection béton projeté.",
    joursOuverts: 4,
  },
  {
    id: "11",
    ref: "RES-011",
    date: "10/01/2026",
    local: "Laboratoire analyses",
    lot: "FLU",
    description: "Prise vide médical labo — débit insuffisant 8 L/min au lieu de 40 L/min",
    gravite: "critique",
    type: "Fluides médicaux",
    responsable: "MedGaz",
    echeance: "20/01/2026",
    statut: "in_progress",
    actionRequise: "Vérification du branchement sur réseau principal et contrôle du diamètre de la conduite d'alimentation. Retest débit.",
    joursOuverts: 3,
  },
  {
    id: "12",
    ref: "RES-012",
    date: "10/01/2026",
    local: "Bureau médecins R+1",
    lot: "CFO",
    description: "Interrupteur va-et-vient bureau médecins — câblage inversé",
    gravite: "mineure",
    type: "Électricité",
    responsable: "Elec Pro",
    echeance: "25/01/2026",
    statut: "closed",
    actionRequise: "Correction du câblage de l'interrupteur va-et-vient selon schéma unifilaire révisé.",
    joursOuverts: 3,
  },
  {
    id: "13",
    ref: "RES-013",
    date: "11/01/2026",
    local: "Salle d'attente RDC",
    lot: "PEI",
    description: "Peinture cloison salle d'attente RDC — nuance incorrecte RAL 9003 posé au lieu de RAL 9010",
    gravite: "mineure",
    type: "Finition",
    responsable: "PeintPro",
    echeance: "30/01/2026",
    statut: "open",
    actionRequise: "Reprise de la peinture avec la teinte conforme au carnet de couleurs validé en réunion n°20.",
    joursOuverts: 2,
  },
  {
    id: "14",
    ref: "RES-014",
    date: "11/01/2026",
    local: "Terrasse R+3",
    lot: "GC",
    description: "Garde-corps terrasse R+3 — hauteur 0,85 m au lieu de 1,10 m réglementaire",
    gravite: "critique",
    type: "Sécurité",
    responsable: "STPB SARL",
    echeance: "21/01/2026",
    statut: "in_progress",
    actionRequise: "Dépose et repose des garde-corps à la hauteur réglementaire. Calcul de résistance à fournir au BET structure.",
    joursOuverts: 2,
  },
  {
    id: "15",
    ref: "RES-015",
    date: "12/01/2026",
    local: "Salle d'imagerie",
    lot: "CVC",
    description: "Condensation sur gaine CVC salle d'imagerie — isolation défectueuse",
    gravite: "majeure",
    type: "CVC",
    responsable: "ClimaTech",
    echeance: "02/02/2026",
    statut: "open",
    actionRequise: "Reprise de l'isolant thermique sur 6 ml de gaine avec matériau certifié épaisseur 50 mm.",
    joursOuverts: 1,
  },
  {
    id: "16",
    ref: "RES-016",
    date: "12/01/2026",
    local: "Bloc opératoire B",
    lot: "REV",
    description: "Joint de finition sol résine bloc opératoire B — non-conformité couleur et planéité",
    gravite: "majeure",
    type: "Revêtement",
    responsable: "FiniBâti",
    echeance: "05/02/2026",
    statut: "contested",
    actionRequise: "Reprise des zones non conformes après validation du plan de recollement. Mesure de planéité avec règle de 2 m.",
    joursOuverts: 1,
  },
  {
    id: "17",
    ref: "RES-017",
    date: "12/01/2026",
    local: "Archives RDC",
    lot: "CF",
    description: "Porte coupe-feu EI90 archives RDC — ferme-porte non fonctionnel",
    gravite: "majeure",
    type: "Sécurité incendie",
    responsable: "SafeFire",
    echeance: "18/01/2026",
    statut: "resolved",
    actionRequise: "Remplacement du ferme-porte défectueux par un modèle certifié. Test de fermeture automatique à documenter.",
    joursOuverts: 1,
  },
  {
    id: "18",
    ref: "RES-018",
    date: "13/01/2026",
    local: "Couloir soins R+2",
    lot: "CFO",
    description: "Absence de signalétique de sécurité couloir soins R+2 — issues de secours non balisées",
    gravite: "majeure",
    type: "Sécurité",
    responsable: "Elec Pro",
    echeance: "20/01/2026",
    statut: "open",
    actionRequise: "Fourniture et pose des blocs de balisage normalisés sur toutes les sorties de secours du niveau.",
    joursOuverts: 0,
  },
  {
    id: "19",
    ref: "RES-019",
    date: "13/01/2026",
    local: "Local TGBT",
    lot: "CFO",
    description: "TGBT — pas de cadenassage sur jeux de barres HTA, non-conformité sécurité électrique",
    gravite: "critique",
    type: "Sécurité électrique",
    responsable: "Elec Pro",
    echeance: "15/01/2026",
    statut: "in_progress",
    actionRequise: "Installation des dispositifs de cadenassage réglementaires sur tous les jeux de barres HTA. Consignation à documenter.",
    joursOuverts: 0,
  },
  {
    id: "20",
    ref: "RES-020",
    date: "13/01/2026",
    local: "Toiture",
    lot: "GC",
    description: "Évacuation eaux pluviales toiture — crépine obstruée niveau R+3 aile Nord",
    gravite: "mineure",
    type: "Étanchéité",
    responsable: "STPB SARL",
    echeance: "28/01/2026",
    statut: "closed",
    actionRequise: "Nettoyage et vérification des crépines. Pose de protège-crépines conformes.",
    joursOuverts: 0,
  },
]

const MOCK_COMMENTS = [
  {
    id: "c1",
    auteur: "Ingénieur Maître d'Œuvre",
    date: "10/01/2026 à 09:15",
    texte: "Réserve confirmée lors de la visite de chantier. L'entreprise a été notifiée par email. Délai de correction : 7 jours.",
  },
  {
    id: "c2",
    auteur: "Chef de chantier — Entreprise",
    date: "11/01/2026 à 14:32",
    texte: "Intervention planifiée pour le 14/01/2026. Matériel commandé. Photos avant travaux jointes au rapport.",
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getStatusLabel(statut: Statut): string {
  const map: Record<Statut, string> = {
    open: "Ouverte",
    in_progress: "En Cours",
    resolved: "Corrigée",
    closed: "Levée",
    contested: "À Vérifier",
  }
  return map[statut]
}

function getStatusVariant(statut: Statut): "destructive" | "warning" | "info" | "success" | "secondary" {
  const map: Record<Statut, "destructive" | "warning" | "info" | "success" | "secondary"> = {
    open: "destructive",
    in_progress: "warning",
    resolved: "info",
    closed: "success",
    contested: "secondary",
  }
  return map[statut]
}

function getGraviteVariant(g: Gravite): "destructive" | "warning" | "secondary" {
  if (g === "critique") return "destructive"
  if (g === "majeure") return "warning"
  return "secondary"
}

function getGraviteLabel(g: Gravite): string {
  if (g === "critique") return "Critique"
  if (g === "majeure") return "Majeure"
  return "Mineure"
}

const KANBAN_COLUMNS: { statut: Statut; label: string; color: string }[] = [
  { statut: "open", label: "Ouverte", color: "border-red-300 bg-red-50" },
  { statut: "in_progress", label: "En Cours", color: "border-amber-300 bg-amber-50" },
  { statut: "resolved", label: "Corrigée", color: "border-blue-300 bg-blue-50" },
  { statut: "contested", label: "À Vérifier", color: "border-purple-300 bg-purple-50" },
  { statut: "closed", label: "Levée", color: "border-green-300 bg-green-50" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function GraviteDot({ gravite }: { gravite: Gravite }) {
  const colors = {
    critique: "bg-red-500",
    majeure: "bg-amber-500",
    mineure: "bg-yellow-400",
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[gravite]} mr-1.5 flex-shrink-0`} />
}

// ─── Reserve Detail Modal ─────────────────────────────────────────────────────

function ReserveDetailModal({
  reserve,
  onClose,
}: {
  reserve: Reserve
  onClose: () => void
}) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <DialogTitle className="text-base font-bold text-slate-900">
            {reserve.ref} — {reserve.local}
          </DialogTitle>
          <Badge variant={getGraviteVariant(reserve.gravite)}>
            {getGraviteLabel(reserve.gravite)}
          </Badge>
          <Badge variant={getStatusVariant(reserve.statut)}>
            {getStatusLabel(reserve.statut)}
          </Badge>
        </div>
        <DialogDescription className="text-sm text-slate-600 mt-1">
          {reserve.description}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 mt-2">
        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Lot", value: reserve.lot },
            { label: "Type", value: reserve.type },
            { label: "Responsable", value: reserve.responsable },
            { label: "Date ouverture", value: reserve.date },
            { label: "Échéance", value: reserve.echeance },
            { label: "Jours ouverts", value: `${reserve.joursOuverts}j` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-slate-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Action requise */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Action Requise
          </p>
          <p className="text-sm text-slate-700 bg-amber-50 border border-amber-100 rounded-lg p-3 leading-relaxed">
            {reserve.actionRequise}
          </p>
        </div>

        {/* Photos */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Photos
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["Avant travaux", "Après travaux"].map((label) => (
              <div
                key={label}
                className="aspect-video bg-slate-100 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <ImageIcon className="w-7 h-7 text-slate-300" />
                <span className="text-xs text-slate-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Commentaires ({MOCK_COMMENTS.length})
          </p>
          <div className="space-y-3">
            {MOCK_COMMENTS.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">{c.auteur}</span>
                  <span className="text-xs text-slate-400">{c.date}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{c.texte}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input placeholder="Ajouter un commentaire…" className="text-sm h-9 flex-1" />
            <Button size="sm" className="h-9">Envoyer</Button>
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-row gap-2 mt-2">
        <DialogClose asChild>
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
            Fermer
          </Button>
        </DialogClose>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
        >
          <XCircle className="w-3.5 h-3.5 mr-1.5" />
          Contester
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
          Confirmer Levée
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

// ─── New Reserve Modal ─────────────────────────────────────────────────────────

function NewReserveModal({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-slate-900">
          Nouvelle Réserve
        </DialogTitle>
        <DialogDescription className="text-sm text-slate-500">
          Enregistrer une nouvelle réserve ou non-conformité
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Local / Zone *</Label>
            <Input placeholder="ex. Bloc opératoire A" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Lot *</Label>
            <Select>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {["GC", "CFO", "CVC", "PLB", "FLU", "CF", "REV", "PEI"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-700">Description *</Label>
          <Textarea
            placeholder="Décrire la réserve ou non-conformité observée…"
            className="text-sm resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Gravité *</Label>
            <Select>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critique">Critique</SelectItem>
                <SelectItem value="majeure">Majeure</SelectItem>
                <SelectItem value="mineure">Mineure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Type</Label>
            <Select>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {["Structural", "Sécurité", "Plomberie", "Électricité", "CVC", "Fluides médicaux", "Revêtement", "Finition", "Étanchéité", "Sécurité incendie"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Responsable</Label>
            <Input placeholder="Entreprise responsable" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Échéance</Label>
            <Input type="date" className="h-9 text-sm" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-700">Action Requise</Label>
          <Textarea
            placeholder="Décrire l'action corrective à réaliser…"
            className="text-sm resize-none"
            rows={3}
          />
        </div>
      </div>

      <DialogFooter className="flex flex-row gap-2 mt-2">
        <DialogClose asChild>
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
        </DialogClose>
        <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Créer la Réserve
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ReservesPage() {
  const [activeView, setActiveView] = useState<"table" | "kanban">("table")
  const [selectedReserve, setSelectedReserve] = useState<Reserve | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  // Filters
  const [filterLot, setFilterLot] = useState<string>("all")
  const [filterLocal, setFilterLocal] = useState("")
  const [filterGravite, setFilterGravite] = useState<string>("all")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const allTypes = Array.from(new Set(RESERVES.map((r) => r.type))).sort()

  const filtered = RESERVES.filter((r) => {
    if (filterLot !== "all" && r.lot !== filterLot) return false
    if (filterLocal && !r.local.toLowerCase().includes(filterLocal.toLowerCase())) return false
    if (filterGravite !== "all" && r.gravite !== filterGravite) return false
    if (filterStatut !== "all" && r.statut !== filterStatut) return false
    if (filterType !== "all" && r.type !== filterType) return false
    return true
  })

  const stats = {
    total: RESERVES.length,
    critiques: RESERVES.filter((r) => r.gravite === "critique").length,
    enRetard: RESERVES.filter(
      (r) => r.statut !== "closed" && r.joursOuverts > 7
    ).length,
    leveesCeMois: RESERVES.filter((r) => r.statut === "closed").length,
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Registre des Réserves
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi des réserves et non-conformités chantier
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export Excel
          </Button>
          <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Nouvelle Réserve
              </Button>
            </DialogTrigger>
            <NewReserveModal onClose={() => setShowNewModal(false)} />
          </Dialog>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-400 mt-0.5">réserves actives</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-red-100">
          <CardContent className="p-4">
            <p className="text-xs text-red-500 font-medium uppercase tracking-wide mb-1">Critiques</p>
            <p className="text-2xl font-bold text-red-600">{stats.critiques}</p>
            <p className="text-xs text-slate-400 mt-0.5">action immédiate</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-orange-100">
          <CardContent className="p-4">
            <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-1">En retard</p>
            <p className="text-2xl font-bold text-orange-600">{stats.enRetard}</p>
            <p className="text-xs text-slate-400 mt-0.5">délai dépassé</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-green-100">
          <CardContent className="p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Levées ce mois</p>
            <p className="text-2xl font-bold text-green-600">{stats.leveesCeMois}</p>
            <p className="text-xs text-slate-400 mt-0.5">en janvier 2026</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <Select value={filterLot} onValueChange={setFilterLot}>
              <SelectTrigger className="h-8 w-24 text-xs">
                <SelectValue placeholder="Lot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous lots</SelectItem>
                {["GC", "CFO", "CVC", "PLB", "FLU", "CF", "REV", "PEI"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Local / Zone…"
              value={filterLocal}
              onChange={(e) => setFilterLocal(e.target.value)}
              className="h-8 w-40 text-xs"
            />
            <Select value={filterGravite} onValueChange={setFilterGravite}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="Gravité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes gravités</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
                <SelectItem value="majeure">Majeure</SelectItem>
                <SelectItem value="mineure">Mineure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="open">Ouverte</SelectItem>
                <SelectItem value="in_progress">En Cours</SelectItem>
                <SelectItem value="resolved">Corrigée</SelectItem>
                <SelectItem value="contested">À Vérifier</SelectItem>
                <SelectItem value="closed">Levée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                {allTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs text-slate-400 mr-1">{filtered.length} résultats</span>
              <Button
                variant={activeView === "table" ? "default" : "outline"}
                size="sm"
                className="h-8 px-2.5"
                onClick={() => setActiveView("table")}
              >
                <Table2 className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">Table</span>
              </Button>
              <Button
                variant={activeView === "kanban" ? "default" : "outline"}
                size="sm"
                className="h-8 px-2.5"
                onClick={() => setActiveView("kanban")}
              >
                <Columns className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">Kanban</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table view */}
      {activeView === "table" && (
        <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["N°", "Date", "Local", "Lot", "Description", "Gravité", "Type", "Responsable", "Échéance", "Statut", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-sm text-slate-400">
                      Aucune réserve ne correspond aux filtres sélectionnés.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? "" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="px-3 py-2.5 font-mono text-xs font-semibold text-slate-600 whitespace-nowrap">
                        {r.ref}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-700 whitespace-nowrap">
                        {r.local}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">
                          {r.lot}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-700 max-w-[220px]">
                        <span className="line-clamp-2 leading-relaxed">{r.description}</span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Badge variant={getGraviteVariant(r.gravite)} className="text-xs">
                          <GraviteDot gravite={r.gravite} />
                          {getGraviteLabel(r.gravite)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                        {r.type}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-700 whitespace-nowrap">
                        {r.responsable}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`text-xs font-medium ${
                          r.statut !== "closed" && r.joursOuverts > 7
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}>
                          {r.statut !== "closed" && r.joursOuverts > 7 && (
                            <Clock className="w-3 h-3 inline mr-0.5" />
                          )}
                          {r.echeance}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Badge variant={getStatusVariant(r.statut)} className="text-xs">
                          {getStatusLabel(r.statut)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                              onClick={() => setSelectedReserve(r)}
                              title="Voir détail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </DialogTrigger>
                          {selectedReserve?.id === r.id && (
                            <ReserveDetailModal
                              reserve={selectedReserve}
                              onClose={() => setSelectedReserve(null)}
                            />
                          )}
                        </Dialog>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Kanban view */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {KANBAN_COLUMNS.map((col) => {
            const colItems = filtered.filter((r) => r.statut === col.statut)
            return (
              <div key={col.statut} className={`rounded-xl border-2 ${col.color} p-2 min-h-[200px]`}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {col.label}
                  </span>
                  <span className="text-xs font-semibold bg-white rounded-full w-5 h-5 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
                    {colItems.length}
                  </span>
                </div>
                {/* Cards */}
                <div className="space-y-2">
                  {colItems.length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-6 italic">
                      Aucune réserve
                    </div>
                  ) : (
                    colItems.map((r) => (
                      <Dialog key={r.id}>
                        <DialogTrigger asChild>
                          <div
                            className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
                            onClick={() => setSelectedReserve(r)}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                              <span className="text-xs font-mono font-semibold text-slate-500">
                                {r.ref}
                              </span>
                              <Badge
                                variant={getGraviteVariant(r.gravite)}
                                className="text-[10px] px-1.5 py-0"
                              >
                                {getGraviteLabel(r.gravite)}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-700 font-medium leading-snug line-clamp-2 mb-2">
                              {r.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">
                                {r.lot}
                              </span>
                              <span className={`text-[10px] flex items-center gap-0.5 ${
                                r.joursOuverts > 7 ? "text-red-500 font-semibold" : "text-slate-400"
                              }`}>
                                <Clock className="w-2.5 h-2.5" />
                                {r.joursOuverts}j
                              </span>
                            </div>
                          </div>
                        </DialogTrigger>
                        {selectedReserve?.id === r.id && (
                          <ReserveDetailModal
                            reserve={r}
                            onClose={() => setSelectedReserve(null)}
                          />
                        )}
                      </Dialog>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
