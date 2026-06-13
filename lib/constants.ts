// ─── WBS Phases ───────────────────────────────────────────────────────────────

export const WBS_PHASES = [
  { code: '1.0', name: 'Études et Conception' },
  { code: '2.0', name: 'Préparation du Chantier' },
  { code: '3.0', name: 'Terrassements et Fondations' },
  { code: '4.0', name: 'Structure Béton Armé' },
  { code: '5.0', name: 'Maçonnerie et Cloisonnement' },
  { code: '6.0', name: 'Toiture et Étanchéité' },
  { code: '7.0', name: 'Menuiseries Extérieures' },
  { code: '8.0', name: 'Menuiseries Intérieures' },
  { code: '9.0', name: 'Revêtements de Sol' },
  { code: '10.0', name: 'Revêtements Muraux et Plafonds' },
  { code: '11.0', name: 'Peinture et Finitions' },
  { code: '12.0', name: 'Plomberie Sanitaire' },
  { code: '13.0', name: 'Génie Climatique (CVC)' },
  { code: '14.0', name: 'Électricité Courants Forts' },
  { code: '15.0', name: 'Courants Faibles et Réseaux' },
  { code: '16.0', name: 'Fluides Médicaux' },
  { code: '17.0', name: 'Équipements Biomédicaux' },
  { code: '18.0', name: 'Ascenseurs et Monte-Charges' },
  { code: '19.0', name: 'Sécurité Incendie' },
  { code: '20.0', name: 'Équipements de Cuisine' },
  { code: '21.0', name: 'Aménagements Extérieurs' },
  { code: '22.0', name: 'Signalétique' },
  { code: '23.0', name: 'Mobilier et Équipements Fixes' },
  { code: '24.0', name: 'Informatique et Télécommunications' },
  { code: '25.0', name: 'Contrôle Accès et Sûreté' },
  { code: '26.0', name: 'Essais et Mise en Service' },
  { code: '27.0', name: 'Levée des Réserves' },
  { code: '28.0', name: 'Réception et Livraison' },
] as const

// ─── Functional Zones ─────────────────────────────────────────────────────────

export const FUNCTIONAL_ZONES = [
  { code: 'Z01', name: 'Accueil et Urgences', floor: 'RDC', area: 420 },
  { code: 'Z02', name: 'Blocs Opératoires', floor: 'RDC', area: 680 },
  { code: 'Z03', name: 'Réanimation et Soins Intensifs', floor: 'RDC', area: 350 },
  { code: 'Z04', name: 'Imagerie Médicale', floor: 'RDC', area: 290 },
  { code: 'Z05', name: 'Laboratoires', floor: '1er', area: 240 },
  { code: 'Z06', name: 'Consultations Externes', floor: '1er', area: 480 },
  { code: 'Z07', name: 'Hospitalisation Générale', floor: '2ème', area: 720 },
  { code: 'Z08', name: 'Maternité et Néonatologie', floor: '2ème', area: 380 },
  { code: 'Z09', name: 'Pédiatrie', floor: '3ème', area: 340 },
  { code: 'Z10', name: 'Cardiologie', floor: '3ème', area: 260 },
  { code: 'Z11', name: 'Pharmacie et Stérilisation', floor: 'SS', area: 200 },
  { code: 'Z12', name: 'Cuisine et Restauration', floor: 'SS', area: 180 },
  { code: 'Z13', name: 'Lingerie et Buanderie', floor: 'SS', area: 120 },
  { code: 'Z14', name: 'Locaux Techniques MEP', floor: 'SS', area: 450 },
  { code: 'Z15', name: 'Administration et Direction', floor: '1er', area: 280 },
  { code: 'Z16', name: 'Circulation et Couloirs', floor: 'Tous', area: 850 },
  { code: 'Z17', name: 'Parking et Accès Véhicules', floor: 'EXT', area: 1200 },
] as const

// ─── Technical Lots ───────────────────────────────────────────────────────────

export const TECHNICAL_LOTS = [
  { code: 'LOT-01', name: 'Gros Œuvre et Structure', color: '#6B7280' },
  { code: 'LOT-02', name: 'Menuiseries Aluminium et Vitrerie', color: '#3B82F6' },
  { code: 'LOT-03', name: 'Plomberie Sanitaire', color: '#06B6D4' },
  { code: 'LOT-04', name: 'Génie Climatique (CVC)', color: '#8B5CF6' },
  { code: 'LOT-05', name: 'Électricité Courants Forts', color: '#F59E0B' },
  { code: 'LOT-06', name: 'Courants Faibles et GTB', color: '#10B981' },
  { code: 'LOT-07', name: 'Fluides Médicaux', color: '#EF4444' },
  { code: 'LOT-08', name: 'Revêtements et Carrelages', color: '#F97316' },
  { code: 'LOT-09', name: 'Peinture et Finitions', color: '#EC4899' },
  { code: 'LOT-10', name: 'Équipements Biomédicaux', color: '#14B8A6' },
] as const

