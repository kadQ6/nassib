-- ============================================================
-- NASSIB v2 — Données de démonstration
-- ============================================================

-- PROJET
INSERT INTO nassib_projet (nom, localisation, maitre_ouvrage, maitre_oeuvre, entrepreneur_general, date_debut, date_fin_prevue, budget_total, surface_totale, nb_lits, statut, description)
VALUES ('Polyclinique Cité Nassib', 'Cité Nassib, Alger', 'Groupe Santé Nassib', 'BET MedArch', 'BNTPH Construction', '2024-03-01', '2025-12-31', 850000000, 4200, 80, 'En cours', 'Construction d''une polyclinique moderne de 80 lits sur 4 niveaux avec bloc opératoire, maternité et services d''urgences.');

-- PLANS
INSERT INTO nassib_plans (code, nom, etage, type_plan, version, date_revision, statut) VALUES
('PL-RDC-01', 'Plan RDC — Général', 'RDC', 'Architectural', 'B', '2024-05-15', 'Validé'),
('PL-R01-01', 'Plan R+1 — Chirurgie', 'R+1', 'Architectural', 'A', '2024-05-15', 'Validé'),
('PL-R02-01', 'Plan R+2 — Maternité', 'R+2', 'Architectural', 'A', '2024-06-01', 'En cours'),
('PL-R03-01', 'Plan R+3 — Médecine', 'R+3', 'Architectural', 'A', '2024-06-01', 'En cours'),
('PL-MEP-CFO', 'Plan CFO — Tous niveaux', 'Tous', 'MEP-CFO', 'A', '2024-06-15', 'En cours'),
('PL-MEP-GAZ', 'Plan Gaz Médicaux', 'Tous', 'MEP-GAZ', 'A', '2024-06-15', 'En cours');

-- ENTREPRISES
INSERT INTO nassib_entreprises (nom, type, specialite, contact, telephone, email, statut) VALUES
('BNTPH Construction', 'Entrepreneur Général', 'Gros œuvre, maçonnerie', 'M. Benaissa', '0550 12 34 56', 'contact@bntph.dz', 'Actif'),
('ElecMed Algérie', 'Sous-traitant', 'CFO/CFA hospitalier', 'M. Ferhat', '0661 23 45 67', 'contact@elecmed.dz', 'Actif'),
('FluidMed Algérie', 'Sous-traitant', 'Gaz médicaux, plomberie', 'Mme Khelif', '0770 34 56 78', 'contact@fluidmed.dz', 'Actif'),
('CVC Pro', 'Sous-traitant', 'Climatisation, ventilation', 'M. Harrat', '0550 45 67 89', 'contact@cvcpro.dz', 'Actif'),
('BioEquip Médical', 'Fournisseur', 'Équipements biomédicaux', 'M. Meziane', '0661 56 78 90', 'contact@bioequip.dz', 'Actif'),
('Réseau Data', 'Sous-traitant', 'Réseaux VDI/IP', 'M. Saad', '0770 67 89 01', 'contact@reseaudata.dz', 'Actif'),
('MediMob', 'Fournisseur', 'Mobilier médical', 'Mme Ouali', '0550 78 90 12', 'contact@medimob.dz', 'Actif'),
('GazMed Supply', 'Fournisseur', 'Gaz médicaux, centrales', 'M. Djemaa', '0661 89 01 23', 'contact@gazmed.dz', 'Actif');

-- LOCAUX — RDC
INSERT INTO nassib_locaux (code, nom, etage, surface, role_fonctionnel, departement, service, type_local, capacite, nb_prises_cfo, nb_prises_rj45, has_gaz_medicaux, has_cvc, has_plomberie, statut, avancement) VALUES
('RDC-01', 'Hall d''accueil', 'RDC', 120, 'Accueil et orientation des patients', 'Administration', 'Accueil', 'Accueil', NULL, 8, 4, FALSE, TRUE, FALSE, 'En cours', 60),
('RDC-02', 'Banque d''accueil', 'RDC', 20, 'Réception et enregistrement administratif', 'Administration', 'Accueil', 'Bureau', NULL, 12, 6, FALSE, TRUE, FALSE, 'En cours', 55),
('RDC-03', 'Salle d''attente urgences', 'RDC', 45, 'Attente des patients des urgences', 'Urgences', 'Urgences', 'Salle attente', 20, 6, 2, FALSE, TRUE, FALSE, 'En cours', 50),
('RDC-04', 'Box urgences 1', 'RDC', 18, 'Consultation et soins urgents', 'Urgences', 'Urgences', 'Box soins', 1, 10, 3, TRUE, TRUE, TRUE, 'En cours', 45),
('RDC-05', 'Box urgences 2', 'RDC', 18, 'Consultation et soins urgents', 'Urgences', 'Urgences', 'Box soins', 1, 10, 3, TRUE, TRUE, TRUE, 'En cours', 45),
('RDC-06', 'Salle de déchocage', 'RDC', 30, 'Prise en charge des urgences vitales', 'Urgences', 'Urgences', 'Salle soins', 2, 16, 4, TRUE, TRUE, TRUE, 'En cours', 35),
('RDC-07', 'Salle de radiologie', 'RDC', 40, 'Imagerie médicale — radio standard', 'Radiologie', 'Radiologie', 'Salle technique', 1, 12, 4, FALSE, TRUE, FALSE, 'En attente', 20),
('RDC-08', 'Salle d''échographie', 'RDC', 20, 'Imagerie par ultrasons', 'Radiologie', 'Radiologie', 'Salle technique', 1, 10, 3, FALSE, TRUE, FALSE, 'En attente', 15),
('RDC-09', 'Consultation générale 1', 'RDC', 16, 'Consultation médecine générale', 'Médecine', 'Consultation', 'Bureau médical', 1, 8, 3, FALSE, TRUE, TRUE, 'En cours', 65),
('RDC-10', 'Consultation générale 2', 'RDC', 16, 'Consultation médecine générale', 'Médecine', 'Consultation', 'Bureau médical', 1, 8, 3, FALSE, TRUE, TRUE, 'Terminé', 100),
('RDC-11', 'Pharmacie', 'RDC', 35, 'Dispensation et stockage des médicaments', 'Administration', 'Pharmacie', 'Pharmacie', NULL, 10, 4, FALSE, TRUE, FALSE, 'En cours', 40),
('RDC-12', 'Laboratoire', 'RDC', 40, 'Analyses biologiques', 'Laboratoire', 'Biologie', 'Laboratoire', NULL, 14, 6, FALSE, TRUE, TRUE, 'En attente', 10),
('RDC-13', 'Sanitaires RDC H', 'RDC', 12, 'Sanitaires hommes', 'Infrastructure', 'Commun', 'Sanitaires', NULL, 2, 0, FALSE, FALSE, TRUE, 'En cours', 70),
('RDC-14', 'Sanitaires RDC F', 'RDC', 12, 'Sanitaires femmes', 'Infrastructure', 'Commun', 'Sanitaires', NULL, 2, 0, FALSE, FALSE, TRUE, 'En cours', 70),
('RDC-15', 'Local technique RDC', 'RDC', 15, 'TGBT et locaux électriques', 'Infrastructure', 'Technique', 'Local technique', NULL, 6, 2, FALSE, FALSE, FALSE, 'En cours', 80);

