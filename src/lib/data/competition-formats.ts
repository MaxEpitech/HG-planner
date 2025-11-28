// Formats de compétition avec leurs épreuves
export type CompetitionFormat = "5" | "8";

export type EventDefinition = {
  name: string;
  order: number;
};

export const competitionFormats: Record<
  CompetitionFormat,
  { label: string; events: EventDefinition[] }
> = {
  "5": {
    label: "5 épreuves",
    events: [
      { name: "Open Stone", order: 1 },
      { name: "Poids en longueur léger", order: 2 },
      { name: "Marteau léger", order: 3 },
      { name: "Poids en Hauteur", order: 4 },
      { name: "Caber", order: 5 },
    ],
  },
  "8": {
    label: "8 épreuves",
    events: [
      { name: "Open Stone", order: 1 },
      { name: "Poids en longueur léger", order: 2 },
      { name: "Marteau léger", order: 3 },
      { name: "Poids en Hauteur", order: 4 },
      { name: "Caber", order: 5 },
      { name: "Braemar", order: 6 },
      { name: "Marteau lourd", order: 7 },
      { name: "Poids en longueur lourd", order: 8 },
    ],
  },
};

