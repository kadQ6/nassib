'use client'
import { useState } from 'react'
import { FlaskConical, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react'

const ESSAIS = [
  {id:'e1',code:'ESS-TGBT-ELEC',nom:'Essai GE 200 kVA — démarrage et basculement',local:'Local technique RDC',local_code:'URG-STK',type:'Électrique',date_prevue:'2026-06-30',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e2',code:'ESS-URG-GAZ',nom:'Essai pression réseau O₂ — Box Urgences 1-4',local:'Box Urgences 1-4',local_code:'URG-BOX1',type:'Gaz médicaux',date_prevue:'2026-08-01',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e3',code:'ESS-DEC-GAZ',nom:'Essai O₂ et vide médical — Déchocage',local:'Salle de Déchocage',local_code:'URG-DEC',type:'Gaz médicaux',date_prevue:'2026-08-01',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e4',code:'ESS-BLC-GAZ',nom:'Essai pression O₂/vide/air — Bloc Césarienne',local:'Bloc Césarienne',local_code:'MAT-BLC',type:'Gaz médicaux',date_prevue:'2026-09-01',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e5',code:'ESS-TRAV-GAZ',nom:'Essai O₂ salle de travail',local:'Salle de Travail',local_code:'MAT-TRAV',type:'Gaz médicaux',date_prevue:'2026-09-01',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e6',code:'ESS-CS1-ELEC',nom:'Essai prises et éclairage Bureau CS 1',local:'Bureau CS 1',local_code:'CS-01',type:'Électrique',date_prevue:'2026-05-30',responsable:'DJI FU SARL',statut:'En cours',resultat:null},
  {id:'e7',code:'ESS-RAD-ELEC',nom:'Essai Salle de Radiologie — tableau élec + Potter',local:'Salle de Radiologie',local_code:'RAD-SALLE',type:'Électrique',date_prevue:'2026-07-01',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e8',code:'ESS-CVC-URG',nom:'Essai climatisation — Urgences RDC',local:'Box URG 1-4, Déchocage',local_code:'URG-BOX1',type:'Ventilation',date_prevue:'2026-07-15',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
  {id:'e9',code:'ESS-PLB-MAT',nom:'Essai hydraulique plomberie — Maternité R+1',local:'Maternité R+1',local_code:'MAT-INF',type:'Hydraulique',date_prevue:'2026-06-15',responsable:'DJI FU SARL',statut:'En cours',resultat:null},
  {id:'e10',code:'ESS-VAN-140',nom:'Essai 140 vannes sectionnement gaz médicaux',local:'Réseau gaz médicaux',local_code:'MAT-BLC',type:'Gaz médicaux',date_prevue:'2026-09-30',responsable:'DJI FU SARL',statut:'Planifié',resultat:null},
]

const STATUT_COLORS: Record<string,string> = {
  'Planifié':'bg-blue-100 text-blue-700',
  'En cours':'bg-yellow-100 text-yellow-700',
  'Terminé':'bg-green-100 text-green-700',
  'Replanifié':'bg-orange-100 text-orange-700',
}
const RESULTAT_COLORS: Record<string,string> = {
  'Conforme':'bg-green-100 text-green-700',
  'Non conforme':'bg-red-100 text-red-700',
  'Réservé':'bg-orange-100 text-orange-700',
}
const TYPE_COLORS: Record<string,string> = {
  'Électrique':'bg-yellow-100 text-yellow-700',
  'Gaz médicaux':'bg-cyan-100 text-cyan-700',
  'Ventilation':'bg-sky-100 text-sky-700',
  'Hydraulique':'bg-teal-100 text-teal-700',
  'Fonctionnel':'bg-purple-100 text-purple-700',
}

export default function EssaisPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tous')

  const types = ['Tous', ...Array.from(new Set(ESSAIS.map(e => e.type)))]
  const filtered = ESSAIS.filter(e =>
    (typeFilter === 'Tous' || e.type === typeFilter) &&
    (e.nom.toLowerCase().includes(search.toLowerCase()) || e.local.toLowerCase().includes(search.toLowerCase()))
  )

  const total = ESSAIS.length
  const planifies = ESSAIS.filter(e => e.statut === 'Planifié').length
  const enCours = ESSAIS.filter(e => e.statut === 'En cours').length
  const termines = ESSAIS.filter(e => e.statut === 'Terminé').length
  const conformes = ESSAIS.filter(e => e.resultat === 'Conforme').length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Essais & Réception Technique</h1>
        <p className="text-slate-500 mt-1">{total} essais planifiés — {conformes}/{termines} conformes</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {label:'Total',value:total,color:'text-slate-700',icon:<FlaskConical size={20}/>},
          {label:'Planifiés',value:planifies,color:'text-blue-600',icon:<Clock size={20}/>},
          {label:'En cours',value:enCours,color:'text-yellow-600',icon:<AlertCircle size={20}/>},
          {label:'Terminés',value:termines,color:'text-green-600',icon:<CheckCircle size={20}/>},
          {label:'Conformes',value:conformes,color:'text-emerald-600',icon:<CheckCircle size={20}/>},
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className={`flex items-center gap-2 ${k.color} mb-1`}>{k.icon}<span className="text-sm font-medium">{k.label}</span></div>
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progression des essais</span>
          <span className="text-sm text-slate-500">{termines}/{total} réalisés</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full transition-all" style={{width:`${(termines/total)*100}%`}}/>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un essai..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={()=>setTypeFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter===t?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Essais cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(e => (
          <div key={e.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono rounded">{e.code}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${TYPE_COLORS[e.type]??'bg-slate-100 text-slate-600'}`}>{e.type}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUT_COLORS[e.statut]}`}>{e.statut}</span>
              </div>
              {e.resultat && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${RESULTAT_COLORS[e.resultat]??''}`}>{e.resultat}</span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{e.nom}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-mono">{e.local_code}</span>
              <span>{e.local}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div><span className="font-medium">Responsable:</span> {e.responsable}</div>
              <div><span className="font-medium">Date prévue:</span> {e.date_prevue ? new Date(e.date_prevue).toLocaleDateString('fr-FR') : '—'}</div>
              {(e as any).date_realisee && <div><span className="font-medium text-green-600">Réalisé le:</span> {new Date((e as any).date_realisee).toLocaleDateString('fr-FR')}</div>}
              {(e as any).valeur_mesuree && <div><span className="font-medium">Mesure:</span> {(e as any).valeur_mesuree}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
