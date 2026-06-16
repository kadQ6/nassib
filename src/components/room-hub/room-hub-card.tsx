import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import type { RoomHub } from "@/types/room-hub";

const RECEPTION_VARIANT: Record<string, "success" | "warning" | "info" | "default"> = {
  operational: "success",
  received: "success",
  provisional: "info",
  opr_pending: "warning",
  in_progress: "warning",
  not_started: "default",
};

export function RoomHubCard({ hub }: { hub: RoomHub }) {
  const { room, profile, metrics } = hub;

  return (
    <Link href={`/locaux/${room.id}`}>
      <Card className="h-full border-l-4 border-l-[#0891B2] transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">{room.code}</CardTitle>
              <p className="text-sm font-normal text-slate-600">{profile.functionalRole}</p>
            </div>
            <Badge variant={RECEPTION_VARIANT[profile.receptionStatus] ?? "default"}>
              {profile.receptionStatus.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {profile.department} · {room.level} · {hub.sheet.surfaces.floorAreaM2.value} m²
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProgressBar value={metrics.technicalProgress} showLabel={false} />
          <div className="flex flex-wrap gap-1">
            {metrics.openReserves > 0 && (
              <Badge variant="danger">{metrics.openReserves} réserve(s)</Badge>
            )}
            {metrics.tasksLate > 0 && (
              <Badge variant="warning">{metrics.tasksLate} tâche(s) retard</Badge>
            )}
            {metrics.blockedEquipment > 0 && (
              <Badge variant="warning">{metrics.blockedEquipment} équip. bloqué(s)</Badge>
            )}
            {metrics.openReserves === 0 && metrics.tasksLate === 0 && (
              <Badge variant="success">Pilotage OK</Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {metrics.tasksTotal} tâches · {hub.links.equipmentBiomedical.length} DM ·
            Checklist {metrics.checklistPct}%
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
