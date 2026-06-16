"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  approveAllPendingInGroupAction,
  approveBoqPaymentAction,
  markBoqPaymentPaidAction,
  submitBoqPaymentRequestAction,
  updateBoqPaymentAction,
} from "@/app/actions/boq-payments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BoqLine } from "@/types/nassib";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENTS_META,
  buildPaymentGroups,
  exportPaymentsCsv,
  lineContractAmount,
  lineNetPayable,
  lineRetentionAmount,
  lineSituationBase,
  paymentKpis,
  paymentLineStatus,
  sumGroupField,
  type PaymentGroup,
  type PaymentLineStatus,
} from "@/lib/nassib/payments-workflow";
import { formatFdj } from "@/lib/utils";

type StatusFilter = "all" | PaymentLineStatus;

const STATUS_VARIANT: Record<
  PaymentLineStatus,
  "default" | "info" | "warning" | "success" | "danger"
> = {
  idle: "default",
  pending_moa: "warning",
  pending_finance: "info",
  partial: "warning",
  settled: "success",
};

function PaymentAmountInput({
  value,
  disabled,
  onCommit,
}: {
  value: number;
  disabled?: boolean;
  onCommit: (n: number) => void;
}) {
  const [draft, setDraft] = useState(String(value || ""));

  return (
    <Input
      type="number"
      min={0}
      step={1000}
      disabled={disabled}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = Math.max(0, Math.round(Number(draft) || 0));
        setDraft(String(n));
        if (n !== value) onCommit(n);
      }}
      className="h-8 w-28 text-right font-mono text-xs"
    />
  );
}

