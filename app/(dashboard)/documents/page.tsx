'use client'

import { useState } from 'react'
import {
  FileText,
  Search,
  Eye,
  CheckCircle,
  Clock,
  FolderOpen,
  MapPin,
} from 'lucide-react'

const DOCUMENTS = [
  { id: 'd1', code: 'DOC-001', titre: 'Plan architectural RDC — Rev B', type: 'Plan', version: 'B', date_document: '2024-05-15', auteur: 'BET MedArch', statut: 'Validé', local: null },
  { id: 'd2', code: 'DOC-002', titre: 'Note de calcul structure', type: 'Étude technique', version: 'A', date_document: '2024-04-01', auteur: 'BET MedArch', statut: 'Validé', local: null },
  { id: 'd3', code: 'DOC-003', titre: 'Schéma unifilaire CFO', type: 'Schéma électrique', version: 'A', date_document: '2024-06-15', auteur: 'ElecMed Algérie', statut: 'En cours', local: null },
  { id: 'd4', code: 'DOC-004', titre: 'Plan réseau gaz médicaux', type: 'Plan MEP', version: 'A', date_document: '2024-07-01', auteur: 'FluidMed Algérie', statut: 'En cours', local: null },
  { id: 'd5', code: 'DOC-005', titre: 'CCTP Lot CFO', type: 'CCTP', version: 'A', date_document: '2024-03-15', auteur: 'BET MedArch', statut: 'Validé', local: null },
  { id: 'd6', code: 'DOC-006', titre: 'CCTP Lot Gaz Médicaux', type: 'CCTP', version: 'A', date_document: '2024-03-15', auteur: 'BET MedArch', statut: 'Validé', local: null },
  { id: 'd7', code: 'DOC-007', titre: 'PV réunion chantier #1', type: 'Compte rendu', version: 'A', date_document: '2025-01-06', auteur: 'M. Kader Omar', statut: 'Validé', local: null },
  { id: 'd8', code: 'DOC-008', titre: 'Planning général Rev 2', type: 'Planning', version: 'B', date_document: '2024-12-01', auteur: 'BET MedArch', statut: 'Validé', local: null },
  { id: 'd9', code: 'DOC-009', titre: 'Notice de sécurité incendie', type: 'Réglementaire', version: 'A', date_document: '2024-04-15', auteur: 'BET MedArch', statut: 'En cours', local: null },
  { id: 'd10', code: 'DOC-010', titre: 'Protocole essais gaz médicaux', type: 'Procédure', version: 'A', date_document: '2025-01-15', auteur: 'FluidMed Algérie', statut: 'En cours', local: null },
  { id: 'd11', code: 'DOC-011', titre: 'Fiche technique table opération Maquet', type: 'Fiche technique', version: 'A', date_document: '2025-02-01', auteur: 'BioEquip Médical', statut: 'Validé', local: 'R01-01 Bloc opératoire 1' },
  { id: 'd12', code: 'DOC-012', titre: 'Rapport géotechnique site', type: 'Étude technique', version: 'A', date_document: '2024-02-01', auteur: 'BET MedArch', statut: 'Validé', local: null },
]

const TYPE_TABS = [
  { label: 'Tous', value: null },
  { label: 'Plans', value: 'Plan' },
  { label: 'CCTP', value: 'CCTP' },
  { label: 'Études', value: 'Étude technique' },
  { label: 'Comptes rendus', value: 'Compte rendu' },
  { label: 'Procédures', value: 'Procédure' },
  { label: 'Fiches techniques', value: 'Fiche technique' },
]

const STATUT_STYLES: Record<string, string> = {
  'Validé': 'bg-green-100 text-green-700',
  'En cours': 'bg-blue-100 text-blue-700',
  'En révision': 'bg-orange-100 text-orange-700',
  'Archivé': 'bg-gray-100 text-gray-500',
}

const TYPE_STYLES: Record<string, string> = {
  'Plan': 'bg-blue-50 text-blue-700',
  'Plan MEP': 'bg-sky-50 text-sky-700',
  'Schéma électrique': 'bg-yellow-50 text-yellow-700',
  'CCTP': 'bg-violet-50 text-violet-700',
  'Étude technique': 'bg-stone-100 text-stone-700',
  'Compte rendu': 'bg-teal-50 text-teal-700',
  'Planning': 'bg-indigo-50 text-indigo-700',
  'Réglementaire': 'bg-red-50 text-red-700',
  'Procédure': 'bg-cyan-50 text-cyan-700',
  'Fiche technique': 'bg-emerald-50 text-emerald-700',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState<string | null>(null)

  const nbTotal = DOCUMENTS.length
  const nbValides = DOCUMENTS.filter(d => d.statut === 'Validé').length
  const nbEnCours = DOCUMENTS.filter(d => d.statut === 'En cours').length

  const filtered = DOCUMENTS.filter(doc => {
    const matchSearch =
      search === '' ||
      doc.titre.toLowerCase().includes(search.toLowerCase()) ||
      doc.code.toLowerCase().includes(search.toLowerCase()) ||
      doc.auteur.toLowerCase().includes(search.toLowerCase())
    const matchType = activeType === null || doc.type === activeType
    return matchSearch && matchType
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents / GED</h1>
        <p className="text-sm text-gray-500 mt-1">Gestion électronique des documents — Polyclinique Cité Nassib</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total documents</p>
            <p className="text-2xl font-bold text-gray-900">{nbTotal}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Validés</p>
            <p className="text-2xl font-bold text-gray-900">{nbValides}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">En cours</p>
            <p className="text-2xl font-bold text-gray-900">{nbEnCours}</p>
          </div>
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {TYPE_TABS.map(tab => (
          <button
            key={tab.label}
            onClick={() => setActiveType(tab.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeType === tab.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 mb-5 flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher un document, un auteur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucun document trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ver.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Auteur</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Local</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(doc => {
                  const statutStyle = STATUT_STYLES[doc.statut] ?? 'bg-gray-100 text-gray-500'
                  const typeStyle = TYPE_STYLES[doc.type] ?? 'bg-gray-100 text-gray-600'
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{doc.code}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="font-medium text-gray-900 text-sm leading-snug">{doc.titre}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${typeStyle}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">v{doc.version}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(doc.date_document)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{doc.auteur}</td>
                      <td className="px-4 py-3">
                        {doc.local ? (
                          <span className="flex items-center gap-1 text-xs text-indigo-600">
                            <MapPin className="w-3 h-3" />
                            {doc.local}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statutStyle}`}>
                          {doc.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Voir le document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-right mt-3">{filtered.length} document{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  )
}
