import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const { documents } = getNassibBundle();
  const obsolete = documents.filter((d) => d.isObsolete);

  return (
    <>
      <PageHeader title="Documents & validations" description="GED chantier — plans, PV, CR, DOE" />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        {obsolete.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {obsolete.length} document(s) obsolète(s) — ne pas utiliser comme référence active.
          </div>
        )}
        <Card>
          <CardHeader><CardTitle>Arborescence documentaire</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-3">Document</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Version</th>
                  <th className="py-2 pr-3">Émetteur</th>
                  <th className="py-2 pr-3">Validation</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className={doc.isObsolete ? "bg-slate-50 opacity-60" : ""}>
                    <td className="py-3 pr-3 font-medium">{doc.name}</td>
                    <td className="py-3 pr-3">{doc.docType}</td>
                    <td className="py-3 pr-3">{doc.version}</td>
                    <td className="py-3 pr-3">{doc.emitter}</td>
                    <td className="py-3 pr-3">
                      <Badge variant={doc.validationStatus === "approved" ? "success" : doc.validationStatus === "rejected" ? "danger" : "warning"}>
                        {doc.validationStatus}
                      </Badge>
                      {doc.isObsolete && <Badge variant="info" className="ml-1">Obsolète</Badge>}
                    </td>
                    <td className="py-3">{formatDate(doc.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
