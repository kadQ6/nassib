"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  advanceCommissioningPhaseAction,
  updateCommissioningPhaseAction,
} from "@/app/actions/commissioning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/shared/progress-bar";
import { INVENTORY_KIND_LABELS } from "@/lib/nassib/inventory-rules";
import {
  COMMISSIONING_OVERALL_LABELS,
  COMMISSIONING_OVERALL_VARIANT,
  COMMISSIONING_PHASE_LABELS,
  COMMISSIONING_PHASE_STATUS_LABELS,
  COMMISSIONING_STATUS_VARIANT,
  commissioningKpis,
  exportCommissioningCsv,
} from "@/lib/nassib/commissioning-workflow";
import type {
  CommissioningOverallStatus,
  CommissioningPhaseId,
  CommissioningPhaseStatus,
  NassibCommissioningLine,
} from "@/types/nassib";
import { formatDate } from "@/lib/utils";

const PHASES: CommissioningPhaseId[] = [
  "installation",
  "commissioning",
  "training",
];

type StatusFilter = CommissioningOverallStatus | "all";
type PhaseFilter = CommissioningPhaseId | "all";

function PhaseCell({
  line,
  phaseId,
  pending,
  onAdvance,
  onBlock,
}: {
  line: NassibCommissioningLine;
  phaseId: CommissioningPhaseId;
  pending: boolean;
  onAdvance: (lineId: string, phaseId: CommissioningPhaseId) => void;
  onBlock: (lineId: string, phaseId: CommissioningPhaseId) => void;
}) {
  const phase = line.phases[phaseId];
  const canAdvance =
    line.logisticsReady &&
    phase.status !== "done" &&
    phase.status !== "blocked" &&
    (phaseId === "installation" ||
      (phaseId === "commissioning" &&
        line.phases.installation.status === "done") ||
      (phaseId === "training" &&
        line.phases.commissioning.status === "done"));

  return (
    <div className="space-y-1">
      <Badge variant={COMMISSIONING_STATUS_VARIANT[phase.status]}>
        {COMMISSIONING_PHASE_STATUS_LABELS[phase.status]}
      </Badge>
      {phase.actualDate && (
        <p className="text-[10px] text-slate-400">{formatDate(phase.actualDate)}</p>
      )}
      <div className="flex flex-wrap gap-1">
        {canAdvance && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 px-2 text-[10px]"
            disabled={pending}
            onClick={() => onAdvance(line.id, phaseId)}
          >
            {phase.status === "pending" ? "Démarrer" : "Valider"}
          </Button>
        )}
        {phase.status === "in_progress" && phaseId === "commissioning" && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-[10px] text-red-600"
            disabled={pending}
            onClick={() => onBlock(line.id, phaseId)}
          >
            NC
          </Button>
        )}
      </div>
    </div>
  );
}

