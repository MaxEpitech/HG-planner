"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canRecordResults } from "@/lib/auth/roles";
import { calculatePoints } from "@/lib/utils/points";
import {
  createResultSchema,
  bulkCreateResultsSchema,
} from "@/lib/validations/results";
import type { GlobalRole } from "@prisma/client";

async function checkPermission(eventId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Non authentifié");
  }

  if (user.role === "PLATFORM_ADMIN") {
    return user;
  }

  if (!canRecordResults(user.role as GlobalRole)) {
    throw new Error("Vous n'avez pas les permissions pour saisir des résultats");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      group: {
        include: {
          competition: {
            include: { permissions: true },
          },
        },
      },
    },
  });

  if (!event) {
    throw new Error("Épreuve introuvable");
  }

  const competition = event.group.competition;

  // Vérifier les permissions sur la compétition (les admins sont déjà retournés plus haut)
  if (competition.ownerId !== user.id) {
    const hasPermission = competition.permissions.some(
      (p) =>
        p.userId === user.id &&
        (p.role === "DIRECTEUR_ATHLETIQUE" || p.role === "ORGANISATEUR")
    );
    if (!hasPermission) {
      throw new Error("Vous n'avez pas les permissions pour cette compétition");
    }
  }

  return user;
}

export async function createResult(data: unknown) {
  try {
    const validated = createResultSchema.parse(data);
    await checkPermission(validated.eventId);

    const points = calculatePoints(validated.rank);

    // Vérifier si un résultat existe déjà pour cet athlète et cette épreuve
    const existing = await prisma.result.findFirst({
      where: {
        eventId: validated.eventId,
        athleteId: validated.athleteId,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Un résultat existe déjà pour cet athlète dans cette épreuve",
      };
    }

    const result = await prisma.result.create({
      data: {
        eventId: validated.eventId,
        athleteId: validated.athleteId,
        rank: validated.rank,
        points,
        performance: validated.performance || null,
      },
      include: {
        athlete: true,
        event: {
          include: {
            group: {
              include: {
                competition: true,
              },
            },
          },
        },
      },
    });

    const competitionId = result.event.group.competitionId;
    revalidatePath("/admin/resultats");
    revalidatePath(`/admin/resultats/${competitionId}`);
    revalidatePath(`/admin/competitions/${competitionId}`);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function bulkCreateResults(data: unknown) {
  try {
    const validated = bulkCreateResultsSchema.parse(data);
    await checkPermission(validated.eventId);

    // Vérifier que tous les rangs sont uniques
    const ranks = validated.results.map((r) => r.rank);
    const uniqueRanks = new Set(ranks);
    if (ranks.length !== uniqueRanks.size) {
      return {
        success: false,
        error: "Les rangs doivent être uniques",
      };
    }

    // Vérifier que tous les athlètes sont différents
    const athleteIds = validated.results.map((r) => r.athleteId);
    const uniqueAthletes = new Set(athleteIds);
    if (athleteIds.length !== uniqueAthletes.size) {
      return {
        success: false,
        error: "Chaque athlète ne peut avoir qu'un seul résultat",
      };
    }

    // Récupérer l'épreuve pour obtenir le competitionId
    const event = await prisma.event.findUnique({
      where: { id: validated.eventId },
      include: {
        group: {
          include: {
            competition: true,
          },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Épreuve introuvable" };
    }

    // Supprimer les résultats existants pour cette épreuve
    await prisma.result.deleteMany({
      where: { eventId: validated.eventId },
    });

    // Créer tous les résultats
    const results = await prisma.result.createMany({
      data: validated.results.map((r) => ({
        eventId: validated.eventId,
        athleteId: r.athleteId,
        rank: r.rank,
        points: calculatePoints(r.rank),
        performance: r.performance || null,
      })),
    });

    const competitionId = event.group.competitionId;
    revalidatePath("/admin/resultats");
    revalidatePath(`/admin/resultats/${competitionId}`);
    revalidatePath(`/admin/competitions/${competitionId}`);

    return { success: true, data: { count: results.count } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getResultsForEvent(eventId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const results = await prisma.result.findMany({
      where: { eventId },
      include: {
        athlete: true,
      },
      orderBy: {
        rank: "asc",
      },
    });

    return { success: true, data: results };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getLeaderboardForGroup(groupId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        events: {
          include: {
            results: {
              include: {
                athlete: true,
              },
            },
          },
        },
        registrations: {
          where: {
            status: "CONFIRMED",
          },
          include: {
            athlete: true,
          },
        },
      },
    });

    if (!group) {
      return { success: false, error: "Groupe introuvable" };
    }

    // Calculer le total de points par athlète
    const athletePoints = new Map<
      string,
      {
        athlete: typeof group.registrations[0]["athlete"];
        totalPoints: number;
        results: Array<{ eventName: string; rank: number; points: number }>;
      }
    >();

    // Initialiser avec tous les athlètes inscrits
    group.registrations.forEach((reg) => {
      athletePoints.set(reg.athleteId, {
        athlete: reg.athlete,
        totalPoints: 0,
        results: [],
      });
    });

    // Ajouter les points de chaque épreuve
    group.events.forEach((event) => {
      event.results.forEach((result) => {
        const athleteData = athletePoints.get(result.athleteId);
        if (athleteData) {
          athleteData.totalPoints += result.points;
          athleteData.results.push({
            eventName: event.name,
            rank: result.rank,
            points: result.points,
          });
        }
      });
    });

    // Convertir en tableau et trier par points totaux (le plus bas gagne)
    const leaderboard = Array.from(athletePoints.values())
      .map((data) => ({
        athlete: data.athlete,
        totalPoints: data.totalPoints,
        results: data.results,
        eventsCompleted: data.results.length,
        totalEvents: group.events.length,
      }))
      .sort((a, b) => {
        // Trier par points totaux (croissant), puis par nombre d'épreuves complétées (décroissant)
        if (a.totalPoints !== b.totalPoints) {
          return a.totalPoints - b.totalPoints;
        }
        return b.eventsCompleted - a.eventsCompleted;
      });

    return { success: true, data: leaderboard };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function deleteResult(id: string) {
  try {
    const result = await prisma.result.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            group: {
              include: {
                competition: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      return { success: false, error: "Résultat introuvable" };
    }

    await checkPermission(result.eventId);

    await prisma.result.delete({
      where: { id },
    });

    const competitionId = result.event.group.competitionId;
    revalidatePath("/admin/resultats");
    revalidatePath(`/admin/resultats/${competitionId}`);
    revalidatePath(`/admin/competitions/${competitionId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

