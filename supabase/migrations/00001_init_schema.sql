-- ARCHI HOSP — Schema MVP v0.1
-- Migration: 00001_init_schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE app_role AS ENUM (
  'admin', 'project_manager', 'site_manager', 'lot_manager',
  'biomedical', 'supplier', 'controller', 'viewer'
);
CREATE TYPE project_status AS ENUM ('draft','active','suspended','completed','archived');
CREATE TYPE task_status AS ENUM ('not_started','in_progress','blocked','completed','cancelled');
CREATE TYPE lot_status AS ENUM ('planned','tendering','awarded','in_progress','completed');
CREATE TYPE room_status AS ENUM ('shell','rough_in','finishes','equipment','testing','handover','occupied');
CREATE TYPE reserve_status AS ENUM ('open','in_progress','validated','closed','rejected');
CREATE TYPE reserve_priority AS ENUM ('critical','major','minor','info');
CREATE TYPE document_category AS ENUM ('plan','spec','report','certificate','contract','photo','other');
CREATE TYPE procurement_status AS ENUM ('requested','ordered','in_transit','delivered','installed','accepted');
CREATE TYPE equipment_status AS ENUM ('specified','ordered','delivered','installed','commissioned','accepted');
CREATE TYPE test_status AS ENUM ('planned','in_progress','passed','failed','conditional');
CREATE TYPE payment_status AS ENUM ('planned','submitted','approved','paid','disputed');

-- Organizations & users
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  default_role app_role NOT NULL DEFAULT 'viewer',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  location TEXT,
  status project_status NOT NULL DEFAULT 'draft',
  planned_start DATE,
  planned_end DATE,
  contract_amount NUMERIC(14,2) DEFAULT 0,
  progress_pct NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'viewer',
  UNIQUE (project_id, user_id)
);

-- Lots
CREATE TABLE lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  trade_type TEXT NOT NULL,
  status lot_status NOT NULL DEFAULT 'planned',
  contractor TEXT,
  contract_amount NUMERIC(14,2) DEFAULT 0,
  progress_pct NUMERIC(5,2) DEFAULT 0,
  planned_start DATE,
  planned_end DATE,
  UNIQUE (project_id, code)
);

-- WBS & Planning
CREATE TABLE wbs_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES wbs_nodes(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  progress_pct NUMERIC(5,2) DEFAULT 0
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wbs_node_id UUID REFERENCES wbs_nodes(id) ON DELETE SET NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'not_started',
  progress_pct NUMERIC(5,2) DEFAULT 0,
  planned_start DATE,
  planned_end DATE,
  actual_start DATE,
  actual_end DATE,
  duration_days INT,
  is_critical BOOLEAN DEFAULT false
);

CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  predecessor_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  successor_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL DEFAULT 'FS',
  lag_days INT DEFAULT 0,
  UNIQUE (predecessor_id, successor_id)
);

-- Locaux
CREATE TABLE storeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  level_index INT NOT NULL DEFAULT 0,
  UNIQUE (project_id, code)
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  storey_id UUID REFERENCES storeys(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  room_type TEXT,
  area_m2 NUMERIC(10,2),
  status room_status NOT NULL DEFAULT 'shell',
  progress_pct NUMERIC(5,2) DEFAULT 0,
  polygon_coordinates JSONB,
  height_m NUMERIC(6,2),
  cleanroom_class TEXT,
  medical_gas_required BOOLEAN DEFAULT false,
  UNIQUE (project_id, code)
);

CREATE TABLE room_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL DEFAULT 'default'
);

CREATE TABLE room_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES room_checklists(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  category TEXT,
  is_done BOOLEAN DEFAULT false,
  done_at TIMESTAMPTZ,
  done_by UUID REFERENCES profiles(id)
);

-- Réserves
CREATE TABLE reserves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status reserve_status NOT NULL DEFAULT 'open',
  priority reserve_priority NOT NULL DEFAULT 'minor',
  location_detail TEXT,
  reported_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documents
CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES document_folders(id) ON DELETE SET NULL,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category document_category NOT NULL DEFAULT 'other',
  file_path TEXT NOT NULL,
  version TEXT DEFAULT 'V1',
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Approvisionnements
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT
);

CREATE TABLE procurement_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id),
  reference TEXT NOT NULL,
  description TEXT,
  qty_ordered NUMERIC(12,2) DEFAULT 0,
  qty_delivered NUMERIC(12,2) DEFAULT 0,
  unit TEXT DEFAULT 'u',
  status procurement_status NOT NULL DEFAULT 'requested',
  expected_date DATE,
  actual_date DATE
);

-- Équipements biomédicaux
CREATE TABLE equipment_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  device_class TEXT,
  default_criticality TEXT
);

CREATE TABLE equipment_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  catalog_id UUID REFERENCES equipment_catalog(id),
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  asset_code TEXT NOT NULL,
  serial_number TEXT,
  status equipment_status NOT NULL DEFAULT 'specified',
  criticality TEXT CHECK (criticality IN ('A','B','C')),
  acquisition_date DATE,
  warranty_end DATE,
  UNIQUE (project_id, asset_code)
);

CREATE TABLE equipment_commissioning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment_instances(id) ON DELETE CASCADE,
  protocol_name TEXT NOT NULL,
  status test_status NOT NULL DEFAULT 'planned',
  test_date DATE,
  technician UUID REFERENCES profiles(id),
  report_doc_id UUID REFERENCES documents(id)
);

-- Essais / Réception
CREATE TABLE test_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  norm_reference TEXT
);

CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID NOT NULL REFERENCES test_protocols(id) ON DELETE CASCADE,
  status test_status NOT NULL DEFAULT 'planned',
  scheduled_date DATE,
  executed_date DATE,
  executor_id UUID REFERENCES profiles(id)
);

CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
  criterion TEXT NOT NULL,
  expected_value TEXT,
  actual_value TEXT,
  passed BOOLEAN
);

CREATE TABLE reception_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_type TEXT CHECK (session_type IN ('partial','global')),
  session_date DATE,
  status TEXT DEFAULT 'planned',
  notes TEXT
);

-- BOQ / Paiements
CREATE TABLE boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'u',
  qty_contract NUMERIC(14,2) DEFAULT 0,
  qty_executed NUMERIC(14,2) DEFAULT 0,
  unit_price NUMERIC(14,2) DEFAULT 0,
  UNIQUE (project_id, code)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES lots(id) ON DELETE SET NULL,
  reference TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  amount_ht NUMERIC(14,2) DEFAULT 0,
  amount_ttc NUMERIC(14,2) DEFAULT 0,
  status payment_status NOT NULL DEFAULT 'planned',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);

-- Audit
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  project_progress NUMERIC(5,2),
  lot_progress JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_rooms_project ON rooms(project_id);
CREATE INDEX idx_reserves_project ON reserves(project_id);
CREATE INDEX idx_reserves_status ON reserves(status);
CREATE INDEX idx_equipment_project ON equipment_instances(project_id);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbs_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE storeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserves ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_commissioning ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reception_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;

-- Helper: check project membership
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = p_project_id AND user_id = auth.uid()
  );
$$;

-- RLS policies (MVP — project member access)
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "projects_member_select" ON projects FOR SELECT
  USING (public.is_project_member(id));

CREATE POLICY "project_members_select" ON project_members FOR SELECT
  USING (public.is_project_member(project_id));

CREATE POLICY "lots_member_all" ON lots FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "tasks_member_all" ON tasks FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "rooms_member_all" ON rooms FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "reserves_member_all" ON reserves FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "documents_member_all" ON documents FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "procurement_member_all" ON procurement_items FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "equipment_member_all" ON equipment_instances FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "boq_member_all" ON boq_items FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "payments_member_all" ON payments FOR ALL
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));
