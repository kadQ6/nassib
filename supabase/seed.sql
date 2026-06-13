-- =============================================================================
-- POLYCLINIQUE CONSTRUCTION MANAGEMENT - SEED DATA
-- Demo data for Polyclinique Cité Nassib, Djibouti
-- All UUIDs are hardcoded for stable FK references
-- =============================================================================

-- =============================================================================
-- PROJECT
-- =============================================================================
INSERT INTO chantier_projects (
  id, name, description, location, client,
  start_date, end_date_contractual, end_date_revised, end_date_forecast,
  status, budget_total, budget_consumed,
  progress_planned, progress_real
) VALUES (
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Polyclinique Cité Nassib',
  'Construction d''une polyclinique moderne avec bloc opératoire, maternité, urgences, hospitalisation et plateau technique complet. Capacité : 80 lits, 4 salles de bloc, maternité 20 lits.',
  'Cité Nassib, Djibouti',
  'Ministère de la Santé - République de Djibouti',
  '2025-06-01',
  '2027-01-31',
  '2027-03-31',
  '2027-04-30',
  'en_cours',
  850000000.00,
  323000000.00,
  45.00,
  38.00
);

-- =============================================================================
-- LOTS (8 work packages)
-- =============================================================================
INSERT INTO chantier_lots (id, project_id, code, name, category, contractor, contact_name, contact_phone, budget, progress, status, color) VALUES
(
  'b1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-GC', 'Gros Œuvre / Structure', 'GC',
  'SETAB Construction', 'Ahmed Hassan Moussa', '+253 77 12 34 56',
  280000000.00, 52.00, 'en_cours', '#EF4444'
),
(
  'b1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-CFO', 'Courant Fort (Électricité)', 'CFO',
  'ElecPro Djibouti', 'Omar Farah Ismail', '+253 77 23 45 67',
  95000000.00, 35.00, 'en_cours', '#F59E0B'
),
(
  'b1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-CFA', 'Courant Faible & Réseaux', 'CFA',
  'TechSécurité', 'Ibrahim Ali Daoud', '+253 77 34 56 78',
  42000000.00, 20.00, 'en_cours', '#8B5CF6'
),
(
  'b1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-CVC', 'Climatisation & Ventilation', 'CVC',
  'ClimaMed', 'Hodan Abdi Warsame', '+253 77 45 67 89',
  68000000.00, 28.00, 'en_cours', '#06B6D4'
),
(
  'b1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-PLB', 'Plomberie Sanitaire', 'PLOMBERIE',
  'AquaMed', 'Safia Mohamed Dini', '+253 77 56 78 90',
  38000000.00, 42.00, 'en_cours', '#10B981'
),
(
  'b1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-FLU', 'Fluides Médicaux', 'FLUIDES',
  'MedGaz', 'Youssouf Hassan Gedi', '+253 77 67 89 01',
  55000000.00, 15.00, 'en_cours', '#3B82F6'
),
(
  'b1000007-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-VRD', 'Voirie & Réseaux Divers', 'VRD',
  'SETAB Construction', 'Ahmed Hassan Moussa', '+253 77 12 34 56',
  32000000.00, 65.00, 'en_cours', '#84CC16'
),
(
  'b1000008-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'LOT-BIO', 'Équipements Biomédicaux', 'BIOMÉDICAL',
  'MediEquip', 'Anab Elmi Hassan', '+253 77 78 90 12',
  240000000.00, 10.00, 'non_demarre', '#EC4899'
);

-- =============================================================================
-- TASKS (10 WBS tasks covering main phases)
-- =============================================================================
INSERT INTO chantier_tasks (
  id, project_id, lot_id, wbs_code, name, description,
  phase, phase_name, type,
  planned_start, planned_end, actual_start,
  duration_days, progress, status,
  responsible, risk_level, is_critical_path, is_milestone
) VALUES
-- Phase 1: Travaux préparatoires (completed)
(
  'c1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  '1.0', 'Travaux préparatoires & Installation de chantier',
  'Clôture, base vie, dépôts, voies d''accès temporaires, VRD préparatoires',
  1, 'Préparation', 'phase',
  '2025-06-01', '2025-08-31', '2025-06-03',
  91, 100.00, 'termine',
  'Ahmed Hassan Moussa', 'faible', TRUE, FALSE
),
-- Phase 2: Fondations (completed)
(
  'c1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  '2.0', 'Fondations & Infrastructure',
  'Terrassement général, fouilles, semelles filantes, radiers, longrines',
  2, 'Fondations', 'phase',
  '2025-08-01', '2025-11-30', '2025-08-05',
  121, 100.00, 'termine',
  'Ahmed Hassan Moussa', 'moyen', TRUE, FALSE
),
-- Phase 3: Structure (en cours)
(
  'c1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  '3.0', 'Structure Béton Armé RDC & R+1',
  'Poteaux, poutres, dalles RDC et R+1. Escaliers et gaines techniques.',
  3, 'Structure', 'phase',
  '2025-11-01', '2026-05-31', '2025-11-10',
  210, 75.00, 'en_cours',
  'Ahmed Hassan Moussa', 'eleve', TRUE, FALSE
),
-- Phase 4: Maçonnerie (en cours)
(
  'c1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  '4.0', 'Maçonnerie & Cloisonnement',
  'Murs périphériques, cloisons intérieures, ouvertures menuiseries',
  4, 'Maçonnerie', 'task',
  '2026-02-01', '2026-08-31', '2026-02-15',
  210, 35.00, 'en_cours',
  'Ahmed Hassan Moussa', 'moyen', FALSE, FALSE
),
-- Phase 5: CFO (démarré)
(
  'c1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  '5.0', 'Installations Électriques Courant Fort',
  'TGBT, distribution HTA/BT, groupe électrogène, éclairage, prises, UPS',
  5, 'Second Œuvre CFO', 'task',
  '2026-03-01', '2026-10-31', '2026-03-10',
  245, 30.00, 'en_cours',
  'Omar Farah Ismail', 'moyen', FALSE, FALSE
),
-- Phase 6: CVC (démarré)
(
  'c1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000004-0001-0001-0001-000000000001',
  '6.0', 'Climatisation & Traitement d''Air',
  'Centrale de traitement d''air, splits, ventilation mécanique, salle blanche bloc',
  6, 'Second Œuvre CVC', 'task',
  '2026-04-01', '2026-11-30', '2026-04-05',
  243, 25.00, 'en_cours',
  'Hodan Abdi Warsame', 'eleve', TRUE, FALSE
),
-- Phase 7: Fluides médicaux (non démarré)
(
  'c1000007-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  '7.0', 'Réseaux Fluides Médicaux',
  'O2, vide médical, air médical, N2O. Centrales techniques et distribution aux têtes de lit.',
  7, 'Fluides Médicaux', 'task',
  '2026-05-01', '2026-12-31', NULL,
  245, 8.00, 'en_cours',
  'Youssouf Hassan Gedi', 'critique', TRUE, FALSE
),
-- Phase 8: Finitions (non démarré)
(
  'c1000008-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  '8.0', 'Finitions & Revêtements',
  'Carrelage, faïence, peinture, faux-plafonds, menuiseries intérieures',
  8, 'Finitions', 'task',
  '2026-07-01', '2027-01-31', NULL,
  214, 0.00, 'non_demarre',
  'Ahmed Hassan Moussa', 'moyen', FALSE, FALSE
),
-- Milestone: Réception provisoire
(
  'c1000009-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  NULL,
  '9.0', 'Réception Provisoire',
  'Réception provisoire des travaux par le maître d''ouvrage',
  9, 'Réception', 'milestone',
  '2027-03-31', '2027-03-31', NULL,
  0, 0.00, 'non_demarre',
  'Direction de Projet', 'eleve', TRUE, TRUE
),
-- Phase 9: Biomedical install (non démarré)
(
  'c1000010-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000008-0001-0001-0001-000000000001',
  '10.0', 'Installation & Mise en Service Équipements Biomédicaux',
  'Livraison, installation, qualification IQ/OQ/PQ des équipements biomédicaux et electro-médicaux',
  10, 'Équipements', 'task',
  '2026-11-01', '2027-03-15', NULL,
  135, 0.00, 'non_demarre',
  'Anab Elmi Hassan', 'critique', TRUE, FALSE
);

