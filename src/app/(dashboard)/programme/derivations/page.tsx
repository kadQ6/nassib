import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import type { DerivedPackageType } from "@/types/programme";

const TYPE_LABELS: Record<DerivedPackageType, string> = {
  mep_deployment: "Déploiement MEP",
  equipment_install: "Installation DM",
  gas_production: "Production gaz",
  procurement: "Commande",
  testing: "Essai",
  logistics: "Logistique",
  coordination: "Coordination",
};

const STATUS_VARIANT = {
  pending: "default",
  in_progress: "info",
  blocked: "danger",
  done: "success",
} as const;

export default function ProgrammeDerivationsPage() {
  const { programme } = getNassibBundle();
  const { packages, summary } = programme.derivation;

  const grouped = packages.reduce<Record<string, typeof packages>>((acc, p) => {
    (acc[p.type] ??= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Work packages dérivés"
        description={`${summary.totalPackages} actions générées depuis le dispatching et le schéma DM`}
        backHref="/programme"
      />
      <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <Badge key={type} variant="brand">
              {label}: {grouped[type]?.length ?? 0}
            </Badge>
          ))}
        </div>

        {Object.entries(grouped).map(([type, items]) => (
          <section key={type}>
            <h2 className="mb-3 text-lg font-semibold text-[#003F72]">
              {TYPE_LABELS[type as DerivedPackageType]}
            </h2>
            <div className="space-y-2">
              {items.slice(0, 12).map((pkg) => (
                <Card key={pkg.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{pkg.title}</p>
                      <p className="text-xs text-slate-500">
                        {pkg.lotCode}
                        {pkg.sourceRoomCode && ` · ${pkg.sourceRoomCode}`} ·{" "}
                        {pkg.plannedStart} → {pkg.plannedEnd}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[pkg.status]}>{pkg.status}</Badge>
                      <Badge variant={pkg.priority === "critical" ? "danger" : "default"}>
                        {pkg.priority}
                      </Badge>
                      <Link
                        href={pkg.links.href}
                        className="text-xs font-medium text-[#0891B2] hover:underline"
                      >
                        {pkg.links.module} →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {items.length > 12 && (
                <p className="text-sm text-slate-500">+ {items.length - 12} autres…</p>
              )}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
