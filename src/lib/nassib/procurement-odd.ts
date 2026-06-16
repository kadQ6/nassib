/** Processus import Djibouti — ODD (13 étapes) */
export const ODD_STEPS = [
  "Besoin identifié / ligne BOQ",
  "Validation technique MOE",
  "Conformité désignation technique vs BOQ",
  "Demande de cotation",
  "Bon de commande émis",
  "Paiement avance / LC si import",
  "Fabrication / expédition",
  "Documents expédition (BL, PL, CI, CO)",
  "Dossier dédouanement (ODD Djibouti)",
  "Demande dédouanement déposée",
  "Dédouanement validé",
  "Transport site / réception chantier",
  "Contrôle réception & mise en stock",
] as const;

export const PROCUREMENT_STATUS_LABELS: Record<string, string> = {
  need_identified: "Besoin identifié",
  tech_pending: "Validation technique",
  boq_check: "Conformité BOQ",
  quotation: "Cotation",
  ordered: "Commandé",
  advance_paid: "Avance / LC",
  manufacturing: "Fabrication",
  shipped: "Expédition",
  customs_file: "Dossier ODD",
  customs_pending: "Dédouanement en cours",
  customs_cleared: "Dédouané",
  in_transit_site: "Transport site",
  received: "Réceptionné",
  installed: "Installé",
};

export function oddStepLabel(step: number): string {
  return ODD_STEPS[Math.min(Math.max(step, 1), 13) - 1] ?? ODD_STEPS[0];
}

export function equipmentStatusToProcurementStatus(
  eqStatus: string,
): string {
  switch (eqStatus) {
    case "to_define":
      return "need_identified";
    case "spec_pending":
      return "tech_pending";
    case "ordered":
      return "ordered";
    case "manufacturing":
      return "manufacturing";
    case "in_transit":
      return "shipped";
    case "customs":
      return "customs_pending";
    case "delivered":
      return "received";
    case "installed":
    case "tested":
    case "commissioned":
    case "accepted":
    case "validated":
      return "installed";
    case "blocked":
      return "need_identified";
    default:
      return "need_identified";
  }
}

export function procurementStatusToOddStep(status: string): number {
  switch (status) {
    case "need_identified":
      return 1;
    case "tech_pending":
      return 2;
    case "boq_check":
      return 3;
    case "quotation":
      return 4;
    case "ordered":
      return 5;
    case "advance_paid":
      return 6;
    case "manufacturing":
      return 7;
    case "shipped":
      return 8;
    case "customs_file":
      return 9;
    case "customs_pending":
      return 10;
    case "customs_cleared":
      return 11;
    case "in_transit_site":
      return 12;
    case "received":
    case "installed":
      return 13;
    default:
      return 1;
  }
}

export function isProcurementOnTrack(status: string): boolean {
  return ["received", "installed", "customs_cleared", "in_transit_site"].includes(
    status,
  );
}
