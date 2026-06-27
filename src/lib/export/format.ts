import type { ColumnType, ExportColumn } from "./datasets";

/** Coerce une valeur brute en nombre, ou null si non numérique. */
export function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** Représentation texte d'une cellule (CSV / PDF). */
export function formatCell(value: unknown, type: ColumnType = "text"): string {
  if (value === null || value === undefined || value === "") return "";

  switch (type) {
    case "bool":
      return value ? "Oui" : "Non";
    case "currency": {
      const n = toNumber(value);
      return n === null ? String(value) : n.toLocaleString("fr-FR");
    }
    case "number": {
      const n = toNumber(value);
      return n === null ? String(value) : n.toLocaleString("fr-FR");
    }
    case "pct": {
      const n = toNumber(value);
      return n === null ? String(value) : `${n}%`;
    }
    default:
      return String(value);
  }
}

/** Échappement d'une valeur pour une cellule CSV (RFC 4180). */
export function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function rowsToCsv(columns: ExportColumn[], rows: Record<string, unknown>[]): string {
  const header = columns.map((c) => csvEscape(c.header)).join(",");
  const body = rows.map((row) =>
    columns.map((c) => csvEscape(formatCell(row[c.key], c.type))).join(","),
  );
  return [header, ...body].join("\r\n");
}
