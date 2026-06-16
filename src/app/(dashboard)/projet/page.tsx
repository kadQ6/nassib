import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardMethodology } from "@/components/dashboard/dashboard-methodology";
import { ProjectBaselineBanner } from "@/components/room-hub/project-baseline-banner";
import { RoomHubCard } from "@/components/room-hub/room-hub-card";
import {
  KpiStrip,
  MasterIndexCard,
} from "@/components/dashboard/master-index-card";
import { RecentEvents } from "@/components/dashboard/recent-events";
import { computeDashboardMetrics } from "@/lib/calculations/dashboard-metrics";
import { getNassibBundle } from "@/lib/nassib";
import { formatPercent } from "@/lib/utils";

export default function ProjetPage() {
  const bundle = getNassibBundle();
  const { project, dashboard, roomRegistry, events } = bundle;
  const { inputs } = computeDashboardMetrics(bundle);

  const criticalRooms = roomRegistry.rooms
    .filter((h) => h.metrics.criticalReserves > 0 || h.metrics.tasksLate > 0)
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Projet — situation chantier"
        description={`${project.name} · ${project.location}`}
      />
      <main className="w-full px-3 py-6 sm:px-4 lg:pl-5 lg:pr-8">
        <div className="relative z-10 w-full max-w-[1600px] space-y-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-stretch">
          <div className="flex aspect-square w-[180px] shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <Image
              src="/branding/logo-fondation-iog.png"
              alt="Fondation Ismaïl Omar Guelleh pour le Logement"
              width={520}
              height={520}
              priority
              className="h-full w-full object-contain opacity-[0.38]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <ProjectBaselineBanner
              baseline={roomRegistry.baseline}
              projectName={project.name}
              contractAmount={project.contractAmount}
            />
          </div>
        </div>

        <MasterIndexCard index={dashboard.masterIndex} />

        <DashboardMethodology
          inputs={inputs}
          financialNote={inputs.financialNote}
        />

        <KpiStrip
          items={[
            {
              label: "Avancement réel",
              value: formatPercent(dashboard.projectProgressActual, 1),
              sub: `Prévu ${formatPercent(dashboard.projectProgressPlanned, 1)}`,
            },
            {
              label: "Locaux pilotés",
              value: String(roomRegistry.totals.rooms),
              sub: `${roomRegistry.totals.receptionReady} réceptionné(s)`,
            },
            {
              label: "Réserves",
              value: String(roomRegistry.totals.openReserves),
              sub: `${dashboard.criticalReserves} critique(s)`,
              variant: dashboard.criticalReserves > 0 ? "danger" : "default",
            },
            {
              label: "Essais en attente",
              value: String(roomRegistry.totals.pendingTests),
            },
          ]}
        />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#003F72]">
              Locaux nécessitant attention
            </h2>
            <Link href="/locaux" className="text-sm font-medium text-[#0891B2] hover:underline">
              Voir tous les locaux →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {criticalRooms.map((hub) => (
              <RoomHubCard key={hub.room.id} hub={hub} />
            ))}
          </div>
        </section>

        <RecentEvents events={events.slice(0, 8)} />
        </div>
      </main>
    </>
  );
}
