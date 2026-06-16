"use client";

import Link from "next/link";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { addEquipmentAction, updateEquipmentAction } from "@/app/actions/equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CONSTRUCTION_GATE_LABELS,
  INVENTORY_KIND_LABELS,
  INSTALL_PHASE_LABELS,
} from "@/lib/nassib/inventory-rules";
import {
  DISPLAY_GROUP_LABELS,
  type InventoryDisplayGroup,
} from "@/lib/nassib/inventory-display";
import { displayGroup } from "@/lib/nassib/inventory-display";
import type { InventoryKind, NassibEquipment } from "@/types/nassib";

type GroupFilter = InventoryDisplayGroup | "all";

type RoomOption = { code: string; name: string; department: string };

function assetCodePrefix(kind: InventoryKind): string {
  if (kind === "biomedical") return "DM";
  if (kind === "medical_furniture") return "MM";
  return "MB";
}

function defaultName(kind: InventoryKind): string {
  if (kind === "biomedical") return "Nouvel équipement médical";
  if (kind === "medical_furniture") return "Nouveau mobilier médical";
  return "Nouveau mobilier bureau";
}

export function InventoryRecapTable({
  equipment,
  initialRoomFilter,
  roomCodeToId = {},
  rooms = [],
}: {
  equipment: NassibEquipment[];
  initialRoomFilter?: string;
  roomCodeToId?: Record<string, string>;
  rooms?: RoomOption[];
}) {
  const [items, setItems] = useState(equipment);
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [roomFilter, setRoomFilter] = useState<string>(initialRoomFilter ?? "all");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    roomCode: initialRoomFilter ?? rooms[0]?.code ?? "",
    inventoryKind: "office_furniture" as InventoryKind,
    name: "",
    qty: 1,
  });
  const [pending, startTransition] = useTransition();

  const roomCodes = useMemo(() => {
    const fromItems = items.map((e) => e.roomCode).filter(Boolean) as string[];
    const fromCatalog = rooms.map((r) => r.code);
    return [...new Set([...fromCatalog, ...fromItems])].sort();
  }, [items, rooms]);

  const filtered = useMemo(() => {
    return items.filter((eq) => {
      if (groupFilter !== "all" && displayGroup(eq.inventoryKind) !== groupFilter) {
        return false;
      }
      if (roomFilter !== "all" && eq.roomCode !== roomFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          eq.name.toLowerCase().includes(q) ||
          eq.assetCode.toLowerCase().includes(q) ||
          (eq.roomCode ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, groupFilter, roomFilter, search]);

  const totals = useMemo(() => {
    const clinical = items.filter((e) => displayGroup(e.inventoryKind) === "clinical_medical");
    const office = items.filter((e) => displayGroup(e.inventoryKind) === "office");
    return {
      clinical_medical: clinical.length,
      office: office.length,
    };
  }, [items]);

  function togglePrerequisites(id: string, current: boolean) {
    startTransition(async () => {
      await updateEquipmentAction(id, { prerequisitesMet: !current });
      setItems((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, prerequisitesMet: !current } : x,
        ),
      );
    });
  }

  function handleAddEquipment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const roomCode = addForm.roomCode.trim();
    if (!roomCode) return;

    const room = rooms.find((r) => r.code === roomCode);
    const kind = addForm.inventoryKind;
    const name = addForm.name.trim() || defaultName(kind);
    const suffix = Date.now().toString(36).slice(-4).toUpperCase();
    const assetCode = `${assetCodePrefix(kind)}-${roomCode}-${suffix}`;

    startTransition(async () => {
      const result = await addEquipmentAction({
        assetCode,
        name,
        service: room?.department ?? "",
        roomCode,
        inventoryKind: kind,
        qty: Math.max(1, addForm.qty),
        status: "to_define",
        prerequisitesMet: false,
      });
      if (result.ok && result.equipment) {
        setItems((prev) => [...prev, result.equipment]);
        setRoomFilter(roomCode);
        setShowAddForm(false);
        setAddForm((f) => ({
          ...f,
          name: "",
          qty: 1,
        }));
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={groupFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setGroupFilter("all")}
        >
          Tous ({items.length})
        </Button>
        {(Object.keys(DISPLAY_GROUP_LABELS) as InventoryDisplayGroup[]).map((g) => (
          <Button
            key={g}
            variant={groupFilter === g ? "default" : "outline"}
            size="sm"
            onClick={() => setGroupFilter(g)}
          >
            {DISPLAY_GROUP_LABELS[g]} ({totals[g]})
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="h-9 max-w-xs"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
        <Button
          size="sm"
          disabled={pending}
          onClick={() => {
            setShowAddForm((v) => {
              const next = !v;
              if (next) {
                setAddForm((f) => ({
                  ...f,
                  roomCode:
                    roomFilter !== "all"
                      ? roomFilter
                      : f.roomCode || rooms[0]?.code || "",
                }));
              }
              return next;
            });
          }}
        >
          {showAddForm ? "Annuler" : "Ajouter équipement"}
        </Button>
        <Link href="/equipements/financier">
          <Button variant="outline" size="sm">Préparation financière →</Button>
        </Link>
      </div>

      {showAddForm && (
        <Card className="border-[#0891B2]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">
              Nouvel équipement ou mobilier
            </CardTitle>
            <p className="text-sm text-slate-500">
              Ajout manuel — la ligne apparaît dans le récapitulatif et la fiche local
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAddEquipment}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600">Local *</span>
                <select
                  className="h-9 rounded-md border px-2"
                  value={addForm.roomCode}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, roomCode: e.target.value }))
                  }
                  required
                >
                  <option value="">— Choisir —</option>
                  {rooms.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code} — {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600">Catégorie *</span>
                <select
                  className="h-9 rounded-md border px-2"
                  value={addForm.inventoryKind}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      inventoryKind: e.target.value as InventoryKind,
                    }))
                  }
                >
                  {(Object.keys(INVENTORY_KIND_LABELS) as InventoryKind[]).map(
                    (k) => (
                      <option key={k} value={k}>
                        {INVENTORY_KIND_LABELS[k]}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-1">
                <span className="text-slate-600">Désignation</span>
                <Input
                  placeholder={defaultName(addForm.inventoryKind)}
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600">Quantité</span>
                <Input
                  type="number"
                  min={1}
                  value={addForm.qty}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      qty: Number.parseInt(e.target.value, 10) || 1,
                    }))
                  }
                />
              </label>
              <div className="flex items-end sm:col-span-2 lg:col-span-4">
                <Button
                  type="submit"
                  disabled={pending || !addForm.roomCode.trim()}
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-[#003F72] text-left text-white">
            <tr>
              <th className="p-2 font-medium">Local</th>
              <th className="p-2 font-medium">Catégorie</th>
              <th className="p-2 font-medium">Code</th>
              <th className="p-2 font-medium">Désignation</th>
              <th className="p-2 font-medium">Phase</th>
              <th className="p-2 font-medium">Jalon chantier</th>
              <th className="p-2 font-medium">Lots MEP</th>
              <th className="p-2 font-medium">Prérequis</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq, i) => (
              <tr
                key={eq.id}
                className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}
              >
                <td className="p-2">
                  <Link
                    href={`/locaux/${roomCodeToId[eq.roomCode ?? ""] ?? eq.roomCode?.toLowerCase() ?? ""}?tab=equipment`}
                    className="font-medium text-[#0891B2] hover:underline"
                  >
                    {eq.roomCode}
                  </Link>
                </td>
                <td className="p-2">
                  <Badge variant="default">
                    {DISPLAY_GROUP_LABELS[displayGroup(eq.inventoryKind)]}
                  </Badge>
                  <span className="ml-1 text-xs text-slate-400">
                    {INVENTORY_KIND_LABELS[eq.inventoryKind]}
                  </span>
                </td>
                <td className="p-2 text-slate-500">{eq.assetCode}</td>
                <td className="p-2 font-medium">{eq.name}</td>
                <td className="p-2 text-slate-600">
                  {INSTALL_PHASE_LABELS[eq.installPhase]}
                </td>
                <td className="p-2 text-slate-600">
                  {CONSTRUCTION_GATE_LABELS[eq.constructionGate]}
                </td>
                <td className="p-2 text-xs text-slate-500">
                  {eq.mepDependencies.join(" · ")}
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => togglePrerequisites(eq.id, eq.prerequisitesMet)}
                    className="cursor-pointer"
                  >
                    <Badge variant={eq.prerequisitesMet ? "success" : "warning"}>
                      {eq.prerequisitesMet ? "OK" : "À valider"}
                    </Badge>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">Aucune ligne.</p>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {filtered.length} ligne(s) affichée(s) · source plan implantation Polyclinique Nassib
      </p>
    </div>
  );
}
