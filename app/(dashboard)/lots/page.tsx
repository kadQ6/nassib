'use client'

import { useState } from 'react'
import {
  RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { ChevronDown, ChevronRight, Briefcase, TrendingUp, Activity } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const LOTS = [
  {
    id: 'lt1', code: 'LT-CFO', nom: 'Courant Fort Hospitalier',   type_lot: 'CFO',
    montant_marche: 85000000, avancement: 40, statut: 'En cours',
    entreprise: 'ElecMed Algérie', date_debut: '2024-09-01', date_fin_prevue: '2025-06-30',
  },
  {
    id: 'lt2', code: 'LT-CFA', nom: 'Courant Faible et Sécurité', type_lot: 'CFA',
    montant_marche: 45000000, avancement: 30, statut: 'En cours',
    entreprise: 'ElecMed Algérie', date_debut: '2024-10-01', date_fin_prevue: '2025-07-31',
  },
  {
    id: 'lt3', code: 'LT-VDI', nom: 'Réseau VDI et Informatique', type_lot: 'VDI',
    montant_marche: 25000000, avancement: 20, statut: 'En cours',
    entreprise: 'Réseau Data', date_debut: '2024-11-01', date_fin_prevue: '2025-07-31',
  },
  {
    id: 'lt4', code: 'LT-GAZ', nom: 'Gaz Médicaux',              type_lot: 'GAZ',
    montant_marche: 65000000, avancement: 20, statut: 'En cours',
    entreprise: 'FluidMed Algérie', date_debut: '2024-10-01', date_fin_prevue: '2025-08-31',
  },
  {
    id: 'lt5', code: 'LT-PLOMB', nom: 'Plomberie et Sanitaires',  type_lot: 'PLOMBERIE',
    montant_marche: 38000000, avancement: 35, statut: 'En cours',
    entreprise: 'FluidMed Algérie', date_debut: '2024-09-01', date_fin_prevue: '2025-05-31',
  },
  {
    id: 'lt6', code: 'LT-CVC', nom: 'CVC et Traitement Air',     type_lot: 'CVC',
    montant_marche: 72000000, avancement: 25, statut: 'En cours',
    entreprise: 'CVC Pro', date_debut: '2024-10-01', date_fin_prevue: '2025-08-31',
  },
]

const LOT_LOCAUX: Record<string, string[]> = {
  lt1: ['Bloc opératoire N°1', 'Salle de réveil', 'Réanimation adultes', 'Urgences (box)', 'Local TGBT RDC'],
  lt2: ['Centrale incendie – local technique', 'Couloir RDC (détecteurs)', 'Hall entrée (CCTV)', 'Salle serveurs', 'Parking (contrôle accès)'],
  lt3: ['Salle serveurs principal', 'Accueil patients', 'Consultation N°1', 'Consultation N°2', 'Bureau direction'],
  lt4: ['Bloc opératoire N°1', 'SSPI (salle réveil)', 'Réanimation adultes', 'Maternité', 'Urgences (box)'],
  lt5: ['Bloc opératoire N°1', 'Salle de réveil', 'Cuisine centrale', 'Sanitaires RDC', 'Buanderie'],
  lt6: ['Bloc opératoire N°1 (salle blanche)', 'SSPI', 'Réanimation adultes', 'Consultation N°1', 'Hall principal'],
}

const LOT_CHECKLIST: Record<string, { label: string; done: boolean }[]> = {
  lt1: [
    { label: 'Étude d\'exécution validée', done: true  },
    { label: 'Câblage TGBT terminé',       done: true  },
    { label: 'Essais et mise en service',  done: false },
  ],
  lt2: [
    { label: 'Plan câblage CFA approuvé',  done: true  },
    { label: 'Pose détecteurs (60%)',       done: false },
    { label: 'Paramétrage centrale',        done: false },
  ],
  lt3: [
    { label: 'Schéma réseau validé',        done: true  },
    { label: 'Tirage câbles Cat6A (40%)',   done: false },
    { label: 'Tests de connectivité',       done: false },
  ],
  lt4: [
    { label: 'Plan réseau gaz approuvé',   done: true  },
    { label: 'Pose tuyauterie cuivre (20%)',done: false },
    { label: 'Essais pression réseau',      done: false },
  ],
  lt5: [
    { label: 'Plan plomberie visé',         done: true  },
    { label: 'Colonnes montantes posées',   done: true  },
    { label: 'Appareils sanitaires (10%)',  done: false },
  ],
  lt6: [
    { label: 'Étude thermique approuvée',  done: true  },
    { label: 'Gaines posées (30%)',         done: false },
    { label: 'Mise en service groupes',     done: false },
  ],
}

const TYPE_COLORS: Record<string, string> = {
  CFO:      'bg-yellow-100 text-yellow-700',
  CFA:      'bg-purple-100 text-purple-700',
  VDI:      'bg-blue-100 text-blue-700',
  GAZ:      'bg-cyan-100 text-cyan-700',
  PLOMBERIE:'bg-teal-100 text-teal-700',
  CVC:      'bg-sky-100 text-sky-700',
}

const RADIAL_COLORS = ['#eab308','#a855f7','#3b82f6','#06b6d4','#14b8a6','#0ea5e9']

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 0 }).format(v) + ' DZA'