-- LOCAUX — R+1 (Chirurgie / Bloc)
INSERT INTO nassib_locaux (code, nom, etage, surface, role_fonctionnel, departement, service, type_local, capacite, nb_prises_cfo, nb_prises_rj45, has_gaz_medicaux, has_cvc, has_plomberie, statut, avancement) VALUES
('R01-01', 'Bloc opératoire 1', 'R+1', 55, 'Chirurgie générale et viscérale', 'Chirurgie', 'Bloc Opératoire', 'Salle opération', 1, 32, 8, TRUE, TRUE, TRUE, 'En cours', 30),
('R01-02', 'Bloc opératoire 2', 'R+1', 55, 'Chirurgie orthopédique', 'Chirurgie', 'Bloc Opératoire', 'Salle opération', 1, 32, 8, TRUE, TRUE, TRUE, 'En attente', 10),
('R01-03', 'Salle de réveil (SSPI)', 'R+1', 40, 'Surveillance post-anesthésie', 'Chirurgie', 'Bloc Opératoire', 'Salle soins', 4, 20, 6, TRUE, TRUE, TRUE, 'En attente', 15),
('R01-04', 'Salle de préparation', 'R+1', 20, 'Préparation du patient avant intervention', 'Chirurgie', 'Bloc Opératoire', 'Salle soins', 2, 10, 3, TRUE, TRUE, TRUE, 'En attente', 10),
('R01-05', 'Stérilisation centrale', 'R+1', 50, 'Stérilisation du matériel chirurgical', 'Chirurgie', 'Bloc Opératoire', 'Stérilisation', NULL, 18, 4, FALSE, TRUE, TRUE, 'En attente', 5),
('R01-06', 'Bureau chef de bloc', 'R+1', 16, 'Coordination et administration du bloc', 'Chirurgie', 'Bloc Opératoire', 'Bureau', NULL, 6, 3, FALSE, TRUE, FALSE, 'En cours', 50),
('R01-07', 'Chambre chirurgie 1', 'R+1', 22, 'Hospitalisation chirurgicale', 'Chirurgie', 'Hospitalisation', 'Chambre', 2, 12, 3, TRUE, TRUE, TRUE, 'En cours', 55),
('R01-08', 'Chambre chirurgie 2', 'R+1', 22, 'Hospitalisation chirurgicale', 'Chirurgie', 'Hospitalisation', 'Chambre', 2, 12, 3, TRUE, TRUE, TRUE, 'En cours', 55),
('R01-09', 'Chambre chirurgie 3', 'R+1', 22, 'Hospitalisation chirurgicale', 'Chirurgie', 'Hospitalisation', 'Chambre', 2, 12, 3, TRUE, TRUE, TRUE, 'En cours', 50),
('R01-10', 'Poste de soins R+1', 'R+1', 25, 'Surveillance et coordination des soins', 'Chirurgie', 'Hospitalisation', 'Poste soins', NULL, 14, 6, FALSE, TRUE, TRUE, 'En cours', 45),
('R01-11', 'Salle de soins R+1', 'R+1', 18, 'Soins infirmiers et pansements', 'Chirurgie', 'Hospitalisation', 'Salle soins', NULL, 8, 3, FALSE, TRUE, TRUE, 'En cours', 50),
('R01-12', 'Local linge propre R+1', 'R+1', 8, 'Stockage du linge propre', 'Infrastructure', 'Logistique', 'Local stockage', NULL, 2, 0, FALSE, FALSE, FALSE, 'En cours', 75),
('R01-13', 'Salle de décontamination', 'R+1', 12, 'Décontamination du matériel', 'Chirurgie', 'Bloc Opératoire', 'Local technique', NULL, 6, 2, FALSE, TRUE, TRUE, 'En attente', 15);

