-- =============================================================================
-- Polyclinique Construction Management - Complete Database Schema
-- Compatible with PostgreSQL 17 / Supabase
-- =============================================================================

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. PROJECTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  client TEXT,
  start_date DATE,
  end_date_contractual DATE,
  end_date_revised DATE,
  end_date_forecast DATE,
  status TEXT DEFAULT 'en_cours' CHECK (status IN ('preparation','en_cours','reception','termine','suspendu')),
  budget_total NUMERIC(15,2),
  budget_consumed NUMERIC(15,2) DEFAULT 0,
  progress_planned NUMERIC(5,2) DEFAULT 0,
  progress_real NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. WORK PACKAGES / LOTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('GC','CFO','CFA','VDI','SSI','CCTV','PLOMBERIE','CVC','FLUIDES','VRD','BIOMÉDICAL','ARCHITECTURE','AUTRE')),
  contractor TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  budget NUMERIC(15,2),
  progress NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'en_cours' CHECK (status IN ('non_demarre','en_cours','suspendu','termine','receptionne')),
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. WBS TASKS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES chantier_tasks(id) ON DELETE SET NULL,
  wbs_code TEXT,
  name TEXT NOT NULL,
  description TEXT,
  phase INTEGER,
  phase_name TEXT,
  type TEXT DEFAULT 'task' CHECK (type IN ('phase','task','milestone')),
  planned_start DATE,
  planned_end DATE,
  actual_start DATE,
  actual_end DATE,
  duration_days INTEGER,
  progress NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'non_demarre' CHECK (status IN ('non_demarre','en_cours','termine','en_retard','bloque','annule')),
  responsible TEXT,
  risk_level TEXT DEFAULT 'faible' CHECK (risk_level IN ('faible','moyen','eleve','critique')),
  is_critical_path BOOLEAN DEFAULT FALSE,
  is_milestone BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. TASK DEPENDENCIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES chantier_tasks(id) ON DELETE CASCADE,
  depends_on_id UUID REFERENCES chantier_tasks(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'FS' CHECK (type IN ('FS','SS','FF','SF')),
  lag_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. ZONES FONCTIONNELLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  functional_type TEXT CHECK (functional_type IN ('accueil','urgences','imagerie','laboratoire','consultations','gyneco_obst','bloc','sspi','sterilisation','hospitalisation','neonatologie','pharmacie','technique','circulation','vestiaires','dechets','vrd','exterieur')),
  floor TEXT DEFAULT 'RDC' CHECK (floor IN ('SS','RDC','R+1','R+2','TOITURE','EXTERIEUR')),
  area_sqm NUMERIC(8,2),
  status TEXT DEFAULT 'en_travaux' CHECK (status IN ('non_commence','en_travaux','termine_brut','finitions','validation_technique','pret_reception','livre')),
  progress NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. ROOMS / LOCAUX
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES chantier_zones(id) ON DELETE CASCADE,
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  floor TEXT DEFAULT 'RDC',
  area_sqm NUMERIC(8,2),
  status TEXT DEFAULT 'en_travaux',
  progress NUMERIC(5,2) DEFAULT 0,
  needs_cfo BOOLEAN DEFAULT FALSE,
  needs_cfa BOOLEAN DEFAULT FALSE,
  needs_cvc BOOLEAN DEFAULT FALSE,
  needs_plomberie BOOLEAN DEFAULT FALSE,
  needs_fluides_medicaux BOOLEAN DEFAULT FALSE,
  needs_mobilier BOOLEAN DEFAULT FALSE,
  needs_ssi BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. RESERVATIONS (PUNCH LIST / NON-CONFORMITIES)
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  reservation_number TEXT,
  room_id UUID REFERENCES chantier_rooms(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES chantier_zones(id) ON DELETE SET NULL,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  contractor TEXT,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'mineure' CHECK (severity IN ('mineure','majeure','critique')),
  type TEXT DEFAULT 'qualite' CHECK (type IN ('qualite','securite','technique','esthetique','conformite','retard','documentation')),
  action_required TEXT,
  responsible TEXT,
  due_date DATE,
  status TEXT DEFAULT 'ouverte' CHECK (status IN ('ouverte','en_cours','corrigee','a_verifier','refusee','levee','cloturee')),
  photo_before TEXT,
  photo_after TEXT,
  validated_by TEXT,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. DOCUMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  doc_type TEXT CHECK (doc_type IN ('plan_archi','plan_structure','plan_cfo','plan_cfa','plan_cvc','plan_plomberie','plan_fluides','plan_ssi','fiche_technique','note_calcul','methodologie','pv_essai','cr_chantier','photo','courrier','contrat','boq','devis','facture','doe','plan_recollement','autre')),
  version TEXT DEFAULT '1.0',
  emitter TEXT,
  status TEXT DEFAULT 'brouillon' CHECK (status IN ('brouillon','soumis','en_revue','approuve','approuve_commentaires','refuse','obsolete')),
  file_url TEXT,
  file_name TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. EQUIPMENT (BIOMEDICAL AND TECHNICAL)
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  room_id UUID REFERENCES chantier_rooms(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES chantier_zones(id) ON DELETE SET NULL,
  code TEXT,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('biomédical','electromédical','imagerie','laboratoire','bloc','stérilisation','mobilier_médical','equipement_technique','autre')),
  brand TEXT,
  model TEXT,
  quantity INTEGER DEFAULT 1,
  supplier TEXT,
  status TEXT DEFAULT 'a_definir' CHECK (status IN ('a_definir','fiche_attendue','valide','commande','fabrication','transit','douane','livre','installe','teste','mis_en_service','receptionne','bloque')),
  power_kw NUMERIC(6,2),
  needs_network BOOLEAN DEFAULT FALSE,
  needs_plomberie BOOLEAN DEFAULT FALSE,
  needs_fluides BOOLEAN DEFAULT FALSE,
  needs_cvc BOOLEAN DEFAULT FALSE,
  weight_kg NUMERIC(8,2),
  dimensions TEXT,
  delivery_planned DATE,
  delivery_actual DATE,
  installation_date DATE,
  commissioning_date DATE,
  warranty_months INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. PROCUREMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_procurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  reference TEXT,
  description TEXT NOT NULL,
  supplier TEXT,
  quantity NUMERIC(10,2),
  unit TEXT,
  order_date DATE,
  delivery_planned DATE,
  delivery_actual DATE,
  status TEXT DEFAULT 'non_commande' CHECK (status IN ('non_commande','demande_prix','commande','fabrication','transport','douane','livre_partiel','livre_complet','refuse','installe')),
  criticality TEXT DEFAULT 'normale' CHECK (criticality IN ('faible','normale','elevee','critique')),
  planning_impact TEXT,
  responsible TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 11. BOQ ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  task_id UUID REFERENCES chantier_tasks(id) ON DELETE SET NULL,
  code TEXT,
  description TEXT NOT NULL,
  unit TEXT,
  qty_contractual NUMERIC(12,3),
  unit_price NUMERIC(12,2),
  amount_contractual NUMERIC(15,2),
  qty_executed NUMERIC(12,3) DEFAULT 0,
  qty_validated NUMERIC(12,3) DEFAULT 0,
  amount_executed NUMERIC(15,2) DEFAULT 0,
  amount_validated NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 12. PAYMENT REQUESTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  request_number TEXT,
  period TEXT,
  amount_requested NUMERIC(15,2),
  amount_approved NUMERIC(15,2),
  amount_paid NUMERIC(15,2) DEFAULT 0,
  retention_pct NUMERIC(5,2) DEFAULT 5,
  status TEXT DEFAULT 'soumis' CHECK (status IN ('soumis','en_verification','approuve','en_paiement','paye','rejete','bloque')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 13. MEETINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_type TEXT DEFAULT 'chantier' CHECK (meeting_type IN ('chantier','coordination','technique','reception','urgence','autre')),
  meeting_date TIMESTAMPTZ,
  location TEXT,
  participants TEXT[],
  agenda TEXT,
  decisions TEXT,
  next_meeting_date TIMESTAMPTZ,
  status TEXT DEFAULT 'planifiee' CHECK (status IN ('planifiee','en_cours','terminee','annulee')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 14. MEETING ACTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_meeting_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES chantier_meetings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  responsible TEXT,
  due_date DATE,
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente','en_cours','fait','annule')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 15. DAILY REPORTS (JOURNAL DE CHANTIER)
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  weather TEXT,
  temperature_c INTEGER,
  total_workers INTEGER DEFAULT 0,
  work_done TEXT,
  zones_worked TEXT[],
  incidents TEXT,
  visits TEXT,
  instructions TEXT,
  blockers TEXT,
  reporter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 16. TESTS & COMMISSIONING
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES chantier_lots(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES chantier_zones(id) ON DELETE SET NULL,
  system_name TEXT NOT NULL,
  test_type TEXT CHECK (test_type IN ('intermediaire','final','opr','reception')),
  planned_date DATE,
  actual_date DATE,
  responsible TEXT,
  result TEXT CHECK (result IN ('non_realise','conforme','non_conforme','a_reprendre')),
  status TEXT DEFAULT 'non_planifie' CHECK (status IN ('non_planifie','planifie','en_cours','conforme','non_conforme','a_reprendre','valide')),
  pv_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 17. RISKS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('delai','cout','qualite','securite','technique','approvisionnement','administratif','autre')),
  probability INTEGER CHECK (probability BETWEEN 1 AND 5),
  impact INTEGER CHECK (impact BETWEEN 1 AND 5),
  criticality INTEGER GENERATED ALWAYS AS (probability * impact) STORED,
  responsible TEXT,
  action_plan TEXT,
  due_date DATE,
  status TEXT DEFAULT 'identifie' CHECK (status IN ('identifie','en_cours','mitige','resolu','accepte','surveille')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 18. FLUID SYSTEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_fluid_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  fluid_type TEXT CHECK (fluid_type IN ('O2','VIDE','AIR_MEDICAL','PROTOXYDE','EF','EC','EU','EP')),
  source_location TEXT,
  network_installed BOOLEAN DEFAULT FALSE,
  pressure_test_done BOOLEAN DEFAULT FALSE,
  leakage_test_done BOOLEAN DEFAULT FALSE,
  identification_done BOOLEAN DEFAULT FALSE,
  pv_signed BOOLEAN DEFAULT FALSE,
  doe_submitted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 19. NOTIFICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS chantier_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES chantier_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','warning','error','success')),
  entity_type TEXT,
  entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE chantier_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_meeting_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_fluid_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantier_notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything (can be restricted by role later)
CREATE POLICY "authenticated_all" ON chantier_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_lots FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_task_dependencies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_zones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_rooms FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_reservations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_equipment FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_procurements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_boq_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_payment_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_meeting_actions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_daily_reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_tests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_risks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_fluid_systems FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON chantier_notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables that have the column
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_lots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_task_dependencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_procurements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_boq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_payment_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_meeting_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_daily_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chantier_fluid_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
