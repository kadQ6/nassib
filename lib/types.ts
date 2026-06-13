// ============================================================
// NASSIB v2 — TypeScript Types — Room-centric architecture
// ============================================================

export type LocalStatut = 'En attente' | 'En cours' | 'Terminé' | 'Bloqué' | 'Réceptionné'
export type GraviteReserve = 'Mineure' | 'Majeure' | 'Bloquante'
export type StatutReserve = 'Ouverte' | 'En cours' | 'Levée' | 'Annulée'
export type StatutEssai = 'Planifié' | 'En cours' | 'Terminé' | 'Replanifié'
export type ResultatEssai = 'Conforme' | 'Non conforme' | 'Réservé' | 'Non réalisé'
export type StatutEquipement = 'Non commandé' | 'Commandé' | 'Livré' | 'Installé' | 'Validé'
export type StatutPaiement = 'En attente' | 'Validé' | 'Payé' | 'Contesté'
export type StatutReception = 'Non visité' | 'En cours' | 'Avec réserves' | 'Réceptionné'
export type PrioriteAction = 'Critique' | 'Haute' | 'Normale' | 'Basse'
export type TypeDecision = 'Action' | 'Décision' | 'Information'
export type TypeLot = 'GC' | 'CFO' | 'CFA' | 'VDI' | 'GAZ' | 'PLOMBERIE' | 'CVC' | 'BIOMÉDICAL' | 'MOBILIER' | 'SECOND_OEUVRE'

export interface Projet {
  id: string; nom: string; localisation?: string
  maitre_ouvrage?: string; maitre_oeuvre?: string; entrepreneur_general?: string
  date_debut?: string; date_fin_prevue?: string; date_fin_reelle?: string
  budget_total?: number; surface_totale?: number; nb_lits?: number
  statut: string; description?: string; created_at: string
}

export interface Plan {
  id: string; code?: string; nom: string; etage?: string
  type_plan?: string; version: string; date_revision?: string
  url_fichier?: string; statut: string; notes?: string; created_at: string
}

export interface Local {
  id: string; code: string; nom: string; etage: string; batiment?: string
  surface?: number; hauteur?: number; role_fonctionnel?: string
  departement?: string; service?: string; type_local?: string; capacite?: number
  nb_prises_cfo: number; nb_prises_rj45: number
  has_gaz_medicaux: boolean; has_cvc: boolean; has_plomberie: boolean
  statut: LocalStatut; avancement: number
  prerequis_installation?: string; notes?: string; plan_id?: string; created_at: string
}

export interface BesoinCFO {
  id: string; local_id: string
  nb_prises_220v: number; nb_prises_ups: number; nb_prises_secours: number
  nb_eclairages: number; puissance_kva?: number; notes?: string; statut: string; created_at: string
}

export interface BesoinCFA {
  id: string; local_id: string
  nb_prises_rj45: number; nb_prises_telephone: number; nb_cameras: number
  has_interphone: boolean; has_appel_malade: boolean; has_alarme_incendie: boolean; has_tv: boolean
  notes?: string; statut: string; created_at: string
}

export interface BesoinGaz {
  id: string; local_id: string
  nb_prises_o2: number; nb_prises_vide: number; nb_prises_air_medical: number
  nb_prises_n2o: number; nb_prises_co2: number
  debit_o2?: number; pression_o2?: number; notes?: string; statut: string; created_at: string
}

export interface BesoinCVC {
  id: string; local_id: string
  type_ventilation?: string; debit_soufflage?: number; debit_extraction?: number
  renouvellements_heure?: number; classe_proprete?: string
  temperature_cible?: number; hygrometrie_cible?: number; surpression: boolean
  notes?: string; statut: string; created_at: string
}

export interface BesoinPlomberie {
  id: string; local_id: string
  nb_lavabos: number; nb_eviers: number; nb_douches: number; nb_wc: number
  nb_points_eau: number; eau_chaude: boolean; notes?: string; statut: string; created_at: string
}

export interface Entreprise {
  id: string; nom: string; type?: string; specialite?: string
  contact?: string; telephone?: string; email?: string; statut: string; notes?: string; created_at: string
}

export interface BoqLot {
  id: string; code: string; nom: string; type_lot?: string
  montant_total: number; montant_paye: number; avancement: number; statut: string
  entreprise_id?: string; notes?: string; ordre: number; created_at: string
  entreprise?: Entreprise; lignes?: BoqLigne[]
}

export interface BoqLigne {
  id: string; lot_id: string; code?: string; designation: string
  unite?: string; quantite: number; prix_unitaire: number; montant: number
  avancement: number; statut: string; local_id?: string; notes?: string; ordre: number; created_at: string
  local?: Local
}

export interface PlanningPhase {
  id: string; code?: string; nom: string
  date_debut?: string; date_fin?: string; avancement: number; statut: string; ordre: number; created_at: string
  taches?: PlanningTache[]
}

export interface PlanningTache {
  id: string; phase_id?: string; local_id?: string; lot_id?: string; entreprise_id?: string
  code?: string; nom: string; responsable?: string
  date_debut_prevue?: string; date_fin_prevue?: string
  date_debut_reelle?: string; date_fin_reelle?: string
  duree_jours?: number; avancement: number; priorite: PrioriteAction; statut: string; notes?: string; created_at: string
  local?: Local; phase?: PlanningPhase; entreprise?: Entreprise
}

