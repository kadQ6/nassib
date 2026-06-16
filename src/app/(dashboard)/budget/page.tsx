import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNassibBundle } from "@/lib/nassib";
import { formatFdj, formatPercent } from "@/lib/utils";
import { ProgressBar } from "@/components/shared/progress-bar";

export default function BudgetPage() {
  const { project, dashboard, boq } = getNassibBundle();
  const consumedPct = (project.budgetConsumed / project.contractAmount) * 100;

  return (
    <>
      <PageHeader
        title="Budget"
        description="Suivi financier contractuel et consommation"
      />
      <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Montant contractuel</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-[#003F72]">
              {formatFdj(project.contractAmount)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Consommé</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-[#0891B2]">
              {formatFdj(project.budgetConsumed)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Écart vs avancement</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-amber-600">
              {formatPercent(dashboard.budgetVariancePct, 1)}
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-600">Taux de consommation budget</p>
          <ProgressBar value={consumedPct} />
        </div>

        <div className="flex justify-end">
          <Link href="/boq" className="text-sm font-medium text-[#0891B2] hover:underline">
            Voir le BOQ détaillé →
          </Link>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#003F72]">Top postes BOQ</h2>
          <div className="space-y-2">
            {boq.slice(0, 8).map((line) => (
              <Card key={line.id}>
                <CardContent className="flex items-center justify-between py-3 text-sm">
                  <span>{line.description}</span>
                  <span className="font-medium">{formatFdj(line.paymentPaid)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
