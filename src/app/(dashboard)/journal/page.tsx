import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNassibBundle } from "@/lib/nassib";
import { formatDate } from "@/lib/utils";

export default function JournalPage() {
  const { dailyReports } = getNassibBundle();

  return (
    <>
      <PageHeader title="Journal de chantier" description="Compte rendu quotidien — effectifs, travaux, incidents" />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        {dailyReports.map((dr) => (
          <Card key={dr.id}>
            <CardHeader>
              <CardTitle>{formatDate(dr.date)} — {dr.weather}</CardTitle>
              <p className="text-sm text-slate-500">Signé : {dr.signedBy}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-slate-700">Effectifs</p>
                <p>{dr.workforce.map((w) => `${w.company} (${w.count})`).join(" · ")}</p>
              </div>
              <div><p className="font-medium text-slate-700">Travaux réalisés</p><p>{dr.worksDone}</p></div>
              <div><p className="font-medium text-slate-700">Zones</p><p>{dr.zonesWorked.join(", ")}</p></div>
              {dr.incidents && <div><p className="font-medium text-slate-700">Incidents</p><p>{dr.incidents}</p></div>}
              {dr.blockages && <div className="rounded-lg bg-amber-50 p-3 text-amber-900">{dr.blockages}</div>}
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
}
