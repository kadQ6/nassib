import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";
import type { DashboardKpis } from "@/types";
import {
  AlertTriangle,
  Calendar,
  Package,
  Stethoscope,
  TrendingUp,
  Wallet,
} from "lucide-react";

const items = (kpis: DashboardKpis) => [
  {
    label: "Avancement global",
    value: formatPercent(kpis.projectProgress, 1),
    icon: TrendingUp,
    accent: "text-[#0891B2]",
  },
  {
    label: "Réserves ouvertes",
    value: String(kpis.openReserves),
    sub: `${kpis.criticalReserves} critique(s)`,
    icon: AlertTriangle,
    accent: "text-[#F97316]",
  },
  {
    label: "Tâches bloquées",
    value: String(kpis.delayedTasks),
    icon: Calendar,
    accent: "text-red-600",
  },
  {
    label: "Livraisons en attente",
    value: String(kpis.pendingDeliveries),
    icon: Package,
    accent: "text-amber-600",
  },
  {
    label: "MES en attente",
    value: String(kpis.equipmentPendingCommissioning),
    icon: Stethoscope,
    accent: "text-[#003F72]",
  },
  {
    label: "Budget consommé",
    value: formatPercent(kpis.budgetConsumedPct, 0),
    icon: Wallet,
    accent: "text-slate-700",
  },
];

export function KpiCards({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items(kpis).map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {item.label}
            </CardTitle>
            <item.icon className={`h-5 w-5 ${item.accent}`} />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#003F72]">{item.value}</p>
            {item.sub && <p className="mt-1 text-xs text-slate-500">{item.sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MilestoneBanner({ kpis }: { kpis: DashboardKpis }) {
  return (
    <Card className="border-[#0891B2]/30 bg-gradient-to-r from-[#003F72]/5 to-[#0891B2]/5">
      <CardContent className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0891B2]">Prochain jalon</p>
          <p className="text-lg font-semibold text-[#003F72]">
            {kpis.nextMilestone}
          </p>
        </div>
        <p className="text-sm text-slate-600">
          Échéance :{" "}
          <span className="font-medium">{kpis.nextMilestoneDate}</span>
        </p>
      </CardContent>
    </Card>
  );
}
