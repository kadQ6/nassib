"use client";

import { useMemo, useState, useTransition } from "react";
import { updateEquipmentAction } from "@/app/actions/equipment";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { INVENTORY_KIND_LABELS } from "@/lib/nassib/inventory-rules";
import { formatCurrency } from "@/lib/utils";
import type { InventoryKind, NassibEquipment } from "@/types/nassib";

export function InventoryFinancePrep({
  equipment,
  initialRoomFilter,
}: {
  equipment: NassibEquipment[];
  initialRoomFilter?: string;
}) {
  const [items, setItems] = useState(equipment);
  const [roomFilter, setRoomFilter] = useState(initialRoomFilter ?? "all");
  const [, startTransition] = useTransition();

  const roomCodes = useMemo(
    () => [...new Set(items.map((e) => e.roomCode).filter(Boolean))].sort() as string[],
    [items],
  );

  const filtered = useMemo(() => {
    if (roomFilter === "all") return items;
    return items.filter((e) => e.roomCode === roomFilter);
  }, [items, roomFilter]);

  const totalEstimate = useMemo(
    () =>
      filtered.reduce((s, eq) => s + (eq.unitPrice ?? 0) * eq.qty, 0),
    [filtered],
  );

  function patchField(
    id: string,
    field: "brand" | "model" | "unitPrice" | "supplier",
    value: string,
  ) {
    const patch =
      field === "unitPrice"
        ? { unitPrice: value === "" ? null : Number(value) }
        : { [field]: value };
    startTransition(async () => {
      await updateEquipmentAction(id, patch);
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      );
    });
  }

  const byKind = useMemo(() => {
    const m: Record<InventoryKind, number> = {
      biomedical: 0,
      medical_furniture: 0,
      office_furniture: 0,
    };
    for (const eq of filtered) m[eq.inventoryKind]++;
    return m;
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#0891B2]/30 bg-[#0891B2]/5 p-4 text-sm">
        <p className="font-medium text-[#003F72]">Préparation financière</p>
        <p className="mt-1 text-slate-600">
          Saisissez marque, modèle et prix unitaire pour chaque ligne. Les montants
          restent vides tant que vous n&apos;avez pas choisi les références — aucun
          prix n&apos;est pré-rempli.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          {(Object.keys(byKind) as InventoryKind[]).map((k) => (
            <span key={k}>
              {INVENTORY_KIND_LABELS[k]} : <strong>{byKind[k]}</strong>
            </span>
          ))}
          <span>
            Total saisi : <strong>{formatCurrency(totalEstimate)}</strong>
          </span>
        </div>
      </div>

      <select
        className="h-9 rounded-md border px-2 text-sm"
        value={roomFilter}
        onChange={(e) => setRoomFilter(e.target.value)}
      >
        <option value="all">Tous les locaux</option>
        {roomCodes.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-[#003F72] text-left text-white">
            <tr>
              <th className="p-2 font-medium">Local</th>
              <th className="p-2 font-medium">Catégorie</th>
              <th className="p-2 font-medium">Désignation</th>
              <th className="p-2 font-medium">Marque</th>
              <th className="p-2 font-medium">Modèle</th>
              <th className="p-2 font-medium">Fournisseur</th>
              <th className="p-2 font-medium">PU HT (FDJ)</th>
              <th className="p-2 font-medium">Qté</th>
              <th className="p-2 font-medium">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq, i) => {
              const lineTotal = (eq.unitPrice ?? 0) * eq.qty;
              return (
                <tr
                  key={eq.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}
                >
                  <td className="p-2 font-medium">{eq.roomCode}</td>
                  <td className="p-2">
                    <Badge variant="default">
                      {INVENTORY_KIND_LABELS[eq.inventoryKind]}
                    </Badge>
                  </td>
                  <td className="p-2">{eq.name}</td>
                  <td className="p-1">
                    <Input
                      className="h-8 min-w-[100px]"
                      defaultValue={eq.brand}
                      placeholder="Marque"
                      onBlur={(e) => patchField(eq.id, "brand", e.target.value)}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      className="h-8 min-w-[100px]"
                      defaultValue={eq.model}
                      placeholder="Modèle"
                      onBlur={(e) => patchField(eq.id, "model", e.target.value)}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      className="h-8 min-w-[100px]"
                      defaultValue={eq.supplier}
                      placeholder="Fournisseur"
                      onBlur={(e) => patchField(eq.id, "supplier", e.target.value)}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      className="h-8 w-24"
                      type="number"
                      min={0}
                      defaultValue={eq.unitPrice ?? ""}
                      placeholder="—"
                      onBlur={(e) => patchField(eq.id, "unitPrice", e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">{eq.qty}</td>
                  <td className="p-2 font-medium">
                    {eq.unitPrice != null ? formatCurrency(lineTotal) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
