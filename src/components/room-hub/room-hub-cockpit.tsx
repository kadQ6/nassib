"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import type { RoomHub } from "@/types/room-hub";
import { RoomFicheIogPreview } from "@/components/room-hub/room-fiche-iog-preview";
import { RoomSheetPanel } from "@/components/room-hub/room-sheet-panel";
import { RoomInventorySheet } from "@/components/equipements/room-inventory-sheet";
import { RoomNameEditor } from "@/components/room-hub/room-name-editor";
import { formatCurrency } from "@/lib/utils";

const RECEPTION_LABELS: Record<string, string> = {
  not_started: "Non démarrée",
  in_progress: "En cours",
  opr_pending: "OPR en attente",
  provisional: "Réception provisoire",
  received: "Réceptionnée",
  operational: "En exploitation",
};

const NEEDS_LABELS: { key: keyof RoomHub["profile"]["needs"]; label: string }[] = [
  { key: "cfo", label: "CFO" },
  { key: "cfa", label: "CFA" },
  { key: "vdi", label: "VDI / IP" },
  { key: "medicalGas", label: "Gaz médicaux" },
  { key: "plumbing", label: "Plomberie" },
  { key: "cvc", label: "CVC" },
  { key: "ventilation", label: "Ventilation" },
  { key: "ssi", label: "SSI" },
  { key: "biomedicalEquipment", label: "Équip. biomédicaux" },
  { key: "medicalFurniture", label: "Mobilier médical" },
  { key: "adminFurniture", label: "Mobilier admin" },
  { key: "itEquipment", label: "Bureautique" },
];

type TabId =
  | "fiche"
  | "overview"
  | "needs"
  | "mep"
  | "equipment"
  | "boq"
  | "tasks"
  | "quality"
  | "docs";

const TABS: { id: TabId; label: string }[] = [
  { id: "fiche", label: "Fiche implémentation" },
  { id: "overview", label: "Vue d'ensemble" },
  { id: "needs", label: "Besoins techniques" },
  { id: "mep", label: "Lots MEP" },
  { id: "equipment", label: "Équipements & mobilier" },
  { id: "boq", label: "BOQ & appro." },
  { id: "tasks", label: "Tâches" },
  { id: "quality", label: "Réserves & essais" },
  { id: "docs", label: "Documents" },
];

