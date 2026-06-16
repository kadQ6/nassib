import { PageHeader } from "@/components/layout/page-header";
import { ProcurementWorkspace } from "@/components/approvisionnements/procurement-workspace";
import { procurementKpis } from "@/lib/nassib/build-procurement-from-project";
import { getNassibBundle } from "@/lib/nassib";

export default function ApprovisionnementsPage() {
  const bundle = getNassibBundle();
  const kpis = procurementKpis(bundle.procurement);
  const procurementPackages = bundle.programme.derivation.packages.filter(
    (p) => p.type === "procurement",
  );
  const roomCodeToId = Object.fromEntries(
    bundle.roomRegistry.rooms.map((h) => [h.room.code, h.room.id]),
  );

  return (
    <>
      <PageHeader
        title="Approvisionnements"
        description="Suivi achats, validations BOQ et dédouanement Djibouti — alimenté par l'inventaire DM et le BOQ contractuel"
      />
      <ProcurementWorkspace
        lines={bundle.procurement}
        kpis={kpis}
        programmeSummary={bundle.programme.derivation.summary}
        procurementPackages={procurementPackages}
        roomCodeToId={roomCodeToId}
      />
    </>
  );
}
