import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import type { LayoutItem } from "@/data/nassib/plan-types";

export function layoutForRoom(roomId: string, roomCode: string): LayoutItem[] {
  const def =
    PLAN_ROOM_CATALOG.find((d) => d.id === roomId) ??
    PLAN_ROOM_CATALOG.find((d) => d.code === roomCode);
  return def?.layout ?? [];
}
