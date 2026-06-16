import type { NassibProcurement } from "@/types/nassib";

/** Circuit logistique interne polyclinique (après dédouanement) */
export const INTERNAL_FLOW_STEPS = [
  "Réception quai chantier",
  "Contrôle quantitatif / qualité",
  "Étiquetage inventaire GMAO",
  "Mise en stock magasin central",
  "Préparation colis service",
  "Transfert vers local cible",
  "Réception par le service",
  "Mise en place / installation",
] as const;

export const LOGISTICS_STATUS_LABELS: Record<string, string> = {
  site_reception: "Réception quai",
  qty_check: "Contrôle qualité",
  labeled: "Étiqueté GMAO",
  in_central_stock: "Stock central",
  pick_prepared: "Colis préparé",
  in_transit_internal: "Transfert interne",
  received_service: "Réception service",
  in_place: "En place",
};

export const LOGISTICS_CATEGORY_LABELS: Record<string, string> = {
  clinical_dm: "DM clinique",
  medical_furniture: "Mobilier médical",
  office_furniture: "Mobilier bureau",
  zone_supply: "Approvisionnement zone",
};

/** Statuts approvisionnement ouvrant le circuit logistique interne */
export const PROCUREMENT_VALIDATED_STATUSES = [
  "customs_cleared",
  "in_transit_site",
  "received",
  "installed",
] as const;

/**
 * Commande validée pour logistique = dédouanement ODD validé (étape ≥ 11)
 * ou statut explicite post-dédouanement.
 */
export function isProcurementValidatedForLogistics(
  proc: NassibProcurement,
): boolean {
  return (
    proc.oddStep >= 11 ||
    PROCUREMENT_VALIDATED_STATUSES.includes(
      proc.status as (typeof PROCUREMENT_VALIDATED_STATUSES)[number],
    )
  );
}

export function flowStepLabel(step: number): string {
  return INTERNAL_FLOW_STEPS[Math.min(Math.max(step, 1), 8) - 1] ?? INTERNAL_FLOW_STEPS[0];
}

export function logisticsStatusToFlowStep(status: string): number {
  switch (status) {
    case "site_reception":
      return 1;
    case "qty_check":
      return 2;
    case "labeled":
      return 3;
    case "in_central_stock":
      return 4;
    case "pick_prepared":
      return 5;
    case "in_transit_internal":
      return 6;
    case "received_service":
      return 7;
    case "in_place":
      return 8;
    default:
      return 1;
  }
}

export function logisticsStatusFromProcurement(
  proc: NassibProcurement,
): string {
  if (proc.status === "installed") return "in_place";
  if (proc.oddStep >= 13 || proc.status === "received") return "in_central_stock";
  if (proc.oddStep >= 12 || proc.status === "in_transit_site") {
    return "site_reception";
  }
  return "site_reception";
}

export function equipmentStatusToLogisticsStatus(eqStatus: string): string {
  switch (eqStatus) {
    case "delivered":
      return "site_reception";
    case "installed":
    case "tested":
    case "commissioned":
    case "accepted":
    case "validated":
      return "in_place";
    case "in_transit":
      return "in_transit_internal";
    default:
      return "site_reception";
  }
}

/** @deprecated use isProcurementValidatedForLogistics */
export function procurementReadyForLogistics(oddStep: number): boolean {
  return oddStep >= 11;
}
