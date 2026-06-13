'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  Search,
  Filter,
  Zap,
  Wifi,
  Flame,
  Wind,
  Droplets,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutGrid,
} from 'lucide-react'
import { Local, LocalStatut } from '@/lib/types'
import { STATUTS_LOCAL, progressColor } from '@/lib/constants'

// ─── Hardcoded Data ────────────────────────────────────────────────────────────

const LOCAUX: Local[] = [
  {
    id: 'l1', code: 'RDC-01', nom: "Hall d'accueil", etage: 'RDC', surface: 120,
    departement: 'Administration', service: 'Accueil', type_local: 'Accueil',
    nb_prises_cfo: 8, nb_prises_rj45: 4,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: false,
    statut: 'En cours', avancement: 60,
    created_at: '2025-01-01',
  },
  {
    id: 'l2', code: 'RDC-04', nom: 'Box urgences 1', etage: 'RDC', surface: 18,
    departement: 'Urgences', service: 'Urgences', type_local: 'Box soins',
    nb_prises_cfo: 10, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 45,
    created_at: '2025-01-01',
  },
  {
    id: 'l3', code: 'RDC-06', nom: 'Salle de déchocage', etage: 'RDC', surface: 30,
    departement: 'Urgences', service: 'Urgences', type_local: 'Salle soins',
    nb_prises_cfo: 16, nb_prises_rj45: 4,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 35,
    role_fonctionnel: 'Prise en charge urgences vitales',
    created_at: '2025-01-01',
  },
  {
    id: 'l4', code: 'RDC-10', nom: 'Consultation générale 2', etage: 'RDC', surface: 16,
    departement: 'Médecine', service: 'Consultation', type_local: 'Bureau médical',
    nb_prises_cfo: 8, nb_prises_rj45: 3,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: true,
    statut: 'Terminé', avancement: 100,
    created_at: '2025-01-01',
  },
  {
    id: 'l5', code: 'R01-01', nom: 'Bloc opératoire 1', etage: 'R+1', surface: 55,
    departement: 'Chirurgie', service: 'Bloc Opératoire', type_local: 'Salle opération',
    nb_prises_cfo: 32, nb_prises_rj45: 8,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 30,
    role_fonctionnel: 'Chirurgie générale et viscérale',
    created_at: '2025-01-01',
  },
  {
    id: 'l6', code: 'R01-02', nom: 'Bloc opératoire 2', etage: 'R+1', surface: 55,
    departement: 'Chirurgie', service: 'Bloc Opératoire', type_local: 'Salle opération',
    nb_prises_cfo: 32, nb_prises_rj45: 8,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 10,
    created_at: '2025-01-01',
  },
  {
    id: 'l7', code: 'R01-03', nom: 'SSPI — Salle de réveil', etage: 'R+1', surface: 40,
    departement: 'Chirurgie', service: 'Bloc Opératoire', type_local: 'Salle soins',
    nb_prises_cfo: 20, nb_prises_rj45: 6,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 15,
    created_at: '2025-01-01',
  },
  {
    id: 'l8', code: 'R02-01', nom: "Salle d'accouchement 1", etage: 'R+2', surface: 30,
    departement: 'Maternité', service: 'Obstétrique', type_local: 'Salle accouchement',
    nb_prises_cfo: 14, nb_prises_rj45: 4,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 40,
    role_fonctionnel: 'Accouchement naturel et assistance',
    created_at: '2025-01-01',
  },
  {
    id: 'l9', code: 'R02-04', nom: 'Unité néonatologie', etage: 'R+2', surface: 35,
    departement: 'Maternité', service: 'Néonatologie', type_local: 'Salle soins',
    nb_prises_cfo: 20, nb_prises_rj45: 6,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 10,
    created_at: '2025-01-01',
  },
  {
    id: 'l10', code: 'R03-04', nom: 'Chambre médecine 2', etage: 'R+3', surface: 22,
    departement: 'Médecine', service: 'Hospitalisation', type_local: 'Chambre',
    nb_prises_cfo: 10, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'Terminé', avancement: 100,
    created_at: '2025-01-01',
  },
  {
    id: 'l11', code: 'R03-08', nom: 'Bureau médecin chef', etage: 'R+3', surface: 18,
    departement: 'Administration', service: 'Direction', type_local: 'Bureau',
    nb_prises_cfo: 6, nb_prises_rj45: 3,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: false,
    statut: 'Terminé', avancement: 100,
    created_at: '2025-01-01',
  },
  {
    id: 'l12', code: 'R01-07', nom: 'Chambre chirurgie 1', etage: 'R+1', surface: 22,
    departement: 'Chirurgie', service: 'Hospitalisation', type_local: 'Chambre',
    nb_prises_cfo: 12, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 55,
    created_at: '2025-01-01',
  },
  {
    id: 'l13', code: 'R02-05', nom: 'Chambre maternité 1', etage: 'R+2', surface: 22,
    departement: 'Maternité', service: 'Hospitalisation', type_local: 'Chambre',
    nb_prises_cfo: 12, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 50,
    created_at: '2025-01-01',
  },
  {
    id: 'l14', code: 'RDC-07', nom: 'Salle de radiologie', etage: 'RDC', surface: 40,
    departement: 'Radiologie', service: 'Radiologie', type_local: 'Salle technique',
    nb_prises_cfo: 12, nb_prises_rj45: 4,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: false,
    statut: 'En attente', avancement: 20,
    created_at: '2025-01-01',
  },
  {
    id: 'l15', code: 'RDC-12', nom: 'Laboratoire', etage: 'RDC', surface: 40,
    departement: 'Laboratoire', service: 'Biologie', type_local: 'Laboratoire',
    nb_prises_cfo: 14, nb_prises_rj45: 6,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 10,
    created_at: '2025-01-01',
  },
]

