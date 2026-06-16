import { PageHeader } from "@/components/layout/page-header";
import {
  RoomImplementationFiche,
  RoomLocalHeader,
} from "@/components/room-hub/room-implementation-fiche";
import { getNassibBundle } from "@/lib/nassib";
import { NASSIB_SITE_LEVELS } from "@/lib/nassib/constants";
import { countImplementationPlans } from "@/lib/room-sheet/implementation-plan-images";

export default function LocauxPage() {
  const { roomRegistry } = getNassibBundle();
  const planCount = countImplementationPlans();
  const levels = NASSIB_SITE_LEVELS;
  const levelLabels: Record<string, string> = {
    RDC: "RDC — Rez-de-chaussée",
    "R+1": "R+1 — Étage",
    exterieur: "VRD / Extérieur — arrière bâtiment",
  };

  const byLevel = (level: string) =>
    roomRegistry.rooms.filter((h) => h.room.level === level);

  return (
    <>
      <PageHeader
        title="Locaux — unité de pilotage"
        description={`${roomRegistry.totals.rooms} locaux · ${planCount} plans implantation K'BIO (180526)`}
      />
      <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Réserves ouvertes", value: roomRegistry.totals.openReserves },
            { label: "Essais en attente", value: roomRegistry.totals.pendingTests },
            { label: "DM à installer", value: roomRegistry.totals.equipmentToInstall },
            { label: "Locaux réceptionnés", value: roomRegistry.totals.receptionReady },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border bg-white p-4 text-center">
              <p className="text-2xl font-bold text-[#003F72]">{k.value}</p>
              <p className="text-xs text-slate-500">{k.label}</p>
            </div>
          ))}
        </div>

        {levels.map((level) => {
          const hubs = byLevel(level);
          if (hubs.length === 0) return null;
          return (
            <section key={level}>
              <h2 className="mb-4 text-lg font-semibold text-[#003F72]">
                {levelLabels[level] ?? level}
              </h2>
              <div className="space-y-6">
                {hubs.map((hub) => (
                  <article
                    key={hub.room.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <RoomLocalHeader hub={hub} />
                    <div className="p-4">
                      <RoomImplementationFiche hub={hub} compact />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
