/** Référence visuelle K'BIO — plans équipements 180526 (12 planches source). */

export type ImplementationPlanImage = {
  src: string;
  alt: string;
  title: string;
};

const ROOM_PLAN_FILES: Record<string, { file: string; title: string }> = {
  "ADM-01": { file: "KBIO-DJI-PLAN-ADM-01.png", title: "Bureau adm 1" },
  "ADM-R1": { file: "KBIO-DJI-PLAN-ADM-R1.png", title: "Bureau admin 2" },
  "ATT-01": { file: "KBIO-DJI-PLAN-ATT-01.png", title: "Salle d'attente / Bureau Direct" },
  "ATT-R1": { file: "KBIO-DJI-PLAN-ATT-R1.png", title: "Salle d'attente / Bureau Direct" },
  "BCS-01": { file: "KBIO-DJI-PLAN-BCS-01.png", title: "Bureau CS 1" },
  "BCS-02": { file: "KBIO-DJI-PLAN-BCS-02.png", title: "Bureau CS 2" },
  "BCS-03": { file: "KBIO-DJI-PLAN-BCS-03.png", title: "Bureau CS 3" },
  "BCS-04": { file: "KBIO-DJI-PLAN-BCS-04.png", title: "Bureau CS 4" },
  "BGYN-01": { file: "KBIO-DJI-PLAN-BGYN-01.png", title: "Bureau GYN 1" },
  "BGYN-02": { file: "KBIO-DJI-PLAN-BGYN-02.png", title: "Bureau GYN 2" },
  "BIB-01": { file: "KBIO-DJI-PLAN-BIB-01.png", title: "Biberonnerie & soin bébé" },
  "BLC-01": { file: "KBIO-DJI-PLAN-BLC-01.png", title: "Bloc césarienne" },
  "BMAT-01": { file: "KBIO-DJI-PLAN-BMAT-01.png", title: "Bureau Mat 1" },
  "BMAT-02": { file: "KBIO-DJI-PLAN-BMAT-02.png", title: "Bureau Mat 2" },
  "BOX-01": { file: "KBIO-DJI-PLAN-BOX-01.png", title: "Box 1" },
  "BOX-02": { file: "KBIO-DJI-PLAN-BOX-02.png", title: "Box 2" },
  "BOX-03": { file: "KBIO-DJI-PLAN-BOX-03.png", title: "Box 3" },
  "BOX-04": { file: "KBIO-DJI-PLAN-BOX-04.png", title: "Box 4" },
  "BUR-R1-1": { file: "KBIO-DJI-PLAN-BUR-R1-1.png", title: "Bureau adm 1" },
  "BUR-R1-2": { file: "KBIO-DJI-PLAN-BUR-R1-2.png", title: "Bureau adm 1" },
  "BUR-R1-3": { file: "KBIO-DJI-PLAN-BUR-R1-3.png", title: "Bureau adm 1" },
  "BUR-R1-4": { file: "KBIO-DJI-PLAN-BUR-R1-4.png", title: "Bureau adm 1" },
  "BUR-R1-5": { file: "KBIO-DJI-PLAN-BUR-R1-5.png", title: "Bureau adm 1" },
  "BUR-URG1": { file: "KBIO-DJI-PLAN-BUR-URG1.png", title: "Bureau URG 1" },
  "BUR-URG2": { file: "KBIO-DJI-PLAN-BUR-URG2.png", title: "Bureau URG 2" },
  "DECH-01": { file: "KBIO-DJI-PLAN-DECH-01.png", title: "Déchocage" },
  "DEN-01": { file: "KBIO-DJI-PLAN-DEN-01.png", title: "Dentaire" },
  "HDJ-01": { file: "KBIO-DJI-PLAN-HDJ-01.png", title: "Hospitalisation de jour" },
  "HOS-01": { file: "KBIO-DJI-PLAN-HOS-01.png", title: "Chambre Med type A" },
  "HOS-02": { file: "KBIO-DJI-PLAN-HOS-02.png", title: "Chambre Med type B" },
  "HOS-03": { file: "KBIO-DJI-PLAN-HOS-03.png", title: "Chambre Med type B" },
  "HOS-04": { file: "KBIO-DJI-PLAN-HOS-04.png", title: "Chambre Med type A" },
  "HOS-05": { file: "KBIO-DJI-PLAN-HOS-05.png", title: "Chambre Med type B" },
  "HOS-06": { file: "KBIO-DJI-PLAN-HOS-06.png", title: "Chambre Med type A" },
  "HOS-07": { file: "KBIO-DJI-PLAN-HOS-07.png", title: "Chambre Med 7" },
  "IMG-01": { file: "KBIO-DJI-PLAN-IMG-01.png", title: "Salle de radiologie" },
  "INF-MAT": { file: "KBIO-DJI-PLAN-INF-MAT.png", title: "Infirmerie maternité" },
  "INF-R1": { file: "KBIO-DJI-PLAN-INF-R1.png", title: "Infirmerie maternité" },
  "INF-URG": { file: "KBIO-DJI-PLAN-INF-URG.png", title: "Infirmerie urgences" },
  "MAG-01": { file: "KBIO-DJI-PLAN-MAG-01.png", title: "Magasin" },
  "MAT-01": { file: "KBIO-DJI-PLAN-MAT-01.png", title: "Chambre maternité type 1-8" },
  "MAT-02": { file: "KBIO-DJI-PLAN-MAT-02.png", title: "Chambre maternité type 1-8" },
  "MAT-03": { file: "KBIO-DJI-PLAN-MAT-03.png", title: "Chambre maternité type 1-8" },
  "MAT-04": { file: "KBIO-DJI-PLAN-MAT-04.png", title: "Chambre maternité type 1-8" },
  "MAT-05": { file: "KBIO-DJI-PLAN-MAT-05.png", title: "Chambre maternité type 1-8" },
  "MAT-06": { file: "KBIO-DJI-PLAN-MAT-06.png", title: "Chambre maternité type 1-8" },
  "MAT-07": { file: "KBIO-DJI-PLAN-MAT-07.png", title: "Chambre maternité type 1-8" },
  "MAT-08": { file: "KBIO-DJI-PLAN-MAT-08.png", title: "Chambre maternité type 1-8" },
  "MAT-09": { file: "KBIO-DJI-PLAN-MAT-09.png", title: "Chambre maternité 9" },
  "MAT-10": { file: "KBIO-DJI-PLAN-MAT-10.png", title: "Chambre maternité 10" },
  "MAT-11": { file: "KBIO-DJI-PLAN-MAT-11.png", title: "Chambre maternité 11" },
  "MAT-12": { file: "KBIO-DJI-PLAN-MAT-12.png", title: "Chambre maternité 12" },
  "MAT-13": { file: "KBIO-DJI-PLAN-MAT-13.png", title: "Chambre maternité 13" },
  "MAT-14": { file: "KBIO-DJI-PLAN-MAT-14.png", title: "Chambre maternité 14" },
  "MLAB-01": { file: "KBIO-DJI-PLAN-MLAB-01.png", title: "Mini-Labo" },
  "PCH-01": { file: "KBIO-DJI-PLAN-PCH-01.png", title: "Petit Chir" },
  "PHA-01": { file: "KBIO-DJI-PLAN-PHA-01.png", title: "Pharmacie" },
  "PRE-01": { file: "KBIO-DJI-PLAN-PRE-01.png", title: "Pré-travail" },
  "PRE-02": { file: "KBIO-DJI-PLAN-PRE-02.png", title: "Pré-travail" },
  "PRE-03": { file: "KBIO-DJI-PLAN-PRE-03.png", title: "Pré-travail" },
  "REV-01": { file: "KBIO-DJI-PLAN-REV-01.png", title: "Salle réveil" },
  "SAS-IMG": { file: "KBIO-DJI-PLAN-SAS-IMG.png", title: "Sas Patient" },
  "SAS-URG": { file: "KBIO-DJI-PLAN-SAS-URG.png", title: "Sas Accueil urgences" },
  "STK-URG": { file: "KBIO-DJI-PLAN-STK-URG.png", title: "Stock urgences" },
  "TRV-01": { file: "KBIO-DJI-PLAN-TRV-01.png", title: "Salle travail" },
  "TRV-02": { file: "KBIO-DJI-PLAN-TRV-02.png", title: "Salle travail" },
  "TRV-03": { file: "KBIO-DJI-PLAN-TRV-03.png", title: "Salle travail" },
  "VES-F": { file: "KBIO-DJI-PLAN-VES-F.png", title: "Vestiaire F" },
  "VES-H": { file: "KBIO-DJI-PLAN-VES-H.png", title: "Vestiaire H" },
};

export function resolveImplementationPlanImage(
  roomCode: string,
): ImplementationPlanImage | null {
  const entry = ROOM_PLAN_FILES[roomCode];
  if (!entry) return null;

  return {
    src: `/plans/implantation/${entry.file}`,
    alt: `Plan d'implantation ${entry.title} — Polyclinique Nassib`,
    title: entry.title,
  };
}

export function countImplementationPlans(): number {
  return Object.keys(ROOM_PLAN_FILES).length;
}

export const IMPLEMENTATION_PLAN_SOURCE_SHEETS = [
  "URGENCES-BOXES",
  "URGENCES-SUPPORT",
  "SAS-URG",
  "IMAGERIE",
  "CONSULTATIONS-SUPPORT",
  "CONSULTATIONS-CS-GYN",
  "MATERNITE-TRAVAIL",
  "BUREAU-MAT",
  "BLOC-REVEIL",
  "MATERNITE-CHAMBRES-A",
  "MATERNITE-ADMIN-R1",
  "HOSPITALISATION-R1",
] as const;
