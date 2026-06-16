import { z } from "zod";

export const createReserveSchema = z.object({
  title: z.string().min(3, "Titre requis (min. 3 caractères)"),
  description: z.string().min(5, "Description requise"),
  roomCode: z.string().optional(),
  zone: z.string().min(2, "Zone requise"),
  lotCode: z.string().min(2, "Lot requis"),
  company: z.string().min(2, "Entreprise requise"),
  severity: z.enum(["minor", "major", "critical"]),
  type: z.string().min(2, "Type requis"),
  correctiveAction: z.string().min(3, "Action corrective requise"),
  assignedTo: z.string().min(2, "Responsable requis"),
  dueDate: z.string().min(1, "Échéance requise"),
  blocksReception: z.boolean().optional(),
});

export type CreateReserveInput = z.infer<typeof createReserveSchema>;

export const updateReserveStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum([
    "open",
    "in_progress",
    "corrected",
    "to_verify",
    "rejected",
    "levée",
    "closed",
  ]),
});

export type UpdateReserveStatusInput = z.infer<typeof updateReserveStatusSchema>;
