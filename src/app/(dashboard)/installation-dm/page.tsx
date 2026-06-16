import { PageHeader } from "@/components/layout/page-header";
import { CommissioningWorkspace } from "@/components/installation-dm/commissioning-workspace";
import { commissioningKpis } from "@/lib/nassib/commissioning-workflow";
import { getNassibBundle } from "@/lib/nassib";

export default function InstallationDmPage() {
  const bundle = getNassibBundle();
  const kpis = commissioningKpis(bundle.commissioning);
  const roomCodeToId = Object.fromEntries(
    bundle.roomRegistry.rooms.map((h) => [h.room.code, h.room.id]),
  );

  return (
    <>
      <PageHeader
        title="Installation · Mise en service · Formation"
        description={`${kpis.total} équipements DM · ${kpis.avgProgress}% avancement · circuit post-logistique`}
        backHref="/logistique"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <p className="text-sm text-slate-600">
          Suivi des équipements médicaux après réception logistique : pose,
          qualification (IQ/OQ), formation du personnel soignant et lien vers
          essais, réserves et mise en exploitation.
        </p>
        <CommissioningWorkspace
          lines={bundle.commissioning}
          roomCodeToId={roomCodeToId}
          logisticsCount={bundle.logistics.length}
        />
      </main>
    </>
  );
}
