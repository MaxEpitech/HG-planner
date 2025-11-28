"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCompetition } from "@/lib/auth/roles";
import type { GlobalRole, RegistrationStatus } from "@prisma/client";

async function checkPermission(registrationId: string) {
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

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
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

  if (!registration) {
    throw new Error("Inscription introuvable");
  }

  const competition = registration.group.competition;

  if (competition.ownerId !== user.id) {
    const hasPermission = competition.permissions.some(
      (p) => p.userId === user.id && p.role === "ORGANISATEUR"
    );
    if (!hasPermission) {
      throw new Error("Vous n'avez pas les permissions pour cette compétition");
    }
  }

  return user;
}

export async function getRegistrations(filters?: {
  competitionId?: string;
  groupId?: string;
  status?: RegistrationStatus;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const whereClause: {
      group?: {
        competitionId?: string | { in: string[] };
      };
      groupId?: string;
      status?: RegistrationStatus;
    } = {};

    if (filters?.competitionId) {
      whereClause.group = {
        competitionId: filters.competitionId,
      };
    }

    if (filters?.groupId) {
      whereClause.groupId = filters.groupId;
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    // Filtrer par compétitions accessibles
    if (user.role !== "PLATFORM_ADMIN") {
      const competitions = await prisma.competition.findMany({
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
        select: { id: true },
      });

      const competitionIds = competitions.map((c) => c.id);

      whereClause.group = {
        ...whereClause.group,
        competitionId: {
          in: competitionIds,
        },
      };
    }

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        athlete: true,
        group: {
          include: {
            competition: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: registrations };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus
) {
  try {
    await checkPermission(registrationId);

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: { status },
      include: {
        athlete: true,
        group: {
          include: {
            competition: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/admin/competitions");
    revalidatePath(`/admin/competitions/${registration.group.competitionId}`);
    revalidatePath("/admin/athletes");

    return { success: true, data: registration };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function bulkUpdateRegistrationStatus(
  registrationIds: string[],
  status: RegistrationStatus
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier les permissions pour chaque inscription
    for (const id of registrationIds) {
      await checkPermission(id);
    }

    const registrations = await prisma.registration.updateMany({
      where: {
        id: {
          in: registrationIds,
        },
      },
      data: { status },
    });

    revalidatePath("/admin/athletes");
    revalidatePath("/admin/competitions");

    return { success: true, data: { count: registrations.count } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}
