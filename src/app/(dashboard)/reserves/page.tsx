import { PageHeader } from "@/components/layout/page-header";
import { ReserveForm } from "@/components/reserves/reserve-form";
import { ReserveStatusButton } from "@/components/reserves/reserve-status-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import { formatDate } from "@/lib/utils";

export default function ReservesPage() {
  const { reserves, rooms, mepLots } = getNassibBundle();
  const open = reserves.filter((r) => !["closed", "levée"].includes(r.status));
  const critical = open.filter((r) => r.severity === "critical");
  const overdue = open.filter((r) => new Date(r.dueDate) < new Date());
  const blocking = open.filter((r) => r.blocksReception);

  return (
    <>
      <PageHeader
        title="Réserves & non-conformités"
        description={`${reserves.length} réserves · ${critical.length} critiques · ${blocking.length} bloquantes réception`}
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold text-[#003F72]">{open.length}</p><p className="text-sm text-slate-500">Ouvertes</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold text-red-600">{critical.length}</p><p className="text-sm text-slate-500">Critiques</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold text-amber-600">{overdue.length}</p><p className="text-sm text-slate-500">En retard</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold text-orange-600">{blocking.length}</p><p className="text-sm text-slate-500">Bloquantes réception</p></CardContent></Card>
        </div>

        <ReserveForm
          roomOptions={rooms.map((r) => ({ code: r.code, name: r.name }))}
          lotOptions={mepLots.map((l) => ({ code: l.code, name: l.name }))}
        />

        <Card>
          <CardHeader><CardTitle>Registre des réserves</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-3">N°</th>
                  <th className="py-2 pr-3">Titre</th>
                  <th className="py-2 pr-3">Local</th>
                  <th className="py-2 pr-3">Lot</th>
                  <th className="py-2 pr-3">Gravité</th>
                  <th className="py-2 pr-3">Échéance</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {reserves.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-3 pr-3 font-mono text-xs">{r.number}</td>
                    <td className="py-3 pr-3 font-medium">{r.title}</td>
                    <td className="py-3 pr-3">{r.roomCode ?? "—"}</td>
                    <td className="py-3 pr-3">{r.lotCode}</td>
                    <td className="py-3 pr-3">
                      <Badge variant={r.severity === "critical" ? "danger" : r.severity === "major" ? "warning" : "info"}>
                        {r.severity}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3">{formatDate(r.dueDate)}</td>
                    <td className="py-3 pr-3">
                      <Badge variant="info">{r.status}</Badge>
                      {r.blocksReception && <Badge variant="danger" className="ml-1">Bloque</Badge>}
                    </td>
                    <td className="py-3">
                      <ReserveStatusButton id={r.id} status={r.status} />
                    </td>
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
