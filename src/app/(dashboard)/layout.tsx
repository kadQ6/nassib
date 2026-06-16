import { AppSidebar } from "@/components/layout/app-sidebar";
import { getNassibBundle } from "@/lib/nassib";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { project, rooms } = getNassibBundle();

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <AppSidebar project={project} roomCount={rooms.length} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