-- LOCAUX — R+2 (Maternité)
INSERT INTO nassib_locaux (code, nom, etage, surface, role_fonctionnel, departement, service, type_local, capacite, nb_prises_cfo, nb_prises_rj45, has_gaz_medicaux, has_cvc, has_plomberie, statut, avancement) VALUES
('R02-01', 'Salle d''accouchement 1', 'R+2', 30, 'Accouchement naturel et assistance', 'Maternité', 'Obstétrique', 'Salle accouchement', 1, 14, 4, TRUE, TRUE, TRUE, 'En cours', 40),
('R02-02', 'Salle d''accouchement 2', 'R+2', 30, 'Accouchement naturel et assistance', 'Maternité', 'Obstétrique', 'Salle accouchement', 1, 14, 4, TRUE, TRUE, TRUE, 'En attente', 20),
('R02-03', 'Salle de travail', 'R+2', 25, 'Surveillance du travail obstétrical', 'Maternité', 'Obstétrique', 'Salle soins', 2, 10, 3, TRUE, TRUE, TRUE, 'En cours', 35),
('R02-04', 'Unité néonatologie', 'R+2', 35, 'Soins aux nouveau-nés à risque', 'Maternité', 'Néonatologie', 'Salle soins', 6, 20, 6, TRUE, TRUE, TRUE, 'En attente', 10),
('R02-05', 'Chambre maternité 1', 'R+2', 22, 'Hospitalisation post-partum', 'Maternité', 'Hospitalisation', 'Chambre', 2, 12, 3, TRUE, TRUE, TRUE, 'En cours', 50),
('R02-06', 'Chambre maternité 2', 'R+2', 22, 'Hospitalisation post-partum', 'Maternité', 'Hospitalisation', 'Chambre', 2, 12, 3, TRUE, TRUE, TRUE, 'En cours', 50),
('R02-07', 'Chambre maternité 3', 'R+2', 22, 'Hospitalisation post-partum', 'Maternité', 'Hospitalisation', 'Chambre', 2, 12, 3, TRUE, TRUE, TRUE, 'En cours', 45),
('R02-08', 'Nurserie', 'R+2', 25, 'Accueil et soins des nouveau-nés', 'Maternité', 'Néonatologie', 'Salle soins', 8, 10, 4, TRUE, TRUE, TRUE, 'En attente', 15),
('R02-09', 'Poste de soins maternité', 'R+2', 20, 'Surveillance et coordination des soins', 'Maternité', 'Hospitalisation', 'Poste soins', NULL, 12, 5, FALSE, TRUE, TRUE, 'En cours', 45),
('R02-10', 'Bureau sage-femme chef', 'R+2', 14, 'Administration de la maternité', 'Maternité', 'Hospitalisation', 'Bureau', NULL, 6, 3, FALSE, TRUE, FALSE, 'En cours', 60);

-- LOCAUX — R+3 (Médecine / Pédiatrie)
INSERT INTO nassib_locaux (code, nom, etage, surface, role_fonctionnel, departement, service, type_local, capacite, nb_prises_cfo, nb_prises_rj45, has_gaz_medicaux, has_cvc, has_plomberie, statut, avancement) VALUES
('R03-01', 'Chambre pédiatrie 1', 'R+3', 20, 'Hospitalisation pédiatrique', 'Pédiatrie', 'Pédiatrie', 'Chambre', 2, 10, 3, TRUE, TRUE, TRUE, 'En cours', 55),
('R03-02', 'Chambre pédiatrie 2', 'R+3', 20, 'Hospitalisation pédiatrique', 'Pédiatrie', 'Pédiatrie', 'Chambre', 2, 10, 3, TRUE, TRUE, TRUE, 'En cours', 55),
('R03-03', 'Chambre médecine 1', 'R+3', 22, 'Hospitalisation médecine générale', 'Médecine', 'Hospitalisation', 'Chambre', 2, 10, 3, TRUE, TRUE, TRUE, 'En cours', 60),
('R03-04', 'Chambre médecine 2', 'R+3', 22, 'Hospitalisation médecine générale', 'Médecine', 'Hospitalisation', 'Chambre', 2, 10, 3, TRUE, TRUE, TRUE, 'Terminé', 100),
('R03-05', 'Chambre médecine 3', 'R+3', 22, 'Hospitalisation médecine générale', 'Médecine', 'Hospitalisation', 'Chambre', 2, 10, 3, TRUE, TRUE, TRUE, 'En cours', 65),
('R03-06', 'Poste de soins R+3', 'R+3', 22, 'Surveillance et coordination des soins', 'Médecine', 'Hospitalisation', 'Poste soins', NULL, 12, 5, FALSE, TRUE, TRUE, 'En cours', 55),
('R03-07', 'Salle de soins R+3', 'R+3', 16, 'Soins infirmiers', 'Médecine', 'Hospitalisation', 'Salle soins', NULL, 8, 3, FALSE, TRUE, TRUE, 'En cours', 50),
('R03-08', 'Bureau médecin chef', 'R+3', 18, 'Direction médicale', 'Administration', 'Direction', 'Bureau', NULL, 6, 3, FALSE, TRUE, FALSE, 'Terminé', 100),
('R03-09', 'Salle de réunion médicale', 'R+3', 30, 'Réunions de service et staff médical', 'Administration', 'Direction', 'Salle réunion', 12, 8, 4, FALSE, TRUE, FALSE, 'En cours', 45),
('R03-10', 'Local pharmacie R+3', 'R+3', 10, 'Pharmacie de service', 'Administration', 'Pharmacie', 'Local stockage', NULL, 4, 2, FALSE, TRUE, FALSE, 'En cours', 60);