-- =============================================================================
-- TASK DEPENDENCIES
-- =============================================================================
INSERT INTO chantier_task_dependencies (id, task_id, depends_on_id, type, lag_days) VALUES
('d1000001-0001-0001-0001-000000000001', 'c1000002-0001-0001-0001-000000000001', 'c1000001-0001-0001-0001-000000000001', 'FS', 0),
('d1000002-0001-0001-0001-000000000001', 'c1000003-0001-0001-0001-000000000001', 'c1000002-0001-0001-0001-000000000001', 'FS', 0),
('d1000003-0001-0001-0001-000000000001', 'c1000004-0001-0001-0001-000000000001', 'c1000003-0001-0001-0001-000000000001', 'SS', 30),
('d1000004-0001-0001-0001-000000000001', 'c1000005-0001-0001-0001-000000000001', 'c1000004-0001-0001-0001-000000000001', 'SS', 14),
('d1000005-0001-0001-0001-000000000001', 'c1000006-0001-0001-0001-000000000001', 'c1000004-0001-0001-0001-000000000001', 'SS', 30),
('d1000006-0001-0001-0001-000000000001', 'c1000007-0001-0001-0001-000000000001', 'c1000004-0001-0001-0001-000000000001', 'SS', 45),
('d1000007-0001-0001-0001-000000000001', 'c1000008-0001-0001-0001-000000000001', 'c1000004-0001-0001-0001-000000000001', 'FS', 0),
('d1000008-0001-0001-0001-000000000001', 'c1000010-0001-0001-0001-000000000001', 'c1000008-0001-0001-0001-000000000001', 'SS', 60),
('d1000009-0001-0001-0001-000000000001', 'c1000009-0001-0001-0001-000000000001', 'c1000010-0001-0001-0001-000000000001', 'FS', 14);

-- =============================================================================
-- ZONES FONCTIONNELLES (5 zones)
-- =============================================================================
INSERT INTO chantier_zones (id, project_id, code, name, functional_type, floor, area_sqm, status, progress) VALUES
(
  'e1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Z-ACC', 'Accueil & Administration', 'accueil',
  'RDC', 420.00, 'en_travaux', 45.00
),
(
  'e1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Z-URG', 'Urgences & Traumatologie', 'urgences',
  'RDC', 380.00, 'en_travaux', 38.00
),
(
  'e1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Z-BLOC', 'Bloc Opératoire & Maternité', 'bloc',
  'R+1', 650.00, 'termine_brut', 55.00
),
(
  'e1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Z-HOSP', 'Hospitalisation & Chambres', 'hospitalisation',
  'R+1', 820.00, 'en_travaux', 30.00
),
(
  'e1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Z-TECH', 'Locaux Techniques & Communs', 'technique',
  'RDC', 290.00, 'en_travaux', 60.00
);

-- =============================================================================
-- ROOMS (10 rooms)
-- =============================================================================
INSERT INTO chantier_rooms (
  id, zone_id, project_id, code, name, floor, area_sqm, status, progress,
  needs_cfo, needs_cfa, needs_cvc, needs_plomberie, needs_fluides_medicaux, needs_mobilier, needs_ssi, notes
) VALUES
(
  'f1000001-0001-0001-0001-000000000001',
  'e1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'ACC-01', 'Hall d''Accueil Principal', 'RDC', 85.00, 'en_travaux', 50.00,
  TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE,
  'Comptoir d''accueil central, salle d''attente 30 places'
),
(
  'f1000002-0001-0001-0001-000000000001',
  'e1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'ACC-02', 'Secrétariat Médical', 'RDC', 32.00, 'en_travaux', 40.00,
  TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE,
  'Gestion des dossiers patients, prise de rendez-vous'
),
(
  'f1000003-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'URG-01', 'Box d''Urgence 1 - Déchoquage', 'RDC', 28.00, 'en_travaux', 35.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
  'Déchoquage adulte, 2 postes monitorés, accès chariot urgence'
),
(
  'f1000004-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'URG-02', 'Salle de Soins Urgences', 'RDC', 45.00, 'en_travaux', 30.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
  '4 box de soins urgences, infirmerie centrale'
),
(
  'f1000005-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'BLOC-01', 'Salle Opératoire Césarienne 1', 'R+1', 42.00, 'termine_brut', 60.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE,
  'Salle ISO 7, table opératoire césarienne, éclairage scialytique'
),
(
  'f1000006-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'BLOC-02', 'Salle Accouchement 1', 'R+1', 35.00, 'termine_brut', 55.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
  'Salle d''accouchement normale, table gynéco-obstétricale'
),
(
  'f1000007-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'BLOC-03', 'SSPI - Salle de Réveil', 'R+1', 55.00, 'termine_brut', 50.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
  '6 postes de réveil, monitoring continu, accès O2/vide/air médical'
),
(
  'f1000008-0001-0001-0001-000000000001',
  'e1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'HOSP-01', 'Chambre Individuelle 101', 'R+1', 22.00, 'en_travaux', 25.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE,
  'Chambre 1 lit, sanitaires privatifs, tête de lit médicalisée'
),
(
  'f1000009-0001-0001-0001-000000000001',
  'e1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'HOSP-02', 'Chambre Double 102', 'R+1', 32.00, 'en_travaux', 25.00,
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE,
  'Chambre 2 lits, sanitaires partagés, 2 têtes de lit médicalisées'
),
(
  'f1000010-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'TECH-01', 'Local Technique Principal - TGBT', 'RDC', 48.00, 'finitions', 70.00,
  TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE,
  'TGBT principal, onduleurs, tableaux de distribution, groupe électrogène'
);

