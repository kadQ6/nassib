import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectBaseline } from "@/types/room-hub";
import { formatFdj } from "@/lib/utils";

export function ProjectBaselineBanner({
  baseline,
  projectName,
  contractAmount,
}: {
  baseline: ProjectBaseline;
  projectName: string;
  contractAmount: number;
}) {
  const items = [
    { label: "Plan APD", value: baseline.planVersion, date: baseline.planValidatedAt },
    { label: "BOQ", value: baseline.boqVersion, date: baseline.boqValidatedAt },
    { label: "Planning", value: baseline.planningVersion, date: baseline.planningValidatedAt },
    { label: "Dispatch locaux", value: baseline.dispatchVersion, date: baseline.dispatchValidatedAt },
  ];

  return (
    <Card className="border-[#003F72]/30 bg-gradient-to-r from-[#003F72]/5 to-[#0891B2]/5">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg text-[#003F72]">
            Chantier en exécution — données validées
          </CardTitle>
          <Badge variant="success">Démarré {baseline.chantierStartedAt}</Badge>
        </div>
        <p className="text-sm text-slate-600">
          {projectName} · {baseline.roomCount} locaux dispatchés · BOQ{" "}
          {formatFdj(contractAmount)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border bg-white p-3">
              <p className="text-xs font-medium uppercase text-slate-400">{item.label}</p>
              <p className="font-semibold text-[#003F72]">{item.value}</p>
              <p className="text-xs text-slate-500">Validé {item.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
