'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { ChevronDown, ChevronRight, DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react'

// ── Données réelles BOQ — Polyclinique Cité Nassib
// Entreprise : DJI FU SARL — Date BOQ : 27 octobre 2024

const LOTS = [
  {
    id: 'l1',
    code: 'CE-01',
    nom: 'Gros et second œuvre',
    type_lot: 'GC',
    montant_total: 359251239,
    montant_paye: 120000000,
    avancement: 45,
    statut: 'En cours',
  },
  {
    id: 'l2',
    code: 'CE-02',
    nom: 'Électricité — courant faible — sécurité incendie',
    type_lot: 'ÉLEC',
    montant_total: 82511410,
    montant_paye: 0,
    avancement: 20,
    statut: 'En cours',
  },
  {
    id: 'l3',
    code: 'CE-03',
    nom: 'Fluides — climatisations',
    type_lot: 'FLUIDES',
    montant_total: 115553060,
    montant_paye: 0,
    avancement: 15,
    statut: 'En cours',
  },
  {
    id: 'l4',
    code: 'CE-04',
    nom: 'Divers',
    type_lot: 'DIVERS',
    montant_total: 87486288,
    montant_paye: 0,
    avancement: 10,
    statut: 'En cours',
  },
]

const LOT_LIGNES: Record<string, { designation: string; unite: string; quantite: number; pu: number }[]> = {
  l1: [
    { designation: 'Gros et second œuvre (lot global)',         unite: 'fft', quantite: 1,   pu: 359251239 },
  ],
  l2: [
    { designation: 'Groupe électrogène GE 200 kVA',            unite: 'u',   quantite: 1,   pu: 5267000   },
    { designation: 'Armoires électriques',                      unite: 'fft', quantite: 1,   pu: 18057000  },
    { designation: 'Distribution courant fort',                 unite: 'fft', quantite: 1,   pu: 6567940   },
    { designation: 'Installations terminales',                  unite: 'fft', quantite: 1,   pu: 11741770  },
    { designation: 'Lustrerie et éclairage',                    unite: 'fft', quantite: 1,   pu: 12034420  },
    { designation: 'Matériels divers (MAT)',                    unite: 'fft', quantite: 1,   pu: 1795840   },
    { designation: 'Téléphonie et informatique',                unite: 'fft', quantite: 1,   pu: 6384280   },
    { designation: 'Vidéosurveillance (CCTV)',                  unite: 'fft', quantite: 1,   pu: 5505220   },
    { designation: 'Détection incendie',                        unite: 'fft', quantite: 1,   pu: 7655060   },
    { designation: 'Onduleur 20 kVA',                          unite: 'u',   quantite: 1,   pu: 7502880   },
  ],
  l3: [
    { designation: 'Climatisation (groupes froids + splits)',   unite: 'fft', quantite: 1,   pu: 28255800  },
    { designation: 'Centrale de bouteilles O₂/vide/air méd.',  unite: 'fft', quantite: 1,   pu: 18572400  },
    { designation: 'Bandeaux BTDL (têtes de lit)',             unite: 'u',   quantite: 46,  pu: 0         },
    { designation: 'Prises O₂ encastrées',                     unite: 'u',   quantite: 46,  pu: 0         },
    { designation: 'Prises vide médical',                      unite: 'u',   quantite: 46,  pu: 0         },
    { designation: 'Prises air médical',                       unite: 'u',   quantite: 46,  pu: 0         },
    { designation: 'Tuyauterie cuivre médicale',               unite: 'ml',  quantite: 460, pu: 26620     },
    { designation: 'Vannes de sectionnement',                  unite: 'u',   quantite: 140, pu: 18300     },
    { designation: 'Plomberie et sanitaires (reste lot)',       unite: 'fft', quantite: 1,   pu: 53931860  },
  ],
  l4: [
    { designation: 'Grille aluminium',                         unite: 'ml',  quantite: 2383, pu: 14790    },
    { designation: 'Auvent de façade',                         unite: 'm²',  quantite: 82,   pu: 51750    },
    { designation: 'Clôture périmétrique',                     unite: 'ml',  quantite: 440,  pu: 63300    },
    { designation: 'Portail motorisé',                         unite: 'u',   quantite: 2,    pu: 1293795  },
    { designation: 'Divers travaux (reste lot)',               unite: 'fft', quantite: 1,    pu: 14294608 },
  ],
}

const TYPE_COLORS: Record<string, string> = {
  'GC':      'bg-stone-100 text-stone-700',
  'ÉLEC':    'bg-yellow-100 text-yellow-700',
  'FLUIDES': 'bg-cyan-100 text-cyan-700',
  'DIVERS':  'bg-purple-100 text-purple-700',
}

