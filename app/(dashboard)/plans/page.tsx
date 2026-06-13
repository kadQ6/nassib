'use client'

import { useState } from 'react'
import {
  Map,
  FileImage,
  Download,
  Eye,
  CheckCircle,
  Clock,
  CalendarDays,
  Layers,
  FileStack,
} from 'lucide-react'

const PLANS = [
  { id: 'p1', code: 'PL-RDC-01', nom: 'Plan RDC — Général', etage: 'RDC', type_plan: 'Architectural', version: 'B', date_revision: '2024-05-15', statut: 'Validé', nb_locaux: 15 },
  { id: 'p2', code: 'PL-R01-01', nom: 'Plan R+1 — Chirurgie & Bloc', etage: 'R+1', type_plan: 'Architectural', version: 'A', date_revision: '2024-05-15', statut: 'Validé', nb_locaux: 13 },
  { id: 'p3', code: 'PL-R02-01', nom: 'Plan R+2 — Maternité', etage: 'R+2', type_plan: 'Architectural', version: 'A', date_revision: '2024-06-01', statut: 'En cours', nb_locaux: 10 },
  { id: 'p4', code: 'PL-R03-01', nom: 'Plan R+3 — Médecine & Pédiatrie', etage: 'R+3', type_plan: 'Architectural', version: 'A', date_revision: '2024-06-01', statut: 'En cours', nb_locaux: 10 },
  { id: 'p5', code: 'PL-MEP-CFO', nom: 'Plan CFO — Tous niveaux', etage: 'Tous', type_plan: 'MEP-CFO', version: 'A', date_revision: '2024-06-15', statut: 'En cours', nb_locaux: 0 },
  { id: 'p6', code: 'PL-MEP-CFA', nom: 'Plan CFA et Sécurité incendie', etage: 'Tous', type_plan: 'MEP-CFA', version: 'A', date_revision: '2024-06-15', statut: 'En cours', nb_locaux: 0 },
  { id: 'p7', code: 'PL-MEP-GAZ', nom: 'Plan Gaz Médicaux', etage: 'Tous', type_plan: 'MEP-GAZ', version: 'A', date_revision: '2024-07-01', statut: 'En cours', nb_locaux: 0 },
  { id: 'p8', code: 'PL-MEP-CVC', nom: 'Plan CVC et Ventilation', etage: 'Tous', type_plan: 'MEP-CVC', version: 'A', date_revision: '2024-07-01', statut: 'En cours', nb_locaux: 0 },
  { id: 'p9', code: 'PL-STR-01', nom: 'Plan Structure — Fondations', etage: 'RDC', type_plan: 'Structure', version: 'B', date_revision: '2024-04-01', statut: 'Validé', nb_locaux: 0 },
  { id: 'p10', code: 'PL-INCENDIE', nom: "Plan sécurité incendie — évacuation", etage: 'Tous', type_plan: 'Sécurité', version: 'A', date_revision: '2024-08-01', statut: 'En cours', nb_locaux: 0 },
]

const TYPE_COLORS: Record<string, string> = {
  'Architectural': 'bg-blue-100 text-blue-700',
  'MEP-CFO': 'bg-yellow-100 text-yellow-700',
  'MEP-CFA': 'bg-purple-100 text-purple-700',
  'MEP-GAZ': 'bg-cyan-100 text-cyan-700',
  'MEP-CVC': 'bg-sky-100 text-sky-700',
  'Structure': 'bg-stone-100 text-stone-700',
  'Sécurité': 'bg-red-100 text-red-700',
}

const ETAGE_TABS = ['Tous les niveaux', 'RDC', 'R+1', 'R+2', 'R+3', 'Tous']

const TYPE_OPTIONS = ['Tous', 'Architectural', 'MEP-CFO', 'MEP-CFA', 'MEP-GAZ', 'MEP-CVC', 'Structure', 'Sécurité']
const ETAGE_OPTIONS = ['Tous les étages', 'RDC', 'R+1', 'R+2', 'R+3', 'Tous']

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function lastRevision() {
  const dates = PLANS.map(p => p.date_revision).sort().reverse()
  return formatDate(dates[0])
}

export default function PlansPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [etageFilter, setEtageFilter] = useState('Tous les étages')
  const [activeTab, setActiveTab] = useState('Tous les niveaux')

  const nbValides = PLANS.filter(p => p.statut === 'Validé').length
  const nbEnCours = PLANS.filter(p => p.statut === 'En cours').length

  const filtered = PLANS.filter(p => {
    const matchSearch = search === '' ||
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'Tous' || p.type_plan === typeFilter
    const matchEtage = etageFilter === 'Tous les étages' || p.etage === etageFilter
    const matchTab = activeTab === 'Tous les niveaux' || p.etage === activeTab
    return matchSearch && matchType && matchEtage && matchTab
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <p className="text-sm text-gray-500 mt-1">10 plans · Gestion des révisions</p>
        <p className="text-xs text-gray-400 mt-0.5">Polyclinique Cité Nassib — Plans — Gestion documentaire des plans</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Plans validés</p>
            <p className="text-2xl font-bold text-gray-900">{nbValides}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">En cours</p>
            <p className="text-2xl font-bold text-gray-900">{nbEnCours}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Dernière révision</p>
            <p className="text-lg font-bold text-gray-900">{lastRevision()}</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher un plan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {TYPE_OPTIONS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={etageFilter}
          onChange={e => setEtageFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {ETAGE_OPTIONS.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Etage Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {ETAGE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileStack className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucun plan trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(plan => {
            const isMep = plan.type_plan.startsWith('MEP')
            const Icon = isMep ? FileImage : Map
            const typeColor = TYPE_COLORS[plan.type_plan] ?? 'bg-gray-100 text-gray-700'
            const isValide = plan.statut === 'Validé'

            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{plan.code}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isValide ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {isValide ? '✓ Validé' : '↻ En cours'}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{plan.nom}</h3>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Layers className="w-3.5 h-3.5" />
                      {plan.etage}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColor}`}>{plan.type_plan}</span>
                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded font-mono">v{plan.version}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Révision : {formatDate(plan.date_revision)}
                  </p>
                  {plan.nb_locaux > 0 && (
                    <p className="text-xs text-indigo-600 font-medium">
                      {plan.nb_locaux} locaux liés
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-1.5 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    Voir
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg py-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
