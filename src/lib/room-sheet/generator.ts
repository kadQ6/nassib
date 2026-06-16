import type { PlanRoomDef } from "@/data/nassib/plan-types";
import type { RoomStaffing } from "@/types/room-hub";
import type {
  EditableField,
  OpeningSpec,
  RoomSheetTemplateId,
  RoomTechnicalSheet,
} from "@/types/room-sheet";
import { computeHeadboardMepFromLayout } from "@/lib/nassib/bed-headboard-mep";
import { SHEET_TEMPLATES } from "./templates";

function ef<T>(value: T, source: EditableField<T>["source"] = "calculated", unit?: string, notes?: string): EditableField<T> {
  return { value, source, unit, notes };
}

function staffTotal(s: RoomStaffing): number {
  return s.nurses + s.doctors + s.aides + s.admin;
}

function patientCapacity(def: PlanRoomDef): number {
  if (def.code === "HOS-07") return 2;
  if (def.functionalRole.toLowerCase().includes("chambre")) return 1;
  if (def.code.startsWith("HDJ")) return 6;
  if (def.code.startsWith("REV")) return 4;
  if (def.code.startsWith("ATT")) return 8;
  return 0;
}

export function resolveSheetTemplate(def: PlanRoomDef): RoomSheetTemplateId {
  const { code, zoneFunction, functionalRole } = def;

  if (code === "BLC-01") return "bloc_cesarienne";
  if (code.startsWith("BLC") || code === "PCH-01" || code === "SAS-BLC") return "bloc_operatoire";
  if (code === "REV-01") return "sspi_reveil";
  if (code === "DECH-01") return "urgences_dechocage";
  if (code.startsWith("BOX") || code === "SAS-URG" || code === "INF-URG") return "urgences_box";
  if (code.startsWith("TRV") || code.startsWith("PRE")) return "salle_travail";
  if (code.startsWith("BCS") || code.startsWith("BGYN") || code.startsWith("DEN") || code.startsWith("BUR")) return "consultation";
  if (code.startsWith("HOS") || code.startsWith("MAT")) return "chambre_patient";
  if (code === "HDJ-01") return "hospit_jour";
  if (code.startsWith("IMG") || code === "SAS-IMG") return "imagerie";
  if (code.startsWith("LAB") || code === "MLAB-01") return "laboratoire";
  if (code.startsWith("STE")) return "sterilisation";
  if (code === "BIB-01") return "biberonnerie";
  if (zoneFunction === "accueil_admin" || code.startsWith("ADM") || code.startsWith("ACC") || code.startsWith("CAI") || code.startsWith("ATT") || code.startsWith("PHA")) {
    return "accueil_admin";
  }
  if (code.startsWith("TEC") || (def.level === "exterieur" && def.zoneFunction === "locaux_techniques")) return "locaux_techniques_vrd";
  if (code.startsWith("MAG") || code.startsWith("STK") || code.startsWith("VES")) return "support";
  if (functionalRole.toLowerCase().includes("infirmerie")) return "urgences_box";
  return "support";
}

function buildOpenings(def: PlanRoomDef, templateId: RoomSheetTemplateId): OpeningSpec[] {
  const t = SHEET_TEMPLATES[templateId];
  const openings: OpeningSpec[] = [
    {
      id: `${def.code}-P1`,
      type: templateId === "bloc_operatoire" || templateId === "bloc_cesarienne" ? "sliding_door" : "door",
      label: "Porte principale",
      widthMm: t.doorDefault.w,
      heightMm: t.doorDefault.h,
      leafColor: t.doorDefault.color,
      frameColor: t.doorDefault.frame,
      fireRating: t.doorDefault.fire,
      openingDirection: "Intérieur / couloir",
    },
  ];

  if ((templateId === "bloc_operatoire" || templateId === "bloc_cesarienne") && def.code.startsWith("BLC")) {
    openings.push({
      id: `${def.code}-P2`,
      type: "door",
      label: "Porte sas bloc",
      widthMm: 900,
      heightMm: 2100,
      leafColor: "Blanc RAL 9016",
      frameColor: "Inox",
      fireRating: "EI60",
      openingDirection: "Vers SAS",
    });
  }

  const withWindow =
    templateId === "chambre_patient" ||
    templateId === "consultation" ||
    templateId === "accueil_admin" ||
    def.areaM2 >= 14;

  if (withWindow && !def.code.startsWith("BLC") && !def.code.startsWith("IMG") && def.code !== "TEC-01") {
    openings.push({
      id: `${def.code}-F1`,
      type: "window",
      label: "Fenêtre / vitrage",
      widthMm: templateId === "chambre_patient" ? 1500 : 1200,
      heightMm: 1200,
      leafColor: "Clair",
      frameColor: "Alu blanc RAL 9016",
      glassType: def.zoneFunction === "bloc_cesarienne" ? "Renforcé" : "Double vitrage 4/16/4",
    });
  }

  if (def.code.startsWith("BOX")) {
    openings.push({
      id: `${def.code}-F1`,
      type: "window",
      label: "Vitrage observation couloir",
      widthMm: 800,
      heightMm: 600,
      leafColor: "Transparent",
      frameColor: "Alu",
      glassType: "Feuilleté sécurit",
    });
  }

  return openings;
}

