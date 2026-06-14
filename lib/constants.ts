// ============================================================
// NASSIB v2 — Constants
// ============================================================

export const ETAGES = ['RDC', 'R+1', 'R+2', 'R+3', 'Sous-sol', 'Toiture'] as const

export const DEPARTEMENTS = [
  'Urgences', 'Chirurgie', 'Maternité', 'Pédiatrie', 'Médecine',
  'Radiologie', 'Laboratoire', 'Pharmacie', 'Administration', 'Infrastructure',
] as const

export const TYPES_LOCAL = [
  'Chambre', 'Box soins', 'Salle soins', 'Salle accouchement', 'Salle opération',
  'Poste soins', 'Bureau', 'Bureau médical', 'Salle réunion', 'Accueil',
  'Pharmacie', 'Laboratoire', 'Local technique', 'Local stockage',
  'Salle attente', 'Sanitaires', 'Stérilisation', 'Néonatologie',
] as const

export const STATUTS_LOCAL: Record<string, { color: string; bg: string }> = {
  'En attente':   { color: 'text-slate-600',  bg: 'bg-slate-100' },
  'En cours':     { color: 'text-blue-600',   bg: 'bg-blue-100' },
  'Terminé':      { color: 'text-green-600',  bg: 'bg-green-100' },
  'Bloqué':       { color: 'text-red-600',    bg: 'bg-red-100' },
  'Réceptionné':  { color: 'text-emerald-600',bg: 'bg-emerald-100' },
}

export const GRAVITE_COLORS: Record<string, string> = {
  'Mineure':    'bg-yellow-100 text-yellow-700',
  'Majeure':    'bg-orange-100 text-orange-700',
  'Bloquante':  'bg-red-100 text-red-700',
}

export const STATUT_RESERVE_COLORS: Record<string, string> = {
  'Ouverte':    'bg-red-100 text-red-700',
  'En cours':   'bg-orange-100 text-orange-700',
  'Levée':      'bg-green-100 text-green-700',
  'Annulée':    'bg-slate-100 text-slate-500',
}

export const STATUT_ESSAI_COLORS: Record<string, string> = {
  'Planifié':     'bg-blue-100 text-blue-700',
  'En cours':     'bg-yellow-100 text-yellow-700',
  'Terminé':      'bg-green-100 text-green-700',
  'Replanifié':   'bg-orange-100 text-orange-700',
}

export const RESULTAT_ESSAI_COLORS: Record<string, string> = {
  'Conforme':       'bg-green-100 text-green-700',
  'Non conforme':   'bg-red-100 text-red-700',
  'Réservé':        'bg-orange-100 text-orange-700',
  'Non réalisé':    'bg-slate-100 text-slate-500',
}

export const STATUT_EQUIP_COLORS: Record<string, string> = {
  'Non commandé':  'bg-slate-100 text-slate-600',
  'Commandé':      'bg-blue-100 text-blue-700',
  'Livré':         'bg-purple-100 text-purple-700',
  'Installé':      'bg-yellow-100 text-yellow-700',
  'Validé':        'bg-green-100 text-green-700',
}

export const STATUT_PAIEMENT_COLORS: Record<string, string> = {
  'En attente':  'bg-yellow-100 text-yellow-700',
  'Validé':      'bg-blue-100 text-blue-700',
  'Payé':        'bg-green-100 text-green-700',
  'Contesté':    'bg-red-100 text-red-700',
}

export const STATUT_RECEPTION_COLORS: Record<string, string> = {
  'Non visité':     'bg-slate-100 text-slate-500',
  'En cours':       'bg-blue-100 text-blue-700',
  'Avec réserves':  'bg-orange-100 text-orange-700',
  'Réceptionné':    'bg-green-100 text-green-700',
}

export const PRIORITE_COLORS: Record<string, string> = {
  'Critique': 'bg-red-100 text-red-700',
  'Haute':    'bg-orange-100 text-orange-700',
  'Normale':  'bg-blue-100 text-blue-700',
  'Basse':    'bg-slate-100 text-slate-600',
}

export const TYPES_LOT_COLORS: Record<string, string> = {
  'GC':           'bg-stone-100 text-stone-700',
  'CFO':          'bg-yellow-100 text-yellow-700',
  'CFA':          'bg-purple-100 text-purple-700',
  'VDI':          'bg-blue-100 text-blue-700',
  'GAZ':          'bg-cyan-100 text-cyan-700',
  'PLOMBERIE':    'bg-teal-100 text-teal-700',
  'CVC':          'bg-sky-100 text-sky-700',
  'BIOMÉDICAL':   'bg-green-100 text-green-700',
  'MOBILIER':     'bg-pink-100 text-pink-700',
  'SECOND_OEUVRE':'bg-orange-100 text-orange-700',
}

export const CATEGORIES_GAZ = ['O2', 'Vide médical', 'Air médical', 'N2O', 'CO2'] as const

export const TYPES_ESSAI = [
  'Électrique', 'Hydraulique', 'Ventilation', 'Gaz médicaux',
  'Fonctionnel', 'Biomédical', 'Réglementaire', 'Général',
] as const

export const formatMontant = (v: number) =>
  new Intl.NumberFormat('fr-DJ', { maximumFractionDigits: 0 }).format(v) + ' FDJ'

export const formatNum = (v: number) =>
  new Intl.NumberFormat('fr-FR').format(v)

export const formatDate = (d?: string) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const progressColor = (v: number) => {
  if (v >= 90) return 'bg-green-500'
  if (v >= 60) return 'bg-blue-500'
  if (v >= 30) return 'bg-yellow-500'
  return 'bg-red-400'
}
