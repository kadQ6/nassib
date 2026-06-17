import type { LayoutItem } from "@/data/nassib/plan-types";
import type { RoomProfile } from "@/types/room-hub";
import type { OpeningSpec, RoomTechnicalSheet } from "@/types/room-sheet";

export interface NassibFichePrintData {
  header: {
    intitule: string;
    code: string;
    groupe: string;
    planRef: string;
    level: string;
  };
  electricite: {
    pc16Normale: number;
    pc16Ondulee: number;
    pc20Normale: number;
    chargeSolDanM2: number;
    pack1: number;
    pack2: number;
    pack3: number;
    rj45: number;
    linéairePaillasse: string;
    nbBacsPaillasse: string;
  };
  plomberie: {
    lavabo: boolean;
    laveMains: boolean;
    vasque: boolean;
    evier: boolean;
    vidoir: boolean;
    bacLaver: boolean;
    douche: boolean;
    siegeDouche: boolean;
    wcSuspendu: boolean;
    siphonSol: number;
    baignoire: boolean;
    posteDesinfection: boolean;
    fontaineEau: boolean;
    robinetPuisage: boolean;
    augeChirurgicale: boolean;
    laveBassin: boolean;
    aLaCharge: string;
  };
  sols: {
    solSouple: boolean;
    antistatique: boolean;
    carrelage: boolean;
    antiderapant: boolean;
    peintureResine: boolean;
    lavageFrequent: boolean;
    autre: string;
    chargeRoulante: string;
    eclairageNaturel: "obligatoire" | "souhaite" | "proscrire" | "none";
  };
  murs: {
    peinture: boolean;
    faience: boolean;
    toileVerre: boolean;
    revetementPlastique: boolean;
    initiativeConcepteur: boolean;
    protection120: boolean;
    lisseBasse: boolean;
    lisseHaute: boolean;
    mainCourante: boolean;
    autre: string;
    upec: string;
    plinthesStandard: boolean;
    plintheReleve: boolean;
    plintheGorge: boolean;
    plintheAutre: string;
    protectionChocs: boolean;
    hauteurProtection: string;
  };
  menuiseries: {
    ouvrable: boolean;
    fixe: boolean;
    oscilloBattant: boolean;
    coulissant: boolean;
    limiteurOuverture: boolean;
    motorisation: boolean;
    antiIntrusion: boolean;
    noirComplet: boolean;
    solaireExterieur: boolean;
    solaireInterieur: boolean;
  };
  cfa: {
    appelInfirmiere: number;
    interphone: number;
    videosurveillance: number;
    monitoring: boolean;
    autresAlarmes: string;
    alimentationSpecifique: string;
  };
  fluides: {
    oxygene: { total: number; bras: number; mur: number; gtl: number };
    vide: { total: number; bras: number; mur: number; gtl: number };
    airMedical: { total: number; bras: number; mur: number; gtl: number };
    protoxyde: { total: number; bras: number; mur: number; gtl: number };
    attentes: string;
  };
  surfaces: {
    utileM2: number;
    hauteurLibreM: number;
    autres: string;
  };
  plafonds: {
    peinture: boolean;
    demontable: boolean;
    plaquePlatre: boolean;
    lessivable: boolean;
    acoustique: boolean;
    etancheAir: boolean;
    hauteurUtileMini: string;
  };
  meubles: string[];
  portes: Array<{
    vers: string;
    largMm: number;
    pleine: boolean;
    vitree: boolean;
    occulus: boolean;
    coulissante: boolean;
    auto: boolean;
    peinture: boolean;
    stratifiee: boolean;
    confidentialite: string;
    occulusDim: string;
    accesLibre: boolean;
    accesControle: boolean;
    accesType: string;
    serrure: string;
  }>;
  cvc: {
    normal: boolean;
    localRafraichi: boolean;
    localRefroidi: boolean;
    localChauffe: boolean;
    extractionRenforcee: boolean;
    rejetAirSpecifique: boolean;
    gestionPression: boolean;
    temperatureHiver: string;
    temperatureEte: string;
    specificites: string;
    autre: string;
  };
  eclairage: {
    niveau: string;
    sa: boolean;
    vv: boolean;
    detecteur: boolean;
    posteTravail: boolean;
    lectureSoins: boolean;
    plafonnier: boolean;
    applique: boolean;
    veilleuse: boolean;
    extractionRenforcee: boolean;
    allumageProlonge: boolean;
    onOffFrequents: boolean;
    localise: boolean;
    type: string;
    frequenceUtilisation: string;
  };
  observations: string;
  equipements: string;
  ouvertureSansContact: string;
  secondJourTolere: string;
}

function hasWindow(openings: OpeningSpec[]): boolean {
  return openings.some((o) => o.type === "window");
}

