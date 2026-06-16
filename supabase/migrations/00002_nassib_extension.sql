-- ARCHI HOSP v0.2 — Extension Polyclinique Nassib
-- Tables complémentaires au schéma MVP

CREATE TYPE risk_category AS ENUM ('delay','cost','quality','safety','technical','procurement','administrative');
CREATE TYPE risk_status AS ENUM ('open','mitigating','closed');
CREATE TYPE meeting_action_status AS ENUM ('open','in_progress','done','overdue');
CREATE TYPE document_validation_status AS ENUM ('draft','submitted','in_review','approved','approved_with_comments','rejected','obsolete');
CREATE TYPE zone_function AS ENUM (
  'accueil_admin','urgences','imagerie','laboratoire','consultations',
  'gyneco_obstetrique','bloc_cesarienne','sspi','sterilisation',
  'hospitalisation','neonatologie','pharmacie','locaux_techniques',
  'circulation','vestiaires','dechets','vrd_exterieur'
);

-- Zones fonctionnelles
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  function zone_function NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, code)
);

-- Réunions chantier
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  participants JSONB DEFAULT '[]',
  agenda JSONB DEFAULT '[]',
  decisions JSONB DEFAULT '[]',
  blocking_points JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

CREATE TABLE meeting_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  responsible TEXT,
  due_date DATE,
  status meeting_action_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Journal quotidien
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  weather TEXT,
  workforce JSONB DEFAULT '[]',
  works_done TEXT,
  zones_worked JSONB DEFAULT '[]',
  incidents TEXT,
  blockages TEXT,
  signed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

-- Registre risques
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category risk_category NOT NULL DEFAULT 'technical',
  probability INT CHECK (probability BETWEEN 1 AND 5),
  impact INT CHECK (impact BETWEEN 1 AND 5),
  criticality INT GENERATED ALWAYS AS (probability * impact) STORED,
  responsible TEXT,
  action_plan TEXT,
  due_date DATE,
  status risk_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

-- Fluides médicaux — réseaux
CREATE TABLE medical_gas_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  gas_type TEXT NOT NULL,
  source TEXT,
  technical_room_id UUID REFERENCES rooms(id),
  outlets_planned INT DEFAULT 0,
  outlets_installed INT DEFAULT 0,
  checklist JSONB DEFAULT '{}',
  progress_pct NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prérequis équipements
CREATE TABLE equipment_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment_instances(id) ON DELETE CASCADE,
  prerequisite_type TEXT NOT NULL,
  description TEXT,
  is_met BOOLEAN DEFAULT false,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Snapshots indice maîtrise
CREATE TABLE master_index_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  score NUMERIC(5,2),
  level TEXT CHECK (level IN ('green','orange','red')),
  breakdown JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications internes
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT,
  module TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Extension champs projet planning
ALTER TABLE projects ADD COLUMN IF NOT EXISTS forecast_end DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS realistic_end DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS internal_target_end DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS schedule_risk_level TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress_planned NUMERIC(5,2) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress_actual NUMERIC(5,2) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_consumed NUMERIC(14,2) DEFAULT 0;

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES zones(id);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'pending';
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS needs JSONB DEFAULT '{}';

ALTER TABLE reserves ADD COLUMN IF NOT EXISTS reserve_number TEXT;
ALTER TABLE reserves ADD COLUMN IF NOT EXISTS reserve_type TEXT;
ALTER TABLE reserves ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE reserves ADD COLUMN IF NOT EXISTS blocks_reception BOOLEAN DEFAULT false;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS responsible TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS baseline_start DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS baseline_end DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS has_proof BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_milestone BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id);

-- RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_gas_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_index_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zones_member" ON zones FOR ALL USING (public.is_project_member(project_id)) WITH CHECK (public.is_project_member(project_id));
CREATE POLICY "meetings_member" ON meetings FOR ALL USING (public.is_project_member(project_id)) WITH CHECK (public.is_project_member(project_id));
CREATE POLICY "daily_reports_member" ON daily_reports FOR ALL USING (public.is_project_member(project_id)) WITH CHECK (public.is_project_member(project_id));
CREATE POLICY "risks_member" ON risks FOR ALL USING (public.is_project_member(project_id)) WITH CHECK (public.is_project_member(project_id));
CREATE POLICY "medical_gas_member" ON medical_gas_networks FOR ALL USING (public.is_project_member(project_id)) WITH CHECK (public.is_project_member(project_id));
