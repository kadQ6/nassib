'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, Clock, AlertTriangle, ListChecks, User, MapPin, Calendar } from 'lucide-react'

const TACHES = [
  {id:'t1',code:'T-001',nom:"Fondations et radier — CE-01",phase:'Gros Œuvre',local:'Général',responsable:'DJI FU SARL',priorite:'Critique',date_fin_prevue:'2025-01-31',avancement:100,statut:'Terminé'},
  {id:'t2',code:'T-002',nom:"Structure béton armé — voiles et poteaux",phase:'Gros Œuvre',local:'Tous niveaux',responsable:'DJI FU SARL',priorite:'Haute',date_fin_prevue:'2025-06-30',avancement:80,statut:'En cours'},
  {id:'t3',code:'T-003',nom:"Maçonnerie et cloisons — Urgences RDC",phase:'Second Œuvre',local:'Box URG 1-4, Déchocage',responsable:'DJI FU SARL',priorite:'Haute',date_fin_prevue:'2025-09-30',avancement:60,statut:'En cours'},
  {id:'t4',code:'T-004',nom:"Revêtements sols — Consultations RDC",phase:'Second Œuvre',local:'Bureau CS 1-4, Dentaire',responsable:'DJI FU SARL',priorite:'Normale',date_fin_prevue:'2026-03-31',avancement:10,statut:'En cours'},
  {id:'t5',code:'T-005',nom:"Câblage électrique CE-02 — RDC",phase:'Lots MEP',local:'Urgences + Consultations RDC',responsable:'DJI FU SARL',priorite:'Haute',date_fin_prevue:'2025-12-31',avancement:20,statut:'En cours'},
  {id:'t6',code:'T-006',nom:"Pose tuyauterie cuivre médicale 460ml — CE-03",phase:'Lots MEP',local:'Box URG 1-4, Bloc Césarienne, Salle Travail',responsable:'DJI FU SARL',priorite:'Critique',date_fin_prevue:'2026-03-31',avancement:15,statut:'En cours'},
  {id:'t7',code:'T-007',nom:"Climatisation — groupes froids et splits CE-03",phase:'Lots MEP',local:'Tous locaux',responsable:'DJI FU SARL',priorite:'Haute',date_fin_prevue:'2026-06-30',avancement:10,statut:'En cours'},
  {id:'t8',code:'T-008',nom:"Grille aluminium 2383ml façades — CE-04",phase:'Divers',local:'Façades',responsable:'DJI FU SARL',priorite:'Normale',date_fin_prevue:'2026-06-30',avancement:10,statut:'En cours'},
  {id:'t9',code:'T-009',nom:"Clôture périmétrique 440ml — CE-04",phase:'Divers',local:'Périmètre',responsable:'DJI FU SARL',priorite:'Basse',date_fin_prevue:'2026-09-30',avancement:0,statut:'Non démarré'},
  {id:'t10',code:'T-010',nom:"Enduits et peintures — Maternité R+1",phase:'Second Œuvre',local:'Chambres Maternité 1-14',responsable:'DJI FU SARL',priorite:'Normale',date_fin_prevue:'2026-06-30',avancement:5,statut:'En cours'},
  {id:'t11',code:'T-011',nom:"Menuiseries portes — Bloc Césarienne",phase:'Second Œuvre',local:'Bloc Césarienne, Salle Réveil',responsable:'DJI FU SARL',priorite:'Critique',date_fin_prevue:'2025-12-31',avancement:20,statut:'En cours'},
  {id:'t12',code:'T-012',nom:"Test pression réseau O₂/vide/air médicaux",phase:'Essais & Réception',local:'Box URG 1-4, Bloc Césarienne',responsable:'DJI FU SARL',priorite:'Critique',date_fin_prevue:'2026-09-30',avancement:0,statut:'Non démarré'},
]

const STATUT_COLORS: Record<string, string> = {
  'Non démarré': 'bg-slate-100 text-slate-500',
  'En cours':    'bg-blue-100 text-blue-700',
  'En retard':   'bg-red-100 text-red-700',
  'Terminé':     'bg-green-100 text-green-700',
}

const PRIORITE_COLORS: Record<string, string> = {
  'Critique': 'bg-red-100 text-red-700',
  'Haute':    'bg-orange-100 text-orange-700',
  'Normale':  'bg-blue-100 text-blue-700',
  'Basse':    'bg-slate-100 text-slate-500',
}

