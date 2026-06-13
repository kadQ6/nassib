'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { ChevronDown, ChevronRight, DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react'

const LOTS = [
  { id: 'l1',  code: 'LOT-01', nom: 'Gros Œuvre et Maçonnerie',    type_lot: 'GC',            montant_total: 280000000, montant_paye: 243000000, avancement: 65, statut: 'En cours'   },
  { id: 'l2',  code: 'LOT-02', nom: 'Courant Fort (CFO)',           type_lot: 'CFO',           montant_total:  85000000, montant_paye:  21500000, avancement: 40, statut: 'En cours'   },
  { id: 'l3',  code: 'LOT-03', nom: 'Courant Faible (CFA)',         type_lot: 'CFA',           montant_total:  45000000, montant_paye:         0, avancement: 30, statut: 'En cours'   },
  { id: 'l4',  code: 'LOT-04', nom: 'Réseau VDI/IP',               type_lot: 'VDI',           montant_total:  25000000, montant_paye:         0, avancement: 25, statut: 'En cours'   },
  { id: 'l5',  code: 'LOT-05', nom: 'Gaz Médicaux',                type_lot: 'GAZ',           montant_total:  65000000, montant_paye:         0, avancement: 20, statut: 'En cours'   },
  { id: 'l6',  code: 'LOT-06', nom: 'Plomberie et Sanitaires',      type_lot: 'PLOMBERIE',     montant_total:  38000000, montant_paye:         0, avancement: 35, statut: 'En cours'   },
  { id: 'l7',  code: 'LOT-07', nom: 'CVC et Ventilation',          type_lot: 'CVC',           montant_total:  72000000, montant_paye:         0, avancement: 25, statut: 'En cours'   },
  { id: 'l8',  code: 'LOT-08', nom: 'Équipements Biomédicaux',     type_lot: 'BIOMÉDICAL',    montant_total: 180000000, montant_paye:         0, avancement: 15, statut: 'En cours'   },
  { id: 'l9',  code: 'LOT-09', nom: 'Mobilier Médical',            type_lot: 'MOBILIER',      montant_total:  35000000, montant_paye:         0, avancement: 10, statut: 'En attente' },
  { id: 'l10', code: 'LOT-10', nom: 'Menuiserie et Revêtements',   type_lot: 'SECOND_OEUVRE', montant_total:  25000000, montant_paye:         0, avancement: 50, statut: 'En cours'   },
]

