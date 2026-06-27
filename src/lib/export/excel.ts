import ExcelJS from "exceljs";
import type { NassibBundle } from "@/types/nassib";
import { getDataset, type ExportDataset } from "./datasets";
import { toNumber } from "./format";

const ACCENT = "FF0F4C81"; // bleu Nassib
const HEADER_TEXT = "FFFFFFFF";

const NUMBER_FORMATS: Record<string, string> = {
  currency: "#,##0",
  number: "#,##0.###",
  pct: '0"%"',
};

function addSheet(workbook: ExcelJS.Workbook, dataset: ExportDataset, bundle: NassibBundle) {
  const sheet = workbook.addWorksheet(dataset.sheetName, {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = dataset.columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width ?? 18,
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: HEADER_TEXT } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT } };
  headerRow.alignment = { vertical: "middle", horizontal: "left" };

  for (const row of dataset.rows(bundle)) {
    const cells: Record<string, unknown> = {};
    for (const col of dataset.columns) {
      const raw = row[col.key];
      if (col.type === "currency" || col.type === "number" || col.type === "pct") {
        const n = toNumber(raw);
        cells[col.key] = n ?? raw ?? "";
      } else if (col.type === "bool") {
        cells[col.key] = raw ? "Oui" : "Non";
      } else {
        cells[col.key] = raw ?? "";
      }
    }
    const added = sheet.addRow(cells);
    for (let i = 0; i < dataset.columns.length; i++) {
      const col = dataset.columns[i];
      const fmt = col.type ? NUMBER_FORMATS[col.type] : undefined;
      if (fmt) added.getCell(i + 1).numFmt = fmt;
    }
  }

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: dataset.columns.length },
  };

  return sheet;
}

/**
 * Construit un classeur Excel : un onglet par jeu de données.
 * Les clés inconnues sont ignorées.
 */
export async function buildWorkbook(
  datasetKeys: string[],
  bundle: NassibBundle,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ARCHI HOSP — Polyclinique Nassib";
  workbook.created = new Date();

  let added = 0;
  for (const key of datasetKeys) {
    const dataset = getDataset(key);
    if (!dataset) continue;
    addSheet(workbook, dataset, bundle);
    added++;
  }

  if (added === 0) {
    throw new Error("Aucun jeu de données valide à exporter");
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
