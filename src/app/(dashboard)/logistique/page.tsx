import { PageHeader } from "@/components/layout/page-header";
import { LogisticsWorkspace } from "@/components/logistique/logistics-workspace";
import { logisticsKpis } from "@/lib/nassib/build-logistics-from-project";
import { getNassibBundle } from "@/lib/nassib";
import { isProcurementValidatedForLogistics } from "@/lib/nassib/logistics-internal";

export default function LogistiquePage() {
  const bundle = getNassibBundle();
  const kpis = logisticsKpis(bundle.logistics);
  const logisticsPackages = bundle.programme.derivation.packages.filter(
    (p) => p.type === "logistics",
  );
  const roomCodeToId = Object.fromEntries(
    bundle.roomRegistry.rooms.map((h) => [h.room.code, h.room.id]),
  );
  const procurementPendingValidation = bundle.procurement.filter(
    (p) => !isProcurementValidatedForLogistics(p),
  ).length;

  return (
    <>
      <PageHeader
        title="Logistique interne"
        description="Vide au démarrage — alimentée automatiquement après validation des commandes (ODD dédouané)"
      />
      <LogisticsWorkspace
        lines={bundle.logistics}
        kpis={kpis}
        programmeSummary={bundle.programme.derivation.summary}
        logisticsPackages={logisticsPackages}
        roomCodeToId={roomCodeToId}
        procurementTotal={bundle.procurement.length}
        procurementPendingValidation={procurementPendingValidation}
      />
    </>
  );
}
