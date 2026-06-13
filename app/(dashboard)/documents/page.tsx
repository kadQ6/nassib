"use client"

import { useState, useMemo } from "react"
import {
  FileText,
  Download,
  Eye,
  Upload,
  Search,
  Filter,
  X,
  Check,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  MessageSquare,
  History,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus =
  | "approuve"
  | "approuve_commentaires"
  | "en_revue"
  | "soumis"
  | "brouillon"
  | "refuse"
  | "obsolete"

type DocType =
  | "plan_archi"
  | "plan_cfo"
  | "plan_cvc"
  | "plan_cfa"
  | "plan_fluides"
  | "plan_structure"
  | "plan_ssi"
  | "note_calcul"
  | "pv_essai"
  | "cr_chantier"
  | "fiche_technique"
  | "methodologie"
  | "doe"
  | "facture"

interface Document {
  id: string
  title: string
  type: DocType
  version: string
  emitter: string
  lot: string
  date: string
  status: DocStatus
  fileSize: string
  comments: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const documents: Document[] = [
  { id: "1", title: "Plan masse RDC - Architecture", type: "plan_archi", version: "B", emitter: "Architecte Bureau", lot: "ARCHI", date: "2026-03-15", status: "approuve", fileSize: "8.2 MB", comments: 0 },
  { id: "2", title: "Plan implantation électrique RDC", type: "plan_cfo", version: "3", emitter: "ElecPro Djibouti", lot: "LOT-CFO", date: "2026-04-02", status: "approuve_commentaires", fileSize: "5.1 MB", comments: 3 },
  { id: "3", title: "Schéma unifilaire TGBT", type: "plan_cfo", version: "1", emitter: "ElecPro Djibouti", lot: "LOT-CFO", date: "2026-05-10", status: "en_revue", fileSize: "2.3 MB", comments: 1 },
  { id: "4", title: "Plan réseau CVC - Soufflage/Reprise", type: "plan_cvc", version: "2", emitter: "ClimaMed", lot: "LOT-CVC", date: "2026-04-18", status: "soumis", fileSize: "6.8 MB", comments: 0 },
  { id: "5", title: "Plan fluides médicaux O2/Vide", type: "plan_fluides", version: "1", emitter: "MedGaz", lot: "LOT-FLU", date: "2026-05-20", status: "soumis", fileSize: "4.2 MB", comments: 0 },
  { id: "6", title: "Note de calcul structure béton", type: "note_calcul", version: "A", emitter: "BET Structure", lot: "LOT-GC", date: "2025-10-05", status: "approuve", fileSize: "1.8 MB", comments: 0 },
  { id: "7", title: "PV essai réseau EF/EC - Plomberie", type: "pv_essai", version: "1", emitter: "AquaMed", lot: "LOT-PLB", date: "2026-05-28", status: "approuve", fileSize: "0.8 MB", comments: 0 },
  { id: "8", title: "CR Réunion chantier N°23", type: "cr_chantier", version: "1", emitter: "OPC Chantier", lot: "COORD", date: "2026-06-02", status: "approuve", fileSize: "0.4 MB", comments: 0 },
  { id: "9", title: "Fiche technique CTA principale", type: "fiche_technique", version: "1", emitter: "ClimaMed", lot: "LOT-CVC", date: "2026-04-25", status: "refuse", fileSize: "3.1 MB", comments: 4 },
  { id: "10", title: "Plan VRD - Réseaux EU/EP", type: "plan_structure", version: "2", emitter: "SETAB Construction", lot: "LOT-VRD", date: "2026-03-30", status: "approuve", fileSize: "7.5 MB", comments: 0 },
  { id: "11", title: "Plan SSI - Détection incendie", type: "plan_ssi", version: "1", emitter: "TechSécurité", lot: "LOT-CFA", date: "2026-05-15", status: "en_revue", fileSize: "4.9 MB", comments: 2 },
  { id: "12", title: "Méthodologie pose fluides médicaux", type: "methodologie", version: "1", emitter: "MedGaz", lot: "LOT-FLU", date: "2026-06-01", status: "soumis", fileSize: "1.2 MB", comments: 0 },
]

const MOCK_COMMENTS = [
  { author: "Ingénieur MOE", date: "2026-05-12", text: "Merci de revoir le schéma section 3.2 - les cotes sont incorrectes." },
  { author: "Chef de Projet", date: "2026-05-14", text: "Confirmer la conformité avec la norme NF C 15-100." },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<DocType, string> = {
  plan_archi: "Plan Archi",
  plan_cfo: "Plan CFO",
  plan_cvc: "Plan CVC",
  plan_cfa: "Plan CFA",
  plan_fluides: "Plan Fluides",
  plan_structure: "Plan Structure",
  plan_ssi: "Plan SSI",
  note_calcul: "Note de Calcul",
  pv_essai: "PV d'Essai",
  cr_chantier: "CR Chantier",
  fiche_technique: "Fiche Technique",
  methodologie: "Méthodologie",
  doe: "DOE",
  facture: "Facture",
}

const STATUS_LABELS: Record<DocStatus, string> = {
  approuve: "Approuvé",
  approuve_commentaires: "Approuvé avec commentaires",
  en_revue: "En revue",
  soumis: "Soumis",
  brouillon: "Brouillon",
  refuse: "Refusé",
  obsolete: "Obsolète",
}

type TabValue = "tous" | "plans" | "fiches" | "pv" | "cr" | "doe" | "factures"

const TAB_FILTER: Record<TabValue, (d: Document) => boolean> = {
  tous: () => true,
  plans: (d) => d.type.startsWith("plan_") || d.type === "note_calcul" || d.type === "methodologie",
  fiches: (d) => d.type === "fiche_technique",
  pv: (d) => d.type === "pv_essai",
  cr: (d) => d.type === "cr_chantier",
  doe: (d) => d.type === "doe",
  factures: (d) => d.type === "facture",
}

function getStatusBadge(status: DocStatus): JSX.Element {
  switch (status) {
    case "approuve":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <Check className="w-3 h-3" />
          Approuvé
        </span>
      )
    case "approuve_commentaires":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <AlertTriangle className="w-3 h-3" />
          Approuvé (commentaires)
        </span>
      )
    case "en_revue":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-300">
          <Clock className="w-3 h-3" />
          En revue
        </span>
      )
    case "soumis":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3" />
          Soumis
        </span>
      )
    case "brouillon":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          Brouillon
        </span>
      )
    case "refuse":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <XCircle className="w-3 h-3" />
          Refusé
        </span>
      )
    case "obsolete":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 line-through">
          Obsolète
        </span>
      )
  }
}

