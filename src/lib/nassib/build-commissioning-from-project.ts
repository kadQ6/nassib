import { ROLE_BIOMEDICAL } from "@/lib/constants/project-roles";
import type {
  CommissioningOverallStatus,
  CommissioningPhase,
  CommissioningPhaseId,
  CommissioningPhaseStatus,
  InventoryKind,
  NassibCommissioningLine,
  NassibEquipment,
  NassibLogisticsLine,
  NassibReserve,
  NassibTest,
} from "@/types/nassib";

const CLINICAL_KINDS: InventoryKind[] = ["biomedical", "medical_furniture"];

const PHASE_ORDER: CommissioningPhaseId[] = [
  "installation",
  "commissioning",
  "training",
];

function isLogisticsReady(
  eq: NassibEquipment,
  logistics: NassibLogisticsLine[],
): { ready: boolean; logisticsId?: string } {
  const log = logistics.find(
    (l) =>
      l.sourceType === "equipment" &&
      l.sourceId === eq.id &&
      l.flowStep >= 8,
  );
  if (log) return { ready: true, logisticsId: log.id };

  const advancedStatuses = [
    "delivered",
    "installed",
    "tested",
    "commissioned",
    "accepted",
    "validated",
  ];
  if (advancedStatuses.includes(eq.status)) {
    const anyLog = logistics.find(
      (l) => l.sourceType === "equipment" && l.sourceId === eq.id,
    );
    return { ready: true, logisticsId: anyLog?.id };
  }
  return { ready: false };
}

function phaseFromEquipmentStatus(
  eq: NassibEquipment,
  phaseId: CommissioningPhaseId,
  logisticsReady: boolean,
): CommissioningPhase {
  const base: CommissioningPhase = {
    status: logisticsReady ? "pending" : "locked",
    responsible: ROLE_BIOMEDICAL,
  };

  if (!logisticsReady) return base;

  const rank: Record<string, number> = {
    to_define: 0,
    spec_pending: 0,
    ordered: 0,
    manufacturing: 0,
    in_transit: 0,
    customs: 0,
    delivered: 1,
    installed: 2,
    tested: 3,
    commissioned: 4,
    accepted: 5,
    validated: 6,
    blocked: -1,
  };
  const r = rank[eq.status] ?? 0;

  if (eq.status === "blocked") {
    return { ...base, status: "blocked" };
  }

  if (phaseId === "installation") {
    if (r >= 2) return { ...base, status: "done" };
    if (r >= 1) return { ...base, status: "in_progress" };
    return base;
  }
  if (phaseId === "commissioning") {
    if (r < 2) return { ...base, status: "locked" };
    if (r >= 4) return { ...base, status: "done" };
    if (r >= 3) return { ...base, status: "in_progress" };
    return { ...base, status: "pending" };
  }
  if (phaseId === "training") {
    if (r < 4) return { ...base, status: "locked" };
    if (r >= 6) return { ...base, status: "done" };
    if (r >= 5) return { ...base, status: "in_progress" };
    return { ...base, status: "pending" };
  }
  return base;
}

export function computeCommissioningProgress(
  phases: Record<CommissioningPhaseId, CommissioningPhase>,
): number {
  const done = PHASE_ORDER.filter((p) => phases[p].status === "done").length;
  return Math.round((done / PHASE_ORDER.length) * 100);
}

export function computeOverallStatus(
  line: Pick<
    NassibCommissioningLine,
    "logisticsReady" | "phases" | "openReserves"
  >,
): CommissioningOverallStatus {
  if (line.openReserves > 0 && line.phases.commissioning.status === "blocked") {
    return "blocked";
  }
  if (!line.logisticsReady) return "waiting_logistics";
  if (line.phases.training.status === "done") return "ready_for_exploitation";
  return "in_progress";
}

function lotCodeForEquipment(eq: NassibEquipment): string {
  if (eq.mepDependencies.includes("FLUIDES")) return "LOT-FLUIDES";
  if (eq.mepDependencies.includes("CVC")) return "LOT-CVC";
  if (eq.mepDependencies.includes("SSI")) return "LOT-SSI";
  return "LOT-BIO";
}