// ─── Derived filter options ───────────────────────────────────────────────────

const ETAGES = [...new Set(LOCAUX.map(l => l.etage))].sort()
const DEPARTEMENTS = [...new Set(LOCAUX.map(l => l.departement).filter(Boolean))].sort() as string[]
const STATUTS: LocalStatut[] = ['En attente', 'En cours', 'Terminé', 'Bloqué', 'Réceptionné']

// ─── LocalCard ────────────────────────────────────────────────────────────────

function LocalCard({ local }: { local: Local }) {
  const statut = STATUTS_LOCAL[local.statut] ?? { color: 'text-slate-600', bg: 'bg-slate-100' }
  const bar = progressColor(local.avancement)

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {local.code}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statut.bg} ${statut.color}`}>
            {local.statut}
          </span>
        </div>
        {local.surface != null && (
          <span className="text-xs text-slate-400 whitespace-nowrap">{local.surface} m²</span>
        )}
      </div>

      {/* Departement */}
      {local.departement && (
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{local.departement}</p>
      )}

      {/* Name + role */}
      <div>
        <h3 className="font-semibold text-slate-900 leading-snug">{local.nom}</h3>
        {local.role_fonctionnel && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{local.role_fonctionnel}</p>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Avancement</span>
          <span className="text-xs font-semibold text-slate-700">{local.avancement}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${bar} transition-all`}
            style={{ width: `${local.avancement}%` }}
          />
        </div>
      </div>

      {/* Icon row */}
      <div className="flex items-center gap-3 text-slate-400 text-xs">
        <span className="flex items-center gap-1" title="Prises CFO">
          <Zap size={13} className="text-yellow-500" />
          {local.nb_prises_cfo}
        </span>
        <span className="flex items-center gap-1" title="Prises RJ45">
          <Wifi size={13} className="text-blue-500" />
          {local.nb_prises_rj45}
        </span>
        {local.has_gaz_medicaux && (
          <span className="flex items-center gap-1 text-cyan-600" title="Gaz médicaux">
            <Flame size={13} />
            Gaz
          </span>
        )}
        {local.has_cvc && (
          <span className="flex items-center gap-1 text-sky-500" title="CVC">
            <Wind size={13} />
            CVC
          </span>
        )}
        {local.has_plomberie && (
          <span className="flex items-center gap-1 text-teal-500" title="Plomberie">
            <Droplets size={13} />
            PLB
          </span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/locaux/${local.id}`}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
      >
        Voir le local
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LocaluxPage() {
  const [search, setSearch] = useState('')
  const [filterEtage, setFilterEtage] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterStatut, setFilterStatut] = useState('')

  const filtered = useMemo(() => {
    return LOCAUX.filter(l => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        l.nom.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.departement?.toLowerCase().includes(q) ?? false) ||
        (l.service?.toLowerCase().includes(q) ?? false)
      const matchEtage = !filterEtage || l.etage === filterEtage
      const matchDept = !filterDept || l.departement === filterDept
      const matchStatut = !filterStatut || l.statut === filterStatut
      return matchSearch && matchEtage && matchDept && matchStatut
    })
  }, [search, filterEtage, filterDept, filterStatut])

  const nbTermines = LOCAUX.filter(l => l.statut === 'Terminé').length
  const nbEnCours = LOCAUX.filter(l => l.statut === 'En cours').length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={22} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Locaux — Pilotage local par local</h1>
            </div>
            <p className="text-sm text-slate-500">45 locaux · unité centrale de pilotage</p>
          </div>
        </div>

        {/* ── KPI bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard
            icon={<LayoutGrid size={18} className="text-slate-500" />}
            label="Total locaux"
            value="45"
            sub="dans la polyclinique"
            color="border-l-slate-400"
          />
          <KpiCard
            icon={<CheckCircle2 size={18} className="text-green-500" />}
            label="Terminés"
            value="3"
            sub="réceptionnés"
            color="border-l-green-400"
          />
          <KpiCard
            icon={<Clock size={18} className="text-blue-500" />}
            label="En cours"
            value="20"
            sub="travaux actifs"
            color="border-l-blue-400"
          />
          <KpiCard
            icon={<AlertCircle size={18} className="text-orange-500" />}
            label="Réserves ouvertes"
            value="6"
            sub="à lever"
            color="border-l-orange-400"
          />
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un local, code, département…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
            {/* Etage */}
            <div className="relative">
              <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterEtage}
                onChange={e => setFilterEtage(e.target.value)}
                className="pl-7 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Tous les étages</option>
                {ETAGES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            {/* Departement */}
            <div className="relative">
              <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterDept}
                onChange={e => setFilterDept(e.target.value)}
                className="pl-7 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Tous les départements</option>
                {DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Statut */}
            <div className="relative">
              <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterStatut}
                onChange={e => setFilterStatut(e.target.value)}
                className="pl-7 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Tous les statuts</option>
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* Result count */}
          <p className="text-xs text-slate-400 mt-3">
            {filtered.length} local{filtered.length !== 1 ? 'aux' : ''} affiché{filtered.length !== 1 ? 's' : ''}
            {filtered.length !== LOCAUX.length ? ` sur ${LOCAUX.length}` : ''}
          </p>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(local => (
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucun local ne correspond aux filtres sélectionnés</p>
            <button
              onClick={() => { setSearch(''); setFilterEtage(''); setFilterDept(''); setFilterStatut('') }}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

function KpiCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  color?: string
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${color ?? 'border-l-slate-300'} p-4 flex items-start gap-3`}>
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-none mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
