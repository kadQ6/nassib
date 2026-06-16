"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  advanceTestResultAction,
  updateTestAction,
} from "@/app/actions/tests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/shared/progress-bar";
import type { NassibTest } from "@/types/nassib";
import {
  LOT_LABELS,
  TEST_RESULT_LABELS,
  TEST_RESULT_VARIANT,
  buildTestGroups,
  exportTestsCsv,
  testKpis,
  type TestGroupId,
} from "@/lib/nassib/tests-workflow";
import { formatDate } from "@/lib/utils";

function TestRow({
  test,
  roomCodeToId,
  pending,
  onResultChange,
  onDateChange,
}: {
  test: NassibTest;
  roomCodeToId: Record<string, string>;
  pending: boolean;
  onResultChange: (id: string, result: NassibTest["result"]) => void;
  onDateChange: (id: string, date: string) => void;
}) {
  const isLate =
    test.result !== "validated" &&
    test.result !== "conform" &&
    test.plannedDate < "2026-06-13";

  return (
    <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/80">
      <td className="max-w-[280px] py-3 pr-3">
        <p className="font-medium text-[#003F72] line-clamp-2">{test.system}</p>
        <p className="mt-1 text-xs text-slate-500">{test.normReference}</p>
        <p className="text-xs text-slate-400">{test.zone}</p>
      </td>
      <td className="py-3 pr-3">
        <Link
          href={`/lots/${test.lotCode.toLowerCase()}`}
          className="font-mono text-xs text-[#0891B2] hover:underline"
        >
          {LOT_LABELS[test.lotCode] ?? test.lotCode}
        </Link>
        {test.roomCode && (
          <div className="mt-1">
            <Link
              href={`/locaux/${roomCodeToId[test.roomCode] ?? test.roomCode.toLowerCase()}`}
              className="font-mono text-xs text-[#0891B2] hover:underline"
            >
              {test.roomCode}
            </Link>
          </div>
        )}
      </td>
      <td className="py-3 pr-3 text-xs text-slate-600">{test.responsible}</td>
      <td className="py-3 pr-3 text-xs">
        <p>{formatDate(test.plannedDate)}</p>
        {isLate && (
          <Badge variant="warning" className="mt-1 text-[10px]">
            Retard
          </Badge>
        )}
      </td>
      <td className="py-3 pr-3">
        <Input
          type="date"
          className="h-8 w-36 text-xs"
          disabled={pending}
          value={test.actualDate ?? ""}
          onChange={(e) => onDateChange(test.id, e.target.value)}
        />
      </td>
      <td className="py-3 pr-3">
        <select
          className="rounded-md border border-slate-200 px-2 py-1 text-xs"
          value={test.result}
          disabled={pending}
          onChange={(e) =>
            onResultChange(test.id, e.target.value as NassibTest["result"])
          }
        >
          {Object.entries(TEST_RESULT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        {test.reservesLinked > 0 && (
          <Link href="/reserves">
            <Badge variant="danger" className="mt-1 cursor-pointer text-[10px]">
              {test.reservesLinked} réserve(s)
            </Badge>
          </Link>
        )}
      </td>
      <td className="py-3">
        <div className="flex flex-wrap gap-1">
          {test.result === "planned" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-[10px]"
              disabled={pending}
              onClick={() => onResultChange(test.id, "in_progress")}
            >
              Démarrer
            </Button>
          )}
          {test.result === "in_progress" && (
            <>
              <Button
                type="button"
                size="sm"
                className="h-7 bg-emerald-600 text-[10px] hover:bg-emerald-700"
                disabled={pending}
                onClick={() => onResultChange(test.id, "conform")}
              >
                Conforme
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[10px] text-red-600"
                disabled={pending}
                onClick={() => onResultChange(test.id, "non_conform")}
              >
                NC
              </Button>
            </>
          )}
          {(test.result === "conform" || test.result === "retry") && (
            <Button
              type="button"
              size="sm"
              className="h-7 bg-[#003F72] text-[10px]"
              disabled={pending}
              onClick={() => onResultChange(test.id, "validated")}
            >
              PV validé
            </Button>
          )}
          {test.result === "non_conform" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-[10px]"
              disabled={pending}
              onClick={() => onResultChange(test.id, "retry")}
            >
              Reprendre
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function TestsWorkspace({
  tests: initialTests,
  roomCodeToId,
}: {
  tests: NassibTest[];
  roomCodeToId: Record<string, string>;
}) {
  const [tests, setTests] = useState(initialTests);
  const [search, setSearch] = useState("");
  const [lotFilter, setLotFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<TestGroupId | "all">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    system: true,
    local: true,
    opr: true,
  });
  const [pending, startTransition] = useTransition();

  const kpis = useMemo(() => testKpis(tests), [tests]);
  const groups = useMemo(() => buildTestGroups(tests), [tests]);

  const lots = useMemo(
    () => [...new Set(tests.map((t) => t.lotCode))].sort(),
    [tests],
  );

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups
      .filter((g) => groupFilter === "all" || g.id === groupFilter)
      .map((g) => ({
        ...g,
        tests: g.tests.filter((t) => {
          if (lotFilter !== "all" && t.lotCode !== lotFilter) return false;
          if (resultFilter !== "all" && t.result !== resultFilter) return false;
          if (!q) return true;
          return (
            t.system.toLowerCase().includes(q) ||
            t.zone.toLowerCase().includes(q) ||
            t.normReference.toLowerCase().includes(q) ||
            (t.roomCode?.toLowerCase().includes(q) ?? false)
          );
        }),
      }))
      .filter((g) => g.tests.length > 0);
  }, [groups, search, lotFilter, resultFilter, groupFilter]);

  function handleResultChange(id: string, result: NassibTest["result"]) {
    const today = new Date().toISOString().slice(0, 10);
    setTests((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              result,
              actualDate: ["conform", "validated", "non_conform"].includes(result)
                ? t.actualDate ?? today
                : t.actualDate,
            }
          : t,
      ),
    );
    startTransition(async () => {
      await advanceTestResultAction(id, result);
    });
  }

  function handleDateChange(id: string, date: string) {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, actualDate: date || undefined } : t)),
    );
    startTransition(async () => {
      await updateTestAction(id, { actualDate: date || undefined });
    });
  }

  function handleExport() {
    const csv = exportTestsCsv(tests);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `essais-opr-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Link href="/reception">
            <Button variant="outline" size="sm">
              Réception locaux →
            </Button>
          </Link>
          <Link href="/reserves">
            <Button variant="outline" size="sm">
              Réserves →
            </Button>
          </Link>
          <Link href="/planning">
            <Button variant="outline" size="sm">
              Planning WBS 1.7 →
            </Button>
          </Link>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <Card className="border-[#003F72]/20">
        <CardContent className="space-y-3 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Avancement essais & OPR</p>
              <p className="text-3xl font-bold text-[#003F72]">{kpis.progressPct}%</p>
              <p className="text-xs text-slate-500">
                {kpis.conform + kpis.validated} / {kpis.total} protocoles clôturés
              </p>
            </div>
            <div className="min-w-[200px] flex-1 max-w-md">
              <ProgressBar value={kpis.progressPct} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total protocoles", value: kpis.total, sub: `${kpis.pending} en attente` },
          { label: "En cours", value: kpis.inProgress, sub: "Essais démarrés" },
          { label: "Conformes", value: kpis.conform, sub: "Avant PV", variant: "success" as const },
          { label: "Non conformes", value: kpis.nonConform, sub: `${kpis.withReserves} avec réserve`, variant: kpis.nonConform > 0 ? "danger" as const : "default" as const },
          { label: "PV validés", value: kpis.validated, sub: "Réceptionnable", variant: "success" as const },
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

      <Card className="border-[#0891B2]/25 bg-[#0891B2]/5">
        <CardContent className="flex flex-wrap gap-2 py-4">
          {(
            [
              ["planned", "Planifié"],
              ["in_progress", "En cours"],
              ["conform", "Conforme"],
              ["non_conform", "Non conforme"],
              ["validated", "PV validé"],
            ] as const
          ).map(([key, label]) => (
            <Badge key={key} variant={TEST_RESULT_VARIANT[key]}>
              {label}
            </Badge>
          ))}
          <span className="text-sm text-slate-600">
            — Workflow : Démarrer → Conforme / NC → PV validé
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-[#003F72]">
              Protocoles ({filteredGroups.reduce((s, g) => s + g.tests.length, 0)})
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Essais système WBS 1.7 · essais locaux · OPR réception
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value as TestGroupId | "all")}
            >
              <option value="all">Tous groupes</option>
              <option value="system">Système WBS 1.7</option>
              <option value="local">Locaux</option>
              <option value="opr">OPR</option>
            </select>
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={lotFilter}
              onChange={(e) => setLotFilter(e.target.value)}
            >
              <option value="all">Tous lots</option>
              {lots.map((lot) => (
                <option key={lot} value={lot}>
                  {LOT_LABELS[lot] ?? lot}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option value="all">Tous statuts</option>
              {Object.entries(TEST_RESULT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 overflow-x-auto">
          {filteredGroups.map((group) => (
            <div key={group.id}>
              <button
                type="button"
                className="mb-2 flex w-full items-center gap-2 rounded-lg bg-[#003F72]/5 px-3 py-2 text-left hover:bg-[#003F72]/10"
                onClick={() =>
                  setExpanded((e) => ({ ...e, [group.id]: !e[group.id] }))
                }
              >
                <span className="text-slate-400">{expanded[group.id] ? "▼" : "▶"}</span>
                <span className="font-semibold text-[#003F72]">{group.label}</span>
                <Badge variant="brand">{group.tests.length}</Badge>
              </button>
              {expanded[group.id] && (
                <table className="w-full min-w-[1000px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-slate-500">
                      <th className="pb-2 pr-3">Protocole</th>
                      <th className="pb-2 pr-3">Lot / Local</th>
                      <th className="pb-2 pr-3">Responsable</th>
                      <th className="pb-2 pr-3">Prévu</th>
                      <th className="pb-2 pr-3">Réalisé</th>
                      <th className="pb-2 pr-3">Statut</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.tests.map((test) => (
                      <TestRow
                        key={test.id}
                        test={test}
                        roomCodeToId={roomCodeToId}
                        pending={pending}
                        onResultChange={handleResultChange}
                        onDateChange={handleDateChange}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              Aucun protocole pour ce filtre.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
