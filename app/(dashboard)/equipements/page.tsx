"use client"

import { useState } from "react"
import {
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Filter,
  ChevronRight,
  Package,
  FileCheck,
  Wrench,
  Zap,
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
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ─────────────────────────────────────────────────────────────────────

type Statut =
  | "À définir"
  | "Validé"
  | "Commandé"
  | "Livré"
  | "Installé"
  | "Mis en service"
  | "Bloqué"

type Categorie = "Obstétrique" | "Réanimation" | "Urgences" | "Laboratoire" | "Stérilisation" | "Infrastructure" | "Imagerie" | "Bloc Opératoire"

interface Prerequisites {
  cfo: boolean | null
  reseau: boolean | null
  plomberie: boolean | null
  fluides: boolean | null
  cvc: boolean | null
}

interface Equipment {
  code: string
  designation: string
  zone: string
  qte: number
  fournisseur: string
  statut: Statut
  livraisonPrevue: string | null
  categorie: Categorie
  puissance: number | null
  poids: number | null
  dimensions: string | null
  prereqs: Prerequisites
  instructionsInstallation: string
  progress: number
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const EQUIPMENT_LIST: Equipment[] = [
  {
    code: "EQ-001",
    designation: "Table d'accouchement électrique",
    zone: "Bloc Obstétrique",
    qte: 3,
    fournisseur: "MedEquip",
    statut: "Commandé",
    livraisonPrevue: "15/03/2026",
    categorie: "Obstétrique",
    puissance: 350,
    poids: 180,
    dimensions: "210×95×85",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: false },
    instructionsInstallation:
      "Positionner la table à au moins 80 cm des murs. Raccorder l'alimentation CFO sur circuit dédié 16A. Vérifier la mise à la terre. Tester les positions électriques avant réception.",
    progress: 40,
  },
  {
    code: "EQ-002",
    designation: "Couveuse néonatale intensive",
    zone: "Néonatologie",
    qte: 4,
    fournisseur: "NeoMed",
    statut: "Commandé",
    livraisonPrevue: "20/03/2026",
    categorie: "Réanimation",
    puissance: 600,
    poids: 85,
    dimensions: "120×65×150",
    prereqs: { cfo: true, reseau: true, plomberie: false, fluides: false, cvc: false },
    instructionsInstallation:
      "Installer sur surface plane et stable. Raccorder l'O₂ médical et l'air médical sur têtes de lit dédiées. Connexion réseau RJ45 catégorie 6 pour monitoring centralisé.",
    progress: 40,
  },
  {
    code: "EQ-003",
    designation: "Moniteur multiparamètres",
    zone: "Urgences + Hospit",
    qte: 6,
    fournisseur: "PhilipsMed",
    statut: "Livré",
    livraisonPrevue: null,
    categorie: "Réanimation",
    puissance: 180,
    poids: 12,
    dimensions: "36×28×32",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Fixer sur bras articulé mural ou poser sur chariot dédié. Intégration au réseau de monitoring centralisé via protocole HL7. Test de connectivité et alarmes obligatoire avant mise en service.",
    progress: 60,
  },
  {
    code: "EQ-004",
    designation: "Défibrillateur",
    zone: "Urgences",
    qte: 2,
    fournisseur: "ZOLL",
    statut: "Installé",
    livraisonPrevue: null,
    categorie: "Urgences",
    puissance: 200,
    poids: 3,
    dimensions: "28×26×12",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Installer sur support mural à 1.5m de hauteur dans chaque salle de déchocage. Vérifier la charge des batteries. Effectuer un test de décharge mensuel consigné dans le carnet de maintenance.",
    progress: 80,
  },
  {
    code: "EQ-005",
    designation: "Échographe obstétrical",
    zone: "Gynécologie",
    qte: 1,
    fournisseur: "GE Healthcare",
    statut: "Commandé",
    livraisonPrevue: "01/04/2026",
    categorie: "Imagerie",
    puissance: 450,
    poids: 95,
    dimensions: "60×55×145",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Prévoir prise 16A dédiée avec UPS. Connexion DICOM sur réseau radiologie isolé. Espace de manœuvre minimum 120×120 cm autour de l'appareil.",
    progress: 40,
  },
  {
    code: "EQ-006",
    designation: "Table opératoire césarienne",
    zone: "Bloc Opératoire",
    qte: 2,
    fournisseur: "Maquet",
    statut: "Bloqué",
    livraisonPrevue: null,
    categorie: "Bloc Opératoire",
    puissance: 500,
    poids: 320,
    dimensions: "220×55×90",
    prereqs: { cfo: true, reseau: false, plomberie: true, fluides: false, cvc: false },
    instructionsInstallation:
      "Raccordement sur rail de sol dédié. Mise à la terre équipotentielle obligatoire. Tous les prérequis CVC, fluides et réseau doivent être validés avant installation.",
    progress: 60,
  },
  {
    code: "EQ-007",
    designation: "Autoclave 134L",
    zone: "Stérilisation",
    qte: 1,
    fournisseur: "Getinge",
    statut: "Commandé",
    livraisonPrevue: "10/04/2026",
    categorie: "Stérilisation",
    puissance: 9000,
    poids: 450,
    dimensions: "150×90×200",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Installer sur dalle renforcée 500 kg/m². Raccordement eau froide DN25, évacuation DN40. Ventilation de la pièce obligatoire avec renouvellement d'air ×15/h. Mise en service par technicien agréé Getinge.",
    progress: 40,
  },
  {
    code: "EQ-008",
    designation: "Analyseur biochimie",
    zone: "Laboratoire",
    qte: 1,
    fournisseur: "Roche",
    statut: "Validé",
    livraisonPrevue: null,
    categorie: "Laboratoire",
    puissance: 800,
    poids: 120,
    dimensions: "100×70×85",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Poser sur paillasse renforcée anti-vibrations. Connexion LIS via réseau dédié laboratoire. Alimentation eau désionisée obligatoire. Température ambiante maintenue entre 18°C et 28°C.",
    progress: 20,
  },
  {
    code: "EQ-009",
    designation: "Groupe électrogène 250KVA",
    zone: "Local technique",
    qte: 1,
    fournisseur: "Cummins",
    statut: "Installé",
    livraisonPrevue: null,
    categorie: "Infrastructure",
    puissance: 250000,
    poids: 2800,
    dimensions: "380×120×200",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Installation sur dalle anti-vibratile. Réservoir carburant 1000L sous-terrain. Raccordement tableau général BT par câble 240mm². Test de charge à 100% obligatoire avant mise en service.",
    progress: 80,
  },
  {
    code: "EQ-010",
    designation: "UPS 80KVA",
    zone: "Local technique",
    qte: 1,
    fournisseur: "Eaton",
    statut: "Installé",
    livraisonPrevue: null,
    categorie: "Infrastructure",
    puissance: 80000,
    poids: 680,
    dimensions: "120×80×160",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Installation en local climatisé (18-25°C). Temps de commutation ≤ 20ms. Batteries testées à 100% autonomie (30 min). Raccordement réseau SNMP pour supervision.",
    progress: 80,
  },
  {
    code: "EQ-011",
    designation: "Respirateur de réanimation",
    zone: "Réanimation",
    qte: 3,
    fournisseur: "Dräger",
    statut: "Commandé",
    livraisonPrevue: "25/03/2026",
    categorie: "Réanimation",
    puissance: 150,
    poids: 28,
    dimensions: "45×35×140",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: false, cvc: true },
    instructionsInstallation:
      "Raccordement O₂ médical 4 bar et air médical 4 bar sur têtes de lit dédiées. Vérification du débit nominal avant mise en service. Formation obligatoire du personnel infirmier.",
    progress: 40,
  },
  {
    code: "EQ-012",
    designation: "Lampe scialytique",
    zone: "Blocs Opératoires",
    qte: 4,
    fournisseur: "Stryker",
    statut: "Commandé",
    livraisonPrevue: "15/04/2026",
    categorie: "Bloc Opératoire",
    puissance: 300,
    poids: 55,
    dimensions: "120×120×90",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Fixation sur platine plafond avec renfort structurel (charge 200kg). Raccordement alimentation 32A dédiée avec UPS. Test d'illumination (≥160 000 lux) et équilibrage bras articulés obligatoires.",
    progress: 40,
  },
  {
    code: "EQ-013",
    designation: "Lit de réanimation électrique",
    zone: "Réanimation",
    qte: 6,
    fournisseur: "Linet",
    statut: "Livré",
    livraisonPrevue: null,
    categorie: "Réanimation",
    puissance: 400,
    poids: 145,
    dimensions: "230×95×60",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: true, cvc: true },
    instructionsInstallation:
      "Positionner avec accès 3 côtés minimum. Raccordement prise dédié avec mise à la terre équipotentielle. Connexion RJ45 pour système appel infirmière. Test de toutes les positions motorisées.",
    progress: 60,
  },
  {
    code: "EQ-014",
    designation: "Chariot d'urgence",
    zone: "Urgences",
    qte: 4,
    fournisseur: "MedCart",
    statut: "À définir",
    livraisonPrevue: null,
    categorie: "Urgences",
    puissance: null,
    poids: 35,
    dimensions: "90×50×95",
    prereqs: { cfo: null, reseau: null, plomberie: null, fluides: null, cvc: null },
    instructionsInstallation:
      "Aucun prérequis technique particulier. Positionnement dans les couloirs d'accès aux salles d'urgence. Contenu du chariot à définir selon protocole médical.",
    progress: 5,
  },
  {
    code: "EQ-015",
    designation: "Stérilisateur vapeur",
    zone: "Stérilisation",
    qte: 1,
    fournisseur: "Getinge",
    statut: "Commandé",
    livraisonPrevue: "05/05/2026",
    categorie: "Stérilisation",
    puissance: 12000,
    poids: 520,
    dimensions: "170×100×200",
    prereqs: { cfo: true, reseau: true, plomberie: true, fluides: false, cvc: true },
    instructionsInstallation:
      "Même conditions que l'autoclave. Raccordement vapeur industrielle 4 bar. Purge et test d'étanchéité obligatoires. Qualification IQ/OQ/PQ requise avant mise en service.",
    progress: 40,
  },
]

