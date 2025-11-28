"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function getDashboardStats() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Récupérer les compétitions accessibles
    let competitions;
    if (user.role === "PLATFORM_ADMIN") {
      competitions = await prisma.competition.findMany({
        include: {
          groups: {
            include: {
              _count: {
                select: {
                  registrations: true,
                },
              },
              events: {
                include: {
                  _count: {
                    select: {
                      results: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              groups: true,
            },
          },
        },
      });
    } else {
      competitions = await prisma.competition.findMany({
        where: {
          OR: [
            { ownerId: user.id },
            {
              permissions: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
        include: {
          groups: {
            include: {
              _count: {
                select: {
                  registrations: true,
                },
              },
              events: {
                include: {
                  _count: {
                    select: {
                      results: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              groups: true,
            },
          },
        },
      });
    }

    // Calculer les statistiques
    const activeCompetitions = competitions.filter(
      (c) => c.status === "open" || c.status === "published"
    ).length;

    const totalGroups = competitions.reduce(
      (sum, c) => sum + c._count.groups,
      0
    );

    let pendingRegistrations = 0;
    let totalRegistrations = 0;
    let fullGroups = 0;
    let totalResults = 0;
    let totalCapacity = 0;

    competitions.forEach((competition) => {
      competition.groups.forEach((group) => {
        const registrationsCount = group._count.registrations;
        totalRegistrations += registrationsCount;
        totalCapacity += group.maxAthletes;

        if (registrationsCount >= group.maxAthletes) {
          fullGroups++;
        }

        group.events.forEach((event) => {
          totalResults += event._count.results;
        });
      });
    });

    // Récupérer les inscriptions en attente
    const pendingRegistrationsResult = await prisma.registration.count({
      where: {
        status: "PENDING",
        group: {
          competition: {
            OR:
              user.role === "PLATFORM_ADMIN"
                ? undefined
                : [
                    { ownerId: user.id },
                    {
                      permissions: {
                        some: {
                          userId: user.id,
                        },
                      },
                    },
                  ],
          },
        },
      },
    });

    pendingRegistrations = pendingRegistrationsResult;

    // Trouver la prochaine compétition
    const now = new Date();
    const upcomingCompetitions = competitions
      .filter((c) => new Date(c.startDate) >= now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const nextCompetition = upcomingCompetitions[0] || null;

    return {
      success: true,
      data: {
        activeCompetitions,
        totalGroups,
        pendingRegistrations,
        totalRegistrations,
        fullGroups,
        totalResults,
        totalCapacity,
        availableSpots: totalCapacity - totalRegistrations,
        nextCompetition: nextCompetition
          ? {
              id: nextCompetition.id,
              name: nextCompetition.name,
              location: nextCompetition.location,
              startDate: nextCompetition.startDate,
              endDate: nextCompetition.endDate,
              status: nextCompetition.status,
              groupsCount: nextCompetition._count.groups,
            }
          : null,
        competitions: competitions.map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          startDate: c.startDate,
          endDate: c.endDate,
          status: c.status,
          groupsCount: c._count.groups,
        })),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

