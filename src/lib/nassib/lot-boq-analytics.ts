import type { BoqLine, MepLot, NassibRoom, PlanningTask, Zone } from "@/types/nassib";
import { BOQ_META, BOQ_RECAP } from "@/data/nassib/boq-polyclinique";

export type LotBoqSection = {
  key: string;
  label: string;
  lineCount: number;
  amountHt: number;
  pctOfLot: number;
};

export type LotDetailAnalytics = {
  lotCode: string;
  contractAmountHt: number;
  recapAmountHt: number | null;
  lineCount: number;
  sections: LotBoqSection[];
  topLines: Array<{
    code: string;
    description: string;
    unit: string;
    qty: number;
    unitPrice: number;
    amountHt: number;
  }>;
  planningTasks: PlanningTask[];
  planningAvgPct: number;
  roomCount: number;
  roomsByZone: Array<{ zoneCode: string; zoneName: string; count: number }>;
};

/** Préfixes WBS planning liés à chaque lot (Gantt contractuel). */
const PLANNING_WBS_BY_LOT: Record<string, string[]> = {
  "LOT-GO": ["1.1", "1.2", "1.3", "1.4"],
  "LOT-VRD": ["1.6"],
  "LOT-CVC": ["1.5.1", "1.5.2", "1.7.5"],
  "LOT-CFO": ["1.5.3", "1.5.4", "1.5.5", "1.7.2"],
  "LOT-PLOMB": ["1.5.6", "1.5.7", "1.7.1"],
  "LOT-SSI": ["1.5.8", "1.7.3"],
  "LOT-CCTV": ["1.5.9"],
  "LOT-CFA": ["1.5.10", "1.5.11", "1.7.4"],
  "LOT-FLUIDES": ["1.7.6"],
  "LOT-DIVERS": ["1.6"],
  "LOT-BIO": [],
};

const RECAP_BY_LOT: Partial<Record<string, number>> = {
  "LOT-GO": BOQ_RECAP.find((r) => r.n === 1)?.amount,
  "LOT-DIVERS": BOQ_RECAP.find((r) => r.n === 4)?.amount,
};

function lineAmount(line: BoqLine) {
  return line.qtyContract * line.unitPrice;
}

function sectionLabelForGo(code: string): string {
  if (code === "I") return "Installation chantier";
  const head = code.split(".")[0];
  const map: Record<string, string> = {
    "1": "Terrassement",
    "2": "Béton armé — fondations",
    "3": "Béton armé — élévation",
    "4": "Maçonnerie",
    "5": "Enduit",
    "6": "Revêtement",
    "7": "Étanchéité & terrasse",
    "8": "Menuiserie",
    "9": "Peinture",
    "11": "Ouvrages divers GO",
  };
  return map[head] ?? "Autre";
}

function sectionLabelForCode(lotCode: string, code: string): string {
  if (lotCode === "LOT-GO") return sectionLabelForGo(code);
  const head = code.split(".")[0];
  if (lotCode === "LOT-CFO") {
    const cfo: Record<string, string> = {
      "1": "Groupe électrogène",
      "2": "Armoires électriques",
      "3": "Réseaux CFO",
      "4": "Installations terminales",
      "5": "Lustrerie",
      "6": "Mise à la terre",
      "10": "Onduleur",
    };
    return cfo[head] ?? `Poste ${head}`;
  }
  if (lotCode === "LOT-CFA") {
    return head === "7" ? "VDI / informatique" : `CFA ${head}`;
  }
  if (lotCode === "LOT-CCTV") return "Vidéosurveillance";
  if (lotCode === "LOT-SSI") return "Détection incendie";
  if (lotCode === "LOT-CVC") return code.startsWith("CVC") ? "Climatisation" : "CVC";
  if (lotCode === "LOT-PLOMB") return code.startsWith("PL") ? "Plomberie sanitaire" : "Plomberie";
  if (lotCode === "LOT-FLUIDES") return code.startsWith("FM") ? "Fluides médicaux" : "Fluides";
  if (lotCode === "LOT-DIVERS") return "VRD & aménagements extérieurs";
  return head;
}

