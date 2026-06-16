"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DISPLAY_GROUP_DESCRIPTIONS,
  DISPLAY_GROUP_LABELS,
} from "@/lib/nassib/inventory-display";
import type { InventoryBilan, BilanGapSeverity } from "@/lib/nassib/inventory-bilan";

const SEV_VARIANT: Record<BilanGapSeverity, "danger" | "warning" | "info"> = {
  critical: "danger",
  warning: "warning",
  info: "info",
};

export function InventoryBilanPanel({
  bilan,
  compact = false,
}: {
  bilan: InventoryBilan;
  compact?: boolean;
}) {
  const { totals, gaps, clinicalBreakdown, officeBreakdown } = bilan;
  const critical = gaps.filter((g) => g.severity === "critical");
  const warnings = gaps.filter((g) => g.severity === "warning");
  const infos = gaps.filter((g) => g.severity === "info");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-[#003F72]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">
              {DISPLAY_GROUP_LABELS.clinical_medical}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {DISPLAY_GROUP_DESCRIPTIONS.clinical_medical}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#003F72]">
              {totals.clinical_medical.total}
              <span className="ml-2 text-sm font-normal text-slate-500">lignes</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
              <span>
                DM biomédicaux : <strong>{totals.clinical_medical.biomedical}</strong>
              </span>
              <span>·</span>
              <span>
                Mobilier médical :{" "}
                <strong>{totals.clinical_medical.medicalFurniture}</strong>
              </span>
            </div>
            {!compact && clinicalBreakdown.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {clinicalBreakdown.map((row) => (
                  <li key={row.label} className="flex justify-between">
                    <span>{row.label}</span>
                    <span className="font-medium">{row.qty}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#0891B2]/25">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">
              {DISPLAY_GROUP_LABELS.office}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {DISPLAY_GROUP_DESCRIPTIONS.office}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#0891B2]">
              {totals.office.total}
              <span className="ml-2 text-sm font-normal text-slate-500">lignes</span>
            </p>
            {!compact && officeBreakdown.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {officeBreakdown.map((row) => (
                  <li key={row.type} className="flex justify-between">
                    <span>{row.type}</span>
                    <span className="font-medium">{row.qty}</span>
                  </li>
                ))}
              </ul>
            )}
            {totals.office.total > 0 &&
              !officeBreakdown.some((r) => r.type === "Imprimantes") && (
                <p className="mt-3 text-xs text-amber-700">
                  Aucune imprimante dans le plan implantation — à prévoir pour les
                  bureaux.
                </p>
              )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bilan prévu / manquant</CardTitle>
          <p className="text-sm text-slate-500">
            {bilan.roomsFullyPlanned} locaux couverts · {bilan.roomsWithGaps} avec
            écart · {totals.all} lignes inventaire · {bilan.toDefineCount} à définir
            · {bilan.pricedCount} avec PU saisi
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {gaps.length === 0 ? (
            <p className="text-sm text-emerald-700">
              Tous les locaux du plan sont couverts par l&apos;inventaire implantation.
            </p>
          ) : (
            <>
              {critical.length > 0 && (
                <GapSection title="Critique" items={critical} />
              )}
              {warnings.length > 0 && (
                <GapSection title="À compléter" items={warnings} />
              )}
              {!compact && infos.length > 0 && (
                <GapSection title="Recommandations" items={infos.slice(0, 12)} />
              )}
              {!compact && infos.length > 12 && (
                <p className="text-xs text-slate-500">
                  + {infos.length - 12} recommandation(s) (imprimantes, postes IT…) —
                  voir détail complet.
                </p>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/equipements/ecarts-boq">
              <Button variant="outline" size="sm">Écarts BOQ / plan →</Button>
            </Link>
            {!compact && (
              <Link href="/equipements/recap">
                <Button variant="outline" size="sm">Récapitulatif complet →</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GapSection({
  title,
  items,
}: {
  title: string;
  items: InventoryBilan["gaps"];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title} ({items.length})
      </p>
      <ul className="space-y-2">
        {items.map((g) => (
          <li
            key={`${g.roomCode}-${g.label}`}
            className="flex flex-wrap items-start justify-between gap-2 rounded-lg border bg-white p-3 text-sm"
          >
            <div>
              <Link
                href={`/equipements/recap?room=${g.roomCode}`}
                className="font-medium text-[#0891B2] hover:underline"
              >
                {g.roomCode}
              </Link>
              <span className="text-slate-500"> — {g.roomName}</span>
              <p className="mt-1 text-slate-600">{g.label}</p>
            </div>
            <Badge variant={SEV_VARIANT[g.severity]}>
              {DISPLAY_GROUP_LABELS[g.group]}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