const LOT_LIGNES: Record<string, { designation: string; unite: string; quantite: number; pu: number }[]> = {
  l1: [
    { designation: 'Béton armé fondations',          unite: 'm³', quantite: 1200, pu:  45000 },
    { designation: 'Maçonnerie briques creuses',      unite: 'm²', quantite: 3500, pu:   8500 },
    { designation: 'Enduits ciment intérieur',        unite: 'm²', quantite: 6000, pu:   4200 },
    { designation: 'Dalle béton armé',               unite: 'm³', quantite:  850, pu:  52000 },
  ],
  l2: [
    { designation: 'Tableau général BT TGBT',         unite: 'u',  quantite:    1, pu: 4200000 },
    { designation: 'Câble cuivre 3×35 mm²',           unite: 'ml', quantite:  800, pu:   3500 },
    { designation: 'Luminaires LED médicaux',          unite: 'u',  quantite:  320, pu:  18000 },
    { designation: 'Prises 220 V médicales',           unite: 'u',  quantite:  600, pu:   4500 },
  ],
  l3: [
    { designation: 'Centrale incendie adressable',    unite: 'u',  quantite:    1, pu: 8500000 },
    { designation: 'Détecteurs ioniques',             unite: 'u',  quantite:  180, pu:  12000 },
    { designation: 'Caméra IP dôme',                 unite: 'u',  quantite:   45, pu:  35000 },
    { designation: 'Contrôle accès badge',            unite: 'u',  quantite:   22, pu:  95000 },
  ],
  l4: [
    { designation: 'Switch manageable 24 ports',      unite: 'u',  quantite:   12, pu: 180000 },
    { designation: 'Câble F/UTP Cat6A',               unite: 'ml', quantite: 4500, pu:    850 },
    { designation: 'Prise RJ45 encastrée',            unite: 'u',  quantite:  380, pu:   3200 },
    { designation: 'Baie de brassage 42U',            unite: 'u',  quantite:    4, pu:  95000 },
  ],
  l5: [
    { designation: 'Centrale O2 liquide 5 000 L',    unite: 'u',  quantite:    1, pu: 18000000 },
    { designation: 'Tuyauterie cuivre médicale DN22', unite: 'ml', quantite: 1200, pu:   8500 },
    { designation: 'Prise murale O2 encastrée',       unite: 'u',  quantite:  180, pu:  12000 },
    { designation: 'Centrale vide médical',           unite: 'u',  quantite:    1, pu: 9500000 },
  ],
  l6: [
    { designation: 'Colonne montante eau froide',     unite: 'ml', quantite:  120, pu:  18000 },
    { designation: 'Lavabos inox médicaux',           unite: 'u',  quantite:   85, pu:  35000 },
    { designation: 'WC suspendu complet',             unite: 'u',  quantite:   40, pu:  45000 },
    { designation: 'Robinetterie médicale col-de-cygne', unite: 'u', quantite: 85, pu:  22000 },
  ],
  l7: [
    { designation: 'Groupe froid 150 kW',             unite: 'u',  quantite:    2, pu: 12000000 },
    { designation: 'CTA double flux 10 000 m³/h',    unite: 'u',  quantite:    3, pu:  8500000 },
    { designation: 'Split cassette 18 000 BTU',       unite: 'u',  quantite:   18, pu:   185000 },
    { designation: 'Gaine galvanisée DN400',          unite: 'ml', quantite:  350, pu:   12000 },
  ],
  l8: [
    { designation: 'Scanner 64 coupes',               unite: 'u',  quantite:    1, pu: 85000000 },
    { designation: 'Table opératoire électrique',     unite: 'u',  quantite:    4, pu:  3500000 },
    { designation: 'Moniteur multiparamétrique',      unite: 'u',  quantite:   20, pu:   850000 },
    { designation: 'Respirateur réanimation',         unite: 'u',  quantite:    6, pu:  2200000 },
  ],
  l9: [
    { designation: 'Lit médicalisé électrique',       unite: 'u',  quantite:   80, pu:   185000 },
    { designation: 'Table de chevet inox',            unite: 'u',  quantite:   80, pu:    45000 },
    { designation: 'Chariot soins infirmiers',        unite: 'u',  quantite:   12, pu:    95000 },
    { designation: 'Fauteuil de consultation',        unite: 'u',  quantite:   24, pu:    35000 },
  ],
  l10: [
    { designation: 'Carrelage grès cérame sol 60×60', unite: 'm²', quantite: 2800, pu:   3500 },
    { designation: 'Faïence murale 30×60',            unite: 'm²', quantite: 1200, pu:   2800 },
    { designation: 'Porte coupe-feu EI30',            unite: 'u',  quantite:   35, pu:  95000 },
    { designation: 'Faux plafond dalle 60×60',        unite: 'm²', quantite: 3200, pu:   1800 },
  ],
}

const TYPE_COLORS: Record<string, string> = {
  'GC':            'bg-stone-100 text-stone-700',
  'CFO':           'bg-yellow-100 text-yellow-700',
  'CFA':           'bg-purple-100 text-purple-700',
  'VDI':           'bg-blue-100 text-blue-700',
  'GAZ':           'bg-cyan-100 text-cyan-700',
  'PLOMBERIE':     'bg-teal-100 text-teal-700',
  'CVC':           'bg-sky-100 text-sky-700',
  'BIOMÉDICAL':    'bg-green-100 text-green-700',
  'MOBILIER':      'bg-pink-100 text-pink-700',
  'SECOND_OEUVRE': 'bg-orange-100 text-orange-700',
}

const PIE_COLORS = [
  '#78716c','#eab308','#a855f7','#3b82f6','#06b6d4',
  '#14b8a6','#0ea5e9','#22c55e','#ec4899','#f97316',
]

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 0 }).format(v) + ' DZA'

const BUDGET_TOTAL    = 850000000
const PAYE_TOTAL      = 264500000
const RESTE           = BUDGET_TOTAL - PAYE_TOTAL
const AVANCEMENT_GLB  = 42

