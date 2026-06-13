'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight,
  Zap,
  Wifi,
  Flame,
  Wind,
  Droplets,
  CheckSquare,
  Square,
  AlertTriangle,
  ClipboardList,
  Beaker,
  PackageCheck,
} from 'lucide-react'
import { Local, LocalStatut } from '@/lib/types'
import { STATUTS_LOCAL, progressColor } from '@/lib/constants'

// ─── Shared LOCAUX array ───────────────────────────────────────────────────────

const LOCAUX: Local[] = [
  {
    id: 'l1', code: 'RDC-01', nom: "Hall d'accueil", etage: 'RDC', surface: 120,
    departement: 'Administration', service: 'Accueil', type_local: 'Accueil',
    nb_prises_cfo: 8, nb_prises_rj45: 4,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: false,
    statut: 'En cours', avancement: 60, created_at: '2025-01-01',
  },
  {
    id: 'l2', code: 'RDC-04', nom: 'Box urgences 1', etage: 'RDC', surface: 18,
    departement: 'Urgences', service: 'Urgences', type_local: 'Box soins',
    nb_prises_cfo: 10, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 45, created_at: '2025-01-01',
  },
  {
    id: 'l3', code: 'RDC-06', nom: 'Salle de déchocage', etage: 'RDC', surface: 30,
    departement: 'Urgences', service: 'Urgences', type_local: 'Salle soins',
    nb_prises_cfo: 16, nb_prises_rj45: 4,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 35,
    role_fonctionnel: 'Prise en charge urgences vitales',
    created_at: '2025-01-01',
  },
  {
    id: 'l4', code: 'RDC-10', nom: 'Consultation générale 2', etage: 'RDC', surface: 16,
    departement: 'Médecine', service: 'Consultation', type_local: 'Bureau médical',
    nb_prises_cfo: 8, nb_prises_rj45: 3,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: true,
    statut: 'Terminé', avancement: 100, created_at: '2025-01-01',
  },
  {
    id: 'l5', code: 'R01-01', nom: 'Bloc opératoire 1', etage: 'R+1', surface: 55,
    departement: 'Chirurgie', service: 'Bloc Opératoire', type_local: 'Salle opération',
    nb_prises_cfo: 32, nb_prises_rj45: 8,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 30,
    role_fonctionnel: 'Chirurgie générale et viscérale',
    created_at: '2025-01-01',
  },
  {
    id: 'l6', code: 'R01-02', nom: 'Bloc opératoire 2', etage: 'R+1', surface: 55,
    departement: 'Chirurgie', service: 'Bloc Opératoire', type_local: 'Salle opération',
    nb_prises_cfo: 32, nb_prises_rj45: 8,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 10, created_at: '2025-01-01',
  },
  {
    id: 'l7', code: 'R01-03', nom: 'SSPI — Salle de réveil', etage: 'R+1', surface: 40,
    departement: 'Chirurgie', service: 'Bloc Opératoire', type_local: 'Salle soins',
    nb_prises_cfo: 20, nb_prises_rj45: 6,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 15, created_at: '2025-01-01',
  },
  {
    id: 'l8', code: 'R02-01', nom: "Salle d'accouchement 1", etage: 'R+2', surface: 30,
    departement: 'Maternité', service: 'Obstétrique', type_local: 'Salle accouchement',
    nb_prises_cfo: 14, nb_prises_rj45: 4,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 40,
    role_fonctionnel: 'Accouchement naturel et assistance',
    created_at: '2025-01-01',
  },
  {
    id: 'l9', code: 'R02-04', nom: 'Unité néonatologie', etage: 'R+2', surface: 35,
    departement: 'Maternité', service: 'Néonatologie', type_local: 'Salle soins',
    nb_prises_cfo: 20, nb_prises_rj45: 6,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 10, created_at: '2025-01-01',
  },
  {
    id: 'l10', code: 'R03-04', nom: 'Chambre médecine 2', etage: 'R+3', surface: 22,
    departement: 'Médecine', service: 'Hospitalisation', type_local: 'Chambre',
    nb_prises_cfo: 10, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'Terminé', avancement: 100, created_at: '2025-01-01',
  },
  {
    id: 'l11', code: 'R03-08', nom: 'Bureau médecin chef', etage: 'R+3', surface: 18,
    departement: 'Administration', service: 'Direction', type_local: 'Bureau',
    nb_prises_cfo: 6, nb_prises_rj45: 3,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: false,
    statut: 'Terminé', avancement: 100, created_at: '2025-01-01',
  },
  {
    id: 'l12', code: 'R01-07', nom: 'Chambre chirurgie 1', etage: 'R+1', surface: 22,
    departement: 'Chirurgie', service: 'Hospitalisation', type_local: 'Chambre',
    nb_prises_cfo: 12, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 55, created_at: '2025-01-01',
  },
  {
    id: 'l13', code: 'R02-05', nom: 'Chambre maternité 1', etage: 'R+2', surface: 22,
    departement: 'Maternité', service: 'Hospitalisation', type_local: 'Chambre',
    nb_prises_cfo: 12, nb_prises_rj45: 3,
    has_gaz_medicaux: true, has_cvc: true, has_plomberie: true,
    statut: 'En cours', avancement: 50, created_at: '2025-01-01',
  },
  {
    id: 'l14', code: 'RDC-07', nom: 'Salle de radiologie', etage: 'RDC', surface: 40,
    departement: 'Radiologie', service: 'Radiologie', type_local: 'Salle technique',
    nb_prises_cfo: 12, nb_prises_rj45: 4,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: false,
    statut: 'En attente', avancement: 20, created_at: '2025-01-01',
  },
  {
    id: 'l15', code: 'RDC-12', nom: 'Laboratoire', etage: 'RDC', surface: 40,
    departement: 'Laboratoire', service: 'Biologie', type_local: 'Laboratoire',
    nb_prises_cfo: 14, nb_prises_rj45: 6,
    has_gaz_medicaux: false, has_cvc: true, has_plomberie: true,
    statut: 'En attente', avancement: 10, created_at: '2025-01-01',
  },
]

