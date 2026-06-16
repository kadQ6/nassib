import type { PlanningTask } from "@/types/nassib";

/** Infère le lot technique depuis l'intitulé WBS planning transmis */
export function inferPlanningLotCode(wbs: string, name: string): string | undefined {
  const n = name.toLowerCase();
  if (n.includes("fluide médical") || n.includes("gaz médical") || n.includes("oxygène")) {
    return "LOT-FLUIDES";
  }
  if (
    n.includes("climatisation") ||
    n.includes("ventilation") ||
    n.includes("renouvellement d'air")
  ) {
    return "LOT-CVC";
  }
  if (n.includes("incendie") || n.includes("ssi")) return "LOT-SSI";
  if (n.includes("cctv")) return "LOT-CCTV";
  if (n.includes("vdi") || n.includes("courant faible")) return "LOT-CFA";
  if (
    n.includes("luminaire") ||
    n.includes("interrupteur") ||
    n.includes("prise") ||
    n.includes("courant fort") ||
    n.includes("distribution")
  ) {
    return "LOT-CFO";
  }
  if (
    n.includes("sanitaire") ||
    n.includes("eau") ||
    n.includes("pluvial") ||
    n.includes("évacuation") ||
    n.includes("drainage")
  ) {
    return "LOT-PLOMB";
  }
  if (wbs.startsWith("1.6")) return "LOT-VRD";
  if (wbs.startsWith("1.7")) return "LOT-ESSAIS";
  if (wbs.startsWith("1.8")) return "LOT-GO";
  if (wbs.startsWith("1.5")) return "LOT-MEP";
  return undefined;
}

export function enrichPlanningTasks(tasks: PlanningTask[]): PlanningTask[] {
  return tasks.map((t) => {
    const wbsMatch = t.name.match(/^\[([^\]]+)\]/);
    const wbsCode = t.wbsCode ?? wbsMatch?.[1];
    const plainName = t.name.replace(/^\[[^\]]+\]\s*/, "");
    const lotCode =
      t.lotCode ?? (wbsCode ? inferPlanningLotCode(wbsCode, plainName) : undefined);
    return { ...t, wbsCode, lotCode };
  });
}
