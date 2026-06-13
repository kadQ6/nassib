'use client'

import { useState, useMemo } from 'react'
import { Info, Package, ShoppingCart, Truck, CheckCircle, ClipboardList } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const EQUIP = [
  {id:'e1',code:'BIO-BO1-TABLE',nom:"Table d'opération électrohydraulique",categorie:'Bloc Opératoire',local:'Bloc opératoire 1',local_code:'R01-01',marque:'Maquet',modele:'Alphamaxx',quantite:1,prix_unitaire:8500000,statut:'Non commandé',date_livraison_prevue:'2025-08-01',prerequis:'Sol renforcé, prise 400V et O2'},
  {id:'e2',code:'BIO-BO1-SCIAL',nom:'Éclairage scialytique LED',categorie:'Bloc Opératoire',local:'Bloc opératoire 1',local_code:'R01-01',marque:'Trumpf Medical',modele:'iLED 5',quantite:2,prix_unitaire:6200000,statut:'Non commandé',date_livraison_prevue:'2025-08-01',prerequis:'Plafond terminé, accroche fixée'},
  {id:'e3',code:'BIO-BO1-ANES',nom:"Appareil d'anesthésie",categorie:'Anesthésie',local:'Bloc opératoire 1',local_code:'R01-01',marque:'Dräger',modele:'Primus',quantite:1,prix_unitaire:12000000,statut:'Non commandé',date_livraison_prevue:'2025-09-01',prerequis:'O2, vide, air médical, N2O installés'},
  {id:'e4',code:'BIO-BO2-TABLE',nom:"Table d'opération orthopédique",categorie:'Bloc Opératoire',local:'Bloc opératoire 2',local_code:'R01-02',marque:'Maquet',modele:'Beta',quantite:1,prix_unitaire:9200000,statut:'Non commandé',date_livraison_prevue:'2025-09-01',prerequis:'Sol renforcé, prise 400V'},
  {id:'e5',code:'BIO-NEO-INC',nom:'Incubateur néonatologie',categorie:'Néonatologie',local:'Unité néonatologie',local_code:'R02-04',marque:'GE Healthcare',modele:'Giraffe',quantite:6,prix_unitaire:4200000,statut:'Non commandé',date_livraison_prevue:'2025-07-01',prerequis:'Prises UPS et O2, CVC classe ISO 7'},
  {id:'e6',code:'BIO-URG-MON',nom:'Moniteur multiparamétrique',categorie:'Monitoring',local:'Box urgences 1',local_code:'RDC-04',marque:'Mindray',modele:'iMEC-10',quantite:2,prix_unitaire:3500000,statut:'Non commandé',date_livraison_prevue:'2025-07-01',prerequis:'Prises UPS et O2 installées'},
  {id:'e7',code:'BIO-URG-DEF',nom:'Défibrillateur',categorie:'Urgences',local:'Salle de déchocage',local_code:'RDC-06',marque:'Philips',modele:'HeartStart XL+',quantite:1,prix_unitaire:1800000,statut:'Commandé',date_livraison_prevue:'2025-06-01',prerequis:'Aucun'},
  {id:'e8',code:'BIO-SSPI-MON',nom:'Moniteur post-anesthésie',categorie:'Monitoring',local:'SSPI — Salle de réveil',local_code:'R01-03',marque:'Mindray',modele:'BeneVision N17',quantite:4,prix_unitaire:4800000,statut:'Non commandé',date_livraison_prevue:'2025-08-01',prerequis:'O2 et vide installés, prise UPS'},
  {id:'e9',code:'BIO-ACC1-CTG',nom:'Cardiotocographe',categorie:'Obstétrique',local:"Salle d'accouchement 1",local_code:'R02-01',marque:'GE Healthcare',modele:'Corometrics',quantite:1,prix_unitaire:2100000,statut:'Non commandé',date_livraison_prevue:'2025-07-01',prerequis:'Prises électriques installées'},
  {id:'e10',code:'BIO-CH1-LIT',nom:'Lit médicalisé électrique',categorie:'Hospitalisation',local:'Chambre chirurgie 1',local_code:'R01-07',marque:'Hillenbrand',modele:'Progressa',quantite:2,prix_unitaire:850000,statut:'Non commandé',date_livraison_prevue:'2025-06-01',prerequis:'Prise 220V et appel malade'},
  {id:'e11',code:'BIO-RAD-RX',nom:'Appareil radiologie numérique',categorie:'Imagerie',local:'Salle de radiologie',local_code:'RDC-07',marque:'Siemens',modele:'Ysio Max',quantite:1,prix_unitaire:22000000,statut:'Non commandé',date_livraison_prevue:'2025-08-01',prerequis:'Protection plomb, prise 400V, gaine haute tension'},
  {id:'e12',code:'BIO-ECHO',nom:"Échographe",categorie:'Imagerie',local:"Salle d'échographie",local_code:'RDC-08',marque:'Samsung',modele:'HERA W10',quantite:1,prix_unitaire:6500000,statut:'Non commandé',date_livraison_prevue:'2025-07-01',prerequis:'Prise UPS, réseau IP'},
  {id:'e13',code:'BIO-LAB-AUTO',nom:'Automate biochimie',categorie:'Laboratoire',local:'Laboratoire',local_code:'RDC-12',marque:'Roche',modele:'cobas c 311',quantite:1,prix_unitaire:8500000,statut:'Non commandé',date_livraison_prevue:'2025-08-01',prerequis:'Prise 220V, eau déminéralisée, ventilation'},
  {id:'e14',code:'BIO-URG-POMP',nom:'Pousse-seringue électrique',categorie:'Urgences',local:'Box urgences 2',local_code:'RDC-05',marque:'Fresenius Kabi',modele:'Agilia',quantite:4,prix_unitaire:280000,statut:'Commandé',date_livraison_prevue:'2025-05-01',prerequis:'Prises UPS'},
  {id:'e15',code:'BIO-BO1-ELEC',nom:'Bistouri électrique',categorie:'Bloc Opératoire',local:'Bloc opératoire 1',local_code:'R01-01',marque:'Erbe',modele:'VIO 3',quantite:1,prix_unitaire:3200000,statut:'Non commandé',date_livraison_prevue:'2025-08-01',prerequis:'Réseau équipotentiel'},
]

