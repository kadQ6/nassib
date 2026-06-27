import Link from "next/link";
import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNassibBundle } from "@/lib/nassib";
import { EXPORT_DATASETS } from "@/lib/export/datasets";

const FORMATS = [
  { key: "xlsx", label: "Excel", icon: FileSpreadsheet },
  { key: "pdf", label: "PDF", icon: FileText },
  { key: "csv", label: "CSV", icon: FileDown },
] as const;

export default function RapportsPage() {
  const { dashboard, reserves, project } = getNassibBundle();
  const datasets = Object.values(EXPORT_DATASETS);

  return (
    <>
      <PageHeader title="Rapports & exports" description="Synthèses, exports Excel / PDF / CSV par module" />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="text-base">Synthèse hebdomadaire</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Avancement réel : {dashboard.projectProgressActual}%</p>
              <p>Réserves ouvertes : {dashboard.openReserves}</p>
              <p>Indice maîtrise : {dashboard.masterIndex.score}/100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Registre réserves</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>{reserves.length} réserves enregistrées</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Classeur complet</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-slate-500">{project.name}</p>
              <div className="flex gap-2">
                <Link href="/api/export/xlsx/all">
                  <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1 h-4 w-4" />Excel</Button>
                </Link>
                <Link href="/api/export/pdf/all">
                  <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4" />PDF</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Exports par module</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4 font-medium">Module</th>
                    <th className="py-2 font-medium">Formats</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((ds) => (
                    <tr key={ds.key} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{ds.title}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-2">
                          {FORMATS.map(({ key, label, icon: Icon }) => (
                            <Link key={key} href={`/api/export/${key}/${ds.key}`}>
                              <Button variant="outline" size="sm">
                                <Icon className="mr-1 h-4 w-4" />
                                {label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
