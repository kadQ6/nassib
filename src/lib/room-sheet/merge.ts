import type {
  EditableField,
  RoomSheetPatch,
  RoomTechnicalSheet,
} from "@/types/room-sheet";

function mergeEditableField<T>(
  base: EditableField<T>,
  patch?: EditableField<T> | T,
): EditableField<T> {
  if (patch === undefined) return base;
  if (typeof patch === "object" && patch !== null && "value" in patch) {
    return {
      ...base,
      ...patch,
      source: patch.source ?? "manual",
    };
  }
  return { ...base, value: patch as T, source: "manual" };
}

function emptyField<T>(value: T): EditableField<T> {
  return { value, source: "pending" };
}

function mergeOptionalField<T>(
  base: EditableField<T> | undefined,
  patch: EditableField<T> | T | undefined,
): EditableField<T> | undefined {
  if (patch !== undefined) {
    return mergeEditableField(base ?? emptyField(typeof patch === "object" && patch !== null && "value" in patch ? patch.value : (patch as T)), patch);
  }
  return base;
}

/** Fusion patch utilisateur sur fiche existante */
export function mergeRoomSheet(
  base: RoomTechnicalSheet,
  patch: RoomSheetPatch,
): RoomTechnicalSheet {
  const next: RoomTechnicalSheet = {
    ...base,
    version: base.version + 1,
    updatedAt: new Date().toISOString(),
    surfaces: {
      floorAreaM2: mergeEditableField(base.surfaces.floorAreaM2, patch.surfaces?.floorAreaM2),
      ceilingHeightM: mergeEditableField(base.surfaces.ceilingHeightM, patch.surfaces?.ceilingHeightM),
      volumeM3: mergeEditableField(base.surfaces.volumeM3, patch.surfaces?.volumeM3),
      perimeterM: mergeOptionalField(base.surfaces.perimeterM, patch.surfaces?.perimeterM),
    },
    finishes: {
      walls: { ...base.finishes.walls, ...patch.finishes?.walls },
      floor: { ...base.finishes.floor, ...patch.finishes?.floor },
      ceiling: { ...base.finishes.ceiling, ...patch.finishes?.ceiling },
      skirting: { ...base.finishes.skirting, ...patch.finishes?.skirting },
    },
    openings: patch.openings ?? base.openings,
    cfo: {
      ...base.cfo,
      sockets16A: mergeEditableField(base.cfo.sockets16A, patch.cfo?.sockets16A),
      sockets32A: mergeEditableField(base.cfo.sockets32A, patch.cfo?.sockets32A),
      socketsDedicated: mergeEditableField(base.cfo.socketsDedicated, patch.cfo?.socketsDedicated),
      lightingPoints: mergeEditableField(base.cfo.lightingPoints, patch.cfo?.lightingPoints),
      emergencyLighting: mergeEditableField(base.cfo.emergencyLighting, patch.cfo?.emergencyLighting),
      earthPoints: mergeEditableField(base.cfo.earthPoints, patch.cfo?.earthPoints),
      ipRating: patch.cfo?.ipRating ?? base.cfo.ipRating,
      notes: patch.cfo?.notes ?? base.cfo.notes,
    },
    cfa: {
      ...base.cfa,
      rj45: mergeEditableField(base.cfa.rj45, patch.cfa?.rj45),
      wifiAccessPoints: mergeEditableField(base.cfa.wifiAccessPoints, patch.cfa?.wifiAccessPoints),
      intercom: mergeEditableField(base.cfa.intercom, patch.cfa?.intercom),
      nurseCall: mergeEditableField(base.cfa.nurseCall, patch.cfa?.nurseCall),
      cctv: mergeEditableField(base.cfa.cctv, patch.cfa?.cctv),
      accessControl: mergeEditableField(base.cfa.accessControl, patch.cfa?.accessControl),
      tvOutlet: mergeEditableField(base.cfa.tvOutlet, patch.cfa?.tvOutlet),
      notes: patch.cfa?.notes ?? base.cfa.notes,
    },
    plumbing: {
      ...base.plumbing,
      coldWater: patch.plumbing?.coldWater ?? base.plumbing.coldWater,
      hotWater: patch.plumbing?.hotWater ?? base.plumbing.hotWater,
      treatedWater: patch.plumbing?.treatedWater ?? base.plumbing.treatedWater,
      softWater: patch.plumbing?.softWater ?? base.plumbing.softWater,
      floorDrains: mergeEditableField(base.plumbing.floorDrains, patch.plumbing?.floorDrains),
      euPoints: mergeEditableField(base.plumbing.euPoints, patch.plumbing?.euPoints),
      evPoints: mergeEditableField(base.plumbing.evPoints, patch.plumbing?.evPoints),
      medicalWaste: patch.plumbing?.medicalWaste ?? base.plumbing.medicalWaste,
      notes: patch.plumbing?.notes ?? base.plumbing.notes,
    },
    ventilation: {
      ...base.ventilation,
      occupancyMax: mergeEditableField(base.ventilation.occupancyMax, patch.ventilation?.occupancyMax),
      occupancyBasis: patch.ventilation?.occupancyBasis ?? base.ventilation.occupancyBasis,
      airChangesPerHourRequired: mergeEditableField(
        base.ventilation.airChangesPerHourRequired,
        patch.ventilation?.airChangesPerHourRequired,
      ),
      airChangesPerHourDesigned: mergeEditableField(
        base.ventilation.airChangesPerHourDesigned,
        patch.ventilation?.airChangesPerHourDesigned,
      ),
      flowM3hRequired: mergeEditableField(base.ventilation.flowM3hRequired, patch.ventilation?.flowM3hRequired),
      flowM3hDesigned: mergeEditableField(base.ventilation.flowM3hDesigned, patch.ventilation?.flowM3hDesigned),
      pressureDifferentialPa: mergeOptionalField(
        base.ventilation.pressureDifferentialPa,
        patch.ventilation?.pressureDifferentialPa,
      ),
      temperatureSetpointC: mergeEditableField(
        base.ventilation.temperatureSetpointC,
        patch.ventilation?.temperatureSetpointC,
      ),
      humidityPct: mergeOptionalField(base.ventilation.humidityPct, patch.ventilation?.humidityPct),
      filtration: patch.ventilation?.filtration ?? base.ventilation.filtration,
      normReference: patch.ventilation?.normReference ?? base.ventilation.normReference,
      calculationNotes: patch.ventilation?.calculationNotes ?? base.ventilation.calculationNotes,
    },
    climate: {
      ...base.climate,
      coolingRequired: patch.climate?.coolingRequired ?? base.climate.coolingRequired,
      coolingKw: mergeOptionalField(base.climate.coolingKw, patch.climate?.coolingKw),
      heatingKw: mergeOptionalField(base.climate.heatingKw, patch.climate?.heatingKw),
      splitUnits: mergeEditableField(base.climate.splitUnits, patch.climate?.splitUnits),
      ctaZone: patch.climate?.ctaZone ?? base.climate.ctaZone,
      refrigerant: patch.climate?.refrigerant ?? base.climate.refrigerant,
      notes: patch.climate?.notes ?? base.climate.notes,
    },
    medicalGas: {
      o2Outlets: mergeEditableField(base.medicalGas.o2Outlets, patch.medicalGas?.o2Outlets),
      vacuumOutlets: mergeEditableField(base.medicalGas.vacuumOutlets, patch.medicalGas?.vacuumOutlets),
      medicalAirOutlets: mergeEditableField(base.medicalGas.medicalAirOutlets, patch.medicalGas?.medicalAirOutlets),
      agss: mergeOptionalField(base.medicalGas.agss, patch.medicalGas?.agss),
      notes: patch.medicalGas?.notes ?? base.medicalGas.notes,
    },
    customNotes: patch.customNotes ?? base.customNotes,
  };

  const area = next.surfaces.floorAreaM2.value;
  const height = next.surfaces.ceilingHeightM.value;
  next.surfaces.volumeM3 = {
    value: Math.round(area * height * 10) / 10,
    unit: "m³",
    source:
      next.surfaces.floorAreaM2.source === "manual" || next.surfaces.ceilingHeightM.source === "manual"
        ? "manual"
        : "calculated",
  };

  return next;
}