-- BOQ LOTS
INSERT INTO nassib_boq_lots (code, nom, type_lot, montant_total, avancement, statut, ordre) VALUES
('LOT-01', 'Gros Œuvre et Maçonnerie', 'GC', 280000000, 65, 'En cours', 1),
('LOT-02', 'Courant Fort (CFO)', 'CFO', 85000000, 40, 'En cours', 2),
('LOT-03', 'Courant Faible (CFA)', 'CFA', 45000000, 30, 'En cours', 3),
('LOT-04', 'Réseau VDI/IP', 'VDI', 25000000, 25, 'En cours', 4),
('LOT-05', 'Gaz Médicaux', 'GAZ', 65000000, 20, 'En cours', 5),
('LOT-06', 'Plomberie et Sanitaires', 'PLOMBERIE', 38000000, 35, 'En cours', 6),
('LOT-07', 'CVC et Ventilation', 'CVC', 72000000, 25, 'En cours', 7),
('LOT-08', 'Équipements Biomédicaux', 'BIOMÉDICAL', 180000000, 15, 'En cours', 8),
('LOT-09', 'Mobilier Médical et Administratif', 'MOBILIER', 35000000, 10, 'En attente', 9),
('LOT-10', 'Menuiserie et Revêtements', 'SECOND_OEUVRE', 25000000, 50, 'En cours', 10);

-- BOQ LIGNES (exemples pour chaque lot)
INSERT INTO nassib_boq_lignes (lot_id, code, designation, unite, quantite, prix_unitaire, montant, avancement, statut, ordre)
SELECT id, 'GO-01', 'Fondations et radier général', 'm³', 850, 45000, 850*45000, 100, 'Terminé', 1 FROM nassib_boq_lots WHERE code='LOT-01'
UNION ALL
SELECT id, 'GO-02', 'Structure béton armé — voiles et poteaux', 'm³', 1200, 55000, 1200*55000, 80, 'En cours', 2 FROM nassib_boq_lots WHERE code='LOT-01'
UNION ALL
SELECT id, 'GO-03', 'Maçonnerie briques et blocs', 'm²', 3500, 8500, 3500*8500, 60, 'En cours', 3 FROM nassib_boq_lots WHERE code='LOT-01'
UNION ALL
SELECT id, 'GO-04', 'Enduits et crépis', 'm²', 4200, 3500, 4200*3500, 30, 'En cours', 4 FROM nassib_boq_lots WHERE code='LOT-01'
UNION ALL
SELECT id, 'CFO-01', 'TGBT principal 400A', 'u', 1, 8500000, 8500000, 100, 'Terminé', 1 FROM nassib_boq_lots WHERE code='LOT-02'
UNION ALL
SELECT id, 'CFO-02', 'Tableau divisionnaire par étage', 'u', 4, 1200000, 4800000, 80, 'En cours', 2 FROM nassib_boq_lots WHERE code='LOT-02'
UNION ALL
SELECT id, 'CFO-03', 'Câblage BT — chemins de câbles', 'ml', 2800, 4500, 2800*4500, 35, 'En cours', 3 FROM nassib_boq_lots WHERE code='LOT-02'
UNION ALL
SELECT id, 'CFO-04', 'Prises 220V double — hospitalières', 'u', 380, 12000, 380*12000, 25, 'En cours', 4 FROM nassib_boq_lots WHERE code='LOT-02'
UNION ALL
SELECT id, 'CFO-05', 'Prises sécurisées UPS', 'u', 120, 18000, 120*18000, 20, 'En cours', 5 FROM nassib_boq_lots WHERE code='LOT-02'
UNION ALL
SELECT id, 'GAZ-01', 'Centrale oxygène liquide 5000L', 'u', 1, 18500000, 18500000, 10, 'En cours', 1 FROM nassib_boq_lots WHERE code='LOT-05'
UNION ALL
SELECT id, 'GAZ-02', 'Réseau distribution O2 — tuyauterie cuivre', 'ml', 450, 35000, 450*35000, 15, 'En cours', 2 FROM nassib_boq_lots WHERE code='LOT-05'
UNION ALL
SELECT id, 'GAZ-03', 'Prises murales O2 (norme NF)', 'u', 85, 65000, 85*65000, 10, 'En cours', 3 FROM nassib_boq_lots WHERE code='LOT-05'
UNION ALL
SELECT id, 'GAZ-04', 'Centrale vide médical', 'u', 1, 6500000, 6500000, 5, 'En attente', 4 FROM nassib_boq_lots WHERE code='LOT-05'
UNION ALL
SELECT id, 'GAZ-05', 'Prises vide médical (norme NF)', 'u', 65, 55000, 65*55000, 5, 'En attente', 5 FROM nassib_boq_lots WHERE code='LOT-05'
UNION ALL
SELECT id, 'BIO-01', 'Moniteur multiparamétrique UCF', 'u', 12, 3500000, 12*3500000, 0, 'Non commandé', 1 FROM nassib_boq_lots WHERE code='LOT-08'
UNION ALL
SELECT id, 'BIO-02', 'Table d''opération électrohydraulique', 'u', 2, 8500000, 2*8500000, 0, 'Non commandé', 2 FROM nassib_boq_lots WHERE code='LOT-08'
UNION ALL
SELECT id, 'BIO-03', 'Éclairage scialytique bloc opératoire', 'u', 4, 6200000, 4*6200000, 0, 'Non commandé', 3 FROM nassib_boq_lots WHERE code='LOT-08'
UNION ALL
SELECT id, 'BIO-04', 'Lit médicalisé électrique', 'u', 40, 850000, 40*850000, 0, 'Non commandé', 4 FROM nassib_boq_lots WHERE code='LOT-08'
UNION ALL
SELECT id, 'BIO-05', 'Incubateur néonatologie', 'u', 6, 4200000, 6*4200000, 0, 'Non commandé', 5 FROM nassib_boq_lots WHERE code='LOT-08';