export function getLotBoqLines(boq: BoqLine[], lotCode: string): BoqLine[] {
  return boq.filter((l) => l.lotCode === lotCode && !l.code.startsWith("RECAP"));
}

function extractWbs(task: PlanningTask): string | null {
  const match = task.name.match(/^\[([\d.]+)\]/);
  return match?.[1] ?? null;
}

export function getLotPlanningTasks(tasks: PlanningTask[], lotCode: string): PlanningTask[] {
  const prefixes = PLANNING_WBS_BY_LOT[lotCode] ?? [];
  if (prefixes.length === 0) {
    return tasks.filter((t) => t.lotCode === lotCode);
  }
  return tasks.filter((t) => {
    if (t.lotCode === lotCode) return true;
    const wbs = extractWbs(t);
    if (!wbs) return false;
    return prefixes.some((p) => wbs === p || wbs.startsWith(`${p}.`));
  });
}

function buildSections(lotCode: string, lines: BoqLine[]): LotBoqSection[] {
  const total = lines.reduce((s, l) => s + lineAmount(l), 0);
  const buckets = new Map<string, { label: string; count: number; amount: number }>();

  for (const line of lines) {
    const label = sectionLabelForCode(lotCode, line.code);
    const key = label;
    const prev = buckets.get(key) ?? { label, count: 0, amount: 0 };
    prev.count += 1;
    prev.amount += lineAmount(line);
    buckets.set(key, prev);
  }

  return [...buckets.values()]
    .map((b) => ({
      key: b.label,
      label: b.label,
      lineCount: b.count,
      amountHt: b.amount,
      pctOfLot: total > 0 ? (b.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amountHt - a.amountHt);
}

export function buildLotDetailAnalytics(
  lot: MepLot,
  boq: BoqLine[],
  tasks: PlanningTask[],
  rooms: NassibRoom[],
  zones: Zone[],
): LotDetailAnalytics {
  const lines = getLotBoqLines(boq, lot.code);
  const contractAmountHt = lines.reduce((s, l) => s + lineAmount(l), 0);
  const planningTasks = getLotPlanningTasks(tasks, lot.code);
  const planningAvgPct =
    planningTasks.length > 0
      ? planningTasks.reduce((s, t) => s + t.progressPct, 0) / planningTasks.length
      : 0;

  const lotRooms = rooms.filter((r) => r.lots.includes(lot.code));
  const zoneMap = new Map(zones.map((z) => [z.id, z]));
  const byZone = new Map<string, { zoneCode: string; zoneName: string; count: number }>();

  for (const room of lotRooms) {
    const zone = zoneMap.get(room.zoneId);
    const key = room.zoneId;
    const prev = byZone.get(key) ?? {
      zoneCode: zone?.code ?? room.zoneId,
      zoneName: zone?.name ?? room.zoneId,
      count: 0,
    };
    prev.count += 1;
    byZone.set(key, prev);
  }

  const topLines = [...lines]
    .map((l) => ({
      code: l.code,
      description: l.description,
      unit: l.unit,
      qty: l.qtyContract,
      unitPrice: l.unitPrice,
      amountHt: lineAmount(l),
    }))
    .sort((a, b) => b.amountHt - a.amountHt)
    .slice(0, 12);

  return {
    lotCode: lot.code,
    contractAmountHt,
    recapAmountHt: RECAP_BY_LOT[lot.code] ?? null,
    lineCount: lines.length,
    sections: buildSections(lot.code, lines),
    topLines,
    planningTasks,
    planningAvgPct,
    roomCount: lotRooms.length,
    roomsByZone: [...byZone.values()].sort((a, b) => b.count - a.count),
  };
}

export function getLotBoqMeta() {
  return BOQ_META;
}
