import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { LotDetailDashboard } from "@/components/lots/lot-detail-dashboard";
import { getNassibBundle } from "@/lib/nassib";
import { buildLotDetailAnalytics, getLotBoqMeta } from "@/lib/nassib/lot-boq-analytics";

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ lotId: string }>;
}) {
  const { lotId } = await params;
  const { mepLots, tasks, reserves, boq, rooms, zones } = getNassibBundle();
  const lot = mepLots.find((l) => l.id === lotId);
  if (!lot) notFound();

  const lotReserves = reserves.filter((r) => r.lotCode === lot.code);
  const analytics = buildLotDetailAnalytics(lot, boq, tasks, rooms, zones);
  const boqMeta = getLotBoqMeta();

  return (
    <>
      <PageHeader title={`${lot.code} — ${lot.name}`} backHref="/lots" />
      <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <LotDetailDashboard
          lot={lot}
          analytics={analytics}
          reserves={lotReserves}
          boqSource={boqMeta.sourceFile}
          boqDate={boqMeta.validatedAt}
        />
      </main>
    </>
  );
}
