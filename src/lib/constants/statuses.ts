export const ROOM_STATUSES = [
  "shell",
  "rough_in",
  "finishes",
  "equipment",
  "testing",
  "handover",
  "occupied",
] as const;

export const RESERVE_PRIORITIES = [
  "critical",
  "major",
  "minor",
  "info",
] as const;

export const RESERVE_STATUSES = [
  "open",
  "in_progress",
  "validated",
  "closed",
  "rejected",
] as const;

export const LOT_TRADES = [
  "GO",
  "CFO",
  "CVC",
  "ELEC",
  "PLOMB",
  "FLUIDES_MEDICAUX",
  "BIOMEDICAL",
  "SSI",
  "MENUISERIE",
] as const;

export const ROOM_STATUS_LABELS: Record<(typeof ROOM_STATUSES)[number], string> = {
  shell: "Gros œuvre",
  rough_in: "Second œuvre",
  finishes: "Finitions",
  equipment: "Équipements",
  testing: "Essais",
  handover: "Réception",
  occupied: "Occupé",
};

export const RESERVE_PRIORITY_LABELS: Record<
  (typeof RESERVE_PRIORITIES)[number],
  string
> = {
  critical: "Critique",
  major: "Majeur",
  minor: "Mineur",
  info: "Informatif",
};

export const RESERVE_STATUS_LABELS: Record<
  (typeof RESERVE_STATUSES)[number],
  string
> = {
  open: "Ouverte",
  in_progress: "En cours",
  validated: "Validée",
  closed: "Clôturée",
  rejected: "Rejetée",
};
