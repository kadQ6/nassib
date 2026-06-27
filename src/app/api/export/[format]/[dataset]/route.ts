import { NextResponse } from "next/server";
import { getNassibBundle } from "@/lib/nassib";
import {
  EXPORT_DATASET_KEYS,
  getDataset,
} from "@/lib/export/datasets";
import { rowsToCsv } from "@/lib/export/format";
import { buildWorkbook } from "@/lib/export/excel";
import { buildPdf } from "@/lib/export/pdf";

type Format = "xlsx" | "pdf" | "csv";

const CONTENT_TYPE: Record<Format, string> = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
  csv: "text/csv; charset=utf-8",
};

/**
 * Export multi-format des modules.
 *
 *   GET /api/export/xlsx/reserves
 *   GET /api/export/pdf/boq,equipements
 *   GET /api/export/csv/all
 *
 * `dataset` accepte une clé, plusieurs clés séparées par des virgules, ou `all`.
 * Excel et PDF regroupent les jeux demandés ; CSV ne traite que le premier.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ format: string; dataset: string }> },
) {
  const { format, dataset } = await params;

  if (format !== "xlsx" && format !== "pdf" && format !== "csv") {
    return NextResponse.json(
      { error: `Format inconnu: ${format}. Attendu: xlsx, pdf ou csv.` },
      { status: 400 },
    );
  }

  const requested =
    dataset === "all"
      ? EXPORT_DATASET_KEYS
      : dataset.split(",").map((k) => k.trim()).filter(Boolean);

  const keys = requested.filter((k) => getDataset(k));
  if (keys.length === 0) {
    return NextResponse.json(
      {
        error: `Aucun jeu de données valide: ${dataset}.`,
        available: EXPORT_DATASET_KEYS,
      },
      { status: 404 },
    );
  }

  const bundle = getNassibBundle();
  const stamp = new Date().toISOString().slice(0, 10);
  const slug = dataset === "all" ? "complet" : keys.join("-");
  const filename = `NASSIB-${slug}-${stamp}.${format}`;

  let body: Buffer | string;
  try {
    if (format === "csv") {
      const ds = getDataset(keys[0])!;
      body = rowsToCsv(ds.columns, ds.rows(bundle));
    } else if (format === "xlsx") {
      body = await buildWorkbook(keys, bundle);
    } else {
      body = buildPdf(keys, bundle);
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de génération" },
      { status: 500 },
    );
  }

  return new NextResponse(body as BodyInit, {
    headers: {
      "Content-Type": CONTENT_TYPE[format],
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
