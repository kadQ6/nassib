import { describe, it, expect } from "vitest";
import { getNassibBundle } from "@/lib/nassib";
import {
  EXPORT_DATASETS,
  EXPORT_DATASET_KEYS,
  getDataset,
} from "./datasets";

const bundle = getNassibBundle();

describe("registre des datasets", () => {
  it("expose au moins les modules clés", () => {
    for (const key of ["reserves", "boq", "equipements", "tests", "projet"]) {
      expect(EXPORT_DATASET_KEYS).toContain(key);
    }
  });

  it("getDataset renvoie undefined pour une clé inconnue", () => {
    expect(getDataset("inexistant")).toBeUndefined();
  });
});

describe("intégrité de chaque dataset", () => {
  for (const ds of Object.values(EXPORT_DATASETS)) {
    describe(ds.key, () => {
      it("a un titre, un nom d'onglet <= 31 car. et des colonnes", () => {
        expect(ds.title.length).toBeGreaterThan(0);
        expect(ds.sheetName.length).toBeGreaterThan(0);
        expect(ds.sheetName.length).toBeLessThanOrEqual(31);
        expect(ds.columns.length).toBeGreaterThan(0);
      });

      it("des clés de colonnes uniques", () => {
        const keys = ds.columns.map((c) => c.key);
        expect(new Set(keys).size).toBe(keys.length);
      });

      it("produit des lignes dont les clés couvrent les colonnes", () => {
        const rows = ds.rows(bundle);
        expect(Array.isArray(rows)).toBe(true);
        const sample = rows[0];
        if (sample) {
          for (const col of ds.columns) {
            expect(sample).toHaveProperty(col.key);
          }
        }
      });
    });
  }
});

describe("dataset réserves", () => {
  it("reflète le nombre de réserves du bundle", () => {
    const rows = getDataset("reserves")!.rows(bundle);
    expect(rows.length).toBe(bundle.reserves.length);
  });
});