export interface LotTechnique {
  id: string; boq_lot_id?: string; entreprise_id?: string
  code?: string; nom: string; type_lot?: string; montant_marche?: number
  date_debut?: string; date_fin_prevue?: string; date_fin_reelle?: string
  avancement: number; statut: string; notes?: string; created_at: string
  entreprise?: Entreprise
}

export interface EquipementBiomédical {
  id: string; local_id?: string; boq_ligne_id?: string
  code?: string; nom: string; categorie?: string; marque?: string; modele?: string
  numero_serie?: string; fournisseur_id?: string; prix_unitaire?: number; quantite: number
  date_commande?: string; date_livraison_prevue?: string; date_livraison_reelle?: string
  date_installation?: string; date_validation?: string
  statut: StatutEquipement; prerequis?: string; notes?: string; created_at: string
  local?: Local
}

export interface Mobilier {
  id: string; local_id?: string; code?: string; designation: string
  type_mobilier?: string; marque?: string; quantite: number; prix_unitaire?: number
  fournisseur_id?: string; statut: string; notes?: string; created_at: string
  local?: Local
}

export interface Fournisseur {
  id: string; nom: string; type?: string; pays?: string
  contact?: string; telephone?: string; email?: string
  delai_livraison_jours?: number; created_at: string
}

export interface Commande {
  id: string; numero?: string; fournisseur_id?: string
  date_commande?: string; date_livraison_prevue?: string; date_livraison_reelle?: string
  montant_total?: number; statut: string; notes?: string; created_at: string
  fournisseur?: Fournisseur
}

export interface Approvisionnement {
  id: string; commande_id?: string; local_id?: string
  code?: string; designation: string; categorie?: string
  quantite_commandee?: number; quantite_recue: number; unite?: string; prix_unitaire?: number
  fournisseur_id?: string; date_besoin?: string; date_commande?: string
  date_livraison_prevue?: string; date_livraison_reelle?: string
  statut: string; notes?: string; created_at: string
  local?: Local; fournisseur?: Fournisseur
}

export interface Livraison {
  id: string; commande_id?: string; date_livraison?: string
  transporteur?: string; bon_livraison?: string; lieu_depot?: string
  statut: string; observations?: string; created_at: string
  commande?: Commande
}

export interface Reunion {
  id: string; numero?: string; titre: string; type_reunion?: string
  date_reunion?: string; lieu?: string; animateur?: string; participants?: string[]
  ordre_du_jour?: string; compte_rendu?: string; statut: string; created_at: string
}

export interface DecisionAction {
  id: string; reunion_id?: string; local_id?: string; lot_id?: string
  type: TypeDecision; description: string; responsable?: string
  date_echeance?: string; statut: string; priorite: PrioriteAction; created_at: string
  reunion?: Reunion; local?: Local
}

export interface Reserve {
  id: string; local_id?: string; lot_id?: string; tache_id?: string
  code?: string; titre: string; description?: string; type_reserve?: string
  gravite: GraviteReserve; responsable_levee?: string
  date_constatation: string; date_echeance?: string; date_levee?: string
  statut: StatutReserve; notes?: string; created_at: string
  local?: Local
}

export interface Essai {
  id: string; local_id?: string; lot_id?: string
  code?: string; nom: string; type_essai?: string; norme?: string
  date_prevue?: string; date_realisee?: string; responsable?: string
  resultat?: ResultatEssai; valeur_mesuree?: string; valeur_attendue?: string
  observations?: string; statut: StatutEssai; created_at: string
  local?: Local
}

export interface Paiement {
  id: string; lot_id?: string; entreprise_id?: string
  numero_situation?: string; montant_situation?: number; montant_valide?: number; montant_retenu?: number
  date_situation?: string; date_validation?: string; date_paiement?: string
  statut: StatutPaiement; notes?: string; created_at: string
  lot?: BoqLot; entreprise?: Entreprise
}

export interface ReceptionLocal {
  id: string; local_id: string; date_visite?: string; visiteurs?: string[]
  cfo_ok: boolean; cfa_ok: boolean; reseau_ok: boolean; gaz_ok: boolean
  cvc_ok: boolean; plomberie_ok: boolean; equipements_ok: boolean; mobilier_ok: boolean; nettoyage_ok: boolean
  nb_reserves: number; statut: StatutReception; observations?: string; created_at: string
  local?: Local
}

export interface Document {
  id: string; local_id?: string; reunion_id?: string; lot_id?: string
  code?: string; titre: string; type_document?: string; version: string
  date_document?: string; auteur?: string; url_fichier?: string; statut: string; notes?: string; created_at: string
  local?: Local
}

export interface Photo {
  id: string; local_id?: string; reserve_id?: string
  titre?: string; description?: string; url_fichier?: string
  date_prise: string; created_at: string
  local?: Local
}

export interface KpiCard {
  label: string; value: string | number; sub?: string; color?: string; icon?: string
}

export interface NavItem {
  href: string; label: string; icon: string; badge?: number
}
