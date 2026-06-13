"use client"

import { useState } from "react"
import {
  TrendingUp,
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────

type BoqStatus = "en_cours" | "non_commence" | "termine"
type PaymentStatus = "paye" | "approuve" | "en_verification" | "soumis" | "bloque"
type LotCode =
  | "LOT-GC"
  | "LOT-CFO"
  | "LOT-CVC"
  | "LOT-PLB"
  | "LOT-FLU"
  | "LOT-VRD"
  | "LOT-BIO"

interface BoqItem {
  id: string
  code: string
  description: string
  lot: string
  unit: string
  qtyContract: number
  unitPrice: number
  qtyExecuted: number
  qtyValidated: number
  status: BoqStatus
}

interface PaymentRequest {
  id: string
  number: string
  lot: string
  contractor: string
  period: string
  amountRequested: number
  amountApproved: number | null
  amountPaid: number
  retention: number
  status: PaymentStatus
  submittedAt: string
  paidAt: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const boqItems: BoqItem[] = [
  { id: "1", code: "GC-001", description: "Béton armé fondations et infrastructure", lot: "LOT-GC", unit: "m³", qtyContract: 1200, unitPrice: 45000, qtyExecuted: 820, qtyValidated: 750, status: "en_cours" },
  { id: "2", code: "GC-002", description: "Structure béton armé niveaux RDC à R+1", lot: "LOT-GC", unit: "m³", qtyContract: 980, unitPrice: 52000, qtyExecuted: 540, qtyValidated: 480, status: "en_cours" },
  { id: "3", code: "CFO-001", description: "TGBT principal + tableaux divisionnaires", lot: "LOT-CFO", unit: "ens", qtyContract: 1, unitPrice: 28500000, qtyExecuted: 0, qtyValidated: 0, status: "non_commence" },
  { id: "4", code: "CFO-002", description: "Câblage et distribution électrique tous niveaux", lot: "LOT-CFO", unit: "ml", qtyContract: 8500, unitPrice: 3500, qtyExecuted: 2100, qtyValidated: 1800, status: "en_cours" },
  { id: "5", code: "CVC-001", description: "Centrale de traitement d'air (CTA) + diffusion", lot: "LOT-CVC", unit: "ens", qtyContract: 1, unitPrice: 85000000, qtyExecuted: 0, qtyValidated: 0, status: "non_commence" },
  { id: "6", code: "PLB-001", description: "Réseau plomberie EF/EC distribution", lot: "LOT-PLB", unit: "ml", qtyContract: 1200, unitPrice: 8500, qtyExecuted: 580, qtyValidated: 520, status: "en_cours" },
  { id: "7", code: "FLU-001", description: "Réseau cuivre fluides médicaux O2+Vide+Air", lot: "LOT-FLU", unit: "ens", qtyContract: 1, unitPrice: 38000000, qtyExecuted: 0.2, qtyValidated: 0, status: "en_cours" },
  { id: "8", code: "VRD-001", description: "Voirie, réseaux EU/EP, accès et parkings", lot: "LOT-VRD", unit: "ens", qtyContract: 1, unitPrice: 72000000, qtyExecuted: 0.55, qtyValidated: 0.5, status: "en_cours" },
  { id: "9", code: "BIO-001", description: "Équipements bloc obstétrique et SSPI", lot: "LOT-BIO", unit: "ens", qtyContract: 1, unitPrice: 120000000, qtyExecuted: 0, qtyValidated: 0, status: "non_commence" },
  { id: "10", code: "BIO-002", description: "Équipements néonatologie et urgences", lot: "LOT-BIO", unit: "ens", qtyContract: 1, unitPrice: 80000000, qtyExecuted: 0, qtyValidated: 0, status: "non_commence" },
]

const paymentRequests: PaymentRequest[] = [
  { id: "D001", number: "DC-2025-001", lot: "LOT-GC", contractor: "SETAB Construction", period: "Juin-Août 2025", amountRequested: 45000000, amountApproved: 42000000, amountPaid: 42000000, retention: 5, status: "paye", submittedAt: "2025-09-01", paidAt: "2025-09-20" },
  { id: "D002", number: "DC-2025-002", lot: "LOT-GC", contractor: "SETAB Construction", period: "Sep-Nov 2025", amountRequested: 62000000, amountApproved: 58000000, amountPaid: 58000000, retention: 5, status: "paye", submittedAt: "2025-12-01", paidAt: "2025-12-22" },
  { id: "D003", number: "DC-2026-001", lot: "LOT-CFO", contractor: "ElecPro Djibouti", period: "Jan-Mar 2026", amountRequested: 22000000, amountApproved: 20500000, amountPaid: 0, retention: 5, status: "approuve", submittedAt: "2026-04-01", paidAt: null },
  { id: "D004", number: "DC-2026-002", lot: "LOT-CVC", contractor: "ClimaMed", period: "Jan-Mar 2026", amountRequested: 18000000, amountApproved: null, amountPaid: 0, retention: 5, status: "en_verification", submittedAt: "2026-04-15", paidAt: null },
  { id: "D005", number: "DC-2026-003", lot: "LOT-PLB", contractor: "AquaMed", period: "Fév-Avr 2026", amountRequested: 15500000, amountApproved: null, amountPaid: 0, retention: 5, status: "soumis", submittedAt: "2026-05-01", paidAt: null },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const BUDGET_TOTAL = 850000000

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNum = (n: number) =>
  Math.round(n).toLocaleString("fr-FR").replace(/,/g, " ")

function lotBadgeClass(lot: string): string {
  const map: Record<string, string> = {
    "LOT-GC": "bg-orange-100 text-orange-800 border-orange-200",
    "LOT-CFO": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "LOT-CVC": "bg-blue-100 text-blue-800 border-blue-200",
    "LOT-PLB": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "LOT-FLU": "bg-purple-100 text-purple-800 border-purple-200",
    "LOT-VRD": "bg-green-100 text-green-800 border-green-200",
    "LOT-BIO": "bg-red-100 text-red-800 border-red-200",
  }
  return map[lot] ?? "bg-slate-100 text-slate-700 border-slate-200"
}

function boqStatusBadge(status: BoqStatus): { label: string; cls: string } {
  const map: Record<BoqStatus, { label: string; cls: string }> = {
    en_cours: { label: "En cours", cls: "bg-blue-100 text-blue-800 border-blue-200" },
    non_commence: { label: "Non commencé", cls: "bg-slate-100 text-slate-600 border-slate-200" },
    termine: { label: "Terminé", cls: "bg-green-100 text-green-800 border-green-200" },
  }
  return map[status]
}

function paymentStatusBadge(status: PaymentStatus): { label: string; cls: string } {
  const map: Record<PaymentStatus, { label: string; cls: string }> = {
    paye: { label: "Payé", cls: "bg-green-100 text-green-800 border-green-200" },
    approuve: { label: "Approuvé", cls: "bg-blue-100 text-blue-800 border-blue-200" },
    en_verification: { label: "En vérification", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    soumis: { label: "Soumis", cls: "bg-slate-100 text-slate-600 border-slate-200" },
    bloque: { label: "Bloqué", cls: "bg-red-100 text-red-800 border-red-200" },
  }
  return map[status]
}

// ─── Pie chart colors by lot ──────────────────────────────────────────────────

const LOT_PIE_COLORS: Record<string, string> = {
  "LOT-GC": "#f97316",
  "LOT-CFO": "#eab308",
  "LOT-CVC": "#3b82f6",
  "LOT-PLB": "#06b6d4",
  "LOT-FLU": "#a855f7",
  "LOT-VRD": "#22c55e",
  "LOT-BIO": "#ef4444",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("boq")

  // ── KPI calculations ──
  const montantContractuel = boqItems.reduce(
    (sum, item) => sum + item.qtyContract * item.unitPrice,
    0
  )

  const montantExecute = boqItems.reduce(
    (sum, item) => sum + item.qtyExecuted * item.unitPrice,
    0
  )

  const montantPaye = paymentRequests.reduce(
    (sum, d) => sum + d.amountPaid,
    0
  )

  const pctExecute =
    montantContractuel > 0
      ? Math.min(100, Math.round((montantExecute / montantContractuel) * 100))
      : 0

  const pctPaye =
    BUDGET_TOTAL > 0
      ? Math.min(100, Math.round((montantPaye / BUDGET_TOTAL) * 100))
      : 0

  // ── BOQ totals ──
  const totalQtyContract = boqItems.reduce((s, i) => s + i.qtyContract, 0)
  const totalMontantContrat = montantContractuel
  const totalMontantExecute = montantExecute

  // ── Pie chart data (budget breakdown by lot) ──
  const lotGroups: Record<string, number> = {}
  boqItems.forEach((item) => {
    const lot = item.lot
    lotGroups[lot] = (lotGroups[lot] ?? 0) + item.qtyContract * item.unitPrice
  })
  const pieData = Object.entries(lotGroups).map(([lot, value]) => ({
    name: lot,
    value,
  }))

  // ── Monthly payments bar chart mock data ──
  const monthlyPayments = [
    { mois: "Jan 26", paye: 0, approuve: 20500000, soumis: 0 },
    { mois: "Fév 26", paye: 0, approuve: 0, soumis: 15500000 },
    { mois: "Mar 26", paye: 0, approuve: 0, soumis: 0 },
    { mois: "Avr 26", paye: 0, approuve: 0, soumis: 0 },
    { mois: "Mai 26", paye: 0, approuve: 0, soumis: 0 },
    { mois: "Jun 26", paye: 0, approuve: 0, soumis: 0 },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Budget & BOQ</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Polyclinique Cité Nassib · Suivi financier et décomptes
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Budget Total */}
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Budget Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 truncate">
                  {formatNum(BUDGET_TOTAL)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">DJF</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Montant Contractuel */}
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Montant Contractuel</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 truncate">
                  {formatNum(montantContractuel)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">DJF · BOQ global</p>
              </div>
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consommé (exécuté) */}
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Consommé (exécuté)</p>
                <p className="text-2xl font-bold text-amber-700 mt-1 truncate">
                  {formatNum(montantExecute)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">DJF · {pctExecute}% du contractuel</p>
              </div>
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Avancement financier</span>
                <span className="font-semibold text-amber-700">{pctExecute}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${pctExecute}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payé */}
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Payé</p>
                <p className="text-2xl font-bold text-green-700 mt-1 truncate">
                  {formatNum(montantPaye)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">DJF · {pctPaye}% du budget</p>
              </div>
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Décaissements</span>
                <span className="font-semibold text-green-700">{pctPaye}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${pctPaye}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="boq">BOQ</TabsTrigger>
          <TabsTrigger value="decomptes">Décomptes</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════════════
            BOQ TAB
        ══════════════════════════════════════════════════════ */}
        <TabsContent value="boq">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Bordereau du Quantitatif — Détail par poste
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Code</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 min-w-[220px]">Description</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Lot</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Unité</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Qté Contrat</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">PU (DJF)</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Montant Contrat</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Qté Exécutée</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Montant Exécuté</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 min-w-[110px]">% Réal.</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boqItems.map((item) => {
                      const montantContrat = item.qtyContract * item.unitPrice
                      const montantExec = item.qtyExecuted * item.unitPrice
                      const pctReal =
                        montantContrat > 0
                          ? Math.min(100, Math.round((montantExec / montantContrat) * 100))
                          : 0
                      const statusInfo = boqStatusBadge(item.status)
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="px-3 py-2.5 text-slate-700 font-medium">
                            {item.description}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${lotBadgeClass(item.lot)}`}
                            >
                              {item.lot}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap text-center">
                            {item.unit}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap font-mono">
                            {formatNum(item.qtyContract)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap font-mono">
                            {formatNum(item.unitPrice)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-800 whitespace-nowrap font-mono font-semibold">
                            {formatNum(montantContrat)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap font-mono">
                            {item.unit === "ens" ? item.qtyExecuted.toFixed(2) : formatNum(item.qtyExecuted)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-amber-700 whitespace-nowrap font-mono font-semibold">
                            {formatNum(montantExec)}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[60px]">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    pctReal >= 80
                                      ? "bg-green-500"
                                      : pctReal >= 40
                                      ? "bg-amber-500"
                                      : "bg-slate-300"
                                  }`}
                                  style={{ width: `${pctReal}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-600 w-8 text-right font-medium">
                                {pctReal}%
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${statusInfo.cls}`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {/* ── Totals row ── */}
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-50">
                      <td colSpan={4} className="px-3 py-3 font-bold text-slate-800 text-xs">
                        TOTAL
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-slate-800 font-mono text-xs whitespace-nowrap">
                        —
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-slate-800 font-mono text-xs whitespace-nowrap">
                        —
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-slate-900 font-mono text-xs whitespace-nowrap">
                        {formatNum(totalMontantContrat)}
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-slate-800 font-mono text-xs whitespace-nowrap">
                        —
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-amber-700 font-mono text-xs whitespace-nowrap">
                        {formatNum(totalMontantExecute)}
                      </td>
                      <td colSpan={2} className="px-3 py-3 text-xs text-slate-500">
                        {Math.round((totalMontantExecute / totalMontantContrat) * 100)}% global
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════
            DÉCOMPTES TAB
        ══════════════════════════════════════════════════════ */}
        <TabsContent value="decomptes">
          <div className="space-y-4">
            {/* Workflow banner */}
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium flex-wrap">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="font-semibold mr-1">Flux de validation :</span>
              {[
                "Déclaré",
                "Vérifié",
                "Approuvé MOA",
                "Autorisé",
                "Payé",
              ].map((step, idx, arr) => (
                <span key={step} className="flex items-center gap-1">
                  <span className="bg-blue-100 text-blue-700 border border-blue-300 rounded px-2 py-0.5">
                    {step}
                  </span>
                  {idx < arr.length - 1 && (
                    <ChevronDown className="w-3 h-3 rotate-[-90deg] text-blue-400" />
                  )}
                </span>
              ))}
            </div>

            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Décomptes entrepreneurs — {paymentRequests.length} décomptes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">N° Décompte</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Lot</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Entreprise</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Période</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Montant Demandé</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Approuvé</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Payé</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Retenue (5%)</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRequests.map((d) => {
                        const retention = d.amountApproved != null
                          ? d.amountApproved * (d.retention / 100)
                          : d.amountRequested * (d.retention / 100)
                        const statusInfo = paymentStatusBadge(d.status)
                        return (
                          <tr
                            key={d.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold whitespace-nowrap">
                              {d.number}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${lotBadgeClass(d.lot)}`}
                              >
                                {d.lot}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                              {d.contractor}
                            </td>
                            <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">
                              {d.period}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-800 font-semibold whitespace-nowrap">
                              {formatNum(d.amountRequested)}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap">
                              {d.amountApproved != null ? (
                                <span className="text-blue-700 font-semibold">
                                  {formatNum(d.amountApproved)}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap">
                              {d.amountPaid > 0 ? (
                                <span className="text-green-700 font-semibold">
                                  {formatNum(d.amountPaid)}
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-600 whitespace-nowrap">
                              {formatNum(retention)}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${statusInfo.cls}`}
                              >
                                {statusInfo.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-300 bg-slate-50">
                        <td colSpan={4} className="px-3 py-3 font-bold text-slate-800 text-xs">
                          TOTAL
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-slate-900 font-mono text-xs whitespace-nowrap">
                          {formatNum(paymentRequests.reduce((s, d) => s + d.amountRequested, 0))}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-blue-700 font-mono text-xs whitespace-nowrap">
                          {formatNum(
                            paymentRequests.reduce(
                              (s, d) => s + (d.amountApproved ?? 0),
                              0
                            )
                          )}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-green-700 font-mono text-xs whitespace-nowrap">
                          {formatNum(montantPaye)}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════
            PAIEMENTS TAB
        ══════════════════════════════════════════════════════ */}
        <TabsContent value="paiements">
          <div className="space-y-4">
            {/* Timeline of paid payments */}
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Historique des paiements effectués
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {paymentRequests.filter((d) => d.status === "paye").length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Aucun paiement effectué.</p>
                ) : (
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
                    <div className="space-y-4">
                      {paymentRequests
                        .filter((d) => d.status === "paye")
                        .map((d) => (
                          <div key={d.id} className="relative">
                            <div className="absolute -left-4 top-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <span className="font-semibold text-sm text-slate-800">
                                    {d.number}
                                  </span>
                                  <span className="ml-2 text-xs text-slate-500">
                                    {d.contractor} · {d.period}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-green-700 font-mono">
                                    {formatNum(d.amountPaid)} DJF
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${lotBadgeClass(d.lot)}`}
                                  >
                                    {d.lot}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Soumis le {d.submittedAt}
                                </span>
                                {d.paidAt && (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Payé le {d.paidAt}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Pending payments */}
                {paymentRequests.filter((d) => d.status !== "paye").length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                      Décomptes en cours de traitement
                    </h3>
                    <div className="space-y-2">
                      {paymentRequests
                        .filter((d) => d.status !== "paye")
                        .map((d) => {
                          const statusInfo = paymentStatusBadge(d.status)
                          return (
                            <div
                              key={d.id}
                              className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg"
                            >
                              <div>
                                <span className="font-semibold text-xs text-slate-800">
                                  {d.number}
                                </span>
                                <span className="ml-2 text-xs text-slate-500">
                                  {d.contractor}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-slate-700 font-semibold">
                                  {formatNum(d.amountRequested)} DJF
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${statusInfo.cls}`}
                                >
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Monthly payments bar chart */}
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardHeader className="px-4 pt-4 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-800">
                    Paiements mensuels (Jan–Jun 2026)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={monthlyPayments}
                      margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="mois"
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v: number) =>
                          v >= 1000000 ? `${v / 1000000}M` : `${v}`
                        }
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `${formatNum(value)} DJF`,
                        ]}
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      />
                      <Bar dataKey="paye" name="Payé" fill="#22c55e" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="approuve" name="Approuvé" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="soumis" name="Soumis" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget breakdown pie chart */}
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardHeader className="px-4 pt-4 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-800">
                    Répartition budgétaire par lot
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center gap-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={LOT_PIE_COLORS[entry.name] ?? "#94a3b8"}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `${formatNum(value)} DJF`,
                            "Montant contrat",
                          ]}
                          contentStyle={{
                            fontSize: 12,
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 w-full">
                      {pieData.map((entry) => {
                        const pctSlice = Math.round(
                          (entry.value / montantContractuel) * 100
                        )
                        return (
                          <div
                            key={entry.name}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                              style={{
                                backgroundColor:
                                  LOT_PIE_COLORS[entry.name] ?? "#94a3b8",
                              }}
                            />
                            <span className="text-slate-600 flex-1 truncate">
                              {entry.name}
                            </span>
                            <span className="text-slate-500 font-medium">
                              {pctSlice}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════
            VARIATIONS TAB
        ══════════════════════════════════════════════════════ */}
        <TabsContent value="variations">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-700">
                  Aucun ordre de service enregistré
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md">
                  Les ordres de service (OS) et avenants au marché seront listés ici.
                  Toute variation de budget contractuel fait l&apos;objet d&apos;un OS approuvé
                  par le maître d&apos;ouvrage avant prise en compte dans le BOQ.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 max-w-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Les variations de quantités supérieures à 10% du montant contractuel
                  nécessitent un avenant signé des deux parties.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
