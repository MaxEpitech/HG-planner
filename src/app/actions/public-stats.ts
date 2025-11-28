"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicStats() {
  try {
    const now = new Date();

    const [
      totalCompetitions,
      activeCompetitions,
      totalResults,
      totalAthletes,
    ] = await Promise.all([
      prisma.competition.count({
        where: {
          status: {
            in: ["open", "published"],
          },
        },
      }),
      prisma.competition.count({
        where: {
          status: {
            in: ["open", "published"],
          },
          startDate: {
            gte: now,
          },
        },
      }),
      prisma.result.count(),
      prisma.athlete.count(),
    ]);

    return {
      success: true as const,
      data: {
        totalCompetitions,
        activeCompetitions,
        totalResults,
        totalAthletes,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

