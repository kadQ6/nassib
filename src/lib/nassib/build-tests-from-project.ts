import { PLANNING_GANTT_TASKS } from "@/data/nassib/planning-gantt-2026";
import type { NassibTest } from "@/types/nassib";

const SYSTEM_LOT: Record<string, string> = {
  "1.7.1": "LOT-PLOMB",
  "1.7.2": "LOT-CFO",
  "1.7.3": "LOT-SSI",
  "1.7.4": "LOT-CFA",
  "1.7.5": "LOT-CVC",
  "1.7.6": "LOT-FLUIDES",
};

const SYSTEM_NORM: Record<string, string> = {
  "1.7.1": "DTU 60.11 / essais étanchéité réseaux",
  "1.7.2": "NF C 15-100 / mesures isolement",
  "1.7.3": "NF S 61-932 / essais SSI",
  "1.7.4": "ISO/IEC 11801 / VDI essais",
  "1.7.5": "DTU 68.3 / balancement CVC",
  "1.7.6": "NF EN ISO 7396-1 / pureté & pression O₂",
};

const SYSTEM_ZONE: Record<string, string> = {
  "1.7.1": "VRD / bâtiment",
  "1.7.2": "TGBT — locaux techniques",
  "1.7.3": "Ensemble bâtiment",
  "1.7.4": "Baies VDI — locaux soignés",
  "1.7.5": "UTA — zones cliniques",
  "1.7.6": "Production TEC-01 → réseaux",
};

const SYSTEM_RESPONSIBLE: Record<string, string> = {
  "1.7.1": "Entreprise plomberie",
  "1.7.2": "Entreprise CFO",
  "1.7.3": "Entreprise SSI",
  "1.7.4": "Entreprise CFA / VDI",
  "1.7.5": "Entreprise CVC",
  "1.7.6": "Production fluides médicaux",
};

/** Essais système — alignés WBS 1.7 du planning Gantt transmis */
function systemTestsFromGantt(): NassibTest[] {
  return PLANNING_GANTT_TASKS.filter((t) => t.wbsCode?.startsWith("1.7.") && t.wbsCode !== "1.7")
    .map((t) => {
      const wbs = t.wbsCode!;
      const progress = t.progressPct ?? 0;
      let result: NassibTest["result"] = "planned";
      if (progress >= 100) result = "validated";
      else if (progress > 0) result = "in_progress";

      return {
        id: `test-sys-${wbs.replace(/\./g, "-")}`,
        system: t.name,
        zone: SYSTEM_ZONE[wbs] ?? "Ensemble projet",
        lotCode: SYSTEM_LOT[wbs] ?? "LOT-ESSAIS",
        normReference: SYSTEM_NORM[wbs] ?? "Protocole MOE",
        plannedDate: t.plannedEnd,
        actualDate: progress >= 100 ? t.plannedEnd : undefined,
        responsible: SYSTEM_RESPONSIBLE[wbs] ?? "MOE / OPC",
        result,
        reservesLinked: 0,
      };
    });
}

/** Essais locaux / OPR — locaux critiques Polyclinique Nassib */
const LOCAL_PROTOCOLS: Omit<NassibTest, "id">[] = [
  {
    system: "Essai fluides bloc césarienne — colonnes & bandeau mural",
    zone: "Bloc césarienne",
    lotCode: "LOT-FLUIDES",
    roomCode: "BLC-01",
    normReference: "NF EN ISO 7396-1 · circuit B indépendant",
    plannedDate: "2027-01-05",
    responsible: "Biomédical / fluides",
    result: "planned",
    reservesLinked: 0,
  },
  {
    system: "Essai bandeaux SSPI — O₂ / air / aspiration",
    zone: "SSPI",
    lotCode: "LOT-FLUIDES",
    roomCode: "REV-01",
    normReference: "Protocole SSPI post-op",
    plannedDate: "2027-01-07",
    responsible: "Anesthésie / fluides",
    result: "planned",
    reservesLinked: 0,
  },
  {
    system: "Qualification stérilisation CSSD",
    zone: "Stérilisation",
    lotCode: "LOT-BIO",
    roomCode: "STE-01",
    normReference: "EN ISO 13485 / EN ISO 17665",
    plannedDate: "2026-12-20",
    responsible: "CSSD / biomédical",
    result: "in_progress",
    reservesLinked: 0,
  },
  {
    system: "Essai pureté O₂ & pression réseau",
    zone: "Production VRD",
    lotCode: "LOT-FLUIDES",
    roomCode: "TEC-01",
    normReference: "NF EN ISO 7396-1 · analyse gaz",
    plannedDate: "2027-01-04",
    responsible: "Production O₂",
    result: "planned",
    reservesLinked: 0,
  },
  {
    system: "OPR bandeaux hospitalisation — prises & appel malade",
    zone: "Hospitalisation R+1",
    lotCode: "LOT-CFO",
    roomCode: "HOS-01",
    normReference: "Fiche technique chambre patient",
    plannedDate: "2026-12-15",
    responsible: "CFO / CFA",
    result: "planned",
    reservesLinked: 0,
  },
  {
    system: "Essai bandeaux box urgences",
    zone: "Urgences",
    lotCode: "LOT-FLUIDES",
    roomCode: "BOX-01",
    normReference: "Protocole box soins",
    plannedDate: "2026-12-18",
    actualDate: "2026-12-17",
    responsible: "Urgences / fluides",
    result: "conform",
    reservesLinked: 0,
  },
  {
    system: "Essai scialytique & colonnes bloc",
    zone: "Bloc césarienne",
    lotCode: "LOT-BIO",
    roomCode: "BLC-01",
    normReference: "IEC 60601-1 / mise en service DM",
    plannedDate: "2026-12-22",
    responsible: "Biomédical",
    result: "non_conform",
    reservesLinked: 2,
  },
  {
    system: "OPR réception provisoire — chambres maternité",
    zone: "Maternité RDC",
    lotCode: "LOT-GO",
    roomCode: "MAT-01",
    normReference: "PV réception local · check-list MOE",
    plannedDate: "2027-01-15",
    responsible: "MOE / MOA",
    result: "planned",
    reservesLinked: 0,
  },
];

export function buildTestsFromProject(): NassibTest[] {
  const system = systemTestsFromGantt();
  const local = LOCAL_PROTOCOLS.map((p, i) => ({
    ...p,
    id: `test-local-${String(i + 1).padStart(2, "0")}`,
  }));
  return [...system, ...local];
}

export type TestsBuildSummary = ReturnType<typeof summarizeTestsBuild>;

export function summarizeTestsBuild(tests: NassibTest[]) {
  return {
    total: tests.length,
    system: tests.filter((t) => !t.roomCode).length,
    local: tests.filter((t) => t.roomCode).length,
  };
}
