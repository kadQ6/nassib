import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNassibBundle } from "@/lib/nassib";

export default function RapportsPage() {
  const { dashboard, reserves, project } = getNassibBundle();

  return (
    <>
      <PageHeader title="Rapports chantier" description="Synthèses et exports" />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="text-base">Synthèse hebdomadaire</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Avancement réel : {dashboard.projectProgressActual}%</p>
              <p>Réserves ouvertes : {dashboard.openReserves}</p>
              <p>Indice maîtrise : {dashboard.masterIndex.score}/100</p>
              <Link href="/api/export/reserves">
                <Button variant="outline" size="sm" className="mt-2">Export réserves CSV</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Registre réserves</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>{reserves.length} réserves enregistrées</p>
              <p className="text-slate-500 mt-1">PDF fiche réserve — MVP+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Rapport MOA</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>{project.name}</p>
              <p className="text-slate-500">Export PDF complet — MVP+</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
