import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import { ROLE_LABELS } from "@/lib/constants/roles";

export default function SettingsPage() {
  const { project, schedule, members } = getNassibBundle();

  return (
    <>
      <PageHeader title="Paramètres projet" description="Polyclinique Nassib" />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <Card>
          <CardHeader><CardTitle>Projet</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
            <div><p className="text-slate-500">Nom</p><p className="font-medium">{project.name}</p></div>
            <div><p className="text-slate-500">Client</p><p className="font-medium">{project.client}</p></div>
            <div><p className="text-slate-500">Contrat</p><p>{schedule.contractStart} → {schedule.contractEnd}</p></div>
            <div><p className="text-slate-500">Prévision</p><p className="text-red-600">{schedule.forecastEnd}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Équipe & rôles</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-slate-500">{m.email}</p>
                </div>
                <Badge variant="brand">{ROLE_LABELS[m.role]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
