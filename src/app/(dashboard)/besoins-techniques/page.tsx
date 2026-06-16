import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { BesoinsFilterPanel } from "@/components/besoins/besoins-filter-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNassibBundle } from "@/lib/nassib";

export default function BesoinsTechniquesPage() {
  const { roomRegistry, medicalGas } = getNassibBundle();

  return (
    <>
      <PageHeader
        title="Besoins techniques par local"
        description="Module 4 — prises O₂ / aspiration / air médical calculées depuis les lits du plan d'implantation"
        backHref="/locaux"
      />
      <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
        <Suspense fallback={<p className="text-sm text-slate-500">Chargement des filtres…</p>}>
          <BesoinsFilterPanel rooms={roomRegistry.rooms} />
        </Suspense>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#003F72]">Production O₂ — réseaux</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {medicalGas.map((net) => (
              <Card key={net.id}>
                <CardHeader><CardTitle className="text-base">{net.type}</CardTitle></CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Source : {net.source} · {net.outletsInstalled}/{net.outletsPlanned} prises · {net.progressPct}%
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
