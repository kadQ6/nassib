import { PageHeader } from "@/components/layout/page-header";
import { TestsWorkspace } from "@/components/essais/tests-workspace";
import { getNassibBundle } from "@/lib/nassib";
import { testKpis } from "@/lib/nassib/tests-workflow";

export default function EssaisPage() {
  const bundle = getNassibBundle();
  const kpis = testKpis(bundle.tests);
  const roomCodeToId = Object.fromEntries(
    bundle.roomRegistry.rooms.map((h) => [h.room.code, h.room.id]),
  );

  return (
    <>
      <PageHeader
        title="Essais / OPR / Réception"
        description={`${kpis.total} protocoles · ${kpis.progressPct}% clôturés · WBS 1.7 + essais locaux`}
        backHref="/reception"
      />
      <TestsWorkspace tests={bundle.tests} roomCodeToId={roomCodeToId} />
    </>
  );
}
