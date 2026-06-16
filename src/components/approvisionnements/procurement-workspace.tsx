"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { updateProcurementAction } from "@/app/actions/procurement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProcurementKpis } from "@/lib/nassib/build-procurement-from-project";
import {
  ODD_STEPS,
  PROCUREMENT_STATUS_LABELS,
  oddStepLabel,
} from "@/lib/nassib/procurement-odd";
import type { DerivedWorkPackage, ProgrammeDerivationSummary } from "@/types/programme";
import type { NassibProcurement } from "@/types/nassib";

const CRIT_VARIANT = {
  normal: "default",
  high: "warning",
  critical: "danger",
} as const;

const STATUS_KEYS = Object.keys(PROCUREMENT_STATUS_LABELS);

function formatAmount(n: number | null): string {
  if (n == null || n === 0) return "—";
  return new Intl.NumberFormat("fr-DJ", {
    style: "currency",
    currency: "DJF",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProcurementWorkspace({
  lines: initialLines,
  kpis,
  programmeSummary,
  procurementPackages,
  roomCodeToId,
}: {
  lines: NassibProcurement[];
  kpis: ProcurementKpis;
  programmeSummary: ProgrammeDerivationSummary;
  procurementPackages: DerivedWorkPackage[];
  roomCodeToId: Record<string, string>;
}) {
  const [lines, setLines] = useState(initialLines);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "equipment" | "boq">("all");
  const [oddFilter, setOddFilter] = useState<number | "all">("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lines.filter((l) => {
      if (sourceFilter !== "all" && l.sourceType !== sourceFilter) return false;
      if (oddFilter !== "all" && l.oddStep !== oddFilter) return false;
      if (!q) return true;
      return (
        l.reference.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.proposedRef.toLowerCase().includes(q) ||
        (l.roomCode?.toLowerCase().includes(q) ?? false) ||
        (l.boqCode?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [lines, search, sourceFilter, oddFilter]);

  function patchLine(id: string, patch: Partial<NassibProcurement>) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
    startTransition(async () => {
      await updateProcurementAction(id, patch);
    });
  }

  const maxOddCount = Math.max(...kpis.byOdd.map((b) => b.count), 1);

  return (
    <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap gap-2">
        <Link href="/programme">
          <Button variant="outline" size="sm">
            Programme fonctionnel →
          </Button>
        </Link>
        <Link href="/programme/derivations">
          <Button variant="outline" size="sm">
            Work packages ({programmeSummary.procurements} commandes) →
          </Button>
        </Link>
        <Link href="/equipements">
          <Button variant="outline" size="sm">
            Inventaire DM & mobilier →
          </Button>
        </Link>
        <Link href="/equipements/ecarts-boq">
          <Button variant="outline" size="sm">
            Écarts BOQ / plan K&apos;BIO →
          </Button>
        </Link>
        <Link href="/boq">
          <Button variant="outline" size="sm">
            BOQ contractuel →
          </Button>
        </Link>
        <Link href="/logistique">
          <Button variant="outline" size="sm">
            Logistique interne →
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          { label: "Lignes d'achat", value: kpis.total, sub: `${kpis.fromEquipment} DM · ${kpis.fromBoq} BOQ` },
          { label: "À lancer (ODD 1–3)", value: kpis.needAction, sub: "Besoin / validation / BOQ" },
          { label: "Chaîne import", value: kpis.inImport, sub: "Fabrication → ODD" },
          { label: "Réceptionnées", value: kpis.received, sub: "Étape 13" },
          { label: "Critiques", value: kpis.critical, sub: "Bloc, stérilisation…" },
          {
            label: "Montant BOQ lié",
            value: formatAmount(kpis.boqLinkedAmount),
            sub: "Uniquement lignes chiffrées",
            isText: true,
          },
        ].map((k) => (
          <Card key={k.label} className="border-[#003F72]/15">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p
                className={`mt-1 font-bold text-[#003F72] ${k.isText ? "text-lg" : "text-2xl"}`}
              >
                {k.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#0891B2]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#003F72]">
            Pipeline import Djibouti (ODD)
          </CardTitle>
          <p className="text-sm text-slate-500">
            Cliquez une étape pour filtrer le tableau — aligné sur le programme
            d&apos;approvisionnement Polyclinique Nassib
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
            {ODD_STEPS.map((step, i) => {
              const stepNum = i + 1;
              const count = kpis.byOdd[i]?.count ?? 0;
              const active = oddFilter === stepNum;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() =>
                    setOddFilter(active ? "all" : stepNum)
                  }
                  className={`rounded-md border p-2 text-left text-xs transition-colors ${
                    active
                      ? "border-[#0891B2] bg-[#0891B2]/10"
                      : "border-slate-200 hover:border-[#0891B2]/50"
                  }`}
                >
                  <span className="font-mono text-[#0891B2]">
                    {String(stepNum).padStart(2, "0")}
                  </span>
                  <div
                    className="mt-1 h-1.5 rounded bg-slate-100"
                    title={`${count} ligne(s)`}
                  >
                    <div
                      className="h-full rounded bg-[#0891B2]"
                      style={{ width: `${(count / maxOddCount) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 line-clamp-2 text-slate-600">{step}</p>
                  <p className="mt-0.5 font-semibold text-[#003F72]">{count}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {procurementPackages.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">
              Work packages commandes (programme dérivé)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {procurementPackages.slice(0, 6).map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{pkg.title}</p>
                  <p className="text-xs text-slate-500">
                    {pkg.lotCode}
                    {pkg.sourceRoomCode && ` · ${pkg.sourceRoomCode}`}
                  </p>
                </div>
                <Link
                  href={pkg.links.href}
                  className="text-xs font-medium text-[#0891B2] hover:underline"
                >
                  {pkg.links.module} →
                </Link>
              </div>
            ))}
            {procurementPackages.length > 6 && (
              <Link
                href="/programme/derivations"
                className="text-sm text-[#0891B2] hover:underline"
              >
                + {procurementPackages.length - 6} packages…
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-[#003F72]">Lignes d&apos;achat</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {filtered.length} / {lines.length} — sources inventaire plan K&apos;BIO
              et ancres BOQ import (fluides médicaux)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Rechercher réf., local, BOQ…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(e.target.value as typeof sourceFilter)
              }
            >
              <option value="all">Toutes sources</option>
              <option value="equipment">Inventaire DM</option>
              <option value="boq">Ligne BOQ</option>
            </select>
            {oddFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOddFilter("all")}
              >
                Filtre ODD {oddFilter} ×
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500">
                <th className="pb-2 pr-3">Réf.</th>
                <th className="pb-2 pr-3">Désignation</th>
                <th className="pb-2 pr-3">Source</th>
                <th className="pb-2 pr-3">Local</th>
                <th className="pb-2 pr-3">Réf. proposée</th>
                <th className="pb-2 pr-3">Valid. tech.</th>
                <th className="pb-2 pr-3">Statut ODD</th>
                <th className="pb-2 pr-3">Étape</th>
                <th className="pb-2 pr-3">Livraison</th>
                <th className="pb-2 pr-3 text-right">Montant BOQ</th>
                <th className="pb-2">Crit.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((line) => (
                <tr
                  key={line.id}
                  className="border-b border-slate-50 hover:bg-slate-50/80"
                >
                  <td className="py-2 pr-3 font-mono text-xs">{line.reference}</td>
                  <td className="max-w-[200px] py-2 pr-3">
                    <p className="line-clamp-2">{line.description}</p>
                    <p className="text-xs text-slate-400">{line.lotCode}</p>
                  </td>
                  <td className="py-2 pr-3">
                    {line.sourceType === "equipment" ? (
                      <Link
                        href={`/equipements/recap${line.roomCode ? `?room=${line.roomCode}` : ""}`}
                        className="text-[#0891B2] hover:underline"
                      >
                        DM plan
                      </Link>
                    ) : (
                      <Link
                        href={`/boq${line.boqCode ? `?q=${line.boqCode}` : ""}`}
                        className="text-[#0891B2] hover:underline"
                      >
                        {line.boqCode ?? "BOQ"}
                      </Link>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    {line.roomCode ? (
                      <Link
                        href={`/locaux/${roomCodeToId[line.roomCode] ?? line.roomCode.toLowerCase()}`}
                        className="font-mono text-xs text-[#0891B2] hover:underline"
                      >
                        {line.roomCode}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-[160px] py-2 pr-3">
                    <input
                      className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-xs hover:border-slate-200 focus:border-[#0891B2] focus:outline-none"
                      defaultValue={line.proposedRef}
                      disabled={pending}
                      onBlur={(e) => {
                        if (e.target.value !== line.proposedRef) {
                          patchLine(line.id, { proposedRef: e.target.value });
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={line.techValidated}
                      disabled={pending}
                      onChange={(e) =>
                        patchLine(line.id, { techValidated: e.target.checked })
                      }
                      aria-label="Validation technique MOE"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      className="max-w-[140px] rounded border border-slate-200 px-1 py-0.5 text-xs"
                      value={line.status}
                      disabled={pending}
                      onChange={(e) =>
                        patchLine(line.id, { status: e.target.value })
                      }
                    >
                      {STATUS_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {PROCUREMENT_STATUS_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className="font-mono text-xs text-[#0891B2]"
                      title={oddStepLabel(line.oddStep)}
                    >
                      {String(line.oddStep).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-xs">{line.expectedDate}</td>
                  <td className="py-2 pr-3 text-right text-xs">
                    {formatAmount(line.boqAmountHt)}
                  </td>
                  <td className="py-2">
                    <Badge variant={CRIT_VARIANT[line.criticality]}>
                      {line.criticality}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              Aucune ligne pour ce filtre.
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        Les montants affichés proviennent du BOQ contractuel ou des prix unitaires
        saisis sur l&apos;inventaire — aucun montant inventé. Une fois le
        dédouanement validé (ODD étape 11+), la ligne bascule en{" "}
        <Link href="/logistique" className="text-[#0891B2] hover:underline">
          logistique interne
        </Link>
        . Distinction : cette page couvre la chaîne import ; la logistique prend
        le relais après validation commande.
      </p>
    </main>
  );
}
