-- ============================================================
-- NASSIB v2 — Schéma room-centric
-- Polyclinique Cité Nassib — Pilotage de chantier hospitalier
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROJET
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_projet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(200) NOT NULL DEFAULT 'Polyclinique Cité Nassib',
  localisation VARCHAR(200),
  maitre_ouvrage VARCHAR(200),
  maitre_oeuvre VARCHAR(200),
  entrepreneur_general VARCHAR(200),
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  budget_total DECIMAL(15,2),
  surface_totale DECIMAL(10,2),
  nb_lits INTEGER,
  statut VARCHAR(50) DEFAULT 'En cours',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  nom VARCHAR(200) NOT NULL,
  etage VARCHAR(50),
  type_plan VARCHAR(100),
  version VARCHAR(20) DEFAULT 'A',
  date_revision DATE,
  url_fichier TEXT,
  statut VARCHAR(50) DEFAULT 'En cours',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. LOCAUX (TABLE CENTRALE)
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_locaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) UNIQUE NOT NULL,
  nom VARCHAR(200) NOT NULL,
  etage VARCHAR(50) NOT NULL,
  batiment VARCHAR(50),
  surface DECIMAL(8,2),
  hauteur DECIMAL(5,2),
  role_fonctionnel VARCHAR(200),
  departement VARCHAR(100),
  service VARCHAR(100),
  type_local VARCHAR(100),
  capacite INTEGER,
  -- Résumé besoins techniques
  nb_prises_cfo INTEGER DEFAULT 0,
  nb_prises_rj45 INTEGER DEFAULT 0,
  has_gaz_medicaux BOOLEAN DEFAULT FALSE,
  has_cvc BOOLEAN DEFAULT FALSE,
  has_plomberie BOOLEAN DEFAULT FALSE,
  -- Statut
  statut VARCHAR(50) DEFAULT 'En attente',
  avancement INTEGER DEFAULT 0,
  prerequis_installation TEXT,
  notes TEXT,
  plan_id UUID REFERENCES nassib_plans(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. BESOINS TECHNIQUES PAR LOCAL
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_besoins_cfo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES nassib_locaux(id) ON DELETE CASCADE,
  nb_prises_220v INTEGER DEFAULT 0,
  nb_prises_ups INTEGER DEFAULT 0,
  nb_prises_secours INTEGER DEFAULT 0,
  nb_eclairages INTEGER DEFAULT 0,
  puissance_kva DECIMAL(8,2),
  notes TEXT,
  statut VARCHAR(50) DEFAULT 'Non défini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_besoins_cfa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES nassib_locaux(id) ON DELETE CASCADE,
  nb_prises_rj45 INTEGER DEFAULT 0,
  nb_prises_telephone INTEGER DEFAULT 0,
  nb_cameras INTEGER DEFAULT 0,
  has_interphone BOOLEAN DEFAULT FALSE,
  has_appel_malade BOOLEAN DEFAULT FALSE,
  has_alarme_incendie BOOLEAN DEFAULT FALSE,
  has_tv BOOLEAN DEFAULT FALSE,
  notes TEXT,
  statut VARCHAR(50) DEFAULT 'Non défini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_besoins_gaz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES nassib_locaux(id) ON DELETE CASCADE,
  nb_prises_o2 INTEGER DEFAULT 0,
  nb_prises_vide INTEGER DEFAULT 0,
  nb_prises_air_medical INTEGER DEFAULT 0,
  nb_prises_n2o INTEGER DEFAULT 0,
  nb_prises_co2 INTEGER DEFAULT 0,
  debit_o2 DECIMAL(8,2),
  pression_o2 DECIMAL(5,2),
  notes TEXT,
  statut VARCHAR(50) DEFAULT 'Non défini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_besoins_cvc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES nassib_locaux(id) ON DELETE CASCADE,
  type_ventilation VARCHAR(100),
  debit_soufflage DECIMAL(8,2),
  debit_extraction DECIMAL(8,2),
  renouvellements_heure DECIMAL(5,1),
  classe_proprete VARCHAR(20),
  temperature_cible DECIMAL(5,2),
  hygrometrie_cible INTEGER,
  surpression BOOLEAN DEFAULT FALSE,
  notes TEXT,
  statut VARCHAR(50) DEFAULT 'Non défini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_besoins_plomberie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES nassib_locaux(id) ON DELETE CASCADE,
  nb_lavabos INTEGER DEFAULT 0,
  nb_eviers INTEGER DEFAULT 0,
  nb_douches INTEGER DEFAULT 0,
  nb_wc INTEGER DEFAULT 0,
  nb_points_eau INTEGER DEFAULT 0,
  eau_chaude BOOLEAN DEFAULT FALSE,
  notes TEXT,
  statut VARCHAR(50) DEFAULT 'Non défini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. ENTREPRISES
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_entreprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(200) NOT NULL,
  type VARCHAR(100),
  specialite VARCHAR(200),
  contact VARCHAR(200),
  telephone VARCHAR(50),
  email VARCHAR(200),
  statut VARCHAR(50) DEFAULT 'Actif',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. BOQ — LOTS ET LIGNES
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_boq_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) UNIQUE NOT NULL,
  nom VARCHAR(200) NOT NULL,
  type_lot VARCHAR(50),
  montant_total DECIMAL(15,2) DEFAULT 0,
  montant_paye DECIMAL(15,2) DEFAULT 0,
  avancement INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'Non démarré',
  entreprise_id UUID REFERENCES nassib_entreprises(id),
  notes TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_boq_lignes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES nassib_boq_lots(id) ON DELETE CASCADE,
  code VARCHAR(50),
  designation TEXT NOT NULL,
  unite VARCHAR(30),
  quantite DECIMAL(12,3) DEFAULT 0,
  prix_unitaire DECIMAL(12,2) DEFAULT 0,
  montant DECIMAL(15,2) DEFAULT 0,
  avancement INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'Non démarré',
  local_id UUID REFERENCES nassib_locaux(id),
  notes TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PLANNING
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_planning_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE,
  nom VARCHAR(200) NOT NULL,
  date_debut DATE,
  date_fin DATE,
  avancement INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'Non démarré',
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_planning_taches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES nassib_planning_phases(id),
  local_id UUID REFERENCES nassib_locaux(id),
  lot_id UUID REFERENCES nassib_boq_lots(id),
  entreprise_id UUID REFERENCES nassib_entreprises(id),
  code VARCHAR(50),
  nom VARCHAR(200) NOT NULL,
  responsable VARCHAR(200),
  date_debut_prevue DATE,
  date_fin_prevue DATE,
  date_debut_reelle DATE,
  date_fin_reelle DATE,
  duree_jours INTEGER,
  avancement INTEGER DEFAULT 0,
  priorite VARCHAR(20) DEFAULT 'Normale',
  statut VARCHAR(50) DEFAULT 'Non démarré',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. LOTS TECHNIQUES
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_lots_techniques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boq_lot_id UUID REFERENCES nassib_boq_lots(id),
  entreprise_id UUID REFERENCES nassib_entreprises(id),
  code VARCHAR(30) UNIQUE,
  nom VARCHAR(200) NOT NULL,
  type_lot VARCHAR(50),
  montant_marche DECIMAL(15,2),
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  avancement INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'Non démarré',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ÉQUIPEMENTS BIOMÉDICAUX
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_equipements_biomedicaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES nassib_locaux(id),
  boq_ligne_id UUID REFERENCES nassib_boq_lignes(id),
  code VARCHAR(50),
  nom VARCHAR(200) NOT NULL,
  categorie VARCHAR(100),
  marque VARCHAR(100),
  modele VARCHAR(100),
  numero_serie VARCHAR(100),
  fournisseur_id UUID,
  prix_unitaire DECIMAL(12,2),
  quantite INTEGER DEFAULT 1,
  date_commande DATE,
  date_livraison_prevue DATE,
  date_livraison_reelle DATE,
  date_installation DATE,
  date_validation DATE,
  statut VARCHAR(50) DEFAULT 'Non commandé',
  prerequis TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. MOBILIER
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_mobilier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES nassib_locaux(id),
  code VARCHAR(50),
  designation VARCHAR(200) NOT NULL,
  type_mobilier VARCHAR(50),
  marque VARCHAR(100),
  quantite INTEGER DEFAULT 1,
  prix_unitaire DECIMAL(12,2),
  fournisseur_id UUID,
  statut VARCHAR(50) DEFAULT 'Non commandé',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. FOURNISSEURS & COMMANDES
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_fournisseurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(200) NOT NULL,
  type VARCHAR(100),
  pays VARCHAR(100),
  contact VARCHAR(200),
  telephone VARCHAR(50),
  email VARCHAR(200),
  delai_livraison_jours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE,
  fournisseur_id UUID REFERENCES nassib_fournisseurs(id),
  date_commande DATE,
  date_livraison_prevue DATE,
  date_livraison_reelle DATE,
  montant_total DECIMAL(15,2),
  statut VARCHAR(50) DEFAULT 'En cours',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. APPROVISIONNEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_approvisionnements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID REFERENCES nassib_commandes(id),
  local_id UUID REFERENCES nassib_locaux(id),
  code VARCHAR(50),
  designation VARCHAR(200) NOT NULL,
  categorie VARCHAR(100),
  quantite_commandee DECIMAL(12,3),
  quantite_recue DECIMAL(12,3) DEFAULT 0,
  unite VARCHAR(30),
  prix_unitaire DECIMAL(12,2),
  fournisseur_id UUID REFERENCES nassib_fournisseurs(id),
  date_besoin DATE,
  date_commande DATE,
  date_livraison_prevue DATE,
  date_livraison_reelle DATE,
  statut VARCHAR(50) DEFAULT 'Non commandé',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. LOGISTIQUE & LIVRAISONS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_livraisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID REFERENCES nassib_commandes(id),
  date_livraison DATE,
  transporteur VARCHAR(200),
  bon_livraison VARCHAR(100),
  lieu_depot VARCHAR(200),
  statut VARCHAR(50) DEFAULT 'Attendue',
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. RÉUNIONS & DÉCISIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_reunions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(30),
  titre VARCHAR(200) NOT NULL,
  type_reunion VARCHAR(100),
  date_reunion TIMESTAMPTZ,
  lieu VARCHAR(200),
  animateur VARCHAR(200),
  participants TEXT[],
  ordre_du_jour TEXT,
  compte_rendu TEXT,
  statut VARCHAR(50) DEFAULT 'Planifiée',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nassib_decisions_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reunion_id UUID REFERENCES nassib_reunions(id),
  local_id UUID REFERENCES nassib_locaux(id),
  lot_id UUID REFERENCES nassib_lots_techniques(id),
  type VARCHAR(50) DEFAULT 'Action',
  description TEXT NOT NULL,
  responsable VARCHAR(200),
  date_echeance DATE,
  statut VARCHAR(50) DEFAULT 'En cours',
  priorite VARCHAR(20) DEFAULT 'Normale',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. RÉSERVES ET NON-CONFORMITÉS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_reserves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES nassib_locaux(id),
  lot_id UUID REFERENCES nassib_lots_techniques(id),
  tache_id UUID REFERENCES nassib_planning_taches(id),
  code VARCHAR(30),
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  type_reserve VARCHAR(50),
  gravite VARCHAR(20) DEFAULT 'Mineure',
  responsable_levee VARCHAR(200),
  date_constatation DATE DEFAULT CURRENT_DATE,
  date_echeance DATE,
  date_levee DATE,
  statut VARCHAR(50) DEFAULT 'Ouverte',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. ESSAIS ET RECETTE
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_essais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES nassib_locaux(id),
  lot_id UUID REFERENCES nassib_lots_techniques(id),
  code VARCHAR(50),
  nom VARCHAR(200) NOT NULL,
  type_essai VARCHAR(100),
  norme VARCHAR(200),
  date_prevue DATE,
  date_realisee DATE,
  responsable VARCHAR(200),
  resultat VARCHAR(50),
  valeur_mesuree TEXT,
  valeur_attendue TEXT,
  observations TEXT,
  statut VARCHAR(50) DEFAULT 'Planifié',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 17. PAIEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_paiements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID REFERENCES nassib_boq_lots(id),
  entreprise_id UUID REFERENCES nassib_entreprises(id),
  numero_situation VARCHAR(50),
  montant_situation DECIMAL(15,2),
  montant_valide DECIMAL(15,2),
  montant_retenu DECIMAL(15,2) DEFAULT 0,
  date_situation DATE,
  date_validation DATE,
  date_paiement DATE,
  statut VARCHAR(50) DEFAULT 'En attente',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 18. RÉCEPTION PAR LOCAL
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_reception_locaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES nassib_locaux(id) ON DELETE CASCADE,
  date_visite DATE,
  visiteurs TEXT[],
  cfo_ok BOOLEAN DEFAULT FALSE,
  cfa_ok BOOLEAN DEFAULT FALSE,
  reseau_ok BOOLEAN DEFAULT FALSE,
  gaz_ok BOOLEAN DEFAULT FALSE,
  cvc_ok BOOLEAN DEFAULT FALSE,
  plomberie_ok BOOLEAN DEFAULT FALSE,
  equipements_ok BOOLEAN DEFAULT FALSE,
  mobilier_ok BOOLEAN DEFAULT FALSE,
  nettoyage_ok BOOLEAN DEFAULT FALSE,
  nb_reserves INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'Non visité',
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 19. DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES nassib_locaux(id),
  reunion_id UUID REFERENCES nassib_reunions(id),
  lot_id UUID REFERENCES nassib_lots_techniques(id),
  code VARCHAR(50),
  titre VARCHAR(200) NOT NULL,
  type_document VARCHAR(100),
  version VARCHAR(20) DEFAULT 'A',
  date_document DATE,
  auteur VARCHAR(200),
  url_fichier TEXT,
  statut VARCHAR(50) DEFAULT 'En cours',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 20. PHOTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS nassib_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES nassib_locaux(id),
  reserve_id UUID REFERENCES nassib_reserves(id),
  titre VARCHAR(200),
  description TEXT,
  url_fichier TEXT,
  date_prise TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEX POUR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_nassib_locaux_etage ON nassib_locaux(etage);
