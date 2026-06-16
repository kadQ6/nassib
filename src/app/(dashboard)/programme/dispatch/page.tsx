import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";

const NEED_LABELS: Record<string, string> = {
  cfo: "CFO",
  cfa: "CFA",
  cvc: "CVC",
  plumbing: "Plomberie",
  medicalGas: "Gaz médicaux",
  furniture: "Mobilier",
  ssi: "SSI",
  vdi: "Bureautique / VDI",
  biomedicalEquipment: "DM",
};

export default function ProgrammeDispatchPage() {
  const { programme } = getNassibBundle();

  return (
    <>
      <PageHeader
        title="Dispatching des locaux"
        description={`${programme.baseline.dispatch.version} validé le ${programme.baseline.dispatch.validatedAt}`}
        backHref="/programme"
      />
      <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-[#003F72] text-xs uppercase text-white">
              <tr>
                <th className="px-4 py-3">Local</th>
                <th className="px-4 py-3">Rôle / activité</th>
                <th className="px-4 py-3">Effectifs</th>
                <th className="px-4 py-3">Besoins techniques</th>
                <th className="px-4 py-3">Fluides (O₂/V/A)</th>
                <th className="px-4 py-3">Rev.</th>
              </tr>
            </thead>
            <tbody>
              {programme.dispatches.map((d) => (
                <tr key={d.roomCode} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/locaux/${d.roomId}`}
                      className="font-mono font-medium text-[#0891B2] hover:underline"
                    >
                      {d.roomCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.assignedRole}</p>
                    <p className="text-xs text-slate-500">{d.clinicalActivity}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    IDE {d.staffing.nurses} · Médecins {d.staffing.doctors} · Aides{" "}
                    {d.staffing.aides} · Admin {d.staffing.admin}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(d.needs)
                        .filter(([, v]) => v)
                        .map(([k]) => (
                          <Badge key={k} variant="default" className="text-[10px]">
                            {NEED_LABELS[k] ?? k}
                          </Badge>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {d.gasOutlets.o2}/{d.gasOutlets.vacuum}/{d.gasOutlets.medicalAir}
                  </td>
                  <td className="px-4 py-3">v{d.dispatchRevision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
