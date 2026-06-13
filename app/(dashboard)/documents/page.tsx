"use client"

import React, { useState } from "react"
import {
  FileText,
  Eye,
  Download,
  Upload,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  File,
  MessageSquare,
  ChevronRight,
} from "lucide-react"

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

interface MockComment {
  author: string
  role: string
  date: string
  text: string
}

interface VersionEntry {
  version: string
  date: string
  author: string
  status: DocStatus
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

const MOCK_COMMENTS: MockComment[] = [
  {
    author: "Jean-Pierre MOREAU",
    role: "BET Contrôle",
    date: "2026-05-10",
    text: "Revoir la disposition des gaines en zone technique.",
  },
  {
    author: "Sarah HASSAN",
    role: "MOE",
    date: "2026-05-12",
    text: "Confirmer avec le CVC la hauteur sous plafond disponible.",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  plan_archi: "Plan Architecture",
  plan_cfo: "Plan Électrique",
  plan_cvc: "Plan CVC",
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

const statusLabels: Record<DocStatus, string> = {
  approuve: "Approuvé",
  approuve_commentaires: "Approuvé (commentaires)",
  en_revue: "En revue",
  soumis: "Soumis",
  brouillon: "Brouillon",
  refuse: "Refusé",
  obsolete: "Obsolète",
}

type TabId = "tous" | "plans" | "fiches" | "pv" | "cr" | "doe" | "factures"

const TAB_FILTER: Record<TabId, (d: Document) => boolean> = {
  tous: () => true,
  plans: (d) => d.type.startsWith("plan_"),
  fiches: (d) => d.type === "fiche_technique",
  pv: (d) => d.type === "pv_essai",
  cr: (d) => d.type === "cr_chantier",
  doe: (d) => d.type === "doe",
  factures: (d) => d.type === "facture",
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

const LOT_COLORS: Record<string, string> = {
  ARCHI: "bg-purple-100 text-purple-700",
  "LOT-GC": "bg-orange-100 text-orange-700",
  "LOT-CFO": "bg-yellow-100 text-yellow-700",
  "LOT-CVC": "bg-blue-100 text-blue-700",
  "LOT-PLB": "bg-cyan-100 text-cyan-700",
  "LOT-FLU": "bg-teal-100 text-teal-700",
  "LOT-VRD": "bg-lime-100 text-lime-700",
  "LOT-BIO": "bg-green-100 text-green-700",
  "LOT-CFA": "bg-indigo-100 text-indigo-700",
  COORD: "bg-slate-100 text-slate-700",
}

const TYPE_COLORS: Record<string, string> = {
  plan_archi: "bg-purple-50 text-purple-700 border border-purple-200",
  plan_cfo: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  plan_cvc: "bg-blue-50 text-blue-700 border border-blue-200",
  plan_fluides: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  plan_structure: "bg-orange-50 text-orange-700 border border-orange-200",
  plan_ssi: "bg-red-50 text-red-700 border border-red-200",
  note_calcul: "bg-slate-50 text-slate-700 border border-slate-200",
  pv_essai: "bg-green-50 text-green-700 border border-green-200",
  cr_chantier: "bg-teal-50 text-teal-700 border border-teal-200",
  fiche_technique: "bg-pink-50 text-pink-700 border border-pink-200",
  methodologie: "bg-violet-50 text-violet-700 border border-violet-200",
  doe: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  facture: "bg-gray-50 text-gray-700 border border-gray-200",
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

function getDocIcon(type: DocType): React.ReactNode {
  const colorMap: Record<string, string> = {
    plan_archi: "text-purple-500",
    plan_cfo: "text-yellow-500",
    plan_cvc: "text-blue-500",
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
  const cls = colorMap[type] ?? "text-slate-400"
  if (type.startsWith("plan_")) {
    return <File className={`w-4 h-4 flex-shrink-0 ${cls}`} />
  }
  return <FileText className={`w-4 h-4 flex-shrink-0 ${cls}`} />
}

function StatusBadge({ status }: { status: DocStatus }): React.ReactNode {
  switch (status) {
    case "approuve":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Approuvé
        </span>
      )
    case "approuve_commentaires":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <AlertTriangle className="w-3 h-3" />
          Approuvé ✓ commentaires
        </span>
      )
    case "en_revue":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-400 text-blue-700 bg-white">
          <Clock className="w-3 h-3" />
          En revue
        </span>
      )
    case "soumis":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <Clock className="w-3 h-3" />
          Soumis
        </span>
      )
    case "brouillon":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Brouillon
        </span>
      )
    case "refuse":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          Refusé
        </span>
      )
    case "obsolete":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 line-through">
          Obsolète
        </span>
      )
  }
}

// ─── Status Workflow ──────────────────────────────────────────────────────────