export function CommissioningWorkspace({
  lines: initialLines,
  roomCodeToId,
  logisticsCount,
}: {
  lines: NassibCommissioningLine[];
  roomCodeToId: Record<string, string>;
  logisticsCount: number;
}) {
  const [lines, setLines] = useState(initialLines);
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>("all");
  const [pending, startTransition] = useTransition();
  const kpis = commissioningKpis(lines);

  const roomCodes = useMemo(
    () => [...new Set(lines.map((l) => l.roomCode).filter(Boolean))].sort(),
    [lines],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lines.filter((l) => {
      if (roomFilter !== "all" && l.roomCode !== roomFilter) return false;
      if (statusFilter !== "all" && l.overallStatus !== statusFilter) return false;
      if (phaseFilter !== "all") {
        const st = l.phases[phaseFilter].status;
        if (st !== "pending" && st !== "in_progress" && st !== "blocked") {
          return false;
        }
      }
      if (!q) return true;
      return (
        l.assetCode.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.roomCode.toLowerCase().includes(q)
      );
    });
  }, [lines, search, roomFilter, statusFilter, phaseFilter]);

  function applyLineUpdate(
    lineId: string,
    updater: (line: NassibCommissioningLine) => NassibCommissioningLine,
  ) {
    setLines((prev) => prev.map((l) => (l.id === lineId ? updater(l) : l)));
  }

  function handleAdvance(lineId: string, phaseId: CommissioningPhaseId) {
    const snapshot = lines;
    applyLineUpdate(lineId, (line) => {
      const phase = line.phases[phaseId];
      let next: CommissioningPhaseStatus = phase.status;
      if (phase.status === "pending") next = "in_progress";
      else if (phase.status === "in_progress") next = "done";
      else if (phase.status === "locked" && line.logisticsReady) next = "pending";
      const phases = {
        ...line.phases,
        [phaseId]: {
          ...phase,
          status: next,
          actualDate: next === "done" ? new Date().toISOString().slice(0, 10) : phase.actualDate,
        },
      };
      const progressPct = Math.round(
        (PHASES.filter((p) => phases[p].status === "done").length / 3) * 100,
      );
      return { ...line, phases, progressPct };
    });

    startTransition(async () => {
      const result = await advanceCommissioningPhaseAction(lineId, phaseId);
      if (!result.ok) setLines(snapshot);
    });
  }

  function handleBlock(lineId: string, phaseId: CommissioningPhaseId) {
    const snapshot = lines;
    applyLineUpdate(lineId, (line) => ({
      ...line,
      phases: {
        ...line.phases,
        [phaseId]: { ...line.phases[phaseId], status: "blocked" },
      },
      overallStatus: "blocked" as const,
    }));

    startTransition(async () => {
      const result = await updateCommissioningPhaseAction(
        lineId,
        phaseId,
        "blocked",
      );
      if (!result.ok) setLines(snapshot);
    });
  }

  function downloadCsv() {
    const blob = new Blob([exportCommissioningCsv(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "installation-dm-polyclinique-nassib.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/logistique">
          <Button variant="outline" size="sm">
            ← Logistique ({logisticsCount})
          </Button>
        </Link>
        <Link href="/equipements/recap">
          <Button variant="outline" size="sm">
            Inventaire DM →
          </Button>
        </Link>
        <Link href="/essais">
          <Button variant="outline" size="sm">
            Essais / OPR →
          </Button>
        </Link>
        <Link href="/reserves">
          <Button variant="outline" size="sm">
            Réserves →
          </Button>
        </Link>
        <Link href="/taches">
          <Button variant="outline" size="sm">
            Tâches →
          </Button>
        </Link>
        <Link href="/mise-en-exploitation">
          <Button variant="outline" size="sm">
            Mise en exploitation →
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={downloadCsv}>
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {[
          { label: "Lignes DM", value: kpis.total },
          { label: "Attente logistique", value: kpis.waitingLogistics },
          { label: "En cours", value: kpis.inProgress },
          { label: "Prêts exploitation", value: kpis.ready },
          { label: "Bloqués", value: kpis.blocked },
          { label: "Installés", value: kpis.installationDone },
          { label: "MES validée", value: kpis.commissioningDone },
          { label: "Formés", value: kpis.trainingDone },
        ].map((k) => (
          <Card key={k.label} className="border-[#003F72]/15">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className="text-xl font-semibold text-[#003F72]">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#0891B2]/20 bg-slate-50/50">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#003F72]">
                Circuit post-logistique
              </p>
              <p className="text-xs text-slate-500">
                Logistique (en place) → Installation → Mise en service (IQ/OQ) →
                Formation utilisateurs → Essais / Réception
              </p>
            </div>
            <p className="text-sm font-semibold text-[#0891B2]">
              {kpis.avgProgress}% avancement moyen
            </p>
          </div>
          <ProgressBar value={kpis.avgProgress} className="mt-3" />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
        >
          Tous ({lines.length})
        </Button>
        {(
          Object.keys(COMMISSIONING_OVERALL_LABELS) as CommissioningOverallStatus[]
        ).map((s) => {
          const count = lines.filter((l) => l.overallStatus === s).length;
          return (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
            >
              {COMMISSIONING_OVERALL_LABELS[s]} ({count})
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="h-9 max-w-xs"
          placeholder="Rechercher code, désignation…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-9 rounded-md border px-2 text-sm"
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
        >
          <option value="all">Tous les locaux</option>
          {roomCodes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border px-2 text-sm"
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value as PhaseFilter)}
        >
          <option value="all">Toutes les phases actives</option>
          {PHASES.map((p) => (
            <option key={p} value={p}>
              {COMMISSIONING_PHASE_LABELS[p]} en cours
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-[#003F72] text-left text-white">
            <tr>
              <th className="p-2 font-medium">Code / Désignation</th>
              <th className="p-2 font-medium">Local</th>
              <th className="p-2 font-medium">Catégorie</th>
              <th className="p-2 font-medium">Installation</th>
              <th className="p-2 font-medium">Mise en service</th>
              <th className="p-2 font-medium">Formation</th>
              <th className="p-2 font-medium">Avancement</th>
              <th className="p-2 font-medium">Liens</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((line, i) => (
              <tr
                key={line.id}
                className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}
              >
                <td className="p-2">
                  <p className="font-mono text-xs text-slate-500">{line.assetCode}</p>
                  <p className="font-medium text-[#003F72]">{line.description}</p>
                  <Badge
                    variant={COMMISSIONING_OVERALL_VARIANT[line.overallStatus]}
                    className="mt-1"
                  >
                    {COMMISSIONING_OVERALL_LABELS[line.overallStatus]}
                  </Badge>
                </td>
                <td className="p-2">
                  <Link
                    href={`/locaux/${roomCodeToId[line.roomCode] ?? line.roomCode.toLowerCase()}?tab=equipment`}
                    className="font-medium text-[#0891B2] hover:underline"
                  >
                    {line.roomCode}
                  </Link>
                  {line.openReserves > 0 && (
                    <Link
                      href={`/reserves?room=${line.roomCode}`}
                      className="mt-1 block text-xs text-orange-600 hover:underline"
                    >
                      {line.openReserves} réserve(s)
                    </Link>
                  )}
                </td>
                <td className="p-2 text-xs text-slate-600">
                  {INVENTORY_KIND_LABELS[line.inventoryKind]}
                </td>
                {PHASES.map((phaseId) => (
                  <td key={phaseId} className="p-2 align-top">
                    <PhaseCell
                      line={line}
                      phaseId={phaseId}
                      pending={pending}
                      onAdvance={handleAdvance}
                      onBlock={handleBlock}
                    />
                  </td>
                ))}
                <td className="p-2">
                  <ProgressBar value={line.progressPct} showLabel={false} />
                  <p className="mt-1 text-xs text-slate-500">{line.progressPct}%</p>
                </td>
                <td className="p-2 text-xs">
                  {line.logisticsId && (
                    <Link href="/logistique" className="block text-[#0891B2] hover:underline">
                      Logistique
                    </Link>
                  )}
                  {line.linkedTestId && (
                    <Link href="/essais" className="block text-[#0891B2] hover:underline">
                      Essai lié
                    </Link>
                  )}
                  <Link
                    href={`/lots/${line.lotCode.toLowerCase()}`}
                    className="block text-[#0891B2] hover:underline"
                  >
                    {line.lotCode}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            Aucune ligne — vérifiez les filtres ou l&apos;inventaire DM.
          </p>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {filtered.length} ligne(s) · alimenté depuis inventaire DM & mobilier médical
        (post-logistique)
      </p>
    </div>
  );
}
