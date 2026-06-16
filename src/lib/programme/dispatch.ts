import type { RoomDispatch } from "@/types/programme";
import { buildRoomDispatchFromPlan } from "@/data/nassib/plan-catalog";

/**
 * Dispatching des locaux validé — extrait des plans A-01 / A-02 (26/04/2026)
 * + schémas implantation équipements.
 */
export const NASSIB_ROOM_DISPATCH: RoomDispatch[] = buildRoomDispatchFromPlan();