-- PLANNING PHASES
INSERT INTO nassib_planning_phases (code, nom, date_debut, date_fin, avancement, statut, ordre) VALUES
('PH-01', 'Gros Œuvre et Structure', '2024-03-01', '2024-11-30', 75, 'En cours', 1),
('PH-02', 'Second Œuvre et Finitions', '2024-08-01', '2025-06-30', 30, 'En cours', 2),
('PH-03', 'Lots Techniques MEP', '2024-09-01', '2025-08-31', 20, 'En cours', 3),
('PH-04', 'Équipements et Installations', '2025-04-01', '2025-11-30', 5, 'Non démarré', 4),
('PH-05', 'Essais et Réception', '2025-10-01', '2025-12-31', 0, 'Non démarré', 5);

-- LOTS TECHNIQUES
INSERT INTO nassib_lots_techniques (code, nom, type_lot, montant_marche, date_debut, date_fin_prevue, avancement, statut)
SELECT 'LT-CFO', 'Courant Fort Hospitalier', 'CFO', 85000000, '2024-09-01', '2025-06-30', 40, 'En cours'
UNION ALL SELECT 'LT-CFA', 'Courant Faible et Sécurité', 'CFA', 45000000, '2024-10-01', '2025-07-31', 30, 'En cours'
UNION ALL SELECT 'LT-VDI', 'Réseau VDI et Informatique', 'VDI', 25000000, '2024-11-01', '2025-07-31', 20, 'En cours'
UNION ALL SELECT 'LT-GAZ', 'Gaz Médicaux', 'GAZ', 65000000, '2024-10-01', '2025-08-31', 20, 'En cours'
UNION ALL SELECT 'LT-PLOMB', 'Plomberie et Sanitaires', 'PLOMBERIE', 38000000, '2024-09-01', '2025-05-31', 35, 'En cours'
UNION ALL SELECT 'LT-CVC', 'CVC et Traitement Air', 'CVC', 72000000, '2024-10-01', '2025-08-31', 25, 'En cours';

-- Mise à jour des entreprises dans les lots techniques
UPDATE nassib_lots_techniques SET entreprise_id = (SELECT id FROM nassib_entreprises WHERE nom='ElecMed Algérie') WHERE code IN ('LT-CFO','LT-CFA');
UPDATE nassib_lots_techniques SET entreprise_id = (SELECT id FROM nassib_entreprises WHERE nom='Réseau Data') WHERE code='LT-VDI';
UPDATE nassib_lots_techniques SET entreprise_id = (SELECT id FROM nassib_entreprises WHERE nom='FluidMed Algérie') WHERE code IN ('LT-GAZ','LT-PLOMB');
UPDATE nassib_lots_techniques SET entreprise_id = (SELECT id FROM nassib_entreprises WHERE nom='CVC Pro') WHERE code='LT-CVC';

-- ÉQUIPEMENTS BIOMÉDICAUX
INSERT INTO nassib_equipements_biomedicaux (local_id, code, nom, categorie, marque, modele, prix_unitaire, quantite, date_livraison_prevue, statut, prerequis)
SELECT l.id, 'BIO-' || l.code || '-MON', 'Moniteur multiparamétrique', 'Monitoring', 'Mindray', 'iMEC-10', 3500000, 1, '2025-07-01', 'Non commandé', 'Prises UPS et O2 installées'
FROM nassib_locaux l WHERE l.type_local IN ('Box soins', 'Salle accouchement', 'Chambre')
UNION ALL
SELECT l.id, 'BIO-' || l.code || '-LIT', 'Lit médicalisé électrique', 'Mobilier médical', 'Hillenbrand', 'Progressa', 850000, 2, '2025-06-01', 'Non commandé', 'Prise 220V et appel malade'
FROM nassib_locaux l WHERE l.type_local='Chambre' AND l.capacite = 2;

-- Équipements spécifiques au bloc opératoire
INSERT INTO nassib_equipements_biomedicaux (local_id, code, nom, categorie, marque, modele, prix_unitaire, quantite, date_livraison_prevue, statut, prerequis)
SELECT l.id, 'BIO-BO1-TABLE', 'Table d''opération électrohydraulique', 'Bloc Opératoire', 'Maquet', 'Alphamaxx', 8500000, 1, '2025-08-01', 'Non commandé', 'Sol renforcé, prise 400V et O2'
FROM nassib_locaux l WHERE l.code='R01-01'
UNION ALL
SELECT l.id, 'BIO-BO1-SCIAL', 'Éclairage scialytique LED', 'Bloc Opératoire', 'Trumpf Medical', 'iLED 5', 6200000, 2, '2025-08-01', 'Non commandé', 'Plafond terminé, accroche fixée'
FROM nassib_locaux l WHERE l.code='R01-01'
UNION ALL
SELECT l.id, 'BIO-BO1-ANES', 'Appareil d''anesthésie', 'Anesthésie', 'Dräger', 'Primus', 12000000, 1, '2025-09-01', 'Non commandé', 'O2, vide, air médical, N2O installés'
FROM nassib_locaux l WHERE l.code='R01-01'
UNION ALL
SELECT l.id, 'BIO-NEO-INC', 'Incubateur néonatologie', 'Néonatologie', 'GE Healthcare', 'Giraffe', 4200000, 6, '2025-07-01', 'Non commandé', 'Prises UPS et O2, CVC classe ISO 7'
FROM nassib_locaux l WHERE l.code='R02-04';

