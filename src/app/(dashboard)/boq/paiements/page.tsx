import { PageHeader } from "@/components/layout/page-header";
import { PaymentsWorkspace } from "@/components/boq/payments-workspace";
import { getNassibBundle } from "@/lib/nassib";

export default function PaiementsPage() {
  const { boq } = getNassibBundle();

  return (
    <>
      <PageHeader
        title="Paiements & décomptes"
        description="Workflow MOE → MOA → Finance · situations par corps d'état"
        backHref="/boq"
      />
      <PaymentsWorkspace boq={boq} />
    </>
  );
}