function computeVentilation(
  def: PlanRoomDef,
  templateId: RoomSheetTemplateId,
  areaM2: number,
  ceilingM: number,
) {
  const tpl = SHEET_TEMPLATES[templateId].ventilation;
  const staff = staffTotal(def.staffing);
  const patients = patientCapacity(def);
  const occupancy = staff + patients;
  const volume = areaM2 * ceilingM;
  const ach = tpl.ach;
  const flowPerPerson = tpl.flowPerPersonM3h ?? 40;
  const flowByAch = Math.round(volume * ach);
  const flowByPerson = Math.round(occupancy * flowPerPerson);
  const flowRequired = Math.max(flowByAch, flowByPerson);
  const achDesigned = Math.round((flowRequired / volume) * 10) / 10;

  const basis = [
    staff > 0 ? `${staff} personnel` : null,
    patients > 0 ? `${patients} patient(s)` : null,
  ]
    .filter(Boolean)
    .join(" + ");

  const notes =
    `Volume ${volume.toFixed(1)} m³ · ` +
    `Renouvellement min ${ach} vol/h (${tpl.norm}) · ` +
    `Débit par ACH = ${flowByAch} m³/h · ` +
    `Débit par occupation (${occupancy} pers. × ${flowPerPerson} m³/h) = ${flowByPerson} m³/h · ` +
    `Retenu : max(${flowByAch}, ${flowByPerson}) = ${flowRequired} m³/h`;

  return {
    occupancyMax: ef(occupancy, "calculated", "pers.", basis || "Effectif planifié"),
    occupancyBasis: basis || "Locaux techniques — faible occupation",
    airChangesPerHourRequired: ef(ach, "calculated", "vol/h"),
    airChangesPerHourDesigned: ef(achDesigned, "calculated", "vol/h"),
    flowM3hRequired: ef(flowRequired, "calculated", "m³/h"),
    flowM3hDesigned: ef(flowRequired, "calculated", "m³/h"),
    pressureDifferentialPa: tpl.pressurePa ? ef(tpl.pressurePa, "calculated", "Pa") : undefined,
    temperatureSetpointC: ef(tpl.tempC, "calculated", "°C"),
    humidityPct: tpl.humidity ? ef(tpl.humidity, "calculated", "%") : undefined,
    filtration: "M5 + F7 (zones soignées) ou F9 si bloc",
    normReference: tpl.norm,
    calculationNotes: notes,
  };
}