-- =============================================================================
-- RESERVATIONS (15 punch list items)
-- =============================================================================
INSERT INTO chantier_reservations (
  id, project_id, reservation_number, room_id, zone_id, lot_id,
  contractor, description, severity, type,
  action_required, responsible, due_date, status
) VALUES
(
  'g1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-001',
  'f1000005-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'SETAB Construction',
  'Fissures d''angle sur mur nord salle opératoire BLOC-01 - profondeur > 3mm',
  'majeure', 'technique',
  'Injection résine époxy et reprise enduit structurel',
  'Ahmed Hassan Moussa', '2026-07-15', 'ouverte'
),
(
  'g1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-002',
  'f1000010-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'ElecPro Djibouti',
  'Tableau TGBT : câblage non conforme - couleurs non respectées sur jeu de barres BT',
  'critique', 'conformite',
  'Recâblage complet selon normes NF C 15-100 et schémas d''exécution validés',
  'Omar Farah Ismail', '2026-06-30', 'en_cours'
),
(
  'g1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-003',
  'f1000003-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'b1000005-0001-0001-0001-000000000001',
  'AquaMed',
  'Fuite détectée au niveau du siphon évier box déchoquage URG-01',
  'mineure', 'qualite',
  'Remplacement joint et reprise raccordement',
  'Safia Mohamed Dini', '2026-07-05', 'corrigee'
),
(
  'g1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-004',
  'f1000005-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'b1000004-0001-0001-0001-000000000001',
  'ClimaMed',
  'Centrale de traitement d''air salle bloc : niveau sonore excessif (>55 dB(A)) - vibrations anormales',
  'majeure', 'technique',
  'Contrôle équilibrage ventilateur, remplacement silent-blocs, vérification gaines',
  'Hodan Abdi Warsame', '2026-07-20', 'en_cours'
),
(
  'g1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-005',
  'f1000001-0001-0001-0001-000000000001',
  'e1000001-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'SETAB Construction',
  'Carrelage hall accueil : 3 dalles descellées zone de passage principal',
  'mineure', 'qualite',
  'Dépose, nettoyage support et repose avec mortier colle adapté',
  'Ahmed Hassan Moussa', '2026-07-10', 'levee'
),
(
  'g1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-006',
  'f1000006-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'MedGaz',
  'Réseau O2 salle accouchement : pression basse (2.8 bar au lieu de 4 bar requis)',
  'critique', 'securite',
  'Vérification vanne générale, test étanchéité réseau, contrôle centrale O2',
  'Youssouf Hassan Gedi', '2026-06-25', 'ouverte'
),
(
  'g1000007-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-007',
  'f1000007-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'ElecPro Djibouti',
  'SSPI : prise de courant de type médical IT manquante sur poste 3',
  'majeure', 'conformite',
  'Installation prise médicale IT conforme NF EN 60601-1 avec contrôleur d''isolement',
  'Omar Farah Ismail', '2026-08-01', 'en_cours'
),
(
  'g1000008-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-008',
  'f1000004-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'b1000003-0001-0001-0001-000000000001',
  'TechSécurité',
  'Système d''appel malade urgences : alarme sonore non fonctionnelle poste infirmier',
  'majeure', 'technique',
  'Remplacement module amplificateur et test complet système',
  'Ibrahim Ali Daoud', '2026-07-18', 'ouverte'
),
(
  'g1000009-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-009',
  'f1000002-0001-0001-0001-000000000001',
  'e1000001-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'SETAB Construction',
  'Porte secrétariat : huisserie voilée - fermeture défectueuse',
  'mineure', 'qualite',
  'Réglage ou remplacement huisserie métallique',
  'Ahmed Hassan Moussa', '2026-07-08', 'a_verifier'
),
(
  'g1000010-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-010',
  'f1000008-0001-0001-0001-000000000001',
  'e1000004-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'ElecPro Djibouti',
  'Chambre 101 : absence éclairage de nuit (veilleuse 230V) prévu aux plans',
  'mineure', 'conformite',
  'Installation veilleuse murale basse avec capteur crépusculaire',
  'Omar Farah Ismail', '2026-08-15', 'ouverte'
),
(
  'g1000011-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-011',
  NULL,
  'e1000005-0001-0001-0001-000000000001',
  'b1000004-0001-0001-0001-000000000001',
  'ClimaMed',
  'Local technique : condensats groupe froid mal raccordés - risque de stagnation eau',
  'majeure', 'qualite',
  'Reprendre raccordement condensats avec siphon et pente minimum 2%',
  'Hodan Abdi Warsame', '2026-07-12', 'ouverte'
),
(
  'g1000012-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-012',
  'f1000005-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'SETAB Construction',
  'Joint de sol époxy salle opératoire BLOC-01 : bullage et décollements partiels',
  'critique', 'qualite',
  'Reprise totale revêtement sol époxy selon spécifications bloc opératoire ISO 7',
  'Ahmed Hassan Moussa', '2026-07-30', 'ouverte'
),
(
  'g1000013-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-013',
  'f1000003-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'MedGaz',
  'Étiquetage réseau fluides médicaux non conforme : absence couleurs normalisées',
  'mineure', 'documentation',
  'Pose étiquettes conformes NF EN ISO 32 sur toutes les prises et canalisations',
  'Youssouf Hassan Gedi', '2026-08-10', 'ouverte'
),
(
  'g1000014-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-014',
  'f1000009-0001-0001-0001-000000000001',
  'e1000004-0001-0001-0001-000000000001',
  'b1000005-0001-0001-0001-000000000001',
  'AquaMed',
  'Chambre 102 : WC suspendu - hauteur fixation non conforme PMR (H=48cm au lieu de 50cm)',
  'mineure', 'conformite',
  'Dépose et repose cuvette suspendu à hauteur réglementaire PMR',
  'Safia Mohamed Dini', '2026-08-20', 'ouverte'
),
(
  'g1000015-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'RES-2026-015',
  'f1000010-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'ElecPro Djibouti',
  'Groupe électrogène 250 KVA : démarrage automatique non opérationnel - test sur coupure secteur échoué',
  'critique', 'technique',
  'Révision automatisme démarrage, remplacement contacteur ATS défectueux',
  'Omar Farah Ismail', '2026-06-28', 'en_cours'
);

