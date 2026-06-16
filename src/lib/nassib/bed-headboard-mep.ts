import type { LayoutItem } from "@/data/nassib/plan-types";
import type { MedicalGasOutletCounts } from "./medical-gas-outlets";

function matchName(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function countLayoutQty(layout: LayoutItem[], keywords: string[]): number {
  return layout.reduce(
    (sum, item) => sum + (matchName(item.name, keywords) ? item.qty : 0),
    0,
  );
}

/** Bandeau de lit — hospitalisation / box urgences / chambre patient */
export const BANDEAU_LIT_KEYWORDS = ["bandeau de lit btdl"];
/** Bandeau SSPI — réveil post-césarienne */
export const BANDEAU_SSPI_KEYWORDS = ["bandeau de lit sspi"];
export const COLONNE_ANESTH_KEYWORDS = ["colonne suspendue anesthésie"];
export const COLONNE_CHIR_KEYWORDS = ["colonne suspendue chirurgie"];
export const BANDEAU_MURAL_KEYWORDS = ["bandeau mural tête patient"];

export const MEP_FIXTURE_KEYWORDS = [
  ...BANDEAU_LIT_KEYWORDS,
  ...BANDEAU_SSPI_KEYWORDS,
  ...COLONNE_ANESTH_KEYWORDS,
  ...COLONNE_CHIR_KEYWORDS,
  ...BANDEAU_MURAL_KEYWORDS,
];

export function isMepFixtureName(name: string): boolean {
  return matchName(name, MEP_FIXTURE_KEYWORDS);
}

/** Par bandeau de lit : 1 O₂, 1 aspiration, 4 secouru, 1 appel malade, 2 RJ45, 2 luminaires */
export const BANDEAU_LIT_SPEC = {
  o2: 1,
  vacuum: 1,
  air: 0,
  upsSecouru: 4,
  nurseCall: 1,
  rj45: 2,
  lightingAmbiance: 1,
  lightingTotale: 1,
} as const;

/** Par bandeau SSPI : 2 O₂, 2 air, 1 aspiration */
export const BANDEAU_SSPI_SPEC = {
  o2: 2,
  vacuum: 1,
  air: 2,
} as const;

/** Colonne anesthésie bloc césarienne */
export const COLONNE_ANESTH_SPEC = {
  o2: 2,
  vacuum: 2,
  air: 2,
  upsSecouru: 6,
  rj45: 4,
} as const;

/** Colonne chirurgien bloc césarienne */
export const COLONNE_CHIR_SPEC = {
  upsSecouru: 8,
  rj45: 4,
} as const;

/** Bandeau mural tête patient — circuit O₂ / air distinct de la colonne anesthésie */
export const BANDEAU_MURAL_SPEC = {
  o2: 2,
  air: 2,
  circuitNote: "Circuit O₂ / air médical indépendant (circuit B) — distinct colonne anesthésie",
} as const;

export interface HeadboardMepTotals extends MedicalGasOutletCounts {
  upsSecouru: number;
  rj45: number;
  nurseCall: number;
  lightingAmbiance: number;
  lightingTotale: number;
  bandeauLitCount: number;
  bandeauSspiCount: number;
  colonneAnesthCount: number;
  colonneChirCount: number;
  bandeauMuralCount: number;
  notes: string[];
}

export function computeHeadboardMepFromLayout(
  layout: LayoutItem[],
  ctx: { medicalGasEnabled: boolean; zoneFunction?: string },
): HeadboardMepTotals {
  const empty: HeadboardMepTotals = {
    o2Outlets: 0,
    vacuumOutlets: 0,
    medicalAirOutlets: 0,
    upsSecouru: 0,
    rj45: 0,
    nurseCall: 0,
    lightingAmbiance: 0,
    lightingTotale: 0,
    bandeauLitCount: 0,
    bandeauSspiCount: 0,
    colonneAnesthCount: 0,
    colonneChirCount: 0,
    bandeauMuralCount: 0,
    notes: [],
  };

  if (!ctx.medicalGasEnabled && layout.every((i) => !isMepFixtureName(i.name))) {
    return empty;
  }

  const bandeauLit = countLayoutQty(layout, BANDEAU_LIT_KEYWORDS);
  const bandeauSspi = countLayoutQty(layout, BANDEAU_SSPI_KEYWORDS);
  const colonneAnesth = countLayoutQty(layout, COLONNE_ANESTH_KEYWORDS);
  const colonneChir = countLayoutQty(layout, COLONNE_CHIR_KEYWORDS);
  const bandeauMural = countLayoutQty(layout, BANDEAU_MURAL_KEYWORDS);

  const hasFixtures =
    bandeauLit + bandeauSspi + colonneAnesth + colonneChir + bandeauMural > 0;

  if (!hasFixtures) {
    return empty;
  }

  let o2 = 0;
  let vacuum = 0;
  let air = 0;
  let upsSecouru = 0;
  let rj45 = 0;
  let nurseCall = 0;
  let lightingAmbiance = 0;
  let lightingTotale = 0;
  const notes: string[] = [];

  if (bandeauLit > 0) {
    o2 += bandeauLit * BANDEAU_LIT_SPEC.o2;
    vacuum += bandeauLit * BANDEAU_LIT_SPEC.vacuum;
    upsSecouru += bandeauLit * BANDEAU_LIT_SPEC.upsSecouru;
    nurseCall += bandeauLit * BANDEAU_LIT_SPEC.nurseCall;
    rj45 += bandeauLit * BANDEAU_LIT_SPEC.rj45;
    lightingAmbiance += bandeauLit * BANDEAU_LIT_SPEC.lightingAmbiance;
    lightingTotale += bandeauLit * BANDEAU_LIT_SPEC.lightingTotale;
    notes.push(
      `${bandeauLit} bandeau(x) de lit : 1 O₂ + 1 aspiration + 4 secouru + appel malade + 2 RJ45 + lumière ambiance/totale / lit`,
    );
  }

  if (bandeauSspi > 0) {
    o2 += bandeauSspi * BANDEAU_SSPI_SPEC.o2;
    vacuum += bandeauSspi * BANDEAU_SSPI_SPEC.vacuum;
    air += bandeauSspi * BANDEAU_SSPI_SPEC.air;
    notes.push(
      `${bandeauSspi} bandeau(x) SSPI : 2 O₂ + 2 air médical + 1 aspiration / bandeau`,
    );
  }

  if (colonneAnesth > 0) {
    o2 += colonneAnesth * COLONNE_ANESTH_SPEC.o2;
    vacuum += colonneAnesth * COLONNE_ANESTH_SPEC.vacuum;
    air += colonneAnesth * COLONNE_ANESTH_SPEC.air;
    upsSecouru += colonneAnesth * COLONNE_ANESTH_SPEC.upsSecouru;
    rj45 += colonneAnesth * COLONNE_ANESTH_SPEC.rj45;
    notes.push(
      `Colonne suspendue anesthésie : 2 O₂ + 2 vide + 2 air + 6 secouru + 4 RJ45`,
    );
  }

  if (colonneChir > 0) {
    upsSecouru += colonneChir * COLONNE_CHIR_SPEC.upsSecouru;
    rj45 += colonneChir * COLONNE_CHIR_SPEC.rj45;
    notes.push(`Colonne suspendue chirurgie : 8 secouru + 4 RJ45`);
  }

  if (bandeauMural > 0) {
    o2 += bandeauMural * BANDEAU_MURAL_SPEC.o2;
    air += bandeauMural * BANDEAU_MURAL_SPEC.air;
    notes.push(
      `Bandeau mural tête patient (secteur anesthésie) : 2 O₂ + 2 air — ${BANDEAU_MURAL_SPEC.circuitNote}`,
    );
  }

  return {
    o2Outlets: o2,
    vacuumOutlets: vacuum,
    medicalAirOutlets: air,
    upsSecouru,
    rj45,
    nurseCall,
    lightingAmbiance,
    lightingTotale,
    bandeauLitCount: bandeauLit,
    bandeauSspiCount: bandeauSspi,
    colonneAnesthCount: colonneAnesth,
    colonneChirCount: colonneChir,
    bandeauMuralCount: bandeauMural,
    notes,
  };
}

/** Total bandeaux BTDL (hospitalisation + SSPI) pour rapprochement BOQ FM-2.9.4 */
export function countBandeauxFromLayout(layout: LayoutItem[]): number {
  return (
    countLayoutQty(layout, BANDEAU_LIT_KEYWORDS) +
    countLayoutQty(layout, BANDEAU_SSPI_KEYWORDS)
  );
}
