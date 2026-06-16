import type { FinishSpec, RoomSheetTemplateId } from "@/types/room-sheet";

/** Charte finitions K'BIO / FIOG — modifiable par local */
export const FINISH_PALETTE = {
  wallClinicalWhite: {
    material: "Peinture lessivable vinyle",
    color: "Blanc clinique",
    colorCode: "RAL 9016",
    reference: "DULUX Pro Hygiene",
    finishType: "Mat satiné",
  } satisfies FinishSpec,
  wallBlocGreen: {
    material: "Peinture antibactérienne",
    color: "Vert bloc",
    colorCode: "RAL 6029",
    reference: "Sikkens Pro Acryl",
    finishType: "Mat",
  } satisfies FinishSpec,
  wallAccentBlue: {
    material: "Peinture lessivable",
    color: "Bleu K'BIO",
    colorCode: "#003F72",
    reference: "DULUX Pro",
    finishType: "Satin",
  } satisfies FinishSpec,
  floorTileGrey: {
    material: "Carrelage grès cérame",
    color: "Gris clair",
    colorCode: "GC-6040",
    reference: "Porcelanosa 60×60 antidérapant R11",
    finishType: "Rectifié",
  } satisfies FinishSpec,
  floorVinylBloc: {
    material: "Sol continu PVC",
    color: "Gris bleuté",
    colorCode: "Tarkett IQ Granit",
    reference: "Conducteur antistatique",
    finishType: "Welded seams",
  } satisfies FinishSpec,
  floorEpoxyLab: {
    material: "Résine époxy",
    color: "Gris RAL 7035",
    colorCode: "RAL 7035",
    reference: "Sika Sikafloor",
    finishType: "Lisse lessivable",
  } satisfies FinishSpec,
  ceilingGrid: {
    material: "Faux plafond dalle minérale",
    color: "Blanc",
    colorCode: "RAL 9003",
    reference: "Rockfon Hygienic 600×600",
    finishType: "Dalle amovible",
  } satisfies FinishSpec,
  ceilingBloc: {
    material: "Plafond technique bloc",
    color: "Blanc",
    colorCode: "RAL 9003",
    reference: "Plafond laminaire / UTA intégrée",
    finishType: "Hermétique",
  } satisfies FinishSpec,
  skirtingWhite: {
    material: "Plinthe PVC ou carrelage",
    color: "Blanc",
    colorCode: "RAL 9016",
    reference: "Hauteur 10 cm",
  } satisfies FinishSpec,
};

export interface SheetTemplateDefaults {
  id: RoomSheetTemplateId;
  ceilingHeightM: number;
  finishes: {
    walls: FinishSpec;
    floor: FinishSpec;
    ceiling: FinishSpec;
    skirting: FinishSpec;
  };
  cfo: { s16: number; s32: number; dedicated: number; light: number; emergency: number; earth: number; ip: string };
  cfa: { rj45: number; wifi: number; intercom: number; nurse: number; cctv: number; access: number; tv: number };
  plumbing: { ef: boolean; ec: boolean; treated: boolean; soft: boolean; floorDrain: number; eu: number; ev: number };
  ventilation: {
    ach: number;
    tempC: number;
    humidity?: number;
    pressurePa?: number;
    norm: string;
    flowPerPersonM3h?: number;
  };
  climate: { cooling: boolean; coolingKw?: number; splits: number; ctaZone: string };
  doorDefault: { w: number; h: number; color: string; frame: string; fire?: string };
}