export default function BOQPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) =>
    setExpanded(prev => (prev === id ? null : id))

  const barData = LOTS.map(l => ({ name: l.code, avancement: l.avancement }))
  const pieData  = LOTS.map(l => ({ name: l.code, value: l.montant_total }))

  const kpis = [
    { label: 'Budget total',      value: fmt(BUDGET_TOTAL),    sub: '10 lots',            icon: DollarSign, color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Montant payé',      value: fmt(PAYE_TOTAL),      sub: '31,1 % du budget',   icon: CreditCard, color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Reste à payer',     value: fmt(RESTE),           sub: '68,9 % du budget',   icon: TrendingUp, color: 'text-amber-600',  bg: 'bg-amber-50'  },
    { label: 'Avancement global', value: `${AVANCEMENT_GLB}%`, sub: 'Tous lots confondus', icon: Activity,   color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BOQ — Budget / Quantités de travaux</h1>
          <p className="text-sm text-gray-500 mt-1">
            Polyclinique Cité Nassib · Budget total : {fmt(BUDGET_TOTAL)}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full self-start mt-1">
          Juin 2026
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
            <div className={`p-2 rounded-lg ${k.bg} shrink-0`}>
              <k.icon className={`w-5 h-5 ${k.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{k.label}</p>
              <p className={`text-base font-bold ${k.color} truncate`}>{k.value}</p>
              <p className="text-xs text-gray-400">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Avancement par lot (%)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip formatter={(v) => [`${Number(v ?? 0)} %`, 'Avancement'] as [string, string]} />
              <Bar dataKey="avancement" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Répartition du budget par lot</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="45%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Montant'] as [string, string]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Détail des lots — cliquez pour voir les lignes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Désignation</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Montant total</th>
                <th className="px-4 py-3 text-right">Payé</th>
                <th className="px-4 py-3 text-right">Reste</th>
                <th className="px-4 py-3 text-center w-40">Avancement</th>
                <th className="px-4 py-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {LOTS.map(lot => {
                const isOpen = expanded === lot.id
                const reste  = lot.montant_total - lot.montant_paye
                const lignes = LOT_LIGNES[lot.id] ?? []
                return (
                  <>
                    <tr
                      key={lot.id}
                      onClick={() => toggle(lot.id)}
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {/* Code */}
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                        <span className="flex items-center gap-1">
                          {isOpen
                            ? <ChevronDown className="w-3 h-3 shrink-0" />
                            : <ChevronRight className="w-3 h-3 shrink-0" />}
                          {lot.code}
                        </span>
                      </td>
                      {/* Désignation */}
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{lot.nom}</td>
                      {/* Type */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[lot.type_lot] ?? 'bg-gray-100 text-gray-700'}`}>
                          {lot.type_lot}
                        </span>
                      </td>
                      {/* Montant total */}
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmt(lot.montant_total)}</td>
                      {/* Payé */}
                      <td className="px-4 py-3 text-right font-mono text-xs text-green-700">{fmt(lot.montant_paye)}</td>
                      {/* Reste */}
                      <td className="px-4 py-3 text-right font-mono text-xs text-amber-700">{fmt(reste)}</td>
                      {/* Avancement */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${lot.avancement >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${lot.avancement}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 w-8 text-right shrink-0">{lot.avancement}%</span>
                        </div>
                      </td>
                      {/* Statut */}
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lot.statut === 'En cours'
                            ? 'bg-blue-100 text-blue-700'
                            : lot.statut === 'En attente'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lot.statut}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded lignes */}
                    {isOpen && (
                      <tr key={`${lot.id}-exp`}>
                        <td colSpan={8} className="bg-blue-50/50 px-6 py-4">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                            Lignes BOQ — {lot.nom}
                          </p>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-500 border-b border-blue-100">
                                <th className="text-left pb-1 pr-4 font-medium">Désignation</th>
                                <th className="text-center pb-1 pr-4 font-medium">Unité</th>
                                <th className="text-right pb-1 pr-4 font-medium">Quantité</th>
                                <th className="text-right pb-1 pr-4 font-medium">P.U. (DZA)</th>
                                <th className="text-right pb-1 font-medium">Total (DZA)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lignes.map((lg, idx) => (
                                <tr key={idx} className="border-b border-blue-50 last:border-0">
                                  <td className="py-1.5 pr-4 text-gray-700">{lg.designation}</td>
                                  <td className="py-1.5 pr-4 text-center text-gray-500">{lg.unite}</td>
                                  <td className="py-1.5 pr-4 text-right text-gray-600">
                                    {new Intl.NumberFormat('fr-DZ').format(lg.quantite)}
                                  </td>
                                  <td className="py-1.5 pr-4 text-right text-gray-600">
                                    {new Intl.NumberFormat('fr-DZ').format(lg.pu)}
                                  </td>
                                  <td className="py-1.5 text-right font-semibold text-gray-800">
                                    {new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 0 }).format(lg.quantite * lg.pu)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
