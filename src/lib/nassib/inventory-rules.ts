import type { LayoutCategory } from "@/data/nassib/plan-types";
import { isMepFixtureName } from "./bed-headboard-mep";
import type {
  ConstructionGate,
  InstallPhase,
  InventoryKind,
  MedicalFurnitureGroup,
} from "@/types/nassib";

/** Mobilier patient — lits, brancards, tables chambre, chariots… */
const MEDICAL_FURNITURE = [
  "lit hospitalier",
  "lit complet",
  "lit ",
  "brancard",
  "berceau",
  "paillasse",
  "table de soin",
  "table accouchement",
  "table à manger",
  "chariot de soin",
  "chariot urgence",
  "paravent",
  "chevet",
  "fauteuil repos",
  "guéridon",
  "table consultation",
  "banquette",
  "w.c",
  "wc",
];

/** Équipements mal classés « biomedical » dans le plan → mobilier médical */
const BIOMEDICAL_AS_MEDICAL_FURNITURE = [
  "chariot de soin",
  "table accouchement",
];

const OFFICE_FURNITURE = [
  "bureau",
  "chaise",
  "rangement",
  "fauteuil direction",
  "table réunion",
  "poste pc",
  "poste lis",
  "écran affichage",
  "imprimante",
  "imprimante multifonction",
  "armoire pharmacie",
  "rayonnage",
  "comptoir",
  "guichet",
  "banque accueil",
  "vestiaire",
  "banc",
];

const MEP_EMBEDDED_EQUIPMENT = [
  "scialytique",
  "pendentif",
  "colonne suspendue",
  "bandeau de lit",
  "bandeau mural",
  "potter-bucky",
  "générateur rx",
  "tableau radiologie",
  "autoclave",
  "laveur",
  "table de chirurgie",
];

const MEDICAL_GAS_EQUIPMENT = [
  "respirateur",
  "ventilateur",
  "pendentif",
  "colonne suspendue",
  "bandeau de lit",
  "bandeau mural",
  "moniteur",
  "chariot urgence",
];

export const INVENTORY_KIND_LABELS: Record<InventoryKind, string> = {
  biomedical: "Équipements médicaux",
  medical_furniture: "Mobilier médical",
  office_furniture: "Mobilier bureau",
};

export const MEDICAL_FURNITURE_GROUP_LABELS: Record<MedicalFurnitureGroup, string> = {
  lit_brancard: "Lits & brancards",
  chambre_patient: "Tables à manger, chevets, fauteuils",
  soins_support: "Chariots & paravents",
  tables_cliniques: "Tables de soin / accouchement",
  autre: "Autre mobilier médical",
};

export const CONSTRUCTION_GATE_LABELS: Record<ConstructionGate, string> = {
  before_mep_embedded: "Avant réseaux encastrés MEP",
  before_false_ceiling: "Avant fermeture faux plafonds",
  before_cvc_final: "Avant CVC / ventilation finale",
  before_ssi_final: "Avant SSI / détection incendie",
  after_finishes: "Après finitions (sols, peinture)",
  commissioning: "Mise en service / essais",
};

export const INSTALL_PHASE_LABELS: Record<InstallPhase, string> = {
  rough_in: "Gros œuvre / réservations",
  mep_embedded: "MEP encastré (avant FP)",
  finishes: "Finitions / livraison",
  commissioning: "Essais & réception",
};