-- FOURNISSEURS
INSERT INTO nassib_fournisseurs (nom, type, pays, contact, telephone, email, delai_livraison_jours) VALUES
('BioEquip Médical DZ', 'Distributeur', 'Algérie', 'M. Meziane', '0661 11 22 33', 'info@bioequip.dz', 30),
('Mindray Algérie', 'Fabricant représentant', 'Algérie', 'Mme Amari', '0770 22 33 44', 'contact@mindray.dz', 45),
('GazMed Supply', 'Fournisseur gaz', 'Algérie', 'M. Djemaa', '0550 33 44 55', 'info@gazmed.dz', 21),
('MediMob Algérie', 'Mobilier médical', 'Algérie', 'Mme Ouali', '0661 44 55 66', 'contact@medimob.dz', 60);

-- COMMANDES
INSERT INTO nassib_commandes (numero, fournisseur_id, date_commande, date_livraison_prevue, montant_total, statut)
SELECT 'CMD-2025-001', f.id, '2025-02-15', '2025-05-30', 42000000, 'Confirmée'
FROM nassib_fournisseurs f WHERE f.nom = 'GazMed Supply'
UNION ALL
SELECT 'CMD-2025-002', f.id, '2025-03-01', '2025-06-15', 18500000, 'En cours'
FROM nassib_fournisseurs f WHERE f.nom = 'BioEquip Médical DZ';

-- APPROVISIONNEMENTS
INSERT INTO nassib_approvisionnements (code, designation, categorie, quantite_commandee, quantite_recue, unite, prix_unitaire, statut, date_besoin, date_livraison_prevue)
VALUES
('APPRO-001', 'Tuyauterie cuivre Ø15 mm — O2 médical', 'Gaz médicaux', 450, 180, 'ml', 3500, 'Partiellement livré', '2025-04-01', '2025-03-30'),
('APPRO-002', 'Robinets de sectionnement Ø15mm', 'Gaz médicaux', 48, 0, 'u', 12500, 'Commandé', '2025-04-15', '2025-04-10'),
('APPRO-003', 'Prises murales O2 NF S 90-116', 'Gaz médicaux', 85, 0, 'u', 65000, 'Non commandé', '2025-05-01', NULL),
('APPRO-004', 'Câble blindé 3x2.5 mm² — circuits UPS', 'CFO', 600, 600, 'ml', 850, 'Livré', '2025-02-01', '2025-01-25'),
('APPRO-005', 'Prises 220V double hospitalisées — blanc', 'CFO', 380, 120, 'u', 12000, 'Partiellement livré', '2025-03-15', '2025-03-10'),
('APPRO-006', 'Climatiseur cassette 4 têtes 48000 BTU', 'CVC', 12, 0, 'u', 850000, 'Non commandé', '2025-05-15', NULL),
('APPRO-007', 'Centrale de traitement d''air 10000 m³/h', 'CVC', 2, 0, 'u', 4500000, 'Non commandé', '2025-06-01', NULL),
('APPRO-008', 'Switch réseau manageable 24 ports', 'VDI', 8, 8, 'u', 185000, 'Livré', '2025-02-01', '2025-01-20'),
('APPRO-009', 'Câble RJ45 Cat6 FTP LSOH', 'VDI', 8500, 4200, 'ml', 85, 'Partiellement livré', '2025-03-01', '2025-02-20');

-- RÉUNIONS
INSERT INTO nassib_reunions (numero, titre, type_reunion, date_reunion, lieu, animateur, participants, statut) VALUES
('CR-001', 'Réunion de chantier hebdomadaire #1', 'Chantier', '2025-01-06 09:00:00', 'Salle de réunion polyclinique', 'M. Benaissa (BNTPH)', ARRAY['M. Kader Omar', 'M. Benaissa', 'M. Ferhat (ElecMed)', 'Mme Khelif (FluidMed)'], 'Réalisée'),
('CR-002', 'Réunion de chantier hebdomadaire #2', 'Chantier', '2025-01-13 09:00:00', 'Salle de réunion polyclinique', 'M. Benaissa (BNTPH)', ARRAY['M. Kader Omar', 'M. Benaissa', 'M. Ferhat (ElecMed)'], 'Réalisée'),
('CR-003', 'Réunion technique — Gaz médicaux', 'Technique', '2025-01-20 14:00:00', 'Bureau chantier', 'M. Kader Omar', ARRAY['M. Kader Omar', 'Mme Khelif (FluidMed)', 'M. Djemaa (GazMed)'], 'Réalisée'),
('CR-004', 'Réunion de chantier hebdomadaire #3', 'Chantier', '2025-01-27 09:00:00', 'Salle de réunion polyclinique', 'M. Benaissa (BNTPH)', ARRAY['M. Kader Omar', 'M. Benaissa', 'M. Ferhat', 'M. Harrat (CVC Pro)'], 'Réalisée'),
('CR-005', 'Point avancement — Planning S5', 'Pilotage', '2025-02-03 09:00:00', 'Salle de réunion polyclinique', 'M. Kader Omar', ARRAY['M. Kader Omar', 'M. Benaissa', 'M. Saad (Réseau Data)'], 'Réalisée'),
('CR-006', 'Réunion de chantier #6', 'Chantier', '2025-06-16 09:00:00', 'Salle de réunion polyclinique', 'M. Benaissa (BNTPH)', ARRAY['M. Kader Omar', 'M. Benaissa', 'Toutes entreprises'], 'Planifiée');

