import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { RoomHubCockpit } from "@/components/room-hub/room-hub-cockpit";
import { getNassibBundle } from "@/lib/nassib";
import { getRoomHub } from "@/lib/room-hub";

export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { roomId } = await params;
  const { tab } = await searchParams;
  const bundle = getNassibBundle();
  const hub = getRoomHub(bundle, roomId);
  if (!hub) notFound();

  const validTabs = [
    "fiche",
    "overview",
    "needs",
    "mep",
    "equipment",
    "boq",
    "tasks",
    "quality",
    "docs",
  ] as const;
  const initialTab = validTabs.includes(tab as (typeof validTabs)[number])
    ? (tab as (typeof validTabs)[number])
    : undefined;

  return (
    <>
      <PageHeader
        title={`${hub.room.code} — ${hub.profile.functionalRole}`}
        description={`Cockpit local · ${hub.profile.department} · Dispatch v${hub.profile.dispatchRevision}`}
        backHref="/locaux"
      />
      <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <RoomHubCockpit hub={hub} initialTab={initialTab} />
      </main>
    </>
  );
}
