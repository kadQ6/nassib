import { PLAN_ROOM_CATALOG } from "@/data/nassib/plan-catalog";
import { generateRoomSheet } from "@/lib/room-sheet/generator";
import type { RoomTechnicalSheet } from "@/types/room-sheet";
import { generatePlanningAlerts } from "@/lib/calculations/planning-alerts";
import type { NassibBundle } from "@/types/nassib";
import type {
  ProjectBaseline,
  RoomHub,
  RoomHubMetrics,
  RoomProfile,
  RoomRegistry,
} from "@/types/room-hub";
import { ROOM_PROFILES } from "./profiles";

/** Lignes BOQ explicitement rattachées à un local (description ou mapping) */
const BOQ_ROOM_KEYWORDS: Record<string, string[]> = {
  "BLC-01": ["bloc", "césarienne", "cesarienne", "pendentif"],
  "DECH-01": ["urgences", "déchocage"],
  "BOX-01": ["urgences", "box"],
  "TRV-01": ["accouchement", "travail", "gynéco", "gyneco"],
  "IMG-01": ["imagerie", "radiologie"],
  "LAB-01": ["laboratoire", "labo"],
  "STE-01": ["stérilisation", "sterilisation", "autoclave"],
  "TEC-01": ["centrale", "o₂", "o2", "fluides"],
  "HOS-01": ["hospitalisation", "chambre"],
  "BIB-01": ["néonat", "neonat", "biberonnerie"],
  "MAT-01": ["maternité", "maternite"],
  "ADM-01": ["accueil", "administration"],
};

function gasOutletsFromPlan(room: NassibBundle["rooms"][0]) {
  const def =
    PLAN_ROOM_CATALOG.find((d) => d.id === room.id) ??
    PLAN_ROOM_CATALOG.find((d) => d.code === room.code);
  return {
    o2Outlets: def?.needs.o2Outlets ?? 0,
    vacuumOutlets: def?.needs.vacuumOutlets ?? 0,
    medicalAirOutlets: def?.needs.medicalAirOutlets ?? 0,
  };
}

function resolveRoomSheet(
  state: NassibBundle,
  room: NassibBundle["rooms"][0],
): RoomTechnicalSheet {
  const existing = state.roomSheets?.[room.id];
  if (existing?.surfaces) return existing;

  const def =
    PLAN_ROOM_CATALOG.find((d) => d.id === room.id) ??
    PLAN_ROOM_CATALOG.find((d) => d.code === room.code);
  if (def) {
    const generated = generateRoomSheet(def);
    if (state.roomSheets) state.roomSheets[room.id] = generated;
    return generated;
  }

  const gas = gasOutletsFromPlan(room);

  return generateRoomSheet({
    id: room.id,
    code: room.code,
    name: room.name,
    level: room.level,
    zoneId: room.zoneId,
    zoneFunction: room.zoneFunction,
    areaM2: room.areaM2,
    planSheet: "A-01",
    functionalRole: room.name,
    clinicalActivity: room.zoneFunction,
    department: room.name,
    lots: room.lots,
    needs: {
      cfo: room.needs.cfo,
      cfa: room.needs.cfa,
      vdi: false,
      medicalGas: room.needs.medicalGas,
      o2Outlets: gas.o2Outlets,
      vacuumOutlets: gas.vacuumOutlets,
      medicalAirOutlets: gas.medicalAirOutlets,
      plumbing: room.needs.plumbing,
      cvc: room.needs.cvc,
      ventilation: room.needs.cvc,
      ssi: room.needs.ssi,
      biomedicalEquipment: room.equipmentCount > 0,
      medicalFurniture: room.needs.furniture,
      adminFurniture: false,
      itEquipment: room.needs.cfa,
    },
    staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 },
    prerequisites: [],
    receptionStatus: "not_started",
    layout: [],
    status: room.status,
    checklistDone: room.checklistDone,
    checklistTotal: room.checklistTotal,
    reservesOpen: room.reservesOpen,
  });
}

