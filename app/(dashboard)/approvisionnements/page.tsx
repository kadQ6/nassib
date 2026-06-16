'use client'

import { useState, useMemo } from 'react'
import { Package, CheckCircle, Truck, Clock } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const APPROS = [
  {id:'a1',code:'APPRO-001',designation:'Tuyauterie cuivre médicale 460ml — O₂/vide/air',categorie:'Gaz médicaux',quantite_commandee:460,quantite_recue:90,unite:'ml',prix_unitaire:26620,statut:'Partiellement livré',date_besoin:'2026-03-01',date_livraison_prevue:'2026-02-28',fournisseur:'DJI FU SARL'},
  {id:'a2',code:'APPRO-002',designation:'Vannes de sectionnement gaz médicaux',categorie:'Gaz médicaux',quantite_commandee:140,quantite_recue:0,unite:'u',prix_unitaire:18300,statut:'Commandé',date_besoin:'2026-04-01',date_livraison_prevue:'2026-03-30',fournisseur:'DJI FU SARL'},
  {id:'a3',code:'APPRO-003',designation:'Prises O₂ encastrées (46 prises)',categorie:'Gaz médicaux',quantite_commandee:46,quantite_recue:0,unite:'u',prix_unitaire:0,statut:'Non commandé',date_besoin:'2026-05-01',date_livraison_prevue:null,fournisseur:null},
  {id:'a4',code:'APPRO-004',designation:'Prises vide médical (46 prises)',categorie:'Gaz médicaux',quantite_commandee:46,quantite_recue:0,unite:'u',prix_unitaire:0,statut:'Non commandé',date_besoin:'2026-05-01',date_livraison_prevue:null,fournisseur:null},
  {id:'a5',code:'APPRO-005',designation:'Prises air médical (46 prises)',categorie:'Gaz médicaux',quantite_commandee:46,quantite_recue:0,unite:'u',prix_unitaire:0,statut:'Non commandé',date_besoin:'2026-05-01',date_livraison_prevue:null,fournisseur:null},
  {id:'a6',code:'APPRO-006',designation:'GE 200 kVA — groupe électrogène',categorie:'Électricité',quantite_commandee:1,quantite_recue:0,unite:'u',prix_unitaire:5267000,statut:'Commandé',date_besoin:'2026-03-01',date_livraison_prevue:'2026-02-15',fournisseur:'DJI FU SARL'},
  {id:'a7',code:'APPRO-007',designation:'Onduleur 20 kVA',categorie:'Électricité',quantite_commandee:1,quantite_recue:0,unite:'u',prix_unitaire:7502880,statut:'Non commandé',date_besoin:'2026-06-01',date_livraison_prevue:null,fournisseur:null},
  {id:'a8',code:'APPRO-008',designation:'Grille aluminium façades 2383ml',categorie:'Divers',quantite_commandee:2383,quantite_recue:0,unite:'ml',prix_unitaire:14790,statut:'Commandé',date_besoin:'2026-04-01',date_livraison_prevue:'2026-03-15',fournisseur:'DJI FU SARL'},
  {id:'a9',code:'APPRO-009',designation:'Centrale de bouteilles O₂/vide/air méd.',categorie:'Gaz médicaux',quantite_commandee:1,quantite_recue:0,unite:'fft',prix_unitaire:18572400,statut:'Non commandé',date_besoin:'2026-07-01',date_livraison_prevue:null,fournisseur:null},
  {id:'a10',code:'APPRO-010',designation:'Bandeaux BTDL têtes de lit (46 unités)',categorie:'Gaz médicaux',quantite_commandee:46,quantite_recue:0,unite:'u',prix_unitaire:0,statut:'Non commandé',date_besoin:'2026-06-01',date_livraison_prevue:null,fournisseur:null},
]

