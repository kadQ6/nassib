import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";

export default function ProgrammeRevisionsPage() {
  const { programme } = getNassibBundle();

  return (
    <>
      <PageHeader
        title="Révisions programme"
        description="Historique et propositions de modification du référentiel amont"
        backHref="/programme"
      />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-6 lg:px-8">
        {programme.derivation.revisions.map((rev) => (
          <Card key={rev.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-base">{rev.description}</CardTitle>
                <Badge
                  variant={
                    rev.status === "approved"
                      ? "success"
                      : rev.status === "proposed"
                        ? "warning"
                        : "danger"
                  }
                >
                  {rev.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium">Périmètre :</span> {rev.scope}
                {rev.roomCode && ` · ${rev.roomCode}`}
              </p>
              <p>
                <span className="font-medium">Impact :</span> {rev.impact}
              </p>
              <p className="text-xs text-slate-400">{rev.date}</p>
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
}