// ─── Constants ──────────────────────────────────────────────────────────────────

const STATUT_WORKFLOW: Statut[] = [
  "À définir",
  "Validé",
  "Commandé",
  "Livré",
  "Installé",
  "Mis en service",
]

const ZONES = [
  "Tous",
  "Bloc Obstétrique",
  "Néonatologie",
  "Urgences",
  "Urgences + Hospit",
  "Gynécologie",
  "Bloc Opératoire",
  "Blocs Opératoires",
  "Stérilisation",
  "Laboratoire",
  "Local technique",
  "Réanimation",
]

const STATUTS: Array<Statut | "Tous"> = [
  "Tous",
  "À définir",
  "Validé",
  "Commandé",
  "Livré",
  "Installé",
  "Bloqué",
]

const CATEGORIES: Array<Categorie | "Tous"> = [
  "Tous",
  "Obstétrique",
  "Réanimation",
  "Urgences",
  "Laboratoire",
  "Stérilisation",
  "Infrastructure",
  "Imagerie",
  "Bloc Opératoire",
]

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getStatutBadgeVariant(
  statut: Statut
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" {
  switch (statut) {
    case "À définir":
      return "secondary"
    case "Validé":
      return "info"
    case "Commandé":
      return "warning"
    case "Livré":
      return "info"
    case "Installé":
      return "success"
    case "Mis en service":
      return "success"
    case "Bloqué":
      return "destructive"
    default:
      return "secondary"
  }
}

