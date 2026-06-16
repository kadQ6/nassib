import { PageHeader } from "@/components/layout/page-header";
import { PlanningGeneralGantt } from "@/components/planning/planning-general-gantt";
import { CorpsEtatProgressChart } from "@/components/planning/corps-etat-progress-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePlanningAlerts } from "@/lib/calculations/planning-alerts";
import { getNassibBundle } from "@/lib/nassib";
import {
  PLANNING_GANTT_META,
  PLANNING_GANTT_WARNINGS,
} from "@/data/nassib/planning-gantt-2026";
import {
  PLANNING_EXECUTIVE_GROUPS,
  PLANNING_EXECUTIVE_META,
  PLANNING_CORPS_ETAT_PROGRESS,
} from "@/data/nassib/planning-gantt-executive";

export default function PlanningPage() {
  const { tasks, schedule, project } = getNassibBundle();
  const alerts = generatePlanningAlerts(tasks);

  return (
    <>
      <PageHeader
        title="6. Planning"
        description={`${PLANNING_EXECUTIVE_META.projectName} · ${PLANNING_GANTT_META.sourceFile}`}
      />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 lg:px-8 lg:py-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs text-slate-500">Contractuel</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm font-semibold">
                {schedule.contractStart} → {schedule.contractEnd}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs text-slate-500">Avancement réel</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm font-semibold text-[#0891B2]">
                {project.progressActual} %
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs text-slate-500">Fin prévisionnelle</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm font-semibold">{schedule.forecastEnd}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs text-slate-500">Alertes auto</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <Badge variant={alerts.length > 5 ? "danger" : "warning"}>
                {alerts.length}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <PlanningGeneralGantt
          groups={PLANNING_EXECUTIVE_GROUPS}
          projectName={PLANNING_EXECUTIVE_META.projectName}
          timelineStart={PLANNING_EXECUTIVE_META.timelineStart}
          timelineEnd={PLANNING_EXECUTIVE_META.timelineEnd}
        />

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_min(340px,32%)]">
          {alerts.length > 0 ? (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">
                  Alertes planning ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-64 space-y-2 overflow-y-auto pb-4">
                {alerts.map((a, i) => (
                  <div
                    key={`${a.taskId}-${a.type}-${i}`}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 p-2.5 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{a.taskName}</p>
                      <p className="text-slate-500">{a.message}</p>
                    </div>
                    <Badge
                      variant={
                        a.severity === "critical"
                          ? "danger"
                          : a.severity === "warning"
                            ? "warning"
                            : "info"
                      }
                    >
                      {a.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-slate-500">
                Aucune alerte planning détectée.
              </CardContent>
            </Card>
          )}

          <CorpsEtatProgressChart items={PLANNING_CORPS_ETAT_PROGRESS} />
        </div>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-amber-900">
              Cadre d&apos;alerte &amp; amélioration
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-950">
              {PLANNING_GANTT_WARNINGS.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
