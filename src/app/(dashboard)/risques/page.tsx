import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import { formatDate } from "@/lib/utils";

export default function RisquesPage() {
  const { risks } = getNassibBundle();
  const sorted = [...risks].sort((a, b) => b.criticality - a.criticality);

  return (
    <>
      <PageHeader title="Risques & alertes" description="Registre des risques chantier" />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-6 lg:px-8">
        {sorted.map((risk) => (
          <Card key={risk.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div className="max-w-2xl">
                <p className="font-semibold text-[#003F72]">{risk.title}</p>
                <p className="mt-1 text-sm text-slate-600">{risk.description}</p>
                <p className="mt-2 text-sm"><span className="text-slate-500">Plan d&apos;action :</span> {risk.actionPlan}</p>
                <p className="text-xs text-slate-500 mt-1">{risk.responsible} · Échéance {formatDate(risk.dueDate)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={risk.criticality >= 16 ? "danger" : risk.criticality >= 10 ? "warning" : "info"}>
                  Criticité {risk.criticality}
                </Badge>
                <Badge variant="info">{risk.category}</Badge>
                <Badge variant={risk.status === "closed" ? "success" : "warning"}>{risk.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
}
