export { buildRoomProfilesFromPlan as getRoomProfiles } from "@/data/nassib/plan-catalog";

import { buildRoomProfilesFromPlan } from "@/data/nassib/plan-catalog";

/** Profils locaux — plans implantation + dispatch Nassib 180526 */
export const ROOM_PROFILES = buildRoomProfilesFromPlan();
