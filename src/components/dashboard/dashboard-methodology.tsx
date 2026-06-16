import type { DashboardScoreInputs } from "@/lib/calculations/dashboard-metrics";
import { MASTER_INDEX_WEIGHTS } from "@/lib/calculations/master-index";
import { formatPercent } from "@/lib/utils";

export function DashboardMethodology({
  inputs,
  financialNote,
}: {
  inputs: DashboardScoreInputs;
  financialNote: string;
}) {
  const rows = [
    {
      label: "Planning",
      max: MASTER_INDEX_WEIGHTS.planning,
      raw: inputs.planningScore,
      detail: `SPI ${formatPercent(inputs.spi, 1)} — réel ${formatPercent(inputs.progressActual, 1)} / prévu ${formatPercent(inputs.progressPlanned, 1)} (Gantt pondéré durée, tâches feuilles)`,
    },
    {
      label: "Qualité",
      max: MASTER_INDEX_WEIGHTS.quality,
      raw: inputs.qualityScore,
      detail: "Réserves + checklists locaux (pas de bonus automatique à 100 % sans données)",
    },
    {
      label: "Approvisionnements",
      max: MASTER_INDEX_WEIGHTS.procurement,
      raw: inputs.procurementScore,
      detail: "Lignes appro. ou statut équipements (to_define / bloqué exclus)",
    },
    {
      label: "Technique",
      max: MASTER_INDEX_WEIGHTS.technical,
      raw: inputs.technicalScore,
      detail: "55 % planning lots MEP · 20 % fluides médicaux · 25 % avancement locaux",
    },
    {
      label: "Financier",
      max: MASTER_INDEX_WEIGHTS.financial,
      raw: inputs.financialScore,
      detail: financialNote,
    },
    {
      label: "DOE / Docs",
      max: MASTER_INDEX_WEIGHTS.documentation,
      raw: inputs.documentationScore,
      detail: "Part des documents actifs validés (approved)",
    },
  ];

  return (
    <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
      <summary className="cursor-pointer font-medium text-[#003F72]">
        Méthode de calcul de l&apos;indice
      </summary>
      <ul className="mt-3 space-y-2 text-slate-600">
        {rows.map((r) => (
          <li key={r.label}>
            <span className="font-medium text-slate-800">{r.label}</span>
            {" — "}
            score {r.raw.toFixed(1)}/100 → {((r.raw / 100) * r.max).toFixed(1)}/{r.max} pt
            <br />
            <span className="text-xs text-slate-500">{r.detail}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