// ─── Status Colors ────────────────────────────────────────────────────────────

export const STATUS_COLORS: Record<string, string> = {
  // Generic
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  delayed: 'bg-red-100 text-red-700',
  blocked: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-gray-100 text-gray-500',

  // Tasks
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-100 text-blue-700',
  paused: 'bg-yellow-100 text-yellow-700',

  // Documents
  pending_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  superseded: 'bg-gray-100 text-gray-500',

  // Procurement
  submitted: 'bg-blue-100 text-blue-700',
  ordered: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',

  // Reservations
  open: 'bg-red-100 text-red-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
  contested: 'bg-orange-100 text-orange-700',

  // Risks
  identified: 'bg-yellow-100 text-yellow-700',
  mitigated: 'bg-blue-100 text-blue-700',
  accepted: 'bg-gray-100 text-gray-600',
  occurred: 'bg-red-100 text-red-700',

  // Tests
  planned: 'bg-blue-100 text-blue-700',
  passed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  conditional: 'bg-yellow-100 text-yellow-700',

  // Meetings
  scheduled: 'bg-blue-100 text-blue-700',
  held: 'bg-green-100 text-green-700',
  postponed: 'bg-yellow-100 text-yellow-700',
}

// ─── Risk Levels ──────────────────────────────────────────────────────────────

export const RISK_LEVELS = {
  low: { label: 'Faible', color: 'bg-green-100 text-green-700', min: 1, max: 4 },
  medium: { label: 'Modéré', color: 'bg-yellow-100 text-yellow-700', min: 5, max: 9 },
  high: { label: 'Élevé', color: 'bg-orange-100 text-orange-700', min: 10, max: 16 },
  critical: { label: 'Critique', color: 'bg-red-100 text-red-700', min: 17, max: 25 },
} as const

// ─── Roles ────────────────────────────────────────────────────────────────────

export const ROLES = [
  { value: 'admin', label: 'Administrateur', permissions: 'full' },
  { value: 'chef_projet', label: 'Chef de Projet', permissions: 'full' },
  { value: 'conducteur_travaux', label: 'Conducteur de Travaux', permissions: 'write' },
  { value: 'ingenieur_structure', label: 'Ingénieur Structure', permissions: 'write' },
  { value: 'ingenieur_mep', label: 'Ingénieur MEP', permissions: 'write' },
  { value: 'ingenieur_biomedical', label: 'Ingénieur Biomédical', permissions: 'write' },
  { value: 'coordinateur_securite', label: 'Coordinateur Sécurité', permissions: 'write' },
  { value: 'representant_client', label: 'Représentant Client', permissions: 'read' },
  { value: 'sous_traitant', label: 'Sous-Traitant', permissions: 'limited' },
  { value: 'visiteur', label: 'Visiteur', permissions: 'read' },
] as const

// ─── Module Navigation ────────────────────────────────────────────────────────

export const MODULES = [
  { id: 'dashboard', label: 'Tableau de Bord', href: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'planning', label: 'Planning & Gantt', href: '/dashboard/planning', icon: 'Calendar' },
  { id: 'zones', label: 'Zones & Locaux', href: '/dashboard/zones', icon: 'Map' },
  { id: 'lots', label: 'Lots Techniques MEP', href: '/dashboard/lots', icon: 'Wrench' },
  { id: 'fluides', label: 'Fluides Médicaux', href: '/dashboard/fluides', icon: 'Droplet' },
  { id: 'equipements', label: 'Équipements Biomédicaux', href: '/dashboard/equipements', icon: 'Activity' },
  { id: 'approvisionnements', label: 'Approvisionnements', href: '/dashboard/approvisionnements', icon: 'Package' },
  { id: 'reserves', label: 'Réserves & NC', href: '/dashboard/reserves', icon: 'AlertTriangle' },
  { id: 'documents', label: 'Documents', href: '/dashboard/documents', icon: 'Folder' },
  { id: 'budget', label: 'Budget & BOQ', href: '/dashboard/budget', icon: 'DollarSign' },
  { id: 'reunions', label: 'Réunions', href: '/dashboard/reunions', icon: 'Users' },
  { id: 'journal', label: 'Journal de Chantier', href: '/dashboard/journal', icon: 'BookOpen' },
  { id: 'essais', label: 'Essais & Réception', href: '/dashboard/essais', icon: 'CheckSquare' },
  { id: 'risques', label: 'Registre des Risques', href: '/dashboard/risques', icon: 'Shield' },
] as const

// ─── Project Config ───────────────────────────────────────────────────────────

export const PROJECT_CONFIG = {
  name: 'Polyclinique Cité Nassib',
  start_date: '2025-06-01',
  end_date: '2027-01-31',
  total_duration_months: 20,
  total_area_sqm: 7420,
  floors: ['SS', 'RDC', '1er', '2ème', '3ème'],
  currency: 'DZD',
  timezone: 'Africa/Algiers',
}
