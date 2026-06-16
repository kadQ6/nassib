import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNassibBundle } from "@/lib/nassib";
import { NASSIB_SITE_LEVELS } from "@/lib/nassib/constants";

const LEVEL_LABELS: Record<string, string> = {
  RDC: "Rez-de-chaussée",
  "R+1": "Étage R+1",
  exterieur: "Extérieur / VRD",
};

export default function BatimentsPage() {
  const { rooms } = getNassibBundle();
  const levels = NASSIB_SITE_LEVELS;

  return (
    <>
      <PageHeader
        title="Bâtiments & niveaux"
        description="Structure verticale du bâtiment — pilotage par niveau"
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {levels.map((level) => {
            const levelRooms = rooms.filter((r) => r.level === level);
            return (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="text-[#003F72]">{LEVEL_LABELS[level]}</CardTitle>
                  <p className="text-sm text-slate-500">{level}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="brand">{levelRooms.length} locaux</Badge>
                  <Link
                    href={`/locaux?niveau=${level}`}
                    className="block text-sm font-medium text-[#0891B2] hover:underline"
                  >
                    Voir les locaux →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
