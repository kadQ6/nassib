'use client'

import { Truck, PackageCheck, Clock } from 'lucide-react'

const COMMANDES = [
  {id:'c1',numero:'CMD-2025-001',fournisseur:'DJI FU SARL',date_commande:'2025-02-15',date_livraison_prevue:'2025-05-30',montant_total:42000000,statut:'Confirmée'},
  {id:'c2',numero:'CMD-2025-002',fournisseur:'DJI FU SARL',date_commande:'2025-03-01',date_livraison_prevue:'2025-06-15',montant_total:18500000,statut:'En cours'},
  {id:'c3',numero:'CMD-2025-003',fournisseur:'DJI FU SARL',date_commande:'2024-12-15',date_livraison_prevue:'2025-03-01',montant_total:25600000,statut:'Livrée'},
  {id:'c4',numero:'CMD-2025-004',fournisseur:'DJI FU SARL',date_commande:'2025-01-10',date_livraison_prevue:'2025-04-30',montant_total:8200000,statut:'Partiellement livrée'},
]

const LIVRAISONS = [
  {id:'l1',commande:'CMD-2025-003',date:'2025-03-02',fournisseur:'ElecMed',bon:'BL-2025-112',lieu:'Zone stockage RDC',statut:'Complète',articles:'Câbles CFO, Prises hospitalières'},
  {id:'l2',commande:'CMD-2025-004',date:'2025-02-20',fournisseur:'DJI FU SARL',bon:'BL-2025-098',lieu:'Local technique RDC',statut:'Partielle',articles:'8 switches 24 ports, 4200ml Cat6'},
  {id:'l3',commande:'CMD-2025-001',date:'2025-03-30',fournisseur:'DJI FU SARL',bon:'BL-2025-145',lieu:'Zone chantier R+1',statut:'Partielle',articles:'180ml tuyauterie cuivre Ø15'},
  {id:'l4',commande:'CMD-2025-003',date:'2025-01-25',fournisseur:'ElecMed',bon:'BL-2025-062',lieu:'Zone stockage RDC',statut:'Complète',articles:'600ml câble UPS 3x2.5'},
  {id:'l5',commande:'CMD-2025-003',date:'2025-03-10',fournisseur:'ElecMed',bon:'BL-2025-134',lieu:'Zone stockage RDC',statut:'Partielle',articles:'120 prises hospitalières'},
  {id:'l6',commande:'CMD-2025-004',date:'2025-01-20',fournisseur:'DJI FU SARL',bon:'BL-2025-055',lieu:'Local technique RDC',statut:'Complète',articles:'8 switches 24 ports manageable'},
]

const PROCHAINES = [
  { commande: 'CMD-2025-001', fournisseur: 'DJI FU SARL', date_prevue: '2025-05-30', description: 'Solde tuyauterie cuivre O2 — 270ml restants + robinets' },
  { commande: 'CMD-2025-002', fournisseur: 'DJI FU SARL', date_prevue: '2025-06-15', description: 'Équipements biomédicaux lot 1 — incubateurs, moniteurs' },
  { commande: 'CMD-2025-004', fournisseur: 'DJI FU SARL', date_prevue: '2025-04-30', description: 'Solde câble Cat6 — 4300ml restants' },
]

const CMD_STATUT_COLORS: Record<string, string> = {
  'Confirmée':           'bg-blue-100 text-blue-700',
  'En cours':            'bg-yellow-100 text-yellow-700',
  'Livrée':              'bg-green-100 text-green-700',
  'Partiellement livrée':'bg-orange-100 text-orange-700',
}

const LIV_STATUT_COLORS: Record<string, string> = {
  'Complète': 'bg-green-100 text-green-700',
  'Partielle': 'bg-orange-100 text-orange-700',
}

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

