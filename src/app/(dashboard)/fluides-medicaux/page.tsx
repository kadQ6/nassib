import { PageHeader } from "@/components/layout/page-header";
import { MedicalGasWorkspace } from "@/components/fluides/medical-gas-workspace";
import { medicalGasKpis } from "@/lib/nassib/medical-gas-workflow";
import { getNassibBundle } from "@/lib/nassib";

export default function FluidesMedicauxPage() {
  const { medicalGas } = getNassibBundle();
  const kpis = medicalGasKpis(medicalGas);

  return (
    <>
      <PageHeader
        title="Fluides médicaux"
        description={`O₂, vide, air médical — ${kpis.outletsPlanned} prises planifiées · ${kpis.avgProgress}% avancement moyen`}
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <MedicalGasWorkspace networks={medicalGas} />
      </main>
    </>
  );
}