function getStatutProgressColor(statut: Statut): string {
  switch (statut) {
    case "À définir":
      return "bg-slate-400"
    case "Validé":
      return "bg-blue-500"
    case "Commandé":
      return "bg-yellow-500"
    case "Livré":
      return "bg-blue-400"
    case "Installé":
      return "bg-green-500"
    case "Mis en service":
      return "bg-green-600"
    case "Bloqué":
      return "bg-red-500"
    default:
      return "bg-slate-300"
  }
}

function getWorkflowStepIndex(statut: Statut): number {
  if (statut === "Bloqué") return -1
  return STATUT_WORKFLOW.indexOf(statut)
}

function hasUnmetPrereqs(prereqs: Prerequisites): boolean {
  return Object.values(prereqs).some((v) => v === false)
}

function allPrereqsNull(prereqs: Prerequisites): boolean {
  return Object.values(prereqs).every((v) => v === null)
}

function getPvButtonState(
  statut: Statut,
  pvType: "reception" | "installation" | "miseEnService"
): boolean {
  const order: Record<string, number> = {
    "À définir": 0,
    Validé: 1,
    Commandé: 2,
    Livré: 3,
    Installé: 4,
    "Mis en service": 5,
    Bloqué: -1,
  }
  const current = order[statut] ?? 0
  if (pvType === "reception") return current >= 3
  if (pvType === "installation") return current >= 4
  if (pvType === "miseEnService") return current >= 5
  return false
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string
  value: number
  color: string
  icon: React.ElementType
}) {
  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
              {label}
            </p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`rounded-lg w-9 h-9 flex items-center justify-center ${color.replace("text-", "bg-").replace("-600", "-100").replace("-800", "-100")}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PrereqRow({
  label,
  value,
}: {
  label: string
  value: boolean | null
}) {
  if (value === null) {
    return (
      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
        <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0 bg-slate-50" />
        <span className="text-sm text-slate-400">{label}</span>
        <span className="ml-auto text-xs text-slate-400 italic">Non défini</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
      {value ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      )}
      <span className={`text-sm font-medium ${value ? "text-slate-700" : "text-red-700"}`}>
        {label}
      </span>
      <span
        className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
          value
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {value ? "Validé" : "Manquant"}
      </span>
    </div>
  )
}

function WorkflowStepper({ statut }: { statut: Statut }) {
  const activeIdx = getWorkflowStepIndex(statut)
  const isBlocked = statut === "Bloqué"

  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto pb-1">
      {STATUT_WORKFLOW.map((step, idx) => {
        const isActive = idx === activeIdx && !isBlocked
        const isDone = idx < activeIdx && !isBlocked
        const isNext = idx > activeIdx

        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white ring-2 ring-blue-200"
                    : isDone
                    ? "bg-green-500 text-white"
                    : isBlocked && idx <= 3
                    ? "bg-red-200 text-red-600"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center leading-tight whitespace-nowrap px-0.5 ${
                  isActive
                    ? "text-blue-700"
                    : isDone
                    ? "text-green-600"
                    : isBlocked && idx === activeIdx + 1
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < STATUT_WORKFLOW.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 flex-shrink-0 ${
                  isDone ? "bg-green-400" : isBlocked ? "bg-red-200" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        )
      })}
      {isBlocked && (
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <XCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold text-red-600 whitespace-nowrap">Bloqué</span>
        </div>
      )}
    </div>
  )
}

// ─── Detail Modal ────────────────────────────────────────────────────────────────

function EquipmentDetailModal({
  equipment,
  onClose,
}: {
  equipment: Equipment
  onClose: () => void
}) {
  const unmet = hasUnmetPrereqs(equipment.prereqs)
  const noPrereqs = allPrereqsNull(equipment.prereqs)

  const pvReceptionEnabled = getPvButtonState(equipment.statut, "reception")
  const pvInstallationEnabled = getPvButtonState(equipment.statut, "installation")
  const pvMiseEnServiceEnabled = getPvButtonState(equipment.statut, "miseEnService")

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-slate-500 font-semibold">{equipment.code}</span>
            <Badge variant={getStatutBadgeVariant(equipment.statut)}>{equipment.statut}</Badge>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 mt-1">
            {equipment.designation}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {equipment.zone} · Qté: {equipment.qte} · Fournisseur: {equipment.fournisseur}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Workflow stepper */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Workflow d'installation
            </p>
            <WorkflowStepper statut={equipment.statut} />
          </div>

          {/* Alert if blocked */}
          {(equipment.statut === "Bloqué" || (unmet && !noPrereqs)) && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Prérequis manquants — Installation impossible
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Tous les prérequis doivent être validés avant de procéder à l'installation.
                </p>
              </div>
            </div>
          )}

          {/* Specs */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Spécifications techniques
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 mb-1">Puissance</p>
                <p className="text-sm font-bold text-slate-800">
                  {equipment.puissance !== null
                    ? equipment.puissance >= 1000
                      ? `${(equipment.puissance / 1000).toFixed(0)} kW`
                      : `${equipment.puissance} W`
                    : "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                <Package className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 mb-1">Poids</p>
                <p className="text-sm font-bold text-slate-800">
                  {equipment.poids !== null ? `${equipment.poids} kg` : "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                <Wrench className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 mb-1">Dimensions (cm)</p>
                <p className="text-sm font-bold text-slate-800">
                  {equipment.dimensions !== null ? equipment.dimensions : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Prérequis techniques
            </p>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2">
              <PrereqRow label="CFO — Courants Forts" value={equipment.prereqs.cfo} />
              <PrereqRow label="Réseau informatique" value={equipment.prereqs.reseau} />
              <PrereqRow label="Plomberie sanitaire" value={equipment.prereqs.plomberie} />
              <PrereqRow label="Fluides Médicaux (O₂, Air, Vide)" value={equipment.prereqs.fluides} />
              <PrereqRow label="CVC — Climatisation" value={equipment.prereqs.cvc} />
            </div>
          </div>

          {/* Installation instructions */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Instructions d'installation
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {equipment.instructionsInstallation}
              </p>
            </div>
          </div>

          {/* PV Buttons */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Procès-verbaux
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={pvReceptionEnabled ? "default" : "outline"}
                disabled={!pvReceptionEnabled}
                className="flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                PV Réception
              </Button>
              <Button
                variant={pvInstallationEnabled ? "default" : "outline"}
                disabled={!pvInstallationEnabled}
                className="flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                PV Installation
              </Button>
              <Button
                variant={pvMiseEnServiceEnabled ? "default" : "outline"}
                disabled={!pvMiseEnServiceEnabled}
                className="flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                PV Mise en Service
              </Button>
            </div>
            {!pvReceptionEnabled && (
              <p className="text-xs text-slate-400 mt-2">
                Les PV sont disponibles une fois l'équipement livré (statut ≥ Livré).
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function EquipementsPage() {
  const [filterZone, setFilterZone] = useState<string>("Tous")
  const [filterStatut, setFilterStatut] = useState<string>("Tous")
  const [filterCategorie, setFilterCategorie] = useState<string>("Tous")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  // Stats
  const total = EQUIPMENT_LIST.length
  const commandes = EQUIPMENT_LIST.filter((e) => e.statut === "Commandé").length
  const livres = EQUIPMENT_LIST.filter((e) => e.statut === "Livré").length
  const installes = EQUIPMENT_LIST.filter((e) => e.statut === "Installé").length
  const bloques = EQUIPMENT_LIST.filter((e) => e.statut === "Bloqué").length

  // Filtered list
  const filtered = EQUIPMENT_LIST.filter((eq) => {
    const matchZone = filterZone === "Tous" || eq.zone === filterZone
    const matchStatut = filterStatut === "Tous" || eq.statut === filterStatut
    const matchCategorie = filterCategorie === "Tous" || eq.categorie === filterCategorie
    return matchZone && matchStatut && matchCategorie
  })

  // Count items with unvalidated prereqs
  const unvalidatedPrereqsCount = EQUIPMENT_LIST.filter(
    (eq) => hasUnmetPrereqs(eq.prereqs) && !allPrereqsNull(eq.prereqs)
  ).length

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Équipements Biomédicaux
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi des équipements — installation et mise en service
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 shadow-sm border border-yellow-200">
          <CardContent className="p-4">
            <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide mb-1">Commandés</p>
            <p className="text-2xl font-bold text-yellow-700">{commandes}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 shadow-sm border border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide mb-1">Livrés</p>
            <p className="text-2xl font-bold text-blue-700">{livres}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 shadow-sm border border-green-200">
          <CardContent className="p-4">
            <p className="text-xs text-green-700 font-medium uppercase tracking-wide mb-1">Installés</p>
            <p className="text-2xl font-bold text-green-700">{installes}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 shadow-sm border border-red-200">
          <CardContent className="p-4">
            <p className="text-xs text-red-700 font-medium uppercase tracking-wide mb-1">Bloqués</p>
            <p className="text-2xl font-bold text-red-700">{bloques}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert banner */}
      {unvalidatedPrereqsCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-5 py-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-amber-800">
              {unvalidatedPrereqsCount} équipement{unvalidatedPrereqsCount > 1 ? "s" : ""} ont des prérequis non validés
            </span>
            <span className="text-sm text-amber-700"> — Installation bloquée</span>
          </div>
          <Badge variant="warning" className="flex-shrink-0 text-xs">
            Action requise
          </Badge>
        </div>
      )}

      {/* Workflow stepper strip */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Workflow de statut — Équipements Biomédicaux
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="flex items-center gap-0 w-full">
            {STATUT_WORKFLOW.map((step, idx) => {
              const count = EQUIPMENT_LIST.filter((e) => e.statut === step).length
              const isLast = idx === STATUT_WORKFLOW.length - 1

              const stepColors: Record<string, { dot: string; text: string; count: string }> = {
                "À définir": { dot: "bg-slate-300", text: "text-slate-500", count: "bg-slate-100 text-slate-600" },
                Validé: { dot: "bg-blue-500", text: "text-blue-700", count: "bg-blue-100 text-blue-700" },
                Commandé: { dot: "bg-yellow-500", text: "text-yellow-700", count: "bg-yellow-100 text-yellow-700" },
                Livré: { dot: "bg-blue-400", text: "text-blue-600", count: "bg-blue-50 text-blue-600" },
                Installé: { dot: "bg-green-500", text: "text-green-700", count: "bg-green-100 text-green-700" },
                "Mis en service": { dot: "bg-green-600", text: "text-green-800", count: "bg-green-100 text-green-800" },
              }
              const colors = stepColors[step] ?? { dot: "bg-slate-300", text: "text-slate-500", count: "bg-slate-100 text-slate-600" }

              return (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1 min-w-0 gap-1">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <span className={`text-xs font-semibold ${colors.text} text-center leading-tight whitespace-nowrap hidden sm:block`}>
                      {step}
                    </span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${colors.count}`}>
                      {count}
                    </span>
                  </div>
                  {!isLast && (
                    <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mx-0.5" />
                  )}
                </div>
              )
            })}
            <div className="flex items-center flex-shrink-0 ml-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-red-700 hidden sm:block">Bloqué</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  {EQUIPMENT_LIST.filter((e) => e.statut === "Bloqué").length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="w-4 h-4" />
          Filtres :
        </div>
        <div className="flex flex-wrap gap-3 flex-1">
          <Select value={filterZone} onValueChange={setFilterZone}>
            <SelectTrigger className="w-52 h-9 text-sm">
              <SelectValue placeholder="Par zone" />
            </SelectTrigger>
            <SelectContent>
              {ZONES.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue placeholder="Par statut" />
            </SelectTrigger>
            <SelectContent>
              {STATUTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategorie} onValueChange={setFilterCategorie}>
            <SelectTrigger className="w-48 h-9 text-sm">
              <SelectValue placeholder="Par catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filterZone !== "Tous" || filterStatut !== "Tous" || filterCategorie !== "Tous") && (
            <Button
              variant="outline"
              className="h-9 text-sm text-slate-500"
              onClick={() => {
                setFilterZone("Tous")
                setFilterStatut("Tous")
                setFilterCategorie("Tous")
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
        <span className="text-sm text-slate-400 flex-shrink-0">
          {filtered.length} / {total} équipement{total > 1 ? "s" : ""}
        </span>
      </div>

      {/* Equipment table */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Code
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Désignation
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                  Zone / Local
                </th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                  Qté
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                  Fournisseur
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Statut
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">
                  Livraison Prévue
                </th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    Aucun équipement ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filtered.map((eq, idx) => {
                  const unmet = hasUnmetPrereqs(eq.prereqs) && !allPrereqsNull(eq.prereqs)

                  return (
                    <tr
                      key={eq.code}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? "" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Code */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-slate-600">
                            {eq.code}
                          </span>
                          {unmet && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" title="Prérequis non validés" />
                          )}
                        </div>
                      </td>

                      {/* Désignation */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 text-sm">{eq.designation}</span>
                        <span className="block text-xs text-slate-400 md:hidden mt-0.5">{eq.zone}</span>
                      </td>

                      {/* Zone */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-slate-600">{eq.zone}</span>
                      </td>

                      {/* Qté */}
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className="text-sm font-medium text-slate-700">{eq.qte}</span>
                      </td>

                      {/* Fournisseur */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-slate-600">{eq.fournisseur}</span>
                      </td>

                      {/* Statut + mini progress bar */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5 min-w-[110px]">
                          <Badge variant={getStatutBadgeVariant(eq.statut)} className="w-fit text-xs">
                            {eq.statut}
                          </Badge>
                          <div className="w-full bg-slate-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all ${getStatutProgressColor(eq.statut)}`}
                              style={{ width: `${eq.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Livraison Prévue */}
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {eq.livraisonPrevue ? (
                          <span className="text-sm text-slate-600 font-medium">
                            {eq.livraisonPrevue}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedEquipment(eq)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  )
}