// ─── Tab list ─────────────────────────────────────────────────────────────────

const TABS = [
  'Informations',
  'CFO',
  'CFA',
  'Gaz Médicaux',
  'CVC',
  'Plomberie',
  'Équipements',
  'BOQ',
  'Tâches',
  'Réserves',
  'Essais',
  'Réception',
] as const

type Tab = (typeof TABS)[number]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${className ?? 'bg-slate-100 text-slate-700'}`}>
      {children}
    </span>
  )
}

function Card({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className ?? ''}`}>
      {title && <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">{title}</h3>}
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === '') return null
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className="text-sm text-slate-800 font-medium text-right">{value}</span>
    </div>
  )
}

// ─── Tab contents ──────────────────────────────────────────────────────────────

function TabInformations({ local }: { local: Local }) {
  const networksPresents = [
    { label: 'CFO', active: true, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'CFA', active: true, color: 'bg-blue-100 text-blue-700' },
    { label: 'Gaz Médicaux', active: local.has_gaz_medicaux, color: 'bg-orange-100 text-orange-700' },
    { label: 'CVC', active: local.has_cvc, color: 'bg-cyan-100 text-cyan-700' },
    { label: 'Plomberie', active: local.has_plomberie, color: 'bg-teal-100 text-teal-700' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Informations générales */}
        <Card title="Informations générales">
          <InfoRow label="Surface" value={local.surface ? `${local.surface} m²` : undefined} />
          <InfoRow label="Hauteur sous plafond" value="2,80 m" />
          <InfoRow label="Type de local" value={local.type_local} />
          <InfoRow label="Capacité" value={local.capacite} />
          <InfoRow label="Rôle fonctionnel" value={local.role_fonctionnel} />
          <InfoRow label="Service" value={local.service} />
          <InfoRow label="Département" value={local.departement} />
          <InfoRow label="Étage" value={local.etage} />
        </Card>

        {/* Right: Prérequis */}
        <Card title="Prérequis installation">
          <p className="text-sm text-slate-500 leading-relaxed">
            {local.prerequis_installation ??
              'Les prérequis d\'installation pour ce local comprennent la validation des plans d\'exécution, la réception du gros œuvre, et la coordination avec les lots techniques (CFO, CFA, fluides). Toute intervention doit être précédée d\'un ordre de service signé par le maître d\'ouvrage.'}
          </p>
          {local.notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-medium text-amber-700 mb-1">Notes</p>
              <p className="text-sm text-amber-800">{local.notes}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Réseaux techniques */}
      <Card title="Réseaux techniques">
        <div className="flex flex-wrap gap-3">
          {networksPresents.map(({ label, active, color }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity ${
                active ? color : 'bg-slate-100 text-slate-400 opacity-50'
              }`}
            >
              {active ? (
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
              {label}
              {!active && <span className="text-xs">(absent)</span>}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}

function TabCFO({ local }: { local: Local }) {
  const rows = [
    { type: 'Prises 220V normales', qte: local.nb_prises_cfo, statut: 'En cours' },
    { type: 'Prises UPS (ondulées)', qte: 4, statut: 'En attente' },
    { type: 'Prises secours', qte: 2, statut: 'En attente' },
    { type: 'Luminaires (LED)', qte: 6, statut: 'Planifié' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Prises normales', value: local.nb_prises_cfo, icon: <Zap size={16} className="text-yellow-500" /> },
          { label: 'Prises UPS', value: 4, icon: <Zap size={16} className="text-blue-500" /> },
          { label: 'Prises secours', value: 2, icon: <Zap size={16} className="text-red-500" /> },
          { label: 'Luminaires', value: 6, icon: <Zap size={16} className="text-amber-400" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            {icon}
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card title="Détail CFO">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
          <Zap size={14} className="text-blue-600" />
          <p className="text-sm text-blue-700 font-medium">Puissance installée estimée : 12 kVA</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 text-slate-500 font-medium">Type</th>
                <th className="text-center py-2 px-4 text-slate-500 font-medium">Quantité</th>
                <th className="text-left py-2 pl-4 text-slate-500 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.type} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-4 text-slate-800">{row.type}</td>
                  <td className="py-2.5 px-4 text-center font-semibold text-slate-900">{row.qte}</td>
                  <td className="py-2.5 pl-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      row.statut === 'En cours'
                        ? 'bg-blue-100 text-blue-700'
                        : row.statut === 'Terminé'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {row.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function TabCFA({ local }: { local: Local }) {
  const items = [
    { label: 'Prises RJ45', value: `${local.nb_prises_rj45} prises`, icon: <Wifi size={14} className="text-blue-500" /> },
    { label: 'Caméras de surveillance', value: '2 dômes', icon: <Wifi size={14} className="text-slate-500" /> },
    { label: 'Interphone', value: 'Oui', icon: <Wifi size={14} className="text-slate-500" /> },
    { label: 'Appel malade', value: local.has_gaz_medicaux ? 'Oui' : 'Non', icon: <Wifi size={14} className="text-slate-500" /> },
    { label: 'Alarme incendie', value: 'Oui — détecteur optique', icon: <Wifi size={14} className="text-red-500" /> },
    { label: 'Télévision', value: 'Non', icon: <Wifi size={14} className="text-slate-400" /> },
  ]

  return (
    <Card title="Courant Faible (CFA / VDI)">
      <div className="divide-y divide-slate-50">
        {items.map(({ label, value, icon }) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {icon}
              {label}
            </div>
            <span className="text-sm font-medium text-slate-900">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TabGazMedicaux({ local }: { local: Local }) {
  if (!local.has_gaz_medicaux) {
    return (
      <Card>
        <div className="text-center py-8 text-slate-400">
          <Flame size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-slate-500">Pas de gaz médicaux requis dans ce local</p>
          <p className="text-sm mt-1">Aucun réseau de fluides médicaux n&apos;est prévu pour {local.nom}.</p>
        </div>
      </Card>
    )
  }

  const rows = [
    { gaz: 'Oxygène (O₂)', prises: 4, pression: '4 bar', debit: '10 L/min', statut: 'En cours' },
    { gaz: 'Vide médical', prises: 4, pression: '-0.6 bar', debit: '40 L/min', statut: 'En cours' },
    { gaz: 'Air médical', prises: 2, pression: '4 bar', debit: '20 L/min', statut: 'En attente' },
    { gaz: 'Protoxyde (N₂O)', prises: 2, pression: '4 bar', debit: '5 L/min', statut: 'En attente' },
  ]

  return (
    <Card title="Gaz médicaux">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-4 text-slate-500 font-medium">Gaz</th>
              <th className="text-center py-2 px-4 text-slate-500 font-medium">Nb prises</th>
              <th className="text-center py-2 px-4 text-slate-500 font-medium">Pression</th>
              <th className="text-center py-2 px-4 text-slate-500 font-medium">Débit</th>
              <th className="text-left py-2 pl-4 text-slate-500 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.gaz} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-slate-800">{row.gaz}</td>
                <td className="py-2.5 px-4 text-center text-slate-700">{row.prises}</td>
                <td className="py-2.5 px-4 text-center text-slate-700">{row.pression}</td>
                <td className="py-2.5 px-4 text-center text-slate-700">{row.debit}</td>
                <td className="py-2.5 pl-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    row.statut === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {row.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function TabCVC({ local }: { local: Local }) {
  if (!local.has_cvc) {
    return (
      <Card>
        <div className="text-center py-8 text-slate-400">
          <Wind size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Pas de CVC requis dans ce local</p>
        </div>
      </Card>
    )
  }

  const data = [
    { label: 'Type de ventilation', value: 'Double flux VMC avec récupération de chaleur' },
    { label: 'Débit de soufflage', value: '600 m³/h' },
    { label: 'Débit d\'extraction', value: '550 m³/h' },
    { label: 'Renouvellements / heure', value: '20 vol/h' },
    { label: 'Température cible', value: '20 – 22 °C' },
    { label: 'Hygrométrie cible', value: '45 – 60 %' },
    { label: 'Classe de propreté', value: local.has_gaz_medicaux ? 'ISO 5 (bloc opératoire)' : 'ISO 8 (standard)' },
    { label: 'Surpression', value: local.has_gaz_medicaux ? 'Oui (+15 Pa)' : 'Non' },
  ]

  return (
    <Card title="CVC — Ventilation & Climatisation">
      <div className="divide-y divide-slate-50">
        {data.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-2.5 gap-4">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TabPlomberie({ local }: { local: Local }) {
  if (!local.has_plomberie) {
    return (
      <Card>
        <div className="text-center py-8 text-slate-400">
          <Droplets size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Pas de plomberie requise dans ce local</p>
        </div>
      </Card>
    )
  }

  const data = [
    { label: 'Nombre de lavabos', value: local.has_gaz_medicaux ? '2' : '1' },
    { label: 'Nombre de douches', value: local.type_local === 'Chambre' ? '1' : '0' },
    { label: 'Nombre de WC', value: local.type_local === 'Chambre' ? '1' : '0' },
    { label: 'Points d\'eau techniques', value: '2' },
    { label: 'Eau chaude sanitaire', value: 'Oui' },
    { label: 'Eau froide', value: 'Oui' },
    { label: 'Siphon de sol', value: local.has_gaz_medicaux ? 'Oui' : 'Non' },
    { label: 'Réseau EU/EV', value: 'Raccordement colonne principale R-1' },
  ]

  return (
    <Card title="Plomberie & Sanitaires">
      <div className="divide-y divide-slate-50">
        {data.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-2.5 gap-4">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TabEquipements({ local }: { local: Local }) {
  const equipements = local.has_gaz_medicaux
    ? [
        {
          nom: 'Table opératoire électrique',
          marque: 'Getinge Maquet',
          statut: 'Commandé',
          prix_unitaire: 85000,
          date_livraison: '2025-09-15',
          prerequis: 'Plancher renforcé, alimentation 32A',
        },
        {
          nom: 'Colonne de chirurgie vidéo',
          marque: 'Karl Storz',
          statut: 'Non commandé',
          prix_unitaire: 62000,
          date_livraison: '2025-10-01',
          prerequis: 'Bras pendulaire CFA installé',
        },
        {
          nom: 'Pendentif médical double bras',
          marque: 'Starkstrom',
          statut: 'Livré',
          prix_unitaire: 28000,
          date_livraison: '2025-06-20',
          prerequis: 'Structure plafond validée',
        },
        {
          nom: 'Lampe scialytique LED double',
          marque: 'Berchtold',
          statut: 'Commandé',
          prix_unitaire: 34000,
          date_livraison: '2025-09-20',
          prerequis: 'Faux plafond fixe terminé',
        },
      ]
    : [
        {
          nom: 'Bureau médical ergonomique',
          marque: 'Kinnarps',
          statut: 'Livré',
          prix_unitaire: 1200,
          date_livraison: '2025-05-10',
          prerequis: 'Peinture terminée',
        },
        {
          nom: 'Fauteuil médecin réglable',
          marque: 'RH Logic',
          statut: 'Livré',
          prix_unitaire: 600,
          date_livraison: '2025-05-10',
          prerequis: 'Aucun',
        },
        {
          nom: "Table d'examen hydraulique",
          marque: 'Promotal',
          statut: 'Installé',
          prix_unitaire: 3500,
          date_livraison: '2025-06-01',
          prerequis: 'Plomberie terminée',
        },
      ]

  const statutColor: Record<string, string> = {
    'Non commandé': 'bg-slate-100 text-slate-600',
    'Commandé': 'bg-blue-100 text-blue-700',
    'Livré': 'bg-amber-100 text-amber-700',
    'Installé': 'bg-green-100 text-green-700',
    'Validé': 'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className="space-y-4">
      {equipements.map((eq) => (
        <div key={eq.nom} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 className="font-semibold text-slate-900">{eq.nom}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{eq.marque}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded shrink-0 ${statutColor[eq.statut] ?? 'bg-slate-100 text-slate-600'}`}>
              {eq.statut}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Prix unitaire</p>
              <p className="font-medium text-slate-800">{eq.prix_unitaire.toLocaleString('fr-FR')} €</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Livraison prévue</p>
              <p className="font-medium text-slate-800">{new Date(eq.date_livraison).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400">Prérequis</p>
              <p className="font-medium text-slate-800">{eq.prerequis}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabBOQ({ local }: { local: Local }) {
  const boqLines = [
    {
      code: `BOQ-${local.code}-01`,
      designation: 'Fourniture et pose revêtement sol PVC médical anti-bactérien',
      unite: 'm²',
      qte: local.surface ?? 30,
      pu: 85,
      avancement: local.avancement,
    },
    {
      code: `BOQ-${local.code}-02`,
      designation: 'Fourniture et pose faux plafond minéral 600×600 mm',
      unite: 'm²',
      qte: Math.round((local.surface ?? 30) * 0.9),
      pu: 120,
      avancement: Math.max(0, local.avancement - 15),
    },
    {
      code: `BOQ-${local.code}-03`,
      designation: 'Peinture anti-fongique lessivable murs et plafonds — 2 couches',
      unite: 'm²',
      qte: Math.round((local.surface ?? 30) * 3.5),
      pu: 18,
      avancement: Math.max(0, local.avancement - 10),
    },
  ]

  return (
    <Card title="Bordereau des Ouvrages (BOQ)">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-3 text-slate-500 font-medium">Code</th>
              <th className="text-left py-2 pr-3 text-slate-500 font-medium">Désignation</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Unité</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Qté</th>
              <th className="text-right py-2 px-3 text-slate-500 font-medium">PU (€)</th>
              <th className="text-right py-2 px-3 text-slate-500 font-medium">Montant (€)</th>
              <th className="text-center py-2 pl-3 text-slate-500 font-medium">Avancement</th>
            </tr>
          </thead>
          <tbody>
            {boqLines.map((row) => {
              const montant = row.qte * row.pu
              return (
                <tr key={row.code} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">{row.code}</td>
                  <td className="py-2.5 pr-3 text-slate-800 max-w-xs">{row.designation}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{row.unite}</td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-800">{row.qte}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{row.pu}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{montant.toLocaleString('fr-FR')}</td>
                  <td className="py-2.5 pl-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-16">
                        <div
                          className={`h-full rounded-full ${progressColor(row.avancement)}`}
                          style={{ width: `${row.avancement}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{row.avancement}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td colSpan={5} className="py-2.5 pr-3 text-sm font-semibold text-slate-700">Total</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                {boqLines.reduce((acc, r) => acc + r.qte * r.pu, 0).toLocaleString('fr-FR')} €
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}

function TabTaches({ local }: { local: Local }) {
  const taches = [
    {
      nom: 'Réalisation des cloisons et doublages',
      responsable: 'Lot Gros Œuvre — M. Hamdi',
      date_fin: '2025-07-15',
      priorite: 'Haute',
      avancement: local.avancement,
    },
    {
      nom: 'Tirage câbles CFO et CFA',
      responsable: 'Lot CFO — M. Benali',
      date_fin: '2025-08-01',
      priorite: 'Haute',
      avancement: Math.max(0, local.avancement - 20),
    },
    {
      nom: 'Installation des fluides médicaux',
      responsable: 'Lot Gaz — Mme Labidi',
      date_fin: '2025-08-20',
      priorite: local.has_gaz_medicaux ? 'Critique' : 'Normale',
      avancement: Math.max(0, local.avancement - 30),
    },
    {
      nom: 'Essais et mise en service',
      responsable: 'Chef de projet — M. Trabelsi',
      date_fin: '2025-09-30',
      priorite: 'Normale',
      avancement: 0,
    },
  ]

  const prioriteColor: Record<string, string> = {
    Critique: 'bg-red-100 text-red-700',
    Haute: 'bg-orange-100 text-orange-700',
    Normale: 'bg-blue-100 text-blue-700',
    Basse: 'bg-slate-100 text-slate-600',
  }

  return (
    <div className="space-y-4">
      {taches.map((t) => (
        <div key={t.nom} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h4 className="font-semibold text-slate-900">{t.nom}</h4>
            <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${prioriteColor[t.priorite] ?? 'bg-slate-100 text-slate-600'}`}>
              {t.priorite}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <p className="text-xs text-slate-400">Responsable</p>
              <p className="text-slate-700">{t.responsable}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Date fin prévue</p>
              <p className="text-slate-700">{new Date(t.date_fin).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Avancement</span>
              <span className="font-medium">{t.avancement}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColor(t.avancement)}`}
                style={{ width: `${t.avancement}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabReserves({ local }: { local: Local }) {
  const reserves = [
    {
      titre: 'Fissure sur cloison plâtre côté couloir',
      gravite: 'Majeure',
      statut: 'En cours',
      date_constatation: '2025-05-12',
      responsable: 'Lot Gros Œuvre — M. Hamdi',
      description: 'Fissure horizontale de 3 m constatée à 1,20 m du sol sur la cloison BA13 en limite de local. Cause probable : tassement différentiel.',
    },
    {
      titre: 'Absence de protection des têtes de gaines',
      gravite: 'Bloquante',
      statut: 'Ouverte',
      date_constatation: '2025-06-01',
      responsable: 'Lot CFO — M. Benali',
      description: 'Les têtes de gaines électriques traversant le plancher ne disposent pas de protection incendie réglementaire (coupe-feu 2h requis).',
    },
    {
      titre: 'Teinte peinture non conforme au RAL spécifié',
      gravite: 'Mineure',
      statut: 'Levée',
      date_constatation: '2025-04-20',
      responsable: 'Lot Second Œuvre — Mme Ferchichi',
      description: 'Peinture appliquée en RAL 9001 au lieu du RAL 9003 prescrit. Reprise effectuée le 30/04.',
    },
  ]

  const graviteColor: Record<string, string> = {
    Mineure: 'bg-yellow-100 text-yellow-700',
    Majeure: 'bg-orange-100 text-orange-700',
    Bloquante: 'bg-red-100 text-red-700',
  }

  const statutReserveColor: Record<string, string> = {
    Ouverte: 'bg-red-100 text-red-700',
    'En cours': 'bg-orange-100 text-orange-700',
    Levée: 'bg-green-100 text-green-700',
    Annulée: 'bg-slate-100 text-slate-500',
  }

  return (
    <div className="space-y-4">
      {reserves.map((r) => (
        <div key={r.titre} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={15} className={r.gravite === 'Bloquante' ? 'text-red-500' : r.gravite === 'Majeure' ? 'text-orange-500' : 'text-yellow-500'} />
              {r.titre}
            </h4>
            <div className="flex gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${graviteColor[r.gravite] ?? ''}`}>{r.gravite}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${statutReserveColor[r.statut] ?? ''}`}>{r.statut}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{r.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Constatée le</p>
              <p className="text-slate-700">{new Date(r.date_constatation).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Responsable de levée</p>
              <p className="text-slate-700">{r.responsable}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabEssais({ local }: { local: Local }) {
  const essais = [
    {
      code: `ESS-${local.code}-01`,
      nom: 'Test étanchéité réseau fluides',
      type_essai: 'Hydraulique',
      date_prevue: '2025-09-05',
      statut: 'Planifié',
      resultat: 'Non réalisé',
    },
    {
      code: `ESS-${local.code}-02`,
      nom: 'Essai ventilation et mesure débits',
      type_essai: 'Aéraulique',
      date_prevue: '2025-09-12',
      statut: 'Planifié',
      resultat: 'Non réalisé',
    },
    {
      code: `ESS-${local.code}-03`,
      nom: 'Contrôle des installations électriques (CONSUEL)',
      type_essai: 'Électrique',
      date_prevue: '2025-09-20',
      statut: 'Planifié',
      resultat: 'Non réalisé',
    },
  ]

  const statutEssaiColor: Record<string, string> = {
    Planifié: 'bg-slate-100 text-slate-600',
    'En cours': 'bg-blue-100 text-blue-700',
    Terminé: 'bg-green-100 text-green-700',
    Replanifié: 'bg-orange-100 text-orange-700',
  }

  const resultatColor: Record<string, string> = {
    Conforme: 'bg-green-100 text-green-700',
    'Non conforme': 'bg-red-100 text-red-700',
    Réservé: 'bg-yellow-100 text-yellow-700',
    'Non réalisé': 'bg-slate-100 text-slate-500',
  }

  return (
    <div className="space-y-4">
      {essais.map((e) => (
        <div key={e.code} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-0.5">{e.code}</p>
              <h4 className="font-semibold text-slate-900">{e.nom}</h4>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${statutEssaiColor[e.statut] ?? ''}`}>{e.statut}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${resultatColor[e.resultat] ?? ''}`}>{e.resultat}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Type d&apos;essai</p>
              <p className="text-slate-700">{e.type_essai}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Date prévue</p>
              <p className="text-slate-700">{new Date(e.date_prevue).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabReception() {
  const ITEMS_RECEPTION = [
    { key: 'cfo', label: 'Courant fort (CFO)' },
    { key: 'cfa', label: 'Courant faible (CFA / VDI)' },
    { key: 'reseau', label: 'Réseau informatique' },
    { key: 'gaz', label: 'Gaz médicaux' },
    { key: 'cvc', label: 'CVC — Ventilation & Climatisation' },
    { key: 'plomberie', label: 'Plomberie & Sanitaires' },
    { key: 'equipements', label: 'Équipements médicaux installés' },
    { key: 'mobilier', label: 'Mobilier & agencement' },
    { key: 'nettoyage', label: 'Nettoyage fin de chantier' },
  ]

  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const nbDone = Object.values(checked).filter(Boolean).length
  const total = ITEMS_RECEPTION.length
  const allDone = nbDone === total

  return (
    <div className="space-y-5">
      <Card title="Liste de contrôle — Réception du local">
        <div className="space-y-2">
          {ITEMS_RECEPTION.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                checked[key]
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {checked[key] ? (
                <CheckSquare size={18} className="text-green-600 shrink-0" />
              ) : (
                <Square size={18} className="text-slate-400 shrink-0" />
              )}
              <span className={`text-sm font-medium ${checked[key] ? 'text-green-800 line-through decoration-green-400' : 'text-slate-700'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Statut global de réception">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-600">{nbDone} / {total} points validés</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded ${
            allDone
              ? 'bg-emerald-100 text-emerald-700'
              : nbDone > 0
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {allDone ? 'Réceptionné' : nbDone > 0 ? 'En cours de réception' : 'Non démarré'}
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${allDone ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${(nbDone / total) * 100}%` }}
          />
        </div>
      </Card>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LocalDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''

  const local = LOCAUX.find((l) => l.id === id) ?? LOCAUX.find((l) => l.id === 'l5')!

  const [activeTab, setActiveTab] = useState<Tab>('Informations')

  const statut = STATUTS_LOCAL[local.statut] ?? { color: 'text-slate-600', bg: 'bg-slate-100' }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500">
          <Link href="/locaux" className="hover:text-blue-600 transition-colors">Locaux</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-900 font-medium">{local.nom}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                  {local.code}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded ${statut.bg} ${statut.color}`}>
                  {local.statut}
                </span>
                {local.etage && (
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded">
                    {local.etage}
                  </span>
                )}
                {local.departement && (
                  <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2.5 py-1 rounded">
                    {local.departement}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{local.nom}</h1>
              {local.role_fonctionnel && (
                <p className="text-sm text-slate-500">{local.role_fonctionnel}</p>
              )}
            </div>
            {local.surface && (
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold text-slate-900">{local.surface}</p>
                <p className="text-sm text-slate-400">m²</p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Avancement global</span>
              <span className="font-bold text-slate-900">{local.avancement}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColor(local.avancement)}`}
                style={{ width: `${local.avancement}%` }}
              />
            </div>
          </div>

          {/* Technical icons summary */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200">
              <Zap size={12} /> {local.nb_prises_cfo} prises CFO
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
              <Wifi size={12} /> {local.nb_prises_rj45} prises RJ45
            </span>
            {local.has_gaz_medicaux && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200">
                <Flame size={12} /> Gaz médicaux
              </span>
            )}
            {local.has_cvc && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-lg border border-cyan-200">
                <Wind size={12} /> CVC
              </span>
            )}
            {local.has_plomberie && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-200">
                <Droplets size={12} /> Plomberie
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Tab bar */}
          <div className="overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'Informations' && <TabInformations local={local} />}
            {activeTab === 'CFO' && <TabCFO local={local} />}
            {activeTab === 'CFA' && <TabCFA local={local} />}
            {activeTab === 'Gaz Médicaux' && <TabGazMedicaux local={local} />}
            {activeTab === 'CVC' && <TabCVC local={local} />}
            {activeTab === 'Plomberie' && <TabPlomberie local={local} />}
            {activeTab === 'Équipements' && <TabEquipements local={local} />}
            {activeTab === 'BOQ' && <TabBOQ local={local} />}
            {activeTab === 'Tâches' && <TabTaches local={local} />}
            {activeTab === 'Réserves' && <TabReserves local={local} />}
            {activeTab === 'Essais' && <TabEssais local={local} />}
            {activeTab === 'Réception' && <TabReception />}
          </div>
        </div>
      </div>
    </div>
  )
}