function defaultProfile(room: NassibBundle["rooms"][0]): RoomProfile {
  const zone = room.zoneFunction.replace(/_/g, " ");
  const gas = gasOutletsFromPlan(room);
  return {
    functionalRole: room.name,
    department: zone,
    departmentCode: "",
    clinicalActivity: zone,
    dispatchRevision: 0,
    validatedAt: "2025-06-10",
    staffing: { nurses: 0, doctors: 0, aides: 0, admin: 0 },
    needs: {
      cfo: room.needs.cfo,
      cfa: room.needs.cfa,
      vdi: false,
      medicalGas: room.needs.medicalGas,
      o2Outlets: gas.o2Outlets,
      vacuumOutlets: gas.vacuumOutlets,
      medicalAirOutlets: gas.medicalAirOutlets,
      plumbing: room.needs.plumbing,
      cvc: room.needs.cvc,
      ventilation: room.needs.cvc,
      ssi: room.needs.ssi,
      biomedicalEquipment: room.equipmentCount > 0,
      medicalFurniture: room.needs.furniture,
      adminFurniture: false,
      itEquipment: room.needs.cfa,
    },
    prerequisites: [],
    receptionStatus: "not_started",
    planReference: `NASSIB-APD-${room.code}`,
  };
}

function zoneForRoom(
  room: NassibBundle["rooms"][0],
  zones: NassibBundle["zones"],
) {
  return zones.find((z) => z.id === room.zoneId)!;
}

function deptCodeFromZone(zoneCode: string): string {
  return zoneCode;
}

function matchBoqForRoom(
  roomCode: string,
  roomLots: string[],
  boq: NassibBundle["boq"],
): NassibBundle["boq"] {
  const keywords = BOQ_ROOM_KEYWORDS[roomCode] ?? [];
  const desc = (d: string) => d.toLowerCase();

  return boq.filter((line) => {
    if (roomLots.includes(line.lotCode)) {
      if (keywords.length === 0) return true;
      return keywords.some((kw) => desc(line.description).includes(kw));
    }
    return keywords.some((kw) => desc(line.description).includes(kw));
  });
}

function matchProcurement(
  roomLots: string[],
  procurement: NassibBundle["procurement"],
) {
  return procurement.filter((p) => roomLots.includes(p.lotCode));
}

function matchDocuments(
  roomLots: string[],
  profile: RoomProfile,
  documents: NassibBundle["documents"],
) {
  const planRef = profile.planReference.toLowerCase();
  return documents.filter(
    (d) =>
      (d.lotCode && roomLots.includes(d.lotCode)) ||
      d.name.toLowerCase().includes(profile.department.toLowerCase()) ||
      d.name.toLowerCase().includes(planRef.split("-").pop() ?? ""),
  );
}

function isTaskLate(task: NassibBundle["tasks"][0]): boolean {
  if (task.status === "completed" || task.status === "cancelled") return false;
  return generatePlanningAlerts([task]).some((a) => a.type === "late");
}

function computeMetrics(
  room: NassibBundle["rooms"][0],
  links: RoomHub["links"],
): RoomHubMetrics {
  const openReserves = links.reserves.filter(
    (r) => !["closed", "levée"].includes(r.status),
  );
  const criticalReserves = openReserves.filter((r) => r.severity === "critical");
  const pendingDeliveries = links.procurement.filter(
    (p) =>
      !["delivered", "installed", "delivered_complete"].includes(p.status),
  ).length;
  const blockedEquipment = links.equipmentBiomedical.filter(
    (e) => e.status === "blocked" || !e.prerequisitesMet,
  ).length;
  const documentsPending = links.documents.filter(
    (d) =>
      !d.isObsolete &&
      ["submitted", "in_review"].includes(d.validationStatus),
  ).length;
  const tasksLate = links.actionTasks.filter(
    (t) =>
      t.status !== "done" &&
      t.status !== "cancelled" &&
      new Date(t.dueDate) < new Date(),
  ).length;
  const testsPending = links.tests.filter(
    (t) => !["conform", "validated"].includes(t.result),
  ).length;
  const checklistPct =
    room.checklistTotal > 0
      ? Math.round((room.checklistDone / room.checklistTotal) * 100)
      : 0;
  const boqAmount = links.boqLines.reduce(
    (s, l) => s + l.qtyContract * l.unitPrice,
    0,
  );

  return {
    technicalProgress: room.progressPct,
    checklistPct,
    openReserves: openReserves.length,
    criticalReserves: criticalReserves.length,
    pendingDeliveries,
    blockedEquipment,
    documentsPending,
    tasksTotal: links.actionTasks.length,
    tasksLate,
    testsPending,
    boqAmount,
  };
}

