import Link from "next/link";
import { ArrowRight, CheckCircle2, GitBranch, Lock } from "lucide-react";
import type { ProgrammeContext } from "@/types/programme";
import { Badge } from "@/components/ui/badge";

export function ProgrammePipeline({ programme }: { programme: ProgrammeContext }) {
  const { baseline, derivation } = programme;
  const steps = [
    {
      label: "Plan APD finalisé",
      version: baseline.planFinal.version,
      status: baseline.planFinal.status,
      date: baseline.planFinal.validatedAt,
    },
    {
      label: "BOQ validé",
      version: baseline.boq.version,
      status: baseline.boq.status,
      date: baseline.boq.validatedAt,
    },
    {
      label: "Dispatching locaux",
      version: baseline.dispatch.version,
      status: baseline.dispatch.status,
      date: baseline.dispatch.validatedAt,
    },
    {
      label: "Schéma implantation DM",
      version: baseline.equipmentSchema.version,
      status: baseline.equipmentSchema.status,
      date: baseline.equipmentSchema.validatedAt,
    },
    {
      label: "Dérivation chantier",
      version: derivation.baselineVersion,
      status: "validated" as const,
      date: derivation.generatedAt.slice(0, 10),
      count: derivation.summary.totalPackages,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
            Chaîne programme → exécution
          </p>
          <h2 className="text-lg font-semibold text-[#003F72]">
            Projet en phase exécution depuis {baseline.chantierStartedAt}
          </h2>
        </div>
        <Link
          href="/programme"
          className="flex items-center gap-1 text-sm font-medium text-[#0891B2] hover:underline"
        >
          Programme complet <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                {step.status === "locked" ? (
                  <Lock className="h-4 w-4 text-[#003F72]" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
                <span className="text-sm font-medium text-slate-800">{step.label}</span>
              </div>
              <p className="text-xs text-slate-500">{step.version}</p>
              <p className="text-xs text-slate-400">{step.date}</p>
              {"count" in step && step.count != null && (
                <Badge variant="brand" className="mt-2 w-fit">
                  {step.count} work packages
                </Badge>
              )}
            </div>
            {i < steps.length - 1 && (
              <GitBranch className="hidden h-4 w-4 shrink-0 rotate-90 text-slate-300 lg:block lg:rotate-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