const STATUT_COLORS: Record<string, string> = {
  'Non commandé':      'bg-slate-100 text-slate-500',
  'Commandé':          'bg-blue-100 text-blue-700',
  'Partiellement livré': 'bg-orange-100 text-orange-700',
  'Livré':             'bg-green-100 text-green-700',
}

function StatutBadge({ statut }: { statut: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUT_COLORS[statut] ?? 'bg-gray-100 text-gray-600'}`}>
      {statut}
    </span>
  )
}

function ProgressBar({ pct }: { pct: number }) {
  const color = pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-400' : 'bg-slate-200'
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  )
}

export default function ApprovisionnementsPage() {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [filterCategorie, setFilterCategorie] = useState('Toutes')

  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(APPROS.map(a => a.categorie)))], [])

  const filtered = useMemo(() => {
    return APPROS.filter(a => {
      const q = search.toLowerCase()
      const matchSearch = !q || a.designation.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
      const matchStatut = filterStatut === 'Tous' || a.statut === filterStatut
      const matchCat = filterCategorie === 'Toutes' || a.categorie === filterCategorie
      return matchSearch && matchStatut && matchCat
    })
  }, [search, filterStatut, filterCategorie])

  const chartData = useMemo(() => {
    const map: Record<string, { commandee: number; recue: number }> = {}
    APPROS.forEach(a => {
      if (!map[a.categorie]) map[a.categorie] = { commandee: 0, recue: 0 }
      map[a.categorie].commandee += a.quantite_commandee
      map[a.categorie].recue += a.quantite_recue
    })
    return Object.entries(map).map(([cat, v]) => ({ cat, commandee: v.commandee, recue: v.recue }))
  }, [])

  const kpis = [
    { label: 'Total commandes', value: 10, icon: Package, color: 'text-slate-700', bg: 'bg-slate-50' },
    { label: 'Livré', value: APPROS.filter(a => a.statut === 'Livré').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Partiellement livré', value: APPROS.filter(a => a.statut === 'Partiellement livré').length, icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Non commandé', value: APPROS.filter(a => a.statut === 'Non commandé').length, icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
  ]

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Approvisionnements — Suivi des commandes</h1>
        <p className="text-sm text-slate-500 mt-1">Polyclinique Cité Nassib — Matériaux et fournitures chantier</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-xl border border-slate-200 ${k.bg} px-4 py-4 flex items-center gap-3`}>
            <k.icon className={`${k.color} shrink-0`} size={22} />
            <div>
              <p className="text-xs text-slate-500 leading-tight">{k.label}</p>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-600 mb-4">Quantités commandées vs reçues par catégorie</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => v === 'commandee' ? 'Commandée' : 'Reçue'} />
            <Bar dataKey="commandee" name="commandee" fill="#93c5fd" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recue" name="recue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Rechercher désignation, code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {['Tous','Non commandé','Commandé','Partiellement livré','Livré'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterCategorie}
          onChange={e => setFilterCategorie(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} article{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Désignation</th>
                <th className="px-4 py-3 text-left">Catégorie</th>
                <th className="px-4 py-3 text-right">Qté commandée</th>
                <th className="px-4 py-3 text-right">Qté reçue</th>
                <th className="px-4 py-3 text-left w-36">% Livré</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Date besoin</th>
                <th className="px-4 py-3 text-left">Fournisseur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(a => {
                const pct = a.quantite_commandee > 0
                  ? Math.round((a.quantite_recue / a.quantite_commandee) * 100)
                  : 0
                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{a.code}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-xs">
                      <div className="truncate">{a.designation}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{a.categorie}</td>
                    <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap">
                      {a.quantite_commandee.toLocaleString('fr-FR')} {a.unite}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap">
                      {a.quantite_recue.toLocaleString('fr-FR')} {a.unite}
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar pct={pct} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatutBadge statut={a.statut} />
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">
                      {new Date(a.date_besoin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {a.fournisseur ?? <span className="text-slate-300 italic">—</span>}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                    Aucun article ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400">
          {filtered.length} article{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