CREATE INDEX IF NOT EXISTS idx_nassib_locaux_departement ON nassib_locaux(departement);
CREATE INDEX IF NOT EXISTS idx_nassib_locaux_statut ON nassib_locaux(statut);
CREATE INDEX IF NOT EXISTS idx_nassib_besoins_cfo_local ON nassib_besoins_cfo(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_besoins_cfa_local ON nassib_besoins_cfa(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_besoins_gaz_local ON nassib_besoins_gaz(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_besoins_cvc_local ON nassib_besoins_cvc(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_besoins_plomb_local ON nassib_besoins_plomberie(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_boq_lignes_lot ON nassib_boq_lignes(lot_id);
CREATE INDEX IF NOT EXISTS idx_nassib_boq_lignes_local ON nassib_boq_lignes(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_taches_local ON nassib_planning_taches(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_taches_phase ON nassib_planning_taches(phase_id);
CREATE INDEX IF NOT EXISTS idx_nassib_equip_local ON nassib_equipements_biomedicaux(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_reserves_local ON nassib_reserves(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_reserves_statut ON nassib_reserves(statut);
CREATE INDEX IF NOT EXISTS idx_nassib_essais_local ON nassib_essais(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_docs_local ON nassib_documents(local_id);
CREATE INDEX IF NOT EXISTS idx_nassib_reception_local ON nassib_reception_locaux(local_id);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE nassib_projet ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_locaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_besoins_cfo ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_besoins_cfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_besoins_gaz ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_besoins_cvc ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_besoins_plomberie ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_entreprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_boq_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_boq_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_planning_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_planning_taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_lots_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_equipements_biomedicaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_mobilier ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_approvisionnements ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_livraisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_reunions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_decisions_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_reserves ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_essais ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_reception_locaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE nassib_photos ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can do everything
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'nassib_projet','nassib_plans','nassib_locaux',
    'nassib_besoins_cfo','nassib_besoins_cfa','nassib_besoins_gaz',
    'nassib_besoins_cvc','nassib_besoins_plomberie','nassib_entreprises',
    'nassib_boq_lots','nassib_boq_lignes','nassib_planning_phases',
    'nassib_planning_taches','nassib_lots_techniques',
    'nassib_equipements_biomedicaux','nassib_mobilier','nassib_fournisseurs',
    'nassib_commandes','nassib_approvisionnements','nassib_livraisons',
    'nassib_reunions','nassib_decisions_actions','nassib_reserves',
    'nassib_essais','nassib_paiements','nassib_reception_locaux',
    'nassib_documents','nassib_photos'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('CREATE POLICY IF NOT EXISTS "%s_auth_all" ON %s FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;