const PRIORITE_BORDER: Record<string, string> = {
  'Critique': 'border-l-red-500',
  'Haute':    'border-l-orange-400',
  'Normale':  'border-l-blue-400',
  'Basse':    'border-l-slate-300',
}

const AVANCEMENT_COLOR = (pct: number) => {
  if (pct === 100) return 'bg-green-500'
  if (pct >= 50) return 'bg-blue-500'
  if (pct > 0) return 'bg-orange-400'
  return 'bg-slate-200'
}

const TABS = ['Toutes', 'En cours', 'En retard', 'Terminé', 'Non démarré'] as const
type Tab = typeof TABS[number]

function StatutBadge({ statut }: { statut: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[statut] ?? 'bg-gray-100 text-gray-600'}`}>
      {statut}
    </span>
  )
}

function PrioriteBadge({ priorite }: { priorite: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITE_COLORS[priorite] ?? 'bg-gray-100 text-gray-600'}`}>
      {priorite}
    </span>
  )
}

function ProgressBar({ pct, statut }: { pct: number; statut: string }) {
  const color = statut === 'En retard' ? 'bg-red-400' : AVANCEMENT_COLOR(pct)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Avancement</span>
        <span className="font-semibold text-slate-600">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function TacheCard({ t }: { t: typeof TACHES[0] }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${PRIORITE_BORDER[t.priorite] ?? 'border-l-slate-200'} p-4 space-y-3 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t.code}</span>
          <PrioriteBadge priorite={t.priorite} />
        </div>
        <StatutBadge statut={t.statut} />
      </div>

      {/* Nom */}
      <h4 className="font-semibold text-slate-800 text-sm leading-snug">{t.nom}</h4>

      {/* Meta */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ListChecks size={12} />
          <span className="text-slate-500 font-medium">{t.phase}</span>
          <span className="text-slate-300">·</span>
          <MapPin size={12} />
          <span>{t.local}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <User size={12} />
          <span>{t.responsable}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar size={12} />
          <span>
            Fin prévue : <span className={`font-medium ${t.statut === 'En retard' ? 'text-red-600' : 'text-slate-600'}`}>
              {new Date(t.date_fin_prevue).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </span>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar pct={t.avancement} statut={t.statut} />
    </div>
  )
}

export default function TachesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Toutes')
  const [search, setSearch] = useState('')
  const [filterPriorite, setFilterPriorite] = useState('Toutes')

  const filtered = useMemo(() => {
    return TACHES.filter(t => {
      const q = search.toLowerCase()
      const matchSearch = !q || t.nom.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.responsable.toLowerCase().includes(q)
      const matchTab = activeTab === 'Toutes' || t.statut === activeTab
      const matchPrio = filterPriorite === 'Toutes' || t.priorite === filterPriorite
      return matchSearch && matchTab && matchPrio
    })
  }, [search, activeTab, filterPriorite])

  const kpis = [
    { label: 'Total tâches', value: 12, icon: ListChecks, color: 'text-slate-700', bg: 'bg-slate-50' },
    { label: 'En cours', value: TACHES.filter(t => t.statut === 'En cours').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'En retard', value: TACHES.filter(t => t.statut === 'En retard').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Terminées', value: TACHES.filter(t => t.statut === 'Terminé').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tâches — Suivi des actions chantier</h1>
        <p className="text-sm text-slate-500 mt-1">Polyclinique Cité Nassib — Avancement par tâche et responsable</p>
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

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-white border border-b-white border-slate-200 -mb-px text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-slate-100 text-slate-600' : 'bg-transparent text-slate-400'
            }`}>
              {tab === 'Toutes' ? TACHES.length : TACHES.filter(t => t.statut === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search + priority filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Rechercher tâche, code, responsable…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterPriorite}
          onChange={e => setFilterPriorite(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {['Toutes', 'Critique', 'Haute', 'Normale', 'Basse'].map(p => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <span className="text-xs text-slate-400 ml-auto">
          {filtered.length} tâche{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Task grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map(t => <TacheCard key={t.id} t={t} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
          Aucune tâche ne correspond aux filtres sélectionnés.
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-medium">Bordure priorité :</span>
        {Object.entries(PRIORITE_BORDER).map(([p, cls]) => (
          <div key={p} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded border-l-4 ${cls} bg-slate-100`} />
            <span className="text-xs text-slate-500">{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