function buildBaseline(state: NassibBundle): ProjectBaseline {
  const { programme, rooms } = state;
  return {
    planVersion: programme.baseline.planFinal.version,
    planValidatedAt: programme.baseline.planFinal.validatedAt,
    boqVersion: programme.baseline.boq.version,
    boqValidatedAt: programme.baseline.boq.validatedAt,
    planningVersion: "V2 — exécution",
    planningValidatedAt: "2025-08-01",
    dispatchVersion: programme.baseline.dispatch.version,
    dispatchValidatedAt: programme.baseline.dispatch.validatedAt,
    chantierStartedAt: programme.baseline.chantierStartedAt,
    roomCount: rooms.length,
  };
}

export function buildRoomRegistry(state: NassibBundle): RoomRegistry {
  const { programme } = state;
  const slots = programme.equipmentSlots;

  const rooms: RoomHub[] = state.rooms.map((room) => {
    const zone = zoneForRoom(room, state.zones);
    const baseProfile = ROOM_PROFILES[room.id] ?? defaultProfile(room);
    const overrides = state.roomMetaOverrides?.[room.id];
    const profile: RoomProfile = {
      ...baseProfile,
      functionalRole: overrides?.functionalRole ?? baseProfile.functionalRole,
      clinicalActivity: overrides?.clinicalActivity ?? baseProfile.clinicalActivity,
      departmentCode: baseProfile.departmentCode || deptCodeFromZone(zone.code),
    };

    const roomLots = room.lots;
    const code = room.code;

    const links: RoomHub["links"] = {
      tasks: state.tasks.filter(
        (t) => t.roomCode === code || (t.lotCode && roomLots.includes(t.lotCode)),
      ),
      actionTasks: state.actionTasks.filter(
        (t) =>
          t.roomCode === code ||
          (t.lotCode && roomLots.includes(t.lotCode)),
      ),
      lots: state.mepLots.filter((l) => roomLots.includes(l.code)),
      boqLines: matchBoqForRoom(code, roomLots, state.boq),
      equipmentBiomedical: state.equipment.filter(
        (e) => e.roomCode === code && e.inventoryKind === "biomedical",
      ),
      inventory: state.equipment.filter((e) => e.roomCode === code),
      equipmentTechnical: slots.filter(
        (s) => s.roomCode === code && s.category === "technical",
      ),
      furniture: slots.filter(
        (s) => s.roomCode === code && s.category === "furniture",
      ),
      itAssets: slots.filter(
        (s) => s.roomCode === code && s.category === "it",
      ),
      procurement: matchProcurement(roomLots, state.procurement),
      documents: matchDocuments(roomLots, profile, state.documents),
      reserves: state.reserves.filter((r) => r.roomCode === code),
      tests: state.tests.filter(
        (t) => t.roomCode === code || (t.lotCode && roomLots.includes(t.lotCode)),
      ),
      derivedPackages: programme.derivation.packages.filter(
        (wp) => wp.sourceRoomCode === code,
      ),
    };

    const sheet = resolveRoomSheet(state, room);

    return {
      room,
      zone,
      profile,
      sheet,
      links,
      metrics: computeMetrics(room, links),
    };
  });

  const receptionReady = rooms.filter(
    (h) =>
      h.profile.receptionStatus === "received" ||
      h.profile.receptionStatus === "operational",
  ).length;

  return {
    baseline: buildBaseline(state),
    rooms,
    totals: {
      rooms: rooms.length,
      openReserves: rooms.reduce((s, h) => s + h.metrics.openReserves, 0),
      pendingTests: rooms.reduce((s, h) => s + h.metrics.testsPending, 0),
      equipmentToInstall: state.equipment.filter(
        (e) => !["installed", "commissioned"].includes(e.status),
      ).length,
      receptionReady,
    },
  };
}

export function getRoomHub(
  state: NassibBundle,
  roomId: string,
): RoomHub | undefined {
  const hub = (state.roomRegistry ?? buildRoomRegistry(state)).rooms.find(
    (h) => h.room.id === roomId,
  );
  if (hub && !hub.sheet?.surfaces) {
    state.roomRegistry = buildRoomRegistry(state);
    return state.roomRegistry.rooms.find((h) => h.room.id === roomId);
  }
  return hub;
}

export function getRoomHubByCode(
  state: NassibBundle,
  roomCode: string,
): RoomHub | undefined {
  const registry = state.roomRegistry ?? buildRoomRegistry(state);
  return registry.rooms.find((h) => h.room.code === roomCode);
}
