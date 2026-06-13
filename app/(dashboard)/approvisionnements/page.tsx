"use client"

import { useState } from "react"
import {
  Package,
  AlertTriangle,
  Filter,
  Plus,
  ChevronRight,
  Download,
  X,
  TrendingDown,
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

type AppStatut = "Non commandé" | "En fabrication" | "Commandé" | "En transit" | "Livré" | "Bloqué"
type AppCriticite = "CRITIQUE" | "ÉLEVÉE" | "NORMALE" | "FAIBLE"

interface Appro {
  id: string
  ref: string
  description: string
  lot: string
  fournisseur: string
  qte: string
  dateCommande: string
  livraisonPrevue: string
  livraisonReelle: string
  statut: AppStatut
  criticite: AppCriticite
  impactPlanning: string
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockAppros: Appro[] = [
  {
    id: "1", ref: "APP-001", description: "Centrale de traitement d'air blocs opératoires 22kW",
    lot: "CVC", fournisseur: "CARRIER FRANCE", qte: "1 unité",
    dateCommande: "—", livraisonPrevue: "15/02/2026", livraisonReelle: "—",
    statut: "Non commandé", criticite: "CRITIQUE",
    impactPlanning: "Qualification HVAC blocs bloquée — retard probable 3 mois",
  },
  {
    id: "2", ref: "APP-002", description: "Groupe de production d'O2 médical 200 L/min",
    lot: "FLU", fournisseur: "AIR LIQUIDE SANTÉ", qte: "1 système",
    dateCommande: "15/11/2025", livraisonPrevue: "01/03/2026", livraisonReelle: "—",
    statut: "Commandé", criticite: "CRITIQUE",
    impactPlanning: "Mise en service fluides médicaux conditionnée",
  },
  {
    id: "3", ref: "APP-003", description: "TGBT principal 400A avec jeux de barres",
    lot: "CFO", fournisseur: "SCHNEIDER ELECTRIC", qte: "1 tableau",
    dateCommande: "01/12/2025", livraisonPrevue: "20/01/2026", livraisonReelle: "—",
    statut: "En transit", criticite: "ÉLEVÉE",
    impactPlanning: "Installation électrique générale en attente",
  },
  {
    id: "4", ref: "APP-004", description: "Câbles électriques HT/BT 95mm² et 35mm²",
    lot: "CFO", fournisseur: "NEXANS MAROC", qte: "4500 ml",
    dateCommande: "10/10/2025", livraisonPrevue: "15/11/2025", livraisonReelle: "20/11/2025",
    statut: "Livré", criticite: "NORMALE",
    impactPlanning: "Sans impact",
  },
  {
    id: "5", ref: "APP-005", description: "Appareils de climatisation VRF 2 pipes 70kW",
    lot: "CVC", fournisseur: "DAIKIN FRANCE", qte: "3 groupes",
    dateCommande: "05/12/2025", livraisonPrevue: "28/02/2026", livraisonReelle: "—",
    statut: "En fabrication", criticite: "ÉLEVÉE",
    impactPlanning: "CVC zones hospitalisation retardé",
  },
  {
    id: "6", ref: "APP-006", description: "Réseau cuivre fluides médicaux DN15 à DN50",
    lot: "FLU", fournisseur: "FLUIDEX DJIBOUTI", qte: "850 ml",
    dateCommande: "01/11/2025", livraisonPrevue: "10/01/2026", livraisonReelle: "—",
    statut: "Commandé", criticite: "CRITIQUE",
    impactPlanning: "Distribution O2/Vide bloquée — risque mise en service",
  },
  {
    id: "7", ref: "APP-007", description: "Luminaires LED salles propres étanches IP44",
    lot: "CFO", fournisseur: "ZUMTOBEL GROUP", qte: "280 unités",
    dateCommande: "20/11/2025", livraisonPrevue: "05/02/2026", livraisonReelle: "—",
    statut: "Commandé", criticite: "NORMALE",
    impactPlanning: "Éclairage zones propres retardé si délai non tenu",
  },
  {
    id: "8", ref: "APP-008", description: "Faux plafonds modules 600×600 dalle minérale",
    lot: "GC", fournisseur: "KNAUF PLAFONDS", qte: "3200 m²",
    dateCommande: "05/10/2025", livraisonPrevue: "30/11/2025", livraisonReelle: "08/12/2025",
    statut: "Livré", criticite: "NORMALE",
    impactPlanning: "Sans impact",
  },
  {
    id: "9", ref: "APP-009", description: "Réseau vide médical central 150 m³/h",
    lot: "FLU", fournisseur: "VACUUM TECH", qte: "1 centrale",
    dateCommande: "—", livraisonPrevue: "15/03/2026", livraisonReelle: "—",
    statut: "Non commandé", criticite: "CRITIQUE",
    impactPlanning: "Aspiration chirurgicale et soins intensifs bloqués",
  },
  {
    id: "10", ref: "APP-010", description: "Groupe électrogène 250 KVA soundproofed",
    lot: "CFO", fournisseur: "SDMO KOHLER", qte: "1 groupe",
    dateCommande: "10/12/2025", livraisonPrevue: "15/02/2026", livraisonReelle: "—",
    statut: "En transit", criticite: "ÉLEVÉE",
    impactPlanning: "Alimentation secours non disponible avant livraison",
  },
  {
    id: "11", ref: "APP-011", description: "Portes coupe-feu EI60 et EI120 vitrées",
    lot: "GC", fournisseur: "TORMAX FRANCE", qte: "42 portes",
    dateCommande: "15/11/2025", livraisonPrevue: "10/02/2026", livraisonReelle: "—",
    statut: "Commandé", criticite: "NORMALE",
    impactPlanning: "Compartimentage incendie en attente",
  },
  {
    id: "12", ref: "APP-012", description: "Carrelage grès cérame zones humides 30×30",
    lot: "GC", fournisseur: "CERAMITEC LOCAL", qte: "1800 m²",
    dateCommande: "01/09/2025", livraisonPrevue: "15/10/2025", livraisonReelle: "18/10/2025",
    statut: "Livré", criticite: "FAIBLE",
    impactPlanning: "Sans impact",
  },
]

const deliveryData = [
  { month: "Oct '25", prevu: 3, reel: 2 },
  { month: "Nov '25", prevu: 4, reel: 3 },
  { month: "Déc '25", prevu: 5, reel: 3 },
  { month: "Jan '26", prevu: 6, reel: 2 },
  { month: "Fév '26", prevu: 5, reel: 0 },
  { month: "Mar '26", prevu: 4, reel: 0 },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const statutColors: Record<AppStatut, string> = {
  "Non commandé": "bg-slate-100 text-slate-700",
  "En fabrication": "bg-amber-100 text-amber-700",
  Commandé: "bg-blue-100 text-blue-700",
  "En transit": "bg-purple-100 text-purple-700",
  Livré: "bg-green-100 text-green-700",
  Bloqué: "bg-red-100 text-red-700",
}

const criticiteColors: Record<AppCriticite, string> = {
  CRITIQUE: "bg-red-100 text-red-800",
  ÉLEVÉE: "bg-orange-100 text-orange-800",
  NORMALE: "bg-slate-100 text-slate-700",
  FAIBLE: "bg-green-100 text-green-700",
}

const rowColors: Record<AppCriticite, string> = {
  CRITIQUE: "bg-red-50/40 hover:bg-red-50/60",
  ÉLEVÉE: "bg-orange-50/30 hover:bg-orange-50/50",
  NORMALE: "",
  FAIBLE: "",
}

function StatutBadge({ statut }: { statut: AppStatut }) {
  return <Badge className={`${statutColors[statut]} border-0 text-xs whitespace-nowrap`}>{statut}</Badge>
}

function CriticiteBadge({ criticite }: { criticite: AppCriticite }) {
  return <Badge className={`${criticiteColors[criticite]} border-0 text-xs`}>{criticite}</Badge>
}

// ─── New Order Modal ────────────────────────────────────────────────────────────

function NewOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Commande</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Description *</Label>
            <Textarea placeholder="Désignation complète du matériau ou équipement..." className="mt-1" rows={2} />
          </div>
          <div>
            <Label>Lot</Label>
            <Select>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir un lot" /></SelectTrigger>
              <SelectContent>
                {["GC", "CFO", "CVC", "PLB", "FLU", "MEN", "REV"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fournisseur</Label>
            <Input placeholder="Nom du fournisseur" className="mt-1" />
          </div>
          <div>
            <Label>Quantité</Label>
            <Input placeholder="ex: 500 ml, 3 unités..." className="mt-1" />
          </div>
          <div>
            <Label>Criticité</Label>
            <Select>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Niveau de criticité" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITIQUE">CRITIQUE</SelectItem>
                <SelectItem value="ÉLEVÉE">ÉLEVÉE</SelectItem>
                <SelectItem value="NORMALE">NORMALE</SelectItem>
                <SelectItem value="FAIBLE">FAIBLE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Livraison Prévue</Label>
            <Input type="date" className="mt-1" />
          </div>
          <div>
            <Label>Date Commande</Label>
            <Input type="date" className="mt-1" />
          </div>
          <div className="col-span-2">
            <Label>Impact Planning</Label>
            <Input placeholder="Décrire l'impact sur le planning si retard..." className="mt-1" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={onClose}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Detail Modal ───────────────────────────────────────────────────────────────

function ApproDetailModal({ appro, onClose }: { appro: Appro | null; onClose: () => void }) {
  if (!appro) return null
  return (
    <Dialog open={!!appro} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-slate-500">{appro.ref}</span>
            <StatutBadge statut={appro.statut} />
            <CriticiteBadge criticite={appro.criticite} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-800">{appro.description}</p>

          {appro.criticite === "CRITIQUE" && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">{appro.impactPlanning}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Référence", value: appro.ref },
              { label: "Lot", value: appro.lot },
              { label: "Fournisseur", value: appro.fournisseur },
              { label: "Quantité", value: appro.qte },
              { label: "Date commande", value: appro.dateCommande },
              { label: "Livraison prévue", value: appro.livraisonPrevue },
              { label: "Livraison réelle", value: appro.livraisonReelle || "—" },
              { label: "Statut", value: appro.statut },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Impact Planning</p>
            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3">{appro.impactPlanning}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Documents associés</p>
            <div className="space-y-1.5">
              {["Bon de commande", "Fiche technique", "Accusé de réception"].map((doc) => (
                <div key={doc} className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5">
                  <span className="text-xs text-slate-600">{doc}</span>
                  <Badge variant="outline" className="text-xs">Non joint</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button>Mettre à jour le statut</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ApprovisionnementsPage() {
  const [filterLot, setFilterLot] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterCriticite, setFilterCriticite] = useState("all")
  const [selectedAppro, setSelectedAppro] = useState<Appro | null>(null)
  const [newOrderOpen, setNewOrderOpen] = useState(false)

  const filtered = mockAppros.filter((a) => {
    if (filterLot !== "all" && a.lot !== filterLot) return false
    if (filterStatut !== "all" && a.statut !== filterStatut) return false
    if (filterCriticite !== "all" && a.criticite !== filterCriticite) return false
    return true
  })

  const stats = {
    total: mockAppros.length,
    commandes: mockAppros.filter((a) => ["Commandé", "En fabrication"].includes(a.statut)).length,
    enTransit: mockAppros.filter((a) => a.statut === "En transit").length,
    bloques: mockAppros.filter((a) => a.criticite === "CRITIQUE" && a.statut !== "Livré").length,
    livres: mockAppros.filter((a) => a.statut === "Livré").length,
  }

  const lots = [...new Set(mockAppros.map((a) => a.lot))]
  const hasFilters = filterLot !== "all" || filterStatut !== "all" || filterCriticite !== "all"

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Approvisionnements
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Suivi commandes et livraisons — Polyclinique Cité Nassib</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />Export
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setNewOrderOpen(true)}>
            <Plus className="w-4 h-4" />Nouvelle Commande
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      <div className="flex items-start gap-2 bg-red-50 border border-red-300 rounded-lg p-3">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-800">
            {stats.bloques} approvisionnements critiques — Impact planning imminent
          </p>
          <p className="text-xs text-red-700 mt-0.5">
            CTA Blocs, O2 médical, réseau cuivre FLU, vide médical — Action requise immédiate.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Commandés", value: stats.commandes, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "En transit", value: stats.enTransit, color: "text-purple-700", bg: "bg-purple-50" },
          { label: "Bloqués critiques", value: stats.bloques, color: "text-red-700", bg: "bg-red-50" },
          { label: "Livrés", value: stats.livres, color: "text-green-700", bg: "bg-green-50" },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className={`${bg} border-0 shadow-sm`}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Filter row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="lg:col-span-2 shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Livraisons prévues vs réelles par mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deliveryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }}
                  formatter={(v: number, n: string) => [v, n === "prevu" ? "Prévues" : "Réelles"]}
                />
                <Legend formatter={(v) => <span className="text-xs text-slate-600">{v === "prevu" ? "Prévues" : "Réelles"}</span>} />
                <Bar dataKey="prevu" fill="#93C5FD" radius={[3, 3, 0, 0]} />
                <Bar dataKey="reel" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary card */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Répartition par criticité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["CRITIQUE", "ÉLEVÉE", "NORMALE", "FAIBLE"] as AppCriticite[]).map((c) => {
              const count = mockAppros.filter((a) => a.criticite === c).length
              const pct = Math.round((count / mockAppros.length) * 100)
              const barColors: Record<AppCriticite, string> = {
                CRITIQUE: "bg-red-500",
                ÉLEVÉE: "bg-orange-400",
                NORMALE: "bg-slate-400",
                FAIBLE: "bg-green-400",
              }
              return (
                <div key={c}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{c}</span>
                    <span className="text-xs text-slate-500">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className={`h-1.5 rounded-full ${barColors[c]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        <Select value={filterLot} onValueChange={setFilterLot}>
          <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Lot" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous lots</SelectItem>
            {lots.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatut} onValueChange={setFilterStatut}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {(["Non commandé", "En fabrication", "Commandé", "En transit", "Livré", "Bloqué"] as AppStatut[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCriticite} onValueChange={setFilterCriticite}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Criticité" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes criticités</SelectItem>
            {(["CRITIQUE", "ÉLEVÉE", "NORMALE", "FAIBLE"] as AppCriticite[]).map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <button
            onClick={() => { setFilterLot("all"); setFilterStatut("all"); setFilterCriticite("all") }}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />Effacer
          </button>
        )}
      </div>

      {/* Table */}
      <Card className="shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["Réf", "Description", "Lot", "Fournisseur", "Qté", "Commande", "Livraison Prévue", "Livraison Réelle", "Statut", "Criticité", "Impact Planning", ""].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr
                  key={a.id}
                  className={`border-b border-slate-100 cursor-pointer transition-colors ${rowColors[a.criticite]} ${idx % 2 !== 0 && !rowColors[a.criticite] ? "bg-slate-50/40" : ""}`}
                  onClick={() => setSelectedAppro(a)}
                >
                  <td className="px-3 py-2.5 font-mono text-xs text-slate-500 whitespace-nowrap">{a.ref}</td>
                  <td className="px-3 py-2.5 max-w-[200px]">
                    <p className="text-xs text-slate-700 truncate">{a.description}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{a.lot}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{a.fournisseur}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{a.qte}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">{a.dateCommande}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{a.livraisonPrevue}</td>
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap">
                    <span className={a.livraisonReelle === "—" ? "text-slate-400" : "text-green-600 font-medium"}>{a.livraisonReelle}</span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap"><StatutBadge statut={a.statut} /></td>
                  <td className="px-3 py-2.5 whitespace-nowrap"><CriticiteBadge criticite={a.criticite} /></td>
                  <td className="px-3 py-2.5 max-w-[180px]">
                    <p className="text-xs text-slate-500 truncate">{a.impactPlanning}</p>
                  </td>
                  <td className="px-3 py-2.5"><ChevronRight className="w-4 h-4 text-slate-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">Aucun approvisionnement trouvé.</div>
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-500">
          {filtered.length} approvisionnement{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
        </div>
      </Card>

      <NewOrderModal open={newOrderOpen} onClose={() => setNewOrderOpen(false)} />
      <ApproDetailModal appro={selectedAppro} onClose={() => setSelectedAppro(null)} />
    </div>
  )
}
