import { CorpsEtatWorkspace } from "@/components/lots/corps-etat-workspace";
import { getNassibBundle } from "@/lib/nassib";

export default function LotsPage() {
  const { rooms, tasks, boq } = getNassibBundle();

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-4 lg:px-8 lg:py-5">
      <CorpsEtatWorkspace rooms={rooms} tasks={tasks} boq={boq} />
    </main>
  );
}
