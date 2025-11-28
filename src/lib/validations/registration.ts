import { z } from "zod";

export const createAthleteSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  club: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  country: z.string().optional(),
});

export const createRegistrationSchema = z.object({
  athleteId: z.string().min(1, "L'ID de l'athlète est requis"),
  groupId: z.string().min(1, "Le groupe est requis"),
});

export const createAthleteAndRegistrationSchema = createAthleteSchema.extend({
  groupId: z.string().min(1, "Le groupe est requis"),
  competitionId: z.string().min(1, "La compétition est requise"),
});

