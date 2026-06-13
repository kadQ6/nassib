// ─── Core Entities ───────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  planned_progress: number
  actual_progress: number
  budget_total: number
  budget_consumed: number
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: Role
  avatar_url?: string
  phone?: string
  company?: string
  created_at: string
}

export type Role =
  | 'admin'
  | 'chef_projet'
  | 'conducteur_travaux'
  | 'ingenieur_structure'
  | 'ingenieur_mep'
  | 'ingenieur_biomédical'
  | 'coordinateur_securite'
  | 'representant_client'
  | 'sous_traitant'
  | 'visiteur'

// ─── Planning ────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  project_id: string
  parent_id?: string
  wbs_code: string
  name: string
  phase: string
  zone_id?: string
  lot_id?: string
  assigned_to?: string
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  planned_duration: number
  actual_duration?: number
  progress: number
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  notes?: string
  created_at: string
  updated_at: string
}

export interface TaskDependency {
  id: string
  task_id: string
  depends_on_id: string
  type: 'FS' | 'SS' | 'FF' | 'SF'
  lag_days: number
}

export interface Milestone {
  id: string
  project_id: string
  name: string
  date: string
  description?: string
  status: 'pending' | 'achieved' | 'missed'
  linked_task_ids: string[]
}

// ─── Zones & Rooms ───────────────────────────────────────────────────────────

export interface Zone {
  id: string
  project_id: string
  code: string
  name: string
  floor: string
  area_sqm: number
  functional_type: string
  progress: number
  status: 'not_started' | 'in_progress' | 'finished' | 'delivered'
  notes?: string
}

export interface Room {
  id: string
  zone_id: string
  code: string
  name: string
  area_sqm: number
  ceiling_height: number
  functional_use: string
  status: 'not_started' | 'in_progress' | 'finished' | 'delivered'
  progress: number
  has_medical_gas: boolean
  has_hvac: boolean
  has_electrical: boolean
  has_plumbing: boolean
  notes?: string
}

// ─── Technical Lots ───────────────────────────────────────────────────────────

export interface TechnicalLot {
  id: string
  project_id: string
  code: string
  name: string
  contractor: string
  contractor_contact?: string
  contract_value: number
  progress: number
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed'
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  notes?: string
}

export interface LotProgress {
  id: string
  lot_id: string
  date: string
  progress: number
  reported_by: string
  notes?: string
}

// ─── Documents ───────────────────────────────────────────────────────────────

