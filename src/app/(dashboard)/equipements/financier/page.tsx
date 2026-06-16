import { PageHeader } from "@/components/layout/page-header";
import { EquipementsNav } from "@/components/equipements/equipements-nav";
import { InventoryFinancePrep } from "@/components/equipements/inventory-finance-prep";
import { getNassibBundle } from "@/lib/nassib";

export default async function EquipementsFinancierPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  const { equipment } = getNassibBundle();

  return (
    <>
      <PageHeader
        title="Préparation financière"
        description="Marque, modèle et prix unitaire — saisie manuelle avant intégration BOQ / approvisionnements"
        backHref="/equipements"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <EquipementsNav />
        <InventoryFinancePrep equipment={equipment} initialRoomFilter={room} />
      </main>
    </>
  );
}
