import { TasksWorkspace } from "@/components/taches/tasks-workspace";
import { getNassibBundle } from "@/lib/nassib";

export default function TachesPage() {
  const { actionTasks } = getNassibBundle();

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-4 lg:px-8 lg:py-5">
      <TasksWorkspace actionTasks={actionTasks} />
    </main>
  );
}
