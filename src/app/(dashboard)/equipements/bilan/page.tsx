import { PageHeader } from "@/components/layout/page-header";
import { EquipementsNav } from "@/components/equipements/equipements-nav";
import { InventoryBilanPanel } from "@/components/equipements/inventory-bilan-panel";
import { computeInventoryBilan } from "@/lib/nassib/inventory-bilan";
import { getNassibBundle } from "@/lib/nassib";

export default function EquipementsBilanPage() {
  const { equipment } = getNassibBundle();
  const bilan = computeInventoryBilan(equipment);

  return (
    <>
      <PageHeader
        title="Bilan équipements & mobilier"
        description="Polyclinique Nassib — prévu plan implantation vs manques identifiés"
        backHref="/equipements"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <EquipementsNav />
        <p className="text-sm text-slate-600">
          Deux périmètres : <strong>équipements et mobilier médicaux</strong> (DM +
          lits, brancards, tables…) et <strong>mobilier bureau</strong> (bureaux,
          sièges, postes PC, imprimantes). Les écarts sont calculés à partir des
          besoins locaux et du schéma d&apos;implantation K&apos;BIO.
        </p>
        <InventoryBilanPanel bilan={bilan} />
      </main>
    </>
  );
}
