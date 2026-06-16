import type {
  DerivedWorkPackage,
  EquipmentImplementationSlot,
  GasOutletsPlan,
  ProgrammeDerivation,
  ProgrammeRevision,
  RoomDispatch,
  ValidatedBaseline,
} from "@/types/programme";
import type { NassibEquipment, NassibProcurement } from "@/types/nassib";

const LOT_MAP = {
  cfo: "LOT-CFO",
  cfa: "LOT-CFA",
  cvc: "LOT-CVC",
  plumbing: "LOT-PLOMB",
  medicalGas: "LOT-FLUIDES",
  ssi: "LOT-SSI",
  vdi: "LOT-VDI",
} as const;

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function mepPackage(
  dispatch: RoomDispatch,
  lot: string,
  trade: string,
  offset: number,
): DerivedWorkPackage {
  return {
    id: `drv-mep-${dispatch.roomCode}-${trade}`,
    type: "mep_deployment",
    sourceRoomCode: dispatch.roomCode,
    lotCode: lot,
    title: `Déploiement ${trade} — ${dispatch.roomCode}`,
    description: `${dispatch.assignedRole} · ${dispatch.clinicalActivity}`,
    plannedStart: addDays("2026-04-01", offset),
    plannedEnd: addDays("2026-06-01", offset + 45),
    status: offset % 3 === 0 ? "in_progress" : "pending",
    priority: dispatch.needs.medicalGas ? "critical" : "high",
    links: { module: "Lots MEP", href: `/lots/${lot.toLowerCase()}` },
  };
}

function equipmentStatusToPackageStatus(
  status: NassibEquipment["status"],
): DerivedWorkPackage["status"] {
  if (["installed", "tested", "commissioned", "accepted"].includes(status))
    return "done";
  if (["blocked", "customs"].includes(status)) return "blocked";
  if (["delivered", "in_transit", "manufacturing", "ordered"].includes(status))
    return "in_progress";
  return "pending";
}

