import type { FinishSpec, OpeningSpec, RoomSheetPatch, RoomTechnicalSheet } from "@/types/room-sheet";

export interface SheetEditForm {
  floorAreaM2: number;
  ceilingHeightM: number;
  perimeterM: number;
  finishes: {
    walls: FinishSpec;
    floor: FinishSpec;
    ceiling: FinishSpec;
    skirting: FinishSpec;
  };
  openings: OpeningSpec[];
  cfo: {
    sockets16A: number;
    sockets32A: number;
    socketsDedicated: number;
    lightingPoints: number;
    emergencyLighting: number;
    earthPoints: number;
    ipRating: string;
    notes: string;
  };
  cfa: {
    rj45: number;
    wifiAccessPoints: number;
    intercom: number;
    nurseCall: number;
    cctv: number;
    accessControl: number;
    tvOutlet: number;
    notes: string;
  };
  plumbing: {
    coldWater: boolean;
    hotWater: boolean;
    treatedWater: boolean;
    softWater: boolean;
    floorDrains: number;
    euPoints: number;
    evPoints: number;
    medicalWaste: boolean;
    notes: string;
  };
  ventilation: {
    occupancyMax: number;
    occupancyBasis: string;
    airChangesPerHourRequired: number;
    airChangesPerHourDesigned: number;
    flowM3hRequired: number;
    flowM3hDesigned: number;
    pressureDifferentialPa: number;
    temperatureSetpointC: number;
    humidityPct: number;
    filtration: string;
    normReference: string;
    calculationNotes: string;
  };
  climate: {
    coolingRequired: boolean;
    coolingKw: number;
    heatingKw: number;
    splitUnits: number;
    ctaZone: string;
    refrigerant: string;
    notes: string;
  };
  medicalGas: {
    o2Outlets: number;
    vacuumOutlets: number;
    medicalAirOutlets: number;
    agss: number;
    notes: string;
  };
  customNotes: string;
}

export function sheetToEditForm(sheet: RoomTechnicalSheet): SheetEditForm {
  return {
    floorAreaM2: sheet.surfaces.floorAreaM2.value,
    ceilingHeightM: sheet.surfaces.ceilingHeightM.value,
    perimeterM: sheet.surfaces.perimeterM?.value ?? 0,
    finishes: {
      walls: { ...sheet.finishes.walls },
      floor: { ...sheet.finishes.floor },
      ceiling: { ...sheet.finishes.ceiling },
      skirting: { ...sheet.finishes.skirting },
    },
    openings: sheet.openings.map((o) => ({ ...o })),
    cfo: {
      sockets16A: sheet.cfo.sockets16A.value,
      sockets32A: sheet.cfo.sockets32A.value,
      socketsDedicated: sheet.cfo.socketsDedicated.value,
      lightingPoints: sheet.cfo.lightingPoints.value,
      emergencyLighting: sheet.cfo.emergencyLighting.value,
      earthPoints: sheet.cfo.earthPoints.value,
      ipRating: sheet.cfo.ipRating,
      notes: sheet.cfo.notes ?? "",
    },
    cfa: {
      rj45: sheet.cfa.rj45.value,
      wifiAccessPoints: sheet.cfa.wifiAccessPoints.value,
      intercom: sheet.cfa.intercom.value,
      nurseCall: sheet.cfa.nurseCall.value,
      cctv: sheet.cfa.cctv.value,
      accessControl: sheet.cfa.accessControl.value,
      tvOutlet: sheet.cfa.tvOutlet.value,
      notes: sheet.cfa.notes ?? "",
    },
    plumbing: {
      coldWater: sheet.plumbing.coldWater,
      hotWater: sheet.plumbing.hotWater,
      treatedWater: sheet.plumbing.treatedWater,
      softWater: sheet.plumbing.softWater,
      floorDrains: sheet.plumbing.floorDrains.value,
      euPoints: sheet.plumbing.euPoints.value,
      evPoints: sheet.plumbing.evPoints.value,
      medicalWaste: sheet.plumbing.medicalWaste,
      notes: sheet.plumbing.notes ?? "",
    },
    ventilation: {
      occupancyMax: sheet.ventilation.occupancyMax.value,
      occupancyBasis: sheet.ventilation.occupancyBasis,
      airChangesPerHourRequired: sheet.ventilation.airChangesPerHourRequired.value,
      airChangesPerHourDesigned: sheet.ventilation.airChangesPerHourDesigned.value,
      flowM3hRequired: sheet.ventilation.flowM3hRequired.value,
      flowM3hDesigned: sheet.ventilation.flowM3hDesigned.value,
      pressureDifferentialPa: sheet.ventilation.pressureDifferentialPa?.value ?? 0,
      temperatureSetpointC: sheet.ventilation.temperatureSetpointC.value,
      humidityPct: sheet.ventilation.humidityPct?.value ?? 0,
      filtration: sheet.ventilation.filtration,
      normReference: sheet.ventilation.normReference,
      calculationNotes: sheet.ventilation.calculationNotes,
    },
    climate: {
      coolingRequired: sheet.climate.coolingRequired,
      coolingKw: sheet.climate.coolingKw?.value ?? 0,
      heatingKw: sheet.climate.heatingKw?.value ?? 0,
      splitUnits: sheet.climate.splitUnits.value,
      ctaZone: sheet.climate.ctaZone,
      refrigerant: sheet.climate.refrigerant ?? "",
      notes: sheet.climate.notes ?? "",
    },
    medicalGas: {
      o2Outlets: sheet.medicalGas.o2Outlets.value,
      vacuumOutlets: sheet.medicalGas.vacuumOutlets.value,
      medicalAirOutlets: sheet.medicalGas.medicalAirOutlets.value,
      agss: sheet.medicalGas.agss?.value ?? 0,
      notes: sheet.medicalGas.notes ?? "",
    },
    customNotes: sheet.customNotes ?? "",
  };
}

