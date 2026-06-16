import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImplementationPlanImage } from "@/components/room-hub/room-implementation-plan";
import { layoutForRoom } from "@/lib/room-sheet/layout-for-room";
import { resolveImplementationPlanImage } from "@/lib/room-sheet/implementation-plan-images";
import type { RoomHub } from "@/types/room-hub";

function SpecRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-[#003F72]">{value}</span>
    </div>
  );
}

function ImplementationSpecs({ hub, compact }: { hub: RoomHub; compact?: boolean }) {
  const { profile, sheet } = hub;
  return (
    <div className={compact ? "space-y-0" : "space-y-0 rounded-lg border border-slate-100 bg-slate-50/80 p-3"}>
      <SpecRow label="Surface" value={`${sheet.surfaces.floorAreaM2.value} m²`} />
      <SpecRow label="Hauteur" value={`${sheet.surfaces.ceilingHeightM.value} m`} />
      <SpecRow label="Prises 16A" value={sheet.cfo.sockets16A.value} />
      <SpecRow label="RJ45" value={sheet.cfa.rj45.value} />
      {profile.needs.medicalGas && (
        <>
          <SpecRow label="O₂" value={sheet.medicalGas.o2Outlets.value} />
          <SpecRow label="Aspiration" value={sheet.medicalGas.vacuumOutlets.value} />
        </>
      )}
    </div>
  );
}

export function RoomImplementationFiche({
  hub,
  compact = false,
}: {
  hub: RoomHub;
  compact?: boolean;
}) {
  const { room, profile, sheet } = hub;
  const layout = layoutForRoom(room.id, room.code);
  const plan = resolveImplementationPlanImage(room.code);

  return (
    <Card className="border-[#003F72]/15">
      <CardHeader className="pb-2 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#0891B2]">
              Fiche implémentation · Ingénierie K&apos;BIO
            </p>
            <CardTitle className="mt-0.5 text-base text-[#003F72]">
              {room.code} — {profile.functionalRole}
            </CardTitle>
            <p className="text-xs text-slate-500">
              Plan {profile.planReference} · v{sheet.version} · {profile.department}
              {plan ? ` · ${plan.title}` : ""}
            </p>
          </div>
          <Link
            href={`/locaux/${room.id}?tab=fiche`}
            className="shrink-0 text-xs font-medium text-[#0891B2] hover:underline"
          >
            Fiche complète →
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pb-4 pt-0">
        {plan ? (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(140px,0.45fr)] sm:items-start">
            <ImplementationPlanImage
              roomCode={room.code}
              compact={compact}
              className="min-h-[140px] sm:min-h-[160px]"
            />
            <ImplementationSpecs hub={hub} compact={compact} />
          </div>
        ) : (
          <div className="space-y-3">
            {layout.length > 0 ? (
              <p className="text-sm text-slate-500">
                Plan visuel de référence non disponible pour ce local.
              </p>
            ) : (
              <p className="text-sm text-slate-500">Aucun schéma implantation enregistré.</p>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-0 sm:max-w-md">
              <ImplementationSpecs hub={hub} compact />
            </div>
          </div>
        )}

        {!compact && plan && (
          <div className="mt-4 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Sol</p>
              <p className="font-medium text-[#003F72]">{sheet.finishes.floor.material}</p>
              <p className="text-xs text-slate-500">{sheet.finishes.floor.color}</p>
            </div>
            <div className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Murs</p>
              <p className="font-medium text-[#003F72]">{sheet.finishes.walls.material}</p>
              <p className="text-xs text-slate-500">{sheet.finishes.walls.color}</p>
            </div>
            <div className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Plafond</p>
              <p className="font-medium text-[#003F72]">{sheet.finishes.ceiling.material}</p>
              <p className="text-xs text-slate-500">{sheet.finishes.ceiling.color}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RoomLocalHeader({ hub }: { hub: RoomHub }) {
  const { room, profile, metrics } = hub;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/locaux/${room.id}`}
          className="font-semibold text-[#003F72] hover:text-[#0891B2]"
        >
          {room.code}
        </Link>
        <span className="text-sm text-slate-600">{profile.functionalRole}</span>
        <Badge variant="info">{room.level}</Badge>
        <Badge variant="default">{sheetBadge(profile.receptionStatus)}</Badge>
      </div>
      <div className="flex flex-wrap gap-1 text-xs">
        {metrics.openReserves > 0 && (
          <Badge variant="danger">{metrics.openReserves} réserve(s)</Badge>
        )}
        {metrics.tasksLate > 0 && (
          <Badge variant="warning">{metrics.tasksLate} retard</Badge>
        )}
        <span className="text-slate-400">
          {hub.links.inventory.length} lignes inventaire · {metrics.checklistPct}% checklist
        </span>
      </div>
    </div>
  );
}

function sheetBadge(status: string) {
  return status.replace("_", " ");
}
