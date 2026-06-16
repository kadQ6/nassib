import { BoqDashboard } from "@/components/boq/boq-dashboard";
import { getNassibBundle } from "@/lib/nassib";

export default function BoqPage() {
  const { boq } = getNassibBundle();

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
      <BoqDashboard boqLines={boq} />
    </main>
  );
}
