"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DISPLAY_GROUP_DESCRIPTIONS,
  DISPLAY_GROUP_LABELS,
} from "@/lib/nassib/inventory-display";
import {
  CONSTRUCTION_GATE_LABELS,
  INVENTORY_KIND_LABELS,
  INSTALL_PHASE_LABELS,
  MEDICAL_FURNITURE_GROUP_LABELS,
} from "@/lib/nassib/inventory-rules";
import type { InventoryKind, MedicalFurnitureGroup, NassibEquipment } from "@/types/nassib";
import type { RoomHub } from "@/types/room-hub";

const DISPLAY_SECTIONS = [
  { group: "clinical_medical" as const, kinds: ["biomedical", "medical_furniture"] as const },
  { group: "office" as const, kinds: ["office_furniture"] as const },
];

const FURNITURE_GROUP_ORDER: MedicalFurnitureGroup[] = [
  "lit_brancard",
  "chambre_patient",
  "soins_support",
  "tables_cliniques",
  "autre",
];

function MedicalFurnitureSection({
  items,
}: {
  items: NassibEquipment[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">
        Aucun mobilier médical (lits, brancards, tables…).
      </div>
    );
  }

  const byGroup = FURNITURE_GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((eq) => (eq.medicalFurnitureGroup ?? "autre") === group),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      {byGroup.map(({ group, items: groupItems }) => (
        <div key={group}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0891B2]">
            {MEDICAL_FURNITURE_GROUP_LABELS[group]} ({groupItems.length})
          </p>
          <InventorySection
            title={MEDICAL_FURNITURE_GROUP_LABELS[group]}
            items={groupItems}
            roomCode=""
          />
        </div>
      ))}
    </div>
  );
}

function InventorySection({
  title,
  items,
  roomCode,
}: {
  title: string;
  items: NassibEquipment[];
  roomCode: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">
        Aucun élément — {title.toLowerCase()}.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((eq) => (
        <div
          key={eq.id}
          className="rounded-lg border bg-white p-3 text-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-[#003F72]">{eq.name}</p>
              <p className="text-xs text-slate-500">{eq.assetCode}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="info">{eq.status}</Badge>
              <Badge variant={eq.prerequisitesMet ? "success" : "warning"}>
                {eq.prerequisitesMet ? "Prérequis OK" : "Prérequis"}
              </Badge>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded bg-slate-100 px-2 py-0.5">
              {INSTALL_PHASE_LABELS[eq.installPhase]}
            </span>
            <span className="rounded bg-[#0891B2]/10 px-2 py-0.5 text-[#0891B2]">
              {CONSTRUCTION_GATE_LABELS[eq.constructionGate]}
            </span>
          </div>
          {eq.mepDependencies.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              Lots : {eq.mepDependencies.join(" · ")}
            </p>
          )}
          {eq.constructionNote && (
            <p className="mt-2 text-xs text-slate-600">{eq.constructionNote}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function RoomInventorySheet({ hub }: { hub: RoomHub }) {
  const { room, profile, links } = hub;
  const inventory = links.inventory;

  const byDisplay = useMemo(() => {
    const clinical = inventory.filter(
      (e) => e.inventoryKind === "biomedical" || e.inventoryKind === "medical_furniture",
    );
    const office = inventory.filter((e) => e.inventoryKind === "office_furniture");
    return { clinical_medical: clinical, office };
  }, [inventory]);

  const byKind = useMemo(() => {
    const map: Record<InventoryKind, NassibEquipment[]> = {
      biomedical: [],
      medical_furniture: [],
      office_furniture: [],
    };
    for (const item of inventory) {
      map[item.inventoryKind].push(item);
    }
    return map;
  }, [inventory]);

  const mepGates = useMemo(() => {
    const gates = new Map<string, NassibEquipment[]>();
    for (const eq of inventory) {
      const label = CONSTRUCTION_GATE_LABELS[eq.constructionGate];
      if (!gates.has(label)) gates.set(label, []);
      gates.get(label)!.push(eq);
    }
    return [...gates.entries()];
  }, [inventory]);

  const activeNeeds = [
    profile.needs.medicalGas && "Gaz médicaux",
    profile.needs.cvc && "CVC / ventilation",
    profile.needs.ssi && "SSI",
    profile.needs.cfo && "CFO",
    profile.needs.cfa && "CFA / VDI",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <Card className="border-[#003F72]/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Fiche inventaire — {room.code}
          </CardTitle>
          <p className="text-sm text-slate-500">
            {inventory.length} ligne(s) · plan d&apos;implantation · sans marque ni modèle
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {activeNeeds.map((n) => (
            <Badge key={n} variant="brand">{n}</Badge>
          ))}
          <Link href={`/equipements/recap?room=${room.code}`}>
            <Button variant="outline" size="sm">Voir dans le récapitulatif</Button>
          </Link>
          <Link href={`/equipements/financier?room=${room.code}`}>
            <Button variant="outline" size="sm">Préparation financière</Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {DISPLAY_SECTIONS.map(({ group }) => (
          <Card key={group}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {DISPLAY_GROUP_LABELS[group]}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {byDisplay[group].length} élément(s) · {DISPLAY_GROUP_DESCRIPTIONS[group]}
              </p>
            </CardHeader>
            <CardContent>
              {group === "clinical_medical" ? (
                <>
                  {byKind.biomedical.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0891B2]">
                        {INVENTORY_KIND_LABELS.biomedical} ({byKind.biomedical.length})
                      </p>
                      <InventorySection
                        title={INVENTORY_KIND_LABELS.biomedical}
                        items={byKind.biomedical}
                        roomCode={room.code}
                      />
                    </div>
                  )}
                  {byKind.medical_furniture.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0891B2]">
                        {INVENTORY_KIND_LABELS.medical_furniture} (
                        {byKind.medical_furniture.length})
                      </p>
                      <MedicalFurnitureSection items={byKind.medical_furniture} />
                    </div>
                  )}
                  {byDisplay.clinical_medical.length === 0 && (
                    <InventorySection title="Médical" items={[]} roomCode={room.code} />
                  )}
                </>
              ) : (
                <InventorySection
                  title={DISPLAY_GROUP_LABELS.office}
                  items={byDisplay.office}
                  roomCode={room.code}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Séquencement chantier — prérequis MEP
          </CardTitle>
          <p className="text-sm text-slate-500">
            Ordre indicatif pour le programme de suivi : fluides médicaux et scialytiques
            avant fermeture faux plafonds ; coordination CVC et SSI.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {mepGates.map(([gate, items]) => (
            <div key={gate} className="rounded-lg border p-4">
              <p className="font-medium text-[#003F72]">{gate}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {items.map((eq) => (
                  <li key={eq.id}>
                    · {eq.name}
                    {eq.mepDependencies.length > 0 && (
                      <span className="text-slate-400">
                        {" "}
                        ({eq.mepDependencies.join(", ")})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {mepGates.length === 0 && (
            <p className="text-sm text-slate-500">Aucun jalon chantier défini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
