import { POLYCLINIQUE_BOQ_DETAIL, BOQ_META } from "@/data/nassib/boq-polyclinique";
import { PLAN_ROOM_CATALOG, getProjectMedicalGasTotals } from "@/data/nassib/plan-catalog";
import { resolveSheetTemplate } from "@/lib/room-sheet/generator";
import { SHEET_TEMPLATES } from "@/lib/room-sheet/templates";
import type { BoqLine } from "@/types/nassib";
import { countBandeauxFromLayout } from "@/lib/nassib/bed-headboard-mep";
import { buildEquipmentFromPlan } from "./build-equipment-from-plan";

export type ReconciliationStatus = "ok" | "ecart";

export type ReconciliationSeverity = "ok" | "info" | "warning" | "critical";

export interface BoqPlanMetric {
  id: string;
  category: "fluides" | "plomberie" | "cfo" | "cfa";
  label: string;
  unit: string;
  boqQty: number;
  boqCode: string;
  boqDescription: string;
  planQty: number;
  planSource: string;
  delta: number;
  status: ReconciliationStatus;
  severity: ReconciliationSeverity;
  note?: string;
}

export interface RoomGasRow {
  roomCode: string;
  roomName: string;
  o2: number;
  vacuum: number;
  medicalAir: number;
}

export interface BoqPlanReconciliation {
  meta: {
    boqSource: string;
    boqDate: string;
    planSource: string;
    comparedAt: string;
  };
  metrics: BoqPlanMetric[];
  alignedCount: number;
  gapCount: number;
  roomGasRows: RoomGasRow[];
  equipmentElectrical: {
    outlets16A: number;
    outlets25A: number;
  };
}

function findBoqLine(match: (l: BoqLine) => boolean): BoqLine | undefined {
  return POLYCLINIQUE_BOQ_DETAIL.find(match);
}

function severityForDelta(delta: number, boqQty: number): ReconciliationSeverity {
  if (delta === 0) return "ok";
  const pct = boqQty > 0 ? Math.abs(delta) / boqQty : Math.abs(delta);
  if (pct <= 0.02 && Math.abs(delta) <= 2) return "info";
  if (pct >= 0.15 || Math.abs(delta) >= 10) return "critical";
  return "warning";
}

function metric(
  partial: Omit<BoqPlanMetric, "delta" | "status" | "severity">,
): BoqPlanMetric {
  const delta = partial.planQty - partial.boqQty;
  const status: ReconciliationStatus = delta === 0 ? "ok" : "ecart";
  return {
    ...partial,
    delta,
    status,
    severity: severityForDelta(delta, partial.boqQty),
  };
}

function sumRoomSheetTotals() {
  let s16 = 0;
  let s32 = 0;
  let rj45 = 0;
  let wc = 0;
  let lavabo = 0;
  let doucheCandidates = 0;

  for (const def of PLAN_ROOM_CATALOG) {
    const tpl = SHEET_TEMPLATES[resolveSheetTemplate(def)];
    s16 += tpl.cfo.s16;
    s32 += tpl.cfo.s32;
    rj45 += tpl.cfa.rj45;
    wc += tpl.plumbing.eu;
    lavabo += tpl.plumbing.ev;
    if (tpl.plumbing.eu > 0 && def.needs.plumbing) {
      doucheCandidates += tpl.plumbing.eu;
    }
  }

  return { s16, s32, rj45, wc, lavabo, doucheCandidates };
}

function countLayoutWc(): number {
  return PLAN_ROOM_CATALOG.reduce((sum, def) => {
    const n = def.layout
      .filter((l) => /w\.c|^wc$/i.test(l.name.trim()))
      .reduce((s, l) => s + l.qty, 0);
    return sum + n;
  }, 0);
}

function countEquipmentElectrical() {
  const equipment = buildEquipmentFromPlan();
  let outlets16A = 0;
  let outlets25A = 0;
  for (const eq of equipment) {
    if (eq.electricalNeed?.includes("16")) outlets16A += eq.qty;
    if (eq.electricalNeed?.includes("32")) outlets25A += eq.qty;
  }
  return { outlets16A, outlets25A };
}

