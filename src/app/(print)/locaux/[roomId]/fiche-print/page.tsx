import { notFound } from "next/navigation";
import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import { NassibFichePrintView } from "@/components/room-hub/nassib-fiche-print-view";
import { buildNassibFichePrintData } from "@/lib/room-sheet/nassib-fiche-print";
import { getNassibBundle } from "@/lib/nassib";
import { resolveRoomHub } from "@/lib/room-hub/resolve-room";

export const dynamic = "force-dynamic";

export default async function FichePrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ auto?: string }>;
}) {
  const { roomId } = await params;
  const { auto } = await searchParams;
  const bundle = getNassibBundle();
  const hub = resolveRoomHub(bundle, roomId);
  if (!hub) notFound();

  const planDef =
    PLAN_ROOM_CATALOG.find((d) => d.id === hub.room.id) ??
    PLAN_ROOM_CATALOG.find((d) => d.code === hub.room.code);

  const data = buildNassibFichePrintData(
    hub.sheet,
    hub.profile,
    hub.room.name,
    hub.room.code,
    hub.room.level,
    planDef?.layout ?? [],
  );

  return <NassibFichePrintView data={data} autoPrint={auto === "1"} />;
}
