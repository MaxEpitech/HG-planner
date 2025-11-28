// Liste des épreuves standard des Highland Games avec leur genre associé
export type EventGender = "M" | "F" | "both";

export type HighlandGamesEvent = {
  name: string;
  gender: EventGender;
};

export const highlandGamesEvents: HighlandGamesEvent[] = [
  { name: "Pierre légere", gender: "both" },
  { name: "Pierre lourde", gender: "M" },
  { name: "Poids en longueur léger (6kg)", gender: "F" },
  { name: "Poids en longueur lourd (12.7kg)", gender: "F" },
  { name: "Poids en longueur léger (12.7kg)", gender: "M" },
  { name: "Poids en longueur lourd (19.09kg)", gender: "M" },
  { name: "Poids en longueur lourd (25.4kg)", gender: "M" },
  { name: "Poids en hauteur (19.09kg)", gender: "M" },
  { name: "Poids en hauteur (25.4kg)", gender: "M" },
  { name: "Poids en hauteur (12.7kg)", gender: "F" },
  { name: "Marteau leger (7.26kg)", gender: "M" },
  { name: "Marteau lourd (10kg)", gender: "M" },
  { name: "Marteau lourd (7.26kg)", gender: "F" },
  { name: "Marteau leger (5kg)", gender: "F" },
].sort((a, b) => a.name.localeCompare(b.name));

// Fonction pour filtrer les épreuves selon le genre
export function getEventsForGender(gender: string | null | undefined): string[] {
  if (!gender) {
    // Si pas de genre défini, retourner toutes les épreuves
    return highlandGamesEvents.map((e) => e.name);
  }

  return highlandGamesEvents
    .filter((event) => event.gender === "both" || event.gender === gender)
    .map((event) => event.name);
}
