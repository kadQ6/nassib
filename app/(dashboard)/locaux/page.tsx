'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2, Search, Zap, Wind, Droplets, ArrowRight,
  CheckCircle2, Clock, AlertCircle, LayoutGrid,
} from 'lucide-react'
import { Local, LocalStatut } from '@/lib/types'
import { STATUTS_LOCAL, progressColor } from '@/lib/constants'

// ─── Real rooms from floor plans — Polyclinique Cité Nassib ───────────────────

const LOCAUX: (Local & { equipements?: string })[] = [

  // ── URGENCES — RDC ───────────────────────────────────────────────────────────
  { id:'urg-sas',  code:'URG-SAS',  nom:'SAS Accueil Urgences',         etage:'RDC', departement:'Urgences', service:'Accueil',   type_local:'Salle attente', nb_prises_cfo:4,  nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:40, equipements:'Fauteuil repos ×2, Brancard ×2', created_at:'2024-10-27' },
  { id:'urg-box1', code:'URG-BOX1', nom:'Box Urgences 1',               etage:'RDC', departement:'Urgences', service:'Soins',     type_local:'Box soins',     nb_prises_cfo:12, nb_prises_rj45:3, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:35, equipements:'Ch. soin ×2, Brancard ×2, Paravent ×2, Moniteur ×2', created_at:'2024-10-27' },
  { id:'urg-box2', code:'URG-BOX2', nom:'Box Urgences 2',               etage:'RDC', departement:'Urgences', service:'Soins',     type_local:'Box soins',     nb_prises_cfo:12, nb_prises_rj45:3, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:35, equipements:'Ch. soin ×2, Brancard ×2, Paravent ×2, Moniteur ×2', created_at:'2024-10-27' },
  { id:'urg-box3', code:'URG-BOX3', nom:'Box Urgences 3',               etage:'RDC', departement:'Urgences', service:'Soins',     type_local:'Box soins',     nb_prises_cfo:12, nb_prises_rj45:3, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:35, equipements:'Ch. soin ×2, Brancard ×2, Paravent ×2, Moniteur ×2', created_at:'2024-10-27' },
  { id:'urg-box4', code:'URG-BOX4', nom:'Box Urgences 4',               etage:'RDC', departement:'Urgences', service:'Soins',     type_local:'Box soins',     nb_prises_cfo:8,  nb_prises_rj45:2, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En attente', avancement:20, equipements:'Ch. soin ×1, Brancard ×1, Moniteur ×1', created_at:'2024-10-27' },
  { id:'urg-dec',  code:'URG-DEC',  nom:'Salle de Déchocage',           etage:'RDC', departement:'Urgences', service:'Déchocage', type_local:'Salle soins',   nb_prises_cfo:20, nb_prises_rj45:4, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:30, role_fonctionnel:'Prise en charge urgences vitales', equipements:'Ch. soin ×2, Brancard ×2, Paravent ×2, Respi ×2, Echographe, Moniteur ×2', created_at:'2024-10-27' },
  { id:'urg-pchi', code:'URG-CHI',  nom:'Petit Bloc Chirurgical URG',   etage:'RDC', departement:'Urgences', service:'Chirurgie', type_local:'Salle opération',nb_prises_cfo:20, nb_prises_rj45:4, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:25, role_fonctionnel:'Chirurgie mineure urgences', equipements:'Ch. soin ×2, Scialytique, Table de chir, Moniteur, Respi Anesth', created_at:'2024-10-27' },
  { id:'urg-bur1', code:'URG-BUR1', nom:'Bureau Médecin URG 1',         etage:'RDC', departement:'Urgences', service:'Médecins',  type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:50, equipements:'Chaise, Bureau, Rangement', created_at:'2024-10-27' },
  { id:'urg-bur2', code:'URG-BUR2', nom:'Bureau Médecin URG 2',         etage:'RDC', departement:'Urgences', service:'Médecins',  type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:50, equipements:'Chaise, Bureau, Rangement', created_at:'2024-10-27' },
  { id:'urg-labo', code:'URG-LABO', nom:'Mini-Labo Urgences',           etage:'RDC', departement:'Urgences', service:'Laboratoire',type_local:'Laboratoire',  nb_prises_cfo:8,  nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:30, equipements:'Paillasse, Chaise ×3', created_at:'2024-10-27' },
  { id:'urg-inf',  code:'URG-INF',  nom:'Infirmerie Urgences',          etage:'RDC', departement:'Urgences', service:'Soins',     type_local:'Poste soins',   nb_prises_cfo:12, nb_prises_rj45:4, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:35, equipements:'Ch. soin ×2, Guéridon ×2, Bureau, Chaise ×2, Brancard, Ch. urg', created_at:'2024-10-27' },
  { id:'urg-stk',  code:'URG-STK',  nom:'Stock Urgences',               etage:'RDC', departement:'Urgences', service:'Logistique',type_local:'Local stockage', nb_prises_cfo:4,  nb_prises_rj45:1, has_gaz_medicaux:false, has_cvc:false, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Rayonnage ×2', created_at:'2024-10-27' },

  // ── RADIOLOGIE — RDC ─────────────────────────────────────────────────────────
  { id:'rad-sas',   code:'RAD-SAS',   nom:'SAS Patient Radiologie',     etage:'RDC', departement:'Radiologie', service:'Accueil',     type_local:'Salle attente',  nb_prises_cfo:4,  nb_prises_rj45:1, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En attente', avancement:20, equipements:'Banc', created_at:'2024-10-27' },
  { id:'rad-salle', code:'RAD-SALLE', nom:'Salle de Radiologie',        etage:'RDC', departement:'Radiologie', service:'Radiologie',  type_local:'Laboratoire',    nb_prises_cfo:16, nb_prises_rj45:4, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:25, role_fonctionnel:'Imagerie médicale — radiographie standard', equipements:'Tableau radio, Tableau électrique, Potter, Générateur', created_at:'2024-10-27' },

  // ── CONSULTATIONS — RDC ───────────────────────────────────────────────────────
  { id:'cs-01',   code:'CS-01',   nom:'Bureau CS 1',               etage:'RDC', departement:'Médecine', service:'Consultation', type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:45, equipements:'Chaise, Bureau, Rangement', created_at:'2024-10-27' },
  { id:'cs-02',   code:'CS-02',   nom:'Bureau CS 2',               etage:'RDC', departement:'Médecine', service:'Consultation', type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:45, equipements:'Chaise, Bureau, Paravent, Table CS, Rangement, Tensiomètre', created_at:'2024-10-27' },
  { id:'cs-03',   code:'CS-03',   nom:'Bureau CS 3',               etage:'RDC', departement:'Médecine', service:'Consultation', type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:40, equipements:'Table CS, Paravent, Bureau, Chaise, Guéridon, Kit dentaire', created_at:'2024-10-27' },
  { id:'cs-04',   code:'CS-04',   nom:'Bureau CS 4',               etage:'RDC', departement:'Médecine', service:'Consultation', type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:40, equipements:'Bureau, Chaise, Guéridon, Paravent, Table CS', created_at:'2024-10-27' },
  { id:'cs-dent', code:'CS-DENT', nom:'Cabinet Dentaire',          etage:'RDC', departement:'Médecine', service:'Dentisterie',  type_local:'Bureau médical', nb_prises_cfo:10, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:30, equipements:'Fauteuil dentaire, Kit dentaire, Paillasse dent, Kit dentaire, Guéridon ×2', created_at:'2024-10-27' },
  { id:'cs-gyn1', code:'CS-GYN1', nom:'Bureau Gynécologie 1',      etage:'RDC', departement:'Médecine', service:'Gynécologie',  type_local:'Bureau médical', nb_prises_cfo:8,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:35, equipements:'Echographe, Bureau, Chaise, Guéridon, Paravent, Table CS', created_at:'2024-10-27' },
  { id:'cs-gyn2', code:'CS-GYN2', nom:'Bureau Gynécologie 2',      etage:'RDC', departement:'Médecine', service:'Gynécologie',  type_local:'Bureau médical', nb_prises_cfo:8,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:35, equipements:'Echographe, Bureau, Chaise, Guéridon, Paravent, Table CS', created_at:'2024-10-27' },

  // ── LOGISTIQUE / SERVICES GÉNÉRAUX — RDC ────────────────────────────────────
  { id:'log-vh',    code:'LOG-VH',    nom:'Vestiaire Hommes',          etage:'RDC', departement:'Administration', service:'RH',         type_local:'Local stockage', nb_prises_cfo:4,  nb_prises_rj45:0, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:50, equipements:'Vestiaire ×2, Banc ×4', created_at:'2024-10-27' },
  { id:'log-vf',    code:'LOG-VF',    nom:'Vestiaire Femmes',          etage:'RDC', departement:'Administration', service:'RH',         type_local:'Local stockage', nb_prises_cfo:4,  nb_prises_rj45:0, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:50, equipements:'Vestiaire, Banc ×2', created_at:'2024-10-27' },
  { id:'log-mag',   code:'LOG-MAG',   nom:'Magasin',                   etage:'RDC', departement:'Administration', service:'Logistique', type_local:'Local stockage', nb_prises_cfo:4,  nb_prises_rj45:1, has_gaz_medicaux:false, has_cvc:false, has_plomberie:false, statut:'En attente', avancement:10, created_at:'2024-10-27' },
  { id:'log-pharm', code:'LOG-PHARM', nom:'Pharmacie',                 etage:'RDC', departement:'Administration', service:'Pharmacie',  type_local:'Pharmacie',      nb_prises_cfo:8,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En attente', avancement:20, created_at:'2024-10-27' },

  // ── ADMINISTRATION — RDC ──────────────────────────────────────────────────────
  { id:'adm-bur1', code:'ADM-BUR1', nom:'Bureau Administratif 1',    etage:'RDC', departement:'Administration', service:'Direction',  type_local:'Bureau',        nb_prises_cfo:8,  nb_prises_rj45:4, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:60, equipements:'Chaise, Bureau ×3, Rangement', created_at:'2024-10-27' },
  { id:'adm-att',  code:'ADM-ATT',  nom:"Salle d'Attente",           etage:'RDC', departement:'Administration', service:'Accueil',    type_local:'Salle attente', nb_prises_cfo:6,  nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:55, equipements:"Chaise ×4, Bureau Direct, WC intégré", created_at:'2024-10-27' },
  { id:'adm-bur2', code:'ADM-BUR2', nom:'Bureau Administratif 2',    etage:'RDC', departement:'Administration', service:'Direction',  type_local:'Bureau',        nb_prises_cfo:12, nb_prises_rj45:6, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:55, equipements:'Bureau ×4, Chaise ×6', created_at:'2024-10-27' },

  // ── MATERNITÉ — R+1 ───────────────────────────────────────────────────────────
  { id:'mat-bur1', code:'MAT-BUR1', nom:'Bureau Maternité 1',         etage:'R+1', departement:'Maternité', service:'Médecins',   type_local:'Bureau médical', nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:40, equipements:'Chaise, Bureau, Rangement', created_at:'2024-10-27' },
  { id:'mat-bur2', code:'MAT-BUR2', nom:'Bureau Maternité 2',         etage:'R+1', departement:'Maternité', service:'Médecins',   type_local:'Bureau médical', nb_prises_cfo:8,  nb_prises_rj45:4, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:40, equipements:'Chaise ×2, Bureau ×2, Rangement', created_at:'2024-10-27' },
  { id:'mat-prev', code:'MAT-PREV', nom:'Salle Pré-Travail',          etage:'R+1', departement:'Maternité', service:'Maternité',  type_local:'Salle soins',   nb_prises_cfo:10, nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:25, equipements:'Echographe, Guéridon, Tensiomètre, Table CS, Toco', created_at:'2024-10-27' },
  { id:'mat-trav', code:'MAT-TRAV', nom:'Salle de Travail',           etage:'R+1', departement:'Maternité', service:'Maternité',  type_local:'Salle accouchement',nb_prises_cfo:16,nb_prises_rj45:4,has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:25, role_fonctionnel:'Salle accouchement voie basse', equipements:'Toco, Table accouchement, Moniteur, Guéridon ×2', created_at:'2024-10-27' },
  { id:'mat-inf',  code:'MAT-INF',  nom:'Infirmerie Maternité',       etage:'R+1', departement:'Maternité', service:'Soins',      type_local:'Poste soins',   nb_prises_cfo:10, nb_prises_rj45:3, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:30, equipements:'Brancard, Guéridon ×2, Ch. urg, Paillasse', created_at:'2024-10-27' },
  { id:'mat-blc',  code:'MAT-BLC',  nom:'Bloc Césarienne',            etage:'R+1', departement:'Maternité', service:'Bloc',       type_local:'Salle opération',nb_prises_cfo:24, nb_prises_rj45:6, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:20, role_fonctionnel:'Chirurgie obstétricale — césariennes', equipements:'Ch. soin, Respi Anesth, Moniteur, Table de chir, Scialytique', created_at:'2024-10-27' },
  { id:'mat-rev',  code:'MAT-REV',  nom:'Salle Réveil Bloc Mat.',     etage:'R+1', departement:'Maternité', service:'Bloc',       type_local:'Salle soins',   nb_prises_cfo:16, nb_prises_rj45:4, has_gaz_medicaux:true,  has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:20, equipements:'Ch. soin, Respi, Brancard ×2, Moniteur ×2', created_at:'2024-10-27' },
  { id:'mat-bib',  code:'MAT-BIB',  nom:'Bibonnerie & Soins Bébé',   etage:'R+1', departement:'Maternité', service:'Pédiatrie',  type_local:'Salle soins',   nb_prises_cfo:12, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:true,  statut:'En cours', avancement:20, equipements:'Fauteuil ×2, Incubateur ×4, Berceau ×4, WC, équipements soins bébé', created_at:'2024-10-27' },

  // ── CHAMBRES MATERNITÉ 1-8 (modèle type) ─────────────────────────────────────
  { id:'mat-ch01', code:'MAT-CH01', nom:'Chambre Maternité 1',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch02', code:'MAT-CH02', nom:'Chambre Maternité 2',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch03', code:'MAT-CH03', nom:'Chambre Maternité 3',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch04', code:'MAT-CH04', nom:'Chambre Maternité 4',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch05', code:'MAT-CH05', nom:'Chambre Maternité 5',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch06', code:'MAT-CH06', nom:'Chambre Maternité 6',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch07', code:'MAT-CH07', nom:'Chambre Maternité 7',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'mat-ch08', code:'MAT-CH08', nom:'Chambre Maternité 8',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  // ── Chambres maternité individuelles ─────────────────────────────────────────
  { id:'mat-ch09', code:'MAT-CH09', nom:'Chambre Maternité 9',        etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:15, equipements:'Lit hospitalier, Fauteuil repos, WC', created_at:'2024-10-27' },
  { id:'mat-ch10', code:'MAT-CH10', nom:'Chambre Maternité 10',       etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:15, equipements:'Lit hospitalier, WC', created_at:'2024-10-27' },
  { id:'mat-ch11', code:'MAT-CH11', nom:'Chambre Maternité 11',       etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:15, equipements:'WC, Table à manger, Lit hospitalier, Fauteuil repos', created_at:'2024-10-27' },
  { id:'mat-ch12', code:'MAT-CH12', nom:'Chambre Maternité 12',       etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:8, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:15, equipements:'WC, Fauteuil repos ×2, Lit hospitalier ×2', created_at:'2024-10-27' },
  { id:'mat-ch13', code:'MAT-CH13', nom:'Chambre Maternité 13',       etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:8, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:15, equipements:'WC, Fauteuil repos ×4, Lit hospitalier ×2', created_at:'2024-10-27' },
  { id:'mat-ch14', code:'MAT-CH14', nom:'Chambre Maternité 14',       etage:'R+1', departement:'Maternité', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:8, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:15, equipements:'Fauteuil repos ×2, Lit hospitalier ×2, WC', created_at:'2024-10-27' },
  // ── Bureaux Maternité ──────────────────────────────────────────────────────────
  { id:'mat-bmat1', code:'MAT-MAT1', nom:'Bureau Chef Mat. 1',         etage:'R+1', departement:'Maternité', service:'Direction',  type_local:'Bureau',        nb_prises_cfo:6,  nb_prises_rj45:3, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:45, equipements:'Chaise, Bureau, Rangement', created_at:'2024-10-27' },
  { id:'mat-bmat2', code:'MAT-MAT2', nom:'Bureau Chef Mat. 2',         etage:'R+1', departement:'Maternité', service:'Direction',  type_local:'Bureau',        nb_prises_cfo:8,  nb_prises_rj45:4, has_gaz_medicaux:false, has_cvc:true,  has_plomberie:false, statut:'En cours', avancement:45, equipements:'Chaise ×2, Bureau ×2, Rangement', created_at:'2024-10-27' },

  // ── MÉDECINE — R+2 ───────────────────────────────────────────────────────────
  { id:'med-ch1', code:'MED-CH01', nom:'Chambre Méd. 1',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'med-ch2', code:'MED-CH02', nom:'Chambre Méd. 2',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'med-ch3', code:'MED-CH03', nom:'Chambre Méd. 3',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'med-ch4', code:'MED-CH04', nom:'Chambre Méd. 4',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'med-ch5', code:'MED-CH05', nom:'Chambre Méd. 5',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'med-ch6', code:'MED-CH06', nom:'Chambre Méd. 6',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Fauteuil repos, Table à manger', created_at:'2024-10-27' },
  { id:'med-ch7', code:'MED-CH07', nom:'Chambre Méd. 7',              etage:'R+2', departement:'Médecine', service:'Hospitalisation', type_local:'Chambre', nb_prises_cfo:6, nb_prises_rj45:2, has_gaz_medicaux:false, has_cvc:true, has_plomberie:false, statut:'En attente', avancement:10, equipements:'Lit hospitalier, Table à manger', created_at:'2024-10-27' },
  { id:'med-hdj', code:'MED-HDJ',  nom:'Hospitalisation de Jour',     etage:'R+2', departement:'Médecine', service:'HDJ',            type_local:'Salle soins', nb_prises_cfo:16, nb_prises_rj45:4, has_gaz_medicaux:false, has_cvc:true, has_plomberie:true,  statut:'En attente', avancement:10, role_fonctionnel:'Soins ambulatoires journée', equipements:'Brancard ×5, Paravent, WC', created_at:'2024-10-27' },
]

// ─── Counts ────────────────────────────────────────────────────────────────────

const DEPTS = ['Tous', 'Urgences', 'Radiologie', 'Médecine', 'Maternité', 'Administration']
const ETAGES = ['Tous', 'RDC', 'R+1', 'R+2']
const STATUTS: LocalStatut[] = ['En attente', 'En cours', 'Terminé', 'Bloqué', 'Réceptionné']

// ─── Card ──────────────────────────────────────────────────────────────────────

function LocalCard({ local }: { local: typeof LOCAUX[0] }) {
  const cfg = STATUTS_LOCAL[local.statut] ?? { color: 'text-slate-600', bg: 'bg-slate-100' }
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{local.code}</span>
            <span className="text-xs text-slate-400">{local.etage}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 leading-snug truncate">{local.nom}</h3>
          {local.departement && (
            <p className="text-xs text-slate-500 mt-0.5">{local.departement}{local.service ? ` — ${local.service}` : ''}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0 ${cfg.bg} ${cfg.color}`}>
          {local.statut}
        </span>
      </div>

      {/* Avancement */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Avancement</span>
          <span className="font-semibold">{local.avancement}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className={`h-1.5 rounded-full ${progressColor(local.avancement)}`} style={{ width: `${local.avancement}%` }} />
        </div>
      </div>

      {/* Equipment */}
      {local.equipements && (
        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-2">
          <span className="font-medium text-slate-600">Équipements : </span>{local.equipements}
        </p>
      )}

      {/* Utility badges */}
      <div className="flex flex-wrap gap-1.5">
        {local.has_gaz_medicaux && (
          <span className="flex items-center gap-1 text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-200">
            <Droplets className="w-3 h-3" />Gaz méd.
          </span>
        )}
        {local.has_cvc && (
          <span className="flex items-center gap-1 text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
            <Wind className="w-3 h-3" />CVC
          </span>
        )}
        {local.nb_prises_cfo > 0 && (
          <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">
            <Zap className="w-3 h-3" />{local.nb_prises_cfo} prises
          </span>
        )}
      </div>

      <Link
        href={`/locaux/${local.id}`}
        className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg py-1.5 transition-colors"
      >
        Voir détail <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LocauxPage() {
  const [search, setSearch]     = useState('')
  const [dept, setDept]         = useState('Tous')
  const [etage, setEtage]       = useState('Tous')
  const [statut, setStatut]     = useState('Tous')
  const [gazOnly, setGazOnly]   = useState(false)

  const filtered = useMemo(() => LOCAUX.filter(l => {
    if (search && !l.nom.toLowerCase().includes(search.toLowerCase()) && !l.code.toLowerCase().includes(search.toLowerCase())) return false
    if (dept   !== 'Tous'  && l.departement !== dept)   return false
    if (etage  !== 'Tous'  && l.etage !== etage)        return false
    if (statut !== 'Tous'  && l.statut !== statut)      return false
    if (gazOnly && !l.has_gaz_medicaux)                  return false
    return true
  }), [search, dept, etage, statut, gazOnly])

  const nbEnCours     = LOCAUX.filter(l => l.statut === 'En cours').length
  const nbEnAttente   = LOCAUX.filter(l => l.statut === 'En attente').length
  const nbTermines    = LOCAUX.filter(l => l.statut === 'Terminé').length
  const nbGaz         = LOCAUX.filter(l => l.has_gaz_medicaux).length

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Locaux — Polyclinique Cité Nassib
        </h1>
        <p className="text-sm text-slate-500 mt-1">{LOCAUX.length} locaux identifiés sur plans · DJI FU SARL</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total locaux',   value: LOCAUX.length, icon: <LayoutGrid size={18}/>,    color: 'text-slate-700',   bg: 'bg-slate-100' },
          { label: 'En cours',       value: nbEnCours,      icon: <Clock size={18}/>,         color: 'text-blue-700',    bg: 'bg-blue-100'  },
          { label: 'En attente',     value: nbEnAttente,    icon: <AlertCircle size={18}/>,   color: 'text-amber-700',   bg: 'bg-amber-100' },
          { label: 'Gaz médicaux',   value: nbGaz,          icon: <Droplets size={18}/>,      color: 'text-cyan-700',    bg: 'bg-cyan-100'  },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-lg ${k.bg}`}><span className={k.color}>{k.icon}</span></div>
            <div>
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un local..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={dept}   onChange={e => setDept(e.target.value)}   className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={etage}  onChange={e => setEtage(e.target.value)}  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {ETAGES.map(e => <option key={e}>{e}</option>)}
        </select>
        <select value={statut} onChange={e => setStatut(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tous</option>
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input type="checkbox" checked={gazOnly} onChange={e => setGazOnly(e.target.checked)} className="rounded" />
          <Droplets className="w-3.5 h-3.5 text-cyan-600" />
          Gaz médicaux
        </label>
        <span className="text-sm text-slate-400">{filtered.length} local{filtered.length > 1 ? 'aux' : ''}</span>
      </div>

      {/* Dept tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DEPTS.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              dept === d ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {d === 'Tous' ? `Tous (${LOCAUX.length})` : `${d} (${LOCAUX.filter(l => l.departement === d).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Aucun local trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(l => <LocalCard key={l.id} local={l} />)}
        </div>
      )}
    </div>
  )
}
