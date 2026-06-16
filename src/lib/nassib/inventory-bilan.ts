import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import type { PlanRoomDef } from "@/data/nassib/plan-types";
import type { NassibEquipment } from "@/types/nassib";
import { countByDisplayGroup } from "./inventory-display";

export type BilanGapSeverity = "critical" | "warning" | "info";

export interface BilanGap {
  roomCode: string;
  roomName: string;
  group: "clinical_medical" | "office";
  label: string;
  severity: BilanGapSeverity;
}

export interface OfficeTypeCount {
  type: string;
  qty: number;
}

export interface InventoryBilan {
  totals: ReturnType<typeof countByDisplayGroup>;
  officeBreakdown: OfficeTypeCount[];
  clinicalBreakdown: { label: string; qty: number }[];
  gaps: BilanGap[];
  roomsFullyPlanned: number;
  roomsWithGaps: number;
  toDefineCount: number;
  pricedCount: number;
}

function roomEquipment(
  equipment: NassibEquipment[],
  roomCode: string,
): NassibEquipment[] {
  return equipment.filter((e) => e.roomCode === roomCode);
}

function hasNameMatch(items: NassibEquipment[], pattern: RegExp): boolean {
  return items.some((e) => pattern.test(e.name.toLowerCase()));
}

function layoutQty(def: PlanRoomDef, pattern: RegExp): number {
  return def.layout
    .filter((l) => l.category !== "technical" && pattern.test(l.name.toLowerCase()))
    .reduce((s, l) => s + l.qty, 0);
}

function isBureauRoom(def: PlanRoomDef): boolean {
  return layoutQty(def, /bureau|guichet|comptoir|banque accueil/) > 0;
}

function officeTypeLabel(name: string): string {
  const lower = name.toLowerCase();
  if (/imprimante/.test(lower)) return "Imprimantes";
  if (/poste|pc|lis/.test(lower)) return "Postes informatiques";
  if (/écran|ecran/.test(lower)) return "Écrans / affichage";
  if (/bureau|guichet|comptoir|banque/.test(lower)) return "Bureaux & comptoirs";
  if (/chaise|fauteuil direction/.test(lower)) return "Sièges & fauteuils";
  if (/table réunion/.test(lower)) return "Tables réunion";
  if (/rangement|rayonnage|vestiaire|armoire/.test(lower)) return "Rangements";
  if (/banquette|banc/.test(lower)) return "Banquettes & bancs";
  return "Autre mobilier bureau";
}

function clinicalTypeLabel(eq: NassibEquipment): string {
  if (eq.inventoryKind === "medical_furniture") {
    if (/lit|brancard|berceau/.test(eq.name.toLowerCase())) return "Lits & brancards";
    if (/table à manger|chevet|fauteuil repos/.test(eq.name.toLowerCase())) {
      return "Mobilier chambre patient";
    }
    if (/chariot|paravent|guéridon/.test(eq.name.toLowerCase())) return "Chariots & paravents";
    return "Autre mobilier médical";
  }
  return "Équipements biomédicaux";
}

