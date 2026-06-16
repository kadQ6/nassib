import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { getNassibBundle } from "@/lib/nassib";

export default function DepartementsPage() {
  const { zones, rooms } = getNassibBundle();

  return (
    <>
      <PageHeader
        title="Départements"
        description="Zones fonctionnelles et départements cliniques"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {zones.map((zone) => {
            const zoneRooms = rooms.filter((r) => r.zoneId === zone.id);
            const avgProgress =
              zoneRooms.length > 0
                ? Math.round(
                    zoneRooms.reduce((s, r) => s + r.checklistDone / r.checklistTotal, 0) /
                      zoneRooms.length *
                      100,
                  )
                : 0;
            return (
              <Link key={zone.id} href={`/locaux?zone=${zone.code}`}>
                <Card className="h-full hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base text-[#003F72]">{zone.name}</CardTitle>
                      <Badge variant="default">{zone.code}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-500">{zoneRooms.length} local(aux)</p>
                    <p className="mb-1 text-xs text-slate-500">Checklist moyenne</p>
                    <ProgressBar value={avgProgress} />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
