import type { MedicalGasNetwork } from "@/types/nassib";

export const MEDICAL_GAS_CHECKLIST_LABELS: Record<string, string> = {
  plan_validated: "Plan validé",
  reservations_validated: "Réservations validées",
  network_installed: "Réseau posé",
  brazing_done: "Brasage terminé",
  pressure_test: "Test pression",
  leak_test: "Test étanchéité",
  labeling_done: "Repérage",
  outlets_installed: "Prises installées",
  gas_analysis: "Analyse qualité gaz",
  pv_signed: "PV signé",
  doe_delivered: "DOE remis",
};

export function medicalGasTypeLabel(type: MedicalGasNetwork["type"]): string {
  if (type === "vacuum") return "Vide médical";
  if (type === "medical_air") return "Air médical";
  return type;
}

export function computeMedicalGasProgress(net: MedicalGasNetwork): number {
  const entries = Object.values(net.checklist);
  if (entries.length === 0) return 0;
  const done = entries.filter(Boolean).length;
  return Math.round((done / entries.length) * 100);
}

export function medicalGasKpis(networks: MedicalGasNetwork[]) {
  const total = networks.length;
  const avgProgress =
    total > 0
      ? Math.round(
          networks.reduce((s, n) => s + n.progressPct, 0) / total,
        )
      : 0;
  const outletsPlanned = networks.reduce((s, n) => s + n.outletsPlanned, 0);
  const outletsInstalled = networks.reduce((s, n) => s + n.outletsInstalled, 0);
  const checklistDone = networks.reduce(
    (s, n) => s + Object.values(n.checklist).filter(Boolean).length,
    0,
  );
  const checklistTotal = networks.reduce(
    (s, n) => s + Object.keys(n.checklist).length,
    0,
  );
  return {
    total,
    avgProgress,
    outletsPlanned,
    outletsInstalled,
    checklistDone,
    checklistTotal,
  };
}