const PIE_COLORS = ['#78716c', '#eab308', '#06b6d4', '#a855f7']

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-DJ', { maximumFractionDigits: 0 }).format(v) + ' FDJ'

const BUDGET_TOTAL   = 644801997
const PAYE_TOTAL     = 120000000
const RESTE          = BUDGET_TOTAL - PAYE_TOTAL
const AVANCEMENT_GLB = 30

export default function BOQPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) =>
    setExpanded(prev => (prev === id ? null : id))

  const barData = LOTS.map(l => ({ name: l.code, avancement: l.avancement }))
  const pieData  = LOTS.map(l => ({ name: l.code, value: l.montant_total }))

  const kpis = [
    { label: 'Budget total HT',    value: fmt(BUDGET_TOTAL),    sub: '4 corps d\'état',        icon: DollarSign, color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Acomptes versés',    value: fmt(PAYE_TOTAL),      sub: '18,6 % du marché',       icon: CreditCard, color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Reste à payer',      value: fmt(RESTE),           sub: '81,4 % du marché',       icon: TrendingUp, color: 'text-amber-600',  bg: 'bg-amber-50'  },
    { label: 'Avancement global',  value: `${AVANCEMENT_GLB}%`, sub: 'Tous corps d\'état',     icon: Activity,   color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BOQ — Bordereau des prix</h1>
          <p className="text-sm text-gray-500 mt-1">
            Polyclinique Cité Nassib · DJI FU SARL · 27 octobre 2024 · Total HT : {fmt(BUDGET_TOTAL)}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full self-start mt-1">
          4 corps d&apos;état
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
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Avancement par corps d&apos;état (%)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
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
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Répartition du budget</h2>
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
              <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Montant HT'] as [string, string]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Détail des corps d&apos;état — cliquez pour voir les postes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Désignation</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Montant HT (FDJ)</th>
                <th className="px-4 py-3 text-right">Acomptes</th>
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
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                        <span className="flex items-center gap-1">
                          {isOpen
                            ? <ChevronDown className="w-3 h-3 shrink-0" />
                            : <ChevronRight className="w-3 h-3 shrink-0" />}
                          {lot.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{lot.nom}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[lot.type_lot] ?? 'bg-gray-100 text-gray-700'}`}>
                          {lot.type_lot}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmt(lot.montant_total)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-green-700">{fmt(lot.montant_paye)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-amber-700">{fmt(reste)}</td>
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

                    {isOpen && (
                      <tr key={`${lot.id}-exp`}>
                        <td colSpan={8} className="bg-blue-50/50 px-6 py-4">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                            Postes BOQ — {lot.nom}
                          </p>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-500 border-b border-blue-100">
                                <th className="text-left pb-1 pr-4 font-medium">Désignation</th>
                                <th className="text-center pb-1 pr-4 font-medium">Unité</th>
                                <th className="text-right pb-1 pr-4 font-medium">Qté</th>
                                <th className="text-right pb-1 pr-4 font-medium">P.U. (FDJ)</th>
                                <th className="text-right pb-1 font-medium">Total (FDJ)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lignes.map((lg, idx) => (
                                <tr key={idx} className="border-b border-blue-50 last:border-0">
                                  <td className="py-1.5 pr-4 text-gray-700">{lg.designation}</td>
                                  <td className="py-1.5 pr-4 text-center text-gray-500">{lg.unite}</td>
                                  <td className="py-1.5 pr-4 text-right text-gray-600">
                                    {new Intl.NumberFormat('fr-DJ').format(lg.quantite)}
                                  </td>
                                  <td className="py-1.5 pr-4 text-right text-gray-600">
                                    {lg.pu > 0 ? new Intl.NumberFormat('fr-DJ').format(lg.pu) : '—'}
                                  </td>
                                  <td className="py-1.5 text-right font-semibold text-gray-800">
                                    {lg.pu > 0
                                      ? new Intl.NumberFormat('fr-DJ', { maximumFractionDigits: 0 }).format(lg.quantite * lg.pu)
                                      : '(inclus)'}
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

              {/* Total row */}
              <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                <td className="px-4 py-3 text-xs text-gray-700 font-bold" colSpan={3}>TOTAL HT — DJI FU SARL</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-blue-700">{fmt(BUDGET_TOTAL)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-green-700">{fmt(PAYE_TOTAL)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-amber-700">{fmt(RESTE)}</td>
                <td className="px-4 py-3" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
