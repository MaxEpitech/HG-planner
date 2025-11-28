import { z } from "zod";

export const createCompetitionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  location: z.string().min(1, "Le lieu est requis"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
});

export const updateCompetitionSchema = createCompetitionSchema.partial().extend({
  id: z.string().min(1),
  status: z.enum(["draft", "open", "published", "closed"]).optional(),
});

export const createGroupSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  maxAthletes: z.number().int().positive("Le nombre maximum d'athlètes doit être positif"),
  competitionId: z.string().min(1, "L'ID de la compétition est requis"),
  format: z.enum(["5", "8"], { message: "Le format doit être 5 ou 8 épreuves" }),
});

export const updateGroupSchema = createGroupSchema.partial().extend({
  id: z.string().min(1),
});

export const createEventSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  order: z.number().int().positive("L'ordre doit être positif"),
  groupId: z.string().min(1, "L'ID du groupe est requis"),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().min(1),
});