/** Génère la fiche technique complète à partir du catalogue plan */
export function generateRoomSheet(def: PlanRoomDef): RoomTechnicalSheet {
  const templateId = resolveSheetTemplate(def);
  const tpl = SHEET_TEMPLATES[templateId];
  const areaM2 = def.areaM2;
  const ceilingM = tpl.ceilingHeightM;
  const volume = Math.round(areaM2 * ceilingM * 10) / 10;

  const mep = computeHeadboardMepFromLayout(def.layout, {
    medicalGasEnabled: def.needs.medicalGas,
    zoneFunction: def.zoneFunction,
  });
  const hasHeadboardMep = mep.bandeauLitCount + mep.bandeauSspiCount + mep.colonneAnesthCount > 0;

  const cfoS16 = hasHeadboardMep ? 2 : tpl.cfo.s16;
  const cfoUps = mep.upsSecouru || undefined;
  const cfoLight = hasHeadboardMep
    ? mep.lightingAmbiance + mep.lightingTotale + tpl.cfo.light
    : tpl.cfo.light;
  const cfaRj45 = hasHeadboardMep ? mep.rj45 + tpl.cfa.rj45 : tpl.cfa.rj45;
  const cfaNurse = hasHeadboardMep ? mep.nurseCall : tpl.cfa.nurse;

  const cfoNotes = [
    mep.notes.length > 0 ? mep.notes.join(" · ") : null,
    cfoUps ? `${cfoUps} prise(s) secourue(s) (IT/UPS) — bandeaux / colonnes` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const gasNotes = mep.notes.length > 0 ? mep.notes.join(" · ") : undefined;

  return {
    roomId: def.id,
    roomCode: def.code,
    version: 1,
    updatedAt: "2026-06-10T08:00:00.000Z",
    surfaces: {
      floorAreaM2: ef(areaM2, "plan", "m²", def.level === "exterieur"
        ? "Emprise VRD arrière bâtiment — modifiable sur plan VRD-01"
        : "Surface plan A-01/A-02 — modifiable sur relevé chantier"),
      ceilingHeightM: ef(ceilingM, "plan", "m"),
      volumeM3: ef(volume, "calculated", "m³"),
    },
    finishes: { ...tpl.finishes },
    openings: buildOpenings(def, templateId),
    cfo: {
      sockets16A: ef(cfoS16, hasHeadboardMep ? "plan" : "calculated", "u"),
      sockets32A: ef(tpl.cfo.s32, "calculated", "u"),
      socketsDedicated: ef(tpl.cfo.dedicated, "calculated", "u"),
      socketsUpsSecouru: cfoUps
        ? ef(cfoUps, "plan", "u", "Prises secourues bandeaux / colonnes suspendues")
        : undefined,
      lightingPoints: ef(cfoLight, hasHeadboardMep ? "plan" : "calculated", "u"),
      lightingAmbiance: mep.lightingAmbiance
        ? ef(mep.lightingAmbiance, "plan", "u", "Lumière ambiance — bandeau de lit")
        : undefined,
      lightingTotale: mep.lightingTotale
        ? ef(mep.lightingTotale, "plan", "u", "Lumière totale / soin — bandeau de lit")
        : undefined,
      emergencyLighting: ef(tpl.cfo.emergency, "calculated", "u"),
      ipRating: tpl.cfo.ip,
      earthPoints: ef(tpl.cfo.earth, "calculated", "u"),
      notes: cfoNotes || undefined,
    },
    cfa: {
      rj45: ef(cfaRj45, hasHeadboardMep ? "plan" : "calculated", "u"),
      wifiAccessPoints: ef(tpl.cfa.wifi, "calculated", "u"),
      intercom: ef(tpl.cfa.intercom, "calculated", "u"),
      nurseCall: ef(cfaNurse, hasHeadboardMep ? "plan" : "calculated", "u"),
      cctv: ef(tpl.cfa.cctv, "calculated", "u"),
      accessControl: ef(tpl.cfa.access, "calculated", "u"),
      tvOutlet: ef(tpl.cfa.tv, "calculated", "u"),
      notes: hasHeadboardMep ? "RJ45 et appel malade intégrés aux bandeaux de lit" : undefined,
    },
    plumbing: {
      coldWater: tpl.plumbing.ef,
      hotWater: tpl.plumbing.ec,
      treatedWater: tpl.plumbing.treated,
      softWater: tpl.plumbing.soft,
      floorDrains: ef(tpl.plumbing.floorDrain, "calculated", "u"),
      euPoints: ef(tpl.plumbing.eu, "calculated", "u"),
      evPoints: ef(tpl.plumbing.ev, "calculated", "u"),
      medicalWaste: def.zoneFunction === "urgences" || def.zoneFunction === "bloc_cesarienne",
    },
    ventilation: computeVentilation(def, templateId, areaM2, ceilingM),
    climate: {
      coolingRequired: tpl.climate.cooling,
      coolingKw: tpl.climate.coolingKw ? ef(tpl.climate.coolingKw, "calculated", "kW") : undefined,
      splitUnits: ef(tpl.climate.splits, "calculated", "u"),
      ctaZone: tpl.climate.ctaZone,
      refrigerant: tpl.climate.cooling ? "R32" : undefined,
    },
    medicalGas: {
      o2Outlets: ef(def.needs.o2Outlets, "plan", "u"),
      vacuumOutlets: ef(def.needs.vacuumOutlets, "plan", "u"),
      medicalAirOutlets: ef(def.needs.medicalAirOutlets, "plan", "u"),
      agss: ef(0, "pending", "u"),
      notes: gasNotes,
    },
    customNotes: "",
  };
}

export function buildAllRoomSheets(catalog: PlanRoomDef[]): Record<string, RoomTechnicalSheet> {
  const sheets: Record<string, RoomTechnicalSheet> = {};
  for (const def of catalog) {
    sheets[def.id] = generateRoomSheet(def);
  }
  return sheets;
}
