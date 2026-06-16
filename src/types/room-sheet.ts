/** Champ modifiable — traçabilité source + notes chantier */
export interface EditableField<T> {
  value: T;
  unit?: string;
  source: "plan" | "calculated" | "manual" | "pending";
  notes?: string;
}

export interface RoomSurfacesSpec {
  floorAreaM2: EditableField<number>;
  ceilingHeightM: EditableField<number>;
  volumeM3: EditableField<number>;
  perimeterM?: EditableField<number>;
}

export interface FinishSpec {
  material: string;
  color: string;
  colorCode?: string;
  reference?: string;
  supplier?: string;
  finishType?: string;
  notes?: string;
}

export interface OpeningSpec {
  id: string;
  type: "door" | "window" | "sliding_door" | "passage";
  label: string;
  widthMm: number;
  heightMm: number;
  leafColor?: string;
  frameColor?: string;
  glassType?: string;
  fireRating?: string;
  openingDirection?: string;
  notes?: string;
}

export interface CfoSpec {
  sockets16A: EditableField<number>;
  sockets32A: EditableField<number>;
  socketsDedicated: EditableField<number>;
  /** Prises secourues (IT/UPS) — bandeaux, colonnes suspendues */
  socketsUpsSecouru?: EditableField<number>;
  lightingPoints: EditableField<number>;
  /** Luminaire ambiance (bandeau de lit) */
  lightingAmbiance?: EditableField<number>;
  /** Luminaire totale / soin (bandeau de lit) */
  lightingTotale?: EditableField<number>;
  emergencyLighting: EditableField<number>;
  ipRating: string;
  earthPoints: EditableField<number>;
  notes?: string;
}

export interface CfaSpec {
  rj45: EditableField<number>;
  wifiAccessPoints: EditableField<number>;
  intercom: EditableField<number>;
  nurseCall: EditableField<number>;
  cctv: EditableField<number>;
  accessControl: EditableField<number>;
  tvOutlet: EditableField<number>;
  notes?: string;
}

export interface PlumbingSpec {
  coldWater: boolean;
  hotWater: boolean;
  treatedWater: boolean;
  softWater: boolean;
  floorDrains: EditableField<number>;
  euPoints: EditableField<number>;
  evPoints: EditableField<number>;
  medicalWaste: boolean;
  notes?: string;
}

export interface VentilationSpec {
  occupancyMax: EditableField<number>;
  occupancyBasis: string;
  airChangesPerHourRequired: EditableField<number>;
  airChangesPerHourDesigned: EditableField<number>;
  flowM3hRequired: EditableField<number>;
  flowM3hDesigned: EditableField<number>;
  pressureDifferentialPa?: EditableField<number>;
  temperatureSetpointC: EditableField<number>;
  humidityPct?: EditableField<number>;
  filtration: string;
  normReference: string;
  calculationNotes: string;
}

export interface ClimateSpec {
  coolingRequired: boolean;
  coolingKw?: EditableField<number>;
  heatingKw?: EditableField<number>;
  splitUnits: EditableField<number>;
  ctaZone: string;
  refrigerant?: string;
  notes?: string;
}

export interface MedicalGasSheetSpec {
  o2Outlets: EditableField<number>;
  vacuumOutlets: EditableField<number>;
  medicalAirOutlets: EditableField<number>;
  agss?: EditableField<number>;
  notes?: string;
}

/** Fiche technique complète du local — modifiable */
export interface RoomTechnicalSheet {
  roomId: string;
  roomCode: string;
  version: number;
  updatedAt: string;
  updatedBy?: string;
  surfaces: RoomSurfacesSpec;
  finishes: {
    walls: FinishSpec;
    floor: FinishSpec;
    ceiling: FinishSpec;
    skirting: FinishSpec;
  };
  openings: OpeningSpec[];
  cfo: CfoSpec;
  cfa: CfaSpec;
  plumbing: PlumbingSpec;
  ventilation: VentilationSpec;
  climate: ClimateSpec;
  medicalGas: MedicalGasSheetSpec;
  /** Champs libres ajoutés sur site */
  customNotes?: string;
}

export type RoomSheetTemplateId =
  | "bloc_operatoire"
  | "bloc_cesarienne"
  | "sspi_reveil"
  | "urgences_box"
  | "urgences_dechocage"
  | "salle_travail"
  | "consultation"
  | "chambre_patient"
  | "hospit_jour"
  | "imagerie"
  | "laboratoire"
  | "sterilisation"
  | "accueil_admin"
  | "support"
  | "biberonnerie"
  | "locaux_techniques_vrd";

export type RoomSheetPatch = Partial<{
  surfaces: Partial<{
    floorAreaM2: EditableField<number> | number;
    ceilingHeightM: EditableField<number> | number;
    volumeM3: EditableField<number> | number;
    perimeterM: EditableField<number> | number;
  }>;
  finishes: Partial<RoomTechnicalSheet["finishes"]>;
  openings: OpeningSpec[];
  cfo: Partial<{
    sockets16A: EditableField<number> | number;
    sockets32A: EditableField<number> | number;
    socketsDedicated: EditableField<number> | number;
    lightingPoints: EditableField<number> | number;
    emergencyLighting: EditableField<number> | number;
    earthPoints: EditableField<number> | number;
    ipRating: string;
    notes: string;
  }>;
  cfa: Partial<{
    rj45: EditableField<number> | number;
    wifiAccessPoints: EditableField<number> | number;
    intercom: EditableField<number> | number;
    nurseCall: EditableField<number> | number;
    cctv: EditableField<number> | number;
    accessControl: EditableField<number> | number;
    tvOutlet: EditableField<number> | number;
    notes: string;
  }>;
  plumbing: Partial<{
    coldWater: boolean;
    hotWater: boolean;
    treatedWater: boolean;
    softWater: boolean;
    floorDrains: EditableField<number> | number;
    euPoints: EditableField<number> | number;
    evPoints: EditableField<number> | number;
    medicalWaste: boolean;
    notes: string;
  }>;
  ventilation: Partial<{
    occupancyMax: EditableField<number> | number;
    occupancyBasis: string;
    airChangesPerHourRequired: EditableField<number> | number;
    airChangesPerHourDesigned: EditableField<number> | number;
    flowM3hRequired: EditableField<number> | number;
    flowM3hDesigned: EditableField<number> | number;
    pressureDifferentialPa: EditableField<number> | number;
    temperatureSetpointC: EditableField<number> | number;
    humidityPct: EditableField<number> | number;
    filtration: string;
    normReference: string;
    calculationNotes: string;
  }>;
  climate: Partial<{
    coolingRequired: boolean;
    coolingKw: EditableField<number> | number;
    heatingKw: EditableField<number> | number;
    splitUnits: EditableField<number> | number;
    ctaZone: string;
    refrigerant: string;
    notes: string;
  }>;
  medicalGas: Partial<{
    o2Outlets: EditableField<number> | number;
    vacuumOutlets: EditableField<number> | number;
    medicalAirOutlets: EditableField<number> | number;
    agss: EditableField<number> | number;
    notes: string;
  }>;
  customNotes: string;
}>;