export interface Document {
  id: string
  project_id: string
  title: string
  category: 'plan' | 'technical' | 'administrative' | 'contract' | 'report' | 'photo' | 'other'
  lot_id?: string
  zone_id?: string
  current_version: string
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'superseded'
  uploaded_by: string
  file_url: string
  file_size: number
  file_type: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface DocumentVersion {
  id: string
  document_id: string
  version: string
  file_url: string
  file_size: number
  uploaded_by: string
  change_notes?: string
  created_at: string
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export interface Procurement {
  id: string
  project_id: string
  lot_id?: string
  reference: string
  description: string
  supplier?: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  requested_by: string
  approved_by?: string
  order_date?: string
  expected_delivery?: string
  actual_delivery?: string
  notes?: string
  created_at: string
  updated_at: string
}

// ─── Equipment ───────────────────────────────────────────────────────────────

export interface Equipment {
  id: string
  project_id: string
  zone_id?: string
  room_id?: string
  reference: string
  name: string
  category: string
  manufacturer?: string
  model?: string
  serial_number?: string
  quantity: number
  unit_cost: number
  status: 'planned' | 'ordered' | 'delivered' | 'installed' | 'commissioned' | 'rejected'
  installation_date?: string
  commissioning_date?: string
  warranty_expiry?: string
  supplier?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface EquipmentPrerequisite {
  id: string
  equipment_id: string
  prerequisite_type: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'it_network' | 'medical_gas' | 'other'
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  responsible?: string
  due_date?: string
  notes?: string
}

// ─── BOQ & Budget ─────────────────────────────────────────────────────────────

export interface BOQItem {
  id: string
  project_id: string
  lot_id?: string
  wbs_code: string
  description: string
  unit: string
  quantity_planned: number
  quantity_actual: number
  unit_price: number
  total_planned: number
  total_actual: number
  status: 'not_started' | 'in_progress' | 'completed'
  notes?: string
}

export interface PaymentRequest {
  id: string
  project_id: string
  lot_id: string
  request_number: string
  period_start: string
  period_end: string
  amount_requested: number
  amount_approved?: number
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected'
  submitted_by: string
  reviewed_by?: string
  submitted_at: string
  approved_at?: string
  paid_at?: string
  notes?: string
}

// ─── Reservations & Non-Conformances ─────────────────────────────────────────

export interface Reservation {
  id: string
  project_id: string
  lot_id?: string
  zone_id?: string
  room_id?: string
  reference: string
  title: string
  description: string
  category: 'structural' | 'finishing' | 'mep' | 'safety' | 'quality' | 'other'
  severity: 'minor' | 'major' | 'critical' | 'blocking'
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'contested'
  reported_by: string
  assigned_to?: string
  reported_at: string
  due_date?: string
  resolved_at?: string
  photos: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface ReservationComment {
  id: string
  reservation_id: string
  author_id: string
  content: string
  attachments: string[]
  created_at: string
}

// ─── Meetings ────────────────────────────────────────────────────────────────

export interface Meeting {
  id: string
  project_id: string
  title: string
  type: 'chantier' | 'coordination' | 'client' | 'securite' | 'technique' | 'autre'
  date: string
  location: string
  attendees: string[]
  agenda?: string
  minutes?: string
  status: 'scheduled' | 'held' | 'cancelled' | 'postponed'
  next_meeting_date?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface MeetingAction {
  id: string
  meeting_id: string
  description: string
  assigned_to: string
  due_date: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  completed_at?: string
}

// ─── Daily Reports ───────────────────────────────────────────────────────────

export interface DailyReport {
  id: string
  project_id: string
  date: string
  reported_by: string
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy'
  temperature_min?: number
  temperature_max?: number
  workforce_count: number
  workforce_breakdown: Record<string, number>
  activities: string
  issues?: string
  safety_incidents: number
  photos: string[]
  notes?: string
  created_at: string
}

// ─── Tests & Commissioning ────────────────────────────────────────────────────

export interface Test {
  id: string
  project_id: string
  lot_id?: string
  equipment_id?: string
  zone_id?: string
  reference: string
  name: string
  type: 'functional' | 'performance' | 'safety' | 'commissioning' | 'acceptance'
  standard?: string
  status: 'planned' | 'in_progress' | 'passed' | 'failed' | 'conditional'
  planned_date: string
  actual_date?: string
  performed_by?: string
  witnessed_by?: string
  result?: string
  notes?: string
  attachments: string[]
  created_at: string
}

export interface CommissioningChecklist {
  id: string
  project_id: string
  lot_id?: string
  name: string
  items: CommissioningChecklistItem[]
  status: 'pending' | 'in_progress' | 'completed'
  created_by: string
  created_at: string
}

export interface CommissioningChecklistItem {
  id: string
  checklist_id: string
  description: string
  responsible: string
  status: 'pending' | 'completed' | 'not_applicable'
  completed_at?: string
  notes?: string
}

// ─── Risks ────────────────────────────────────────────────────────────────────

export interface Risk {
  id: string
  project_id: string
  reference: string
  title: string
  description: string
  category: 'technical' | 'financial' | 'schedule' | 'safety' | 'regulatory' | 'environmental' | 'other'
  probability: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  risk_score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  status: 'identified' | 'mitigated' | 'accepted' | 'closed' | 'occurred'
  mitigation_plan?: string
  contingency_plan?: string
  owner: string
  due_date?: string
  created_at: string
  updated_at: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  user_id: string
  project_id?: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  module: string
  link?: string
  read: boolean
  created_at: string
}

// ─── Fluid Systems ────────────────────────────────────────────────────────────

export interface FluidSystem {
  id: string
  project_id: string
  code: string
  name: string
  type: 'oxygen' | 'vacuum' | 'compressed_air' | 'nitrous_oxide' | 'co2' | 'nitrogen' | 'other'
  standard: string
  contractor?: string
  progress: number
  status: 'not_started' | 'installation' | 'testing' | 'certified' | 'operational'
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  certification_date?: string
  certifying_body?: string
  notes?: string
  zones_served: string[]
}
