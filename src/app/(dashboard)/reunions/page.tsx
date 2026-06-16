import { ReunionsWorkspace } from "@/components/reunions/reunions-workspace";
import { getNassibBundle } from "@/lib/nassib";

export default function ReunionsPage() {
  const { meetings, tasks } = getNassibBundle();

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
      <ReunionsWorkspace meetings={meetings} tasks={tasks} />
    </main>
  );
}