-- DÉCISIONS & ACTIONS
INSERT INTO nassib_decisions_actions (type, description, responsable, date_echeance, statut, priorite)
SELECT 'Action', 'Finaliser le plan de tirage des câbles CFO — niveau R+1', 'M. Ferhat (ElecMed)', '2025-02-15', 'En cours', 'Haute'
UNION ALL SELECT 'Décision', 'Décision de démarrer le lot gaz médicaux à partir du R+1', 'M. Kader Omar', NULL, 'Terminé', 'Haute'
UNION ALL SELECT 'Action', 'Soumettre l''étude béton révisée pour les voiles du bloc opératoire', 'BET MedArch', '2025-02-28', 'Terminé', 'Critique'
UNION ALL SELECT 'Action', 'Commander les tuyaux cuivre Ø22mm pour le réseau O2', 'Mme Khelif (FluidMed)', '2025-03-15', 'En cours', 'Haute'
UNION ALL SELECT 'Action', 'Mettre à jour le planning détaillé Phase 3 (MEP)', 'M. Kader Omar', '2025-03-01', 'En retard', 'Critique'
UNION ALL SELECT 'Information', 'Délai de livraison incubateurs porté à 8 semaines (fournisseur)', 'M. Meziane (BioEquip)', NULL, 'Terminé', 'Normale';

-- RÉSERVES ET NON-CONFORMITÉS
INSERT INTO nassib_reserves (local_id, code, titre, description, type_reserve, gravite, responsable_levee, date_constatation, date_echeance, statut)
SELECT l.id, 'RES-001', 'Fissure voile béton salle déchocage', 'Fissure verticale de 3mm sur le voile ouest de la salle de déchocage. Traitement par injection époxy requis.', 'Technique', 'Majeure', 'BNTPH Construction', '2025-01-15', '2025-02-28', 'En cours'
FROM nassib_locaux l WHERE l.code='RDC-06'
UNION ALL
SELECT l.id, 'RES-002', 'Mauvaise pente carrelage sanitaires RDC', 'Le carrelage du sol des sanitaires hommes ne respecte pas la pente minimale de 1% vers le siphon.', 'Technique', 'Mineure', 'BNTPH Construction', '2025-01-20', '2025-03-15', 'Ouverte'
FROM nassib_locaux l WHERE l.code='RDC-13'
UNION ALL
SELECT l.id, 'RES-003', 'Hauteur sous plafond insuffisante bloc opératoire', 'HSP mesurée à 2.85m au lieu des 3.20m requis pour le passage des gaines CVC et scialytiques.', 'Technique', 'Bloquante', 'BET MedArch', '2025-01-25', '2025-02-15', 'En cours'
FROM nassib_locaux l WHERE l.code='R01-01'
UNION ALL
SELECT l.id, 'RES-004', 'Défaut enduit plafond salle accouchement 1', 'Enduit non homogène avec présence de taches. Reprise complète de l''enduit plafond nécessaire.', 'Esthétique', 'Mineure', 'BNTPH Construction', '2025-02-01', '2025-03-30', 'Ouverte'
FROM nassib_locaux l WHERE l.code='R02-01'
UNION ALL
SELECT l.id, 'RES-005', 'Réservation manquante pour gaine CVC', 'Réservation pour passage de gaine CVC 400x200 non réalisée dans le mur porteur.', 'Technique', 'Majeure', 'BNTPH Construction', '2025-02-05', '2025-03-01', 'Levée'
FROM nassib_locaux l WHERE l.code='R01-03'
UNION ALL
SELECT l.id, 'RES-006', 'Défaut alignement portes chambres', 'Les portes des chambres 1 et 2 ne sont pas alignées avec les huisseries — jeu de 8mm.', 'Esthétique', 'Mineure', 'BNTPH Construction', '2025-02-10', '2025-04-15', 'Ouverte'
FROM nassib_locaux l WHERE l.code='R03-03';

-- ESSAIS
INSERT INTO nassib_essais (local_id, code, nom, type_essai, date_prevue, responsable, statut)
SELECT l.id, 'ESS-RDC15-ELEC', 'Essai TGBT — isolement et disjonction', 'Électrique', '2025-05-15', 'ElecMed Algérie', 'Planifié'
FROM nassib_locaux l WHERE l.code='RDC-15'
UNION ALL
SELECT l.id, 'ESS-BO1-GAZ', 'Essai pression réseau O2 bloc opératoire', 'Hydraulique', '2025-07-01', 'FluidMed Algérie', 'Planifié'
FROM nassib_locaux l WHERE l.code='R01-01'
UNION ALL
SELECT l.id, 'ESS-BO1-CVC', 'Essai débit et pression air soufflé bloc', 'Ventilation', '2025-07-15', 'CVC Pro', 'Planifié'
FROM nassib_locaux l WHERE l.code='R01-01'
UNION ALL
SELECT l.id, 'ESS-RDC09-ELEC', 'Essai prises et éclairage consultation 1', 'Électrique', '2025-04-01', 'ElecMed Algérie', 'Planifié'
FROM nassib_locaux l WHERE l.code='RDC-09'
UNION ALL
SELECT l.id, 'ESS-RDC10-ELEC', 'Essai prises et éclairage consultation 2', 'Électrique', '2025-04-01', 'ElecMed Algérie', 'Terminé'
FROM nassib_locaux l WHERE l.code='RDC-10';