-- =============================================================================
-- EQUIPMENT (10 biomedical and technical items)
-- =============================================================================
INSERT INTO chantier_equipment (
  id, project_id, room_id, zone_id, code, name, category,
  brand, model, quantity, supplier, status,
  power_kw, needs_network, needs_plomberie, needs_fluides, needs_cvc,
  weight_kg, dimensions,
  delivery_planned, warranty_months, notes
) VALUES
(
  'h1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000006-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'EQ-MAT-001', 'Table d''Accouchement Électrique', 'biomédical',
  'SCHMITZ', 'Cleo 3', 4, 'MediEquip',
  'commande',
  0.50, FALSE, FALSE, FALSE, FALSE,
  180.00, '220x80x65-92cm',
  '2026-11-15', 24,
  'Table gynéco-obstétricale tout électrique, 4 sections, accessoires maternité inclus'
),
(
  'h1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  NULL,
  'e1000003-0001-0001-0001-000000000001',
  'EQ-NEO-001', 'Couveuse Néonatale Transport', 'electromédical',
  'DRÄGER', 'Caleo', 6, 'MediEquip',
  'commande',
  0.60, TRUE, FALSE, TRUE, FALSE,
  62.00, '105x60x140cm',
  '2026-11-20', 24,
  'Couveuse néonatale avec servo-contrôle température, alarmes O2 et SpO2 intégrées'
),
(
  'h1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000005-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'EQ-BLO-001', 'Table Opératoire Césarienne', 'biomédical',
  'MAQUET', 'Betastar 1150', 2, 'MediEquip',
  'fabrication',
  1.00, FALSE, FALSE, FALSE, FALSE,
  290.00, '215x57x70-97cm',
  '2026-12-01', 36,
  'Table opératoire motorisée 5 moteurs, plateau carbone, accessoires orthopédie et gynéco'
),
(
  'h1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000007-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'EQ-MON-001', 'Moniteur de Surveillance Multiparamétrique', 'electromédical',
  'PHILIPS', 'IntelliVue MX450', 12, 'MediEquip',
  'commande',
  0.20, TRUE, FALSE, TRUE, FALSE,
  4.50, '34x27x26cm',
  '2026-11-30', 36,
  'ECG 12 dérivations, SpO2, NIBP, température, IBP x2, EtCO2. Réseau SIH intégré.'
),
(
  'h1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000003-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'EQ-DEF-001', 'Défibrillateur Moniteur', 'electromédical',
  'ZOLL', 'R Series ALS', 4, 'MediEquip',
  'valide',
  0.20, FALSE, FALSE, FALSE, FALSE,
  15.00, '33x35x26cm',
  '2026-10-15', 24,
  'Défibrillateur semi-automatique et manuel, pacing externe, SpO2, NIBP, capnographie'
),
(
  'h1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000006-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'EQ-ECH-001', 'Échographe Obstétrical Portable', 'imagerie',
  'GE Healthcare', 'Voluson E10', 3, 'MediEquip',
  'commande',
  0.80, TRUE, FALSE, FALSE, TRUE,
  38.00, '55x80x120cm',
  '2026-12-15', 36,
  'Échographie 4D obstétricale, Doppler couleur et pulsé, sonde convexe et vaginale incluses'
),
(
  'h1000007-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  NULL,
  'e1000003-0001-0001-0001-000000000001',
  'EQ-STR-001', 'Stérilisateur Autoclave Vapeur', 'stérilisation',
  'GETINGE', '88 Series 500L', 2, 'MediEquip',
  'fiche_attendue',
  9.00, TRUE, TRUE, TRUE, FALSE,
  750.00, '180x90x150cm',
  '2027-01-15', 24,
  'Autoclave 134°C / 500L, cycle pré-vide, validation ISO 17665. Raccordement eau déminéralisée requis.'
),
(
  'h1000008-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  NULL,
  'e1000005-0001-0001-0001-000000000001',
  'EQ-LABO-001', 'Hotte de Laboratoire Chimique', 'laboratoire',
  'WALDNER', 'TRESPA', 2, 'MediEquip',
  'a_definir',
  0.80, FALSE, TRUE, FALSE, TRUE,
  120.00, '150x90x230cm',
  '2027-01-30', 12,
  'Hotte aspirante chimique 1500mm, vitesse frontale 0.5 m/s, raccordement extraction VMC'
),
(
  'h1000009-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000010-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'EQ-GEN-001', 'Groupe Électrogène 250 KVA', 'equipement_technique',
  'CUMMINS', 'C275 D5', 1, 'ElecPro Djibouti',
  'installe',
  250.00, FALSE, FALSE, FALSE, FALSE,
  3200.00, '320x110x175cm',
  '2026-04-01', 24,
  'GE secours 250KVA / 200KW, démarrage automatique ATS, réservoir 1000L autonomie 48h'
),
(
  'h1000010-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'f1000010-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'EQ-UPS-001', 'UPS Central 80 KVA', 'equipement_technique',
  'SCHNEIDER', 'Galaxy VM 80kVA', 1, 'ElecPro Djibouti',
  'installe',
  80.00, TRUE, FALSE, FALSE, FALSE,
  680.00, '190x80x145cm',
  '2026-04-15', 36,
  'Onduleur central 80KVA double conversion, batteries 30min autonomie, monitoring SNMP'
);

