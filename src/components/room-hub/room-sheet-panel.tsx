"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { updateRoomSheetAction } from "@/app/actions/room-sheet";
import { editFormToPatch, sheetToEditForm, type SheetEditForm } from "@/lib/room-sheet/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ImplementationPlanImage,
} from "@/components/room-hub/room-implementation-plan";
import { resolveImplementationPlanImage } from "@/lib/room-sheet/implementation-plan-images";
import type { EditableField, FinishSpec, OpeningSpec, RoomTechnicalSheet } from "@/types/room-sheet";

const SOURCE_LABELS: Record<EditableField<unknown>["source"], string> = {
  plan: "Plan",
  calculated: "Calculé",
  manual: "Saisie manuelle",
  pending: "À confirmer",
};

function SourceBadge({ source }: { source: EditableField<unknown>["source"] }) {
  const variant =
    source === "manual" ? "brand" : source === "plan" ? "info" : source === "pending" ? "warning" : "default";
  return (
    <Badge variant={variant} className="shrink-0 text-[10px] font-normal">
      {SOURCE_LABELS[source]}
    </Badge>
  );
}

function fieldInputClass() {
  return "h-8 w-full min-w-0 text-sm";
}

function NumberField({
  label,
  value,
  unit,
  source,
  editing,
  onChange,
}: {
  label: string;
  value: number;
  unit?: string;
  source?: EditableField<number>["source"];
  editing: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        {editing ? (
          <Input
            type="number"
            step="any"
            className="h-8 w-28 text-right"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        ) : (
          <span className="font-medium tabular-nums">
            {value}
            {unit ? ` ${unit}` : ""}
          </span>
        )}
        {source && !editing && <SourceBadge source={source} />}
        {editing && <Badge variant="brand" className="text-[10px]">Édition</Badge>}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  editing,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1 border-b border-slate-100 py-2 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      {editing ? (
        multiline ? (
          <textarea
            className="min-h-[72px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Input className={fieldInputClass()} value={value} onChange={(e) => onChange(e.target.value)} />
        )
      ) : (
        <p className="text-sm font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

function BoolField({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: boolean;
  editing: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-600">{label}</span>
      {editing ? (
        <select
          className="h-8 rounded-md border border-slate-200 px-2 text-sm"
          value={value ? "oui" : "non"}
          onChange={(e) => onChange(e.target.value === "oui")}
        >
          <option value="oui">Oui</option>
          <option value="non">Non</option>
        </select>
      ) : (
        <span className={value ? "font-medium text-emerald-700" : "text-slate-400"}>
          {value ? "Oui" : "Non"}
        </span>
      )}
    </div>
  );
}

function FinishEditor({
  title,
  finish,
  editing,
  onChange,
}: {
  title: string;
  finish: FinishSpec;
  editing: boolean;
  onChange: (f: FinishSpec) => void;
}) {
  const set = (key: keyof FinishSpec, val: string) => onChange({ ...finish, [key]: val });

  if (!editing) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#003F72]">{title}</p>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-2"><dt className="text-slate-500">Matériau</dt><dd className="text-right font-medium">{finish.material}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-slate-500">Couleur</dt><dd className="text-right font-medium">{finish.color}</dd></div>
          {finish.colorCode && <div className="flex justify-between gap-2"><dt className="text-slate-500">Réf. couleur</dt><dd className="font-mono text-xs">{finish.colorCode}</dd></div>}
          {finish.reference && <div className="flex justify-between gap-2"><dt className="text-slate-500">Produit</dt><dd className="text-right text-xs">{finish.reference}</dd></div>}
          {finish.notes && <p className="mt-2 text-xs text-slate-500">{finish.notes}</p>}
        </dl>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#0891B2]/40 bg-cyan-50/30 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#003F72]">{title}</p>
      <div className="space-y-2">
        <TextField label="Matériau" value={finish.material} editing onChange={(v) => set("material", v)} />
        <TextField label="Couleur" value={finish.color} editing onChange={(v) => set("color", v)} />
        <TextField label="Réf. couleur (RAL…)" value={finish.colorCode ?? ""} editing onChange={(v) => set("colorCode", v)} />
        <TextField label="Produit / référence" value={finish.reference ?? ""} editing onChange={(v) => set("reference", v)} />
        <TextField label="Notes" value={finish.notes ?? ""} editing multiline onChange={(v) => set("notes", v)} />
      </div>
    </div>
  );
}

function OpeningsTable({
  openings,
  editing,
  onChange,
}: {
  openings: OpeningSpec[];
  editing: boolean;
  onChange: (o: OpeningSpec[]) => void;
}) {
  const update = (idx: number, patch: Partial<OpeningSpec>) => {
    const next = openings.map((o, i) => (i === idx ? { ...o, ...patch } : o));
    onChange(next);
  };

  if (!editing) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-slate-500">
              <th className="pb-2 pr-4">Élément</th>
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Dimensions</th>
              <th className="pb-2 pr-4">Couleur vantail</th>
              <th className="pb-2 pr-4">Cadre</th>
              <th className="pb-2">Feu / vitrage</th>
            </tr>
          </thead>
          <tbody>
            {openings.map((o) => (
              <tr key={o.id} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-medium">{o.label}</td>
                <td className="py-2 pr-4 capitalize">{o.type.replace("_", " ")}</td>
                <td className="py-2 pr-4 tabular-nums">{o.widthMm} × {o.heightMm} mm</td>
                <td className="py-2 pr-4">{o.leafColor ?? "—"}</td>
                <td className="py-2 pr-4">{o.frameColor ?? "—"}</td>
                <td className="py-2">{o.fireRating ?? o.glassType ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {openings.map((o, idx) => (
        <div key={o.id} className="rounded-lg border border-[#0891B2]/30 bg-cyan-50/20 p-4">
          <p className="mb-2 text-sm font-medium text-[#003F72]">{o.label}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <TextField label="Libellé" value={o.label} editing onChange={(v) => update(idx, { label: v })} />
            <div className="space-y-1">
              <span className="text-sm text-slate-600">Type</span>
              <select
                className="h-8 w-full rounded-md border border-slate-200 px-2 text-sm"
                value={o.type}
                onChange={(e) => update(idx, { type: e.target.value as OpeningSpec["type"] })}
              >
                <option value="door">Porte</option>
                <option value="sliding_door">Porte coulissante</option>
                <option value="window">Fenêtre</option>
                <option value="passage">Passage</option>
              </select>
            </div>
            <NumberField label="Largeur (mm)" value={o.widthMm} editing onChange={(v) => update(idx, { widthMm: v })} />
            <NumberField label="Hauteur (mm)" value={o.heightMm} editing onChange={(v) => update(idx, { heightMm: v })} />
            <TextField label="Couleur vantail" value={o.leafColor ?? ""} editing onChange={(v) => update(idx, { leafColor: v })} />
            <TextField label="Cadre" value={o.frameColor ?? ""} editing onChange={(v) => update(idx, { frameColor: v })} />
            <TextField label="Vitrage" value={o.glassType ?? ""} editing onChange={(v) => update(idx, { glassType: v })} />
            <TextField label="Coupe-feu" value={o.fireRating ?? ""} editing onChange={(v) => update(idx, { fireRating: v })} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RoomSheetPanel({
  sheet: initialSheet,
  roomId,
  roomCode,
  roomName,
}: {
  sheet: RoomTechnicalSheet;
  roomId: string;
  roomCode: string;
  roomName: string;
}) {
  const [sheet, setSheet] = useState(initialSheet);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<SheetEditForm | null>(null);
  const [pending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const startEdit = () => {
    setForm(sheetToEditForm(sheet));
    setEditing(true);
    setSaveError(null);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(null);
    setSaveError(null);
  };

  const patchForm = <K extends keyof SheetEditForm>(
    section: K,
    value: SheetEditForm[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [section]: value } : prev));
  };

  const save = () => {
    if (!form) return;
    setSaveError(null);
    startTransition(async () => {
      const result = await updateRoomSheetAction(roomId, editFormToPatch(form));
      if (result.ok) {
        setSheet(result.sheet);
        setEditing(false);
        setForm(null);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 3000);
      } else {
        setSaveError("Erreur de validation — vérifiez les champs numériques.");
      }
    });
  };

  const s = sheet;
  const f = form;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Fiche implémentation v{sheet.version} · MAJ{" "}
            {new Date(sheet.updatedAt).toLocaleString("fr-FR")} · Ingénierie K&apos;BIO
          </p>
          <p className="text-xs text-[#0891B2]">
            {editing
              ? "Mode édition — surfaces, finitions, MEP, menuiseries, implantation"
              : "Schéma issu du plan d'implantation 180526 — cliquez « Modifier la fiche » pour ajuster"}
          </p>
          {savedFlash && (
            <p className="mt-1 text-sm font-medium text-emerald-700">✓ Fiche enregistrée</p>
          )}
          {saveError && <p className="mt-1 text-sm text-red-600">{saveError}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/locaux/${roomId}/fiche-print`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-[#003F72] hover:bg-slate-50"
          >
            Imprimer la fiche local
          </Link>
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={cancelEdit} disabled={pending}>
                Annuler
              </Button>
              <Button size="sm" onClick={save} disabled={pending}>
                {pending ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={startEdit}>
              Modifier la fiche
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">Surfaces & volumes</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberField
              label="Surface au sol"
              value={f?.floorAreaM2 ?? s.surfaces.floorAreaM2.value}
              unit="m²"
              source={s.surfaces.floorAreaM2.source}
              editing={editing && !!f}
              onChange={(v) => f && patchForm("floorAreaM2", v)}
            />
            <NumberField
              label="Hauteur sous plafond"
              value={f?.ceilingHeightM ?? s.surfaces.ceilingHeightM.value}
              unit="m"
              source={s.surfaces.ceilingHeightM.source}
              editing={editing && !!f}
              onChange={(v) => f && patchForm("ceilingHeightM", v)}
            />
            <NumberField
              label="Périmètre"
              value={f?.perimeterM ?? s.surfaces.perimeterM?.value ?? 0}
              unit="m"
              source={s.surfaces.perimeterM?.source}
              editing={editing && !!f}
              onChange={(v) => f && patchForm("perimeterM", v)}
            />
            <NumberField
              label="Volume (recalculé à l'enregistrement)"
              value={
                f
                  ? Math.round(f.floorAreaM2 * f.ceilingHeightM * 10) / 10
                  : s.surfaces.volumeM3.value
              }
              unit="m³"
              source={s.surfaces.volumeM3.source}
              editing={false}
              onChange={() => {}}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">Finitions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {(["walls", "floor", "ceiling", "skirting"] as const).map((key) => {
              const titles = { walls: "Murs", floor: "Sol / carrelage", ceiling: "Plafond", skirting: "Plinthes" };
              const finish = f?.finishes[key] ?? s.finishes[key];
              return (
                <FinishEditor
                  key={key}
                  title={titles[key]}
                  finish={finish}
                  editing={editing && !!f}
                  onChange={(val) =>
                    f && patchForm("finishes", { ...f.finishes, [key]: val })
                  }
                />
              );
            })}
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#003F72]">Portes & fenêtres</CardTitle>
          </CardHeader>
          <CardContent>
            <OpeningsTable
              openings={f?.openings ?? s.openings}
              editing={editing && !!f}
              onChange={(o) => f && patchForm("openings", o)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">CFO</CardTitle></CardHeader>
          <CardContent>
            {(
              [
                ["sockets16A", "Prises 16 A"],
                ["sockets32A", "Prises 32 A"],
                ["socketsDedicated", "Circuits dédiés"],
                ["lightingPoints", "Points lumineux"],
                ["emergencyLighting", "BAES"],
                ["earthPoints", "Prises de terre"],
              ] as const
            ).map(([key, label]) => (
              <NumberField
                key={key}
                label={label}
                value={f?.cfo[key] ?? s.cfo[key].value}
                source={s.cfo[key].source}
                editing={editing && !!f}
                onChange={(v) => f && patchForm("cfo", { ...f.cfo, [key]: v })}
              />
            ))}
            <TextField
              label="Indice IP"
              value={f?.cfo.ipRating ?? s.cfo.ipRating}
              editing={editing && !!f}
              onChange={(v) => f && patchForm("cfo", { ...f.cfo, ipRating: v })}
            />
            <TextField
              label="Notes CFO"
              value={f?.cfo.notes ?? s.cfo.notes ?? ""}
              editing={editing && !!f}
              multiline
              onChange={(v) => f && patchForm("cfo", { ...f.cfo, notes: v })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">CFA</CardTitle></CardHeader>
          <CardContent>
            {(
              [
                ["rj45", "RJ45"],
                ["wifiAccessPoints", "Wi-Fi AP"],
                ["intercom", "Interphone"],
                ["nurseCall", "Appel infirmier"],
                ["cctv", "Caméra"],
                ["accessControl", "Contrôle accès"],
                ["tvOutlet", "Prise TV"],
              ] as const
            ).map(([key, label]) => (
              <NumberField
                key={key}
                label={label}
                value={f?.cfa[key] ?? s.cfa[key].value}
                source={s.cfa[key].source}
                editing={editing && !!f}
                onChange={(v) => f && patchForm("cfa", { ...f.cfa, [key]: v })}
              />
            ))}
            <TextField
              label="Notes CFA"
              value={f?.cfa.notes ?? s.cfa.notes ?? ""}
              editing={editing && !!f}
              multiline
              onChange={(v) => f && patchForm("cfa", { ...f.cfa, notes: v })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">Plomberie</CardTitle></CardHeader>
          <CardContent>
            <BoolField label="Eau froide (EF)" value={f?.plumbing.coldWater ?? s.plumbing.coldWater} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, coldWater: v })} />
            <BoolField label="Eau chaude (EC)" value={f?.plumbing.hotWater ?? s.plumbing.hotWater} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, hotWater: v })} />
            <BoolField label="Eau traitée" value={f?.plumbing.treatedWater ?? s.plumbing.treatedWater} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, treatedWater: v })} />
            <BoolField label="Eau adoucie" value={f?.plumbing.softWater ?? s.plumbing.softWater} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, softWater: v })} />
            <NumberField label="Siphons de sol" value={f?.plumbing.floorDrains ?? s.plumbing.floorDrains.value} source={s.plumbing.floorDrains.source} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, floorDrains: v })} />
            <NumberField label="Points EU" value={f?.plumbing.euPoints ?? s.plumbing.euPoints.value} source={s.plumbing.euPoints.source} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, euPoints: v })} />
            <NumberField label="Points EV" value={f?.plumbing.evPoints ?? s.plumbing.evPoints.value} source={s.plumbing.evPoints.source} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, evPoints: v })} />
            <BoolField label="Déchet médical" value={f?.plumbing.medicalWaste ?? s.plumbing.medicalWaste} editing={editing && !!f} onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, medicalWaste: v })} />
            <TextField label="Notes plomberie" value={f?.plumbing.notes ?? s.plumbing.notes ?? ""} editing={editing && !!f} multiline onChange={(v) => f && patchForm("plumbing", { ...f.plumbing, notes: v })} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">Ventilation</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <NumberField label="Occupation max." value={f?.ventilation.occupancyMax ?? s.ventilation.occupancyMax.value} unit="pers." source={s.ventilation.occupancyMax.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, occupancyMax: v })} />
              <TextField label="Base occupation" value={f?.ventilation.occupancyBasis ?? s.ventilation.occupancyBasis} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, occupancyBasis: v })} />
              <NumberField label="Renouvellement requis" value={f?.ventilation.airChangesPerHourRequired ?? s.ventilation.airChangesPerHourRequired.value} unit="vol/h" source={s.ventilation.airChangesPerHourRequired.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, airChangesPerHourRequired: v })} />
              <NumberField label="Renouvellement retenu" value={f?.ventilation.airChangesPerHourDesigned ?? s.ventilation.airChangesPerHourDesigned.value} unit="vol/h" source={s.ventilation.airChangesPerHourDesigned.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, airChangesPerHourDesigned: v })} />
              <NumberField label="Débit requis" value={f?.ventilation.flowM3hRequired ?? s.ventilation.flowM3hRequired.value} unit="m³/h" source={s.ventilation.flowM3hRequired.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, flowM3hRequired: v })} />
              <NumberField label="Débit retenu" value={f?.ventilation.flowM3hDesigned ?? s.ventilation.flowM3hDesigned.value} unit="m³/h" source={s.ventilation.flowM3hDesigned.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, flowM3hDesigned: v })} />
              <NumberField label="Consigne temp." value={f?.ventilation.temperatureSetpointC ?? s.ventilation.temperatureSetpointC.value} unit="°C" source={s.ventilation.temperatureSetpointC.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, temperatureSetpointC: v })} />
              <NumberField label="HR cible" value={f?.ventilation.humidityPct ?? s.ventilation.humidityPct?.value ?? 0} unit="%" source={s.ventilation.humidityPct?.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, humidityPct: v })} />
              <NumberField label="Surpression" value={f?.ventilation.pressureDifferentialPa ?? s.ventilation.pressureDifferentialPa?.value ?? 0} unit="Pa" source={s.ventilation.pressureDifferentialPa?.source} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, pressureDifferentialPa: v })} />
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <TextField label="Norme" value={f?.ventilation.normReference ?? s.ventilation.normReference} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, normReference: v })} />
              <TextField label="Filtration" value={f?.ventilation.filtration ?? s.ventilation.filtration} editing={editing && !!f} onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, filtration: v })} />
              <TextField label="Note de calcul" value={f?.ventilation.calculationNotes ?? s.ventilation.calculationNotes} editing={editing && !!f} multiline onChange={(v) => f && patchForm("ventilation", { ...f.ventilation, calculationNotes: v })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">Climatisation</CardTitle></CardHeader>
          <CardContent>
            <BoolField label="Climatisation requise" value={f?.climate.coolingRequired ?? s.climate.coolingRequired} editing={editing && !!f} onChange={(v) => f && patchForm("climate", { ...f.climate, coolingRequired: v })} />
            <NumberField label="Puissance froid" value={f?.climate.coolingKw ?? s.climate.coolingKw?.value ?? 0} unit="kW" source={s.climate.coolingKw?.source} editing={editing && !!f} onChange={(v) => f && patchForm("climate", { ...f.climate, coolingKw: v })} />
            <NumberField label="Puissance chaud" value={f?.climate.heatingKw ?? s.climate.heatingKw?.value ?? 0} unit="kW" source={s.climate.heatingKw?.source} editing={editing && !!f} onChange={(v) => f && patchForm("climate", { ...f.climate, heatingKw: v })} />
            <NumberField label="Splits / UI" value={f?.climate.splitUnits ?? s.climate.splitUnits.value} source={s.climate.splitUnits.source} editing={editing && !!f} onChange={(v) => f && patchForm("climate", { ...f.climate, splitUnits: v })} />
            <TextField label="Zone CTA" value={f?.climate.ctaZone ?? s.climate.ctaZone} editing={editing && !!f} onChange={(v) => f && patchForm("climate", { ...f.climate, ctaZone: v })} />
            <TextField label="Fluide frigorigène" value={f?.climate.refrigerant ?? s.climate.refrigerant ?? ""} editing={editing && !!f} onChange={(v) => f && patchForm("climate", { ...f.climate, refrigerant: v })} />
            <TextField label="Notes CVC" value={f?.climate.notes ?? s.climate.notes ?? ""} editing={editing && !!f} multiline onChange={(v) => f && patchForm("climate", { ...f.climate, notes: v })} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">Fluides médicaux</CardTitle></CardHeader>
          <CardContent>
            <NumberField label="Prises O₂" value={f?.medicalGas.o2Outlets ?? s.medicalGas.o2Outlets.value} source={s.medicalGas.o2Outlets.source} editing={editing && !!f} onChange={(v) => f && patchForm("medicalGas", { ...f.medicalGas, o2Outlets: v })} />
            <NumberField label="Aspiration" value={f?.medicalGas.vacuumOutlets ?? s.medicalGas.vacuumOutlets.value} source={s.medicalGas.vacuumOutlets.source} editing={editing && !!f} onChange={(v) => f && patchForm("medicalGas", { ...f.medicalGas, vacuumOutlets: v })} />
            <NumberField label="Air médical" value={f?.medicalGas.medicalAirOutlets ?? s.medicalGas.medicalAirOutlets.value} source={s.medicalGas.medicalAirOutlets.source} editing={editing && !!f} onChange={(v) => f && patchForm("medicalGas", { ...f.medicalGas, medicalAirOutlets: v })} />
            <NumberField label="AGSS" value={f?.medicalGas.agss ?? s.medicalGas.agss?.value ?? 0} source={s.medicalGas.agss?.source} editing={editing && !!f} onChange={(v) => f && patchForm("medicalGas", { ...f.medicalGas, agss: v })} />
            <TextField label="Notes fluides" value={f?.medicalGas.notes ?? s.medicalGas.notes ?? ""} editing={editing && !!f} multiline onChange={(v) => f && patchForm("medicalGas", { ...f.medicalGas, notes: v })} />
          </CardContent>
        </Card>

        {resolveImplementationPlanImage(roomCode) && (
          <Card className="border-[#003F72]/15 lg:col-span-2 xl:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#003F72]">
                Plan d&apos;implantation — {resolveImplementationPlanImage(roomCode)?.title}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {roomName} · Référence K&apos;BIO plans équipements 180526
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(140px,0.4fr)] sm:items-start">
                <ImplementationPlanImage roomCode={roomCode} />
                <div className="space-y-0 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1">
                  {[
                    { label: "Surface", value: `${s.surfaces.floorAreaM2.value} m²` },
                    { label: "Hauteur", value: `${s.surfaces.ceilingHeightM.value} m` },
                    { label: "Prises 16A", value: s.cfo.sockets16A.value },
                    { label: "RJ45", value: s.cfa.rj45.value },
                    { label: "O₂", value: s.medicalGas.o2Outlets.value },
                    { label: "Aspiration", value: s.medicalGas.vacuumOutlets.value },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0"
                    >
                      <span className="text-[11px] uppercase tracking-wide text-slate-400">
                        {row.label}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-[#003F72]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="xl:col-span-3">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#003F72]">Notes chantier / remarques libres</CardTitle></CardHeader>
          <CardContent>
            <TextField
              label="Remarques"
              value={f?.customNotes ?? s.customNotes ?? ""}
              editing={editing && !!f}
              multiline
              onChange={(v) => f && patchForm("customNotes", v)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