// ── Component ─────────────────────────────────────────────────────────────────

export default function LotsPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) =>
    setExpanded(prev => (prev === id ? null : id))

  const totalMarches     = LOTS.reduce((s, l) => s + l.montant_marche, 0)
  const avgAvancement    = Math.round(LOTS.reduce((s, l) => s + l.avancement, 0) / LOTS.length)
  const lotsEnCours      = LOTS.filter(l => l.statut === 'En cours').length

  const radialData = LOTS.map((l, i) => ({
    name:       l.code,
    avancement: l.avancement,
    fill:       RADIAL_COLORS[i % RADIAL_COLORS.length],
  }))

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lots Techniques</h1>
          <p className="text-sm text-gray-500 mt-1">Polyclinique Cité Nassib · 6 lots techniques actifs</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full self-start mt-1">
          Juin 2026
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-blue-50 shrink-0">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total marchés</p>
            <p className="text-lg font-bold text-blue-600">{fmt(totalMarches)}</p>
            <p className="text-xs text-gray-400">6 lots techniques</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-purple-50 shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avancement global</p>
            <p className="text-lg font-bold text-purple-600">{avgAvancement}%</p>
            <p className="text-xs text-gray-400">Moyenne pondérée</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-green-50 shrink-0">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Lots en cours</p>
            <p className="text-lg font-bold text-green-600">{lotsEnCours} / {LOTS.length}</p>
            <p className="text-xs text-gray-400">Tous actifs</p>
          </div>
        </div>
      </div>

      {/* ── Main content: cards + radial chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lot Cards (2/3) */}
        <div className="lg:col-span-2 space-y-3">
          {LOTS.map(lot => {
            const isOpen   = expanded === lot.id
            const locaux   = LOT_LOCAUX[lot.id] ?? []
            const checks   = LOT_CHECKLIST[lot.id] ?? []
            const doneCount = checks.filter(c => c.done).length

            return (
              <div key={lot.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Card header */}
                <button
                  onClick={() => toggle(lot.id)}
                  className="w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {isOpen
                        ? <ChevronDown  className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-gray-500">{lot.code}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[lot.type_lot] ?? 'bg-gray-100 text-gray-700'}`}>
                            {lot.type_lot}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {lot.statut}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 mt-0.5 truncate">{lot.nom}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {lot.entreprise} · {new Date(lot.date_debut).toLocaleDateString('fr-FR')} → {new Date(lot.date_fin_prevue).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Marché</p>
                      <p className="font-bold text-gray-800 text-sm">{fmt(lot.montant_marche)}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${lot.avancement}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-blue-600 shrink-0">{lot.avancement}%</span>
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/60 grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Locaux */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Locaux concernés ({locaux.length})
                      </p>
                      <ul className="space-y-1">
                        {locaux.map((lc, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            {lc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Checklist */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Avancement tâches ({doneCount}/{checks.length})
                      </p>
                      <ul className="space-y-2">
                        {checks.map((c, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              c.done
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300 bg-white'
                            }`}>
                              {c.done && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span className={c.done ? 'text-gray-500 line-through' : 'text-gray-700'}>{c.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Radial Chart (1/3) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Avancement par lot</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={120}
              barSize={14}
              data={radialData}
            >
              <RadialBar
                background
                dataKey="avancement"
                label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
              <Tooltip formatter={(v) => [`${Number(v ?? 0)}%`, 'Avancement'] as [string, string]} />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Mini legend */}
          <div className="mt-2 space-y-1.5">
            {LOTS.map((l, i) => (
              <div key={l.id} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: RADIAL_COLORS[i % RADIAL_COLORS.length] }}
                />
                <span className="text-gray-500 w-20 shrink-0">{l.code}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width:      `${l.avancement}%`,
                      background: RADIAL_COLORS[i % RADIAL_COLORS.length],
                    }}
                  />
                </div>
                <span className="text-gray-600 w-8 text-right font-medium">{l.avancement}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
