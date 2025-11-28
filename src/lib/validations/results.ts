import { z } from "zod";

export const createResultSchema = z.object({
  eventId: z.string().min(1, "L'épreuve est requise"),
  athleteId: z.string().min(1, "L'athlète est requis"),
  rank: z.number().int().positive("Le rang doit être positif"),
  performance: z.string().optional(),
});

export const updateResultSchema = createResultSchema.partial().extend({
  id: z.string().min(1),
});

export const bulkCreateResultsSchema = z.object({
  eventId: z.string().min(1, "L'épreuve est requise"),
  results: z.array(
    z.object({
      athleteId: z.string().min(1),
      rank: z.number().int().positive(),
      performance: z.string().optional(),
    })
  ),
});

