import { PageHeader } from "@/components/layout/page-header";
import { EquipementsNav } from "@/components/equipements/equipements-nav";
import { InventoryRecapTable } from "@/components/equipements/inventory-recap-table";
import { DISPLAY_GROUP_LABELS } from "@/lib/nassib/inventory-display";
import { getNassibBundle } from "@/lib/nassib";

export default async function EquipementsRecapPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  const { equipment, roomRegistry } = getNassibBundle();
  const roomCodeToId = Object.fromEntries(
    roomRegistry.rooms.map((h) => [h.room.code, h.room.id]),
  );

  return (
    <>
      <PageHeader
        title="Récapitulatif inventaire"
        description={`${equipment.length} lignes — ${DISPLAY_GROUP_LABELS.clinical_medical} et ${DISPLAY_GROUP_LABELS.office.toLowerCase()}`}
        backHref="/equipements"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <EquipementsNav />
        <p className="text-sm text-slate-600">
          Vue consolidée pour le programme de suivi chantier : jalons MEP, fluides
          médicaux et scialytiques avant faux plafonds, coordination CVC et SSI.
        </p>
        <InventoryRecapTable
          equipment={equipment}
          initialRoomFilter={room}
          roomCodeToId={roomCodeToId}
          rooms={roomRegistry.rooms.map((h) => ({
            code: h.room.code,
            name: h.room.name,
            department: h.profile.department,
          }))}
        />
      </main>
    </>
  );
}
