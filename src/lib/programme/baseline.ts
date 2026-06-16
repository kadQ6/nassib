import type { ValidatedBaseline } from "@/types/programme";
import { PLAN_METADATA } from "@/data/nassib/plan-layouts";
import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";

/** Référentiel figé — plans A-01/A-02 FIOG · chantier en exécution */
export const NASSIB_VALIDATED_BASELINE: ValidatedBaseline = {
  projectPhase: "execution",
  chantierStartedAt: "2025-08-01",
  planFinal: {
    version: `${PLAN_METADATA.rdcRef} + ${PLAN_METADATA.r1Ref}`,
    validatedAt: PLAN_METADATA.planDate,
    documentRef: "KBIO-DJI-PLAN-RDC-A-01 / KBIO-DJI-PLAN-R1-A-02 / VRD-01 (locaux techniques arrière bâtiment)",
    status: "locked",
  },
  boq: {
    version: "BOQ-V2",
    validatedAt: "2025-05-22",
    totalAmount: 12_500_000,
    lineCount: 847,
    status: "validated",
  },
  dispatch: {
    version: "DISP-PLAN-180526",
    validatedAt: PLAN_METADATA.planDate,
    roomCount: PLAN_ROOM_CATALOG.length,
    status: "validated",
  },
  equipmentSchema: {
    version: "SCH-IMPLANT-180526",
    validatedAt: "2026-05-18",
    slotCount: 0,
    status: "validated",
  },
};
