"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  FileText,
  ChevronRight,
  Search,
  X,
  Paperclip,
  Calendar,
  Building2,
  Hash,
  ArrowRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
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

// ─── Types ────────────────────────────────────────────────────────────────────

type Lot = "GC" | "CFO" | "CVC" | "PLB" | "FLU"
type Statut =
  | "Non commandé"
  | "En commande"
  | "Commandé"
  | "En fabrication"
  | "En transit"
  | "Livré"
  | "Bloqué"
type Criticite = "CRITIQUE" | "ÉLEVÉE" | "NORMALE"

interface Procurement {
  ref: string
  description: string
  lot: Lot
  fournisseur: string
  qte: string
  commande: string | null
  livraisonPrevue: string | null
  livraisonReelle: string | null
  statut: Statut
  criticite: Criticite
  impact: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const procurements: Procurement[] = [
  {
    ref: "APP-001",
    description: "Centrale de traitement d'air (CTA)",
    lot: "CVC",
    fournisseur: "ClimaPro",
    qte: "3 unités",
    commande: null,
    livraisonPrevue: "01/03/2026",
    livraisonReelle: null,
    statut: "Non commandé",
    criticite: "CRITIQUE",
    impact: "Retard CVC zone stérile",
  },
  {
    ref: "APP-002",
    description: "Groupe de production O₂ médical",
    lot: "FLU",
    fournisseur: "MedGaz Djibouti",
    qte: "1 unité",
    commande: "15/11/2025",
    livraisonPrevue: "15/02/2026",
    livraisonReelle: null,
    statut: "Commandé",
    criticite: "CRITIQUE",
    impact: "Bloque mise en service fluides",
  },
  {
    ref: "APP-003",
    description: "TGBT principal 400A",
    lot: "CFO",
    fournisseur: "Schneider Elect.",
    qte: "1 unité",
    commande: "01/10/2025",
    livraisonPrevue: "20/01/2026",
    livraisonReelle: null,
    statut: "En transit",
    criticite: "ÉLEVÉE",
    impact: "Alimentation électrique générale",
  },
  {
    ref: "APP-004",
    description: "Câbles électriques HT/BT",
    lot: "CFO",
    fournisseur: "Nexans",
    qte: "2500 ml",
    commande: "15/09/2025",
    livraisonPrevue: "10/11/2025",
    livraisonReelle: "08/11/2025",
    statut: "Livré",
    criticite: "NORMALE",
    impact: null,
  },
  {
    ref: "APP-005",
    description: "Appareils climatisation VRF",
    lot: "CVC",
    fournisseur: "Daikin",
    qte: "12 unités",
    commande: "01/11/2025",
    livraisonPrevue: "15/03/2026",
    livraisonReelle: null,
    statut: "En fabrication",
    criticite: "ÉLEVÉE",
    impact: "CVC chambres hospitalisation",
  },
  {
    ref: "APP-006",
    description: "Réseau cuivre fluides médicaux",
    lot: "FLU",
    fournisseur: "MedCopper",
    qte: "850 ml",
    commande: "20/11/2025",
    livraisonPrevue: "28/02/2026",
    livraisonReelle: null,
    statut: "Commandé",
    criticite: "CRITIQUE",
    impact: "Distribution O₂/Vide/Air comprimé",
  },
  {
    ref: "APP-007",
    description: "Luminaires LED salles propres",
    lot: "CFO",
    fournisseur: "Osram",
    qte: "180 unités",
    commande: "10/12/2025",
    livraisonPrevue: "30/01/2026",
    livraisonReelle: null,
    statut: "Commandé",
    criticite: "NORMALE",
    impact: null,
  },
  {
    ref: "APP-008",
    description: "Faux plafonds modules 600×600",
    lot: "GC",
    fournisseur: "Saint-Gobain",
    qte: "1200 m²",
    commande: "01/09/2025",
    livraisonPrevue: "15/10/2025",
    livraisonReelle: "12/10/2025",
    statut: "Livré",
    criticite: "NORMALE",
    impact: null,
  },
  {
    ref: "APP-009",
    description: "Centrale vide médical",
    lot: "FLU",
    fournisseur: "Vacumed",
    qte: "1 unité",
    commande: null,
    livraisonPrevue: null,
    livraisonReelle: null,
    statut: "En commande",
    criticite: "CRITIQUE",
    impact: "Aspiration médicale blocs et réa",
  },
  {
    ref: "APP-010",
    description: "Carrelage antidérapant zones humides",
    lot: "GC",
    fournisseur: "Ceramica",
    qte: "650 m²",
    commande: "15/08/2025",
    livraisonPrevue: "20/09/2025",
    livraisonReelle: "18/09/2025",
    statut: "Livré",
    criticite: "NORMALE",
    impact: null,
  },
  {
    ref: "APP-011",
    description: "Portes coupe-feu CF2h",
    lot: "GC",
    fournisseur: "MétalPortes",
    qte: "24 unités",
    commande: "05/12/2025",
    livraisonPrevue: "15/02/2026",
    livraisonReelle: null,
    statut: "Commandé",
    criticite: "NORMALE",
    impact: null,
  },
  {
    ref: "APP-012",
    description: "Baies informatiques 42U",
    lot: "CFO",
    fournisseur: "Rittal",
    qte: "6 unités",
    commande: "10/09/2025",
    livraisonPrevue: "25/10/2025",
    livraisonReelle: "22/10/2025",
    statut: "Livré",
    criticite: "NORMALE",
    impact: null,
  },
]

const chartData = [
  { month: "Août", prévu: 3, réel: 2 },
  { month: "Sep", prévu: 4, réel: 4 },
  { month: "Oct", prévu: 5, réel: 3 },
  { month: "Nov", prévu: 6, réel: 5 },
  { month: "Déc", prévu: 4, réel: 4 },
  { month: "Jan", prévu: 5, réel: 2 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LOT_COLORS: Record<Lot, string> = {
  GC: "bg-stone-100 text-stone-700 border-stone-300",
  CFO: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CVC: "bg-sky-100 text-sky-800 border-sky-300",
  PLB: "bg-teal-100 text-teal-800 border-teal-300",
  FLU: "bg-purple-100 text-purple-800 border-purple-300",
}

const STATUT_VARIANT: Record<Statut, "destructive" | "warning" | "info" | "secondary" | "success" | "outline"> = {
  "Non commandé": "destructive",
  "En commande": "warning",
  "Commandé": "info",
  "En fabrication": "secondary",
  "En transit": "warning",
  "Livré": "success",
  "Bloqué": "destructive",
}

const CRITICITE_STYLE: Record<Criticite, string> = {
  CRITIQUE: "bg-red-100 text-red-800 border border-red-300 font-bold",
  ÉLEVÉE: "bg-orange-100 text-orange-800 border border-orange-300 font-semibold",
  NORMALE: "bg-gray-100 text-gray-600 border border-gray-300",
}

function getRowBg(criticite: Criticite): string {
  if (criticite === "CRITIQUE") return "bg-red-50 hover:bg-red-100"
  if (criticite === "ÉLEVÉE") return "bg-orange-50 hover:bg-orange-100"
  return "hover:bg-gray-50"
}

const LOTS: Array<"all" | Lot> = ["all", "GC", "CFO", "CVC", "PLB", "FLU"]
const STATUTS: Array<"all" | Statut> = [
  "all",
  "Non commandé",
  "En commande",
  "Commandé",
  "En fabrication",
  "En transit",
  "Livré",
  "Bloqué",
]
const CRITICITES: Array<"all" | Criticite> = ["all", "CRITIQUE", "ÉLEVÉE", "NORMALE"]

// ─── New Order Form State ─────────────────────────────────────────────────────

interface NewOrderForm {
  description: string
  lot: Lot | ""
  fournisseur: string
  qte: string
  commande: string
  livraisonPrevue: string
  criticite: Criticite | ""
  impact: string
  notes: string
}

const emptyForm: NewOrderForm = {
  description: "",
  lot: "",
  fournisseur: "",
  qte: "",
  commande: "",
  livraisonPrevue: "",
  criticite: "",
  impact: "",
  notes: "",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApprovisionnementsPage() {
  const [filterLot, setFilterLot] = useState<"all" | Lot>("all")
  const [filterStatut, setFilterStatut] = useState<"all" | Statut>("all")
  const [filterCriticite, setFilterCriticite] = useState<"all" | Criticite>("all")
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<Procurement | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [form, setForm] = useState<NewOrderForm>(emptyForm)

  // Stats
  const total = procurements.length
  const commandes = procurements.filter((p) => p.statut === "Commandé").length
  const enTransit = procurements.filter((p) => p.statut === "En transit").length
  const critiques = procurements.filter((p) => p.criticite === "CRITIQUE").length
  const livres = procurements.filter((p) => p.statut === "Livré").length

  // Filtered rows
  const filtered = procurements.filter((p) => {
    if (filterLot !== "all" && p.lot !== filterLot) return false
    if (filterStatut !== "all" && p.statut !== filterStatut) return false
    if (filterCriticite !== "all" && p.criticite !== filterCriticite) return false
    if (
      search &&
      !p.ref.toLowerCase().includes(search.toLowerCase()) &&
      !p.description.toLowerCase().includes(search.toLowerCase()) &&
      !p.fournisseur.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  function handleFormChange(field: keyof NewOrderForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    // In a real app, this would POST to an API
    setShowNewModal(false)
    setForm(emptyForm)
  }

  return (
    <div className="p-6 space-y-6">
      {/* ─── Red Alert Banner ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
        <span className="font-semibold text-sm">
          4 approvisionnements critiques — Impact planning imminent
        </span>
        <span className="ml-auto text-xs text-red-600 font-medium">
          Action requise
        </span>
      </div>

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvisionnements</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Suivi des commandes et livraisons — Polyclinique Pilot
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowNewModal(true)}
        >
          <Plus className="h-4 w-4" />
          Nouvelle Commande
        </Button>
      </div>

      {/* ─── Stats Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{commandes}</p>
                <p className="text-xs text-gray-500">Commandés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{enTransit}</p>
                <p className="text-xs text-gray-500">En transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{critiques}</p>
                <p className="text-xs text-gray-500">Bloqués / Critiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{livres}</p>
                <p className="text-xs text-gray-500">Livrés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Filter Bar ───────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtres</span>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-8 h-9 text-sm"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Lot */}
            <Select
              value={filterLot}
              onValueChange={(v) => setFilterLot(v as typeof filterLot)}
            >
              <SelectTrigger className="h-9 w-32 text-sm">
                <SelectValue placeholder="Par lot" />
              </SelectTrigger>
              <SelectContent>
                {LOTS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l === "all" ? "Tous les lots" : l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Statut */}
            <Select
              value={filterStatut}
              onValueChange={(v) => setFilterStatut(v as typeof filterStatut)}
            >
              <SelectTrigger className="h-9 w-44 text-sm">
                <SelectValue placeholder="Par statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "Tous les statuts" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Criticité */}
            <Select
              value={filterCriticite}
              onValueChange={(v) => setFilterCriticite(v as typeof filterCriticite)}
            >
              <SelectTrigger className="h-9 w-36 text-sm">
                <SelectValue placeholder="Par criticité" />
              </SelectTrigger>
              <SelectContent>
                {CRITICITES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "Toutes" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset */}
            {(filterLot !== "all" || filterStatut !== "all" || filterCriticite !== "all" || search) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-gray-500"
                onClick={() => {
                  setFilterLot("all")
                  setFilterStatut("all")
                  setFilterCriticite("all")
                  setSearch("")
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}

            <span className="ml-auto text-xs text-gray-400">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ─── Table ────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Liste des approvisionnements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Réf</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 min-w-[200px]">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Lot</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fournisseur</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Qté</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Commande</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Livraison Prévue</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Livraison Réelle</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Statut</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Criticité</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 min-w-[160px]">Impact Planning</th>
                  <th className="px-2 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-10 text-center text-gray-400 text-sm">
                      Aucun approvisionnement trouvé pour ces critères.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.ref}
                      className={`cursor-pointer transition-colors ${getRowBg(item.criticite)}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {item.ref}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {item.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${LOT_COLORS[item.lot]}`}
                        >
                          {item.lot}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {item.fournisseur}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {item.qte}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {item.commande ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {item.livraisonPrevue ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {item.livraisonReelle ? (
                          <span className="text-green-700 font-medium">{item.livraisonReelle}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={STATUT_VARIANT[item.statut]}>
                          {item.statut}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${CRITICITE_STYLE[item.criticite]}`}
                        >
                          {item.criticite}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {item.impact ? (
                          <span className="text-red-700 font-medium">{item.impact}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── BarChart ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Livraisons — Prévu vs Réel (6 derniers mois)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(value) => (
                    <span className="text-gray-600">{value}</span>
                  )}
                />
                <Bar dataKey="prévu" name="Prévu" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="réel" name="Réel" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ─── Detail Modal ─────────────────────────────────────────────────── */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) setSelectedItem(null) }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2 mt-0.5">
                  <Package className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <DialogTitle className="text-lg">
                    {selectedItem.ref} — {selectedItem.description}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5">
                    Détail de l&apos;approvisionnement
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Criticité + Statut */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${CRITICITE_STYLE[selectedItem.criticite]}`}
                >
                  {selectedItem.criticite}
                </span>
                <Badge variant={STATUT_VARIANT[selectedItem.statut]} className="text-sm px-3 py-1">
                  {selectedItem.statut}
                </Badge>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${LOT_COLORS[selectedItem.lot]}`}
                >
                  Lot {selectedItem.lot}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span className="text-gray-400">Fournisseur</span>
                </div>
                <span className="font-medium text-gray-800">{selectedItem.fournisseur}</span>

                <div className="flex items-center gap-2 text-gray-500">
                  <Hash className="h-4 w-4" />
                  <span className="text-gray-400">Quantité</span>
                </div>
                <span className="font-medium text-gray-800">{selectedItem.qte}</span>

                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-gray-400">Date commande</span>
                </div>
                <span className="font-medium text-gray-800">
                  {selectedItem.commande ?? <span className="text-gray-400 italic">Non commandé</span>}
                </span>

                <div className="flex items-center gap-2 text-gray-500">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-gray-400">Livraison prévue</span>
                </div>
                <span className="font-medium text-gray-800">
                  {selectedItem.livraisonPrevue ?? <span className="text-gray-400 italic">—</span>}
                </span>

                <div className="flex items-center gap-2 text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-gray-400">Livraison réelle</span>
                </div>
                <span className={`font-medium ${selectedItem.livraisonReelle ? "text-green-700" : "text-gray-400 italic"}`}>
                  {selectedItem.livraisonReelle ?? "—"}
                </span>
              </div>

              {/* Impact */}
              {selectedItem.impact && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-0.5">Impact Planning</p>
                    <p className="text-sm text-red-800">{selectedItem.impact}</p>
                  </div>
                </div>
              )}

              {/* Documents placeholder */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  Documents associés
                </p>
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                  <Paperclip className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Aucun document attaché pour le moment.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 text-xs" disabled>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Ajouter un document
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
              <Button>Modifier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── New Order Modal ──────────────────────────────────────────────── */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Commande</DialogTitle>
            <DialogDescription>
              Créer un nouvel approvisionnement dans le système de suivi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="new-description">Description *</Label>
              <Input
                id="new-description"
                placeholder="Ex: Groupe électrogène 500 kVA"
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Lot */}
              <div className="space-y-1.5">
                <Label>Lot *</Label>
                <Select
                  value={form.lot}
                  onValueChange={(v) => handleFormChange("lot", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un lot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GC">GC — Gros Œuvre</SelectItem>
                    <SelectItem value="CFO">CFO — Courant Fort</SelectItem>
                    <SelectItem value="CVC">CVC — Climatisation</SelectItem>
                    <SelectItem value="PLB">PLB — Plomberie</SelectItem>
                    <SelectItem value="FLU">FLU — Fluides médicaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Criticité */}
              <div className="space-y-1.5">
                <Label>Criticité *</Label>
                <Select
                  value={form.criticite}
                  onValueChange={(v) => handleFormChange("criticite", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITIQUE">CRITIQUE</SelectItem>
                    <SelectItem value="ÉLEVÉE">ÉLEVÉE</SelectItem>
                    <SelectItem value="NORMALE">NORMALE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fournisseur + Qté */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-fournisseur">Fournisseur *</Label>
                <Input
                  id="new-fournisseur"
                  placeholder="Nom du fournisseur"
                  value={form.fournisseur}
                  onChange={(e) => handleFormChange("fournisseur", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-qte">Quantité *</Label>
                <Input
                  id="new-qte"
                  placeholder="Ex: 4 unités, 500 ml"
                  value={form.qte}
                  onChange={(e) => handleFormChange("qte", e.target.value)}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-commande">Date de commande</Label>
                <Input
                  id="new-commande"
                  placeholder="JJ/MM/AAAA"
                  value={form.commande}
                  onChange={(e) => handleFormChange("commande", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-livraison">Livraison prévue</Label>
                <Input
                  id="new-livraison"
                  placeholder="JJ/MM/AAAA"
                  value={form.livraisonPrevue}
                  onChange={(e) => handleFormChange("livraisonPrevue", e.target.value)}
                />
              </div>
            </div>

            {/* Impact */}
            <div className="space-y-1.5">
              <Label htmlFor="new-impact">Impact Planning</Label>
              <Input
                id="new-impact"
                placeholder="Ex: Bloque mise en service salle bloc A"
                value={form.impact}
                onChange={(e) => handleFormChange("impact", e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="new-notes">Notes / Observations</Label>
              <Textarea
                id="new-notes"
                placeholder="Informations complémentaires, conditions particulières…"
                rows={3}
                value={form.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setForm(emptyForm)}>
                Annuler
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={!form.description || !form.lot || !form.fournisseur || !form.qte || !form.criticite}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Créer la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
