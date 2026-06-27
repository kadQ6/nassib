import { describe, it, expect } from "vitest";
import { getNassibBundle } from "@/lib/nassib";
import {
  computeCommissioningProgress,
  computeOverallStatus,
} from "./build-commissioning-from-project";
import { buildBoqCorpsEtatRows, boqDashboardKpis } from "./boq-dashboard";
import type {
  CommissioningPhase,
  CommissioningPhaseId,
  CommissioningPhaseStatus,
} from "@/types/nassib";

function phases(
  statuses: Record<CommissioningPhaseId, CommissioningPhaseStatus>,
): Record<CommissioningPhaseId, CommissioningPhase> {
  return {
    installation: { status: statuses.installation, responsible: "" },
    commissioning: { status: statuses.commissioning, responsible: "" },
    training: { status: statuses.training, responsible: "" },
  };
}

describe("computeCommissioningProgress", () => {
  it("0% quand aucune phase faite", () => {
    expect(
      computeCommissioningProgress(
        phases({ installation: "pending", commissioning: "pending", training: "pending" }),
      ),
    ).toBe(0);
  });
  it("100% quand toutes faites", () => {
    expect(
      computeCommissioningProgress(
        phases({ installation: "done", commissioning: "done", training: "done" }),
      ),
    ).toBe(100);
  });
  it("33% pour une phase sur trois", () => {
    expect(
      computeCommissioningProgress(
        phases({ installation: "done", commissioning: "pending", training: "pending" }),
      ),
    ).toBe(33);
  });
});

describe("computeOverallStatus", () => {
  it("attend la logistique si non prête", () => {
    expect(
      computeOverallStatus({
        logisticsReady: false,
        openReserves: 0,
        phases: phases({ installation: "pending", commissioning: "pending", training: "pending" }),
      }),
    ).toBe("waiting_logistics");
  });
  it("prêt pour exploitation quand formation faite", () => {
    expect(
      computeOverallStatus({
        logisticsReady: true,
        openReserves: 0,
        phases: phases({ installation: "done", commissioning: "done", training: "done" }),
      }),
    ).toBe("ready_for_exploitation");
  });
  it("bloqué si réserves ouvertes et mise en service bloquée", () => {
    expect(
      computeOverallStatus({
        logisticsReady: true,
        openReserves: 2,
        phases: phases({ installation: "done", commissioning: "blocked", training: "pending" }),
      }),
    ).toBe("blocked");
  });
});

describe("boqDashboardKpis", () => {
  const rows = buildBoqCorpsEtatRows();
  const kpis = boqDashboardKpis(rows);

  it("totalHt = acomptes + reste", () => {
    expect(kpis.totalAcomptes + kpis.totalReste).toBe(kpis.totalHt);
  });
  it("avancement global borné 0–100", () => {
    expect(kpis.globalProgressPct).toBeGreaterThanOrEqual(0);
    expect(kpis.globalProgressPct).toBeLessThanOrEqual(100);
  });
  it("corpsCount cohérent avec les lignes", () => {
    expect(kpis.corpsCount).toBe(rows.length);
  });
});

describe("getNassibBundle", () => {
  const bundle = getNassibBundle();
  it("contient les collections principales non vides", () => {
    expect(bundle.project).toBeTruthy();
    expect(bundle.rooms.length).toBeGreaterThan(0);
    expect(bundle.boq.length).toBeGreaterThan(0);
    // NB: les réserves démarrent vides par conception (aucune donnée fictive) —
    // elles sont saisies par l'utilisateur. On vérifie juste le type.
    expect(Array.isArray(bundle.reserves)).toBe(true);
  });
});
