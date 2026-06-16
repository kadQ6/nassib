"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { updateLogisticsAction } from "@/app/actions/logistics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LogisticsKpis } from "@/lib/nassib/build-logistics-from-project";
import {
  INTERNAL_FLOW_STEPS,
  LOGISTICS_CATEGORY_LABELS,
  LOGISTICS_STATUS_LABELS,
  flowStepLabel,
} from "@/lib/nassib/logistics-internal";
import type { DerivedWorkPackage, ProgrammeDerivationSummary } from "@/types/programme";
import type { NassibLogisticsLine } from "@/types/nassib";

const CRIT_VARIANT = {
  normal: "default",
  high: "warning",
  critical: "danger",
} as const;

const STATUS_KEYS = Object.keys(LOGISTICS_STATUS_LABELS);

const STORAGE_ZONES = [
  "STK-CENTRAL",
  "STK-URG",
  "STK-BLOC",
  "STK-NEO",
  "PHA-01",
  "TEC-01",
];

export function LogisticsWorkspace({
  lines: initialLines,
  kpis,
  programmeSummary,
  logisticsPackages,
  roomCodeToId,
  procurementTotal,
  procurementPendingValidation,
}: {
  lines: NassibLogisticsLine[];
  kpis: LogisticsKpis;
  programmeSummary: ProgrammeDerivationSummary;
  logisticsPackages: DerivedWorkPackage[];
  roomCodeToId: Record<string, string>;
  procurementTotal: number;
  procurementPendingValidation: number;
}) {
  const [lines, setLines] = useState(initialLines);
  const isEmpty = lines.length === 0;
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [flowFilter, setFlowFilter] = useState<number | "all">("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lines.filter((l) => {
      if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
      if (zoneFilter !== "all" && l.storageZone !== zoneFilter) return false;
      if (flowFilter !== "all" && l.flowStep !== flowFilter) return false;
      if (!q) return true;
      return (
        l.reference.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.targetRoomCode.toLowerCase().includes(q) ||
        l.storageZone.toLowerCase().includes(q)
      );
    });
  }, [lines, search, categoryFilter, zoneFilter, flowFilter]);

  function patchLine(id: string, patch: Partial<NassibLogisticsLine>) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
    startTransition(async () => {
      await updateLogisticsAction(id, patch);
    });
  }

  const maxFlowCount = Math.max(...kpis.byFlow.map((b) => b.count), 1);

  return (
    <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap gap-2">
        <Link href="/approvisionnements">
          <Button variant="outline" size="sm">
            Approvisionnements & ODD →
          </Button>
        </Link>
        {!isEmpty && (
          <>
            <Link href="/programme/derivations">
              <Button variant="outline" size="sm">
                Work packages logistique ({programmeSummary.logistics}) →
              </Button>
            </Link>
            <Link href="/equipements">
              <Button variant="outline" size="sm">
                Inventaire DM & mobilier →
              </Button>
            </Link>
            <Link href="/locaux">
              <Button variant="outline" size="sm">
                Locaux & réception service →
              </Button>
            </Link>
            <Link href="/installation-dm">
              <Button variant="outline" size="sm">
                Installation DM →
              </Button>
            </Link>
          </>
        )}
      </div>

      {isEmpty ? (
        <Card className="border-[#0891B2]/30 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-[#003F72]">
              Aucun mouvement logistique pour le moment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              La logistique interne démarre vide. Les lignes apparaissent
              automatiquement lorsqu&apos;une commande est{" "}
              <strong className="text-slate-800">validée côté approvisionnements</strong>{" "}
              — dédouanement ODD validé (étape 11 ou statut « Dédouané »).
            </p>
            <p>
              {procurementPendingValidation} commande(s) sur {procurementTotal}{" "}
              encore en cours de traitement import (ODD). Tant que le
              dédouanement n&apos;est pas validé, rien n&apos;est affiché ici.
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-slate-600">
              <li>Suivre la commande dans Approvisionnements</li>
              <li>Valider le dédouanement Djibouti (ODD étape 11+)</li>
              <li>La ligne bascule ici en réception quai chantier</li>
            </ol>
            <Link href="/approvisionnements">
              <Button className="bg-[#003F72] hover:bg-[#003F72]/90">
                Aller aux approvisionnements →
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {[
          {
            label: "Mouvements internes",
            value: kpis.total,
            sub: `${kpis.zones} zones de stock`,
          },
          {
            label: "Stock / transfert",
            value: kpis.inStockOrTransfer,
            sub: "Étapes 4 à 6",
          },
          {
            label: "En place",
            value: kpis.inPlace,
            sub: "Installation terminée",
          },
          {
            label: "Mobilier médical",
            value: kpis.medicalFurniture,
            sub: `${kpis.officeFurniture} bureau`,
          },
          {
            label: "Critiques",
            value: kpis.critical,
            sub: `${kpis.clinicalDm} DM · ${kpis.zoneSupply} zones`,
          },
        ].map((k) => (
          <Card key={k.label} className="border-[#003F72]/15">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-[#003F72]">{k.value}</p>
              <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[#0891B2]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#003F72]">
              Circuit logistique interne
            </CardTitle>
            <p className="text-sm text-slate-500">
              Après dédouanement — réception chantier jusqu&apos;à mise en place
              par local
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {INTERNAL_FLOW_STEPS.map((step, i) => {
                const stepNum = i + 1;
                const count = kpis.byFlow[i]?.count ?? 0;
                const active = flowFilter === stepNum;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() =>
                      setFlowFilter(active ? "all" : stepNum)
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
                    <div className="mt-1 h-1.5 rounded bg-slate-100">
                      <div
                        className="h-full rounded bg-[#0891B2]"
                        style={{ width: `${(count / maxFlowCount) * 100}%` }}
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">
              Zones de stock & circuits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-800">STK-CENTRAL</p>
              <p>Magasin central — réception après quai, étiquetage GMAO</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">STK-URG / STK-BLOC / STK-NEO</p>
              <p>Stocks de proximité par pôle clinique</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">PHA-01</p>
              <p>Pharmacie — consommables et DM stables</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">TEC-01</p>
              <p>Locaux techniques — fluides, centrale O₂, équipements lourds</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {logisticsPackages.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">
              Livraisons site (programme dérivé)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {logisticsPackages.slice(0, 6).map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{pkg.title}</p>
                  <p className="text-xs text-slate-500">
                    {pkg.sourceRoomCode} · {pkg.plannedStart} → {pkg.plannedEnd}
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-[#003F72]">Mouvements internes</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {filtered.length} / {lines.length} — commandes validées (ODD
              dédouané) en cours de distribution interne
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Rechercher réf., local, zone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes catégories</option>
              {Object.entries(LOGISTICS_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="all">Toutes zones</option>
              {STORAGE_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            {flowFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFlowFilter("all")}
              >
                Étape {String(flowFilter).padStart(2, "0")} ×
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500">
                <th className="pb-2 pr-3">Réf.</th>
                <th className="pb-2 pr-3">Désignation</th>
                <th className="pb-2 pr-3">Catégorie</th>
                <th className="pb-2 pr-3">Source</th>
                <th className="pb-2 pr-3">Zone stock</th>
                <th className="pb-2 pr-3">Local cible</th>
                <th className="pb-2 pr-3">Statut</th>
                <th className="pb-2 pr-3">Étape</th>
                <th className="pb-2 pr-3">Transfert prévu</th>
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
                    <p className="text-xs text-slate-400">×{line.qty}</p>
                  </td>
                  <td className="py-2 pr-3 text-xs">
                    {LOGISTICS_CATEGORY_LABELS[line.category]}
                  </td>
                  <td className="py-2 pr-3">
                    {line.sourceType === "equipment" ? (
                      <Link
                        href={`/equipements/recap?room=${line.targetRoomCode}`}
                        className="text-[#0891B2] hover:underline"
                      >
                        Inventaire
                      </Link>
                    ) : (
                      <Link
                        href="/approvisionnements"
                        className="text-[#0891B2] hover:underline"
                      >
                        Appro.
                      </Link>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      className="rounded border border-slate-200 px-1 py-0.5 text-xs"
                      value={line.storageZone}
                      disabled={pending}
                      onChange={(e) =>
                        patchLine(line.id, { storageZone: e.target.value })
                      }
                    >
                      {STORAGE_ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <Link
                      href={`/locaux/${roomCodeToId[line.targetRoomCode] ?? line.targetRoomCode.toLowerCase()}`}
                      className="font-mono text-xs text-[#0891B2] hover:underline"
                    >
                      {line.targetRoomCode}
                    </Link>
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      className="max-w-[150px] rounded border border-slate-200 px-1 py-0.5 text-xs"
                      value={line.status}
                      disabled={pending}
                      onChange={(e) =>
                        patchLine(line.id, { status: e.target.value })
                      }
                    >
                      {STATUS_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {LOGISTICS_STATUS_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className="font-mono text-xs text-[#0891B2]"
                      title={flowStepLabel(line.flowStep)}
                    >
                      {String(line.flowStep).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-xs">{line.plannedTransferDate}</td>
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
              Aucun mouvement pour ce filtre.
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        Les mouvements sont créés automatiquement depuis{" "}
        <Link href="/approvisionnements" className="text-[#0891B2] hover:underline">
          Approvisionnements
        </Link>{" "}
        dès qu&apos;une commande est validée (dédouanement ODD).
      </p>
        </>
      )}
    </main>
  );
}
