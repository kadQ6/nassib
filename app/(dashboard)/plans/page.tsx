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
  // Plans architecturaux réels extraits des plans fournis
  { id: 'p1',  code: 'PL-RDC-URG',  nom: 'Plan RDC — Urgences (Box 1-4, Déchocage, Petit Chir, Infirmerie, Labo, Bureaux)', etage: 'RDC', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 12 },
  { id: 'p2',  code: 'PL-RDC-RAD',  nom: 'Plan RDC — Radiologie (SAS Patient, Salle de radiologie)',                        etage: 'RDC', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 2 },
  { id: 'p3',  code: 'PL-RDC-CS',   nom: 'Plan RDC — Consultations (CS1-4, Dentaire, GYN 1-2)',                             etage: 'RDC', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 7 },
  { id: 'p4',  code: 'PL-RDC-LOG',  nom: 'Plan RDC — Services généraux (Vestiaires H/F, Magasin, Pharmacie)',               etage: 'RDC', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 4 },
  { id: 'p5',  code: 'PL-RDC-ADM',  nom: 'Plan RDC — Administration (Bureaux ADM, Salle attente)',                          etage: 'RDC', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 3 },
  { id: 'p6',  code: 'PL-R01-MAT',  nom: "Plan R+1 — Maternité (Pré-travail, Travail, Bloc César., Réveil, Chambres 1-14, Bibonnerie)", etage: 'R+1', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 22 },
  { id: 'p7',  code: 'PL-R02-MED',  nom: 'Plan R+2 — Médecine (Chambres Med 1-7, Hospit de Jour)',                          etage: 'R+2', type_plan: 'Architectural', version: 'A', date_revision: '2024-10-27', statut: 'En cours', nb_locaux: 8 },
  // Plans techniques MEP
  { id: 'p8',  code: 'PL-MEP-ELEC', nom: 'Plan Électricité CE-02 — Tous niveaux (CFO + CFA + SI)',                          etage: 'Tous', type_plan: 'MEP-CFO', version: 'A', date_revision: '2024-10-27', statut: 'En cours', nb_locaux: 0 },
  { id: 'p9',  code: 'PL-MEP-FLUI', nom: 'Plan Fluides médicaux CE-03 — Réseau O₂ / Vide / Air médical',                   etage: 'Tous', type_plan: 'MEP-GAZ', version: 'A', date_revision: '2024-10-27', statut: 'En cours', nb_locaux: 0 },
  { id: 'p10', code: 'PL-MEP-CVC',  nom: 'Plan CVC et climatisation — CE-03',                                               etage: 'Tous', type_plan: 'MEP-CVC', version: 'A', date_revision: '2024-10-27', statut: 'En cours', nb_locaux: 0 },
  { id: 'p11', code: 'PL-STR-01',   nom: 'Plan Structure — Gros œuvre CE-01',                                               etage: 'RDC',  type_plan: 'Structure',  version: 'A', date_revision: '2024-10-27', statut: 'Validé', nb_locaux: 0 },
  { id: 'p12', code: 'PL-SECU',     nom: 'Plan Sécurité incendie — Détection et évacuation',                                etage: 'Tous', type_plan: 'Sécurité',  version: 'A', date_revision: '2024-10-27', statut: 'En cours', nb_locaux: 0 },
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
        <p className="text-sm text-gray-500 mt-1">12 plans · Données réelles extraites des plans de masse · DJI FU SARL</p>
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