const STATUT_COLORS: Record<string, string> = {
  'Non commandé': 'bg-slate-100 text-slate-600',
  'Commandé':     'bg-blue-100 text-blue-700',
  'Livré':        'bg-purple-100 text-purple-700',
  'Installé':     'bg-yellow-100 text-yellow-700',
  'Validé':       'bg-green-100 text-green-700',
}

const CHART_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316']

function formatDZA(n: number) {
  return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(n)
}

function StatutBadge({ statut }: { statut: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[statut] ?? 'bg-gray-100 text-gray-600'}`}>
      {statut}
    </span>
  )
}

function TooltipPrereq({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-slate-400 hover:text-slate-600"
      >
        <Info size={15} />
      </button>
      {show && (
        <div className="absolute z-50 bottom-6 left-1/2 -translate-x-1/2 w-56 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none">
          <p className="font-semibold mb-1 text-slate-300">Prérequis</p>
          {text}
        </div>
      )}
    </div>
  )
}

export default function EquipementsPage() {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [filterCategorie, setFilterCategorie] = useState('Toutes')
  const [filterEtage, setFilterEtage] = useState('Tous')

  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(EQUIP.map(e => e.categorie)))], [])
  const etages = useMemo(() => {
    const s = new Set(EQUIP.map(e => e.local_code.split('-')[0]))
    return ['Tous', ...Array.from(s)]
  }, [])

  const filtered = useMemo(() => {
    return EQUIP.filter(e => {
      const q = search.toLowerCase()
      const matchSearch = !q || e.nom.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.local.toLowerCase().includes(q)
      const matchStatut = filterStatut === 'Tous' || e.statut === filterStatut
      const matchCat = filterCategorie === 'Toutes' || e.categorie === filterCategorie
      const matchEtage = filterEtage === 'Tous' || e.local_code.startsWith(filterEtage)
      return matchSearch && matchStatut && matchCat && matchEtage
    })
  }, [search, filterStatut, filterCategorie, filterEtage])

  const chartData = useMemo(() => {
    const map: Record<string, number> = {}
    EQUIP.forEach(e => { map[e.categorie] = (map[e.categorie] ?? 0) + 1 })
    return Object.entries(map).map(([cat, count]) => ({ cat, count }))
  }, [])

  const kpis = [
    { label: 'Total équipements', value: 15, icon: Package, color: 'text-slate-700', bg: 'bg-slate-50' },
    { label: 'Non commandé', value: EQUIP.filter(e => e.statut === 'Non commandé').length, icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Commandé', value: EQUIP.filter(e => e.statut === 'Commandé').length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Livré', value: EQUIP.filter(e => e.statut === 'Livré').length, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Validé', value: EQUIP.filter(e => e.statut === 'Validé').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Équipements Biomédicaux</h1>
        <p className="text-sm text-slate-500 mt-1">Polyclinique Cité Nassib — Suivi et traçabilité du matériel médical</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Rechercher équipement, code, local…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {['Tous','Non commandé','Commandé','Livré','Installé','Validé'].map(s => (
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
        <select
          value={filterEtage}
          onChange={e => setFilterEtage(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {etages.map(e => <option key={e}>{e}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-600 mb-4">Répartition par catégorie</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="cat" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(v) => [Number(v ?? 0), 'Équipements'] as [number, string]}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Désignation</th>
                <th className="px-4 py-3 text-left">Local</th>
                <th className="px-4 py-3 text-left">Catégorie</th>
                <th className="px-4 py-3 text-right">Qté</th>
                <th className="px-4 py-3 text-right">Prix total</th>
                <th className="px-4 py-3 text-center">Livraison prévue</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Prérequis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{e.code}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-xs">
                    <div>{e.nom}</div>
                    <div className="text-xs text-slate-400 font-normal">{e.marque} — {e.modele}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    <div>{e.local}</div>
                    <div className="text-xs text-slate-400">{e.local_code}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{e.categorie}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-semibold">{e.quantite}</td>
                  <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap font-semibold">
                    {formatDZA(e.quantite * e.prix_unitaire)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap text-xs">
                    {new Date(e.date_livraison_prevue).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatutBadge statut={e.statut} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TooltipPrereq text={e.prerequis} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                    Aucun équipement ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Prix total footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-8 text-sm">
          <span className="text-slate-500">
            {filtered.length} équipement{filtered.length > 1 ? 's' : ''} sélectionné{filtered.length > 1 ? 's' : ''}
          </span>
          <span className="font-bold text-slate-800">
            Total : {formatDZA(filtered.reduce((s, e) => s + e.quantite * e.prix_unitaire, 0))}
          </span>
        </div>
      </div>
    </div>
  )
}