export function RoomHubCockpit({
  hub,
  initialTab,
}: {
  hub: RoomHub;
  initialTab?: TabId;
}) {
  const [tab, setTab] = useState<TabId>(initialTab ?? "fiche");
  const { room, zone, profile, links, metrics, sheet } = hub;
  const activeNeeds = NEEDS_LABELS.filter((n) => profile.needs[n.key]);

  return (
    <div className="space-y-6">
      {/* En-tête cockpit */}
      <Card className="border-[#003F72]/20">
        <CardContent className="space-y-4 pt-6">
          <RoomNameEditor hub={hub} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#0891B2]">
                {profile.functionalRole} · {profile.department}
              </p>
              <p className="text-sm text-slate-500">
                {profile.clinicalActivity} · Plan {profile.planReference}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">{zone.name}</Badge>
              <Badge variant="info">{room.level}</Badge>
              <Badge variant="default">{sheet.surfaces.floorAreaM2.value} m²</Badge>
              <Badge
                variant={
                  profile.receptionStatus === "operational"
                    ? "success"
                    : profile.receptionStatus === "received"
                      ? "success"
                      : "warning"
                }
              >
                Réception : {RECEPTION_LABELS[profile.receptionStatus]}
              </Badge>
            </div>
          </div>

          <ProgressBar value={metrics.technicalProgress} />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {[
              { label: "Réserves", value: metrics.openReserves, warn: metrics.criticalReserves > 0 },
              { label: "Tâches", value: metrics.tasksTotal, warn: metrics.tasksLate > 0 },
              { label: "Essais", value: metrics.testsPending, warn: false },
              { label: "Équip. bloqués", value: metrics.blockedEquipment, warn: metrics.blockedEquipment > 0 },
              { label: "Livraisons", value: metrics.pendingDeliveries, warn: metrics.pendingDeliveries > 3 },
              { label: "Docs", value: metrics.documentsPending, warn: metrics.documentsPending > 0 },
              { label: "Checklist", value: `${metrics.checklistPct}%`, warn: metrics.checklistPct < 50 },
              { label: "Inventaire", value: links.inventory.length, warn: false },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-lg border p-2 text-center ${kpi.warn ? "border-orange-200 bg-orange-50" : "bg-slate-50"}`}
              >
                <p className="text-lg font-semibold text-[#003F72]">{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1 border-b pb-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-b-2 border-[#003F72] bg-white text-[#003F72]"
                    : "text-slate-500 hover:text-[#003F72]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {tab === "fiche" && (
        <>
          <RoomSheetPanel
            sheet={sheet}
            roomId={room.id}
            roomCode={room.code}
            roomName={profile.functionalRole}
          />
          <RoomFicheIogPreview hub={hub} />
        </>
      )}

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Personnel soignant prévu</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <p>Infirmiers : <strong>{profile.staffing.nurses}</strong></p>
              <p>Médecins : <strong>{profile.staffing.doctors}</strong></p>
              <p>Aides-soignants : <strong>{profile.staffing.aides}</strong></p>
              <p>Administratif : <strong>{profile.staffing.admin}</strong></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Prérequis installation</CardTitle></CardHeader>
            <CardContent>
              {profile.prerequisites.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun prérequis enregistré.</p>
              ) : (
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {profile.prerequisites.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Besoins actifs ({activeNeeds.length})</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {activeNeeds.map((n) => (
                <Badge key={n.key} variant="brand">{n.label}</Badge>
              ))}
              {profile.needs.medicalGas && (
                <>
                  <Badge variant="info">O₂ × {profile.needs.o2Outlets}</Badge>
                  <Badge variant="info">Vide × {profile.needs.vacuumOutlets}</Badge>
                  <Badge variant="info">Air méd. × {profile.needs.medicalAirOutlets}</Badge>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Packages dérivés ({links.derivedPackages.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {links.derivedPackages.slice(0, 6).map((wp) => (
                <div key={wp.id} className="flex items-center justify-between rounded border p-2 text-sm">
                  <span>{wp.title}</span>
                  <Badge variant="default">{wp.lotCode}</Badge>
                </div>
              ))}
              {links.derivedPackages.length > 6 && (
                <p className="text-xs text-slate-500">
                  + {links.derivedPackages.length - 6} autres packages
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "needs" && (
        <Card>
          <CardHeader><CardTitle>Matrice besoins techniques</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-[#003F72] text-left text-white">
                    <th className="p-2">Domaine</th>
                    <th className="p-2">Requis</th>
                    <th className="p-2">Détail</th>
                  </tr>
                </thead>
                <tbody>
                  {NEEDS_LABELS.map((n, i) => (
                    <tr key={n.key} className={i % 2 ? "bg-slate-50" : ""}>
                      <td className="p-2 font-medium">{n.label}</td>
                      <td className="p-2">
                        {profile.needs[n.key] ? (
                          <Badge variant="success">Oui</Badge>
                        ) : (
                          <Badge variant="default">Non</Badge>
                        )}
                      </td>
                      <td className="p-2 text-slate-500">
                        {n.key === "medicalGas" && profile.needs.medicalGas
                          ? `O₂: ${profile.needs.o2Outlets} · Vide: ${profile.needs.vacuumOutlets} · Air: ${profile.needs.medicalAirOutlets}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "mep" && (
        <Card>
          <CardHeader><CardTitle>Lots techniques ({links.lots.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {links.lots.map((lot) => (
              <Link
                key={lot.id}
                href={`/lots/${lot.id}`}
                className="block rounded-lg border p-3 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{lot.code} — {lot.name}</p>
                  <Badge variant="brand">{lot.progressPct}%</Badge>
                </div>
                <p className="text-sm text-slate-500">{lot.company} · {lot.responsible}</p>
                <ProgressBar value={lot.progressPct} showLabel={false} className="mt-2" />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "equipment" && <RoomInventorySheet hub={hub} />}

      {tab === "boq" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Lignes BOQ ({links.boqLines.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {links.boqLines.map((b) => (
                <div key={b.id} className="rounded border p-3 text-sm">
                  <p className="font-medium">{b.code} — {b.description}</p>
                  <p className="text-slate-500">
                    {b.lotCode} · {formatCurrency(b.qtyContract * b.unitPrice)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Approvisionnements ({links.procurement.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {links.procurement.map((p) => (
                <div key={p.id} className="rounded border p-3 text-sm">
                  <p className="font-medium">{p.description}</p>
                  <p className="text-slate-500">{p.supplier} · {p.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "tasks" && (
        <Card>
          <CardHeader><CardTitle>Tâches planning ({links.tasks.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {links.tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-slate-500">{t.plannedStart} → {t.plannedEnd}</p>
                </div>
                <Badge variant={t.status === "blocked" ? "danger" : t.status === "completed" ? "success" : "info"}>
                  {t.status}
                </Badge>
              </div>
            ))}
            {links.tasks.length === 0 && (
              <p className="text-sm text-slate-500">Aucune tâche rattachée.</p>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "quality" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Réserves ({links.reserves.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {links.reserves.map((r) => (
                <Link key={r.id} href="/reserves" className="block rounded border p-3 text-sm hover:bg-slate-50">
                  <p className="font-medium">{r.number} — {r.title}</p>
                  <Badge variant={r.severity === "critical" ? "danger" : "warning"}>{r.severity}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Essais ({links.tests.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {links.tests.map((t) => (
                <div key={t.id} className="rounded border p-3 text-sm">
                  <p className="font-medium">{t.system}</p>
                  <p className="text-slate-500">{t.normReference} · {t.result}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "docs" && (
        <Card>
          <CardHeader><CardTitle>Documents ({links.documents.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {links.documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-slate-500">{d.docType} · {d.version}</p>
                </div>
                <Badge variant={d.validationStatus === "approved" ? "success" : "warning"}>
                  {d.validationStatus}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
