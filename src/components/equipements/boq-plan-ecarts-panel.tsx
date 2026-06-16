"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  BoqPlanMetric,
  BoqPlanReconciliation,
  ReconciliationSeverity,
} from "@/lib/nassib/boq-plan-reconciliation";

const SEV_LABEL: Record<ReconciliationSeverity, string> = {
  ok: "Conforme",
  info: "Écart mineur",
  warning: "Écart",
  critical: "Écart majeur",
};

const SEV_VARIANT: Record<
  ReconciliationSeverity,
  "success" | "info" | "warning" | "danger"
> = {
  ok: "success",
  info: "info",
  warning: "warning",
  critical: "danger",
};

const CAT_LABEL = {
  fluides: "Fluides médicaux",
  plomberie: "Plomberie / sanitaires",
  cfo: "CFO — prises courant fort",
  cfa: "CFA / VDI",
};

function MetricRow({ m }: { m: BoqPlanMetric }) {
  return (
    <tr className={m.status === "ecart" ? "bg-amber-50/60" : undefined}>
      <td className="p-3 align-top">
        <p className="font-medium text-[#003F72]">{m.label}</p>
        <p className="text-xs text-slate-500">
          BOQ {m.boqCode} · {m.boqDescription}
        </p>
      </td>
      <td className="p-3 text-center align-top font-mono text-sm">{m.boqQty}</td>
      <td className="p-3 text-center align-top font-mono text-sm font-semibold text-[#0891B2]">
        {m.planQty}
      </td>
      <td className="p-3 text-center align-top font-mono text-sm">
        <span
          className={
            m.delta === 0
              ? "text-emerald-700"
              : m.delta > 0
                ? "text-amber-700"
                : "text-red-700"
          }
        >
          {m.delta > 0 ? "+" : ""}
          {m.delta}
        </span>
      </td>
      <td className="p-3 align-top">
        <Badge variant={SEV_VARIANT[m.severity]}>{SEV_LABEL[m.severity]}</Badge>
      </td>
      <td className="p-3 align-top text-xs text-slate-600">
        <p>{m.planSource}</p>
        {m.note && <p className="mt-1 text-slate-500">{m.note}</p>}
      </td>
    </tr>
  );
}

export function BoqPlanEcartsPanel({
  reconciliation,
}: {
  reconciliation: BoqPlanReconciliation;
}) {
  const { metrics, meta, roomGasRows, alignedCount, gapCount } = reconciliation;
  const byCategory = (["fluides", "plomberie", "cfo", "cfa"] as const).map(
    (cat) => ({
      cat,
      items: metrics.filter((m) => m.category === cat),
    }),
  );

  return (
    <div className="space-y-6">
      <Card className="border-[#003F72]/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sources comparées</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="font-medium text-slate-800">BOQ contractuel</p>
            <p className="text-slate-600">{meta.boqSource}</p>
            <p className="text-xs text-slate-500">Validé {meta.boqDate}</p>
          </div>
          <div>
            <p className="font-medium text-slate-800">Plan final K&apos;BIO</p>
            <p className="text-slate-600">{meta.planSource}</p>
            <p className="text-xs text-slate-500">Analyse {meta.comparedAt}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Badge variant="success">{alignedCount} indicateur(s) conforme(s)</Badge>
        <Badge variant={gapCount > 0 ? "warning" : "success"}>
          {gapCount} écart(s) constaté(s)
        </Badge>
        <Link href="/boq" className="text-sm text-[#0891B2] hover:underline">
          Voir BOQ détaillé →
        </Link>
        <Link href="/besoins-techniques" className="text-sm text-[#0891B2] hover:underline">
          Besoins techniques par local →
        </Link>
      </div>

      {byCategory.map(({ cat, items }) =>
        items.length === 0 ? null : (
          <Card key={cat}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{CAT_LABEL[cat]}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[880px] text-sm">
                <thead className="bg-[#003F72] text-left text-white">
                  <tr>
                    <th className="p-3 font-medium">Indicateur</th>
                    <th className="p-3 text-center font-medium">BOQ</th>
                    <th className="p-3 text-center font-medium">Plan K&apos;BIO</th>
                    <th className="p-3 text-center font-medium">Δ</th>
                    <th className="p-3 font-medium">Statut</th>
                    <th className="p-3 font-medium">Méthode plan</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => (
                    <MetricRow key={m.id} m={m} />
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ),
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Détail fluides médicaux par local
          </CardTitle>
          <p className="text-sm text-slate-500">
            Ventilation plan implantation — prises O₂ / aspiration / air
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-[#F8FAFC] text-left">
              <tr>
                <th className="p-2 font-medium">Local</th>
                <th className="p-2 text-center font-medium">O₂</th>
                <th className="p-2 text-center font-medium">Aspiration</th>
                <th className="p-2 text-center font-medium">Air médical</th>
              </tr>
            </thead>
            <tbody>
              {roomGasRows.map((r, i) => (
                <tr key={r.roomCode} className={i % 2 ? "bg-[#F8FAFC]" : "bg-white"}>
                  <td className="p-2">
                    <Link
                      href={`/equipements/recap?room=${r.roomCode}`}
                      className="font-medium text-[#0891B2] hover:underline"
                    >
                      {r.roomCode}
                    </Link>
                    <span className="text-slate-500"> — {r.roomName}</span>
                  </td>
                  <td className="p-2 text-center">{r.o2}</td>
                  <td className="p-2 text-center">{r.vacuum}</td>
                  <td className="p-2 text-center">{r.medicalAir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        Cet onglet compare les quantités physiques (unités), pas les montants BOQ.
      </p>
    </div>
  );
}
