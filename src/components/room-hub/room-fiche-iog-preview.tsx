"use client";

import Link from "next/link";
import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import { buildNassibFichePrintData } from "@/lib/room-sheet/nassib-fiche-print";
import type { RoomHub } from "@/types/room-hub";
import { NassibFichePrintView } from "@/components/room-hub/nassib-fiche-print-view";

export function RoomFicheIogPreview({ hub }: { hub: RoomHub }) {
  const planDef =
    PLAN_ROOM_CATALOG.find((d) => d.id === hub.room.id) ??
    PLAN_ROOM_CATALOG.find((d) => d.code === hub.room.code);

  const data = buildNassibFichePrintData(
    hub.sheet,
    hub.profile,
    hub.room.name,
    hub.room.code,
    hub.room.level,
    planDef?.layout ?? [],
  );

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#003F72]/20 bg-white px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-[#003F72]">Fiche local IOG — aperçu</h2>
          <p className="text-xs text-slate-500">
            Format K&apos;BIO / Fondation IOG · données préremplies depuis la fiche technique
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/locaux/${hub.room.id}/fiche-print`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#003F72] px-4 text-sm font-medium text-white hover:bg-[#0891B2]"
          >
            Ouvrir plein écran / imprimer
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-2">
        <NassibFichePrintView data={data} embedded />
      </div>
    </section>
  );
}
