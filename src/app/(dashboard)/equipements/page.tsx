import { PageHeader } from "@/components/layout/page-header";
import { EquipementsNav } from "@/components/equipements/equipements-nav";
import { EquipmentManager } from "@/components/equipements/equipment-manager";
import { InventoryBilanPanel } from "@/components/equipements/inventory-bilan-panel";
import { computeInventoryBilan } from "@/lib/nassib/inventory-bilan";
import { DISPLAY_GROUP_LABELS } from "@/lib/nassib/inventory-display";
import { getNassibBundle } from "@/lib/nassib";

export default function EquipementsPage() {
  const { equipment, roomRegistry } = getNassibBundle();
  const bilan = computeInventoryBilan(equipment);

  return (
    <>
      <PageHeader
        title="8. Équipements & mobilier"
        description={`${equipment.length} lignes · ${DISPLAY_GROUP_LABELS.clinical_medical} (${bilan.totals.clinical_medical.total}) · ${DISPLAY_GROUP_LABELS.office} (${bilan.totals.office.total})`}
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <EquipementsNav />
        <InventoryBilanPanel bilan={bilan} compact />
        <p className="text-sm text-slate-600">
          Détail par local ci-dessous. Ouvrez la fiche local pour le séquencement
          chantier (MEP, faux plafonds).
        </p>
        <EquipmentManager equipment={equipment} rooms={roomRegistry.rooms} />
      </main>
    </>
  );
}
