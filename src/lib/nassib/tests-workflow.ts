import type { NassibTest } from "@/types/nassib";

export type TestGroupId = "system" | "local" | "opr";

export interface TestGroup {
  id: TestGroupId;
  label: string;
  tests: NassibTest[];
}

export interface TestKpis {
  total: number;
  planned: number;
  inProgress: number;
  conform: number;
  nonConform: number;
  validated: number;
  pending: number;
  withReserves: number;
  progressPct: number;
}

export const TEST_RESULT_LABELS: Record<NassibTest["result"], string> = {
  not_planned: "Non planifié",
  planned: "Planifié",
  in_progress: "En cours",
  conform: "Conforme",
  non_conform: "Non conforme",
  retry: "À reprendre",
  validated: "Validé (PV)",
};

export const TEST_RESULT_VARIANT: Record<
  NassibTest["result"],
  "default" | "info" | "warning" | "success" | "danger"
> = {
  not_planned: "default",
  planned: "default",
  in_progress: "info",
  conform: "success",
  non_conform: "danger",
  retry: "warning",
  validated: "success",
};

const DONE: NassibTest["result"][] = ["conform", "validated"];
const PENDING: NassibTest["result"][] = ["planned", "not_planned", "in_progress", "retry"];

export function isTestDone(result: NassibTest["result"]): boolean {
  return DONE.includes(result);
}

export function testKpis(tests: NassibTest[]): TestKpis {
  const done = tests.filter((t) => isTestDone(t.result)).length;

  return {
    total: tests.length,
    planned: tests.filter((t) => t.result === "planned" || t.result === "not_planned").length,
    inProgress: tests.filter((t) => t.result === "in_progress").length,
    conform: tests.filter((t) => t.result === "conform").length,
    nonConform: tests.filter((t) => t.result === "non_conform").length,
    validated: tests.filter((t) => t.result === "validated").length,
    pending: tests.filter((t) => PENDING.includes(t.result)).length,
    withReserves: tests.filter((t) => t.reservesLinked > 0).length,
    progressPct: tests.length > 0 ? Math.round((done / tests.length) * 100) : 0,
  };
}

export function buildTestGroups(tests: NassibTest[]): TestGroup[] {
  const system = tests.filter((t) => !t.roomCode && !t.system.toLowerCase().includes("opr"));
  const opr = tests.filter(
    (t) => t.roomCode && t.system.toLowerCase().includes("opr"),
  );
  const local = tests.filter(
    (t) => t.roomCode && !t.system.toLowerCase().includes("opr"),
  );

  return [
    { id: "system" as const, label: "Essais système (WBS 1.7)", tests: system },
    { id: "local" as const, label: "Essais locaux & biomédical", tests: local },
    { id: "opr" as const, label: "OPR & réception", tests: opr },
  ].filter((g) => g.tests.length > 0);
}

export function exportTestsCsv(tests: NassibTest[]): string {
  const header =
    "Système;Zone;Lot;Local;Norme;Prévu;Réalisé;Responsable;Résultat;Réserves";
  const rows = tests.map((t) =>
    [
      `"${t.system.replace(/"/g, '""')}"`,
      t.zone,
      t.lotCode,
      t.roomCode ?? "",
      `"${t.normReference.replace(/"/g, '""')}"`,
      t.plannedDate,
      t.actualDate ?? "",
      t.responsible,
      TEST_RESULT_LABELS[t.result],
      t.reservesLinked,
    ].join(";"),
  );
  return [header, ...rows].join("\n");
}

export const LOT_LABELS: Record<string, string> = {
  "LOT-GO": "Génie civil",
  "LOT-CFO": "CFO",
  "LOT-CFA": "CFA / VDI",
  "LOT-SSI": "SSI",
  "LOT-CVC": "CVC",
  "LOT-PLOMB": "Plomberie",
  "LOT-FLUIDES": "Fluides médicaux",
  "LOT-BIO": "Biomédical",
  "LOT-ESSAIS": "Essais",
};