function floorFlags(material: string, reference: string) {
  const m = material.toLowerCase();
  const r = reference.toLowerCase();
  return {
    solSouple: m.includes("pvc") || m.includes("continu"),
    antistatique: r.includes("antistat") || r.includes("conducteur"),
    carrelage: m.includes("carrelage") || m.includes("grès"),
    antiderapant: r.includes("antidérap") || r.includes("r11") || r.includes("r10"),
    peintureResine: m.includes("résine") || m.includes("époxy"),
    lavageFrequent: m.includes("résine") || m.includes("époxy") || r.includes("lessiv"),
  };
}

function wallFlags(material: string) {
  const m = material.toLowerCase();
  return {
    peinture: m.includes("peinture"),
    faience: m.includes("faïence"),
    toileVerre: m.includes("toile"),
    revetementPlastique: m.includes("plastique") || m.includes("pvc"),
    initiativeConcepteur: false,
  };
}

function ceilingFlags(material: string, finishType: string) {
  const m = material.toLowerCase();
  const f = finishType.toLowerCase();
  return {
    peinture: m.includes("peinture"),
    demontable: m.includes("dalle") || f.includes("amovible"),
    plaquePlatre: m.includes("plâtre") || m.includes("plaque"),
    lessivable: true,
    acoustique: m.includes("minérale") || m.includes("rockfon"),
    etancheAir: f.includes("hermétique"),
  };
}

function countBandeaux(layout: LayoutItem[]): number {
  return layout
    .filter((i) => i.name.toLowerCase().includes("bandeau"))
    .reduce((s, i) => s + i.qty, 0);
}

function mapDoor(o: OpeningSpec, idx: number) {
  const isWindow = o.type === "window";
  return {
    vers: isWindow ? "Extérieur / couloir" : o.openingDirection ?? `Ouverture ${idx + 1}`,
    largMm: o.widthMm,
    pleine: !isWindow && !o.glassType,
    vitree: isWindow || Boolean(o.glassType),
    occulus: isWindow,
    coulissante: o.type === "sliding_door",
    auto: false,
    peinture: (o.leafColor ?? "").toLowerCase().includes("blanc"),
    stratifiee: (o.leafColor ?? "").toLowerCase().includes("strat"),
    confidentialite: isWindow ? "Vitrage" : "Standard",
    occulusDim: isWindow ? `${(o.widthMm / 1000).toFixed(2)} m` : "—",
    accesLibre: true,
    accesControle: false,
    accesType: "Libre",
    serrure: "Standard",
  };
}

