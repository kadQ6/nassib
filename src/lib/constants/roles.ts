export const APP_ROLES = [
  "admin",
  "maitre_ouvrage",
  "project_manager",
  "opc",
  "architecte",
  "biomedical",
  "mep_engineer",
  "general_contractor",
  "subcontractor",
  "controller",
  "finance",
  "viewer",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrateur",
  maitre_ouvrage: "Maître d'ouvrage",
  project_manager: "Chef de projet",
  opc: "OPC",
  architecte: "Architecte",
  biomedical: "Ingénieur biomédical",
  mep_engineer: "Ingénieur MEP",
  general_contractor: "Entreprise générale",
  subcontractor: "Sous-traitant",
  controller: "Contrôle technique",
  finance: "Finance",
  viewer: "Lecture seule",
};

export const PERMISSIONS = {
  editPlanning: ["admin", "project_manager", "opc", "mep_engineer"] as AppRole[],
  manageLots: ["admin", "project_manager", "opc", "mep_engineer"] as AppRole[],
  editRooms: ["admin", "project_manager", "opc", "architecte", "mep_engineer", "general_contractor"] as AppRole[],
  createReserves: ["admin", "project_manager", "opc", "architecte", "biomedical", "mep_engineer", "controller", "general_contractor"] as AppRole[],
  closeReserves: ["admin", "project_manager", "opc", "maitre_ouvrage", "controller"] as AppRole[],
  manageEquipment: ["admin", "project_manager", "biomedical"] as AppRole[],
  manageMedicalGas: ["admin", "biomedical", "mep_engineer"] as AppRole[],
  editBoq: ["admin", "project_manager", "finance", "controller"] as AppRole[],
  approvePayments: ["admin", "maitre_ouvrage", "finance", "controller"] as AppRole[],
  manageTeam: ["admin", "project_manager"] as AppRole[],
  validateDocuments: ["admin", "architecte", "controller", "mep_engineer", "biomedical"] as AppRole[],
} as const;

export function hasPermission(role: AppRole, permission: keyof typeof PERMISSIONS) {
  return PERMISSIONS[permission].includes(role);
}
