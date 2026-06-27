import type { NassibBundle } from "@/types/nassib";

/**
 * Registre des jeux de données exportables.
 *
 * Source unique de vérité partagée par les trois formats (Excel / PDF / CSV) :
 * chaque module déclare ses colonnes une seule fois, les générateurs s'appuient
 * dessus. Ajouter un export = ajouter une entrée ici.
 */

export type ColumnType = "text" | "number" | "currency" | "date" | "bool" | "pct";

export interface ExportColumn {
  header: string;
  /** Clé dans l'objet ligne renvoyé par `rows` */
  key: string;
  /** Largeur indicative (caractères) — utilisée par Excel */
  width?: number;
  type?: ColumnType;
}

export interface ExportDataset {
  key: string;
  /** Titre lisible (onglet Excel, en-tête PDF) */
  title: string;
  /** Nom d'onglet Excel (<= 31 caractères, sans caractères interdits) */
  sheetName: string;
  columns: ExportColumn[];
  rows: (bundle: NassibBundle) => Record<string, unknown>[];
}

const CURRENCY = "FDJ";

function statusLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export const EXPORT_DATASETS: Record<string, ExportDataset> = {
  reserves: {
    key: "reserves",
    title: "Réserves chantier",
    sheetName: "Réserves",
    columns: [
      { header: "N°", key: "number", width: 12 },
      { header: "Date", key: "date", width: 12, type: "date" },
      { header: "Local", key: "roomCode", width: 12 },
      { header: "Zone", key: "zone", width: 18 },
      { header: "Lot", key: "lotCode", width: 12 },
      { header: "Entreprise", key: "company", width: 22 },
      { header: "Intitulé", key: "title", width: 40 },
      { header: "Gravité", key: "severity", width: 12 },
      { header: "Statut", key: "status", width: 14 },
      { header: "Échéance", key: "dueDate", width: 12, type: "date" },
      { header: "Bloque réception", key: "blocksReception", width: 16, type: "bool" },
    ],
    rows: (b) =>
      b.reserves.map((r) => ({
        number: r.number,
        date: r.date,
        roomCode: r.roomCode ?? "",
        zone: r.zone,
        lotCode: r.lotCode,
        company: r.company,
        title: r.title,
        severity: r.severity,
        status: statusLabel(r.status),
        dueDate: r.dueDate,
        blocksReception: r.blocksReception,
      })),
  },

  boq: {
    key: "boq",
    title: "BOQ / Bordereau quantitatif",
    sheetName: "BOQ",
    columns: [
      { header: "Lot", key: "lotCode", width: 12 },
      { header: "Code", key: "code", width: 14 },
      { header: "Désignation", key: "description", width: 44 },
      { header: "Unité", key: "unit", width: 8 },
      { header: "Qté contrat", key: "qtyContract", width: 12, type: "number" },
      { header: "PU", key: "unitPrice", width: 14, type: "currency" },
      { header: "Montant contrat", key: "amountContract", width: 16, type: "currency" },
      { header: "Qté exécutée", key: "qtyExecuted", width: 12, type: "number" },
      { header: "Qté validée", key: "qtyValidated", width: 12, type: "number" },
      { header: "Paiement demandé", key: "paymentRequested", width: 16, type: "currency" },
      { header: "Paiement approuvé", key: "paymentApproved", width: 16, type: "currency" },
      { header: "Paiement payé", key: "paymentPaid", width: 16, type: "currency" },
      { header: "Retenue %", key: "retentionPct", width: 10, type: "pct" },
    ],
    rows: (b) =>
      b.boq.map((l) => ({
        lotCode: l.lotCode,
        code: l.code,
        description: l.description,
        unit: l.unit,
        qtyContract: l.qtyContract,
        unitPrice: l.unitPrice,
        amountContract: l.qtyContract * l.unitPrice,
        qtyExecuted: l.qtyExecuted,
        qtyValidated: l.qtyValidated,
        paymentRequested: l.paymentRequested,
        paymentApproved: l.paymentApproved,
        paymentPaid: l.paymentPaid,
        retentionPct: l.retentionPct,
      })),
  },

  equipements: {
    key: "equipements",
    title: "Équipements biomédicaux",
    sheetName: "Équipements",
    columns: [
      { header: "Code", key: "assetCode", width: 14 },
      { header: "Désignation", key: "name", width: 36 },
      { header: "Service", key: "service", width: 22 },
      { header: "Local", key: "roomCode", width: 12 },
      { header: "Marque", key: "brand", width: 16 },
      { header: "Modèle", key: "model", width: 16 },
      { header: "Qté", key: "qty", width: 8, type: "number" },
      { header: "Fournisseur", key: "supplier", width: 22 },
      { header: "PU", key: "unitPrice", width: 14, type: "currency" },
      { header: "Statut", key: "status", width: 16 },
      { header: "Phase install.", key: "installPhase", width: 16 },
      { header: "Livraison prévue", key: "expectedDelivery", width: 14, type: "date" },
    ],
    rows: (b) =>
      b.equipment.map((e) => ({
        assetCode: e.assetCode,
        name: e.name,
        service: e.service,
        roomCode: e.roomCode ?? "",
        brand: e.brand,
        model: e.model,
        qty: e.qty,
        supplier: e.supplier,
        unitPrice: e.unitPrice ?? "",
        status: statusLabel(e.status),
        installPhase: statusLabel(String(e.installPhase)),
        expectedDelivery: e.expectedDelivery ?? "",
      })),
  },

  tests: {
    key: "tests",
    title: "Essais & réception",
    sheetName: "Essais",
    columns: [
      { header: "Système", key: "system", width: 28 },
      { header: "Zone", key: "zone", width: 18 },
      { header: "Lot", key: "lotCode", width: 12 },
      { header: "Local", key: "roomCode", width: 12 },
      { header: "Norme", key: "normReference", width: 20 },
      { header: "Date prévue", key: "plannedDate", width: 14, type: "date" },
      { header: "Date réelle", key: "actualDate", width: 14, type: "date" },
      { header: "Responsable", key: "responsible", width: 22 },
      { header: "Résultat", key: "result", width: 14 },
      { header: "Réserves liées", key: "reservesLinked", width: 12, type: "number" },
    ],
    rows: (b) =>
      b.tests.map((t) => ({
        system: t.system,
        zone: t.zone,
        lotCode: t.lotCode,
        roomCode: t.roomCode ?? "",
        normReference: t.normReference,
        plannedDate: t.plannedDate,
        actualDate: t.actualDate ?? "",
        responsible: t.responsible,
        result: statusLabel(t.result),
        reservesLinked: t.reservesLinked,
      })),
  },

  approvisionnements: {
    key: "approvisionnements",
    title: "Approvisionnements",
    sheetName: "Approvisionnements",
    columns: [
      { header: "Référence", key: "reference", width: 16 },
      { header: "Lot", key: "lotCode", width: 12 },
      { header: "Désignation", key: "description", width: 40 },
      { header: "Fournisseur", key: "supplier", width: 22 },
      { header: "Qté", key: "qty", width: 8, type: "number" },
      { header: "Date prévue", key: "expectedDate", width: 14, type: "date" },
      { header: "Date réelle", key: "actualDate", width: 14, type: "date" },
      { header: "Statut", key: "status", width: 16 },
      { header: "Criticité", key: "criticality", width: 12 },
      { header: "Étape import", key: "oddStep", width: 12, type: "number" },
      { header: "Montant HT", key: "boqAmountHt", width: 16, type: "currency" },
    ],
    rows: (b) =>
      b.procurement.map((p) => ({
        reference: p.reference,
        lotCode: p.lotCode,
        description: p.description,
        supplier: p.supplier,
        qty: p.qty,
        expectedDate: p.expectedDate,
        actualDate: p.actualDate ?? "",
        status: statusLabel(p.status),
        criticality: p.criticality,
        oddStep: p.oddStep,
        boqAmountHt: p.boqAmountHt ?? "",
      })),
  },

  planning: {
    key: "planning",
    title: "Planning — tâches",
    sheetName: "Planning",
    columns: [
      { header: "WBS", key: "wbsCode", width: 12 },
      { header: "Tâche", key: "name", width: 44 },
      { header: "Lot", key: "lotCode", width: 12 },
      { header: "Local", key: "roomCode", width: 12 },
      { header: "Responsable", key: "responsible", width: 22 },
      { header: "Entreprise", key: "company", width: 22 },
      { header: "Statut", key: "status", width: 14 },
      { header: "Avancement", key: "progressPct", width: 12, type: "pct" },
      { header: "Début prévu", key: "plannedStart", width: 14, type: "date" },
      { header: "Fin prévue", key: "plannedEnd", width: 14, type: "date" },
    ],
    rows: (b) =>
      b.tasks.map((t) => ({
        wbsCode: t.wbsCode ?? "",
        name: t.name,
        lotCode: t.lotCode ?? "",
        roomCode: t.roomCode ?? "",
        responsible: t.responsible ?? "",
        company: t.company ?? "",
        status: statusLabel(t.status),
        progressPct: t.progressPct,
        plannedStart: t.plannedStart,
        plannedEnd: t.plannedEnd,
      })),
  },

  projet: {
    key: "projet",
    title: "Synthèse projet",
    sheetName: "Synthèse",
    columns: [
      { header: "Indicateur", key: "label", width: 32 },
      { header: "Valeur", key: "value", width: 40 },
    ],
    rows: (b) => {
      const p = b.project;
      return [
        { label: "Projet", value: p.name },
        { label: "Code", value: p.code },
        { label: "Maître d'ouvrage", value: p.client },
        { label: "Localisation", value: p.location },
        { label: "Statut", value: statusLabel(p.status) },
        { label: `Montant marché (${CURRENCY})`, value: p.contractAmount },
        { label: `Budget consommé (${CURRENCY})`, value: p.budgetConsumed },
        { label: "Avancement planifié (%)", value: p.progressPlanned },
        { label: "Avancement réel (%)", value: p.progressActual },
        { label: "Début contractuel", value: p.schedule.contractStart },
        { label: "Fin contractuelle", value: p.schedule.contractEnd },
        { label: "Fin prévisionnelle", value: p.schedule.forecastEnd },
        { label: "Marge (jours)", value: p.schedule.marginDays },
        { label: "Niveau de risque", value: p.schedule.riskLevel },
        { label: "Nombre de locaux", value: b.rooms.length },
        { label: "Nombre de réserves", value: b.reserves.length },
        { label: "Réserves bloquant réception", value: b.reserves.filter((r) => r.blocksReception).length },
        { label: "Lignes BOQ", value: b.boq.length },
        { label: "Équipements", value: b.equipment.length },
        { label: "Essais", value: b.tests.length },
      ];
    },
  },
};

export const EXPORT_DATASET_KEYS = Object.keys(EXPORT_DATASETS);

export function getDataset(key: string): ExportDataset | undefined {
  return EXPORT_DATASETS[key];
}