-- Mise à jour résultat essais terminés
UPDATE nassib_essais SET resultat='Conforme', date_realisee='2025-04-02', valeur_mesuree='Tension: 230V, DR: <0.5s', valeur_attendue='230V ±5%, DR<0.5s' WHERE code='ESS-RDC10-ELEC';

-- PAIEMENTS
INSERT INTO nassib_paiements (lot_id, entreprise_id, numero_situation, montant_situation, montant_valide, date_situation, date_validation, date_paiement, statut)
SELECT bl.id, e.id, 'SIT-LOT01-001', 85000000, 82000000, '2024-06-30', '2024-07-15', '2024-08-01', 'Payé'
FROM nassib_boq_lots bl, nassib_entreprises e WHERE bl.code='LOT-01' AND e.nom='BNTPH Construction'
UNION ALL
SELECT bl.id, e.id, 'SIT-LOT01-002', 95000000, 93000000, '2024-09-30', '2024-10-15', '2024-11-01', 'Payé'
FROM nassib_boq_lots bl, nassib_entreprises e WHERE bl.code='LOT-01' AND e.nom='BNTPH Construction'
UNION ALL
SELECT bl.id, e.id, 'SIT-LOT01-003', 65000000, 65000000, '2024-12-31', '2025-01-20', '2025-02-10', 'Payé'
FROM nassib_boq_lots bl, nassib_entreprises e WHERE bl.code='LOT-01' AND e.nom='BNTPH Construction'
UNION ALL
SELECT bl.id, e.id, 'SIT-LOT01-004', 45000000, NULL, '2025-03-31', NULL, NULL, 'En attente'
FROM nassib_boq_lots bl, nassib_entreprises e WHERE bl.code='LOT-01' AND e.nom='BNTPH Construction'
UNION ALL
SELECT bl.id, e.id, 'SIT-LOT02-001', 22000000, 21500000, '2025-01-31', '2025-02-15', '2025-03-01', 'Payé'
FROM nassib_boq_lots bl, nassib_entreprises e WHERE bl.code='LOT-02' AND e.nom='ElecMed Algérie'
UNION ALL
SELECT bl.id, e.id, 'SIT-LOT02-002', 18000000, NULL, '2025-04-30', NULL, NULL, 'En attente'
FROM nassib_boq_lots bl, nassib_entreprises e WHERE bl.code='LOT-02' AND e.nom='ElecMed Algérie';

-- DOCUMENTS
INSERT INTO nassib_documents (code, titre, type_document, version, date_document, auteur, statut)
VALUES
('DOC-001', 'Plan architectural RDC — Rev B', 'Plan', 'B', '2024-05-15', 'BET MedArch', 'Validé'),
('DOC-002', 'Note de calcul structure', 'Étude technique', 'A', '2024-04-01', 'BET MedArch', 'Validé'),
('DOC-003', 'Schéma unifilaire CFO', 'Schéma électrique', 'A', '2024-06-15', 'ElecMed Algérie', 'En cours'),
('DOC-004', 'Plan réseau gaz médicaux', 'Plan MEP', 'A', '2024-07-01', 'FluidMed Algérie', 'En cours'),
('DOC-005', 'CCTP Lot CFO', 'CCTP', 'A', '2024-03-15', 'BET MedArch', 'Validé'),
('DOC-006', 'CCTP Lot Gaz Médicaux', 'CCTP', 'A', '2024-03-15', 'BET MedArch', 'Validé'),
('DOC-007', 'PV réunion chantier #1', 'Compte rendu', 'A', '2025-01-06', 'M. Kader Omar', 'Validé'),
('DOC-008', 'Planning général Rev 2', 'Planning', 'B', '2024-12-01', 'BET MedArch', 'Validé'),
('DOC-009', 'Notice de sécurité incendie', 'Réglementaire', 'A', '2024-04-15', 'BET MedArch', 'En cours'),
('DOC-010', 'Protocole essais gaz médicaux', 'Procédure', 'A', '2025-01-15', 'FluidMed Algérie', 'En cours');

-- RÉCEPTION PAR LOCAL — initialisée pour les locaux terminés
INSERT INTO nassib_reception_locaux (local_id, statut)
SELECT id, 'Non visité' FROM nassib_locaux;

-- Mise à jour réception locaux terminés
UPDATE nassib_reception_locaux SET
  date_visite = '2025-04-15',
  cfo_ok = TRUE, cfa_ok = TRUE, reseau_ok = TRUE, gaz_ok = FALSE,
  cvc_ok = TRUE, plomberie_ok = TRUE, equipements_ok = FALSE, mobilier_ok = FALSE, nettoyage_ok = FALSE,
  nb_reserves = 2, statut = 'Avec réserves'
WHERE local_id = (SELECT id FROM nassib_locaux WHERE code='RDC-10');