export function buildNassibFichePrintData(
  sheet: RoomTechnicalSheet,
  profile: RoomProfile,
  roomName: string,
  roomCode: string,
  level: string,
  layout: LayoutItem[] = [],
): NassibFichePrintData {
  const floor = floorFlags(sheet.finishes.floor.material, sheet.finishes.floor.reference ?? "");
  const walls = wallFlags(sheet.finishes.walls.material);
  const ceiling = ceilingFlags(sheet.finishes.ceiling.material, sheet.finishes.ceiling.finishType ?? "");
  const bandeaux = countBandeaux(layout);
  const ups = sheet.cfo.socketsUpsSecouru?.value ?? 0;

  const observations = [
    sheet.customNotes,
    sheet.cfo.notes,
    sheet.medicalGas.notes,
    sheet.ventilation.calculationNotes,
  ]
    .filter(Boolean)
    .join("\n");

  const equipements = layout.length
    ? layout.map((i) => `${i.qty} × ${i.name}`).join(" · ")
    : "—";

  return {
    header: {
      intitule: `${roomName} — ${profile.functionalRole}`,
      code: roomCode,
      groupe: profile.department,
      planRef: profile.planReference,
      level,
    },
    electricite: {
      pc16Normale: sheet.cfo.sockets16A.value,
      pc16Ondulee: ups,
      pc20Normale: sheet.cfo.sockets32A.value,
      chargeSolDanM2: 250,
      pack1: bandeaux,
      pack2: 0,
      pack3: 0,
      rj45: sheet.cfa.rj45.value,
      linéairePaillasse: layout.some((i) => i.name.toLowerCase().includes("paillasse")) ? "Selon plan" : "—",
      nbBacsPaillasse: "—",
    },
    plomberie: {
      lavabo: sheet.plumbing.euPoints.value > 0,
      laveMains: sheet.plumbing.coldWater && sheet.plumbing.euPoints.value > 0,
      vasque: false,
      evier: sheet.plumbing.evPoints.value > 0,
      vidoir: false,
      bacLaver: sheet.plumbing.coldWater && sheet.plumbing.hotWater,
      douche: false,
      siegeDouche: false,
      wcSuspendu: layout.some((i) => i.name.toLowerCase().includes("w.c")),
      siphonSol: sheet.plumbing.floorDrains.value,
      baignoire: false,
      posteDesinfection: profile.department.toLowerCase().includes("stéril"),
      fontaineEau: false,
      robinetPuisage: sheet.plumbing.coldWater,
      augeChirurgicale: profile.functionalRole.toLowerCase().includes("bloc"),
      laveBassin: false,
      aLaCharge: sheet.plumbing.coldWater || sheet.plumbing.hotWater ? "Maître d'ouvrage / entreprise lots" : "—",
    },
    sols: {
      ...floor,
      autre: "",
      chargeRoulante: "Selon équipements implantés",
      eclairageNaturel: hasWindow(sheet.openings) ? "souhaite" : "none",
    },
    murs: {
      ...walls,
      protection120: false,
      lisseBasse: walls.faience,
      lisseHaute: walls.peinture,
      mainCourante: false,
      autre: sheet.finishes.walls.notes ?? "",
      upec: "U4P3E3C3",
      plinthesStandard: true,
      plintheReleve: false,
      plintheGorge: false,
      plintheAutre: sheet.finishes.skirting.reference ?? "",
      protectionChocs: profile.department.toLowerCase().includes("urgence"),
      hauteurProtection: profile.department.toLowerCase().includes("urgence") ? "1,20 m" : "—",
    },
    menuiseries: {
      ouvrable: hasWindow(sheet.openings),
      fixe: hasWindow(sheet.openings),
      oscilloBattant: hasWindow(sheet.openings),
      coulissant: sheet.openings.some((o) => o.type === "sliding_door"),
      limiteurOuverture: false,
      motorisation: false,
      antiIntrusion: false,
      noirComplet: false,
      solaireExterieur: false,
      solaireInterieur: false,
    },
    cfa: {
      appelInfirmiere: sheet.cfa.nurseCall.value,
      interphone: sheet.cfa.intercom.value,
      videosurveillance: sheet.cfa.cctv.value,
      monitoring: false,
      autresAlarmes: sheet.cfa.notes ?? "",
      alimentationSpecifique: "",
    },
    fluides: {
      oxygene: {
        total: sheet.medicalGas.o2Outlets.value,
        bras: sheet.medicalGas.o2Outlets.value,
        mur: 0,
        gtl: 0,
      },
      vide: {
        total: sheet.medicalGas.vacuumOutlets.value,
        bras: sheet.medicalGas.vacuumOutlets.value,
        mur: 0,
        gtl: 0,
      },
      airMedical: {
        total: sheet.medicalGas.medicalAirOutlets.value,
        bras: sheet.medicalGas.medicalAirOutlets.value,
        mur: 0,
        gtl: 0,
      },
      protoxyde: {
        total: sheet.medicalGas.agss?.value ?? 0,
        bras: 0,
        mur: 0,
        gtl: 0,
      },
      attentes: sheet.medicalGas.notes ?? "",
    },
    surfaces: {
      utileM2: sheet.surfaces.floorAreaM2.value,
      hauteurLibreM: sheet.surfaces.ceilingHeightM.value,
      autres: `Volume ${sheet.surfaces.volumeM3.value} m³`,
    },
    plafonds: {
      ...ceiling,
      hauteurUtileMini: `${sheet.surfaces.ceilingHeightM.value} m`,
    },
    meubles: layout.map((i) => `${i.qty} × ${i.name}`),
    portes: sheet.openings.map(mapDoor),
    cvc: {
      normal: !sheet.climate.coolingRequired,
      localRafraichi: sheet.climate.coolingRequired,
      localRefroidi: sheet.climate.coolingRequired && (sheet.climate.coolingKw?.value ?? 0) >= 5,
      localChauffe: false,
      extractionRenforcee: sheet.ventilation.airChangesPerHourRequired.value >= 8,
      rejetAirSpecifique: false,
      gestionPression: Boolean(sheet.ventilation.pressureDifferentialPa?.value),
      temperatureHiver: "22 °C",
      temperatureEte: `${sheet.ventilation.temperatureSetpointC.value} °C`,
      specificites: `${sheet.ventilation.normReference} — ${sheet.ventilation.flowM3hDesigned.value} m³/h — ${sheet.climate.ctaZone}`,
      autre: sheet.climate.notes ?? "",
    },
    eclairage: {
      niveau: "Normal",
      sa: true,
      vv: false,
      detecteur: true,
      posteTravail: sheet.cfa.rj45.value > 0,
      lectureSoins: profile.functionalRole.toLowerCase().includes("soin"),
      plafonnier: sheet.cfo.lightingPoints.value > 0,
      applique: false,
      veilleuse: false,
      extractionRenforcee: false,
      allumageProlonge: false,
      onOffFrequents: true,
      localise: Boolean(sheet.cfo.lightingAmbiance?.value),
      type: sheet.cfo.lightingAmbiance?.value
        ? "Plafonnier + bandeaux ambiance/soin"
        : "Plafonnier",
      frequenceUtilisation: "Forte (zone soins)",
    },
    observations,
    equipements,
    ouvertureSansContact: "À définir",
    secondJourTolere: "—",
  };
}