function PaymentRow({
  line,
  indent,
  pending,
  onPatch,
  onSubmit,
  onApprove,
  onPay,
}: {
  line: BoqLine;
  indent?: boolean;
  pending: boolean;
  onPatch: (id: string, patch: Partial<BoqLine>) => void;
  onSubmit: (id: string, amount: number) => void;
  onApprove: (id: string) => void;
  onPay: (id: string) => void;
}) {
  const status = paymentLineStatus(line);
  const contract = lineContractAmount(line);
  const situation = lineSituationBase(line);
  const retention = lineRetentionAmount(line);

  return (
    <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/80">
      <td className={`py-2 pr-3 ${indent ? "pl-8" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-500">{line.code}</span>
          <Badge variant={STATUS_VARIANT[status]} className="text-[10px]">
            {PAYMENT_STATUS_LABELS[status]}
          </Badge>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm">{line.description}</p>
        <p className="text-xs text-slate-400">
          {line.lotCode} · {formatFdj(contract)} contractuel
          {situation > 0 ? ` · situation ${formatFdj(situation)}` : ""}
        </p>
      </td>
      <td className="py-2 pr-3">
        <PaymentAmountInput
          value={line.paymentRequested}
          disabled={pending}
          onCommit={(n) => onPatch(line.id, { paymentRequested: n })}
        />
      </td>
      <td className="py-2 pr-3">
        <PaymentAmountInput
          value={line.paymentApproved}
          disabled={pending || line.paymentRequested <= 0}
          onCommit={(n) => onPatch(line.id, { paymentApproved: n })}
        />
      </td>
      <td className="py-2 pr-3">
        <PaymentAmountInput
          value={line.paymentPaid}
          disabled={pending || line.paymentApproved <= 0}
          onCommit={(n) => onPatch(line.id, { paymentPaid: n })}
        />
      </td>
      <td className="py-2 pr-3 text-xs">
        <Badge variant="info">{line.retentionPct}%</Badge>
        {line.paymentApproved > 0 && (
          <p className="mt-1 text-slate-500">{formatFdj(retention)} retenue</p>
        )}
      </td>
      <td className="py-2">
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            disabled={pending}
            onClick={() => onSubmit(line.id, situation > 0 ? situation : contract * 0.1)}
          >
            Soumettre
          </Button>
          {status === "pending_moa" && (
            <Button
              type="button"
              size="sm"
              className="h-7 text-[10px]"
              disabled={pending}
              onClick={() => onApprove(line.id)}
            >
              Approuver
            </Button>
          )}
          {(status === "pending_finance" || status === "partial") && (
            <Button
              type="button"
              size="sm"
              className="h-7 bg-[#0891B2] text-[10px] hover:bg-[#0891B2]/90"
              disabled={pending}
              onClick={() => onPay(line.id)}
            >
              Marquer payé
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function GroupSection({
  group,
  expanded,
  onToggle,
  pending,
  onPatch,
  onSubmit,
  onApprove,
  onPay,
  onApproveGroup,
}: {
  group: PaymentGroup;
  expanded: boolean;
  onToggle: () => void;
  pending: boolean;
  onPatch: (id: string, patch: Partial<BoqLine>) => void;
  onSubmit: (id: string, amount: number) => void;
  onApprove: (id: string) => void;
  onPay: (id: string) => void;
  onApproveGroup: (recapCode: string) => void;
}) {
  const pendingInGroup = group.children.filter(
    (l) => paymentLineStatus(l) === "pending_moa",
  ).length;

  return (
    <>
      <tr
        className="cursor-pointer border-b border-slate-200 bg-[#003F72]/5 hover:bg-[#003F72]/10"
        onClick={onToggle}
      >
        <td className="py-3 pr-3" colSpan={6}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{expanded ? "▼" : "▶"}</span>
              <span className="font-mono text-sm font-semibold text-[#003F72]">
                {group.recap.code}
              </span>
              <span className="font-medium text-[#003F72]">
                {group.recap.description}
              </span>
              <Badge variant="brand">{group.children.length} lignes</Badge>
              {pendingInGroup > 0 && (
                <Badge variant="warning">{pendingInGroup} à valider MOA</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span>Demandé {formatFdj(sumGroupField(group, "paymentRequested"))}</span>
              <span>Approuvé {formatFdj(sumGroupField(group, "paymentApproved"))}</span>
              <span>Payé {formatFdj(sumGroupField(group, "paymentPaid"))}</span>
              {pendingInGroup > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={pending}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApproveGroup(group.recap.code);
                  }}
                >
                  Approuver tout ({pendingInGroup})
                </Button>
              )}
            </div>
          </div>
        </td>
      </tr>
      {expanded &&
        group.children.map((line) => (
          <PaymentRow
            key={line.id}
            line={line}
            indent
            pending={pending}
            onPatch={onPatch}
            onSubmit={onSubmit}
            onApprove={onApprove}
            onPay={onPay}
          />
        ))}
    </>
  );
}

export function PaymentsWorkspace({ boq: initialBoq }: { boq: BoqLine[] }) {
  const [boq, setBoq] = useState(initialBoq);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "RECAP-01": true,
    "RECAP-02": false,
    "RECAP-03": false,
    "RECAP-04": false,
  });
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => buildPaymentGroups(boq), [boq]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups
      .map((g) => {
        const children = g.children.filter((line) => {
          const status = paymentLineStatus(line);
          if (statusFilter !== "all" && status !== statusFilter) return false;
          if (!q) return true;
          return (
            line.code.toLowerCase().includes(q) ||
            line.description.toLowerCase().includes(q) ||
            line.lotCode.toLowerCase().includes(q)
          );
        });
        return { ...g, children };
      })
      .filter(
        (g) =>
          g.children.length > 0 ||
          (search === "" &&
            statusFilter === "all" &&
            g.recap.description.toLowerCase().includes(search.toLowerCase())),
      );
  }, [groups, search, statusFilter]);

  const kpis = useMemo(() => paymentKpis(boq), [boq]);

  function patchLocal(id: string, patch: Partial<BoqLine>) {
    setBoq((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
    startTransition(async () => {
      await updateBoqPaymentAction(id, patch);
    });
  }

  function handleExport() {
    const csv = exportPaymentsCsv(boq);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paiements-boq-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/boq">
          <Button variant="outline" size="sm">
            ← Retour BOQ
          </Button>
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setExpanded(
                Object.fromEntries(groups.map((g) => [g.recap.code, true])),
              )
            }
          >
            Tout déplier
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Demandé MOE",
            value: formatFdj(kpis.totalRequested),
            sub: `${kpis.activeSituations} ligne(s) active(s)`,
          },
          {
            label: "Approuvé MOA",
            value: formatFdj(kpis.totalApproved),
            sub: `Retenue ${formatFdj(kpis.totalRetention)}`,
          },
          {
            label: "Payé Finance",
            value: formatFdj(kpis.totalPaid),
            sub: `Net ${formatFdj(kpis.totalApproved - kpis.totalRetention)}`,
          },
          {
            label: "Attente MOA",
            value: formatFdj(kpis.pendingMoa),
            sub: "Demandé − approuvé",
            variant: kpis.pendingMoa > 0 ? "warning" : "default",
          },
          {
            label: "À payer",
            value: formatFdj(kpis.pendingFinance),
            sub: `${PAYMENTS_META.currency} HT`,
            variant: kpis.pendingFinance > 0 ? "info" : "default",
          },
        ].map((k) => (
          <Card key={k.label} className="border-[#003F72]/15">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className="mt-1 text-xl font-bold text-[#003F72]">{k.value}</p>
              <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#0891B2]/25 bg-[#0891B2]/5">
        <CardContent className="flex flex-wrap items-center gap-4 py-4 text-sm">
          <div>
            <p className="font-medium text-[#003F72]">Workflow</p>
            <p className="text-slate-600">{PAYMENTS_META.workflow}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["MOE", "Soumettre situation", "pending_moa"],
                ["MOA", "Approuver montant", "pending_finance"],
                ["Finance", "Marquer payé", "settled"],
              ] as const
            ).map(([role, step]) => (
              <Badge key={role} variant="brand">
                {role} — {step}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-[#003F72]">
              Situations & décomptes ({filteredGroups.reduce((s, g) => s + g.children.length, 0)} lignes)
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Cliquez sur un corps d&apos;état pour déplier · édition inline des montants
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Rechercher code, lot, libellé…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <select
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">Tous statuts</option>
              {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-slate-500">
                <th className="pb-2 pr-3">Ligne BOQ</th>
                <th className="pb-2 pr-3">Demandé MOE</th>
                <th className="pb-2 pr-3">Approuvé MOA</th>
                <th className="pb-2 pr-3">Payé</th>
                <th className="pb-2 pr-3">Retenue</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => (
                <GroupSection
                  key={group.recap.id}
                  group={group}
                  expanded={expanded[group.recap.code] ?? false}
                  onToggle={() =>
                    setExpanded((e) => ({
                      ...e,
                      [group.recap.code]: !e[group.recap.code],
                    }))
                  }
                  pending={pending}
                  onPatch={patchLocal}
                  onSubmit={(id, amount) =>
                    startTransition(async () => {
                      setBoq((prev) =>
                        prev.map((l) =>
                          l.id === id ? { ...l, paymentRequested: amount } : l,
                        ),
                      );
                      await submitBoqPaymentRequestAction(id, amount);
                    })
                  }
                  onApprove={(id) =>
                    startTransition(async () => {
                      await approveBoqPaymentAction(id);
                      setBoq((prev) =>
                        prev.map((l) =>
                          l.id === id
                            ? { ...l, paymentApproved: l.paymentRequested }
                            : l,
                        ),
                      );
                    })
                  }
                  onPay={(id) =>
                    startTransition(async () => {
                      const line = boq.find((l) => l.id === id);
                      if (!line) return;
                      const paid = lineNetPayable(line);
                      setBoq((prev) =>
                        prev.map((l) => (l.id === id ? { ...l, paymentPaid: paid } : l)),
                      );
                      await markBoqPaymentPaidAction(id);
                    })
                  }
                  onApproveGroup={(code) => {
                    const childIds = new Set(
                      group.children.map((c) => c.id),
                    );
                    startTransition(async () => {
                      await approveAllPendingInGroupAction(code);
                      setBoq((prev) =>
                        prev.map((l) =>
                          childIds.has(l.id) &&
                          l.paymentRequested > l.paymentApproved
                            ? { ...l, paymentApproved: l.paymentRequested }
                            : l,
                        ),
                      );
                    });
                  }}
                />
              ))}
            </tbody>
          </table>
          {filteredGroups.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              Aucune ligne pour ce filtre.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
