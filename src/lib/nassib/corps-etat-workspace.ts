import { BOQ_META, BOQ_RECAP } from "@/data/nassib/boq-polyclinique";
import {
  buildBoqCorpsEtatRows,
  type BoqCorpsEtatRow,
} from "@/lib/nassib/boq-dashboard";
import type { NassibRoom, PlanningTask } from "@/types/nassib";

export type CorpsEtatTaskItem = {
  id: string;
  label: string;
  status: "done" | "in_progress" | "pending";
  progressPct?: number;
};

export type CorpsEtatCard = BoqCorpsEtatRow & {
  shortTitle: string;
  tradeBadge: string;
  contractor: string;
  dateStart: string;
  dateEnd: string;
  rooms: { code: string; name: string }[];
  tasks: CorpsEtatTaskItem[];
};

const CE_CONFIG: Record<
  string,
  {
    shortTitle: string;
    tradeBadge: string;
    lotCodes: string[];
    tasks: CorpsEtatTaskItem[];
  }
> = {
  "CE-01": {
    shortTitle: "Gros et second œuvre",
    tradeBadge: "GO",
    lotCodes: ["LOT-GO"],
    tasks: [
      { id: "t1", label: "Fondations et radier", status: "done" },
      { id: "t2", label: "Structure béton armé", status: "done" },
      { id: "t3", label: "Maçonnerie briques", status: "in_progress", progressPct: 60 },
      { id: "t4", label: "Enduits et crépis", status: "in_progress", progressPct: 30 },
    ],
  },
  "CE-02": {
    shortTitle: "Électricité / CFA / SI",
    tradeBadge: "ELEC",
    lotCodes: ["LOT-CFO", "LOT-CFA", "LOT-SSI", "LOT-CCTV"],
    tasks: [
      { id: "t1", label: "Plans électricité CFO/CFA approuvés", status: "done" },
      {
        id: "t2",
        label: "Câblage TGBT et colonnes",
        status: "in_progress",
        progressPct: 20,
      },
      { id: "t3", label: "Essais et mise en service élec.", status: "pending" },
    ],
  },
  "CE-03": {
    shortTitle: "Fluides / Climatisations",
    tradeBadge: "FLUIDES",
    lotCodes: ["LOT-CVC", "LOT-PLOMB", "LOT-FLUIDES"],
    tasks: [
      { id: "t1", label: "Réseaux encastrés plomberie", status: "in_progress", progressPct: 35 },
      { id: "t2", label: "CVC / ventilation", status: "in_progress", progressPct: 22 },
      { id: "t3", label: "Fluides médicaux — essais", status: "pending" },
    ],
  },
  "CE-04": {
    shortTitle: "Divers",
    tradeBadge: "DIVERS",
    lotCodes: ["LOT-DIVERS", "LOT-VRD"],
    tasks: [
      { id: "t1", label: "VRD et voiries", status: "pending" },
      { id: "t2", label: "Aménagements extérieurs", status: "pending" },
    ],
  },
};

function roomsForLots(rooms: NassibRoom[], lotCodes: string[]) {
  return rooms
    .filter((r) => r.lots.some((l) => lotCodes.includes(l)))
    .map((r) => ({ code: r.code, name: r.name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function buildCorpsEtatCards(
  rooms: NassibRoom[],
  _tasks: PlanningTask[],
  boq?: import("@/types/nassib").BoqLine[],
): CorpsEtatCard[] {
  const rows = buildBoqCorpsEtatRows(boq);
  const contractor = BOQ_META.emitter;

  return rows.map((row) => {
    const cfg = CE_CONFIG[row.code];
    const recap = BOQ_RECAP.find((r) => r.n === parseInt(row.code.split("-")[1], 10));

    return {
      ...row,
      designation: recap?.corps ?? row.designation,
      shortTitle: cfg.shortTitle,
      tradeBadge: cfg.tradeBadge,
      contractor,
      dateStart: BOQ_META.validatedAt,
      dateEnd: "2026-12-31",
      rooms: roomsForLots(rooms, cfg.lotCodes).slice(0, 12),
      tasks: cfg.tasks,
    };
  });
}

export function corpsEtatKpis(cards: CorpsEtatCard[]) {
  const totalHt = BOQ_META.totalHt;
  const globalProgress =
    totalHt > 0
      ? Math.round(
          cards.reduce((s, c) => s + c.amountHt * c.progressPct, 0) / totalHt,
        )
      : 0;
  const active = cards.filter((c) => c.status === "en_cours").length;

  return {
    totalHt,
    globalProgress,
    active,
    total: cards.length,
  };
}

export function corpsEtatChartItems(cards: CorpsEtatCard[]) {
  return cards.map((c) => ({
    code: c.code,
    label: c.shortTitle,
    progressPct: c.progressPct,
    color:
      c.code === "CE-01"
        ? "#E8914C"
        : c.code === "CE-02"
          ? "#D4A855"
          : c.code === "CE-03"
            ? "#67B7D1"
            : "#8B9CB3",
  }));
}