-- =============================================================================
-- PROCUREMENTS (8 critical items)
-- =============================================================================
INSERT INTO chantier_procurements (
  id, project_id, lot_id, reference, description, supplier,
  quantity, unit, order_date, delivery_planned, delivery_actual,
  status, criticality, planning_impact, responsible, notes
) VALUES
(
  'i1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'PRO-FLU-001', 'Centrale O2 liquide médicale 3000L + évaporateur', 'Air Liquide Djibouti',
  1.00, 'unité', '2026-03-15', '2026-09-30', NULL,
  'fabrication', 'critique',
  'Livraison conditionne démarrage réseau O2 bloc et maternité - chemin critique',
  'Youssouf Hassan Gedi',
  'Homologation ANSM requise. Certificat conformité pharmacopée européenne à fournir.'
),
(
  'i1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'PRO-FLU-002', 'Centrale vide médical 2x5 m³/h redundante', 'MedGaz',
  1.00, 'unité', '2026-04-01', '2026-10-15', NULL,
  'commande', 'critique',
  'Requis avant commissioning bloc opératoire',
  'Youssouf Hassan Gedi',
  'Double pompe redundante, alarmes sonores et visuelles, connexion BMS'
),
(
  'i1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000004-0001-0001-0001-000000000001',
  'PRO-CVC-001', 'Centrale de Traitement d''Air Bloc 12 000 m³/h', 'ClimaMed',
  2.00, 'unité', '2026-02-20', '2026-08-31', NULL,
  'fabrication', 'critique',
  'CTA bloc ISO 7 sur chemin critique - livraison conditionne finitions bloc',
  'Hodan Abdi Warsame',
  'CTA double flux, filtration HEPA H14, pressurisation salle bloc. Certification CERTITA.'
),
(
  'i1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'PRO-GC-001', 'Béton prêt à l''emploi C35/45 - Phase structure R+1', 'Cimenterie de Djibouti',
  850.00, 'm³', '2026-04-10', '2026-07-31', NULL,
  'commande', 'elevee',
  'Approvisionnement en continu selon planning coulage',
  'Ahmed Hassan Moussa',
  'Béton C35/45 XC2 - Certification NF. Bordereau livraison pour chaque rotation.'
),
(
  'i1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'PRO-CFO-001', 'Transformateur HTA/BT 630 KVA + cellules MT', 'SONELEC',
  1.00, 'unité', '2026-01-15', '2026-07-15', '2026-07-08',
  'livre_complet', 'critique',
  'Livré - installation en cours local TGBT',
  'Omar Farah Ismail',
  'Transformateur 630KVA 20kV/400V + 3 cellules MT (arrivée, comptage, départ). Consuel requis.'
),
(
  'i1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000005-0001-0001-0001-000000000001',
  'PRO-PLB-001', 'Réseau alimentation eau chaude solaire 5000L/j', 'AquaMed',
  1.00, 'lot', '2026-03-01', '2026-09-30', NULL,
  'demande_prix', 'elevee',
  'Installation conditionnée par fin gros œuvre toiture',
  'Safia Mohamed Dini',
  'Capteurs solaires thermiques + ballon tampon 2x2500L + régulation. Certification CSTB.'
),
(
  'i1000007-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000003-0001-0001-0001-000000000001',
  'PRO-CFA-001', 'Système de détection incendie 350 points adressables', 'TechSécurité',
  1.00, 'système', '2026-04-20', '2026-10-31', NULL,
  'commande', 'elevee',
  'SSI type A - agrément CNPP requis pour réception',
  'Ibrahim Ali Daoud',
  'Centrale SSI catégorie A, détecteurs optiques adressables, diffuseurs sonores NF, report pompiers.'
),
(
  'i1000008-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'PRO-GC-002', 'Armatures acier HA FeE500 - Phase structure R+1', 'Acier Djibouti',
  185.00, 'tonnes', '2026-04-05', '2026-06-30', '2026-06-20',
  'livre_partiel', 'elevee',
  '120T livrées sur 185T commandées - solde attendu juillet',
  'Ahmed Hassan Moussa',
  'Acier HA FeE500 NF. Certificats matière requis par lot de livraison. 65T restantes à livrer.'
);

-- =============================================================================
-- BOQ ITEMS (5 items)
-- =============================================================================
INSERT INTO chantier_boq_items (
  id, project_id, lot_id, task_id, code, description, unit,
  qty_contractual, unit_price, amount_contractual,
  qty_executed, qty_validated, amount_executed, amount_validated
) VALUES
(
  'j1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'c1000003-0001-0001-0001-000000000001',
  'GC-STR-001', 'Béton armé C35/45 pour poteaux et poutres RDC et R+1', 'm³',
  1250.000, 28500.00, 35625000.00,
  820.000, 780.000, 23370000.00, 22230000.00
),
(
  'j1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000001-0001-0001-0001-000000000001',
  'c1000003-0001-0001-0001-000000000001',
  'GC-STR-002', 'Armatures acier HA FeE500 - structure poteaux poutres', 'kg',
  185000.000, 320.00, 59200000.00,
  120000.000, 115000.000, 38400000.00, 36800000.00
),
(
  'j1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'c1000005-0001-0001-0001-000000000001',
  'CFO-TGBT-001', 'Fourniture et pose TGBT principal 630A avec comptage et protection', 'ens',
  1.000, 8500000.00, 8500000.00,
  0.500, 0.000, 4250000.00, 0.00
),
(
  'j1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000004-0001-0001-0001-000000000001',
  'c1000006-0001-0001-0001-000000000001',
  'CVC-CTA-001', 'Fourniture et installation CTA bloc opératoire double flux HEPA', 'ens',
  2.000, 12500000.00, 25000000.00,
  0.000, 0.000, 0.00, 0.00
),
(
  'j1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'c1000007-0001-0001-0001-000000000001',
  'FLU-O2-001', 'Réseau distribution O2 médical - canalisations cuivre et prises murales', 'm',
  1800.000, 4200.00, 7560000.00,
  200.000, 150.000, 840000.00, 630000.00
);

