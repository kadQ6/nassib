#!/usr/bin/env node
/**
 * Génère les FICHES LOCAUX remplies (room-by-room) au format de la fiche
 * "K'BIO - Construction Clinique Djibouti", à partir du catalogue des 52 locaux
 * (src/data/nassib/plan-catalog.ts) et des templates techniques
 * (src/lib/room-sheet/templates.ts).
 *
 * Sortie : docs/fiches-locaux/fiches-locaux-nassib.html  (A4 paysage, 1 page/local,
 *          imprimable en PDF). Données : visible plan / FIOG + déduit/proposé.
 *
 * Usage : node scripts/gen-fiches-locaux.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

// ───────────────────────── Templates techniques (miroir SHEET_TEMPLATES) ─────
const T = {
  bloc_cesarienne: { h: 3.2, walls: "Peinture antibactérienne — Vert bloc RAL 6029", floor: "Sol PVC continu antistatique", ceiling: "Plafond technique bloc / laminaire", skirt: "Plinthe à gorge", cfo:{s16:4,s32:2,ded:0,light:12,em:2,earth:6,ip:"IP44"}, cfa:{rj45:0,wifi:1,intercom:1,nurse:0,cctv:2,access:1,tv:0}, pl:{ef:1,ec:1,tr:0,sf:0,fd:2,eu:2,ev:1}, vent:{ach:12,t:21,hr:50,pa:15,norm:"NF S90-351"}, cli:{cool:1,kw:8,split:0,cta:"UTA-Bloc"}, door:{w:1200,h:2100,c:"Blanc RAL 9016",fr:"Inox",fire:"EI60"} },
  bloc_operatoire:{ h:3.2, walls:"Peinture antibactérienne — Vert bloc RAL 6029", floor:"Sol PVC continu antistatique", ceiling:"Plafond technique bloc", skirt:"Plinthe à gorge", cfo:{s16:8,s32:2,ded:4,light:12,em:2,earth:6,ip:"IP44"}, cfa:{rj45:4,wifi:1,intercom:1,nurse:0,cctv:2,access:1,tv:0}, pl:{ef:1,ec:1,tr:0,sf:0,fd:2,eu:2,ev:1}, vent:{ach:12,t:21,hr:50,pa:15,norm:"NF S90-351"}, cli:{cool:1,kw:8,split:0,cta:"UTA-Bloc"}, door:{w:1200,h:2100,c:"Blanc RAL 9016",fr:"Inox",fire:"EI60"} },
  sspi_reveil:    { h:2.9, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Sol PVC continu", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe à gorge", cfo:{s16:4,s32:0,ded:0,light:4,em:2,earth:3,ip:"IP44"}, cfa:{rj45:2,wifi:1,intercom:1,nurse:0,cctv:1,access:0,tv:0}, pl:{ef:1,ec:1,tr:0,sf:0,fd:1,eu:1,ev:1}, vent:{ach:8,t:22,hr:50,pa:null,norm:"SSPI"}, cli:{cool:1,kw:5,split:0,cta:"UTA-Bloc"}, door:{w:900,h:2100,c:"Blanc RAL 9016",fr:"Inox",fire:"EI30"} },
  urgences_box:   { h:2.8, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame antidérapant R11", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe relevée", cfo:{s16:6,s32:0,ded:2,light:4,em:1,earth:2,ip:"IP44"}, cfa:{rj45:2,wifi:1,intercom:0,nurse:1,cctv:1,access:0,tv:0}, pl:{ef:0,ec:0,tr:0,sf:0,fd:0,eu:0,ev:0}, vent:{ach:6,t:24,hr:null,pa:null,norm:"DTU 68.3"}, cli:{cool:1,kw:3.5,split:1,cta:"CTA-Urgences"}, door:{w:900,h:2100,c:"Blanc",fr:"Alu blanc",fire:""} },
  urgences_dechocage:{ h:2.8, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame antidérapant R11", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe relevée", cfo:{s16:10,s32:1,ded:4,light:6,em:2,earth:4,ip:"IP44"}, cfa:{rj45:3,wifi:1,intercom:1,nurse:2,cctv:2,access:0,tv:0}, pl:{ef:1,ec:1,tr:0,sf:0,fd:1,eu:1,ev:1}, vent:{ach:8,t:22,hr:null,pa:null,norm:"DTU 68.3 / OMS"}, cli:{cool:1,kw:5,split:0,cta:"CTA-Urgences"}, door:{w:1200,h:2100,c:"Blanc",fr:"Alu",fire:"EI30"} },
  salle_travail:  { h:2.9, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame antidérapant R11", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe à gorge", cfo:{s16:8,s32:0,ded:2,light:6,em:1,earth:3,ip:"IP44"}, cfa:{rj45:1,wifi:1,intercom:1,nurse:2,cctv:1,access:0,tv:0}, pl:{ef:1,ec:1,tr:0,sf:0,fd:1,eu:2,ev:1}, vent:{ach:6,t:22,hr:55,pa:null,norm:"Salle accouchement"}, cli:{cool:1,kw:4,split:1,cta:"CTA-Maternité"}, door:{w:900,h:2100,c:"Blanc RAL 9016",fr:"Bois stratifié",fire:""} },
  consultation:   { h:2.7, walls:"Peinture lessivable — Blanc clinique (bandeau accent)", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle minérale", skirt:"Plinthe standard", cfo:{s16:4,s32:0,ded:1,light:3,em:1,earth:1,ip:"IP20"}, cfa:{rj45:2,wifi:1,intercom:0,nurse:0,cctv:0,access:0,tv:0}, pl:{ef:0,ec:0,tr:0,sf:0,fd:0,eu:0,ev:0}, vent:{ach:4,t:24,hr:null,pa:null,norm:"DTU 68.3"}, cli:{cool:1,kw:2.5,split:1,cta:"CTA-Consultations"}, door:{w:830,h:2100,c:"Chêne clair",fr:"MDF stratifié",fire:""} },
  chambre_patient:{ h:2.7, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle minérale", skirt:"Plinthe standard", cfo:{s16:4,s32:0,ded:1,light:3,em:1,earth:2,ip:"IP20"}, cfa:{rj45:1,wifi:1,intercom:0,nurse:1,cctv:0,access:0,tv:1}, pl:{ef:1,ec:1,tr:0,sf:0,fd:0,eu:1,ev:1}, vent:{ach:4,t:24,hr:null,pa:null,norm:"Chambre hospitalière"}, cli:{cool:1,kw:2.2,split:1,cta:"CTA-Hospitalisation"}, door:{w:900,h:2100,c:"Blanc HPL",fr:"Alu",fire:""} },
  hospit_jour:    { h:2.8, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe relevée", cfo:{s16:8,s32:0,ded:2,light:6,em:2,earth:3,ip:"IP44"}, cfa:{rj45:2,wifi:1,intercom:0,nurse:2,cctv:1,access:0,tv:0}, pl:{ef:1,ec:1,tr:0,sf:0,fd:1,eu:2,ev:2}, vent:{ach:6,t:24,hr:null,pa:null,norm:"HDJ"}, cli:{cool:1,kw:6,split:0,cta:"CTA-Hospitalisation"}, door:{w:900,h:2100,c:"Blanc",fr:"Alu",fire:""} },
  imagerie:       { h:3.0, walls:"Peinture lessivable (plombée zone RX si applicable)", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle minérale", skirt:"Plinthe standard", cfo:{s16:4,s32:0,ded:2,light:4,em:1,earth:4,ip:"IP20"}, cfa:{rj45:4,wifi:1,intercom:0,nurse:0,cctv:1,access:1,tv:0}, pl:{ef:0,ec:0,tr:0,sf:0,fd:0,eu:0,ev:0}, vent:{ach:4,t:22,hr:null,pa:null,norm:"Salle RX"}, cli:{cool:1,kw:5,split:0,cta:"CTA-Imagerie"}, door:{w:900,h:2100,c:"Plombée / blindée",fr:"Acier",fire:""} },
  laboratoire:    { h:2.8, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Résine époxy lisse RAL 7035", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe à gorge", cfo:{s16:10,s32:0,ded:3,light:8,em:2,earth:4,ip:"IP44"}, cfa:{rj45:6,wifi:1,intercom:0,nurse:0,cctv:1,access:1,tv:0}, pl:{ef:1,ec:1,tr:1,sf:1,fd:2,eu:3,ev:2}, vent:{ach:8,t:22,hr:null,pa:10,norm:"Laboratoire +10 Pa"}, cli:{cool:1,kw:8,split:0,cta:"CTA-Laboratoire"}, door:{w:900,h:2100,c:"Blanc",fr:"Alu",fire:""} },
  sterilisation:  { h:3.0, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Résine époxy lisse RAL 7035", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe à gorge", cfo:{s16:8,s32:1,ded:2,light:6,em:1,earth:3,ip:"IP44"}, cfa:{rj45:2,wifi:1,intercom:0,nurse:0,cctv:1,access:1,tv:0}, pl:{ef:1,ec:1,tr:1,sf:1,fd:2,eu:4,ev:3}, vent:{ach:10,t:22,hr:45,pa:null,norm:"CSSD"}, cli:{cool:1,kw:6,split:0,cta:"CTA-Stérilisation"}, door:{w:900,h:2100,c:"Blanc",fr:"Inox",fire:"EI30"} },
  accueil_admin:  { h:2.7, walls:"Peinture lessivable — Bleu K'BIO #003F72", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle minérale", skirt:"Plinthe standard", cfo:{s16:6,s32:0,ded:0,light:4,em:1,earth:1,ip:"IP20"}, cfa:{rj45:4,wifi:1,intercom:1,nurse:0,cctv:1,access:1,tv:1}, pl:{ef:0,ec:0,tr:0,sf:0,fd:0,eu:0,ev:0}, vent:{ach:4,t:24,hr:null,pa:null,norm:"Bureaux / accueil"}, cli:{cool:1,kw:3,split:1,cta:"CTA-Admin"}, door:{w:900,h:2100,c:"Verre / alu",fr:"Alu anodisé",fire:""} },
  support:        { h:2.6, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle minérale", skirt:"Plinthe standard", cfo:{s16:2,s32:0,ded:0,light:2,em:1,earth:1,ip:"IP20"}, cfa:{rj45:0,wifi:0,intercom:0,nurse:0,cctv:0,access:0,tv:0}, pl:{ef:0,ec:0,tr:0,sf:0,fd:0,eu:0,ev:0}, vent:{ach:3,t:26,hr:null,pa:null,norm:"Stock / technique"}, cli:{cool:0,kw:0,split:0,cta:"—"}, door:{w:900,h:2100,c:"Gris",fr:"Acier",fire:""} },
  biberonnerie:   { h:2.8, walls:"Peinture lessivable — Blanc clinique RAL 9016", floor:"Carrelage grès cérame", ceiling:"Faux plafond dalle hygiénique", skirt:"Plinthe à gorge", cfo:{s16:6,s32:0,ded:2,light:4,em:1,earth:2,ip:"IP44"}, cfa:{rj45:2,wifi:1,intercom:1,nurse:2,cctv:1,access:0,tv:0}, pl:{ef:1,ec:1,tr:1,sf:0,fd:1,eu:2,ev:2}, vent:{ach:6,t:24,hr:null,pa:null,norm:"Néonatologie"}, cli:{cool:1,kw:4,split:1,cta:"CTA-Maternité"}, door:{w:900,h:2100,c:"Blanc",fr:"Alu",fire:""} },
  locaux_techniques_vrd:{ h:4.0, walls:"Peinture époxy / bardage métal — RAL 7035", floor:"Dalle béton + résine antidérapante", ceiling:"Bac acier / ventilation forcée", skirt:"Plinthe standard", cfo:{s16:4,s32:2,ded:6,light:8,em:2,earth:8,ip:"IP54"}, cfa:{rj45:2,wifi:0,intercom:0,nurse:0,cctv:2,access:1,tv:0}, pl:{ef:1,ec:0,tr:0,sf:0,fd:3,eu:2,ev:1}, vent:{ach:8,t:28,hr:null,pa:null,norm:"Local technique VRD"}, cli:{cool:0,kw:0,split:0,cta:"Production centrale — VRD"}, door:{w:1200,h:2200,c:"Gris RAL 7035",fr:"Acier galvanisé",fire:"EI60"} },
};

// Groupe fonctionnel (entête fiche) selon zone
const GROUPE = {
  accueil_admin:"Groupe 1 : Administration", urgences:"Groupe 2 : Urgences",
  consultations:"Groupe 3 : Consultations", gyneco_obstetrique:"Groupe 4 : Gynéco-Obstétrique",
  bloc_cesarienne:"Groupe 5 : Bloc opératoire", sspi:"Groupe 5 : Bloc opératoire",
  sterilisation:"Groupe 6 : Stérilisation", imagerie:"Groupe 7 : Imagerie",
  laboratoire:"Groupe 8 : Laboratoire", pharmacie:"Groupe 9 : Pharmacie",
  hospitalisation:"Groupe 10 : Hospitalisation", neonatologie:"Groupe 11 : Néonatologie",
  vestiaires:"Groupe 12 : Locaux personnel", locaux_techniques:"Groupe 13 : Technique / VRD",
};

// ───────────────────────── Catalogue des locaux (miroir plan-catalog.ts) ─────
function r(code,name,level,sheet,zf,area,dept,role,layout){return{code,name,level,sheet,zf,area,dept,role,layout};}
const B=(n)=>({brancard:n}), LIT=(n)=>({lit:n});
const ROOMS=[
  // RDC — Accueil / Admin
  r("ACC-01","Accueil","RDC","A-01","accueil_admin",28,"Administration","Accueil patients",{}),
  r("ADM-01","Administration","RDC","A-01","accueil_admin",32,"Administration","Bureaux administratifs",{}),
  r("CAI-01","Caisse","RDC","A-01","accueil_admin",12,"Administration","Caisse / facturation",{}),
  r("ATT-01","Salle d'attente","RDC","A-01","accueil_admin",66,"Communs","Salle d'attente",{}),
  // RDC — Urgences
  r("SAS-URG","Sas accueil urgences","RDC","A-01","urgences",24,"Urgences","Sas urgences",B(2)),
  r("BOX-01","Box 1","RDC","A-01","urgences",14,"Urgences","Box soins urgences",B(2)),
  r("BOX-02","Box 2","RDC","A-01","urgences",14,"Urgences","Box soins urgences",B(2)),
  r("BOX-03","Box 3","RDC","A-01","urgences",14,"Urgences","Box soins urgences",B(2)),
  r("BOX-04","Box 4","RDC","A-01","urgences",10,"Urgences","Box soins urgences",B(1)),
  r("DECH-01","Déchocage","RDC","A-01","urgences",22,"Urgences","Salle de déchocage",B(2)),
  r("PCH-01","Petit chirurgie","RDC","A-01","urgences",18,"Urgences","Petite chirurgie urgences",{table:1}),
  r("INF-URG","Infirmerie urgences","RDC","A-01","urgences",40,"Urgences","Infirmerie urgences",B(1)),
  r("MLAB-01","Mini-labo","RDC","A-01","urgences",14,"Urgences","Prélèvements urgences",{}),
  r("BUR-URG1","Bureau URG 1","RDC","A-01","urgences",12,"Urgences","Bureau médecin urgences",{}),
  r("BUR-URG2","Bureau URG 2","RDC","A-01","urgences",12,"Urgences","Bureau médecin urgences",{}),
  r("STK-URG","Stock urgences","RDC","A-01","urgences",16,"Urgences","Stock consommables",{}),
  // RDC — Consultations / GYN
  r("BCS-01","Bureau CS 1","RDC","A-01","consultations",16,"Consultations","Consultation",{}),
  r("BCS-02","Bureau CS 2","RDC","A-01","consultations",16,"Consultations","Consultation",{}),
  r("BCS-03","Bureau CS 3","RDC","A-01","consultations",16,"Consultations","Consultation",{}),
  r("BCS-04","Bureau CS 4","RDC","A-01","consultations",16,"Consultations","Consultation",{}),
  r("DEN-01","Dentaire","RDC","A-01","consultations",18,"Consultations","Cabinet dentaire",{}),
  r("BGYN-01","Bureau GYN 1","RDC","A-01","gyneco_obstetrique",18,"Gynéco-obstétrique","Consultation gynéco + écho",{gyn:1}),
  r("BGYN-02","Bureau GYN 2","RDC","A-01","gyneco_obstetrique",18,"Gynéco-obstétrique","Consultation gynéco + écho",{gyn:1}),
  r("PRE-01","Pré-travail 1","RDC","A-01","gyneco_obstetrique",16,"Maternité","Pré-travail obstétrique",{pretrav:1}),
  r("PRE-02","Pré-travail 2","RDC","A-01","gyneco_obstetrique",16,"Maternité","Pré-travail obstétrique",{pretrav:1}),
  r("PRE-03","Pré-travail 3","RDC","A-01","gyneco_obstetrique",16,"Maternité","Pré-travail obstétrique",{pretrav:1}),
  r("TRV-01","Salle travail 1","RDC","A-01","gyneco_obstetrique",20,"Maternité","Salle d'accouchement",{accouch:1}),
  r("TRV-02","Salle travail 2","RDC","A-01","gyneco_obstetrique",20,"Maternité","Salle d'accouchement",{accouch:1}),
  r("TRV-03","Salle travail 3","RDC","A-01","gyneco_obstetrique",20,"Maternité","Salle d'accouchement",{accouch:1}),
  r("INF-MAT","Infirmerie maternité","RDC","A-01","gyneco_obstetrique",22,"Maternité","Infirmerie maternité",B(1)),
  r("BMAT-01","Bureau Mat 1","RDC","A-01","gyneco_obstetrique",14,"Maternité","Bureau maternité",{}),
  r("BMAT-02","Bureau Mat 2","RDC","A-01","gyneco_obstetrique",28,"Maternité","Bureau maternité / réunion",{}),
  // RDC — Bloc / SSPI / Stérilisation
  r("BLC-01","Bloc césarienne","RDC","A-01","bloc_cesarienne",48,"Bloc opératoire","Bloc opératoire césarienne",{table:1,pendant:1}),
  r("SAS-BLC","SAS bloc césarienne","RDC","A-01","bloc_cesarienne",12,"Bloc opératoire","SAS bloc",{}),
  r("REV-01","Salle réveil","RDC","A-01","sspi",32,"Anesthésie","SSPI",B(2)),
  r("STE-01","Stérilisation","RDC","A-01","sterilisation",65,"Stérilisation","CSSD",{}),
  // RDC — Imagerie / Labo / Support
  r("SAS-IMG","Sas patient imagerie","RDC","A-01","imagerie",8,"Imagerie","Sas imagerie",{}),
  r("IMG-01","Salle radiologie","RDC","A-01","imagerie",55,"Imagerie","Radiologie numérique",{}),
  r("LAB-01","Laboratoire","RDC","A-01","laboratoire",70,"Laboratoire","Laboratoire analyses",{}),
  r("PHA-01","Pharmacie","RDC","A-01","pharmacie",40,"Pharmacie","Pharmacie",{}),
  r("MAG-01","Magasin","RDC","A-01","pharmacie",24,"Pharmacie","Magasin pharmacie",{}),
  r("VES-H","Vestiaire hommes","RDC","A-01","vestiaires",18,"Support","Vestiaire personnel H",{}),
  r("VES-F","Vestiaire femmes","RDC","A-01","vestiaires",14,"Support","Vestiaire personnel F",{}),
  r("TEC-01","Local technique fluides & CVC","exterieur","VRD-01","locaux_techniques",90,"Technique / VRD","Production O₂ & CVC",{}),
  // RDC — Chambres maternité 1-8
  ...Array.from({length:8},(_,i)=>r(`MAT-${String(i+1).padStart(2,"0")}`,`Chambre maternité ${i+1}`,"RDC","A-01","gyneco_obstetrique",18,"Maternité","Chambre maternité",LIT(1))),
  // R+1 — Hospitalisation médicale
  ...[1,2,3,4,5,6].map(n=>r(`HOS-0${n}`,`Chambre médicale ${n}`,"R+1","A-02","hospitalisation",16,"Médecine","Hospitalisation médicale",LIT(1))),
  r("HOS-07","Chambre médicale 7","R+1","A-02","hospitalisation",22,"Médecine","Hospitalisation médicale (double)",LIT(2)),
  r("HDJ-01","Hospitalisation de jour","R+1","A-02","hospitalisation",45,"Médecine","Hospitalisation de jour",B(5)),
  // R+1 — Maternité chambres 9-14 + biberonnerie
  ...[9,10,11,12,13,14].map(n=>r(`MAT-${String(n).padStart(2,"0")}`,`Chambre maternité ${n}`,"R+1","A-02","gyneco_obstetrique",18,"Maternité","Chambre maternité",LIT(n>=12?2:1))),
  r("BIB-01","Biberonnerie & soin bébé","R+1","A-02","neonatologie",38,"Maternité","Biberonnerie / soin nouveau-né",{berceau:6}),
  // R+1 — Admin / bureaux
  r("ACC-R1","Accueil R+1","R+1","A-02","accueil_admin",20,"Administration","Accueil étage",{}),
  r("ATT-R1","Salle d'attente R+1","R+1","A-02","accueil_admin",34,"Communs","Salle d'attente R+1",{}),
  r("ADM-R1","Administration R+1","R+1","A-02","accueil_admin",48,"Administration","Open space administratif",{}),
  r("INF-R1","Infirmerie R+1","R+1","A-02","hospitalisation",22,"Médecine","Infirmerie hospitalisation",B(1)),
  ...[1,2,3,4,5].map(n=>r(`BUR-R1-${n}`,`Bureau R+1 — ${n}`,"R+1","A-02","consultations",14,"Consultations","Bureau médical R+1",{})),
];

// ───────────────────────── Résolution template (miroir generator.ts) ─────────
function tpl(c,zf,role){
  if(c==="BLC-01")return"bloc_cesarienne";
  if(c.startsWith("BLC")||c==="PCH-01"||c==="SAS-BLC")return"bloc_operatoire";
  if(c==="REV-01")return"sspi_reveil";
  if(c==="DECH-01")return"urgences_dechocage";
  if(c.startsWith("BOX")||c==="SAS-URG"||c==="INF-URG")return"urgences_box";
  if(c.startsWith("TRV")||c.startsWith("PRE"))return"salle_travail";
  if(c.startsWith("BCS")||c.startsWith("BGYN")||c.startsWith("DEN")||c.startsWith("BUR"))return"consultation";
  if(c.startsWith("HOS")||c.startsWith("MAT"))return"chambre_patient";
  if(c==="HDJ-01")return"hospit_jour";
  if(c.startsWith("IMG")||c==="SAS-IMG")return"imagerie";
  if(c.startsWith("LAB")||c==="MLAB-01")return"laboratoire";
  if(c.startsWith("STE"))return"sterilisation";
  if(c==="BIB-01")return"biberonnerie";
  if(zf==="accueil_admin"||c.startsWith("ADM")||c.startsWith("ACC")||c.startsWith("CAI")||c.startsWith("ATT")||c.startsWith("PHA"))return"accueil_admin";
  if(c.startsWith("TEC"))return"locaux_techniques_vrd";
  if(c.startsWith("MAG")||c.startsWith("STK")||c.startsWith("VES"))return"support";
  if(role.toLowerCase().includes("infirmerie"))return"urgences_box";
  return"support";
}

// ───────────────────────── Fluides médicaux par local (étude §E, FIOG) ───────
function gaz(room){
  const L=room.layout,beds=(L.lit||0)+(L.brancard||0)+(L.berceau||0);
  let o2=0,air=0,vide=0,n2o="",agss="";
  switch(tpl(room.code,room.zf,room.role)){
    case"chambre_patient": o2=(L.lit||0)||1; vide=o2; break;
    case"urgences_box": o2=beds||1; air=beds||1; vide=beds||1;
      if(room.code==="SAS-URG"){air=0;} if(room.code==="INF-URG"){o2=1;air=0;vide=1;} break;
    case"urgences_dechocage": o2=2;air=2;vide=2; break;
    case"bloc_cesarienne": o2=2;air=2;vide=2;n2o="à confirmer (R-07)";agss="à confirmer (R-07)"; break;
    case"bloc_operatoire": if(room.code==="PCH-01"){o2=1;air=1;vide=1;agss="à confirmer";} break;
    case"sspi_reveil": o2=2;air=2;vide=2; break;
    case"salle_travail": o2=1;air=1;vide=1; if(room.code.startsWith("TRV"))n2o="MEOPA à confirmer"; break;
    case"hospit_jour": o2=(L.brancard||5);vide=o2; break;
    case"biberonnerie": o2=1;air=1;vide=1; break;
    case"consultation": if(room.zf==="gyneco_obstetrique"){o2=2;vide=2;} break; // GYN: O2+Vide secourus
    default: break;
  }
  if(room.code==="INF-MAT"){o2=1;vide=1;air=0;}
  return{o2,air,vide,n2o,agss};
}

// Bandeau de lit / poste de soin présent → appel malade + secouru
function hasHeadboard(room){const L=room.layout;return(L.lit||L.brancard||L.berceau)?true:false;}

// ───────────────────────── Rendu HTML fiche K'BIO ─────────────────────────────
const cb=(on)=>on?'<span class="cb on">☒</span>':'<span class="cb">☐</span>';
const v=(x)=>x===0?'<span class="z">0</span>':`<b>${x}</b>`;
const txt=(s)=>s?`<b>${s}</b>`:'';

function fiche(room){
  const id=tpl(room.code,room.zf,room.role),t=T[id],g=gaz(room),hb=hasHeadboard(room);
  const grp=GROUPE[room.zf]||"Groupe — à préciser";
  const h=t.h, vol=Math.round(room.area*h*10)/10;
  const isLab=id==="laboratoire"||id==="sterilisation";
  const isBloc=id==="bloc_cesarienne"||id==="bloc_operatoire"||id==="sspi_reveil";
  const isWet=t.pl.ef||t.pl.ec;
  const crit=({bloc_cesarienne:"CRITIQUE",bloc_operatoire:"CRITIQUE",sspi_reveil:"CRITIQUE",urgences_dechocage:"CRITIQUE",
    urgences_box:"ÉLEVÉ",salle_travail:"ÉLEVÉ",chambre_patient:"ÉLEVÉ",hospit_jour:"ÉLEVÉ",imagerie:"ÉLEVÉ",
    laboratoire:"ÉLEVÉ",sterilisation:"ÉLEVÉ",biberonnerie:"ÉLEVÉ",consultation:"MOYEN",accueil_admin:"FAIBLE",
    support:"FAIBLE",locaux_techniques_vrd:"CRITIQUE technique"})[id]||"MOYEN";
  const critCol=({"CRITIQUE":"#dc2828","CRITIQUE technique":"#dc2828","ÉLEVÉ":"#ef8c14","MOYEN":"#ebcd1e","FAIBLE":"#46aa5a"})[crit]||"#888";
  // électricité table rows: [label, qté, bras, mur, gtl]
  const elec=[
    ["PC 16A normale", t.cfo.s16, "", hb?Math.max(0,t.cfo.s16):t.cfo.s16, hb?"":""],
    ["PC 16A ondulée/secourue", hb?4:(crit.startsWith("CRIT")?2:t.cfo.em), "", "", hb?4:""],
    ["PC 20A normale", t.cfo.s32, "", t.cfo.s32, ""],
    ["Alim. spécifique (dédiée)", t.cfo.ded, "", t.cfo.ded, ""],
    ["RJ45", hb?t.cfa.rj45+2:t.cfa.rj45, "", t.cfa.rj45, hb?2:""],
    ["Appel infirmière", hb||t.cfa.nurse?Math.max(1,t.cfa.nurse):0, hb?Math.max(1,t.cfa.nurse):"", "", ""],
    ["Interphone / Visiophone", t.cfa.intercom, "", t.cfa.intercom, ""],
    ["Vidéosurveillance", t.cfa.cctv, "", t.cfa.cctv, ""],
    ["Contrôle d'accès", t.cfa.access, "", t.cfa.access, ""],
    ["Monitoring", isBloc||id==="urgences_box"||id==="urgences_dechocage"?1:0, hb?1:"", "", ""],
    ["Prise TV", t.cfa.tv, "", t.cfa.tv, ""],
  ];
  const fl=[
    ["Oxygène", g.o2, hb?g.o2:"", isBloc?g.o2:"", hb?g.o2:""],
    ["Vide", g.vide, hb?g.vide:"", isBloc?g.vide:"", hb?g.vide:""],
    ["Air médical 3,5 bars", g.air, hb&&g.air?g.air:"", isBloc?g.air:"", ""],
    ["Protoxyde d'azote", g.n2o?"—":0, "", "", ""],
  ];
  const totGaz=g.o2+g.air+g.vide;
  // plomberie
  const plomb=[
    ["Linéaire de paillasse", isLab?"oui":(isWet?"":""), ""],
    ["Lavabo / Lave-mains", isWet?1:0, "EF+ECS"],
    ["Vasque + plan vasque", id==="chambre_patient"?1:0, "EF+ECS"],
    ["Évier", isLab||id==="biberonnerie"?2:0, "EF+ECS"],
    ["Vidoir", id==="urgences_box"||isBloc?1:0, "EF"],
    ["Douche", id==="chambre_patient"?1:0, "EF+ECS"],
    ["WC suspendu", id==="chambre_patient"?1:0, "EF"],
    ["Siphon de sol", t.pl.fd, "EV"],
    ["Lave-bassin", isBloc||id==="urgences_dechocage"?1:0, "EF+ECS"],
    ["Eau traitée / osmosée", t.pl.tr?"oui":0, isLab?"labo/CSSD":""],
    ["Auge chirurgicale", isBloc?1:0, "EF+ECS"],
  ];
  const obs=[];
  obs.push(`Criticité électrique : ${crit}. Régime : ${crit.startsWith("CRIT")?"IT médical / secouru + ondulé":crit==="ÉLEVÉ"?"secouru groupe + ondulé partiel":crit==="MOYEN"?"normal + secours ponctuel":"normal"}.`);
  if(hb)obs.push("Bandeau de lit (BTDL) : O₂/Vide/élec. secourue + appel malade intégrés à la tête de lit.");
  if(isBloc)obs.push("Liaison équipotentielle + contrôleur permanent d'isolement (CPI) avec report d'alarme.");
  if(g.n2o)obs.push(`N₂O / AGSS : ${g.n2o}.`);
  if(id==="imagerie")obs.push("Alim. générateur RX dédiée ; protection plombée ; PACS sur réseau dédié.");
  if(id==="sterilisation")obs.push("Autoclave : alim. force dédiée + vapeur/eau adoucie (R-11).");
  if(room.zf==="gyneco_obstetrique"&&id==="consultation")obs.push("O₂ + Vide secourus (poste examen gynéco/écho) — repris fiche FIOG.");
  obs.push("Données : visible plan A-01/A-02 + fiches FIOG ; valeurs CFO/CFA/CVC déduites des templates K'BIO — à dimensionner par les BE.");

  const row=(a)=>`<tr><td class="l">${a[0]}</td><td>${a[1]===""?"":v(a[1])}</td><td>${a[2]===""?"":v(a[2])}</td><td>${a[3]===""?"":v(a[3])}</td><td>${a[4]===""?"":v(a[4])}</td></tr>`;
  const prow=(a)=>`<tr><td class="l">${a[0]}</td><td>${a[1]===0?'<span class="z">0</span>':`<b>${a[1]}</b>`}</td><td>${a[2]}</td></tr>`;

  return `<section class="fiche">
  <div class="hd">
    <div class="hd-l"><div class="brand">K'BIO — Construction Polyclinique Nassib · FIOG (Djibouti)</div><div class="grp">${grp}</div></div>
    <div class="hd-r"><div class="loc">${room.name}</div><div class="code">Code local : <b>${room.code}</b> · Niveau ${room.level} · Plan ${room.sheet}</div></div>
    <div class="crit" style="background:${critCol}">${crit}</div>
  </div>
  <div class="cols">
    <div class="col">
      <div class="sec">Sols / Murs / Plafonds</div>
      <table class="kv">
        <tr><td>Charge au sol</td><td><b>${id==="locaux_techniques_vrd"?"≥ 500":id==="imagerie"||isLab?"350":"250"}</b> daN/m²</td></tr>
        <tr><td>Sol</td><td>${txt(t.floor)}</td></tr>
        <tr><td>UPEC</td><td><b>${isLab||isBloc?"U4P3E3C3":"U3P3E2C2"}</b></td></tr>
        <tr><td>Murs</td><td>${txt(t.walls)}</td></tr>
        <tr><td>Protection murale</td><td>${cb(true)} 1,20 m ${cb(isBloc||id==="urgences_box")} pleine hauteur ${cb(hb)} butoir lit</td></tr>
        <tr><td>Plafond</td><td>${txt(t.ceiling)}</td></tr>
        <tr><td>Plinthe</td><td>${txt(t.skirt)}</td></tr>
        <tr><td>H. sous faux-plafond</td><td><b>${h.toFixed(2)} m</b></td></tr>
      </table>
      <div class="sec">Portes</div>
      <table class="kv">
        <tr><td>Vantail</td><td><b>${t.door.w}×${t.door.h} mm</b> — ${t.door.c}</td></tr>
        <tr><td>Bâti / huisserie</td><td>${txt(t.door.fr)}</td></tr>
        <tr><td>Degré coupe-feu</td><td>${t.door.fire?`<b>${t.door.fire}</b>`:"—"}</td></tr>
        <tr><td>Contrôle d'accès</td><td>${t.cfa.access?cb(true)+" Contrôlé":cb(true)+" Libre"}</td></tr>
        <tr><td>Protection chocs</td><td>${cb(hb||isBloc)} h. 1,00 m</td></tr>
      </table>
      <div class="sec">Chauffage / Ventilation / Climatisation</div>
      <table class="kv">
        <tr><td>Local climatisé</td><td>${cb(t.cli.cool)} ${t.cli.cool?`${t.cli.kw} kW — ${t.cli.cta}`:"—"}</td></tr>
        <tr><td>Renouvellement air</td><td><b>${t.vent.ach} vol/h</b> — ${t.vent.norm}</td></tr>
        <tr><td>Température consigne</td><td>Été <b>${t.vent.t} °C</b> · Hiver 22 °C</td></tr>
        ${t.vent.hr?`<tr><td>Hygrométrie</td><td><b>${t.vent.hr} %</b></td></tr>`:""}
        ${t.vent.pa?`<tr><td>Surpression</td><td><b>+${t.vent.pa} Pa</b> ${cb(true)} cascade</td></tr>`:""}
        <tr><td>Extraction renforcée</td><td>${cb(isBloc||isLab||id==="urgences_box")}</td></tr>
        <tr><td>Filtration</td><td>${isBloc?"F9 / terminal":"M5 + F7"}</td></tr>
      </table>
    </div>
    <div class="col">
      <div class="sec elec">Électricité — Courants forts &amp; faibles</div>
      <table class="grid"><thead><tr><th class="l">Désignation</th><th>Qté tot.</th><th>Bras</th><th>Mur</th><th>GTL/bandeau</th></tr></thead>
      <tbody>${elec.map(row).join("")}</tbody></table>
      <table class="kv mini"><tr><td>Indice protection</td><td><b>${t.cfo.ip}</b></td></tr>
        <tr><td>Éclairage normal / sécurité</td><td><b>${t.cfo.light}</b> pts / <b>${t.cfo.em}</b> BAES</td></tr>
        <tr><td>Mises à la terre</td><td><b>${t.cfo.earth}</b> ${isBloc?"+ liaison équipot.":""}</td></tr>
        <tr><td>Wi-Fi</td><td>${cb(t.cfa.wifi>0)}</td></tr></table>
      <div class="sec gaz">Fluides médicaux</div>
      <table class="grid"><thead><tr><th class="l">Gaz</th><th>Qté tot.</th><th>Bras</th><th>Mur</th><th>GTL/bandeau</th></tr></thead>
      <tbody>${fl.map(row).join("")}</tbody></table>
      <table class="kv mini">
        <tr><td>N₂O / AGSS</td><td>${g.n2o?`<b>${g.n2o}</b>`:"Non requis"}</td></tr>
        <tr><td>Hauteur libre mini prises</td><td><b>1,40 m</b> (bandeau) / 1,60 m mural</td></tr>
        <tr><td>Total prises gaz</td><td><b>${totGaz}</b></td></tr>
      </table>
    </div>
    <div class="col">
      <div class="sec">Surface</div>
      <table class="kv"><tr><td>Surface utile</td><td><b>${room.area} m²</b> <span class="src">(plan ${room.sheet})</span></td></tr>
        <tr><td>Hauteur / Volume</td><td><b>${h.toFixed(2)} m</b> / ${vol} m³</td></tr></table>
      <div class="sec">Plomberie sanitaire</div>
      <table class="grid p"><thead><tr><th class="l">Désignation</th><th>Qté</th><th>Alim.</th></tr></thead>
      <tbody>${plomb.map(prow).join("")}</tbody></table>
      <div class="sec obs">Observations / équipements compris dans l'opération</div>
      <div class="obsbox"><ul>${obs.map(o=>`<li>${o}</li>`).join("")}</ul></div>
    </div>
  </div>
  <div class="ft">Fiche local — ${room.code} · ${room.name} · Polyclinique Nassib (FIOG) · zonage de principe — ne vaut pas plan d'exécution. Source : plans A-01/A-02 (180526) + fiches d'équipement FIOG.</div>
</section>`;
}

const CSS=`
*{box-sizing:border-box} body{font-family:'DejaVu Sans',Arial,sans-serif;margin:0;color:#15202b;background:#e9edf1}
.fiche{width:297mm;min-height:209mm;padding:6mm 7mm;background:#fff;page-break-after:always;display:flex;flex-direction:column}
.hd{display:flex;align-items:stretch;border:1.5px solid #15202b;margin-bottom:3mm}
.hd-l{flex:1;padding:3mm 4mm;background:#eef3f7;border-right:1.5px solid #15202b}
.brand{font-size:9pt;color:#003f72;font-weight:bold} .grp{font-size:13pt;font-weight:bold;margin-top:1mm}
.hd-r{flex:1.1;padding:3mm 4mm} .loc{font-size:15pt;font-weight:bold} .code{font-size:9.5pt;margin-top:1mm;color:#33424f}
.crit{display:flex;align-items:center;justify-content:center;width:34mm;color:#fff;font-weight:bold;font-size:11pt;letter-spacing:.5px}
.cols{display:flex;gap:4mm;flex:1} .col{flex:1;min-width:0}
.sec{background:#15202b;color:#fff;font-size:9.5pt;font-weight:bold;padding:1.4mm 2mm;margin:2mm 0 1mm}
.sec.elec{background:#003f72}.sec.gaz{background:#00785a}.sec.obs{background:#5b3a87}
table{width:100%;border-collapse:collapse;font-size:8.3pt}
.kv td{border:.5px solid #cdd5dc;padding:1mm 1.6mm;vertical-align:top}
.kv td:first-child{color:#46566a;width:42%}
.kv.mini{margin-top:1mm}
.grid th,.grid td{border:.5px solid #b9c3cc;padding:.9mm 1mm;text-align:center}
.grid th{background:#dde7ee;font-size:7.6pt} .grid td.l,.grid th.l{text-align:left}
.grid .l{width:46%}
.grid.p .l{width:54%}
.cb{font-size:9pt;color:#8a97a3}.cb.on{color:#003f72;font-weight:bold}
.z{color:#aab4bd}.src{color:#8a97a3;font-size:7pt}
.obsbox{border:.5px solid #cdd5dc;padding:1mm 2mm;font-size:7.9pt;flex:1}
.obsbox ul{margin:.5mm 0;padding-left:4mm}.obsbox li{margin-bottom:1mm}
.ft{margin-top:2mm;border-top:1px solid #cdd5dc;padding-top:1mm;font-size:7pt;color:#8a97a3}
@media print{body{background:#fff}.fiche{margin:0}}
@page{size:A4 landscape;margin:0}
`;

const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Fiches locaux — Polyclinique Nassib (FIOG)</title><style>${CSS}</style></head>
<body>
<section class="fiche" style="justify-content:center;text-align:center">
  <div style="border:2px solid #15202b;padding:18mm 14mm">
    <div style="color:#003f72;font-weight:bold;font-size:12pt">K'BIO — Construction Polyclinique Nassib · Fondation Ismail Omar Guelleh (Djibouti)</div>
    <h1 style="font-size:26pt;margin:6mm 0">FICHES LOCAUX — DONNÉES ROOM-BY-ROOM</h1>
    <div style="font-size:13pt">CFO / CFA · Fluides médicaux · CVC · Plomberie · Finitions</div>
    <div style="margin-top:8mm;font-size:11pt;color:#33424f">${ROOMS.length} locaux — Niveaux RDC (A-01) &amp; R+1 (A-02)</div>
    <div style="margin-top:14mm;font-size:9pt;color:#8a97a3">Gabarit fiche local K'BIO rempli automatiquement à partir du catalogue des locaux et des templates techniques.<br>
    Données : visible plan / fiches FIOG + valeurs déduites/proposées à dimensionner par les bureaux d'études. Ne vaut pas plan d'exécution.</div>
  </div>
</section>
${ROOMS.map(fiche).join("\n")}
</body></html>`;

const outDir=join(ROOT,"docs","fiches-locaux");
mkdirSync(outDir,{recursive:true});
const outFile=join(outDir,"fiches-locaux-nassib.html");
writeFileSync(outFile,html,"utf8");
console.log(`OK — ${ROOMS.length} fiches écrites dans ${outFile}`);

// Export JSON des valeurs clés par local (pour les plans d'implantation des prises)
const data=ROOMS.map((room)=>{
  const id=tpl(room.code,room.zf,room.role),t=T[id],g=gaz(room),hb=hasHeadboard(room);
  const crit=({bloc_cesarienne:"C",bloc_operatoire:"C",sspi_reveil:"C",urgences_dechocage:"C",
    urgences_box:"E",salle_travail:"E",chambre_patient:"E",hospit_jour:"E",imagerie:"E",
    laboratoire:"E",sterilisation:"E",biberonnerie:"E",consultation:"M",accueil_admin:"F",
    support:"F",locaux_techniques_vrd:"C"})[id]||"M";
  return {
    code:room.code, name:room.name, level:room.level, dept:room.dept, crit,
    o2:g.o2, air:g.air, vide:g.vide, n2o:g.n2o?1:0, agss:g.agss?1:0,
    pc16:t.cfo.s16, pc20:t.cfo.s32, ded:t.cfo.ded,
    ondule: hb?4:(crit==="C"?2:t.cfo.em),
    rj45: hb?t.cfa.rj45+2:t.cfa.rj45,
    nurse: hb?Math.max(1,t.cfa.nurse):t.cfa.nurse,
    cctv:t.cfa.cctv, access:t.cfa.access, hb:hb?1:0,
  };
});
writeFileSync(join(outDir,"rooms-data.json"),JSON.stringify(data,null,1),"utf8");
console.log(`OK — données JSON: ${join(outDir,"rooms-data.json")}`);