function formatDZA(n: number) {
  return new Intl.NumberFormat('fr-DJ', { maximumFractionDigits: 0 }).format(n) + ' FDJ'
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function LogistiquePage() {
  const enCours = COMMANDES.filter(c => c.statut === 'Confirmée' || c.statut === 'En cours' || c.statut === 'Partiellement livrée').length
  const livraisonsMois = LIVRAISONS.filter(l => {
    const d = new Date(l.date)
    return d.getMonth() === 2 && d.getFullYear() === 2025 // mars 2025
  }).length
  const enAttente = COMMANDES.filter(c => c.statut !== 'Livrée').length

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Logistique — Livraisons et Stockage</h1>
        <p className="text-sm text-slate-500 mt-1">Polyclinique Cité Nassib — Suivi des commandes et réceptions chantier</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-yellow-50 px-5 py-4 flex items-center gap-4">
          <Clock className="text-yellow-600 shrink-0" size={24} />
          <div>
            <p className="text-xs text-slate-500">Commandes en cours</p>
            <p className="text-3xl font-bold text-yellow-700">{enCours}</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-blue-50 px-5 py-4 flex items-center gap-4">
          <Truck className="text-blue-600 shrink-0" size={24} />
          <div>
            <p className="text-xs text-slate-500">Livraisons ce mois</p>
            <p className="text-3xl font-bold text-blue-700">{livraisonsMois}</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-orange-50 px-5 py-4 flex items-center gap-4">
          <PackageCheck className="text-orange-600 shrink-0" size={24} />
          <div>
            <p className="text-xs text-slate-500">Articles en attente</p>
            <p className="text-3xl font-bold text-orange-700">{enAttente}</p>
          </div>
        </div>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Commandes</h2>
            <p className="text-xs text-slate-400 mt-0.5">{COMMANDES.length} commandes au total</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left">N° Commande</th>
                  <th className="px-4 py-2.5 text-left">Fournisseur</th>
                  <th className="px-4 py-2.5 text-center">Date</th>
                  <th className="px-4 py-2.5 text-right">Montant</th>
                  <th className="px-4 py-2.5 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMMANDES.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{c.numero}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{c.fournisseur}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">{fmtDate(c.date_commande)}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-semibold whitespace-nowrap text-xs">
                      {formatDZA(c.montant_total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge label={c.statut} cls={CMD_STATUT_COLORS[c.statut] ?? 'bg-gray-100 text-gray-600'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Livraisons récentes */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Livraisons récentes</h2>
            <p className="text-xs text-slate-400 mt-0.5">{LIVRAISONS.length} bons de livraison enregistrés</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left">Date</th>
                  <th className="px-4 py-2.5 text-left">Bon</th>
                  <th className="px-4 py-2.5 text-left">Fournisseur</th>
                  <th className="px-4 py-2.5 text-left">Lieu</th>
                  <th className="px-4 py-2.5 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LIVRAISONS.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDate(l.date)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{l.bon}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{l.fournisseur}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{l.lieu}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge label={l.statut} cls={LIV_STATUT_COLORS[l.statut] ?? 'bg-gray-100 text-gray-600'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Articles detail */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Détail articles livrés</h2>
          <p className="text-xs text-slate-400 mt-0.5">Contenu de chaque bon de livraison</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                <th className="px-4 py-2.5 text-left">Bon</th>
                <th className="px-4 py-2.5 text-left">Commande</th>
                <th className="px-4 py-2.5 text-left">Fournisseur</th>
                <th className="px-4 py-2.5 text-left">Lieu de stockage</th>
                <th className="px-4 py-2.5 text-left">Articles</th>
                <th className="px-4 py-2.5 text-center">Statut livraison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LIVRAISONS.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{l.bon}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{l.commande}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{l.fournisseur}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{l.lieu}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs max-w-xs">{l.articles}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge label={l.statut} cls={LIV_STATUT_COLORS[l.statut] ?? 'bg-gray-100 text-gray-600'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prochaines livraisons */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Prochaines livraisons attendues</h2>
          <p className="text-xs text-slate-400 mt-0.5">Soldes et nouvelles commandes à recevoir</p>
        </div>
        <div className="divide-y divide-slate-100">
          {PROCHAINES.map((p, i) => (
            <div key={i} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="shrink-0 mt-0.5">
                <Truck className="text-blue-400" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <span className="font-mono text-xs font-semibold text-blue-600">{p.commande}</span>
                  <span className="text-sm font-medium text-slate-700">{p.fournisseur}</span>
                </div>
                <p className="text-sm text-slate-600">{p.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-slate-400">Date prévue</p>
                <p className="text-sm font-semibold text-slate-700">{fmtDate(p.date_prevue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
