import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { getNassibBundle } from "@/lib/nassib";

const RECEPTION_ORDER = [
  "not_started",
  "in_progress",
  "opr_pending",
  "provisional",
  "received",
  "operational",
] as const;

const RECEPTION_LABELS: Record<string, string> = {
  not_started: "Non démarrée",
  in_progress: "Travaux en cours",
  opr_pending: "OPR en attente",
  provisional: "Réception provisoire",
  received: "Réceptionnée",
  operational: "En exploitation",
};

export default function ReceptionPage() {
  const { roomRegistry } = getNassibBundle();

  const grouped = RECEPTION_ORDER.map((status) => ({
    status,
    rooms: roomRegistry.rooms.filter((h) => h.profile.receptionStatus === status),
  }));

  const blocking = roomRegistry.rooms.filter((h) =>
    h.links.reserves.some(
      (r) => r.blocksReception && !["closed", "levée"].includes(r.status),
    ),
  );

  return (
    <>
      <PageHeader
        title="Réception des locaux"
        description="Suivi OPR, réception provisoire et blocages par local"
      />
      <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
        {blocking.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader><CardTitle className="text-red-800">{blocking.length} local(aux) bloqué(s) pour réception</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {blocking.map((h) => (
                <Link key={h.room.id} href={`/locaux/${h.room.id}`} className="block rounded border border-red-200 bg-white p-3 text-sm hover:bg-red-50">
                  <span className="font-medium">{h.room.code}</span> — {h.metrics.openReserves} réserve(s) bloquante(s)
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {grouped.map(({ status, rooms }) =>
          rooms.length === 0 ? null : (
            <section key={status}>
              <h2 className="mb-3 text-lg font-semibold text-[#003F72]">
                {RECEPTION_LABELS[status]} ({rooms.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {rooms.map((h) => (
                  <Link key={h.room.id} href={`/locaux/${h.room.id}`}>
                    <Card className="h-full hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{h.room.code} — {h.profile.functionalRole}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <ProgressBar value={h.metrics.checklistPct} />
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="info">{h.metrics.testsPending} essai(s)</Badge>
                          <Badge variant={h.metrics.openReserves > 0 ? "warning" : "success"}>
                            {h.metrics.openReserves} réserve(s)
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ),
        )}
      </main>
    </>
  );
}