function StatusWorkflow({ status }: { status: DocStatus }) {
  const getActiveIndex = (): number => {
    if (status === "brouillon" || status === "soumis") return 0
    if (status === "en_revue") return 1
    return 2
  }
  const activeIdx = getActiveIndex()

  const steps = [
    { label: "Soumis" },
    { label: "En Revue" },
    { label: "Approuvé / Refusé" },
  ]

  function stepClass(idx: number): string {
    const isDone = idx < activeIdx
    const isActive = idx === activeIdx

    if (isDone) return "bg-green-500 text-white border-green-500"
    if (!isActive) return "bg-slate-100 text-slate-400 border-slate-200"
    if (idx < 2) return "bg-blue-600 text-white border-blue-600"
    if (status === "approuve" || status === "approuve_commentaires") return "bg-green-500 text-white border-green-500"
    if (status === "refuse") return "bg-red-500 text-white border-red-500"
    return "bg-slate-100 text-slate-500 border-slate-200"
  }

  return (
    <div className="flex items-center flex-wrap gap-1">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${stepClass(idx)}`}>
            {idx < activeIdx && <CheckCircle className="w-3 h-3" />}
            {idx === activeIdx && idx < 2 && <Clock className="w-3 h-3" />}
            {idx === activeIdx && idx === 2 && (status === "approuve" || status === "approuve_commentaires") && <CheckCircle className="w-3 h-3" />}
            {idx === activeIdx && idx === 2 && status === "refuse" && <XCircle className="w-3 h-3" />}
            {step.label}
          </span>
          {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
        </div>
      ))}
    </div>
  )
}

// ─── Document Detail Modal ────────────────────────────────────────────────────

function DocumentDetailModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const versionNum = parseInt(doc.version, 10)
  const hasPrevVersions = !isNaN(versionNum) && versionNum > 1

  const versionHistory: VersionEntry[] = hasPrevVersions
    ? [
        ...Array.from({ length: versionNum - 1 }, (_, i) => ({
          version: String(i + 1),
          date: `2026-0${(i + 2).toString().padStart(2, "0")}-01`,
          author: doc.emitter,
          status: "obsolete" as DocStatus,
        })),
        {
          version: doc.version,
          date: doc.date,
          author: doc.emitter,
          status: doc.status,
        },
      ]
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {getDocIcon(doc.type)}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-slate-900 leading-tight">{doc.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">v{doc.version}</span>
                <span className="text-xs text-slate-500">{doc.emitter}</span>
                <span className="text-xs text-slate-400">{formatDate(doc.date)}</span>
                <span className="text-xs text-slate-400">{doc.fileSize}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Workflow */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Statut du workflow</p>
            <StatusWorkflow status={doc.status} />
            <div className="mt-2">
              <StatusBadge status={doc.status} />
            </div>
          </div>

          {/* File Preview Placeholder */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Prévisualisation</p>
            <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center py-10 gap-3">
              <FileText className="w-10 h-10 text-slate-200" />
              <p className="text-sm text-slate-400">Prévisualisation non disponible — Télécharger le fichier</p>
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
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-700">{c.author}</span>
                    <span className="text-xs text-slate-400">({c.role})</span>
                    <span className="text-xs text-slate-400 ml-auto">{formatDate(c.date)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Version History */}
          {versionHistory.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Historique des versions</p>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-3 py-2 font-semibold text-slate-600">Version</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600">Date</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600">Auteur</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versionHistory.map((v, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-2 font-mono text-slate-600">v{v.version}</td>
                        <td className="px-3 py-2 text-slate-600">{formatDate(v.date)}</td>
                        <td className="px-3 py-2 text-slate-600">{v.author}</td>
                        <td className="px-3 py-2">
                          <StatusBadge status={v.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Commenter
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Refuser
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approuver
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

const DOC_TYPE_OPTIONS: { value: DocType; label: string }[] = [
  { value: "plan_archi", label: "Plan Architecture" },
  { value: "plan_cfo", label: "Plan Électrique (CFO)" },
  { value: "plan_cvc", label: "Plan CVC" },
  { value: "plan_fluides", label: "Plan Fluides" },
  { value: "plan_structure", label: "Plan Structure" },
  { value: "plan_ssi", label: "Plan SSI" },
  { value: "note_calcul", label: "Note de Calcul" },
  { value: "pv_essai", label: "PV d'Essai" },
  { value: "cr_chantier", label: "CR Chantier" },
  { value: "fiche_technique", label: "Fiche Technique" },
  { value: "methodologie", label: "Méthodologie" },
  { value: "doe", label: "DOE" },
  { value: "facture", label: "Facture" },
]

const LOT_OPTIONS = ["ARCHI", "LOT-GC", "LOT-CFO", "LOT-CVC", "LOT-PLB", "LOT-FLU", "LOT-VRD", "LOT-BIO", "LOT-CFA", "COORD"]

interface UploadForm {
  titre: string
  type: DocType
  lot: string
  version: string
  emetteur: string
  notes: string
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<UploadForm>({
    titre: "",
    type: "plan_archi",
    lot: "LOT-GC",
    version: "1",
    emetteur: "",
    notes: "",
  })
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const isValid = form.titre.trim() !== "" && form.emetteur.trim() !== ""

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setFileName(file.name)
  }

  function handleFileClick() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.dwg,.dxf,.xlsx,.docx"
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) setFileName(file.name)
    }
    input.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold text-slate-900">Déposer un document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Titre du document</label>
            <input
              type="text"
              placeholder="Ex: Plan masse RDC - Architecture"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type + Lot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Type de document</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DocType })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {DOC_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Lot</label>
              <select
                value={form.lot}
                onChange={(e) => setForm({ ...form, lot: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {LOT_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Version + Emetteur */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Version</label>
              <input
                type="text"
                placeholder="Ex: 1, A, B..."
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Émetteur</label>
              <input
                type="text"
                placeholder="Nom de la société..."
                value={form.emetteur}
                onChange={(e) => setForm({ ...form, emetteur: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea
              rows={2}
              placeholder="Notes ou description complémentaire..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={handleFileClick}
          >
            <Upload className={`w-7 h-7 ${dragOver ? "text-blue-400" : "text-slate-300"}`} />
            {fileName ? (
              <p className="text-xs font-medium text-blue-600">{fileName}</p>
            ) : (
              <>
                <p className="text-xs font-medium text-slate-500">Glisser-déposer ou cliquer pour sélectionner</p>
                <p className="text-xs text-slate-400">PDF, DWG, DXF, XLSX, DOCX — Max 50 MB</p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            disabled={!isValid}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Déposer le document
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "plans", label: "Plans" },
  { id: "fiches", label: "Fiches Techniques" },
  { id: "pv", label: "PV d'Essais" },
  { id: "cr", label: "CR Chantier" },
  { id: "doe", label: "DOE" },
  { id: "factures", label: "Factures" },
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("tous")
  const [selectedLot, setSelectedLot] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [searchEmitter, setSearchEmitter] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredDocs = documents.filter((doc) => {
    if (!TAB_FILTER[activeTab](doc)) return false
    if (selectedLot && doc.lot !== selectedLot) return false
    if (selectedStatus && doc.status !== selectedStatus) return false
    if (searchEmitter.trim() && !doc.emitter.toLowerCase().includes(searchEmitter.trim().toLowerCase())) return false
    return true
  })

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Documents & GED</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gestion électronique des documents du projet</p>
      </div>

      {/* Stats Header Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total", value: 67, sub: "documents", colorLabel: "text-slate-500", colorValue: "text-slate-900", border: "border-slate-200" },
          { label: "Approuvés", value: 42, sub: "documents", colorLabel: "text-green-600", colorValue: "text-green-700", border: "border-green-100" },
          { label: "En revue", value: 8, sub: "documents", colorLabel: "text-blue-600", colorValue: "text-blue-700", border: "border-blue-100" },
          { label: "En attente", value: 12, sub: "documents", colorLabel: "text-amber-600", colorValue: "text-amber-700", border: "border-amber-100" },
          { label: "Refusés", value: 5, sub: "documents", colorLabel: "text-red-600", colorValue: "text-red-700", border: "border-red-100" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white rounded-xl border ${stat.border} shadow-sm p-4`}>
            <p className={`text-xs uppercase tracking-wide font-medium ${stat.colorLabel}`}>{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.colorValue}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* GED Warning Banner */}
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Règle GED :</span>{" "}
          Un document avec le statut &apos;Obsolète&apos; ne peut pas être utilisé comme référence active sur le chantier.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Lot Select */}
        <select
          value={selectedLot}
          onChange={(e) => setSelectedLot(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 h-8"
        >
          <option value="">Tous les lots</option>
          {ALL_LOTS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Status Select */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 h-8"
        >
          <option value="">Tous les statuts</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>

        {/* Emitter Search */}
        <input
          type="text"
          placeholder="Rechercher par émetteur..."
          value={searchEmitter}
          onChange={(e) => setSearchEmitter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 w-48"
        />

        {/* Clear filters */}
        {(selectedLot || selectedStatus || searchEmitter) && (
          <button
            onClick={() => { setSelectedLot(""); setSelectedStatus(""); setSearchEmitter("") }}
            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg h-8 transition-colors"
          >
            <X className="w-3 h-3" />
            Effacer
          </button>
        )}

        {/* Upload Button */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors h-8"
          >
            <Upload className="w-3.5 h-3.5" />
            Déposer un document
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Documents</h2>
          <span className="text-xs text-slate-400">
            {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 min-w-[220px]">Titre</th>
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
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                    <p className="text-sm text-slate-400">Aucun document ne correspond aux filtres sélectionnés.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    {/* Titre */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getDocIcon(doc.type)}
                        <span className="font-medium text-slate-800 leading-tight">{doc.title}</span>
                        {doc.comments > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-slate-400">
                            <MessageSquare className="w-3 h-3" />
                            <span>{doc.comments}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[doc.type] ?? "bg-gray-50 text-gray-700 border border-gray-200"}`}>
                        {typeLabels[doc.type] ?? doc.type}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-xs">
                        v{doc.version}
                      </span>
                    </td>

                    {/* Emetteur */}
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{doc.emitter}</td>

                    {/* Lot Badge */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-mono ${LOT_COLORS[doc.lot] ?? "bg-slate-100 text-slate-600"}`}>
                        {doc.lot}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-mono">{formatDate(doc.date)}</td>

                    {/* Status */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <StatusBadge status={doc.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedDoc(doc)}
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
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <DocumentDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  )
}
