import { describe, it, expect } from "vitest";
import { getNassibBundle } from "@/lib/nassib";
import { buildWorkbook } from "./excel";
import { buildPdf } from "./pdf";
import { EXPORT_DATASET_KEYS } from "./datasets";

const bundle = getNassibBundle();

describe("buildWorkbook (Excel)", () => {
  it("produit un buffer .xlsx valide (signature ZIP 'PK')", async () => {
    const buf = await buildWorkbook(["reserves", "boq"], bundle);
    expect(buf.length).toBeGreaterThan(0);
    expect(buf[0]).toBe(0x50); // P
    expect(buf[1]).toBe(0x4b); // K
  });

  it("ignore les clés inconnues mais garde les valides", async () => {
    const buf = await buildWorkbook(["reserves", "nimporte"], bundle);
    expect(buf.length).toBeGreaterThan(0);
  });

  it("génère le classeur complet", async () => {
    const buf = await buildWorkbook(EXPORT_DATASET_KEYS, bundle);
    expect(buf.length).toBeGreaterThan(0);
  });

  it("lève si aucune clé valide", async () => {
    await expect(buildWorkbook(["xxx"], bundle)).rejects.toThrow();
  });
});

describe("buildPdf", () => {
  it("produit un buffer PDF valide (en-tête '%PDF')", () => {
    const buf = buildPdf(["reserves", "projet"], bundle);
    expect(buf.length).toBeGreaterThan(0);
    expect(buf.subarray(0, 4).toString("latin1")).toBe("%PDF");
  });

  it("lève si aucune clé valide", () => {
    expect(() => buildPdf(["xxx"], bundle)).toThrow();
  });
});
