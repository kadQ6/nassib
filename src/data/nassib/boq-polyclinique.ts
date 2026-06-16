/**
 * BOQ Polyclinique Nassib — import intégral
 * Source : BOQ polyclinique last vers - 签合同量单.pdf (27/10/2024, DJI-FU SARL)
 * Devise : FDJ HT — hors TVA & hors droits de douane
 */
import type { BoqLine } from "@/types/nassib";

export const BOQ_META = {
  sourceFile: "BOQ polyclinique last vers - 签合同量单.pdf",
  validatedAt: "2024-10-27",
  emitter: "DJI-FU SARL",
  currency: "FDJ" as const,
  totalHt: 644_801_997,
  note: "Hors TVA & hors droits de douane",
  lineCount: 211,
  detailLineCount: 207,
};

export const BOQ_RECAP = [
  { n: 1, corps: "Gros et second oeuvre", amount: 359_251_239 },
  { n: 2, corps: "Electricité — courant faible — sécurité incendie", amount: 82_511_410 },
  { n: 3, corps: "Fluides — climatisations", amount: 115_553_060 },
  { n: 4, corps: "Divers", amount: 87_486_288 },
] as const;

type RawLine = { id: string; lotCode: string; code: string; description: string; unit: string; qty: number; pu: number };

const RAW_LINES: RawLine[] = [
  {
    "id": "b-recap-1",
    "lotCode": "LOT-GO",
    "code": "RECAP-01",
    "description": "Gros et second oeuvre",
    "unit": "forfait",
    "qty": 1,
    "pu": 359251239
  },
  {
    "id": "b-recap-2",
    "lotCode": "LOT-CFO",
    "code": "RECAP-02",
    "description": "Electricité — courant faible — sécurité incendie",
    "unit": "forfait",
    "qty": 1,
    "pu": 82511410
  },
  {
    "id": "b-recap-3",
    "lotCode": "LOT-FLUIDES",
    "code": "RECAP-03",
    "description": "Fluides — climatisations",
    "unit": "forfait",
    "qty": 1,
    "pu": 115553060
  },
  {
    "id": "b-recap-4",
    "lotCode": "LOT-DIVERS",
    "code": "RECAP-04",
    "description": "Divers",
    "unit": "forfait",
    "qty": 1,
    "pu": 87486288
  },
  {
    "id": "b-go-001",
    "lotCode": "LOT-GO",
    "code": "I",
    "description": "Installation de chantier",
    "unit": "ens",
    "qty": 1,
    "pu": 6560400
  },
  {
    "id": "b-go-002",
    "lotCode": "LOT-GO",
    "code": "1.1",
    "description": "Terrassement générale du terrain",
    "unit": "m³",
    "qty": 1500,
    "pu": 3050
  },
  {
    "id": "b-go-003",
    "lotCode": "LOT-GO",
    "code": "1.2",
    "description": "Fouilles en rigoles",
    "unit": "m³",
    "qty": 353,
    "pu": 3050
  },
  {
    "id": "b-go-004",
    "lotCode": "LOT-GO",
    "code": "1.3",
    "description": "Film polyane",
    "unit": "m²",
    "qty": 589,
    "pu": 350
  },
  {
    "id": "b-go-005",
    "lotCode": "LOT-GO",
    "code": "2.1",
    "description": "Béton propriété dosé 250 kg/m³",
    "unit": "m³",
    "qty": 29.43,
    "pu": 57290
  },
  {
    "id": "b-go-006",
    "lotCode": "LOT-GO",
    "code": "2.2",
    "description": "Béton armé radier nervuré C30",
    "unit": "m³",
    "qty": 3,
    "pu": 104698
  },
  {
    "id": "b-go-007",
    "lotCode": "LOT-GO",
    "code": "2.3",
    "description": "Béton armé semelle isolée C30",
    "unit": "m³",
    "qty": 260,
    "pu": 95180
  },
  {
    "id": "b-go-008",
    "lotCode": "LOT-GO",
    "code": "2.4",
    "description": "Béton armé longrines C30",
    "unit": "m³",
    "qty": 60,
    "pu": 95180
  },
  {
    "id": "b-go-009",
    "lotCode": "LOT-GO",
    "code": "2.5",
    "description": "Béton armé dallage C30",
    "unit": "m³",
    "qty": 201,
    "pu": 95180
  },
  {
    "id": "b-go-010",
    "lotCode": "LOT-GO",
    "code": "2.6",
    "description": "Produit hydrofuge sur nervure",
    "unit": "m²",
    "qty": 406,
    "pu": 1480
  },
  {
    "id": "b-go-011",
    "lotCode": "LOT-GO",
    "code": "3.1",
    "description": "Poteaux BA élévation",
    "unit": "m³",
    "qty": 128,
    "pu": 105200
  },
  {
    "id": "b-go-012",
    "lotCode": "LOT-GO",
    "code": "3.2",
    "description": "Poutres BA élévation",
    "unit": "m³",
    "qty": 124,
    "pu": 105200
  },
  {
    "id": "b-go-013",
    "lotCode": "LOT-GO",
    "code": "3.3",
    "description": "Chaînage horizontal et vertical",
    "unit": "m³",
    "qty": 54,
    "pu": 105200
  },
  {
    "id": "b-go-014",
    "lotCode": "LOT-GO",
    "code": "3.4",
    "description": "Dalles BA élévation",
    "unit": "m³",
    "qty": 504,
    "pu": 105200
  },
  {
    "id": "b-go-015",
    "lotCode": "LOT-GO",
    "code": "3.5",
    "description": "Escalier BA",
    "unit": "m³",
    "qty": 7.2,
    "pu": 105200
  },
  {
    "id": "b-go-016",
    "lotCode": "LOT-GO",
    "code": "3.6",
    "description": "Voiles BA",
    "unit": "m³",
    "qty": 20,
    "pu": 103359
  },
  {
    "id": "b-go-017",
    "lotCode": "LOT-GO",
    "code": "4.1",
    "description": "Cloison agglo creux 10 cm",
    "unit": "m²",
    "qty": 2523,
    "pu": 4720
  },
  {
    "id": "b-go-018",
    "lotCode": "LOT-GO",
    "code": "4.3",
    "description": "Cloison agglo creux 25 cm",
    "unit": "m²",
    "qty": 1450,
    "pu": 6470
  },
  {
    "id": "b-go-019",
    "lotCode": "LOT-GO",
    "code": "5.1",
    "description": "Enduit intérieur",
    "unit": "m²",
    "qty": 7900,
    "pu": 2000
  },
  {
    "id": "b-go-020",
    "lotCode": "LOT-GO",
    "code": "5.2",
    "description": "Enduit extérieur",
    "unit": "m²",
    "qty": 1450,
    "pu": 2000
  },
  {
    "id": "b-go-021",
    "lotCode": "LOT-GO",
    "code": "5.3",
    "description": "Joint polystyrène 6 cm",
    "unit": "m²",
    "qty": 114,
    "pu": 7030
  },
  {
    "id": "b-go-022",
    "lotCode": "LOT-GO",
    "code": "6.1",
    "description": "Gré 60×60 émaillé + plinthe",
    "unit": "m²",
    "qty": 2240,
    "pu": 7580
  },
  {
    "id": "b-go-023",
    "lotCode": "LOT-GO",
    "code": "6.2",
    "description": "Gré 40×40 anti-dérapant",
    "unit": "m²",
    "qty": 160,
    "pu": 7580
  },
  {
    "id": "b-go-024",
    "lotCode": "LOT-GO",
    "code": "6.3",
    "description": "Revêtement escaliers granito",
    "unit": "m²",
    "qty": 30,
    "pu": 18850
  },
  {
    "id": "b-go-025",
    "lotCode": "LOT-GO",
    "code": "6.4",
    "description": "Faïence couleur",
    "unit": "m²",
    "qty": 1400,
    "pu": 7580
  },
  {
    "id": "b-go-026",
    "lotCode": "LOT-GO",
    "code": "6.5",
    "description": "Seuils marbre blanc 3 cm",
    "unit": "m²",
    "qty": 41,
    "pu": 18850
  },
  {
    "id": "b-go-027",
    "lotCode": "LOT-GO",
    "code": "6.7",
    "description": "Paillasse marbre blanc 3 cm",
    "unit": "m²",
    "qty": 6,
    "pu": 18850
  },
  {
    "id": "b-go-028",
    "lotCode": "LOT-GO",
    "code": "7.1",
    "description": "Forme de pente béton cellulaire",
    "unit": "m²",
    "qty": 1231,
    "pu": 2590
  },
  {
    "id": "b-go-029",
    "lotCode": "LOT-GO",
    "code": "7.2",
    "description": "Couvre-joint extérieur métallique",
    "unit": "ml",
    "qty": 66,
    "pu": 8880
  },
  {
    "id": "b-go-030",
    "lotCode": "LOT-GO",
    "code": "7.3",
    "description": "Joint plomb sous carrelage",
    "unit": "ml",
    "qty": 40,
    "pu": 4350
  },
  {
    "id": "b-go-031",
    "lotCode": "LOT-GO",
    "code": "7.4",
    "description": "Isolant polystyrène",
    "unit": "m²",
    "qty": 1231,
    "pu": 6470
  },
  {
    "id": "b-go-032",
    "lotCode": "LOT-GO",
    "code": "7.5",
    "description": "Piquet cuivre DN40",
    "unit": "u",
    "qty": 10,
    "pu": 9240
  },
  {
    "id": "b-go-033",
    "lotCode": "LOT-GO",
    "code": "7.6",
    "description": "Complexe étanchéité élastomère",
    "unit": "m²",
    "qty": 1231,
    "pu": 4720
  },
  {
    "id": "b-go-034",
    "lotCode": "LOT-GO",
    "code": "7.7",
    "description": "Carrelage terrasse",
    "unit": "m²",
    "qty": 1231,
    "pu": 10170
  },
  {
    "id": "b-go-035",
    "lotCode": "LOT-GO",
    "code": "8.1",
    "description": "Portes bois laminé 90×220",
    "unit": "u",
    "qty": 40,
    "pu": 44290
  },
  {
    "id": "b-go-036",
    "lotCode": "LOT-GO",
    "code": "8.3",
    "description": "Portes bois laminé 130×220",
    "unit": "u",
    "qty": 19,
    "pu": 63970
  },
  {
    "id": "b-go-037",
    "lotCode": "LOT-GO",
    "code": "8.4",
    "description": "Portes bois laminé 150×220",
    "unit": "u",
    "qty": 15,
    "pu": 73810
  },
  {
    "id": "b-go-038",
    "lotCode": "LOT-GO",
    "code": "8.7",
    "description": "Portes acier-verre 180×220",
    "unit": "u",
    "qty": 4,
    "pu": 253300
  },
  {
    "id": "b-go-039",
    "lotCode": "LOT-GO",
    "code": "8.8",
    "description": "Porte aluminium 90×220",
    "unit": "u",
    "qty": 3,
    "pu": 102460
  },
  {
    "id": "b-go-040",
    "lotCode": "LOT-GO",
    "code": "8.9",
    "description": "Porte aluminium 80×220",
    "unit": "u",
    "qty": 54,
    "pu": 91070
  },
  {
    "id": "b-go-041",
    "lotCode": "LOT-GO",
    "code": "8.11",
    "description": "Châssis coulissants double vitrage",
    "unit": "m²",
    "qty": 140,
    "pu": 51750
  },
  {
    "id": "b-go-042",
    "lotCode": "LOT-GO",
    "code": "9.1",
    "description": "Peintures extérieures",
    "unit": "m²",
    "qty": 1450,
    "pu": 1850
  },
  {
    "id": "b-go-043",
    "lotCode": "LOT-GO",
    "code": "9.2",
    "description": "Peintures intérieures",
    "unit": "m²",
    "qty": 6593,
    "pu": 1300
  },
  {
    "id": "b-go-044",
    "lotCode": "LOT-GO",
    "code": "11.1",
    "description": "Main courante métallique",
    "unit": "ml",
    "qty": 12,
    "pu": 27720
  },
  {
    "id": "b-go-045",
    "lotCode": "LOT-GO",
    "code": "11.2",
    "description": "Main courante béton",
    "unit": "ml",
    "qty": 80,
    "pu": 27720
  },
  {
    "id": "b-go-046",
    "lotCode": "LOT-GO",
    "code": "11.3",
    "description": "Comptoir béton",
    "unit": "ml",
    "qty": 6,
    "pu": 22180
  },
  {
    "id": "b-go-047",
    "lotCode": "LOT-GO",
    "code": "11.4",
    "description": "Faux plafond",
    "unit": "m²",
    "qty": 700,
    "pu": 8040
  },
  {
    "id": "b-go-048",
    "lotCode": "LOT-GO",
    "code": "11.5",
    "description": "Voirie bitumineuse EP=6 cm",
    "unit": "m²",
    "qty": 1500,
    "pu": 10010
  },
  {
    "id": "b-go-049",
    "lotCode": "LOT-GO",
    "code": "11.6",
    "description": "Pavage",
    "unit": "m²",
    "qty": 1150,
    "pu": 8510
  },
  {
    "id": "b-go-050",
    "lotCode": "LOT-GO",
    "code": "11.7",
    "description": "Incinérateur",
    "unit": "ens",
    "qty": 1,
    "pu": 2772000
  },
  {
    "id": "b-go-051",
    "lotCode": "LOT-GO",
    "code": "11.8",
    "description": "Loge gardien",
    "unit": "ens",
    "qty": 1,
    "pu": 2662000
  },
  {
    "id": "b-go-052",
    "lotCode": "LOT-GO",
    "code": "11.10",
    "description": "Bâche à eau 20 m³",
    "unit": "ens",
    "qty": 1,
    "pu": 1571000
  },
  {
    "id": "b-go-053",
    "lotCode": "LOT-GO",
    "code": "11.11",
    "description": "Fosse septique + puissard",
    "unit": "ens",
    "qty": 2,
    "pu": 1645000
  },
  {
    "id": "b-go-054",
    "lotCode": "LOT-GO",
    "code": "11.12",
    "description": "Local fluide médicale",
    "unit": "ens",
    "qty": 1,
    "pu": 2928000
  },
  {
    "id": "b-go-055",
    "lotCode": "LOT-GO",
    "code": "11.13",
    "description": "Ascenseur 4 m²",
    "unit": "ens",
    "qty": 1,
    "pu": 12166000
  },
  {
    "id": "b-go-056",
    "lotCode": "LOT-GO",
    "code": "11.14",
    "description": "Ascenseur 7 m²",
    "unit": "ens",
    "qty": 1,
    "pu": 17892000
  },
  {
    "id": "b-el-001",
    "lotCode": "LOT-CFO",
    "code": "1",
    "description": "Groupe électrogène 200 kVA",
    "unit": "ens",
    "qty": 1,
    "pu": 5267000
  },
  {
    "id": "b-el-002",
    "lotCode": "LOT-CFO",
    "code": "2.1",
    "description": "Armoire générale Polyclinique",
    "unit": "ens",
    "qty": 1,
    "pu": 6653000
  },
  {
    "id": "b-el-003",
    "lotCode": "LOT-CFO",
    "code": "2.2",
    "description": "Armoire Maternité RDC",
    "unit": "ens",
    "qty": 1,
    "pu": 1756000
  },
  {
    "id": "b-el-004",
    "lotCode": "LOT-CFO",
    "code": "2.3",
    "description": "Armoire Urgence",
    "unit": "ens",
    "qty": 1,
    "pu": 1460000
  },
  {
    "id": "b-el-005",
    "lotCode": "LOT-CFO",
    "code": "2.4",
    "description": "Armoire Général Étage",
    "unit": "ens",
    "qty": 1,
    "pu": 1756000
  },
  {
    "id": "b-el-006",
    "lotCode": "LOT-CFO",
    "code": "2.5",
    "description": "Armoire Maternité Étage",
    "unit": "ens",
    "qty": 1,
    "pu": 1756000
  },
  {
    "id": "b-el-007",
    "lotCode": "LOT-CFO",
    "code": "2.6",
    "description": "Armoire Bureaux Étage",
    "unit": "ens",
    "qty": 1,
    "pu": 1756000
  },
  {
    "id": "b-el-008",
    "lotCode": "LOT-CFO",
    "code": "2.7",
    "description": "Armoire Ondulée RDC",
    "unit": "ens",
    "qty": 1,
    "pu": 1460000
  },
  {
    "id": "b-el-009",
    "lotCode": "LOT-CFO",
    "code": "2.8",
    "description": "Armoire Ondulée Étage",
    "unit": "ens",
    "qty": 1,
    "pu": 1460000
  },
  {
    "id": "b-el-010",
    "lotCode": "LOT-CFO",
    "code": "3.1.1",
    "description": "Câble 4×120 mm²",
    "unit": "ml",
    "qty": 40,
    "pu": 16640
  },
  {
    "id": "b-el-011",
    "lotCode": "LOT-CFO",
    "code": "3.1.2",
    "description": "Câble 4×70 mm²",
    "unit": "ml",
    "qty": 15,
    "pu": 11460
  },
  {
    "id": "b-el-012",
    "lotCode": "LOT-CFO",
    "code": "3.1.3",
    "description": "Câble 5×25 mm²",
    "unit": "ml",
    "qty": 50,
    "pu": 4530
  },
  {
    "id": "b-el-013",
    "lotCode": "LOT-CFO",
    "code": "3.1.4",
    "description": "Câble 5×16 mm²",
    "unit": "ml",
    "qty": 100,
    "pu": 2870
  },
  {
    "id": "b-el-014",
    "lotCode": "LOT-CFO",
    "code": "3.1.5",
    "description": "Câble 5×10 mm²",
    "unit": "ml",
    "qty": 25,
    "pu": 1820
  },
  {
    "id": "b-el-015",
    "lotCode": "LOT-CFO",
    "code": "3.1.6",
    "description": "Câble 5×6 mm²",
    "unit": "ml",
    "qty": 100,
    "pu": 1210
  },
  {
    "id": "b-el-016",
    "lotCode": "LOT-CFO",
    "code": "3.2.1",
    "description": "Chemin câbles 150/50",
    "unit": "ml",
    "qty": 200,
    "pu": 10170
  },
  {
    "id": "b-el-017",
    "lotCode": "LOT-CFO",
    "code": "3.2.2",
    "description": "Chemin câbles 100/50",
    "unit": "ml",
    "qty": 200,
    "pu": 8880
  },
  {
    "id": "b-el-018",
    "lotCode": "LOT-CFO",
    "code": "3.3.1",
    "description": "Buse PVC Ø160",
    "unit": "ml",
    "qty": 100,
    "pu": 6470
  },
  {
    "id": "b-el-019",
    "lotCode": "LOT-CFO",
    "code": "3.3.2",
    "description": "Tube gorge Ø63",
    "unit": "ml",
    "qty": 20,
    "pu": 2780
  },
  {
    "id": "b-el-020",
    "lotCode": "LOT-CFO",
    "code": "3.4.1",
    "description": "Regard tirage 0.8×0.8×0.8 m",
    "unit": "u",
    "qty": 2,
    "pu": 125670
  },
  {
    "id": "b-el-021",
    "lotCode": "LOT-CFO",
    "code": "3.5",
    "description": "Tranchée 60 cm × 80 cm",
    "unit": "ml",
    "qty": 50,
    "pu": 5730
  },
  {
    "id": "b-el-022",
    "lotCode": "LOT-CFO",
    "code": "4.1.1",
    "description": "Point lumineux SA",
    "unit": "ens",
    "qty": 52,
    "pu": 13590
  },
  {
    "id": "b-el-023",
    "lotCode": "LOT-CFO",
    "code": "4.1.2",
    "description": "Point lumineux SA étanche",
    "unit": "ens",
    "qty": 70,
    "pu": 14510
  },
  {
    "id": "b-el-024",
    "lotCode": "LOT-CFO",
    "code": "4.1.3",
    "description": "Groupe 2 points lumineux DA",
    "unit": "ens",
    "qty": 59,
    "pu": 14880
  },
  {
    "id": "b-el-025",
    "lotCode": "LOT-CFO",
    "code": "4.1.4",
    "description": "Point lumineux V/V",
    "unit": "ens",
    "qty": 18,
    "pu": 14880
  },
  {
    "id": "b-el-026",
    "lotCode": "LOT-CFO",
    "code": "4.1.5",
    "description": "Point lumineux BP",
    "unit": "ens",
    "qty": 55,
    "pu": 15990
  },
  {
    "id": "b-el-027",
    "lotCode": "LOT-CFO",
    "code": "4.1.6",
    "description": "Point lumineux supplémentaire",
    "unit": "ens",
    "qty": 10,
    "pu": 15990
  },
  {
    "id": "b-el-028",
    "lotCode": "LOT-CFO",
    "code": "4.2.1",
    "description": "Prise 2P+T 16A encastrée",
    "unit": "ens",
    "qty": 194,
    "pu": 16360
  },
  {
    "id": "b-el-029",
    "lotCode": "LOT-CFO",
    "code": "4.2.2",
    "description": "Prise étanche 2P+T 16A",
    "unit": "ens",
    "qty": 7,
    "pu": 16910
  },
  {
    "id": "b-el-030",
    "lotCode": "LOT-CFO",
    "code": "4.2.3",
    "description": "Prise 2P+T 25A encastrée",
    "unit": "ens",
    "qty": 68,
    "pu": 25050
  },
  {
    "id": "b-el-031",
    "lotCode": "LOT-CFO",
    "code": "4.2.4",
    "description": "Boîte au sol PC + RJ45",
    "unit": "ens",
    "qty": 17,
    "pu": 44450
  },
  {
    "id": "b-el-032",
    "lotCode": "LOT-CFO",
    "code": "4.2.5",
    "description": "Socle deux prises ondulées",
    "unit": "ens",
    "qty": 44,
    "pu": 28740
  },
  {
    "id": "b-el-033",
    "lotCode": "LOT-CFO",
    "code": "4.2.6",
    "description": "Prise TV encastrée",
    "unit": "ens",
    "qty": 7,
    "pu": 39830
  },
  {
    "id": "b-el-034",
    "lotCode": "LOT-CFO",
    "code": "4.3.1",
    "description": "Alimentation armoire brassage",
    "unit": "ens",
    "qty": 2,
    "pu": 72080
  },
  {
    "id": "b-el-035",
    "lotCode": "LOT-CFO",
    "code": "4.3.2",
    "description": "Alimentation centrale SSI",
    "unit": "ens",
    "qty": 1,
    "pu": 72080
  },
  {
    "id": "b-el-036",
    "lotCode": "LOT-CFO",
    "code": "4.3.3",
    "description": "Alimentation NVR",
    "unit": "ens",
    "qty": 1,
    "pu": 72080
  },
  {
    "id": "b-el-037",
    "lotCode": "LOT-CFO",
    "code": "4.3.4",
    "description": "Alimentation pompe surpresseur",
    "unit": "ens",
    "qty": 1,
    "pu": 251330
  },
  {
    "id": "b-el-038",
    "lotCode": "LOT-CFO",
    "code": "5.1",
    "description": "Dalle LED 120×20 cm 28W",
    "unit": "ens",
    "qty": 71,
    "pu": 16820
  },
  {
    "id": "b-el-039",
    "lotCode": "LOT-CFO",
    "code": "5.2",
    "description": "Dalle LED 60×20 cm 22W",
    "unit": "ens",
    "qty": 172,
    "pu": 16820
  },
  {
    "id": "b-el-040",
    "lotCode": "LOT-CFO",
    "code": "5.3",
    "description": "Dalle LED 60×60 cm 40W",
    "unit": "ens",
    "qty": 45,
    "pu": 16640
  },
  {
    "id": "b-el-041",
    "lotCode": "LOT-CFO",
    "code": "5.4",
    "description": "Hublot LED 12W",
    "unit": "ens",
    "qty": 3,
    "pu": 16820
  },
  {
    "id": "b-el-042",
    "lotCode": "LOT-CFO",
    "code": "5.5",
    "description": "Hublot LED 12W étanche",
    "unit": "ens",
    "qty": 80,
    "pu": 16820
  },
  {
    "id": "b-el-043",
    "lotCode": "LOT-CFO",
    "code": "5.6",
    "description": "Luminaire LED mural 12W",
    "unit": "ens",
    "qty": 45,
    "pu": 16820
  },
  {
    "id": "b-el-044",
    "lotCode": "LOT-CFO",
    "code": "5.7",
    "description": "Luminaire LED mural étanche 12W",
    "unit": "ens",
    "qty": 9,
    "pu": 16820
  },
  {
    "id": "b-el-045",
    "lotCode": "LOT-CFO",
    "code": "5.8",
    "description": "Spot LED 6W",
    "unit": "ens",
    "qty": 7,
    "pu": 16820
  },
  {
    "id": "b-el-046",
    "lotCode": "LOT-CFO",
    "code": "5.9",
    "description": "Applique LED 12W",
    "unit": "ens",
    "qty": 6,
    "pu": 16820
  },
  {
    "id": "b-el-047",
    "lotCode": "LOT-CFO",
    "code": "5.10",
    "description": "Applique LED étanche 12W",
    "unit": "ens",
    "qty": 2,
    "pu": 16820
  },
  {
    "id": "b-el-048",
    "lotCode": "LOT-CFO",
    "code": "5.11",
    "description": "Projecteur LED 50W étanche IP66",
    "unit": "ens",
    "qty": 10,
    "pu": 16640
  },
  {
    "id": "b-el-049",
    "lotCode": "LOT-CFO",
    "code": "5.12",
    "description": "Bloc autonome sécurité 60 lumens",
    "unit": "ens",
    "qty": 50,
    "pu": 30500
  },
  {
    "id": "b-el-050",
    "lotCode": "LOT-CFO",
    "code": "5.13",
    "description": "Ventilateur plafond Ø120 cm",
    "unit": "ens",
    "qty": 114,
    "pu": 25880
  },
  {
    "id": "b-el-051",
    "lotCode": "LOT-CFO",
    "code": "6.1",
    "description": "Ceinturage terre 1×35 mm²",
    "unit": "ml",
    "qty": 240,
    "pu": 4260
  },
  {
    "id": "b-el-052",
    "lotCode": "LOT-CFO",
    "code": "6.2",
    "description": "Mise à la terre masses métalliques",
    "unit": "ens",
    "qty": 1,
    "pu": 73920
  },
  {
    "id": "b-el-053",
    "lotCode": "LOT-CFO",
    "code": "6.3",
    "description": "Prise de terre 3 piquets cuivre",
    "unit": "ens",
    "qty": 2,
    "pu": 136760
  },
  {
    "id": "b-el-054",
    "lotCode": "LOT-CFO",
    "code": "6.4",
    "description": "Câble V/J 1×35 mm²",
    "unit": "ml",
    "qty": 100,
    "pu": 4260
  },
  {
    "id": "b-el-055",
    "lotCode": "LOT-CFA",
    "code": "7.1",
    "description": "Baie de brassage cat.6",
    "unit": "ens",
    "qty": 2,
    "pu": 2679600
  },
  {
    "id": "b-el-056",
    "lotCode": "LOT-CFA",
    "code": "7.2",
    "description": "Prise RJ45 Cat.6",
    "unit": "ens",
    "qty": 65,
    "pu": 9800
  },
  {
    "id": "b-el-057",
    "lotCode": "LOT-CFA",
    "code": "7.3",
    "description": "Point d'accès WiFi POE",
    "unit": "ens",
    "qty": 7,
    "pu": 55440
  },
  {
    "id": "b-el-058",
    "lotCode": "LOT-CCTV",
    "code": "8.1",
    "description": "NVR 32 canaux",
    "unit": "ens",
    "qty": 1,
    "pu": 2735040
  },
  {
    "id": "b-el-059",
    "lotCode": "LOT-CCTV",
    "code": "8.2",
    "description": "Caméra fixe IP POE 180° intérieur",
    "unit": "ens",
    "qty": 14,
    "pu": 98870
  },
  {
    "id": "b-el-060",
    "lotCode": "LOT-CCTV",
    "code": "8.3",
    "description": "Caméra IP directionnelle 90° intérieur",
    "unit": "ens",
    "qty": 2,
    "pu": 83160
  },
  {
    "id": "b-el-061",
    "lotCode": "LOT-CCTV",
    "code": "8.4",
    "description": "Caméra IP directionnelle 90° extérieur",
    "unit": "ens",
    "qty": 7,
    "pu": 83160
  },
  {
    "id": "b-el-062",
    "lotCode": "LOT-CCTV",
    "code": "8.5",
    "description": "Câble liaison caméras-NVR",
    "unit": "ens",
    "qty": 1,
    "pu": 637560
  },
  {
    "id": "b-el-063",
    "lotCode": "LOT-SSI",
    "code": "9.1",
    "description": "Centrale détection incendie 8 zones",
    "unit": "ens",
    "qty": 1,
    "pu": 4897200
  },
  {
    "id": "b-el-064",
    "lotCode": "LOT-SSI",
    "code": "9.2",
    "description": "Détecteur optique de fumée",
    "unit": "ens",
    "qty": 66,
    "pu": 21260
  },
  {
    "id": "b-el-065",
    "lotCode": "LOT-SSI",
    "code": "9.3",
    "description": "Boîtier brise-glace",
    "unit": "ens",
    "qty": 20,
    "pu": 45280
  },
  {
    "id": "b-el-066",
    "lotCode": "LOT-SSI",
    "code": "9.4",
    "description": "Klaxon d'alerte",
    "unit": "ens",
    "qty": 9,
    "pu": 49900
  },
  {
    "id": "b-el-067",
    "lotCode": "LOT-CFO",
    "code": "10.1",
    "description": "Onduleur 20 kVA autonomie 10 min",
    "unit": "ens",
    "qty": 1,
    "pu": 7502880
  },
  {
    "id": "b-fl-001",
    "lotCode": "LOT-CVC",
    "code": "CVC-1.2.1",
    "description": "Climatiseur split 18 000 Btu/h (5.3 kW)",
    "unit": "ens",
    "qty": 5,
    "pu": 206900
  },
  {
    "id": "b-fl-002",
    "lotCode": "LOT-CVC",
    "code": "CVC-1.2.2",
    "description": "Climatiseur split 24 000 Btu/h (7.0 kW)",
    "unit": "ens",
    "qty": 95,
    "pu": 252100
  },
  {
    "id": "b-fl-003",
    "lotCode": "LOT-CVC",
    "code": "CVC-1.3.1",
    "description": "Ventilateur plafond Ø1600 mm",
    "unit": "ens",
    "qty": 105,
    "pu": 25880
  },
  {
    "id": "b-fl-004",
    "lotCode": "LOT-CVC",
    "code": "CVC-1.4.1",
    "description": "Grille ventilation naturelle 400×200",
    "unit": "ens",
    "qty": 15,
    "pu": 36960
  },
  {
    "id": "b-fl-005",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.1",
    "description": "Surpresseur eau potable 3×30 m³/h",
    "unit": "ens",
    "qty": 1,
    "pu": 4429000
  },
  {
    "id": "b-fl-006",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.2",
    "description": "Pompe d'arrosage immergée",
    "unit": "ens",
    "qty": 1,
    "pu": 2625000
  },
  {
    "id": "b-fl-007",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.3",
    "description": "Réservoir maintien pression 100 L",
    "unit": "ens",
    "qty": 1,
    "pu": 393630
  },
  {
    "id": "b-fl-008",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.4",
    "description": "Pièces à sceller bâche eau potable",
    "unit": "ens",
    "qty": 1,
    "pu": 92400
  },
  {
    "id": "b-fl-009",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.5",
    "description": "Robinet flotteur DN100",
    "unit": "u",
    "qty": 1,
    "pu": 22180
  },
  {
    "id": "b-fl-010",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.6",
    "description": "Tube indicateur niveau remplissage",
    "unit": "u",
    "qty": 1,
    "pu": 27720
  },
  {
    "id": "b-fl-011",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.7",
    "description": "Échelle inox accès bâche",
    "unit": "u",
    "qty": 1,
    "pu": 83160
  },
  {
    "id": "b-fl-012",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.8",
    "description": "Trappe visite acier galvanisé 100×100 cm",
    "unit": "u",
    "qty": 1,
    "pu": 101640
  },
  {
    "id": "b-fl-013",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.9",
    "description": "Ensemble 2 pompes relevage 8 m³/h",
    "unit": "ens",
    "qty": 1,
    "pu": 1312080
  },
  {
    "id": "b-fl-014",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.10",
    "description": "Clapet crépine DN125",
    "unit": "u",
    "qty": 1,
    "pu": 29570
  },
  {
    "id": "b-fl-015",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.11.1",
    "description": "Vanne papillon DN100",
    "unit": "u",
    "qty": 1,
    "pu": 22180
  },
  {
    "id": "b-fl-016",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.11.2",
    "description": "Vanne papillon DN125",
    "unit": "u",
    "qty": 1,
    "pu": 29570
  },
  {
    "id": "b-fl-017",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.12.1",
    "description": "Filtre à tamis DN50",
    "unit": "u",
    "qty": 1,
    "pu": 5550
  },
  {
    "id": "b-fl-018",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.12.2",
    "description": "Filtre à tamis DN100",
    "unit": "u",
    "qty": 1,
    "pu": 8320
  },
  {
    "id": "b-fl-019",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.12.3",
    "description": "Filtre à tamis DN125",
    "unit": "u",
    "qty": 1,
    "pu": 11090
  },
  {
    "id": "b-fl-020",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.13.1",
    "description": "Manchon antivibratoire DN100",
    "unit": "u",
    "qty": 1,
    "pu": 12020
  },
  {
    "id": "b-fl-021",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.13.2",
    "description": "Manchon antivibratoire DN125",
    "unit": "u",
    "qty": 1,
    "pu": 14790
  },
  {
    "id": "b-fl-022",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.14",
    "description": "Électrovanne DN100",
    "unit": "u",
    "qty": 1,
    "pu": 29570
  },
  {
    "id": "b-fl-023",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.15",
    "description": "Disconnecteur pression réduite DN50",
    "unit": "u",
    "qty": 1,
    "pu": 9240
  },
  {
    "id": "b-fl-024",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.1.16",
    "description": "Purgeur d'air ventouse réseau enterré",
    "unit": "u",
    "qty": 1,
    "pu": 9240
  },
  {
    "id": "b-fl-025",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.2.1",
    "description": "Lavabo double vasque",
    "unit": "u",
    "qty": 30,
    "pu": 64680
  },
  {
    "id": "b-fl-026",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.2.2",
    "description": "WC à l'anglaise",
    "unit": "ens",
    "qty": 54,
    "pu": 37890
  },
  {
    "id": "b-fl-027",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.2.3",
    "description": "Douche",
    "unit": "ens",
    "qty": 31,
    "pu": 94250
  },
  {
    "id": "b-fl-028",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.2.4",
    "description": "Évier inox double bac + égouttoir",
    "unit": "ens",
    "qty": 2,
    "pu": 63760
  },
  {
    "id": "b-fl-029",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.3.1",
    "description": "Miroir 80×50 épaisseur 6 mm",
    "unit": "ens",
    "qty": 31,
    "pu": 15710
  },
  {
    "id": "b-fl-030",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.3.2",
    "description": "Robinet d'ablution",
    "unit": "u",
    "qty": 54,
    "pu": 8040
  },
  {
    "id": "b-fl-031",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.1.1",
    "description": "Tuyauterie PEHD Ø32",
    "unit": "ml",
    "qty": 60,
    "pu": 1880
  },
  {
    "id": "b-fl-032",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.1.2",
    "description": "Tuyauterie PEHD Ø63",
    "unit": "ml",
    "qty": 150,
    "pu": 2650
  },
  {
    "id": "b-fl-033",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.1.3",
    "description": "Tuyauterie PEHD Ø110",
    "unit": "ml",
    "qty": 110,
    "pu": 3260
  },
  {
    "id": "b-fl-034",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.2.1",
    "description": "Tuyauterie PPR encastrée Ø20",
    "unit": "ml",
    "qty": 210,
    "pu": 2040
  },
  {
    "id": "b-fl-035",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.2.2",
    "description": "Tuyauterie PPR encastrée Ø25",
    "unit": "ml",
    "qty": 210,
    "pu": 2440
  },
  {
    "id": "b-fl-036",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.2.3",
    "description": "Tuyauterie PPR encastrée Ø32",
    "unit": "ml",
    "qty": 210,
    "pu": 2650
  },
  {
    "id": "b-fl-037",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.2.4",
    "description": "Tuyauterie PPR encastrée Ø40",
    "unit": "ml",
    "qty": 80,
    "pu": 2850
  },
  {
    "id": "b-fl-038",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.3.1",
    "description": "Robinet arrêt DN15",
    "unit": "u",
    "qty": 35,
    "pu": 9150
  },
  {
    "id": "b-fl-039",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.3.2",
    "description": "Robinet arrêt DN20",
    "unit": "u",
    "qty": 30,
    "pu": 9560
  },
  {
    "id": "b-fl-040",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.3.3",
    "description": "Robinet arrêt DN25",
    "unit": "u",
    "qty": 15,
    "pu": 9760
  },
  {
    "id": "b-fl-041",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.3.4",
    "description": "Robinet arrêt DN32",
    "unit": "u",
    "qty": 10,
    "pu": 9970
  },
  {
    "id": "b-fl-042",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.3.5",
    "description": "Robinet arrêt DN40",
    "unit": "u",
    "qty": 5,
    "pu": 10170
  },
  {
    "id": "b-fl-043",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.4",
    "description": "Anti-bélier",
    "unit": "u",
    "qty": 5,
    "pu": 10370
  },
  {
    "id": "b-fl-044",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.5",
    "description": "Purgeur d'air",
    "unit": "u",
    "qty": 5,
    "pu": 10370
  },
  {
    "id": "b-fl-045",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.6.3",
    "description": "Compteur d'eau DN80",
    "unit": "u",
    "qty": 1,
    "pu": 32530
  },
  {
    "id": "b-fl-046",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.7",
    "description": "Bouche d'arrosage",
    "unit": "u",
    "qty": 6,
    "pu": 10170
  },
  {
    "id": "b-fl-047",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.4.8",
    "description": "Regard piquage 50×50×40 cm",
    "unit": "u",
    "qty": 12,
    "pu": 65050
  },
  {
    "id": "b-fl-048",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.1.2",
    "description": "Regard visitable 60×60 cm",
    "unit": "u",
    "qty": 55,
    "pu": 77250
  },
  {
    "id": "b-fl-049",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.2",
    "description": "Siphon de sol PVC 15×15 cm",
    "unit": "u",
    "qty": 54,
    "pu": 6510
  },
  {
    "id": "b-fl-050",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.3.5",
    "description": "Moignon EP plomb Ø125 + crapaudine",
    "unit": "ens",
    "qty": 7,
    "pu": 56920
  },
  {
    "id": "b-fl-051",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.4.5",
    "description": "Tuyauterie PVC assainissement Ø75",
    "unit": "ml",
    "qty": 300,
    "pu": 4270
  },
  {
    "id": "b-fl-052",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.4.8",
    "description": "Tuyauterie PVC assainissement Ø110",
    "unit": "ml",
    "qty": 300,
    "pu": 4880
  },
  {
    "id": "b-fl-053",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.4.9",
    "description": "Tuyauterie PVC assainissement Ø125",
    "unit": "ml",
    "qty": 150,
    "pu": 5490
  },
  {
    "id": "b-fl-054",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.4.10",
    "description": "Tuyauterie PVC assainissement Ø140",
    "unit": "ml",
    "qty": 200,
    "pu": 6100
  },
  {
    "id": "b-fl-055",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.7.4.11",
    "description": "Tuyauterie PVC assainissement Ø160",
    "unit": "ml",
    "qty": 250,
    "pu": 6510
  },
  {
    "id": "b-fl-056",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.8.1",
    "description": "Extincteur poudre ABC 5 kg",
    "unit": "u",
    "qty": 14,
    "pu": 15450
  },
  {
    "id": "b-fl-057",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.8.2",
    "description": "Poteau d'incendie",
    "unit": "ens",
    "qty": 3,
    "pu": 380690
  },
  {
    "id": "b-fl-058",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.8.3",
    "description": "Robinet d'incendie armé DN40",
    "unit": "ens",
    "qty": 10,
    "pu": 380690
  },
  {
    "id": "b-fl-059",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.8.4a",
    "description": "Réseau RIA",
    "unit": "ml",
    "qty": 105,
    "pu": 11130
  },
  {
    "id": "b-fl-060",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.8.4b",
    "description": "Colonne sèche",
    "unit": "ml",
    "qty": 15,
    "pu": 11130
  },
  {
    "id": "b-fl-061",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.1",
    "description": "Centrale bouteilles inversion automatique",
    "unit": "ens",
    "qty": 1,
    "pu": 18572400
  },
  {
    "id": "b-fl-062",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.4",
    "description": "Bandeau BTDL 1(O₂)1(AM)1(V)",
    "unit": "u",
    "qty": 46,
    "pu": 38260
  },
  {
    "id": "b-fl-063",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.5",
    "description": "Prise Oxygène",
    "unit": "u",
    "qty": 46,
    "pu": 57110
  },
  {
    "id": "b-fl-064",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.6",
    "description": "Prise Vide médical",
    "unit": "u",
    "qty": 46,
    "pu": 57110
  },
  {
    "id": "b-fl-065",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.7",
    "description": "Prise Air comprimé médical",
    "unit": "u",
    "qty": 46,
    "pu": 57110
  },
  {
    "id": "b-fl-066",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.8",
    "description": "Tuyauterie cuivre écrou dégraissé",
    "unit": "ml",
    "qty": 460,
    "pu": 26620
  },
  {
    "id": "b-fl-067",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.9",
    "description": "Vanne d'isolement",
    "unit": "u",
    "qty": 140,
    "pu": 18300
  },
  {
    "id": "b-fl-068",
    "lotCode": "LOT-FLUIDES",
    "code": "FM-2.9.10",
    "description": "Caniveau réseau fluide médicale",
    "unit": "ml",
    "qty": 11,
    "pu": 44360
  },
  {
    "id": "b-fl-069",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.10.1",
    "description": "Armoire électrique local surpresseurs",
    "unit": "ens",
    "qty": 1,
    "pu": 878000
  },
  {
    "id": "b-fl-070",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.10.2",
    "description": "Raccordements électriques fluides",
    "unit": "ens",
    "qty": 1,
    "pu": 1755600
  },
  {
    "id": "b-fl-071",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.10.3",
    "description": "Mise à la terre fluides",
    "unit": "ens",
    "qty": 1,
    "pu": 984060
  },
  {
    "id": "b-fl-072",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.10.4",
    "description": "Repérage réseaux fluides",
    "unit": "ens",
    "qty": 1,
    "pu": 184800
  },
  {
    "id": "b-fl-073",
    "lotCode": "LOT-PLOMB",
    "code": "PL-2.10.5",
    "description": "Schéma de principe fluides",
    "unit": "ens",
    "qty": 1,
    "pu": 369600
  },
  {
    "id": "b-dv-001",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-1",
    "description": "Grille décorative aluminium mur extérieur",
    "unit": "ml",
    "qty": 2383,
    "pu": 14790
  },
  {
    "id": "b-dv-002",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-2",
    "description": "Auvent entrée principale",
    "unit": "m²",
    "qty": 82,
    "pu": 51750
  },
  {
    "id": "b-dv-003",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-3",
    "description": "Local de pompe à l'eau",
    "unit": "m²",
    "qty": 12.5,
    "pu": 147840
  },
  {
    "id": "b-dv-004",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-4",
    "description": "Local de TGBT",
    "unit": "m²",
    "qty": 21.2,
    "pu": 147840
  },
  {
    "id": "b-dv-005",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-6",
    "description": "Abri groupe électrogène",
    "unit": "m²",
    "qty": 60,
    "pu": 83160
  },
  {
    "id": "b-dv-006",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-7",
    "description": "Clôture",
    "unit": "ml",
    "qty": 440,
    "pu": 63300
  },
  {
    "id": "b-dv-007",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-8",
    "description": "Portail métallique",
    "unit": "u",
    "qty": 2,
    "pu": 1293795
  },
  {
    "id": "b-dv-008",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-9",
    "description": "Bordure",
    "unit": "ml",
    "qty": 550,
    "pu": 9000
  },
  {
    "id": "b-dv-009",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-10",
    "description": "Gazon",
    "unit": "m²",
    "qty": 470,
    "pu": 4070
  },
  {
    "id": "b-dv-010",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-11",
    "description": "Arbre",
    "unit": "u",
    "qty": 8,
    "pu": 9240
  },
  {
    "id": "b-dv-011",
    "lotCode": "LOT-DIVERS",
    "code": "DIV-12",
    "description": "Traçage du sol",
    "unit": "ml",
    "qty": 500,
    "pu": 1300
  }
];

function toBoqLine(r: RawLine): BoqLine {
  return {
    id: r.id,
    lotCode: r.lotCode,
    code: r.code,
    description: r.description,
    unit: r.unit,
    qtyContract: r.qty,
    unitPrice: r.pu,
    qtyExecuted: 0,
    qtyValidated: 0,
    paymentRequested: 0,
    paymentApproved: 0,
    paymentPaid: 0,
    retentionPct: 5,
  };
}

/** Lignes BOQ complètes — récap + détail intégral PDF */
export const POLYCLINIQUE_BOQ: BoqLine[] = RAW_LINES.map(toBoqLine);

/** Lignes détail uniquement (hors récap corps d'état) */
export const POLYCLINIQUE_BOQ_DETAIL = POLYCLINIQUE_BOQ.filter((l) => !l.code.startsWith("RECAP"));
