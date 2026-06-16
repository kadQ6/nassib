"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  addEquipmentAction,
  removeEquipmentAction,
  updateEquipmentAction,
} from "@/app/actions/equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { INVENTORY_KIND_LABELS, MEDICAL_FURNITURE_GROUP_LABELS } from "@/lib/nassib/inventory-rules";
import {
  DISPLAY_GROUP_LABELS,
  type InventoryDisplayGroup,
} from "@/lib/nassib/inventory-display";
import { displayGroup } from "@/lib/nassib/inventory-display";
import type { InventoryKind, MedicalFurnitureGroup, NassibEquipment } from "@/types/nassib";
import type { RoomHub } from "@/types/room-hub";

const FURNITURE_GROUP_ORDER: MedicalFurnitureGroup[] = [
  "lit_brancard",
  "chambre_patient",
  "soins_support",
  "tables_cliniques",
  "autre",
];

const DISPLAY_ORDER: InventoryDisplayGroup[] = ["clinical_medical", "office"];

export function EquipmentManager({
  equipment,
  rooms,
}: {
  equipment: NassibEquipment[];
  rooms: RoomHub[];
}) {
  const [items, setItems] = useState(equipment);
  const [selectedRoom, setSelectedRoom] = useState<string | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const roomCodes = useMemo(
    () => [...new Set(items.map((e) => e.roomCode).filter(Boolean))] as string[],
    [items],
  );

  const byRoom = useMemo(() => {
    const map = new Map<string, NassibEquipment[]>();
    for (const eq of items) {
      const code = eq.roomCode ?? "—";
      if (!map.has(code)) map.set(code, []);
      map.get(code)!.push(eq);
    }
    return map;
  }, [items]);

  function handleDelete(id: string) {
    startTransition(async () => {
      await removeEquipmentAction(id);
      setItems((prev) => prev.filter((e) => e.id !== id));
    });
  }

  function handleAdd(roomCode: string, kind: InventoryKind = "biomedical") {
    const room = rooms.find((r) => r.room.code === roomCode);
    const prefix = kind === "biomedical" ? "DM" : kind === "medical_furniture" ? "MM" : "MB";
    const draft: NassibEquipment = {
      id: `tmp-${Date.now()}`,
      assetCode: `${prefix}-${roomCode}-NEW`,
      name: kind === "biomedical" ? "Nouvel équipement médical" : "Nouveau mobilier",
      service: room?.profile.department ?? "",
      roomCode,
      inventoryKind: kind,
      brand: "",
      model: "",
      qty: 1,
      supplier: "",
      unitPrice: null,
      status: "to_define",
      prerequisitesMet: false,
      installPhase: "finishes",
      constructionGate: "after_finishes",
      mepDependencies: ["GO"],
      expectedDelivery: "",
    };
    startTransition(async () => {
      await addEquipmentAction({
        assetCode: draft.assetCode,
        name: draft.name,
        service: draft.service,
        roomCode: draft.roomCode!,
        inventoryKind: kind,
        qty: 1,
        status: "to_define",
        prerequisitesMet: false,
      });
      setItems((prev) => [...prev, { ...draft, id: `eq-${Date.now()}` }]);
    });
  }

  function renderEquipmentRow(eq: NassibEquipment) {
    return (
      <div
        key={eq.id}
        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
      >
        {editingId === eq.id ? (
          <div className="flex flex-1 flex-col gap-2">
            <Input
              className="h-8"
              defaultValue={eq.name}
              placeholder="Désignation"
              onBlur={(e) => {
                const name = e.target.value;
                startTransition(async () => {
                  await updateEquipmentAction(eq.id, { name });
                  setItems((prev) =>
                    prev.map((x) => (x.id === eq.id ? { ...x, name } : x)),
                  );
                });
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => setEditingId(null)}
            >
              Terminer
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="text-left font-medium hover:text-[#0891B2]"
            onClick={() => setEditingId(eq.id)}
          >
            {eq.name}
          </button>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="info">{eq.status}</Badge>
          <Badge variant={eq.prerequisitesMet ? "success" : "warning"}>
            {eq.prerequisitesMet ? "OK" : "MEP"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => handleDelete(eq.id)}
            disabled={pending}
          >
            Suppr.
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRoom === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRoom("all")}
        >
          Tous ({items.length})
        </Button>
        {roomCodes.slice(0, 14).map((code) => (
          <Button
            key={code}
            variant={selectedRoom === code ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRoom(code)}
          >
            {code} ({byRoom.get(code)?.length ?? 0})
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {roomCodes.map((code) => {
          const room = rooms.find((r) => r.room.code === code);
          const list = byRoom.get(code) ?? [];
          if (selectedRoom !== "all" && selectedRoom !== code) return null;

          const grouped = DISPLAY_ORDER.map((group) => ({
            group,
            items: list.filter((e) => displayGroup(e.inventoryKind) === group),
          }));

          return (
            <Card key={code}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <div>
                  <CardTitle className="text-base">
                    {code} — {room?.room.name ?? "Local"}
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    {list.length} ligne(s) · plan implantation
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {room && (
                    <Link href={`/locaux/${room.room.id}?tab=equipment`}>
                      <Button variant="default" size="sm">Fiche local</Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdd(code, "medical_furniture")}
                    disabled={pending}
                  >
                    + Mobilier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdd(code, "biomedical")}
                    disabled={pending}
                  >
                    + Équip.
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {list.length === 0 && (
                  <p className="text-sm text-slate-500">Aucune ligne.</p>
                )}
                {grouped.map(({ group, items: groupItems }) =>
                  groupItems.length === 0 ? null : group === "clinical_medical" ? (
                    <div key={group}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0891B2]">
                        {DISPLAY_GROUP_LABELS[group]} ({groupItems.length})
                      </p>
                      {(["biomedical", "medical_furniture"] as const).map((kind) => {
                        const sub = groupItems.filter((e) => e.inventoryKind === kind);
                        if (sub.length === 0) return null;
                        return (
                          <div key={kind} className="mb-3">
                            <p className="mb-1 text-xs text-slate-500">
                              {INVENTORY_KIND_LABELS[kind]} ({sub.length})
                            </p>
                            {kind === "medical_furniture" ? (
                              FURNITURE_GROUP_ORDER.map((fg) => {
                                const fgItems = sub.filter(
                                  (eq) => (eq.medicalFurnitureGroup ?? "autre") === fg,
                                );
                                if (fgItems.length === 0) return null;
                                return (
                                  <div key={fg} className="mb-2 ml-2">
                                    <p className="mb-1 text-xs text-slate-400">
                                      {MEDICAL_FURNITURE_GROUP_LABELS[fg]} ({fgItems.length})
                                    </p>
                                    <div className="space-y-2">
                                      {fgItems.map((eq) => renderEquipmentRow(eq))}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="space-y-2">
                                {sub.map((eq) => renderEquipmentRow(eq))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div key={group}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0891B2]">
                        {DISPLAY_GROUP_LABELS[group]} ({groupItems.length})
                      </p>
                      <div className="space-y-2">
                        {groupItems.map((eq) => renderEquipmentRow(eq))}
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