function matchesAny(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

export function medicalFurnitureGroup(name: string): MedicalFurnitureGroup {
  const lower = name.toLowerCase();
  if (/lit|brancard|berceau/.test(lower)) return "lit_brancard";
  if (/table à manger|chevet|fauteuil repos/.test(lower)) return "chambre_patient";
  if (/chariot|paravent|guéridon/.test(lower)) return "soins_support";
  if (/table de soin|table accouchement|table consultation|paillasse/.test(lower)) {
    return "tables_cliniques";
  }
  return "autre";
}

export function isBedOrStretcher(name: string): boolean {
  const lower = name.toLowerCase();
  return /lit|brancard|berceau/.test(lower);
}

export function classifyInventoryKind(
  name: string,
  category: LayoutCategory,
): InventoryKind {
  const lower = name.toLowerCase();

  if (category === "technical" && isMepFixtureName(name)) return "biomedical";

  if (category === "it") return "office_furniture";

  if (
    category === "furniture" ||
    BIOMEDICAL_AS_MEDICAL_FURNITURE.some((kw) => lower.includes(kw))
  ) {
    if (matchesAny(name, OFFICE_FURNITURE)) return "office_furniture";
    if (matchesAny(name, MEDICAL_FURNITURE)) return "medical_furniture";
    return category === "furniture" ? "medical_furniture" : "biomedical";
  }

  if (category === "biomedical") return "biomedical";

  return "medical_furniture";
}

export function assetPrefix(kind: InventoryKind): string {
  switch (kind) {
    case "biomedical":
      return "DM";
    case "medical_furniture":
      return "MM";
    case "office_furniture":
      return "MB";
  }
}

export interface InventoryMepProfile {
  installPhase: InstallPhase;
  constructionGate: ConstructionGate;
  mepDependencies: string[];
  constructionNote: string;
  medicalGasNeed: boolean;
  plumbingNeed: boolean;
  cvcNeed: boolean;
  networkNeed: boolean;
  electricalNeed: string;
}

export function resolveInventoryMepProfile(
  name: string,
  kind: InventoryKind,
  roomHasMedicalGas: boolean,
): InventoryMepProfile {
  const lower = name.toLowerCase();

  if (kind === "office_furniture") {
    return {
      installPhase: "finishes",
      constructionGate: "after_finishes",
      mepDependencies: ["GO", "CFO"],
      constructionNote: "Livraison après finitions — prises et réseaux terminés.",
      medicalGasNeed: false,
      plumbingNeed: false,
      cvcNeed: false,
      networkNeed: lower.includes("poste") || lower.includes("pc") || lower.includes("lis"),
      electricalNeed: "16A",
    };
  }

  if (kind === "medical_furniture") {
    const needsPlumbing = lower.includes("w.c") || lower.includes("wc");
    const needsGas =
      roomHasMedicalGas &&
      (isBedOrStretcher(name) || lower.includes("table accouchement"));
    return {
      installPhase: needsPlumbing ? "mep_embedded" : "finishes",
      constructionGate: needsPlumbing ? "before_false_ceiling" : "after_finishes",
      mepDependencies: needsPlumbing
        ? ["PLOMB", "GO"]
        : needsGas
          ? ["GO", "FLUIDES"]
          : ["GO"],
      constructionNote: needsGas
        ? lower.includes("table accouchement")
          ? "Table accouchement : prises O₂, aspiration et air médical selon plan d'implantation."
          : "Lit / brancard : prises O₂ et aspiration liées au plan d'implantation."
        : needsPlumbing
          ? "Raccordements sanitaires avant fermeture cloisons."
          : "Mobilier médical après sols et peinture.",
      medicalGasNeed: needsGas || isMepFixtureName(name),
      plumbingNeed: needsPlumbing,
      cvcNeed: false,
      networkNeed: false,
      electricalNeed: lower.includes("lit") ? "16A" : "",
    };
  }

  const isEmbedded = MEP_EMBEDDED_EQUIPMENT.some((kw) => lower.includes(kw));
  const needsGas =
    roomHasMedicalGas &&
    MEDICAL_GAS_EQUIPMENT.some((kw) => lower.includes(kw));
  const needsCvc = lower.includes("scialytique") || lower.includes("bloc");
  const needsNetwork =
    lower.includes("échographe") ||
    lower.includes("tableau radiologie") ||
    lower.includes("automate");

  if (isEmbedded || needsGas) {
    const deps = ["GO", "CFO"];
    if (needsGas) deps.push("FLUIDES", "O2", "AIR_MED");
    if (needsCvc) deps.push("CVC");
    if (needsNetwork) deps.push("CFA", "VDI");

    let gate: ConstructionGate = "before_false_ceiling";
    let note =
      "Coordonner réservations plafond, alimentations et fluides avant fermeture faux plafonds.";

    if (lower.includes("scialytique")) {
      note =
        "Scialytique : fixation structure plafond + alimentation CFO avant fermeture FP. Valider avec CVC (plénum).";
      deps.push("CVC");
      gate = "before_cvc_final";
    }
    if (lower.includes("pendentif")) {
      note =
        "Pendentif : rails, fluides médicaux et CFO encastrés avant FP. Essais fluides avant SSI final.";
      gate = "before_false_ceiling";
    }
    if (lower.includes("colonne suspendue")) {
      note =
        "Colonne suspendue bloc : fluides médicaux, prises secourues et RJ45 — fixation structure plafond avant FP.";
      gate = "before_false_ceiling";
    }
    if (lower.includes("bandeau de lit") || lower.includes("bandeau mural")) {
      note =
        "Bandeau BTDL : O₂, aspiration, prises secourues, appel malade, RJ45 et éclairage ambiance/totale — pose après finitions murales.";
      gate = "before_false_ceiling";
    }
    if (lower.includes("potter") || lower.includes("radiologie") || lower.includes("générateur")) {
      note =
        "Imagerie : blindage, CFO dédié et réservations avant cloisons / FP.";
      gate = "before_mep_embedded";
    }

    return {
      installPhase: "mep_embedded",
      constructionGate: gate,
      mepDependencies: [...new Set(deps)],
      constructionNote: note,
      medicalGasNeed: needsGas || isMepFixtureName(name),
      plumbingNeed: lower.includes("laveur") || lower.includes("autoclave"),
      cvcNeed: needsCvc,
      networkNeed: needsNetwork,
      electricalNeed: lower.includes("autoclave") ? "32A tri" : "16A",
    };
  }

  return {
    installPhase: "finishes",
    constructionGate: "after_finishes",
    mepDependencies: ["GO", "CFO", ...(needsGas ? ["FLUIDES"] : [])],
    constructionNote: "Livraison et installation après finitions intérieures.",
    medicalGasNeed: needsGas,
    plumbingNeed: false,
    cvcNeed: false,
    networkNeed: needsNetwork,
    electricalNeed: "16A",
  };
}
