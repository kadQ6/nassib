'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, CalendarDays, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 'ph1', nom: 'Gros Œuvre', date_debut: '2024-03-01', date_fin: '2024-11-30',
    avancement: 75, statut: 'En cours',
    taches: [
      { nom: 'Fondations et radier',       debut: '2024-10-27', fin: '2025-01-31', avancement: 100, responsable: 'DJI FU SARL', priorite: 'Critique' },
      { nom: 'Structure béton armé',        debut: '2024-11-01', fin: '2025-06-30', avancement:  80, responsable: 'DJI FU SARL', priorite: 'Haute'    },
      { nom: 'Maçonnerie briques',          debut: '2025-01-01', fin: '2025-09-30', avancement:  60, responsable: 'DJI FU SARL', priorite: 'Normale'  },
      { nom: 'Enduits et crépis',           debut: '2025-06-01', fin: '2025-12-31', avancement:  30, responsable: 'DJI FU SARL', priorite: 'Normale'  },
    ],
  },
  {
    id: 'ph2', nom: 'Second Œuvre', date_debut: '2024-08-01', date_fin: '2025-06-30',
    avancement: 30, statut: 'En cours',
    taches: [
      { nom: 'Cloisons et doublages',       debut: '2025-03-01', fin: '2025-10-31', avancement:  50, responsable: 'DJI FU SARL', priorite: 'Haute'   },
      { nom: 'Menuiseries intérieures',     debut: '2025-06-01', fin: '2026-01-31', avancement:  20, responsable: 'DJI FU SARL', priorite: 'Normale' },
      { nom: 'Revêtements sols',            debut: '2025-09-01', fin: '2026-03-31', avancement:  10, responsable: 'DJI FU SARL', priorite: 'Normale' },
      { nom: 'Peintures et finitions',      debut: '2026-01-01', fin: '2026-06-30', avancement:   5, responsable: 'DJI FU SARL', priorite: 'Basse'   },
    ],
  },
  {
    id: 'ph3', nom: 'Lots MEP', date_debut: '2024-09-01', date_fin: '2025-08-31',
    avancement: 22, statut: 'En cours',
    taches: [
      { nom: 'Courant fort CFO',            debut: '2024-09-01', fin: '2025-06-30', avancement:  40, responsable: 'DJI FU SARL',      priorite: 'Haute'    },
      { nom: 'Gaz médicaux',               debut: '2024-10-01', fin: '2025-08-31', avancement:  20, responsable: 'DJI FU SARL',     priorite: 'Critique' },
      { nom: 'CVC et ventilation',          debut: '2024-10-01', fin: '2025-08-31', avancement:  25, responsable: 'DJI FU SARL',      priorite: 'Haute'    },
      { nom: 'Réseau VDI',                 debut: '2024-11-01', fin: '2025-07-31', avancement:  20, responsable: 'DJI FU SARL',  priorite: 'Normale'  },
    ],
  },
  {
    id: 'ph4', nom: 'Équipements', date_debut: '2025-04-01', date_fin: '2025-11-30',
    avancement: 5, statut: 'Non démarré',
    taches: [
      { nom: 'Équipements biomédicaux',     debut: '2025-07-01', fin: '2025-11-30', avancement:   0, responsable: 'DJI FU SARL',    priorite: 'Critique' },
      { nom: 'Mobilier médical',            debut: '2025-06-01', fin: '2025-10-31', avancement:   0, responsable: 'DJI FU SARL',     priorite: 'Haute'    },
      { nom: 'Équipements laboratoire',     debut: '2025-07-01', fin: '2025-10-31', avancement:   0, responsable: 'À définir',   priorite: 'Normale'  },
      { nom: 'Signalétique',               debut: '2025-09-01', fin: '2025-11-30', avancement:   0, responsable: 'À définir',   priorite: 'Basse'    },
    ],
  },
  {
    id: 'ph5', nom: 'Essais & Réception', date_debut: '2025-10-01', date_fin: '2025-12-31',
    avancement: 0, statut: 'Non démarré',
    taches: [
      { nom: 'Essais techniques MEP',       debut: '2025-10-01', fin: '2025-11-30', avancement:   0, responsable: 'DJI FU SARL', priorite: 'Critique' },
      { nom: 'OPR et réserves',            debut: '2025-11-01', fin: '2025-12-15', avancement:   0, responsable: 'M. Kader Omar',       priorite: 'Critique' },
      { nom: 'Levée des réserves',          debut: '2025-12-01', fin: '2025-12-20', avancement:   0, responsable: 'DJI FU SARL', priorite: 'Haute'    },
      { nom: 'Réception définitive',        debut: '2025-12-20', fin: '2025-12-31', avancement:   0, responsable: 'M. Kader Omar',       priorite: 'Critique' },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Timeline: March 2024 → December 2025 = 22 months */
const PROJECT_START = new Date('2024-03-01')
const PROJECT_END   = new Date('2025-12-31')
const TOTAL_MS = PROJECT_END.getTime() - PROJECT_START.getTime()

function pct(dateStr: string): number {
  const d = new Date(dateStr)
  return Math.max(0, Math.min(100, ((d.getTime() - PROJECT_START.getTime()) / TOTAL_MS) * 100))
}

function widthPct(debut: string, fin: string): number {
  const s = Math.max(new Date(debut).getTime(), PROJECT_START.getTime())
  const e = Math.min(new Date(fin).getTime(),   PROJECT_END.getTime())
  return Math.max(0, ((e - s) / TOTAL_MS) * 100)
}

function leftPct(debut: string): number {
  return pct(debut)
}

/** Generate month labels across timeline */
function getMonths(): { label: string; left: number }[] {
  const months: { label: string; left: number }[] = []
  const cursor = new Date(PROJECT_START)
  while (cursor <= PROJECT_END) {
    const label = cursor.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
    months.push({ label, left: pct(cursor.toISOString().slice(0, 10)) })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return months
}

const MONTHS = getMonths()

const PRIORITE_COLORS: Record<string, string> = {
  Critique: 'bg-red-100 text-red-700',
  Haute:    'bg-orange-100 text-orange-700',
  Normale:  'bg-blue-100 text-blue-700',
  Basse:    'bg-gray-100 text-gray-500',
}

const STATUT_META: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  'En cours':     { color: 'text-blue-600',  icon: Clock         },
  'Non démarré':  { color: 'text-gray-400',  icon: CalendarDays  },
  'Terminé':      { color: 'text-green-600', icon: CheckCircle2  },
  'En retard':    { color: 'text-red-600',   icon: AlertCircle   },
}

function barColor(avancement: number): string {
  if (avancement >= 100) return '#22c55e'
  if (avancement > 0)    return '#3b82f6'
  return '#d1d5db'
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PlanningPage() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning Général — Gantt</h1>
          <p className="text-sm text-gray-500 mt-1">
            Polyclinique Cité Nassib · Mars 2024 → Décembre 2025 (22 mois)
          </p>
        </div>
        <div className="flex gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400 inline-block" /> Terminé</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block" /> En cours</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300 inline-block" /> Non démarré</span>
        </div>
      </div>

      {/* ── Gantt ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex">

          {/* Left: fixed label column */}
          <div className="shrink-0 w-72 border-r border-gray-200">
            {/* header spacer */}
            <div className="h-10 border-b border-gray-200 bg-gray-50 px-3 flex items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phase / Tâche</span>
            </div>

            {PHASES.map(ph => {
              const isCollapsed = collapsed[ph.id]
              const meta = STATUT_META[ph.statut] ?? STATUT_META['Non démarré']
              const Icon = meta.icon
              return (
                <div key={ph.id}>
                  {/* Phase row */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggle(ph.id)}
                  >
                    {isCollapsed
                      ? <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      : <ChevronDown  className="w-4 h-4 text-gray-400 shrink-0" />}
                    <Icon className={`w-4 h-4 shrink-0 ${meta.color}`} />
                    <span className="text-sm font-semibold text-gray-800 truncate">{ph.nom}</span>
                    <span className="ml-auto text-xs text-gray-500 shrink-0">{ph.avancement}%</span>
                  </div>

                  {/* Task rows */}
                  {!isCollapsed && ph.taches.map((t, ti) => (
                    <div
                      key={ti}
                      className="flex items-center gap-2 pl-8 pr-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-xs text-gray-700 truncate flex-1">{t.nom}</span>
                      <span className="text-xs text-gray-400 shrink-0">{t.avancement}%</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Right: scrollable timeline */}
          <div className="flex-1 overflow-x-auto">
            <div style={{ minWidth: 900 }}>

              {/* Month headers */}
              <div className="relative h-10 border-b border-gray-200 bg-gray-50">
                {MONTHS.map((m, i) => (
                  <span
                    key={i}
                    className="absolute top-0 bottom-0 flex items-center text-[10px] text-gray-400 border-l border-gray-200 pl-1"
                    style={{ left: `${m.left}%` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Phase + task bars */}
              {PHASES.map(ph => {
                const isCollapsed = collapsed[ph.id]
                return (
                  <div key={ph.id}>
                    {/* Phase bar row */}
                    <div className="relative h-10 border-b border-gray-200 bg-gray-50">
                      {/* grid lines */}
                      {MONTHS.map((m, i) => (
                        <div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${m.left}%` }} />
                      ))}
                      {/* Phase bar (outline) */}
                      <div
                        className="absolute top-2.5 h-5 rounded border-2 border-gray-400 bg-gray-100 overflow-hidden"
                        style={{
                          left:  `${leftPct(ph.date_debut)}%`,
                          width: `${widthPct(ph.date_debut, ph.date_fin)}%`,
                        }}
                      >
                        <div
                          className="h-full bg-gray-300 opacity-70"
                          style={{ width: `${ph.avancement}%` }}
                        />
                      </div>
                    </div>

                    {/* Task bar rows */}
                    {!isCollapsed && ph.taches.map((t, ti) => (
                      <div key={ti} className="relative h-9 border-b border-gray-100">
                        {MONTHS.map((m, i) => (
                          <div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${m.left}%` }} />
                        ))}
                        {/* Background track */}
                        <div
                          className="absolute top-3 h-3 rounded-full bg-gray-200"
                          style={{
                            left:  `${leftPct(t.debut)}%`,
                            width: `${widthPct(t.debut, t.fin)}%`,
                          }}
                        >
                          {/* Progress fill */}
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width:      `${t.avancement}%`,
                              background: barColor(t.avancement),
                            }}
                          />
                        </div>
                        {/* Label inside bar (only if wide enough) */}
                        {widthPct(t.debut, t.fin) > 12 && (
                          <span
                            className="absolute top-3 text-[9px] text-white font-semibold px-1 pointer-events-none leading-3"
                            style={{
                              left: `calc(${leftPct(t.debut)}% + 2px)`,
                              lineHeight: '12px',
                            }}
                          >
                            {t.avancement > 0 ? `${t.avancement}%` : ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Récapitulatif des tâches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Phase</th>
                <th className="px-4 py-3 text-left">Tâche</th>
                <th className="px-4 py-3 text-left">Responsable</th>
                <th className="px-4 py-3 text-center">Début</th>
                <th className="px-4 py-3 text-center">Fin</th>
                <th className="px-4 py-3 text-center">Priorité</th>
                <th className="px-4 py-3 text-center w-36">Avancement</th>
              </tr>
            </thead>
            <tbody>
              {PHASES.flatMap(ph =>
                ph.taches.map((t, ti) => (
                  <tr key={`${ph.id}-${ti}`} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">{ph.nom}</td>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{t.nom}</td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs">{t.responsable}</td>
                    <td className="px-4 py-2.5 text-center text-gray-500 text-xs whitespace-nowrap">
                      {new Date(t.debut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-2.5 text-center text-gray-500 text-xs whitespace-nowrap">
                      {new Date(t.fin).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITE_COLORS[t.priorite] ?? 'bg-gray-100 text-gray-600'}`}>
                        {t.priorite}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${t.avancement}%`, background: barColor(t.avancement) }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-right shrink-0">{t.avancement}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