export function deriveProgramme(params: {
  baseline: ValidatedBaseline;
  dispatches: RoomDispatch[];
  equipmentSlots: EquipmentImplementationSlot[];
  equipment: NassibEquipment[];
  procurement: NassibProcurement[];
  revisions?: ProgrammeRevision[];
}): ProgrammeDerivation {
  const packages: DerivedWorkPackage[] = [];
  let offset = 0;
  const roomIdByCode = Object.fromEntries(
    params.dispatches.map((d) => [d.roomCode, d.roomId]),
  );

  const gasTotals: GasOutletsPlan = { o2: 0, vacuum: 0, medicalAir: 0 };

  for (const dispatch of params.dispatches) {
    gasTotals.o2 += dispatch.gasOutlets.o2;
    gasTotals.vacuum += dispatch.gasOutlets.vacuum;
    gasTotals.medicalAir += dispatch.gasOutlets.medicalAir;

    if (dispatch.needs.cfo)
      packages.push(mepPackage(dispatch, LOT_MAP.cfo, "CFO", offset));
    if (dispatch.needs.cfa)
      packages.push(mepPackage(dispatch, LOT_MAP.cfa, "CFA", offset + 5));
    if (dispatch.needs.cvc)
      packages.push(mepPackage(dispatch, LOT_MAP.cvc, "CVC", offset + 10));
    if (dispatch.needs.plumbing)
      packages.push(mepPackage(dispatch, LOT_MAP.plumbing, "Plomberie", offset + 15));
    if (dispatch.needs.medicalGas) {
      packages.push({
        id: `drv-gas-${dispatch.roomCode}`,
        type: "mep_deployment",
        sourceRoomCode: dispatch.roomCode,
        lotCode: LOT_MAP.medicalGas,
        title: `Réseau fluides — ${dispatch.roomCode}`,
        description: `O₂×${dispatch.gasOutlets.o2} · Vide×${dispatch.gasOutlets.vacuum} · Air×${dispatch.gasOutlets.medicalAir}`,
        plannedStart: addDays("2026-05-01", offset),
        plannedEnd: addDays("2026-08-01", offset + 60),
        status: "in_progress",
        priority: "critical",
        links: { module: "Fluides médicaux", href: "/fluides-medicaux" },
      });
    }
    if (dispatch.needs.vdi)
      packages.push(mepPackage(dispatch, LOT_MAP.vdi, "VDI/IT", offset + 20));
    if (dispatch.needs.ssi)
      packages.push(mepPackage(dispatch, LOT_MAP.ssi, "SSI", offset + 25));

    offset += 2;
  }

  packages.push({
    id: "drv-o2-production",
    type: "gas_production",
    sourceRoomCode: "TEC-01",
    lotCode: LOT_MAP.medicalGas,
    title: "Mise en service centrale O₂ Lot fluides",
    description: `Production O₂ pour ${gasTotals.o2} prises planifiées`,
    plannedStart: "2026-09-01",
    plannedEnd: "2026-10-15",
    status: "pending",
    priority: "critical",
    links: { module: "Fluides médicaux", href: "/fluides-medicaux" },
  });

  packages.push({
    id: "drv-o2-commissioning",
    type: "testing",
    lotCode: LOT_MAP.medicalGas,
    title: "Essais étanchéité & pureté O₂",
    description: "ISO 7396-1 · analyse gaz · PV conformité",
    plannedStart: "2026-10-16",
    plannedEnd: "2026-10-30",
    status: "pending",
    priority: "critical",
    links: { module: "Essais", href: "/essais" },
  });

  for (const slot of params.equipmentSlots) {
    if (slot.category === "technical") {
      packages.push({
        id: `drv-${slot.id}`,
        type: "gas_production",
        sourceRoomCode: slot.roomCode,
        lotCode: "LOT-FLUIDES",
        title: slot.name,
        description: `Dépendances: ${slot.dependencies.join(", ")}`,
        plannedStart: "2026-08-15",
        plannedEnd: "2026-09-30",
        status: "in_progress",
        priority: "critical",
        links: { module: "Locaux", href: `/locaux/${roomIdByCode[slot.roomCode] ?? ""}` },
      });
      continue;
    }

    const eq = slot.linkedEquipmentId
      ? params.equipment.find((e) => e.id === slot.linkedEquipmentId)
      : undefined;

    packages.push({
      id: `drv-install-${slot.id}`,
      type: "equipment_install",
      sourceRoomCode: slot.roomCode,
      sourceEquipmentId: slot.linkedEquipmentId,
      lotCode: eq ? "LOT-BIO" : slot.category === "it" ? "LOT-VDI" : "LOT-GO",
      title: `Installation ${slot.name}`,
      description: `${slot.roomCode} · phase ${slot.installPhase}`,
      plannedStart: addDays("2026-07-01", params.equipmentSlots.indexOf(slot) % 30),
      plannedEnd: addDays("2026-09-01", params.equipmentSlots.indexOf(slot) % 30 + 14),
      status: eq ? equipmentStatusToPackageStatus(eq.status) : "pending",
      priority: slot.category === "biomedical" ? "high" : "normal",
      links: {
        module: slot.category === "biomedical" ? "Équipements" : "Locaux",
        href: eq ? "/installation-dm" : `/locaux/${roomIdByCode[slot.roomCode] ?? ""}`,
      },
    });

    if (eq && !["delivered", "installed", "tested", "commissioned", "accepted"].includes(eq.status)) {
      packages.push({
        id: `drv-proc-${eq.id}`,
        type: "procurement",
        sourceRoomCode: slot.roomCode,
        sourceEquipmentId: eq.id,
        lotCode: "LOT-BIO",
        title: `Commande ${eq.name}`,
        description: `${eq.supplier} · ${eq.qty} u.`,
        plannedStart: "2026-03-01",
        plannedEnd: eq.expectedDelivery ?? "2026-12-31",
        status: equipmentStatusToPackageStatus(eq.status),
        priority: eq.status === "blocked" ? "critical" : "high",
        links: { module: "Achats", href: "/approvisionnements" },
      });
    }

    if (eq?.expectedDelivery) {
      packages.push({
        id: `drv-log-${eq.id}`,
        type: "logistics",
        sourceRoomCode: slot.roomCode,
        sourceEquipmentId: eq.id,
        lotCode: "LOT-BIO",
        title: `Livraison ${eq.name}`,
        description: `Réception site · ${eq.roomCode}`,
        plannedStart: addDays(eq.expectedDelivery, -7),
        plannedEnd: eq.expectedDelivery,
        status: eq.actualDelivery ? "done" : "pending",
        priority: "high",
        links: { module: "Logistique", href: "/logistique" },
      });
    }
  }

  for (const proc of params.procurement.filter((p) => p.planningImpact)) {
    if (packages.some((pk) => pk.title.includes(proc.description.slice(0, 20))))
      continue;
    packages.push({
      id: `drv-proc-ref-${proc.id}`,
      type: "procurement",
      lotCode: proc.lotCode,
      title: proc.description,
      description: `${proc.supplier} · ${proc.reference}`,
      plannedStart: proc.orderDate ?? "2026-01-01",
      plannedEnd: proc.expectedDate,
      status: ["delivered", "installed"].includes(proc.status) ? "done" : "in_progress",
      priority: proc.criticality === "critical" ? "critical" : "high",
      links: { module: "Achats", href: "/approvisionnements" },
    });
  }

  packages.push({
    id: "drv-coord-weekly",
    type: "coordination",
    lotCode: "LOT-GO",
    title: "Réunion chantier hebdomadaire",
    description: "Suivi dérivés programme · réserves · délais",
    plannedStart: "2026-06-17",
    plannedEnd: "2026-06-17",
    status: "pending",
    priority: "normal",
    links: { module: "Réunions", href: "/reunions" },
  });

  const revisions = params.revisions ?? DEFAULT_REVISIONS;

  return {
    generatedAt: new Date().toISOString(),
    baselineVersion: params.baseline.dispatch.version,
    packages,
    summary: {
      totalPackages: packages.length,
      mepTasks: packages.filter((p) => p.type === "mep_deployment").length,
      equipmentInstalls: packages.filter((p) => p.type === "equipment_install").length,
      procurements: packages.filter((p) => p.type === "procurement").length,
      logistics: packages.filter((p) => p.type === "logistics").length,
      tests: packages.filter((p) => p.type === "testing").length,
      gasOutletsRequired: gasTotals,
      o2ProductionSteps: packages.filter((p) => p.type === "gas_production").length,
      openRevisions: revisions.filter((r) => r.status === "proposed").length,
      roomsWithPendingInstall: new Set(
        packages
          .filter((p) => p.type === "equipment_install" && p.status !== "done")
          .map((p) => p.sourceRoomCode)
          .filter(Boolean),
      ).size,
    },
    revisions,
  };
}

/** Révisions programme — saisies utilisateur uniquement. */
const DEFAULT_REVISIONS: ProgrammeRevision[] = [];

export { DEFAULT_REVISIONS };
