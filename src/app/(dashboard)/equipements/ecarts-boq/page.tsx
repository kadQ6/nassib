import { PageHeader } from "@/components/layout/page-header";
import { BoqPlanEcartsPanel } from "@/components/equipements/boq-plan-ecarts-panel";
import { EquipementsNav } from "@/components/equipements/equipements-nav";
import { computeBoqPlanReconciliation } from "@/lib/nassib/boq-plan-reconciliation";
import { getNassibBundle } from "@/lib/nassib";

export default function EquipementsEcartsBoqPage() {
  getNassibBundle();
  const reconciliation = computeBoqPlanReconciliation();

  return (
    <>
      <PageHeader
        title="Écarts BOQ / plan implantation"
        description="Rapprochement quantitatif — prises CFO, sanitaires, fluides médicaux vs plan d'implantation"
        backHref="/equipements"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <EquipementsNav />
        <p className="text-sm text-slate-600">
          Compare le BOQ contractuel DJI-FU (PDF oct. 2024) aux quantités dérivées
          du plan d&apos;implantation équipements et des fiches techniques locaux
          K&apos;BIO. Un Δ positif signifie que le plan prévoit plus que le BOQ.
        </p>
        <BoqPlanEcartsPanel reconciliation={reconciliation} />
      </main>
    </>
  );
}