function countProjectBandeaux(): number {
  return PLAN_ROOM_CATALOG.reduce(
    (sum, def) => sum + countBandeauxFromLayout(def.layout),
    0,
  );
}

export function computeBoqPlanReconciliation(): BoqPlanReconciliation {
  const gas = getProjectMedicalGasTotals();
  const sheets = sumRoomSheetTotals();
  const layoutWc = countLayoutWc();
  const bandeauPlanQty = countProjectBandeaux();
  const electrical = countEquipmentElectrical();

  const o2Boq = findBoqLine((l) => l.code === "FM-2.9.5");
  const vacBoq = findBoqLine((l) => l.code === "FM-2.9.6");
  const airBoq = findBoqLine((l) => l.code === "FM-2.9.7");
  const bandeauBoq = findBoqLine((l) => l.code === "FM-2.9.4");
  const wcBoq = findBoqLine((l) => l.code === "PL-2.2.2");
  const lavaboBoq = findBoqLine((l) => l.code === "PL-2.2.1");
  const doucheBoq = findBoqLine((l) => l.code === "PL-2.2.3");
  const prise16Boq = findBoqLine((l) => l.code === "4.2.1");
  const prise25Boq = findBoqLine((l) => l.code === "4.2.3");
  const priseEtancheBoq = findBoqLine((l) => l.code === "4.2.2");
  const rj45Boq = findBoqLine((l) => l.code === "7.2");

  const metrics: BoqPlanMetric[] = [
    metric({
      id: "gas-o2",
      category: "fluides",
      label: "Prises oxygène",
      unit: "u",
      boqQty: o2Boq?.qtyContract ?? 0,
      boqCode: o2Boq?.code ?? "FM-2.9.5",
      boqDescription: o2Boq?.description ?? "Prise Oxygène",
      planQty: gas.o2Outlets,
      planSource: "Plan implantation — lits, brancards, tables",
    }),
    metric({
      id: "gas-vacuum",
      category: "fluides",
      label: "Prises vide médical",
      unit: "u",
      boqQty: vacBoq?.qtyContract ?? 0,
      boqCode: vacBoq?.code ?? "FM-2.9.6",
      boqDescription: vacBoq?.description ?? "Prise Vide médical",
      planQty: gas.vacuumOutlets,
      planSource: "Plan implantation — lits, brancards, tables",
    }),
    metric({
      id: "gas-air",
      category: "fluides",
      label: "Prises air médical",
      unit: "u",
      boqQty: airBoq?.qtyContract ?? 0,
      boqCode: airBoq?.code ?? "FM-2.9.7",
      boqDescription: airBoq?.description ?? "Prise Air comprimé médical",
      planQty: gas.medicalAirOutlets,
      planSource: "Plan implantation — lits, accouchements, bloc",
    }),
    metric({
      id: "gas-bandeau",
      category: "fluides",
      label: "Bandeaux BTDL triple fluide",
      unit: "u",
      boqQty: bandeauBoq?.qtyContract ?? 0,
      boqCode: bandeauBoq?.code ?? "FM-2.9.4",
      boqDescription: bandeauBoq?.description ?? "Bandeau BTDL",
      planQty: bandeauPlanQty,
      planSource: "Bandeaux de lit BTDL (hospitalisation, box) + bandeaux SSPI",
      note: "Colonne suspendue et bandeau mural bloc comptés séparément (fluides unitaires).",
    }),
    metric({
      id: "plomb-wc",
      category: "plomberie",
      label: "WC à l'anglaise",
      unit: "ens",
      boqQty: wcBoq?.qtyContract ?? 0,
      boqCode: wcBoq?.code ?? "PL-2.2.2",
      boqDescription: wcBoq?.description ?? "WC à l'anglaise",
      planQty: sheets.wc,
      planSource: "Fiches techniques locaux (postes WC / EU)",
      note:
        layoutWc > 0
          ? `${layoutWc} WC listés en mobilier plan équipements — hors sanitaires communs.`
          : "Sanitaires communs : quantifier depuis plans A-01/A-02.",
    }),
    metric({
      id: "plomb-lavabo",
      category: "plomberie",
      label: "Lavabo double vasque",
      unit: "u",
      boqQty: lavaboBoq?.qtyContract ?? 0,
      boqCode: lavaboBoq?.code ?? "PL-2.2.1",
      boqDescription: lavaboBoq?.description ?? "Lavabo double vasque",
      planQty: sheets.lavabo,
      planSource: "Fiches techniques locaux (points lavabo / EV)",
    }),
    metric({
      id: "plomb-douche",
      category: "plomberie",
      label: "Douches",
      unit: "ens",
      boqQty: doucheBoq?.qtyContract ?? 0,
      boqCode: doucheBoq?.code ?? "PL-2.2.3",
      boqDescription: doucheBoq?.description ?? "Douche",
      planQty: sheets.doucheCandidates,
      planSource: "Estimation locaux avec poste sanitaire (templates)",
      note: "Douches vestiaires / personnel souvent hors plan équipements.",
    }),
    metric({
      id: "cfo-16",
      category: "cfo",
      label: "Prises 2P+T 16A encastrées",
      unit: "ens",
      boqQty: prise16Boq?.qtyContract ?? 0,
      boqCode: prise16Boq?.code ?? "4.2.1",
      boqDescription: prise16Boq?.description ?? "Prise 2P+T 16A encastrée",
      planQty: sheets.s16,
      planSource: "Fiches techniques locaux — total prises 16A",
      note: `Plan équipements : ${electrical.outlets16A} circuits 16A liés aux DM.`,
    }),
    metric({
      id: "cfo-25",
      category: "cfo",
      label: "Prises 2P+T 25A encastrées",
      unit: "ens",
      boqQty: prise25Boq?.qtyContract ?? 0,
      boqCode: prise25Boq?.code ?? "4.2.3",
      boqDescription: prise25Boq?.description ?? "Prise 2P+T 25A encastrée",
      planQty: sheets.s32,
      planSource: "Fiches techniques locaux — total prises 25A/32A",
      note: `Plan équipements : ${electrical.outlets25A} circuits 32A recensés.`,
    }),
    metric({
      id: "cfo-etanche",
      category: "cfo",
      label: "Prises étanches 16A",
      unit: "ens",
      boqQty: priseEtancheBoq?.qtyContract ?? 0,
      boqCode: priseEtancheBoq?.code ?? "4.2.2",
      boqDescription: priseEtancheBoq?.description ?? "Prise étanche 2P+T 16A",
      planQty:
        PLAN_ROOM_CATALOG.filter(
          (r) =>
            resolveSheetTemplate(r) === "locaux_techniques_vrd" ||
            r.zoneFunction === "sterilisation",
        ).length * 2,
      planSource: "Estimation locaux IP44 / techniques",
      note: "Valider sur plan CFO si écart.",
    }),
    metric({
      id: "cfa-rj45",
      category: "cfa",
      label: "Prises RJ45 Cat.6",
      unit: "ens",
      boqQty: rj45Boq?.qtyContract ?? 0,
      boqCode: rj45Boq?.code ?? "7.2",
      boqDescription: rj45Boq?.description ?? "Prise RJ45 Cat.6",
      planQty: sheets.rj45,
      planSource: "Fiches techniques locaux — total RJ45",
    }),
  ];

  const roomGasRows: RoomGasRow[] = PLAN_ROOM_CATALOG.filter(
    (r) => r.needs.o2Outlets + r.needs.vacuumOutlets + r.needs.medicalAirOutlets > 0,
  ).map((r) => ({
    roomCode: r.code,
    roomName: r.name,
    o2: r.needs.o2Outlets,
    vacuum: r.needs.vacuumOutlets,
    medicalAir: r.needs.medicalAirOutlets,
  }));

  const alignedCount = metrics.filter((m) => m.status === "ok").length;

  return {
    meta: {
      boqSource: BOQ_META.sourceFile,
      boqDate: BOQ_META.validatedAt,
      planSource: "Schémas implantation (180526) + fiches techniques locaux",
      comparedAt: new Date().toISOString().slice(0, 10),
    },
    metrics,
    alignedCount,
    gapCount: metrics.length - alignedCount,
    roomGasRows,
    equipmentElectrical: electrical,
  };
}