function getDocTypeIcon(type: DocType): JSX.Element {
  const colorMap: Partial<Record<DocType, string>> = {
    plan_archi: "text-purple-500",
    plan_cfo: "text-yellow-500",
    plan_cvc: "text-blue-500",
    plan_cfa: "text-indigo-500",
    plan_fluides: "text-cyan-500",
    plan_structure: "text-orange-500",
    plan_ssi: "text-red-500",
    note_calcul: "text-slate-500",
    pv_essai: "text-green-500",
    cr_chantier: "text-teal-500",
    fiche_technique: "text-pink-500",
    methodologie: "text-violet-500",
    doe: "text-emerald-500",
    facture: "text-gray-500",
  }
  const color = colorMap[type] ?? "text-slate-400"
  return <FileText className={`w-4 h-4 flex-shrink-0 ${color}`} />
}

function getTypeBadge(type: DocType): JSX.Element {
  const colorMap: Partial<Record<DocType, string>> = {
    plan_archi: "bg-purple-50 text-purple-700 border-purple-200",
    plan_cfo: "bg-yellow-50 text-yellow-700 border-yellow-200",
    plan_cvc: "bg-blue-50 text-blue-700 border-blue-200",
    plan_cfa: "bg-indigo-50 text-indigo-700 border-indigo-200",
    plan_fluides: "bg-cyan-50 text-cyan-700 border-cyan-200",
    plan_structure: "bg-orange-50 text-orange-700 border-orange-200",
    plan_ssi: "bg-red-50 text-red-700 border-red-200",
    note_calcul: "bg-slate-50 text-slate-700 border-slate-200",
    pv_essai: "bg-green-50 text-green-700 border-green-200",
    cr_chantier: "bg-teal-50 text-teal-700 border-teal-200",
    fiche_technique: "bg-pink-50 text-pink-700 border-pink-200",
    methodologie: "bg-violet-50 text-violet-700 border-violet-200",
    doe: "bg-emerald-50 text-emerald-700 border-emerald-200",
    facture: "bg-gray-50 text-gray-700 border-gray-200",
  }
  const color = colorMap[type] ?? "bg-gray-50 text-gray-700 border-gray-200"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {TYPE_LABELS[type]}
    </span>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const ALL_LOTS = Array.from(new Set(documents.map((d) => d.lot))).sort()
const ALL_STATUSES: DocStatus[] = [
  "approuve",
  "approuve_commentaires",
  "en_revue",
  "soumis",
  "brouillon",
  "refuse",
  "obsolete",
]

// ─── Status Workflow ──────────────────────────────────────────────────────────

function StatusWorkflow({ status }: { status: DocStatus }) {
  const steps: { key: string; label: string }[] = [
    { key: "soumis", label: "Soumis" },
    { key: "en_revue", label: "En Revue" },
    { key: "final", label: "Approuvé / Refusé" },
  ]

  const getActiveStep = (): number => {
    if (status === "soumis" || status === "brouillon") return 0
    if (status === "en_revue") return 1
    return 2
  }

  const activeStep = getActiveStep()

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const isActive = idx === activeStep
        const isDone = idx < activeStep
        const isFinal = idx === 2

        let bgClass = "bg-slate-100 text-slate-500 border-slate-200"
        if (isDone) bgClass = "bg-green-500 text-white border-green-500"
        if (isActive && !isFinal) bgClass = "bg-blue-600 text-white border-blue-600"
        if (isActive && isFinal) {
          if (status === "approuve" || status === "approuve_commentaires") {
            bgClass = "bg-green-500 text-white border-green-500"
          } else if (status === "refuse") {
            bgClass = "bg-red-500 text-white border-red-500"
          } else {
            bgClass = "bg-slate-100 text-slate-500 border-slate-200"
          }
        }

        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${bgClass}`}>
              {isDone && <CheckCircle className="w-3 h-3" />}
              {isActive && !isFinal && <Clock className="w-3 h-3" />}
              {isActive && isFinal && (status === "approuve" || status === "approuve_commentaires") && <CheckCircle className="w-3 h-3" />}
              {isActive && isFinal && status === "refuse" && <XCircle className="w-3 h-3" />}
              {step.label}
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Document Detail Modal ────────────────────────────────────────────────────

function DocumentDetailModal({
  doc,
  onClose,
}: {
  doc: Document
  onClose: () => void
}) {
  const versionNum = parseInt(doc.version, 10)
  const hasPrevVersion = !isNaN(versionNum) && versionNum > 1

  const prevVersions = hasPrevVersion
    ? Array.from({ length: versionNum - 1 }, (_, i) => ({
        version: String(i + 1),
        date: "2026-0" + (i + 2) + "-01",
        emitter: doc.emitter,
        status: i + 1 < versionNum - 1 ? "obsolete" : "approuve",
      }))
    : []

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {getDocTypeIcon(doc.type)}
            <span className="flex-1 leading-tight">{doc.title}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Meta info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Version</p>
            <p className="text-sm font-semibold text-slate-800">v{doc.version}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Émetteur</p>
            <p className="text-sm font-medium text-slate-700">{doc.emitter}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Date</p>
            <p className="text-sm font-medium text-slate-700">{formatDate(doc.date)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Taille</p>
            <p className="text-sm font-medium text-slate-700">{doc.fileSize}</p>
          </div>
        </div>

        {/* Status workflow */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Statut du workflow
          </p>
          <div className="overflow-x-auto pb-1">
            <StatusWorkflow status={doc.status} />
          </div>
          <div className="mt-2">{getStatusBadge(doc.status)}</div>
        </div>

        {/* File preview placeholder */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Prévisualisation
          </p>
          <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center py-8 gap-2">
            <FileText className="w-8 h-8 text-slate-300" />
            <p className="text-sm text-slate-400">
              Prévisualisation non disponible — Télécharger le fichier
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 gap-1.5 text-xs"
              onClick={() => {}}
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger ({doc.fileSize})
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Commentaires ({MOCK_COMMENTS.length})
          </p>
          <div className="space-y-2">
            {MOCK_COMMENTS.map((c, idx) => (
              <div key={idx} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{c.author}</span>
                  <span className="text-xs text-slate-400">{formatDate(c.date)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Version history */}
        {prevVersions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Historique des versions
            </p>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Version</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Date</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Émetteur</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {prevVersions.map((pv) => (
                    <tr key={pv.version} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-2 font-mono text-slate-600">v{pv.version}</td>
                      <td className="px-3 py-2 text-slate-600">{formatDate(pv.date)}</td>
                      <td className="px-3 py-2 text-slate-600">{pv.emitter}</td>
                      <td className="px-3 py-2">
                        {getStatusBadge(pv.status as DocStatus)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-3 py-2 font-mono font-semibold text-slate-800">v{doc.version} (actuelle)</td>
                    <td className="px-3 py-2 text-slate-600">{formatDate(doc.date)}</td>
                    <td className="px-3 py-2 text-slate-600">{doc.emitter}</td>
                    <td className="px-3 py-2">{getStatusBadge(doc.status)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
            Fermer
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-600 border-slate-300">
            <MessageSquare className="w-3.5 h-3.5" />
            Commenter
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white"
            onClick={onClose}
          >
            <XCircle className="w-3.5 h-3.5" />
            Refuser
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white"
            onClick={onClose}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approuver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

const DOC_TYPES: DocType[] = [
  "plan_archi",
  "plan_cfo",
  "plan_cvc",
  "plan_cfa",
  "plan_fluides",
  "plan_structure",
  "plan_ssi",
  "note_calcul",
  "pv_essai",
  "cr_chantier",
  "fiche_technique",
  "methodologie",
  "doe",
  "facture",
]

interface UploadForm {
  titre: string
  type: DocType
  lot: string
  version: string
  emitter: string
  notes: string
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<UploadForm>({
    titre: "",
    type: "plan_archi",
    lot: "LOT-GC",
    version: "1",
    emitter: "",
    notes: "",
  })
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            Déposer un document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {/* Titre */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 block">Titre</label>
            <Input
              placeholder="Titre du document..."
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Type + Lot */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 block">Type</label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as DocType })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 block">Lot</label>
              <Select
                value={form.lot}
                onValueChange={(v) => setForm({ ...form, lot: v })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_LOTS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Version + Émetteur */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 block">Version</label>
              <Input
                placeholder="ex: 1, A, B..."
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 block">Émetteur</label>
              <Input
                placeholder="Nom de la société..."
                value={form.emitter}
                onChange={(e) => setForm({ ...form, emitter: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 block">Notes</label>
            <Textarea
              placeholder="Notes ou description complémentaire..."
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="text-sm resize-none"
            />
          </div>

          {/* File drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const f = e.dataTransfer.files[0]
              if (f) setFileName(f.name)
            }}
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement
                const f = target.files?.[0]
                if (f) setFileName(f.name)
              }
              input.click()
            }}
          >
            <Upload className={`w-6 h-6 ${dragOver ? "text-blue-400" : "text-slate-300"}`} />
            {fileName ? (
              <p className="text-xs font-medium text-blue-600">{fileName}</p>
            ) : (
              <>
                <p className="text-xs font-medium text-slate-500">
                  Glisser-déposer ou cliquer pour sélectionner
                </p>
                <p className="text-xs text-slate-400">PDF, DWG, DXF, XLSX — max 50 Mo</p>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-sm">
            Annuler
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm gap-1.5"
            onClick={onClose}
            disabled={!form.titre || !form.emitter}
          >
            <Upload className="w-3.5 h-3.5" />
            Soumettre le document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [selectedTab, setSelectedTab] = useState<TabValue>("tous")
  const [lotFilter, setLotFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [emitterSearch, setEmitterSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (!TAB_FILTER[selectedTab](doc)) return false
      if (lotFilter !== "all" && doc.lot !== lotFilter) return false
      if (statusFilter !== "all" && doc.status !== statusFilter) return false
      if (emitterSearch.trim() && !doc.emitter.toLowerCase().includes(emitterSearch.trim().toLowerCase())) return false
      if (dateFrom && doc.date < dateFrom) return false
      if (dateTo && doc.date > dateTo) return false
      return true
    })
  }, [selectedTab, lotFilter, statusFilter, emitterSearch, dateFrom, dateTo])

  const hasFilters = lotFilter !== "all" || statusFilter !== "all" || emitterSearch || dateFrom || dateTo

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Documents & GED</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestion Électronique des Documents — Polyclinique Cité Nassib
          </p>
        </div>
      </div>

      {/* Stats Header Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">67</p>
            <p className="text-xs text-slate-400 mt-0.5">documents</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-green-100">
          <CardContent className="p-4">
            <p className="text-xs text-green-600 uppercase tracking-wide font-medium">Approuvés</p>
            <p className="text-3xl font-bold text-green-700 mt-1">42</p>
            <p className="text-xs text-slate-400 mt-0.5">documents</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-blue-100">
          <CardContent className="p-4">
            <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">En revue</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">8</p>
            <p className="text-xs text-slate-400 mt-0.5">documents</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-amber-100">
          <CardContent className="p-4">
            <p className="text-xs text-amber-600 uppercase tracking-wide font-medium">En attente</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">12</p>
            <p className="text-xs text-slate-400 mt-0.5">documents</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-red-100">
          <CardContent className="p-4">
            <p className="text-xs text-red-600 uppercase tracking-wide font-medium">Refusés</p>
            <p className="text-3xl font-bold text-red-700 mt-1">5</p>
            <p className="text-xs text-slate-400 mt-0.5">documents</p>
          </CardContent>
        </Card>
      </div>

      {/* GED Rule Banner */}
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Règle GED :</span>{" "}
          Un document avec le statut &apos;Obsolète&apos; ne peut pas être utilisé comme référence active sur le chantier.
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as TabValue)}>
        <div className="flex flex-col gap-3">
          <TabsList className="bg-slate-100 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="fiches">Fiches Techniques</TabsTrigger>
            <TabsTrigger value="pv">PV d&apos;Essais</TabsTrigger>
            <TabsTrigger value="cr">CR Chantier</TabsTrigger>
            <TabsTrigger value="doe">DOE</TabsTrigger>
            <TabsTrigger value="factures">Factures</TabsTrigger>
          </TabsList>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />

            {/* Lot Filter */}
            <Select value={lotFilter} onValueChange={setLotFilter}>
              <SelectTrigger className="w-36 text-xs h-8 border-slate-200">
                <SelectValue placeholder="Tous les lots" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les lots</SelectItem>
                {ALL_LOTS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 text-xs h-8 border-slate-200">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Emitter Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                placeholder="Émetteur..."
                value={emitterSearch}
                onChange={(e) => setEmitterSearch(e.target.value)}
                className="pl-7 w-40 text-xs h-8 border-slate-200"
              />
            </div>

            {/* Date From */}
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-36 text-xs h-8 border-slate-200"
              title="Date de début"
            />

            {/* Date To */}
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-36 text-xs h-8 border-slate-200"
              title="Date de fin"
            />

            {/* Reset filters */}
            {hasFilters && (
              <button
                onClick={() => {
                  setLotFilter("all")
                  setStatusFilter("all")
                  setEmitterSearch("")
                  setDateFrom("")
                  setDateTo("")
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 rounded-md px-2 py-1.5 h-8"
              >
                <X className="w-3 h-3" />
                Réinitialiser
              </button>
            )}

            <div className="flex-1 flex justify-end">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1.5"
                size="sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Déposer un document
              </Button>
            </div>
          </div>

          {/* Documents Table (shared across all tabs) */}
          <TabsContent value={selectedTab} className="mt-0">
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="pb-2 px-4 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-800">
                    Documents
                  </CardTitle>
                  <span className="text-xs text-slate-400">
                    {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 min-w-[200px]">Titre</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Type</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Version</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Émetteur</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Lot</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Date</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Statut</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p>Aucun document ne correspond aux filtres sélectionnés.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredDocuments.map((doc) => (
                          <tr
                            key={doc.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {getDocTypeIcon(doc.type)}
                                <span className="font-medium text-slate-800 leading-tight">
                                  {doc.title}
                                </span>
                                {doc.comments > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-slate-400">
                                    <MessageSquare className="w-3 h-3" />
                                    {doc.comments}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {getTypeBadge(doc.type)}
                            </td>
                            <td className="px-3 py-3 font-mono text-slate-600 whitespace-nowrap">
                              v{doc.version}
                            </td>
                            <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                              {doc.emitter}
                            </td>
                            <td className="px-3 py-3 font-mono text-slate-500 whitespace-nowrap">
                              {doc.lot}
                            </td>
                            <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-mono">
                              {formatDate(doc.date)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {getStatusBadge(doc.status)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedDocument(doc)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Voir le document"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {}}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                  title="Télécharger"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <DocumentDetailModal
          doc={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  )
}
