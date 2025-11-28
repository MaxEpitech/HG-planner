import { z } from "zod";

export const athleteProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire").optional(),
  lastName: z.string().min(1, "Le nom est obligatoire").optional(),
  club: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
  tshirtSize: z.string().optional(),
  gender: z.union([z.enum(["M", "F"]), z.literal("")]).optional(),
});

export const personalRecordSchema = z.object({
  eventName: z.string().min(1, "Le nom de l'épreuve est obligatoire"),
  performance: z.string().min(1, "La performance est obligatoire"),
  date: z.string().optional(),
  notes: z.string().optional(),
});