-- =============================================================================
-- MEETINGS (5 meetings)
-- =============================================================================
INSERT INTO chantier_meetings (
  id, project_id, title, meeting_type, meeting_date, location,
  participants, agenda, decisions, next_meeting_date, status
) VALUES
(
  'k1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Réunion de chantier hebdomadaire N°48',
  'chantier',
  '2026-06-09 08:00:00+03',
  'Salle de réunion base vie chantier',
  ARRAY['Direction de Projet','Ahmed Hassan Moussa (SETAB)','Omar Farah Ismail (ElecPro)','Hodan Abdi Warsame (ClimaMed)','Youssouf Hassan Gedi (MedGaz)','Architecte de chantier'],
  '1. Avancement LOT-GC structure R+1 - 2. État réservations ouvertes - 3. Planning fluides médicaux - 4. Approvisionnements en attente',
  'Décision 1: Reprise béton armé poteaux P12-P15 avant coulage dalle R+1. Décision 2: Mise en demeure ElecPro pour RES-2026-002 avant 30/06. Décision 3: Validation planning fluides médicaux révisé.',
  '2026-06-16 08:00:00+03',
  'terminee'
),
(
  'k1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Réunion de coordination Fluides Médicaux',
  'technique',
  '2026-06-04 10:00:00+03',
  'Bureau de chantier - Salle technique',
  ARRAY['Direction de Projet','Youssouf Hassan Gedi (MedGaz)','Air Liquide Djibouti','Ingénieur fluides médicaux','Architecte'],
  '1. Révision planning réseau O2 - 2. Réservation RES-2026-006 urgences - 3. Qualification centrale O2 liquide - 4. Plan de récolement',
  'Planning O2 décalé de 3 semaines suite délai centrale liquide. Reprise pression réseau urgences priorité absolue semaine 24.',
  '2026-07-02 10:00:00+03',
  'terminee'
),
(
  'k1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Réunion de chantier hebdomadaire N°49',
  'chantier',
  '2026-06-16 08:00:00+03',
  'Salle de réunion base vie chantier',
  ARRAY['Direction de Projet','Tous entreprises titulaires','Maître d''ouvrage délégué'],
  '1. Avancement global S49 vs planning - 2. Revue réservations critiques - 3. Planification visites réception partielle - 4. Divers',
  NULL,
  '2026-06-23 08:00:00+03',
  'planifiee'
),
(
  'k1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Réunion Pré-réception Zone Technique TECH-01',
  'reception',
  '2026-06-20 09:00:00+03',
  'Local TGBT - Zone technique RDC',
  ARRAY['Direction de Projet','Omar Farah Ismail (ElecPro)','Bureau de contrôle SOCOTEC','Maître d''ouvrage'],
  '1. Contrôle TGBT et raccordement groupe - 2. Test ATS démarrage automatique - 3. Vérification conformité Consuel - 4. Levée RES-2026-015',
  NULL,
  NULL,
  'planifiee'
),
(
  'k1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Comité de pilotage mensuel - Juin 2026',
  'coordination',
  '2026-06-25 14:00:00+03',
  'Ministère de la Santé - Salle de conférence',
  ARRAY['Ministre de la Santé','Direction de Projet','Maître d''Ouvrage Délégué','Architecte Principal','Directeur SETAB','Représentant bailleur de fonds'],
  '1. Tableau de bord avancement global - 2. Point financier et situations de travaux - 3. Risques majeurs et plan d''action - 4. Révision planning général',
  NULL,
  '2026-07-30 14:00:00+03',
  'planifiee'
);

-- =============================================================================
-- MEETING ACTIONS
-- =============================================================================
INSERT INTO chantier_meeting_actions (id, meeting_id, description, responsible, due_date, status) VALUES
(
  'l1000001-0001-0001-0001-000000000001',
  'k1000001-0001-0001-0001-000000000001',
  'Mettre en demeure ElecPro par courrier RAR pour RES-2026-002 (recâblage TGBT) - délai 30/06',
  'Direction de Projet', '2026-06-12', 'fait'
),
(
  'l1000002-0001-0001-0001-000000000001',
  'k1000001-0001-0001-0001-000000000001',
  'Soumettre planning révisé fluides médicaux avec jalons détaillés O2/VIDE/AIR',
  'Youssouf Hassan Gedi', '2026-06-20', 'en_cours'
),
(
  'l1000003-0001-0001-0001-000000000001',
  'k1000001-0001-0001-0001-000000000001',
  'Réaliser contrôle contradictoire poteaux P12 à P15 avec bureau de contrôle avant coulage',
  'Ahmed Hassan Moussa', '2026-06-15', 'fait'
),
(
  'l1000004-0001-0001-0001-000000000001',
  'k1000002-0001-0001-0001-000000000001',
  'Intervention urgente réseau O2 urgences - vérification vanne générale et test pression',
  'Youssouf Hassan Gedi', '2026-06-10', 'fait'
),
(
  'l1000005-0001-0001-0001-000000000001',
  'k1000002-0001-0001-0001-000000000001',
  'Remettre planning détaillé qualification IQ/OQ/PQ centrale O2 liquide',
  'Air Liquide Djibouti représentant', '2026-06-25', 'en_attente'
),
(
  'l1000006-0001-0001-0001-000000000001',
  'k1000001-0001-0001-0001-000000000001',
  'Préparer dossier technique réception partielle zone technique TECH-01 pour visite 20/06',
  'Omar Farah Ismail', '2026-06-19', 'en_cours'
);