/** Construit le patch complet depuis le formulaire (toutes valeurs → saisie manuelle) */
export function editFormToPatch(form: SheetEditForm): RoomSheetPatch {
  return {
    surfaces: {
      floorAreaM2: form.floorAreaM2,
      ceilingHeightM: form.ceilingHeightM,
      perimeterM: form.perimeterM || undefined,
    },
    finishes: form.finishes,
    openings: form.openings,
    cfo: {
      sockets16A: form.cfo.sockets16A,
      sockets32A: form.cfo.sockets32A,
      socketsDedicated: form.cfo.socketsDedicated,
      lightingPoints: form.cfo.lightingPoints,
      emergencyLighting: form.cfo.emergencyLighting,
      earthPoints: form.cfo.earthPoints,
      ipRating: form.cfo.ipRating,
      notes: form.cfo.notes || undefined,
    },
    cfa: {
      rj45: form.cfa.rj45,
      wifiAccessPoints: form.cfa.wifiAccessPoints,
      intercom: form.cfa.intercom,
      nurseCall: form.cfa.nurseCall,
      cctv: form.cfa.cctv,
      accessControl: form.cfa.accessControl,
      tvOutlet: form.cfa.tvOutlet,
      notes: form.cfa.notes || undefined,
    },
    plumbing: {
      coldWater: form.plumbing.coldWater,
      hotWater: form.plumbing.hotWater,
      treatedWater: form.plumbing.treatedWater,
      softWater: form.plumbing.softWater,
      floorDrains: form.plumbing.floorDrains,
      euPoints: form.plumbing.euPoints,
      evPoints: form.plumbing.evPoints,
      medicalWaste: form.plumbing.medicalWaste,
      notes: form.plumbing.notes || undefined,
    },
    ventilation: {
      occupancyMax: form.ventilation.occupancyMax,
      occupancyBasis: form.ventilation.occupancyBasis,
      airChangesPerHourRequired: form.ventilation.airChangesPerHourRequired,
      airChangesPerHourDesigned: form.ventilation.airChangesPerHourDesigned,
      flowM3hRequired: form.ventilation.flowM3hRequired,
      flowM3hDesigned: form.ventilation.flowM3hDesigned,
      pressureDifferentialPa: form.ventilation.pressureDifferentialPa || undefined,
      temperatureSetpointC: form.ventilation.temperatureSetpointC,
      humidityPct: form.ventilation.humidityPct || undefined,
      filtration: form.ventilation.filtration,
      normReference: form.ventilation.normReference,
      calculationNotes: form.ventilation.calculationNotes,
    },
    climate: {
      coolingRequired: form.climate.coolingRequired,
      coolingKw: form.climate.coolingKw || undefined,
      heatingKw: form.climate.heatingKw || undefined,
      splitUnits: form.climate.splitUnits,
      ctaZone: form.climate.ctaZone,
      refrigerant: form.climate.refrigerant || undefined,
      notes: form.climate.notes || undefined,
    },
    medicalGas: {
      o2Outlets: form.medicalGas.o2Outlets,
      vacuumOutlets: form.medicalGas.vacuumOutlets,
      medicalAirOutlets: form.medicalGas.medicalAirOutlets,
      agss: form.medicalGas.agss,
      notes: form.medicalGas.notes || undefined,
    },
    customNotes: form.customNotes,
  };
}