export const SHEET_TEMPLATES: Record<RoomSheetTemplateId, SheetTemplateDefaults> = {
  bloc_cesarienne: {
    id: "bloc_cesarienne",
    ceilingHeightM: 3.2,
    finishes: {
      walls: FINISH_PALETTE.wallBlocGreen,
      floor: FINISH_PALETTE.floorVinylBloc,
      ceiling: FINISH_PALETTE.ceilingBloc,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 4, s32: 2, dedicated: 0, light: 12, emergency: 2, earth: 6, ip: "IP44" },
    cfa: { rj45: 0, wifi: 1, intercom: 1, nurse: 0, cctv: 2, access: 1, tv: 0 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 2, eu: 2, ev: 1 },
    ventilation: { ach: 12, tempC: 21, humidity: 50, pressurePa: 15, norm: "NF S90-351", flowPerPersonM3h: 80 },
    climate: { cooling: true, coolingKw: 8, splits: 0, ctaZone: "UTA-Bloc" },
    doorDefault: { w: 1200, h: 2100, color: "Blanc RAL 9016", frame: "Inox", fire: "EI60" },
  },
  sspi_reveil: {
    id: "sspi_reveil",
    ceilingHeightM: 2.9,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorVinylBloc,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 4, s32: 0, dedicated: 0, light: 4, emergency: 2, earth: 3, ip: "IP44" },
    cfa: { rj45: 2, wifi: 1, intercom: 1, nurse: 0, cctv: 1, access: 0, tv: 0 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 1, eu: 1, ev: 1 },
    ventilation: { ach: 8, tempC: 22, humidity: 50, norm: "SSPI / surveillance post-op", flowPerPersonM3h: 70 },
    climate: { cooling: true, coolingKw: 5, splits: 0, ctaZone: "UTA-Bloc" },
    doorDefault: { w: 900, h: 2100, color: "Blanc RAL 9016", frame: "Inox", fire: "EI30" },
  },
  bloc_operatoire: {
    id: "bloc_operatoire",
    ceilingHeightM: 3.2,
    finishes: {
      walls: FINISH_PALETTE.wallBlocGreen,
      floor: FINISH_PALETTE.floorVinylBloc,
      ceiling: FINISH_PALETTE.ceilingBloc,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 8, s32: 2, dedicated: 4, light: 12, emergency: 2, earth: 6, ip: "IP44" },
    cfa: { rj45: 4, wifi: 1, intercom: 1, nurse: 0, cctv: 2, access: 1, tv: 0 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 2, eu: 2, ev: 1 },
    ventilation: { ach: 12, tempC: 21, humidity: 50, pressurePa: 15, norm: "NF S90-351", flowPerPersonM3h: 80 },
    climate: { cooling: true, coolingKw: 8, splits: 0, ctaZone: "UTA-Bloc" },
    doorDefault: { w: 1200, h: 2100, color: "Blanc RAL 9016", frame: "Inox", fire: "EI60" },
  },
  urgences_box: {
    id: "urgences_box",
    ceilingHeightM: 2.8,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 6, s32: 0, dedicated: 2, light: 4, emergency: 1, earth: 2, ip: "IP44" },
    cfa: { rj45: 2, wifi: 1, intercom: 0, nurse: 1, cctv: 1, access: 0, tv: 0 },
    plumbing: { ef: false, ec: false, treated: false, soft: false, floorDrain: 0, eu: 0, ev: 0 },
    ventilation: { ach: 6, tempC: 24, norm: "DTU 68.3", flowPerPersonM3h: 60 },
    climate: { cooling: true, coolingKw: 3.5, splits: 1, ctaZone: "CTA-Urgences" },
    doorDefault: { w: 900, h: 2100, color: "Blanc", frame: "Alu blanc" },
  },
  urgences_dechocage: {
    id: "urgences_dechocage",
    ceilingHeightM: 2.8,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 10, s32: 1, dedicated: 4, light: 6, emergency: 2, earth: 4, ip: "IP44" },
    cfa: { rj45: 3, wifi: 1, intercom: 1, nurse: 2, cctv: 2, access: 0, tv: 0 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 1, eu: 1, ev: 1 },
    ventilation: { ach: 8, tempC: 22, norm: "DTU 68.3 / OMS", flowPerPersonM3h: 80 },
    climate: { cooling: true, coolingKw: 5, splits: 0, ctaZone: "CTA-Urgences" },
    doorDefault: { w: 1200, h: 2100, color: "Blanc", frame: "Alu", fire: "EI30" },
  },
  salle_travail: {
    id: "salle_travail",
    ceilingHeightM: 2.9,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 8, s32: 0, dedicated: 2, light: 6, emergency: 1, earth: 3, ip: "IP44" },
    cfa: { rj45: 1, wifi: 1, intercom: 1, nurse: 2, cctv: 1, access: 0, tv: 0 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 1, eu: 2, ev: 1 },
    ventilation: { ach: 6, tempC: 22, humidity: 55, norm: "Salle accouchement", flowPerPersonM3h: 70 },
    climate: { cooling: true, coolingKw: 4, splits: 1, ctaZone: "CTA-Maternité" },
    doorDefault: { w: 900, h: 2100, color: "Blanc RAL 9016", frame: "Bois stratifié" },
  },
  consultation: {
    id: "consultation",
    ceilingHeightM: 2.7,
    finishes: {
      walls: { ...FINISH_PALETTE.wallClinicalWhite, notes: "Bandeau accent #0891B2 possible" },
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 4, s32: 0, dedicated: 1, light: 3, emergency: 1, earth: 1, ip: "IP20" },
    cfa: { rj45: 2, wifi: 1, intercom: 0, nurse: 0, cctv: 0, access: 0, tv: 0 },
    plumbing: { ef: false, ec: false, treated: false, soft: false, floorDrain: 0, eu: 0, ev: 0 },
    ventilation: { ach: 4, tempC: 24, norm: "DTU 68.3", flowPerPersonM3h: 40 },
    climate: { cooling: true, coolingKw: 2.5, splits: 1, ctaZone: "CTA-Consultations" },
    doorDefault: { w: 830, h: 2100, color: "Chêne clair", frame: "MDF stratifié" },
  },
  chambre_patient: {
    id: "chambre_patient",
    ceilingHeightM: 2.7,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 4, s32: 0, dedicated: 1, light: 3, emergency: 1, earth: 2, ip: "IP20" },
    cfa: { rj45: 1, wifi: 1, intercom: 0, nurse: 1, cctv: 0, access: 0, tv: 1 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 0, eu: 1, ev: 1 },
    ventilation: { ach: 4, tempC: 24, norm: "Chambre hospitalière", flowPerPersonM3h: 40 },
    climate: { cooling: true, coolingKw: 2.2, splits: 1, ctaZone: "CTA-Hospitalisation" },
    doorDefault: { w: 900, h: 2100, color: "Blanc HPL", frame: "Alu" },
  },
  hospit_jour: {
    id: "hospit_jour",
    ceilingHeightM: 2.8,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 8, s32: 0, dedicated: 2, light: 6, emergency: 2, earth: 3, ip: "IP44" },
    cfa: { rj45: 2, wifi: 1, intercom: 0, nurse: 2, cctv: 1, access: 0, tv: 0 },
    plumbing: { ef: true, ec: true, treated: false, soft: false, floorDrain: 1, eu: 2, ev: 2 },
    ventilation: { ach: 6, tempC: 24, norm: "HDJ", flowPerPersonM3h: 50 },
    climate: { cooling: true, coolingKw: 6, splits: 0, ctaZone: "CTA-Hospitalisation" },
    doorDefault: { w: 900, h: 2100, color: "Blanc", frame: "Alu" },
  },
  imagerie: {
    id: "imagerie",
    ceilingHeightM: 3.0,
    finishes: {
      walls: { ...FINISH_PALETTE.wallClinicalWhite, notes: "Peinture plombée zone RX si applicable" },
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 4, s32: 0, dedicated: 2, light: 4, emergency: 1, earth: 4, ip: "IP20" },
    cfa: { rj45: 4, wifi: 1, intercom: 0, nurse: 0, cctv: 1, access: 1, tv: 0 },
    plumbing: { ef: false, ec: false, treated: false, soft: false, floorDrain: 0, eu: 0, ev: 0 },
    ventilation: { ach: 4, tempC: 22, norm: "Salle RX — confort", flowPerPersonM3h: 40 },
    climate: { cooling: true, coolingKw: 5, splits: 0, ctaZone: "CTA-Imagerie" },
    doorDefault: { w: 900, h: 2100, color: "Plombée / blindée", frame: "Acier" },
  },
  laboratoire: {
    id: "laboratoire",
    ceilingHeightM: 2.8,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorEpoxyLab,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 10, s32: 0, dedicated: 3, light: 8, emergency: 2, earth: 4, ip: "IP44" },
    cfa: { rj45: 6, wifi: 1, intercom: 0, nurse: 0, cctv: 1, access: 1, tv: 0 },
    plumbing: { ef: true, ec: true, treated: true, soft: true, floorDrain: 2, eu: 3, ev: 2 },
    ventilation: { ach: 8, tempC: 22, pressurePa: 10, norm: "Laboratoire +10 Pa", flowPerPersonM3h: 60 },
    climate: { cooling: true, coolingKw: 8, splits: 0, ctaZone: "CTA-Laboratoire" },
    doorDefault: { w: 900, h: 2100, color: "Blanc", frame: "Alu" },
  },
  sterilisation: {
    id: "sterilisation",
    ceilingHeightM: 3.0,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorEpoxyLab,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 8, s32: 1, dedicated: 2, light: 6, emergency: 1, earth: 3, ip: "IP44" },
    cfa: { rj45: 2, wifi: 1, intercom: 0, nurse: 0, cctv: 1, access: 1, tv: 0 },
    plumbing: { ef: true, ec: true, treated: true, soft: true, floorDrain: 2, eu: 4, ev: 3 },
    ventilation: { ach: 10, tempC: 22, humidity: 45, norm: "CSSD EN ISO 13485", flowPerPersonM3h: 70 },
    climate: { cooling: true, coolingKw: 6, splits: 0, ctaZone: "CTA-Stérilisation" },
    doorDefault: { w: 900, h: 2100, color: "Blanc", frame: "Inox", fire: "EI30" },
  },
  accueil_admin: {
    id: "accueil_admin",
    ceilingHeightM: 2.7,
    finishes: {
      walls: FINISH_PALETTE.wallAccentBlue,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 6, s32: 0, dedicated: 0, light: 4, emergency: 1, earth: 1, ip: "IP20" },
    cfa: { rj45: 4, wifi: 1, intercom: 1, nurse: 0, cctv: 1, access: 1, tv: 1 },
    plumbing: { ef: false, ec: false, treated: false, soft: false, floorDrain: 0, eu: 0, ev: 0 },
    ventilation: { ach: 4, tempC: 24, norm: "Bureaux / accueil", flowPerPersonM3h: 36 },
    climate: { cooling: true, coolingKw: 3, splits: 1, ctaZone: "CTA-Admin" },
    doorDefault: { w: 900, h: 2100, color: "Verre / alu", frame: "Alu anodisé" },
  },
  support: {
    id: "support",
    ceilingHeightM: 2.6,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 2, s32: 0, dedicated: 0, light: 2, emergency: 1, earth: 1, ip: "IP20" },
    cfa: { rj45: 0, wifi: 0, intercom: 0, nurse: 0, cctv: 0, access: 0, tv: 0 },
    plumbing: { ef: false, ec: false, treated: false, soft: false, floorDrain: 0, eu: 0, ev: 0 },
    ventilation: { ach: 3, tempC: 26, norm: "Locaux techniques / stock", flowPerPersonM3h: 30 },
    climate: { cooling: false, splits: 0, ctaZone: "—" },
    doorDefault: { w: 900, h: 2100, color: "Gris", frame: "Acier" },
  },
  biberonnerie: {
    id: "biberonnerie",
    ceilingHeightM: 2.8,
    finishes: {
      walls: FINISH_PALETTE.wallClinicalWhite,
      floor: FINISH_PALETTE.floorTileGrey,
      ceiling: FINISH_PALETTE.ceilingGrid,
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 6, s32: 0, dedicated: 2, light: 4, emergency: 1, earth: 2, ip: "IP44" },
    cfa: { rj45: 2, wifi: 1, intercom: 1, nurse: 2, cctv: 1, access: 0, tv: 0 },
    plumbing: { ef: true, ec: true, treated: true, soft: false, floorDrain: 1, eu: 2, ev: 2 },
    ventilation: { ach: 6, tempC: 24, norm: "Néonatologie", flowPerPersonM3h: 60 },
    climate: { cooling: true, coolingKw: 4, splits: 1, ctaZone: "CTA-Maternité" },
    doorDefault: { w: 900, h: 2100, color: "Blanc", frame: "Alu" },
  },
  locaux_techniques_vrd: {
    id: "locaux_techniques_vrd",
    ceilingHeightM: 4.0,
    finishes: {
      walls: {
        material: "Peinture époxy / bardage métal",
        color: "Gris industriel",
        colorCode: "RAL 7035",
        reference: "Finition VRD — local technique extérieur",
        finishType: "Lessivable, résistante UV",
        notes: "Arrière bâtiment — hors enveloppe RDC/R+1",
      },
      floor: {
        material: "Dalle béton + résine",
        color: "Gris",
        colorCode: "RAL 7040",
        reference: "Sika Sikafloor — pente évacuation",
        finishType: "Antidérapant industriel",
      },
      ceiling: {
        material: "Structure métallique / bac acier",
        color: "Gris",
        colorCode: "RAL 9006",
        reference: "Couverture locale technique VRD",
        finishType: "Ventilation naturelle + extraction forcée",
      },
      skirting: FINISH_PALETTE.skirtingWhite,
    },
    cfo: { s16: 4, s32: 2, dedicated: 6, light: 8, emergency: 2, earth: 8, ip: "IP54" },
    cfa: { rj45: 2, wifi: 0, intercom: 0, nurse: 0, cctv: 2, access: 1, tv: 0 },
    plumbing: { ef: true, ec: false, treated: false, soft: false, floorDrain: 3, eu: 2, ev: 1 },
    ventilation: { ach: 8, tempC: 28, norm: "Local technique VRD / équipements", flowPerPersonM3h: 30 },
    climate: { cooling: false, coolingKw: 0, splits: 0, ctaZone: "Production centrale — VRD" },
    doorDefault: { w: 1200, h: 2200, color: "Gris RAL 7035", frame: "Acier galvanisé", fire: "EI60" },
  },
};