-- =============================================================================
-- DAILY REPORTS (3 reports)
-- =============================================================================
INSERT INTO chantier_daily_reports (
  id, project_id, report_date, weather, temperature_c, total_workers,
  work_done, zones_worked, incidents, visits, instructions, blockers, reporter
) VALUES
(
  'm1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  '2026-06-11',
  'Ensoleillé, vent faible', 39, 87,
  'Coulage béton armé dalle R+1 zone bloc opératoire (axes A-C / 1-4) : 45m³. Maçonnerie cloisons RDC accueil : avancement 12ml. Tirage câbles CFO TGBT vers tableau secondaire TS-01.',
  ARRAY['Z-BLOC','Z-ACC','Z-TECH'],
  NULL,
  'Visite bureau de contrôle SOCOTEC : inspection ferraillage avant coulage dalle R+1 - conforme',
  'Prévoir protection solaire béton frais coulé - risque chaleur >40°C demain. Maintenir humidification 72h.',
  'Livraison acier partielle (65T restantes) - coulage R+1 zone hospitalisation reporté semaine prochaine',
  'Chef de chantier SETAB - Moussa Ibrahim'
),
(
  'm1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  '2026-06-10',
  'Partiellement nuageux', 37, 92,
  'Ferraillage complet dalle R+1 zone bloc (axes A-C). Pose gaines CFO encastrées. Travaux plomberie pose colonnes EU/EP RDC. Mise en place coffrages périmètre dalle.',
  ARRAY['Z-BLOC','Z-URG'],
  'Chute de matériel mineur - aucun blessé. Incident déclaré registre HSE.',
  NULL,
  'Vérification ancrages garde-corps sécurité périmètre R+1 avant reprise travaux demain matin.',
  NULL,
  'Chef de chantier SETAB - Moussa Ibrahim'
),
(
  'm1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  '2026-06-09',
  'Ensoleillé, forte chaleur', 41, 78,
  'Décoffrage poteaux P16-P24 zone hospitalisation R+1 - vérification visuelle conforme. Pose canalisations fluides médicaux zone urgences (O2 + VIDE 25ml). Reprise enduits façade nord.',
  ARRAY['Z-HOSP','Z-URG'],
  NULL,
  'Réunion de chantier hebdomadaire N°48 - 8h base vie',
  'Réduction horaires travaux 13h-15h30 en raison forte chaleur (41°C). Hydratation renforcée ouvriers.',
  'Vanne O2 urgences en attente pièce de remplacement - délai 3 jours',
  'Chef de chantier SETAB - Moussa Ibrahim'
);

-- =============================================================================
-- TESTS & COMMISSIONING (8 tests)
-- =============================================================================
INSERT INTO chantier_tests (
  id, project_id, lot_id, zone_id, system_name, test_type,
  planned_date, actual_date, responsible, result, status, notes
) VALUES
(
  'n1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'TGBT Principal + Groupe Électrogène 250KVA', 'intermediaire',
  '2026-06-20', NULL,
  'Omar Farah Ismail', NULL, 'planifie',
  'Test démarrage automatique GE sur coupure secteur simulée. Vérification temps de transfert <15s. Contrôle puissance nominale.'
),
(
  'n1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  'e1000005-0001-0001-0001-000000000001',
  'UPS Central 80KVA - Batteries', 'intermediaire',
  '2026-06-25', '2026-06-05',
  'Omar Farah Ismail', 'conforme', 'conforme',
  'Test autonomie batteries 30min conforme. Basculement automatique <20ms. Rapport de test SCHNEIDER signé.'
),
(
  'n1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'e1000002-0001-0001-0001-000000000001',
  'Réseau O2 Médical Zone Urgences', 'intermediaire',
  '2026-06-15', '2026-06-11',
  'Youssouf Hassan Gedi', 'non_conforme', 'non_conforme',
  'ÉCHEC : Pression en bout de réseau 2.8 bar (requis 4 bar ± 0.5). Fuite détectée raccord flexible poste 2. Reprise obligatoire avant validation.'
),
(
  'n1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000004-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'CTA Bloc Opératoire - Essais aérauliques', 'intermediaire',
  '2026-10-15', NULL,
  'Hodan Abdi Warsame', NULL, 'non_planifie',
  'Mesure débit, pression, classe ISO salle bloc. Comptage particulaires 0.5μm et 5μm. Certification ISO 14644.'
),
(
  'n1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000003-0001-0001-0001-000000000001',
  NULL,
  'Système SSI - Détection Incendie 350 points', 'final',
  '2026-11-30', NULL,
  'Ibrahim Ali Daoud', NULL, 'non_planifie',
  'Déclenchement automatique 100% détecteurs, test diffuseurs sonores, report pompiers, essai évacuation.'
),
(
  'n1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000006-0001-0001-0001-000000000001',
  'e1000003-0001-0001-0001-000000000001',
  'Réseau Fluides Médicaux Bloc - Test étanchéité global', 'final',
  '2026-12-15', NULL,
  'Youssouf Hassan Gedi', NULL, 'non_planifie',
  'Test pression 150% pression service pendant 24h. O2, VIDE, AIR médical, N2O. PV VERITAS requis.'
),
(
  'n1000007-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000002-0001-0001-0001-000000000001',
  NULL,
  'Contrôle Thermique Façades - Déperditions', 'intermediaire',
  '2026-09-30', NULL,
  'Bureau de contrôle SOCOTEC', NULL, 'planifie',
  'Caméra thermique IR - vérification isolation thermique façades et toitures. RT tropicale applicable.'
),
(
  'n1000008-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'b1000005-0001-0001-0001-000000000001',
  NULL,
  'Réseau Eau Chaude Sanitaire - Légionellose', 'opr',
  '2027-02-28', NULL,
  'Laboratoire accrédité', NULL, 'non_planifie',
  'Prélèvements bactériologiques eau chaude sanitaire. Analyse légionelles <100 UFC/L requis pour réception.'
);

