import type { LayoutItem } from "@/data/nassib/plan-types";
import { computeHeadboardMepFromLayout, isMepFixtureName } from "./bed-headboard-mep";

export interface MedicalGasOutletCounts {
  o2Outlets: number;
  vacuumOutlets: number;
  medicalAirOutlets: number;
}

export interface GasOutletContext {
  /** Le local est prévu pour des fluides médicaux (template besoins) */
  medicalGasEnabled: boolean;
  zoneFunction?: string;
}

function matchName(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

/** Lits et couveuses — plan d'implantation */
const BED_KEYWORDS = ["lit hospitalier", "lit complet", "berceau"];
const STRETCHER_KEYWORDS = ["brancard"];
const DELIVERY_TABLE_KEYWORDS = ["table accouchement"];
const SURGERY_TABLE_KEYWORDS = ["table de chirurgie"];
const PENDANT_KEYWORDS = ["pendentif"];

function countLayoutQty(layout: LayoutItem[], keywords: string[]): number {
  return layout.reduce(
    (sum, item) =>
      sum + (matchName(item.name, keywords) ? item.qty : 0),
    0,
  );
}

function legacyGasFromLayout(
  layout: LayoutItem[],
  ctx: GasOutletContext,
): MedicalGasOutletCounts {
  const beds = countLayoutQty(layout, BED_KEYWORDS);
  const stretchers = countLayoutQty(layout, STRETCHER_KEYWORDS);
  const deliveryTables = countLayoutQty(layout, DELIVERY_TABLE_KEYWORDS);
  const surgeryTables = countLayoutQty(layout, SURGERY_TABLE_KEYWORDS);
  const pendants = countLayoutQty(layout, PENDANT_KEYWORDS);

  let o2 = beds + stretchers;
  let vacuum = beds + stretchers;
  let air = beds;

  if (deliveryTables > 0) {
    o2 += deliveryTables * 2;
    vacuum += deliveryTables * 2;
    air += deliveryTables * 2;
  }

  if (surgeryTables > 0 || pendants > 0) {
    o2 += 2;
    vacuum += 2;
    air += 2;
  }

  const isPreTravail =
    ctx.zoneFunction === "gyneco_obstetrique" &&
    beds === 0 &&
    deliveryTables === 0 &&
    surgeryTables === 0 &&
    layout.some((i) => matchName(i.name, ["tocographe", "échographe"]));

  if (isPreTravail) {
    o2 += 1;
    vacuum += 1;
  }

  return { o2Outlets: o2, vacuumOutlets: vacuum, medicalAirOutlets: air };
}

/**
 * Calcul des prises fluides médicaux à partir du plan d'implantation.
 * Priorité aux bandeaux / colonnes / bandeaux muraux définis explicitement.
 */
export function computeMedicalGasOutletsFromLayout(
  layout: LayoutItem[],
  ctx: GasOutletContext,
): MedicalGasOutletCounts {
  if (!ctx.medicalGasEnabled || layout.length === 0) {
    return { o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0 };
  }

  const hasMepFixtures = layout.some((i) => isMepFixtureName(i.name));
  if (hasMepFixtures) {
    const mep = computeHeadboardMepFromLayout(layout, ctx);
    return {
      o2Outlets: mep.o2Outlets,
      vacuumOutlets: mep.vacuumOutlets,
      medicalAirOutlets: mep.medicalAirOutlets,
    };
  }

  return legacyGasFromLayout(layout, ctx);
}

/** Somme des prises projet — réseaux centraux TEC-01 */
export function sumMedicalGasOutlets(
  rooms: MedicalGasOutletCounts[],
): MedicalGasOutletCounts {
  return rooms.reduce(
    (acc, r) => ({
      o2Outlets: acc.o2Outlets + r.o2Outlets,
      vacuumOutlets: acc.vacuumOutlets + r.vacuumOutlets,
      medicalAirOutlets: acc.medicalAirOutlets + r.medicalAirOutlets,
    }),
    { o2Outlets: 0, vacuumOutlets: 0, medicalAirOutlets: 0 },
  );
}
