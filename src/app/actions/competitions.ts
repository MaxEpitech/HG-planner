"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCompetition } from "@/lib/auth/roles";
import {
  createCompetitionSchema,
  updateCompetitionSchema,
} from "@/lib/validations/competition";
import type { GlobalRole } from "@prisma/client";

async function checkPermission(competitionId?: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Non authentifié");
  }

  if (user.role === "PLATFORM_ADMIN") {
    return user;
  }

  if (!canManageCompetition(user.role as GlobalRole)) {
    throw new Error("Vous n'avez pas les permissions nécessaires");
  }

  if (competitionId) {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: { permissions: true },
    });

    if (!competition) {
      throw new Error("Compétition introuvable");
    }

    if (competition.ownerId !== user.id) {
      const hasPermission = competition.permissions.some(
        (p) => p.userId === user.id && p.role === "ORGANISATEUR"
      );
      if (!hasPermission) {
        throw new Error("Vous n'avez pas les permissions pour cette compétition");
      }
    }
  }

  return user;
}

export async function createCompetition(data: unknown) {
  try {
    const user = await checkPermission();
    const validated = createCompetitionSchema.parse(data);

    const competition = await prisma.competition.create({
      data: {
        name: validated.name,
        description: validated.description,
        location: validated.location,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        ownerId: user.id,
      },
    });

    revalidatePath("/admin/competitions");
    return { success: true, data: competition };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getCompetitions() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    let competitions;

    if (user.role === "PLATFORM_ADMIN") {
      competitions = await prisma.competition.findMany({
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          groups: {
            select: {
              id: true,
              name: true,
              category: true,
              maxAthletes: true,
              events: {
                select: {
                  id: true,
                  name: true,
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
          _count: {
            select: {
              groups: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
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
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          groups: {
            select: {
              id: true,
              name: true,
              category: true,
              maxAthletes: true,
              events: {
                select: {
                  id: true,
                  name: true,
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
          _count: {
            select: {
              groups: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      });
    }

    return { success: true, data: competitions };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getCompetition(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        groups: {
          include: {
            events: {
              orderBy: {
                order: "asc",
              },
              include: {
                _count: {
                  select: {
                    results: true,
                  },
                },
              },
            },
            registrations: {
              include: {
                athlete: true,
              },
            },
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
        permissions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!competition) {
      return { success: false, error: "Compétition introuvable" };
    }

    // Vérifier les permissions
    if (user.role !== "PLATFORM_ADMIN") {
      if (
        competition.ownerId !== user.id &&
        !competition.permissions.some((p) => p.userId === user.id)
      ) {
        return { success: false, error: "Accès non autorisé" };
      }
    }

    return { success: true, data: competition };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function updateCompetition(data: unknown) {
  try {
    const validated = updateCompetitionSchema.parse(data);
    await checkPermission(validated.id);

    const updateData: {
      name?: string;
      description?: string | null;
      location?: string;
      startDate?: Date;
      endDate?: Date;
      status?: string;
    } = {};
    if (validated.name) updateData.name = validated.name;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.location) updateData.location = validated.location;
    if (validated.startDate) updateData.startDate = new Date(validated.startDate);
    if (validated.endDate) updateData.endDate = new Date(validated.endDate);
    if (validated.status) updateData.status = validated.status;

    const competition = await prisma.competition.update({
      where: { id: validated.id },
      data: updateData,
    });

    revalidatePath("/admin/competitions");
    revalidatePath(`/admin/competitions/${validated.id}`);
    return { success: true, data: competition };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function deleteCompetition(id: string) {
  try {
    await checkPermission(id);

    await prisma.competition.delete({
      where: { id },
    });

    revalidatePath("/admin/competitions");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

