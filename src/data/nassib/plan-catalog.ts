import type { NassibRoom } from "@/types/nassib";
import type { RoomProfile } from "@/types/room-hub";
import type { RoomDispatch } from "@/types/programme";
import type { PlanRoomDef } from "./plan-types";
import { LAYOUTS, PLAN_METADATA } from "./plan-layouts";
import { NASSIB_PROJECT_ID } from "@/lib/nassib/constants";
import { computeMedicalGasOutletsFromLayout } from "@/lib/nassib/medical-gas-outlets";

type PartialRoom = Omit<
  PlanRoomDef,
  "id" | "code" | "name" | "level" | "planSheet" | "layout"
> & {
  code: string;
  name: string;
  level: PlanRoomDef["level"];
  planSheet: PlanRoomDef["planSheet"];
  layout: PlanRoomDef["layout"];
  id?: string;
};

const NEEDS = {
  accueil: {
    cfo: true, cfa: true, vdi: true, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: false, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: false, medicalFurniture: true,
    adminFurniture: true, itEquipment: true,
  },
  consultation: {
    cfo: true, cfa: true, vdi: true, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: false, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: true,
    adminFurniture: true, itEquipment: true,
  },
  gynTravail: {
    cfo: true, cfa: true, vdi: false, medicalGas: true, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: true, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: true,
    adminFurniture: false, itEquipment: false,
  },
  urgBox: {
    cfo: true, cfa: true, vdi: true, medicalGas: true, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: false, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: true,
    adminFurniture: false, itEquipment: true,
  },
  bloc: {
    cfo: true, cfa: true, vdi: true, medicalGas: true, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: true, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: true,
    adminFurniture: false, itEquipment: true,
  },
  imagerie: {
    cfo: true, cfa: true, vdi: true, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: false, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: false,
    adminFurniture: false, itEquipment: true,
  },
  chambre: {
    cfo: true, cfa: true, vdi: true, medicalGas: true, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: true, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: false, medicalFurniture: true,
    adminFurniture: false, itEquipment: true,
  },
  support: {
    cfo: true, cfa: false, vdi: false, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: false, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: false, medicalFurniture: true,
    adminFurniture: false, itEquipment: false,
  },
  labo: {
    cfo: true, cfa: true, vdi: true, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: true, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: true,
    adminFurniture: false, itEquipment: true,
  },
  pharma: {
    cfo: true, cfa: true, vdi: true, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: false, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: true,
    adminFurniture: true, itEquipment: true,
  },
  ste: {
    cfo: true, cfa: false, vdi: false, medicalGas: false, o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0,
    plumbing: true, cvc: true, ventilation: true, ssi: true, biomedicalEquipment: true, medicalFurniture: false,
    adminFurniture: false, itEquipment: false,
  },
};

