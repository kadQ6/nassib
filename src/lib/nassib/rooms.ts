import type { NassibRoom, Zone } from "@/types/nassib";
import { buildNassibRoomsFromPlan } from "@/data/nassib/plan-catalog";
import { NASSIB_PROJECT_ID, ZONE_DEFINITIONS } from "./constants";

export const NASSIB_ZONES: Zone[] = ZONE_DEFINITIONS.map((z) => ({
  ...z,
  projectId: NASSIB_PROJECT_ID,
}));

/** Locaux issus des plans A-01 (RDC) et A-02 (R+1) — 26/04/2026 */
export const NASSIB_ROOMS: NassibRoom[] = buildNassibRoomsFromPlan();