function findLinkedTest(
  eq: NassibEquipment,
  tests: NassibTest[],
): string | undefined {
  if (!eq.roomCode) return undefined;
  return tests.find(
    (t) =>
      t.roomCode === eq.roomCode &&
      (t.lotCode === "LOT-BIO" || t.system.toLowerCase().includes("équip")),
  )?.id;
}

function countOpenReserves(roomCode: string, reserves: NassibReserve[]): number {
  return reserves.filter(
    (r) =>
      r.roomCode === roomCode &&
      !["closed", "lifted", "resolved"].includes(r.status),
  ).length;
}

function buildLine(
  eq: NassibEquipment,
  logistics: NassibLogisticsLine[],
  tests: NassibTest[],
  reserves: NassibReserve[],
): NassibCommissioningLine {
  const { ready, logisticsId } = isLogisticsReady(eq, logistics);
  const phases = {
    installation: phaseFromEquipmentStatus(eq, "installation", ready),
    commissioning: phaseFromEquipmentStatus(eq, "commissioning", ready),
    training: phaseFromEquipmentStatus(eq, "training", ready),
  };
  const openReserves = eq.roomCode
    ? countOpenReserves(eq.roomCode, reserves)
    : 0;
  const line: NassibCommissioningLine = {
    id: `comm-eq-${eq.id}`,
    equipmentId: eq.id,
    assetCode: eq.assetCode,
    description: eq.name,
    roomCode: eq.roomCode ?? "—",
    inventoryKind: eq.inventoryKind,
    lotCode: lotCodeForEquipment(eq),
    logisticsReady: ready,
    logisticsId,
    linkedTestId: findLinkedTest(eq, tests),
    phases,
    overallStatus: "in_progress",
    progressPct: 0,
    openReserves,
  };
  line.progressPct = computeCommissioningProgress(line.phases);
  line.overallStatus = computeOverallStatus(line);
  return line;
}

/** Conserve les phases saisies par l'utilisateur lors des resyncs. */
export function mergeCommissioningLines(
  built: NassibCommissioningLine[],
  existing: NassibCommissioningLine[],
): NassibCommissioningLine[] {
  const byEquipmentId = new Map(existing.map((l) => [l.equipmentId, l]));
  return built.map((b) => {
    const prev = byEquipmentId.get(b.equipmentId);
    if (!prev) return b;
    const phases = { ...b.phases };
    for (const phaseId of PHASE_ORDER) {
      const prevPhase = prev.phases[phaseId];
      const rank: Record<CommissioningPhaseStatus, number> = {
        locked: 0,
        pending: 1,
        in_progress: 2,
        blocked: 2,
        done: 3,
      };
      if (rank[prevPhase.status] > rank[b.phases[phaseId].status]) {
        phases[phaseId] = { ...prevPhase };
      }
    }
    const merged = {
      ...b,
      phases,
      progressPct: computeCommissioningProgress(phases),
    };
    merged.overallStatus = computeOverallStatus(merged);
    return merged;
  });
}

export function buildCommissioningFromProject(
  equipment: NassibEquipment[],
  logistics: NassibLogisticsLine[],
  tests: NassibTest[],
  reserves: NassibReserve[],
): NassibCommissioningLine[] {
  return equipment
    .filter((e) => CLINICAL_KINDS.includes(e.inventoryKind))
    .map((eq) => buildLine(eq, logistics, tests, reserves));
}

export function equipmentStatusFromCommissioning(
  phases: Record<CommissioningPhaseId, CommissioningPhase>,
): NassibEquipment["status"] | null {
  if (phases.training.status === "done") return "validated";
  if (phases.commissioning.status === "done") return "commissioned";
  if (phases.installation.status === "done") return "installed";
  if (phases.installation.status === "in_progress") return "delivered";
  if (phases.commissioning.status === "blocked") return "blocked";
  return null;
}

export function nextPhaseStatus(
  current: CommissioningPhaseStatus,
): CommissioningPhaseStatus | null {
  if (current === "locked" || current === "pending") return "in_progress";
  if (current === "in_progress") return "done";
  return null;
}
