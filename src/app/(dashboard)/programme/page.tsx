import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ProgrammePipeline } from "@/components/programme/programme-pipeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import { formatCurrency } from "@/lib/utils";

export default function ProgrammePage() {
  const { programme, project } = getNassibBundle();
  const { baseline, derivation, dispatches, equipmentSlots } = programme;
  const s = derivation.summary;

  return (
    <>
      <PageHeader
        title="Programme validé — moteur de dérivation"
        description="Point de départ figé : plan, BOQ, dispatching locaux, schéma DM → suivi chantier"
      />
      <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
        <ProgrammePipeline programme={programme} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Locaux dispatchés</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-[#003F72]">
              {dispatches.length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Slots implantation</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-[#003F72]">
              {equipmentSlots.length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Work packages dérivés</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-[#0891B2]">
              {s.totalPackages}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Révisions ouvertes</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-amber-600">
              {s.openRevisions}
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003F72]">Référentiels figés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Plan APD</span>
                <span className="font-mono">{baseline.planFinal.documentRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>BOQ {baseline.boq.version}</span>
                <span>{formatCurrency(baseline.boq.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Dispatch {baseline.dispatch.version}</span>
                <span>{baseline.dispatch.roomCount} locaux</span>
              </div>
              <div className="flex justify-between">
                <span>Chantier démarré</span>
                <span>{baseline.chantierStartedAt}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#003F72]">Besoins agrégés (fluides)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#003F72]">{s.gasOutletsRequired.o2}</p>
                <p className="text-xs text-slate-500">Prises O₂</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#003F72]">{s.gasOutletsRequired.vacuum}</p>
                <p className="text-xs text-slate-500">Vide médical</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#003F72]">{s.gasOutletsRequired.medicalAir}</p>
                <p className="text-xs text-slate-500">Air médical</p>
              </div>
              <p className="col-span-3 text-sm text-slate-600">
                {s.o2ProductionSteps} étapes production O₂ · centrale TEC-01
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#003F72]">
            Modules alimentés par le programme
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Dispatching locaux", href: "/programme/dispatch", n: dispatches.length },
              { label: "Work packages dérivés", href: "/programme/derivations", n: s.totalPackages },
              { label: "Déploiement MEP", href: "/lots", n: s.mepTasks },
              { label: "Commandes & achats", href: "/approvisionnements", n: s.procurements },
              { label: "Logistique livraisons", href: "/logistique", n: s.logistics },
              { label: "Installations DM", href: "/installation-dm", n: s.equipmentInstalls },
              { label: "Fluides & O₂", href: "/fluides-medicaux", n: s.o2ProductionSteps },
              { label: "Planning tâches", href: "/planning", n: project.code },
              { label: "Révisions programme", href: "/programme/revisions", n: s.openRevisions },
            ].map((m) => (
              <Link key={m.href} href={m.href}>
                <Card className="hover:border-[#0891B2]/40 hover:shadow-md">
                  <CardContent className="flex items-center justify-between py-4">
                    <span className="font-medium text-slate-800">{m.label}</span>
                    <Badge variant="brand">{String(m.n)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
