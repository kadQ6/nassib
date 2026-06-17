import type { NassibBundle } from "@/types/nassib";
import type { RoomHub } from "@/types/room-hub";
import { getRoomHub, getRoomHubByCode } from "@/lib/room-hub";

/** Résout un local par id (`r-box-01`) ou par code (`BOX-01`). */
export function resolveRoomHub(
  bundle: NassibBundle,
  roomIdOrCode: string,
): RoomHub | undefined {
  return (
    getRoomHub(bundle, roomIdOrCode) ??
    getRoomHubByCode(bundle, roomIdOrCode) ??
    getRoomHubByCode(bundle, roomIdOrCode.toUpperCase())
  );
}