-- =============================================================================
-- RISKS (6 construction-specific risks)
-- =============================================================================
INSERT INTO chantier_risks (
  id, project_id, title, description, category,
  probability, impact,
  responsible, action_plan, due_date, status
) VALUES
(
  'o1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Retard livraison centrale O2 liquide médicale',
  'La centrale O2 liquide (Air Liquide) est en fabrication avec un retard de 3 semaines. Elle conditionne le démarrage réseau O2 bloc opératoire et maternité - chemin critique. Homologation ANSM également en attente.',
  'approvisionnement',
  4, 5,
  'Youssouf Hassan Gedi',
  '1. Suivi hebdomadaire usine Air Liquide. 2. Identifier source alternative O2 comprimé temporaire. 3. Négocier livraison partielle centrale pour tests préliminaires. 4. Anticiper réception ANSM en soumettant dossier complet.',
  '2026-09-30', 'en_cours'
),
(
  'o1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Non-conformité revêtement sol époxy salle de bloc opératoire',
  'Bullage et décollements partiels du revêtement sol époxy salle BLOC-01 (ISO 7). Reprise totale nécessaire impactant planning finitions et commissioning. Risque report réception provisoire.',
  'qualite',
  3, 4,
  'Ahmed Hassan Moussa',
  '1. Analyse causes bullage (humidité support, application). 2. Dépose totale et séchage support 14 jours. 3. Nouvelle application époxy anti-statique homologué bloc. 4. Tests adhérence et conductivité avant validation.',
  '2026-08-31', 'en_cours'
),
(
  'o1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Pénurie de main d''œuvre qualifiée - tuyauterie fluides médicaux',
  'Djibouti manque de tuyauteurs qualifiés cuivre médical (norme NF EN 13348). MedGaz a 2 techniciens pour 1800ml de réseau. Risque dépassement délai LOT-FLU de 6-8 semaines.',
  'delai',
  4, 3,
  'Youssouf Hassan Gedi',
  '1. Recruter 3 tuyauteurs expat depuis Éthiopie ou France (en cours). 2. Prioriser zones critiques : bloc et maternité. 3. Former 2 techniciens locaux aux normes cuivre médical. 4. Réviser planning par zones.',
  '2026-08-15', 'en_cours'
),
(
  'o1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Risque de surcoût - variation prix acier international',
  'Le cours de l''acier HA FeE500 a augmenté de 18% depuis signature contrat LOT-GC. Clause de révision de prix applicable au-delà de 10%. Surcoût estimé 8-12 MDJF.',
  'cout',
  3, 3,
  'Direction de Projet',
  '1. Application clause révision prix contractuelle. 2. Négociation avec SETAB plafonnement révision à 15%. 3. Avenant modificatif budget. 4. Révision provision pour aléas budget global.',
  '2026-07-31', 'mitige'
),
(
  'o1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Défaillance groupe électrogène - risque alimentation secours',
  'Le groupe électrogène 250KVA présente un défaut de démarrage automatique (RES-2026-015). En cas de coupure ENEDD prolongée, les équipements critiques bloc et réanimation seraient sans alimentation secours.',
  'securite',
  3, 5,
  'Omar Farah Ismail',
  '1. Intervention CUMMINS d''urgence - remplacement ATS défectueux sous 5 jours. 2. Location GE secours mobile 100KVA en attente réparation. 3. Tests hebdomadaires démarrage automatique. 4. Contrat maintenance préventive.',
  '2026-06-28', 'en_cours'
),
(
  'o1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Conditions climatiques extrêmes - impact béton et main d''œuvre',
  'Températures estivales >42°C à Djibouti (juillet-septembre) risquent d''impacter la qualité des coulages béton (hydratation accélérée, résistance réduite) et la productivité des ouvriers (HSE, chaleur).',
  'qualite',
  4, 2,
  'Ahmed Hassan Moussa',
  '1. Protocole coulage béton chaleur : eau glacée, fibres, additifs retardateurs de prise. 2. Coulages nocturnes (22h-6h) pour coulages critiques. 3. Protection béton frais : bâches, arrosage 72h. 4. Rotations ouvriers 4h max exposition. 5. Contrôle température béton au décoffrage.',
  '2026-09-30', 'surveille'
);

-- =============================================================================
-- FLUID SYSTEMS
-- =============================================================================
INSERT INTO chantier_fluid_systems (
  id, project_id, fluid_type, source_location,
  network_installed, pressure_test_done, leakage_test_done,
  identification_done, pv_signed, doe_submitted, notes
) VALUES
(
  'p1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'O2', 'Local fluides RDC - Cour technique nord',
  FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
  'Centrale O2 liquide 3000L en fabrication - livraison prévue sept 2026. 200ml réseau cuivre posé sur 1800ml total.'
),
(
  'p1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'VIDE', 'Local fluides RDC - Cour technique nord',
  FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
  'Centrale vide double pompe commandée - livraison oct 2026. Démarrage pose réseau prévu juillet 2026.'
),
(
  'p1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'AIR_MEDICAL', 'Local fluides RDC - Cour technique nord',
  FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
  'Compresseur air médical 2x15kW en attente validation fiche technique. Installation prévue Q4 2026.'
),
(
  'p1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'EF', 'Bâche eau froide 50m³ + pompes surpression',
  TRUE, TRUE, FALSE, TRUE, FALSE, FALSE,
  'Réseau EF posé et testé pression RDC. Test étanchéité R+1 en attente fin cloisonnement.'
),
(
  'p1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'EC', 'Chaufferie solaire toiture + ballons 2x2500L',
  FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
  'Système solaire thermique ECS en étude. Appel d''offres en cours. Raccordement bâtiment prévu Q1 2027.'
),
(
  'p1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'EU', 'Regard collecteur principal - Cour est',
  TRUE, FALSE, FALSE, TRUE, FALSE, FALSE,
  'Colonnes EU posées RDC et R+1. Test étanchéité à planifier Q3 2026. Branchement regard collecteur municipal effectué.'
);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
INSERT INTO chantier_notifications (
  id, project_id, title, message, type, entity_type, entity_id, is_read
) VALUES
(
  'q1000001-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Réservation critique : Réseau O2 urgences',
  'RES-2026-006 : Pression O2 insuffisante urgences (2.8 bar/4 bar requis). Intervention urgente requise.',
  'error', 'reservation', 'g1000006-0001-0001-0001-000000000001', FALSE
),
(
  'q1000002-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Groupe électrogène : défaut démarrage automatique',
  'RES-2026-015 : ATS défectueux - alimentation secours non opérationnelle. Intervention CUMMINS planifiée.',
  'error', 'reservation', 'g1000015-0001-0001-0001-000000000001', FALSE
),
(
  'q1000003-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Test O2 urgences : non-conforme',
  'Test réseau O2 zone urgences réalisé le 11/06 : résultat NON CONFORME. Pression insuffisante et fuite détectée.',
  'warning', 'test', 'n1000003-0001-0001-0001-000000000001', FALSE
),
(
  'q1000004-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Réunion chantier N°49 planifiée',
  'Réunion de chantier hebdomadaire N°49 le 16/06/2026 à 08h00 - Base vie chantier.',
  'info', 'meeting', 'k1000003-0001-0001-0001-000000000001', TRUE
),
(
  'q1000005-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Risque élevé : retard centrale O2 liquide',
  'Risque criticité 20/25 : livraison centrale O2 retardée de 3 semaines. Impact chemin critique confirmé.',
  'warning', 'risk', 'o1000001-0001-0001-0001-000000000001', FALSE
),
(
  'q1000006-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'UPS Central 80KVA : test conforme',
  'Test autonomie batteries UPS réalisé le 05/06 : CONFORME. Basculement <20ms et autonomie 30min validés.',
  'success', 'test', 'n1000002-0001-0001-0001-000000000001', TRUE
);