function room(p: PartialRoom): PlanRoomDef {
  const id = p.id ?? `r-${p.code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const gas = computeMedicalGasOutletsFromLayout(p.layout, {
    medicalGasEnabled: p.needs.medicalGas,
    zoneFunction: p.zoneFunction,
  });
  const needs = {
    ...p.needs,
    o2Outlets: gas.o2Outlets,
    vacuumOutlets: gas.vacuumOutlets,
    medicalAirOutlets: gas.medicalAirOutlets,
    medicalGas:
      p.needs.medicalGas &&
      gas.o2Outlets + gas.vacuumOutlets + gas.medicalAirOutlets > 0,
  };
  return {
    id,
    code: p.code,
    name: p.name,
    level: p.level,
    zoneId: p.zoneId,
    zoneFunction: p.zoneFunction,
    areaM2: p.areaM2,
    planSheet: p.planSheet,
    functionalRole: p.functionalRole,
    clinicalActivity: p.clinicalActivity,
    department: p.department,
    lots: p.lots,
    needs,
    staffing: p.staffing,
    prerequisites: p.prerequisites,
    receptionStatus: p.receptionStatus,
    layout: p.layout,
    status: p.status,
    checklistDone: p.checklistDone,
    checklistTotal: p.checklistTotal,
    reservesOpen: p.reservesOpen,
  };
}

function matRoom(n: number, opts?: { wc?: boolean; area?: number; status?: PlanRoomDef["status"] }): PlanRoomDef {
  const wcRooms = [9, 10, 11, 12, 13, 14];
  const hasWc = opts?.wc ?? wcRooms.includes(n);
  return room({
    code: `MAT-${String(n).padStart(2, "0")}`,
    name: `Chambre maternité ${n}`,
    level: n <= 8 ? "RDC" : "R+1",
    planSheet: n <= 8 ? "A-01" : "A-02",
    zoneId: "zone-mat",
    zoneFunction: "gyneco_obstetrique",
    areaM2: opts?.area ?? 18,
    functionalRole: "Chambre maternité",
    clinicalActivity: "Post-partum, surveillance mère-né",
    department: "Maternité",
    lots: ["LOT-GO", "LOT-CVC", "LOT-PLOMB", "LOT-FLUIDES"],
    needs: NEEDS.chambre,
    staffing: { nurses: 1, doctors: 0, aides: 1, admin: 0 },
    prerequisites: ["Appel infirmier", "Prise O₂"],
    receptionStatus: "not_started",
    layout: hasWc ? LAYOUTS.chambreMaterniteWC : LAYOUTS.chambreMaternite,
    status: opts?.status ?? "rough_in",
    checklistDone: 3,
    checklistTotal: 14,
    reservesOpen: n === 12 ? 1 : 0,
  });
}

function hosRoom(n: number, layout: PlanRoomDef["layout"], area = 16): PlanRoomDef {
  return room({
    code: `HOS-${String(n).padStart(2, "0")}`,
    name: `Chambre médicale ${n}`,
    level: "R+1",
    planSheet: "A-02",
    zoneId: "zone-hosp",
    zoneFunction: "hospitalisation",
    areaM2: area,
    functionalRole: "Hospitalisation médicale",
    clinicalActivity: "Chambre individuelle ou double",
    department: "Médecine",
    lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES", "LOT-PLOMB"],
    needs: NEEDS.chambre,
    staffing: { nurses: 1, doctors: 0, aides: 1, admin: 0 },
    prerequisites: ["Lit hospitalier", "Appel infirmier"],
    receptionStatus: "not_started",
    layout,
    status: n <= 2 ? "shell" : "rough_in",
    checklistDone: 2,
    checklistTotal: 14,
    reservesOpen: 0,
  });
}

/** Catalogue complet — plans A-01 (RDC) + A-02 (R+1) du 26/04/2026 */
export const PLAN_ROOM_CATALOG: PlanRoomDef[] = [
  // ── RDC — Accueil / Admin ──
  room({ code: "ACC-01", name: "Accueil", level: "RDC", planSheet: "A-01", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 28, functionalRole: "Accueil patients", clinicalActivity: "Orientation, information", department: "Administration", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 1, admin: 3 }, prerequisites: ["Réseau VDI"], receptionStatus: "in_progress", layout: LAYOUTS.accueil, status: "finishes", checklistDone: 10, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "ADM-01", name: "Administration", level: "RDC", planSheet: "A-01", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 32, functionalRole: "Bureaux administratifs", clinicalActivity: "Gestion, direction", department: "Administration", lots: ["LOT-GO", "LOT-CFA", "LOT-VDI"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 4 }, prerequisites: [], receptionStatus: "in_progress", layout: LAYOUTS.bureauAdmin, status: "finishes", checklistDone: 9, checklistTotal: 12, reservesOpen: 0 }),
  room({ code: "CAI-01", name: "Caisse", level: "RDC", planSheet: "A-01", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 12, functionalRole: "Caisse / facturation", clinicalActivity: "Encaissement", department: "Administration", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 2 }, prerequisites: [], receptionStatus: "in_progress", layout: LAYOUTS.caisse, status: "finishes", checklistDone: 8, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "ATT-01", name: "Salle d'attente", level: "RDC", planSheet: "A-01", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 66, functionalRole: "Salle d'attente", clinicalActivity: "Flux patients et familles", department: "Communs", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 1, admin: 0 }, prerequisites: [], receptionStatus: "in_progress", layout: LAYOUTS.salleAttente, status: "finishes", checklistDone: 11, checklistTotal: 12, reservesOpen: 0 }),

  // ── RDC — Urgences ──
  room({ code: "SAS-URG", name: "Sas accueil urgences", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 24, functionalRole: "Sas urgences", clinicalActivity: "Filtrage entrée urgences", department: "Urgences", lots: ["LOT-GO", "LOT-SSI"], needs: NEEDS.urgBox, staffing: { nurses: 1, doctors: 0, aides: 1, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.sasAccueilUrg, status: "mep_embedded", checklistDone: 6, checklistTotal: 16, reservesOpen: 0 }),
  room({ code: "BOX-01", name: "Box 1", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 14, functionalRole: "Box soins urgences", clinicalActivity: "Stabilisation", department: "Urgences", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES", "LOT-CFO"], needs: NEEDS.urgBox, staffing: { nurses: 1, doctors: 1, aides: 0, admin: 0 }, prerequisites: ["Réseau O₂"], receptionStatus: "not_started", layout: LAYOUTS.boxUrgences, status: "mep_embedded", checklistDone: 7, checklistTotal: 18, reservesOpen: 1 }),
  room({ code: "BOX-02", name: "Box 2", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 14, functionalRole: "Box soins urgences", clinicalActivity: "Stabilisation", department: "Urgences", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES"], needs: NEEDS.urgBox, staffing: { nurses: 1, doctors: 1, aides: 0, admin: 0 }, prerequisites: ["Réseau O₂"], receptionStatus: "not_started", layout: LAYOUTS.boxUrgences, status: "mep_embedded", checklistDone: 6, checklistTotal: 18, reservesOpen: 0 }),
  room({ code: "BOX-03", name: "Box 3", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 14, functionalRole: "Box soins urgences", clinicalActivity: "Stabilisation", department: "Urgences", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES", "LOT-PLOMB"], needs: NEEDS.urgBox, staffing: { nurses: 1, doctors: 1, aides: 0, admin: 0 }, prerequisites: ["Réseau O₂"], receptionStatus: "not_started", layout: LAYOUTS.boxUrgences, status: "mep_embedded", checklistDone: 5, checklistTotal: 18, reservesOpen: 1 }),
  room({ code: "BOX-04", name: "Box 4", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 10, functionalRole: "Box soins urgences", clinicalActivity: "Soins isolés", department: "Urgences", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES"], needs: NEEDS.urgBox, staffing: { nurses: 1, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.boxUrgencesSimple, status: "rough_in", checklistDone: 4, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "DECH-01", name: "Déchocage", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 22, functionalRole: "Salle de déchocage", clinicalActivity: "Réanimation initiale", department: "Urgences", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES", "LOT-CFO", "LOT-BIO"], needs: NEEDS.urgBox, staffing: { nurses: 2, doctors: 1, aides: 1, admin: 0 }, prerequisites: ["O₂", "Aspiration"], receptionStatus: "not_started", layout: LAYOUTS.dechocage, status: "mep_embedded", checklistDone: 6, checklistTotal: 20, reservesOpen: 0 }),
  room({ code: "PCH-01", name: "Petit chirurgie", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 18, functionalRole: "Petite chirurgie urgences", clinicalActivity: "Actes mineurs", department: "Urgences", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES", "LOT-BIO"], needs: NEEDS.bloc, staffing: { nurses: 1, doctors: 1, aides: 1, admin: 0 }, prerequisites: ["Flux laminaire"], receptionStatus: "not_started", layout: LAYOUTS.petitChir, status: "mep_embedded", checklistDone: 5, checklistTotal: 18, reservesOpen: 0 }),
  room({ code: "INF-URG", name: "Infirmerie urgences", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 40, functionalRole: "Infirmerie urgences", clinicalActivity: "Poste soins, stock médicaments", department: "Urgences", lots: ["LOT-GO", "LOT-CFA", "LOT-CVC"], needs: NEEDS.urgBox, staffing: { nurses: 3, doctors: 0, aides: 1, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.infirmerieUrg, status: "rough_in", checklistDone: 4, checklistTotal: 16, reservesOpen: 0 }),
  room({ code: "MLAB-01", name: "Mini-labo", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 14, functionalRole: "Prélèvements urgences", clinicalActivity: "Analyses rapides", department: "Urgences", lots: ["LOT-GO", "LOT-PLOMB"], needs: NEEDS.labo, staffing: { nurses: 0, doctors: 0, aides: 1, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.miniLabo, status: "rough_in", checklistDone: 3, checklistTotal: 12, reservesOpen: 0 }),
  room({ code: "BUR-URG1", name: "Bureau URG 1", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 12, functionalRole: "Bureau médecin urgences", clinicalActivity: "Consultation / coordination", department: "Urgences", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauUrg, status: "rough_in", checklistDone: 4, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "BUR-URG2", name: "Bureau URG 2", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 12, functionalRole: "Bureau médecin urgences", clinicalActivity: "Consultation / coordination", department: "Urgences", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauUrg, status: "rough_in", checklistDone: 3, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "STK-URG", name: "Stock urgences", level: "RDC", planSheet: "A-01", zoneId: "zone-urg", zoneFunction: "urgences", areaM2: 16, functionalRole: "Stock consommables urgences", clinicalActivity: "Logistique médicale", department: "Urgences", lots: ["LOT-GO"], needs: NEEDS.support, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.stock, status: "finishes", checklistDone: 8, checklistTotal: 10, reservesOpen: 0 }),

  // ── RDC — Consultations / GYN ──
  room({ code: "BCS-01", name: "Bureau CS 1", level: "RDC", planSheet: "A-01", zoneId: "zone-cons", zoneFunction: "consultations", areaM2: 16, functionalRole: "Consultation", clinicalActivity: "Consultation générale", department: "Consultations", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauCS, status: "rough_in", checklistDone: 4, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "BCS-02", name: "Bureau CS 2", level: "RDC", planSheet: "A-01", zoneId: "zone-cons", zoneFunction: "consultations", areaM2: 16, functionalRole: "Consultation", clinicalActivity: "Consultation générale", department: "Consultations", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauCS, status: "rough_in", checklistDone: 4, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "BCS-03", name: "Bureau CS 3", level: "RDC", planSheet: "A-01", zoneId: "zone-cons", zoneFunction: "consultations", areaM2: 16, functionalRole: "Consultation", clinicalActivity: "Consultation générale", department: "Consultations", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauCS, status: "rough_in", checklistDone: 3, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "BCS-04", name: "Bureau CS 4", level: "RDC", planSheet: "A-01", zoneId: "zone-cons", zoneFunction: "consultations", areaM2: 16, functionalRole: "Consultation", clinicalActivity: "Consultation générale", department: "Consultations", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauCS, status: "rough_in", checklistDone: 3, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "DEN-01", name: "Dentaire", level: "RDC", planSheet: "A-01", zoneId: "zone-cons", zoneFunction: "consultations", areaM2: 18, functionalRole: "Cabinet dentaire", clinicalActivity: "Soins dentaires", department: "Consultations", lots: ["LOT-GO", "LOT-CVC", "LOT-PLOMB"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 1, admin: 0 }, prerequisites: ["Aspiration"], receptionStatus: "not_started", layout: LAYOUTS.dentaire, status: "rough_in", checklistDone: 3, checklistTotal: 16, reservesOpen: 0 }),
  room({ code: "BGYN-01", name: "Bureau GYN 1", level: "RDC", planSheet: "A-01", zoneId: "zone-gyn", zoneFunction: "gyneco_obstetrique", areaM2: 18, functionalRole: "Consultation gynécologique", clinicalActivity: "CS + échographie", department: "Gynéco-obstétrique", lots: ["LOT-GO", "LOT-CVC", "LOT-VDI"], needs: NEEDS.consultation, staffing: { nurses: 1, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauGYN, status: "rough_in", checklistDone: 4, checklistTotal: 16, reservesOpen: 0 }),
  room({ code: "BGYN-02", name: "Bureau GYN 2", level: "RDC", planSheet: "A-01", zoneId: "zone-gyn", zoneFunction: "gyneco_obstetrique", areaM2: 18, functionalRole: "Consultation gynécologique", clinicalActivity: "CS + échographie", department: "Gynéco-obstétrique", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.consultation, staffing: { nurses: 1, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauGYN, status: "rough_in", checklistDone: 3, checklistTotal: 16, reservesOpen: 0 }),
  ...[1, 2, 3].map((n) =>
    room({ code: `PRE-${String(n).padStart(2, "0")}`, name: `Pré-travail ${n}`, level: "RDC", planSheet: "A-01", zoneId: "zone-gyn", zoneFunction: "gyneco_obstetrique", areaM2: 16, functionalRole: "Pré-travail obstétrique", clinicalActivity: "Surveillance début travail", department: "Maternité", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES"], needs: NEEDS.gynTravail, staffing: { nurses: 1, doctors: 0, aides: 1, admin: 0 }, prerequisites: ["Toco"], receptionStatus: "not_started", layout: LAYOUTS.preTravail, status: "mep_embedded", checklistDone: 5, checklistTotal: 16, reservesOpen: 0 }),
  ),
  ...[1, 2, 3].map((n) =>
    room({ code: `TRV-${String(n).padStart(2, "0")}`, name: `Salle travail ${n}`, level: "RDC", planSheet: "A-01", zoneId: "zone-gyn", zoneFunction: "gyneco_obstetrique", areaM2: 20, functionalRole: "Salle d'accouchement", clinicalActivity: "Accouchement voie basse", department: "Maternité", lots: ["LOT-GO", "LOT-CVC", "LOT-PLOMB", "LOT-FLUIDES"], needs: NEEDS.gynTravail, staffing: { nurses: 2, doctors: 1, aides: 2, admin: 0 }, prerequisites: ["Table accouchement", "O₂"], receptionStatus: "not_started", layout: LAYOUTS.salleTravail, status: "mep_embedded", checklistDone: 6, checklistTotal: 20, reservesOpen: n === 1 ? 1 : 0 }),
  ),
  room({ code: "INF-MAT", name: "Infirmerie maternité", level: "RDC", planSheet: "A-01", zoneId: "zone-gyn", zoneFunction: "gyneco_obstetrique", areaM2: 22, functionalRole: "Infirmerie maternité", clinicalActivity: "Poste soins maternité", department: "Maternité", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.gynTravail, staffing: { nurses: 2, doctors: 0, aides: 1, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.infirmerieMat, status: "rough_in", checklistDone: 4, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "BMAT-01", name: "Bureau Mat 1", level: "RDC", planSheet: "A-01", zoneId: "zone-mat", zoneFunction: "gyneco_obstetrique", areaM2: 14, functionalRole: "Bureau maternité", clinicalActivity: "Coordination maternité", department: "Maternité", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 2 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauMat, status: "rough_in", checklistDone: 3, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "BMAT-02", name: "Bureau Mat 2", level: "RDC", planSheet: "A-01", zoneId: "zone-mat", zoneFunction: "gyneco_obstetrique", areaM2: 28, functionalRole: "Bureau maternité / réunion", clinicalActivity: "Coordination équipe", department: "Maternité", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 2 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauMat2, status: "rough_in", checklistDone: 3, checklistTotal: 12, reservesOpen: 0 }),

  // ── RDC — Bloc / SSPI / Stérilisation ──
  room({ code: "BLC-01", name: "Bloc césarienne", level: "RDC", planSheet: "A-01", zoneId: "zone-bloc", zoneFunction: "bloc_cesarienne", areaM2: 48, functionalRole: "Bloc opératoire césarienne", clinicalActivity: "Chirurgie obstétrique", department: "Bloc opératoire", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES", "LOT-BIO", "LOT-CFO"], needs: NEEDS.bloc, staffing: { nurses: 3, doctors: 2, aides: 2, admin: 0 }, prerequisites: ["UTA bloc", "Pendentif anesthésie"], receptionStatus: "not_started", layout: LAYOUTS.blocCesar, status: "mep_embedded", checklistDone: 9, checklistTotal: 24, reservesOpen: 4 }),
  room({ code: "SAS-BLC", name: "SAS bloc césarienne", level: "RDC", planSheet: "A-01", zoneId: "zone-bloc", zoneFunction: "bloc_cesarienne", areaM2: 12, functionalRole: "SAS bloc", clinicalActivity: "Airlock bloc", department: "Bloc opératoire", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.bloc, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: [], status: "mep_embedded", checklistDone: 4, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "REV-01", name: "Salle réveil", level: "RDC", planSheet: "A-01", zoneId: "zone-sspi", zoneFunction: "sspi", areaM2: 32, functionalRole: "SSPI", clinicalActivity: "Surveillance post-interventionnelle", department: "Anesthésie", lots: ["LOT-GO", "LOT-CVC", "LOT-FLUIDES"], needs: NEEDS.bloc, staffing: { nurses: 2, doctors: 1, aides: 1, admin: 0 }, prerequisites: ["Moniteurs SSPI"], receptionStatus: "not_started", layout: LAYOUTS.salleReveil, status: "rough_in", checklistDone: 5, checklistTotal: 18, reservesOpen: 1 }),
  room({ code: "STE-01", name: "Stérilisation", level: "RDC", planSheet: "A-01", zoneId: "zone-ster", zoneFunction: "sterilisation", areaM2: 65, functionalRole: "CSSD", clinicalActivity: "Lavage, stérilisation", department: "Stérilisation", lots: ["LOT-GO", "LOT-PLOMB", "LOT-CVC", "LOT-BIO"], needs: NEEDS.ste, staffing: { nurses: 0, doctors: 0, aides: 4, admin: 1 }, prerequisites: ["Eau adoucie", "Autoclave"], receptionStatus: "not_started", layout: LAYOUTS.sterilisation, status: "rough_in", checklistDone: 4, checklistTotal: 20, reservesOpen: 2 }),

  // ── RDC — Imagerie / Labo / Support ──
  room({ code: "SAS-IMG", name: "Sas patient imagerie", level: "RDC", planSheet: "A-01", zoneId: "zone-img", zoneFunction: "imagerie", areaM2: 8, functionalRole: "Sas imagerie", clinicalActivity: "Attente examen RX", department: "Imagerie", lots: ["LOT-GO"], needs: NEEDS.imagerie, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.sasPatient, status: "rough_in", checklistDone: 2, checklistTotal: 8, reservesOpen: 0 }),
  room({ code: "IMG-01", name: "Salle radiologie", level: "RDC", planSheet: "A-01", zoneId: "zone-img", zoneFunction: "imagerie", areaM2: 55, functionalRole: "Radiologie numérique", clinicalActivity: "Imagerie médicale", department: "Imagerie", lots: ["LOT-GO", "LOT-CVC", "LOT-CFO", "LOT-VDI"], needs: NEEDS.imagerie, staffing: { nurses: 1, doctors: 1, aides: 1, admin: 0 }, prerequisites: ["Blindage électrique", "PACS"], receptionStatus: "not_started", layout: LAYOUTS.radiologie, status: "mep_embedded", checklistDone: 7, checklistTotal: 20, reservesOpen: 2 }),
  room({ code: "LAB-01", name: "Laboratoire", level: "RDC", planSheet: "A-01", zoneId: "zone-lab", zoneFunction: "laboratoire", areaM2: 70, functionalRole: "Laboratoire analyses", clinicalActivity: "Biochimie, hématologie", department: "Laboratoire", lots: ["LOT-GO", "LOT-PLOMB", "LOT-CVC", "LOT-VDI"], needs: NEEDS.labo, staffing: { nurses: 0, doctors: 0, aides: 3, admin: 2 }, prerequisites: ["Eau osmosée"], receptionStatus: "not_started", layout: LAYOUTS.laboratoire, status: "rough_in", checklistDone: 5, checklistTotal: 18, reservesOpen: 1 }),
  room({ code: "PHA-01", name: "Pharmacie", level: "RDC", planSheet: "A-01", zoneId: "zone-pharma", zoneFunction: "pharmacie", areaM2: 40, functionalRole: "Pharmacie", clinicalActivity: "Dispensation", department: "Pharmacie", lots: ["LOT-GO", "LOT-CVC", "LOT-CFA"], needs: NEEDS.pharma, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 3 }, prerequisites: ["Armoires réfrigérées"], receptionStatus: "in_progress", layout: LAYOUTS.pharmacie, status: "finishes", checklistDone: 10, checklistTotal: 16, reservesOpen: 1 }),
  room({ code: "MAG-01", name: "Magasin", level: "RDC", planSheet: "A-01", zoneId: "zone-pharma", zoneFunction: "pharmacie", areaM2: 24, functionalRole: "Magasin pharmacie", clinicalActivity: "Stock médicaments", department: "Pharmacie", lots: ["LOT-GO"], needs: NEEDS.support, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 1 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.magasin, status: "rough_in", checklistDone: 4, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "VES-H", name: "Vestiaire hommes", level: "RDC", planSheet: "A-01", zoneId: "zone-circ", zoneFunction: "vestiaires", areaM2: 18, functionalRole: "Vestiaire personnel H", clinicalActivity: "Locaux personnel", department: "Support", lots: ["LOT-GO"], needs: NEEDS.support, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.vestiaireH, status: "finishes", checklistDone: 8, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "VES-F", name: "Vestiaire femmes", level: "RDC", planSheet: "A-01", zoneId: "zone-circ", zoneFunction: "vestiaires", areaM2: 14, functionalRole: "Vestiaire personnel F", clinicalActivity: "Locaux personnel", department: "Support", lots: ["LOT-GO"], needs: NEEDS.support, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.vestiaireF, status: "finishes", checklistDone: 7, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "TEC-01", name: "Local technique fluides & CVC", level: "exterieur", planSheet: "VRD-01", zoneId: "zone-vrd", zoneFunction: "locaux_techniques", areaM2: 90, functionalRole: "Production O₂ & CVC — VRD arrière bâtiment", clinicalActivity: "Unité de production d'oxygène, groupes froid, TGBT (hors enveloppe bâtiment)", department: "Technique / VRD", lots: ["LOT-VRD", "LOT-CVC", "LOT-FLUIDES", "LOT-CFO"], needs: { ...NEEDS.support, cvc: true, plumbing: true, medicalGas: true, biomedicalEquipment: true }, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: ["Unité de production d'oxygène", "Emprise VRD validée — arrière bâtiment", "Alimentation ENEDIS / TGBT"], receptionStatus: "not_started", layout: [{ name: "Unité de production d'oxygène", category: "technical", qty: 1 }, { name: "Groupe froid CVC", category: "biomedical", qty: 2 }, { name: "TGBT", category: "technical", qty: 1 }], status: "mep_embedded", checklistDone: 6, checklistTotal: 14, reservesOpen: 2 }),

  // ── RDC — Chambres maternité 1-8 (plan implantation) ──
  ...Array.from({ length: 8 }, (_, i) => matRoom(i + 1)),

  // ── R+1 — Hospitalisation médicale ──
  hosRoom(1, LAYOUTS.chambreMedA),
  hosRoom(2, LAYOUTS.chambreMedB),
  hosRoom(3, LAYOUTS.chambreMedB),
  hosRoom(4, LAYOUTS.chambreMedA),
  hosRoom(5, LAYOUTS.chambreMedB),
  hosRoom(6, LAYOUTS.chambreMedA),
  hosRoom(7, LAYOUTS.chambreMedDouble, 22),
  room({ code: "HDJ-01", name: "Hospitalisation de jour", level: "R+1", planSheet: "A-02", zoneId: "zone-hosp", zoneFunction: "hospitalisation", areaM2: 45, functionalRole: "Hospitalisation de jour", clinicalActivity: "Soins de jour", department: "Médecine", lots: ["LOT-GO", "LOT-CVC", "LOT-PLOMB"], needs: NEEDS.chambre, staffing: { nurses: 2, doctors: 1, aides: 2, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.hospitJour, status: "rough_in", checklistDone: 3, checklistTotal: 16, reservesOpen: 0 }),

  // ── R+1 — Maternité chambres 9-14 + biberonnerie ──
  ...Array.from({ length: 6 }, (_, i) => matRoom(i + 9)),
  room({ code: "BIB-01", name: "Biberonnerie & soin bébé", level: "R+1", planSheet: "A-02", zoneId: "zone-neo", zoneFunction: "neonatologie", areaM2: 38, functionalRole: "Biberonnerie", clinicalActivity: "Soins nouveau-nés", department: "Maternité", lots: ["LOT-GO", "LOT-CVC", "LOT-PLOMB"], needs: NEEDS.chambre, staffing: { nurses: 2, doctors: 0, aides: 2, admin: 0 }, prerequisites: ["Couveuses"], receptionStatus: "not_started", layout: LAYOUTS.biberonnerie, status: "rough_in", checklistDone: 3, checklistTotal: 18, reservesOpen: 0 }),

  // ── R+1 — Admin / bureaux ──
  room({ code: "ACC-R1", name: "Accueil R+1", level: "R+1", planSheet: "A-02", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 20, functionalRole: "Accueil étage", clinicalActivity: "Orientation R+1", department: "Administration", lots: ["LOT-GO", "LOT-CFA"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 1, admin: 2 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.accueil, status: "rough_in", checklistDone: 3, checklistTotal: 12, reservesOpen: 0 }),
  room({ code: "ATT-R1", name: "Salle d'attente R+1", level: "R+1", planSheet: "A-02", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 34, functionalRole: "Salle d'attente R+1", clinicalActivity: "Attente familles", department: "Communs", lots: ["LOT-GO"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.salleAttente, status: "rough_in", checklistDone: 2, checklistTotal: 10, reservesOpen: 0 }),
  room({ code: "ADM-R1", name: "Administration R+1", level: "R+1", planSheet: "A-02", zoneId: "zone-admin", zoneFunction: "accueil_admin", areaM2: 48, functionalRole: "Open space administratif", clinicalActivity: "Bureaux administratifs", department: "Administration", lots: ["LOT-GO", "LOT-CFA", "LOT-VDI"], needs: NEEDS.accueil, staffing: { nurses: 0, doctors: 0, aides: 0, admin: 6 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauAdminOpen, status: "shell", checklistDone: 1, checklistTotal: 14, reservesOpen: 0 }),
  room({ code: "INF-R1", name: "Infirmerie R+1", level: "R+1", planSheet: "A-02", zoneId: "zone-hosp", zoneFunction: "hospitalisation", areaM2: 22, functionalRole: "Infirmerie hospitalisation", clinicalActivity: "Poste infirmier R+1", department: "Médecine", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.chambre, staffing: { nurses: 2, doctors: 0, aides: 1, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.infirmerieMat, status: "rough_in", checklistDone: 3, checklistTotal: 14, reservesOpen: 0 }),
  ...[1, 2, 3, 4, 5].map((n) =>
    room({ code: `BUR-R1-${n}`, name: `Bureau R+1 — ${n}`, level: "R+1", planSheet: "A-02", zoneId: "zone-cons", zoneFunction: "consultations", areaM2: 14, functionalRole: "Bureau médical R+1", clinicalActivity: "Consultation / bureau", department: "Consultations", lots: ["LOT-GO", "LOT-CVC"], needs: NEEDS.consultation, staffing: { nurses: 0, doctors: 1, aides: 0, admin: 0 }, prerequisites: [], receptionStatus: "not_started", layout: LAYOUTS.bureauCS, status: "shell", checklistDone: 1, checklistTotal: 12, reservesOpen: 0 }),
  ),
];

export function buildNassibRoomsFromPlan(): NassibRoom[] {
  return PLAN_ROOM_CATALOG.map((def) => ({
    id: def.id,
    projectId: NASSIB_PROJECT_ID,
    zoneId: def.zoneId,
    code: def.code,
    name: def.name,
    level: def.level,
    zoneFunction: def.zoneFunction,
    areaM2: def.areaM2,
    status: def.status,
    progressPct: 0,
    lots: def.lots,
    checklistDone: 0,
    checklistTotal: def.checklistTotal,
    equipmentCount: def.layout.filter((l) => l.category === "biomedical").reduce((s, l) => s + l.qty, 0),
    reservesOpen: 0,
    validationStatus: "pending",
    needs: {
      cfo: def.needs.cfo,
      cfa: def.needs.cfa,
      cvc: def.needs.cvc,
      plumbing: def.needs.plumbing,
      medicalGas: def.needs.medicalGas,
      furniture: def.needs.medicalFurniture || def.needs.adminFurniture,
      ssi: def.needs.ssi,
    },
  }));
}

export function buildRoomProfilesFromPlan(): Record<string, RoomProfile> {
  const profiles: Record<string, RoomProfile> = {};
  for (const def of PLAN_ROOM_CATALOG) {
    profiles[def.id] = {
      functionalRole: def.functionalRole,
      department: def.department,
      departmentCode: def.zoneId.replace("zone-", "Z-").toUpperCase().slice(0, 6),
      clinicalActivity: def.clinicalActivity,
      dispatchRevision: 1,
      validatedAt: PLAN_METADATA.planDate,
      staffing: def.staffing,
      needs: def.needs,
      prerequisites: def.prerequisites,
      receptionStatus: def.receptionStatus,
      planReference: `NASSIB-${def.planSheet}-${def.code}`,
    };
  }
  return profiles;
}

export function buildRoomDispatchFromPlan(): RoomDispatch[] {
  return PLAN_ROOM_CATALOG.map((def) => ({
    roomCode: def.code,
    roomId: def.id,
    assignedRole: def.functionalRole,
    clinicalActivity: def.clinicalActivity,
    dispatchRevision: 1,
    validatedAt: PLAN_METADATA.planDate,
    staffing: def.staffing,
    needs: {
      cfo: def.needs.cfo,
      cfa: def.needs.cfa,
      cvc: def.needs.cvc,
      plumbing: def.needs.plumbing,
      medicalGas: def.needs.medicalGas,
      furniture: def.needs.medicalFurniture,
      ssi: def.needs.ssi,
      vdi: def.needs.vdi,
      biomedicalEquipment: def.needs.biomedicalEquipment,
    },
    gasOutlets: {
      o2: def.needs.o2Outlets,
      vacuum: def.needs.vacuumOutlets,
      medicalAir: def.needs.medicalAirOutlets,
    },
  }));
}

export { PLAN_METADATA };

/** Totaux prises fluides — somme des locaux (plan implantation K'BIO) */
export function getProjectMedicalGasTotals() {
  return PLAN_ROOM_CATALOG.reduce(
    (acc, def) => ({
      o2Outlets: acc.o2Outlets + def.needs.o2Outlets,
      vacuumOutlets: acc.vacuumOutlets + def.needs.vacuumOutlets,
      medicalAirOutlets: acc.medicalAirOutlets + def.needs.medicalAirOutlets,
    }),
    { o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0 },
  );
}
