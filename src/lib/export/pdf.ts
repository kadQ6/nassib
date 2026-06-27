import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { NassibBundle } from "@/types/nassib";
import { getDataset, type ExportDataset } from "./datasets";
import { formatCell } from "./format";

const ACCENT: [number, number, number] = [15, 76, 129]; // bleu Nassib

function renderDataset(doc: jsPDF, dataset: ExportDataset, bundle: NassibBundle, isFirst: boolean) {
  if (!isFirst) doc.addPage();

  doc.setFontSize(14);
  doc.setTextColor(...ACCENT);
  doc.text(dataset.title, 40, 40);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Polyclinique Nassib — ARCHI HOSP", 40, 56);

  const rows = dataset.rows(bundle);
  const head = [dataset.columns.map((c) => c.header)];
  const body = rows.map((row) =>
    dataset.columns.map((c) => formatCell(row[c.key], c.type)),
  );

  autoTable(doc, {
    head,
    body,
    startY: 70,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: ACCENT, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [243, 246, 250] },
  });

  if (rows.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Aucune donnée.", 40, 90);
  }
}

/**
 * Construit un PDF paysage : une section (page+) par jeu de données.
 * Les clés inconnues sont ignorées.
 */
export function buildPdf(datasetKeys: string[], bundle: NassibBundle): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const valid = datasetKeys.map(getDataset).filter((d): d is ExportDataset => Boolean(d));
  if (valid.length === 0) {
    throw new Error("Aucun jeu de données valide à exporter");
  }

  valid.forEach((dataset, i) => renderDataset(doc, dataset, bundle, i === 0));

  // Pied de page : pagination
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.text(`Page ${i} / ${pageCount}`, w - 90, h - 20);
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
