import { z } from "zod";

export const athleteAccountSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est obligatoire"),
    lastName: z.string().min(1, "Le nom est obligatoire"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "La confirmation est obligatoire"),
    club: z.string().optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    birthDate: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

