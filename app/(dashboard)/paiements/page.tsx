'use client'
import { useState } from 'react'
import { CreditCard, TrendingUp, Clock, CheckCircle } from 'lucide-react'

const fmt = (v: number) => new Intl.NumberFormat('fr-DZ', {maximumFractionDigits:0}).format(v) + ' DA'
const fmtDate = (d?: string|null) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

const PAIEMENTS = [
  {id:'p1',lot:'LOT-01',lot_nom:'Gros Œuvre',entreprise:'BNTPH Construction',numero:'SIT-LOT01-001',montant_situation:85000000,montant_valide:82000000,date_situation:'2024-06-30',date_paiement:'2024-08-01',statut:'Payé'},
  {id:'p2',lot:'LOT-01',lot_nom:'Gros Œuvre',entreprise:'BNTPH Construction',numero:'SIT-LOT01-002',montant_situation:95000000,montant_valide:93000000,date_situation:'2024-09-30',date_paiement:'2024-11-01',statut:'Payé'},
  {id:'p3',lot:'LOT-01',lot_nom:'Gros Œuvre',entreprise:'BNTPH Construction',numero:'SIT-LOT01-003',montant_situation:65000000,montant_valide:65000000,date_situation:'2024-12-31',date_paiement:'2025-02-10',statut:'Payé'},
  {id:'p4',lot:'LOT-01',lot_nom:'Gros Œuvre',entreprise:'BNTPH Construction',numero:'SIT-LOT01-004',montant_situation:45000000,montant_valide:null,date_situation:'2025-03-31',date_paiement:null,statut:'En attente'},
  {id:'p5',lot:'LOT-02',lot_nom:'Courant Fort (CFO)',entreprise:'ElecMed Algérie',numero:'SIT-LOT02-001',montant_situation:22000000,montant_valide:21500000,date_situation:'2025-01-31',date_paiement:'2025-03-01',statut:'Payé'},
  {id:'p6',lot:'LOT-02',lot_nom:'Courant Fort (CFO)',entreprise:'ElecMed Algérie',numero:'SIT-LOT02-002',montant_situation:18000000,montant_valide:null,date_situation:'2025-04-30',date_paiement:null,statut:'En attente'},
  {id:'p7',lot:'LOT-05',lot_nom:'Gaz Médicaux',entreprise:'FluidMed Algérie',numero:'SIT-LOT05-001',montant_situation:12000000,montant_valide:11500000,date_situation:'2025-03-31',date_paiement:null,statut:'Validé'},
]

const STATUT_COLORS: Record<string,string> = {
  'Payé':'bg-green-100 text-green-700',
  'Validé':'bg-blue-100 text-blue-700',
  'En attente':'bg-yellow-100 text-yellow-700',
  'Contesté':'bg-red-100 text-red-700',
}

export default function PaiementsPage() {
  const [filter, setFilter] = useState('Tous')

  const totalPaye = PAIEMENTS.filter(p=>p.statut==='Payé').reduce((s,p)=>s+(p.montant_valide??0),0)
  const totalEnAttente = PAIEMENTS.filter(p=>p.statut==='En attente').reduce((s,p)=>s+p.montant_situation,0)
  const totalValide = PAIEMENTS.filter(p=>p.statut==='Validé').reduce((s,p)=>s+(p.montant_valide??0),0)

  const filtered = filter==='Tous' ? PAIEMENTS : PAIEMENTS.filter(p=>p.statut===filter)

  // Summary by lot
  const byLot: Record<string,{nom:string,facture:number,paye:number}> = {}
  PAIEMENTS.forEach(p=>{
    if(!byLot[p.lot]) byLot[p.lot]={nom:p.lot_nom,facture:0,paye:0}
    byLot[p.lot].facture += p.montant_situation
    byLot[p.lot].paye += p.statut==='Payé'?(p.montant_valide??0):0
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paiements — Situations de travaux</h1>
        <p className="text-slate-500 mt-1">{PAIEMENTS.length} situations · suivi des paiements par lot</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label:'Total payé',value:fmt(totalPaye),color:'text-green-600',icon:<CheckCircle size={20}/>},
          {label:'En attente',value:fmt(totalEnAttente),color:'text-yellow-600',icon:<Clock size={20}/>},
          {label:'Validé',value:fmt(totalValide),color:'text-blue-600',icon:<TrendingUp size={20}/>},
          {label:'Nb situations',value:PAIEMENTS.length,color:'text-slate-700',icon:<CreditCard size={20}/>},
        ].map(k=>(
          <div key={k.label} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className={`flex items-center gap-2 ${k.color} mb-1`}>{k.icon}<span className="text-sm font-medium">{k.label}</span></div>
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Summary by lot */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h2 className="font-semibold text-slate-900 mb-4">Récapitulatif par lot</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100">
            <th className="text-left py-2 text-slate-500 font-medium">Lot</th>
            <th className="text-right py-2 text-slate-500 font-medium">Facturé</th>
            <th className="text-right py-2 text-slate-500 font-medium">Payé</th>
            <th className="text-right py-2 text-slate-500 font-medium">Reste</th>
          </tr></thead>
          <tbody>
            {Object.entries(byLot).map(([code,{nom,facture,paye}])=>(
              <tr key={code} className="border-b border-slate-50">
                <td className="py-3"><span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded mr-2">{code}</span>{nom}</td>
                <td className="py-3 text-right">{fmt(facture)}</td>
                <td className="py-3 text-right text-green-600 font-medium">{fmt(paye)}</td>
                <td className="py-3 text-right text-orange-600">{fmt(facture-paye)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter + situations table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Toutes les situations</h2>
          <div className="flex gap-2">
            {['Tous','Payé','Validé','En attente'].map(s=>(
              <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filter===s?'bg-blue-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100 text-slate-500 font-medium">
            <th className="text-left py-2">N° Situation</th>
            <th className="text-left py-2">Lot</th>
            <th className="text-left py-2">Entreprise</th>
            <th className="text-right py-2">Montant</th>
            <th className="text-right py-2">Validé</th>
            <th className="text-center py-2">Date situation</th>
            <th className="text-center py-2">Date paiement</th>
            <th className="text-center py-2">Statut</th>
          </tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 font-mono text-xs">{p.numero}</td>
                <td className="py-3"><span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{p.lot}</span></td>
                <td className="py-3 text-slate-600">{p.entreprise}</td>
                <td className="py-3 text-right font-medium">{fmt(p.montant_situation)}</td>
                <td className="py-3 text-right text-green-600">{p.montant_valide ? fmt(p.montant_valide) : '—'}</td>
                <td className="py-3 text-center text-slate-500">{fmtDate(p.date_situation)}</td>
                <td className="py-3 text-center text-slate-500">{fmtDate(p.date_paiement)}</td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUT_COLORS[p.statut]}`}>{p.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
