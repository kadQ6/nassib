"use client";

import { useMemo, useState } from "react";
import type { BoqLine } from "@/types/nassib";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fdj = (n: number) => formatCurrency(n, "DJF");

const LOT_LABELS: Record<string, string> = {
  "LOT-GO": "Génie civil",
  "LOT-CFO": "CFO",
  "LOT-CFA": "CFA / VDI",
  "LOT-CCTV": "Vidéosurveillance",
  "LOT-SSI": "SSI",
  "LOT-CVC": "CVC",
  "LOT-PLOMB": "Plomberie / fluides",
  "LOT-FLUIDES": "Fluides médicaux",
  "LOT-DIVERS": "Divers",
};

type Props = {
  lines: BoqLine[];
};

export function BoqDetailTable({ lines }: Props) {
  const [lotFilter, setLotFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const lots = useMemo(() => {
    const codes = [...new Set(lines.map((l) => l.lotCode))];
    return codes.sort();
  }, [lines]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lines.filter((line) => {
      if (lotFilter !== "all" && line.lotCode !== lotFilter) return false;
      if (!q) return true;
      return (
        line.code.toLowerCase().includes(q) ||
        line.description.toLowerCase().includes(q) ||
        line.lotCode.toLowerCase().includes(q)
      );
    });
  }, [lines, lotFilter, query]);

  const filteredTotal = filtered.reduce(
    (sum, line) => sum + line.qtyContract * line.unitPrice,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={lotFilter === "all" ? "default" : "outline"}
          onClick={() => setLotFilter("all")}
        >
          Tous ({lines.length})
        </Button>
        {lots.map((lot) => {
          const count = lines.filter((l) => l.lotCode === lot).length;
          return (
            <Button
              key={lot}
              type="button"
              size="sm"
              variant={lotFilter === lot ? "default" : "outline"}
              onClick={() => setLotFilter(lot)}
            >
              {LOT_LABELS[lot] ?? lot} ({count})
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          placeholder="Rechercher code ou description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 min-w-[240px] rounded-md border border-slate-200 px-3 text-sm"
        />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Badge variant="info">{filtered.length} ligne(s)</Badge>
          <span>Sous-total affiché : {fdj(filteredTotal)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2 pr-3">Lot</th>
              <th className="py-2 pr-3">Code</th>
              <th className="py-2 pr-3">Description</th>
              <th className="py-2 pr-3">Qté</th>
              <th className="py-2 pr-3">Unité</th>
              <th className="py-2 pr-3">PU HT</th>
              <th className="py-2">Montant HT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((line) => (
              <tr key={line.id} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-mono text-xs">{line.lotCode}</td>
                <td className="py-2 pr-3 font-mono text-xs">{line.code}</td>
                <td className="py-2 pr-3">{line.description}</td>
                <td className="py-2 pr-3">{line.qtyContract}</td>
                <td className="py-2 pr-3">{line.unit}</td>
                <td className="py-2 pr-3">{fdj(line.unitPrice)}</td>
                <td className="py-2">{fdj(line.qtyContract * line.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