/** Bilan prévu / manquant — plan implantation vs besoins locaux */
export function computeInventoryBilan(equipment: NassibEquipment[]): InventoryBilan {
  const totals = countByDisplayGroup(equipment);
  const gaps: BilanGap[] = [];

  const officeItems = equipment.filter((e) => e.inventoryKind === "office_furniture");
  const officeMap = new Map<string, number>();
  for (const eq of officeItems) {
    const t = officeTypeLabel(eq.name);
    officeMap.set(t, (officeMap.get(t) ?? 0) + eq.qty);
  }

  const clinicalItems = equipment.filter(
    (e) => e.inventoryKind === "biomedical" || e.inventoryKind === "medical_furniture",
  );
  const clinicalMap = new Map<string, number>();
  for (const eq of clinicalItems) {
    const t = clinicalTypeLabel(eq);
    clinicalMap.set(t, (clinicalMap.get(t) ?? 0) + eq.qty);
  }

  for (const def of PLAN_ROOM_CATALOG) {
    const inv = roomEquipment(equipment, def.code);
    const clinical = inv.filter((e) => e.inventoryKind !== "office_furniture");
    const office = inv.filter((e) => e.inventoryKind === "office_furniture");
    const layoutClinical = def.layout.filter((l) => l.category !== "technical");

    if (
      layoutClinical.length === 0 &&
      (def.needs.biomedicalEquipment || def.needs.medicalFurniture)
    ) {
      gaps.push({
        roomCode: def.code,
        roomName: def.name,
        group: "clinical_medical",
        label: "Implantation médicale non définie (plan vide)",
        severity: "critical",
      });
    }

    if (
      def.needs.biomedicalEquipment &&
      !clinical.some((e) => e.inventoryKind === "biomedical")
    ) {
      const hasBioInLayout = def.layout.some((l) => l.category === "biomedical");
      if (hasBioInLayout || layoutClinical.length === 0) {
        gaps.push({
          roomCode: def.code,
          roomName: def.name,
          group: "clinical_medical",
          label: "Besoin équipement biomédical — aucune ligne DM",
          severity: "warning",
        });
      }
    }

    if (
      def.needs.medicalFurniture &&
      !clinical.some((e) => e.inventoryKind === "medical_furniture")
    ) {
      if (layoutClinical.length > 0) {
        gaps.push({
          roomCode: def.code,
          roomName: def.name,
          group: "clinical_medical",
          label: "Besoin mobilier médical — non couvert dans l'inventaire",
          severity: "warning",
        });
      }
    }

    if (def.needs.adminFurniture && isBureauRoom(def) && !hasNameMatch(office, /bureau|chaise|guichet|comptoir|banque|rangement|table réunion/)) {
      gaps.push({
        roomCode: def.code,
        roomName: def.name,
        group: "office",
        label: "Besoin mobilier bureau — bureaux / sièges non inventoriés",
        severity: "warning",
      });
    }

    if (def.needs.itEquipment && !hasNameMatch(office, /poste|pc|lis|écran|ecran|imprimante/)) {
      const skipItGap =
        def.zoneFunction === "hospitalisation" ||
        def.zoneFunction === "neonatologie" ||
        /^CH-|^MAT-|^HOS-/.test(def.code);
      if (!skipItGap) {
        gaps.push({
          roomCode: def.code,
          roomName: def.name,
          group: "office",
          label: "Besoin IT / bureautique — poste PC ou imprimante absent du plan",
          severity: "info",
        });
      }
    }

    if (def.needs.adminFurniture && isBureauRoom(def) && !hasNameMatch(office, /imprimante/)) {
      gaps.push({
        roomCode: def.code,
        roomName: def.name,
        group: "office",
        label: "Imprimante non prévue (standard bureau administratif / médical)",
        severity: "info",
      });
    }
  }

  const roomsWithGaps = new Set(gaps.map((g) => g.roomCode)).size;
  const toDefineCount = equipment.filter((e) => e.status === "to_define").length;
  const pricedCount = equipment.filter((e) => e.unitPrice != null && e.unitPrice > 0).length;

  return {
    totals,
    officeBreakdown: [...officeMap.entries()]
      .map(([type, qty]) => ({ type, qty }))
      .sort((a, b) => b.qty - a.qty),
    clinicalBreakdown: [...clinicalMap.entries()]
      .map(([label, qty]) => ({ label, qty }))
      .sort((a, b) => b.qty - a.qty),
    gaps: gaps.sort((a, b) => {
      const sev = { critical: 0, warning: 1, info: 2 };
      return sev[a.severity] - sev[b.severity] || a.roomCode.localeCompare(b.roomCode);
    }),
    roomsFullyPlanned: PLAN_ROOM_CATALOG.length - roomsWithGaps,
    roomsWithGaps,
    toDefineCount,
    pricedCount,
  };
}
