"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Map,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  buildPlanDocuments,
  formatPlanRevisionDate,
  NASSIB_BUILDING_LEVELS,
  planMatchesLevel,
  PLANS_BOARD_META,
  plansBoardKpis,
  type PlanDocumentView,
  type PlanLevel,
} from "@/data/nassib/plans-registry";
import { cn } from "@/lib/utils";

type LevelFilter = PlanLevel | "all";
type StatusFilter = "all" | "validated" | "in_progress";
type TypeFilter = "all" | "architectural" | "implantation";

function PlanCard({ plan }: { plan: PlanDocumentView }) {
  const viewUrl = plan.sourceFile;
  const downloadUrl = plan.downloadFile ?? plan.sourceFile;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003F72]/10">
          <Map className="h-4 w-4 text-[#003F72]" />
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">{plan.reference}</p>
          {plan.status === "validated" ? (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              Validé
            </span>
          ) : (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              <Clock className="h-3 w-3" />
              En cours
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-3 flex-1 text-sm font-semibold leading-snug text-slate-900">
        {plan.title}
      </h3>

      <div className="mb-3 flex flex-wrap gap-2">
        {(plan.levels.length > 1 ? plan.levels : [plan.level]).map((lvl) => (
          <span
            key={lvl}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
          >
            {lvl}
          </span>
        ))}
        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium capitalize text-blue-800">
          {plan.docType === "architectural" ? "Architectural" : "Implantation"}
        </span>
        <span className="rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
          {plan.version}
        </span>
      </div>

      <p className="mb-1 text-xs text-slate-500">
        Révision : {formatPlanRevisionDate(plan.revisionDate)}
      </p>
      <Link
        href="/locaux"
        className="mb-4 block text-xs font-medium text-violet-600 hover:underline"
      >
        {plan.linkedRoomsCount} local{plan.linkedRoomsCount > 1 ? "aux" : ""}{" "}
        lié{plan.linkedRoomsCount > 1 ? "s" : ""}
      </Link>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <Link href={viewUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            Voir
          </Button>
        </Link>
        <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Télécharger
          </Button>
        </a>
      </div>
    </article>
  );
}

export function PlansWorkspace() {
  const plans = useMemo(() => buildPlanDocuments(), []);
  const kpis = useMemo(() => plansBoardKpis(plans), [plans]);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const levels: LevelFilter[] = ["all", ...NASSIB_BUILDING_LEVELS];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plans.filter((p) => {
      if (!planMatchesLevel(p, levelFilter)) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.docType !== typeFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        p.level.toLowerCase().includes(q)
      );
    });
  }, [plans, search, levelFilter, statusFilter, typeFilter]);

  const kpiCards = [
    {
      label: "Plans validés",
      value: kpis.validated,
      icon: CheckCircle2,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "En cours",
      value: kpis.inProgress,
      icon: Clock,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Dernière révision",
      value: formatPlanRevisionDate(kpis.lastRevision),
      icon: Calendar,
      iconClass: "bg-violet-100 text-violet-600",
      isText: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Plans</h1>
        <p className="mt-1 text-sm text-slate-500">
          {kpis.total} plans · {PLANS_BOARD_META.subtitle} ·{" "}
          {PLANS_BOARD_META.enterprise}
        </p>
        <p className="text-sm text-slate-400">
          {PLANS_BOARD_META.project} — Bâtiment {NASSIB_BUILDING_LEVELS.join(" + ")}{" "}
          — Gestion documentaire des plans
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                k.iconClass,
              )}
            >
              <k.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {k.label}
              </p>
              <p
                className={cn(
                  "font-bold text-slate-900",
                  k.isText ? "text-lg" : "text-2xl",
                )}
              >
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Rechercher un plan…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md flex-1"
        />
        <select
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">Tous</option>
          <option value="validated">Validés</option>
          <option value="in_progress">En cours</option>
        </select>
        <select
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={levelFilter === "all" ? "all" : levelFilter}
          onChange={(e) =>
            setLevelFilter(
              e.target.value === "all" ? "all" : (e.target.value as PlanLevel),
            )
          }
        >
          <option value="all">Tous les étages</option>
          <option value="RDC">RDC</option>
          <option value="R+1">R+1</option>
        </select>
        <select
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
        >
          <option value="all">Tous</option>
          <option value="architectural">Architectural</option>
          <option value="implantation">Implantation</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {levels.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setLevelFilter(lvl)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              levelFilter === lvl
                ? "bg-[#003F72] text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            {lvl === "all" ? "Tous les niveaux" : lvl}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} plan{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">
          Aucun plan ne correspond à votre recherche.
        </p>
      )}

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Link href="/locaux">
          <Button variant="outline" size="sm">
            Locaux ({kpis.linkedRooms}/{kpis.buildingRooms} rattachés) →
          </Button>
        </Link>
        <Link href="/batiments">
          <Button variant="outline" size="sm">
            Bâtiments & niveaux →
          </Button>
        </Link>
      </div>
    </div>
  );
}
