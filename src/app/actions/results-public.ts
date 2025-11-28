"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicCompetitionsWithResults() {
  try {
    const competitions = await prisma.competition.findMany({
      where: {
        status: {
          in: ["open", "published"],
        },
      },
      include: {
        groups: {
          include: {
            events: {
              include: {
                _count: {
                  select: {
                    results: true,
                  },
                },
              },
            },
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // Filtrer pour ne garder que les compétitions avec au moins un résultat
    const competitionsWithResults = competitions.filter((comp) => {
      return comp.groups.some((group) =>
        group.events.some((event) => event._count.results > 0)
      );
    });

    return { success: true, data: competitionsWithResults };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getPublicCompetition(id: string) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            events: {
              orderBy: {
                order: "asc",
              },
              include: {
                results: {
                  include: {
                    athlete: true,
                  },
                  orderBy: {
                    rank: "asc",
                  },
                },
                _count: {
                  select: {
                    results: true,
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
        },
      },
    });

    if (!competition) {
      return { success: false, error: "Compétition introuvable" };
    }

    return { success: true, data: competition };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getPublicLeaderboardForGroup(groupId: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
          },
        },
        events: {
          orderBy: {
            order: "asc",
          },
          include: {
            results: {
              include: {
                athlete: true,
              },
              orderBy: {
                rank: "asc",
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
        results: Array<{ eventName: string; rank: number; points: number; performance: string | null }>;
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
            performance: result.performance,
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

    return { success: true, data: { group, leaderboard } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}


