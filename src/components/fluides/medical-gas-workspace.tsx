"use client";

import { useState, useTransition } from "react";
import { toggleMedicalGasChecklistAction } from "@/app/actions/medical-gas";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import {
  MEDICAL_GAS_CHECKLIST_LABELS,
  computeMedicalGasProgress,
  medicalGasKpis,
  medicalGasTypeLabel,
} from "@/lib/nassib/medical-gas-workflow";
import type { MedicalGasNetwork } from "@/types/nassib";

function applyChecklistToggle(
  net: MedicalGasNetwork,
  key: string,
  done: boolean,
): MedicalGasNetwork {
  const checklist = { ...net.checklist, [key]: done };
  const outletsInstalled =
    key === "outlets_installed"
      ? done
        ? net.outletsPlanned
        : 0
      : net.outletsInstalled;
  const next = { ...net, checklist, outletsInstalled };
  return { ...next, progressPct: computeMedicalGasProgress(next) };
}

function NetworkCard({
  net,
  pending,
  onToggle,
}: {
  net: MedicalGasNetwork;
  pending: boolean;
  onToggle: (networkId: string, key: string, done: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{medicalGasTypeLabel(net.type)}</CardTitle>
        <Badge variant="brand">{net.progressPct}%</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar value={net.progressPct} />
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-slate-500">Source</p>
            <p>{net.source}</p>
          </div>
          <div>
            <p className="text-slate-500">Local technique</p>
            <p>{net.technicalRoom}</p>
          </div>
          <div>
            <p className="text-slate-500">Prises</p>
            <p>
              {net.outletsInstalled}/{net.outletsPlanned}
            </p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(net.checklist).map(([key, done]) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm transition-colors ${
                done
                  ? "border-[#0891B2]/40 bg-[#0891B2]/5"
                  : "hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={done}
                disabled={pending}
                className="size-4 cursor-pointer accent-[#0891B2]"
                onChange={(e) => onToggle(net.id, key, e.target.checked)}
              />
              {MEDICAL_GAS_CHECKLIST_LABELS[key] ?? key}
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MedicalGasWorkspace({
  networks,
}: {
  networks: MedicalGasNetwork[];
}) {
  const [items, setItems] = useState(networks);
  const [pending, startTransition] = useTransition();
  const kpis = medicalGasKpis(items);

  function handleToggle(networkId: string, key: string, done: boolean) {
    const snapshot = items;
    setItems((prev) =>
      prev.map((n) =>
        n.id === networkId ? applyChecklistToggle(n, key, done) : n,
      ),
    );

    startTransition(async () => {
      const result = await toggleMedicalGasChecklistAction(networkId, key, done);
      if (!result.ok) setItems(snapshot);
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Réseaux", value: kpis.total },
          { label: "Avancement moyen", value: `${kpis.avgProgress}%` },
          {
            label: "Prises posées",
            value: `${kpis.outletsInstalled}/${kpis.outletsPlanned}`,
          },
          {
            label: "Checklist",
            value: `${kpis.checklistDone}/${kpis.checklistTotal}`,
          },
        ].map((k) => (
          <Card key={k.label} className="border-[#003F72]/15">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className="text-2xl font-semibold text-[#003F72]">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.map((net) => (
        <NetworkCard
          key={net.id}
          net={net}
          pending={pending}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
