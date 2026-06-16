"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/progress-bar";
import type { LotDetailAnalytics } from "@/lib/nassib/lot-boq-analytics";
import type { MepLot, NassibReserve } from "@/types/nassib";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

const LotBoqBreakdownChart = dynamic(
  () => import("./lot-boq-breakdown-chart").then((m) => m.LotBoqBreakdownChart),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded-xl bg-slate-100" />,
  },
);

const fdj = (n: number) => formatCurrency(n, "DJF");

type Props = {
  lot: MepLot;
  analytics: LotDetailAnalytics;
  reserves: NassibReserve[];
  boqSource: string;
  boqDate: string;
};

export function LotDetailDashboard({
  lot,
  analytics,
  reserves,
  boqSource,
  boqDate,
}: Props) {
  const { sections, topLines, planningTasks } = analytics;

  return (
    <div className="space-y-6">
      {/* KPIs contractuels */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[#003F72]/20 bg-gradient-to-br from-[#003F72]/5 to-white">
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Montant BOQ HT</p>
            <p className="mt-1 text-2xl font-bold text-[#003F72]">{fdj(analytics.contractAmountHt)}</p>
            {analytics.recapAmountHt != null && (
              <p className="mt-1 text-xs text-slate-500">
                Récap contrat : {fdj(analytics.recapAmountHt)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lignes BOQ</p>
            <p className="mt-1 text-2xl font-bold text-[#003F72]">{analytics.lineCount}</p>
            <p className="mt-1 text-xs text-slate-500">{sections.length} postes / sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Planning Gantt</p>
            <p className="mt-1 text-2xl font-bold text-[#0891B2]">
              {formatPercent(analytics.planningAvgPct, 0)}
            </p>
            <p className="mt-1 text-xs text-slate-500">{planningTasks.length} tâches liées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Locaux impactés</p>
            <p className="mt-1 text-2xl font-bold text-[#003F72]">{analytics.roomCount}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.roomsByZone.length} zones</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#0891B2]/30">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
          <div>
            <p className="font-medium text-[#003F72]">Source contractuelle BOQ</p>
            <p className="text-slate-600">{boqSource} · {boqDate} · {lot.company}</p>
          </div>
          <Link href="/boq">
            <Button variant="outline" size="sm">Voir le BOQ complet →</Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Graphique répartition BOQ */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base text-[#003F72]">
              Répartition contractuelle — {lot.code}
            </CardTitle>
            <p className="text-sm text-slate-500">Montants HT par poste (BOQ PDF)</p>
          </CardHeader>
          <CardContent>
            <LotBoqBreakdownChart sections={sections} />
          </CardContent>
        </Card>

        {/* Synthèse postes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-[#003F72]">Postes principaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.slice(0, 8).map((s) => (
              <div key={s.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{s.label}</span>
                  <span className="text-slate-600">{s.pctOfLot.toFixed(0)} %</span>
                </div>
                <ProgressBar value={s.pctOfLot} showLabel={false} className="h-2" />
                <p className="mt-0.5 text-xs text-slate-500">
                  {fdj(s.amountHt)} · {s.lineCount} ligne(s)
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top lignes BOQ + Planning */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Principales lignes BOQ ({topLines.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-2">Code</th>
                  <th className="py-2 pr-2">Description</th>
                  <th className="py-2 pr-2">Qté</th>
                  <th className="py-2">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                {topLines.map((line) => (
                  <tr key={line.code} className="border-b border-slate-100">
                    <td className="py-2 pr-2 font-mono text-xs">{line.code}</td>
                    <td className="py-2 pr-2">{line.description}</td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      {line.qty} {line.unit}
                    </td>
                    <td className="py-2 font-medium">{fdj(line.amountHt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tâches planning ({planningTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[420px] space-y-2 overflow-y-auto">
            {planningTasks.length === 0 && (
              <p className="text-sm text-slate-500">Aucune tâche Gantt rattachée à ce lot.</p>
            )}
            {planningTasks.map((t) => (
              <div key={t.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium leading-snug">{t.name}</p>
                  <Badge variant={t.progressPct >= 100 ? "success" : t.progressPct > 0 ? "info" : "default"}>
                    {t.progressPct} %
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(t.plannedStart)} → {formatDate(t.plannedEnd)}
                </p>
                <ProgressBar value={t.progressPct} showLabel={false} className="mt-2 h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Zones + réserves + pilotage lot */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zones concernées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.roomsByZone.map((z) => (
              <div key={z.zoneCode} className="flex justify-between rounded-lg border px-3 py-2 text-sm">
                <span>{z.zoneName}</span>
                <Badge variant="info">{z.count} locaux</Badge>
              </div>
            ))}
            {analytics.roomCount === 0 && (
              <p className="text-sm text-slate-500">Lot hors enveloppe bâtiment (VRD, technique…)</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pilotage chantier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Avancement lot (saisie)</span>
              <span className="font-medium">{lot.progressPct} %</span>
            </div>
            <ProgressBar value={lot.progressPct} />
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="info">DOE : {lot.doeStatus}</Badge>
              <Badge variant="info">PV réception : {lot.receptionPvStatus}</Badge>
              <Badge variant={reserves.length > 0 ? "warning" : "success"}>
                Réserves : {reserves.length}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
              <span>Entreprise : {lot.company}</span>
              <span>Responsable : {lot.responsible}</span>
              <span>Docs validés : {lot.documentsValidated}/{lot.documentsTotal || "—"}</span>
              <span>Essais inter. : {lot.intermediateTestsDone}/{lot.intermediateTestsTotal || "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Réserves ({reserves.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reserves.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune réserve enregistrée pour ce lot.</p>
            ) : (
              reserves.slice(0, 5).map((r) => (
                <div key={r.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{r.number} — {r.title}</p>
                  <Badge variant={r.severity === "critical" ? "danger" : "warning"} className="mt-1">
                    {r.severity}
                  </Badge>
                </div>
              ))
            )}
            <Link href="/reserves">
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Gérer les réserves
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
