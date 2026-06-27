import { describe, it, expect } from "vitest";
import { toNumber, formatCell, csvEscape, rowsToCsv } from "./format";
import type { ExportColumn } from "./datasets";

describe("toNumber", () => {
  it("garde les nombres finis", () => {
    expect(toNumber(42)).toBe(42);
    expect(toNumber(0)).toBe(0);
  });
  it("parse les chaînes numériques", () => {
    expect(toNumber("1500")).toBe(1500);
  });
  it("rejette le non-numérique", () => {
    expect(toNumber("")).toBeNull();
    expect(toNumber("abc")).toBeNull();
    expect(toNumber(NaN)).toBeNull();
    expect(toNumber(undefined)).toBeNull();
  });
});

describe("formatCell", () => {
  it("formate les booléens en Oui/Non", () => {
    expect(formatCell(true, "bool")).toBe("Oui");
    expect(formatCell(false, "bool")).toBe("Non");
  });
  it("rend vide les valeurs nulles", () => {
    expect(formatCell(null)).toBe("");
    expect(formatCell(undefined)).toBe("");
    expect(formatCell("")).toBe("");
  });
  it("ajoute le suffixe pourcent", () => {
    expect(formatCell(75, "pct")).toBe("75%");
  });
  it("formate les nombres en locale fr", () => {
    expect(formatCell(1500, "currency")).toBe((1500).toLocaleString("fr-FR"));
  });
});

describe("csvEscape", () => {
  it("entoure les valeurs avec virgule/guillemet/saut de ligne", () => {
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape('dit "bonjour"')).toBe('"dit ""bonjour"""');
    expect(csvEscape("simple")).toBe("simple");
  });
});

describe("rowsToCsv", () => {
  const cols: ExportColumn[] = [
    { header: "Nom", key: "name" },
    { header: "Montant", key: "amount", type: "currency" },
    { header: "Bloque", key: "blocks", type: "bool" },
  ];
  it("génère en-tête + lignes avec CRLF", () => {
    const csv = rowsToCsv(cols, [{ name: "Lot A", amount: 1000, blocks: true }]);
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe("Nom,Montant,Bloque");
    expect(lines[1]).toContain("Lot A");
    expect(lines[1]).toContain("Oui");
  });
  it("échappe les champs contenant des virgules", () => {
    const csv = rowsToCsv([{ header: "T", key: "t" }], [{ t: "x, y" }]);
    expect(csv).toContain('"x, y"');
  });
});
