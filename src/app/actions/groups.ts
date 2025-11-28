"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCompetition } from "@/lib/auth/roles";
import { createGroupSchema, updateGroupSchema } from "@/lib/validations/competition";
import { competitionFormats, type CompetitionFormat } from "@/lib/data/competition-formats";
import type { GlobalRole } from "@prisma/client";

async function checkPermission(competitionId: string) {
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

  return user;
}

export async function createGroup(data: unknown) {
  try {
    const validated = createGroupSchema.parse(data);
    await checkPermission(validated.competitionId);

    // Récupérer les épreuves selon le format choisi
    const format = validated.format as CompetitionFormat;
    const events = competitionFormats[format].events;

    // Créer le groupe avec les épreuves
    const group = await prisma.group.create({
      data: {
        name: validated.name,
        category: validated.category,
        maxAthletes: validated.maxAthletes,
        competitionId: validated.competitionId,
        events: {
          create: events.map((event) => ({
            name: event.name,
            order: event.order,
          })),
        },
      },
      include: {
        events: true,
      },
    });

    revalidatePath("/admin/competitions");
    revalidatePath(`/admin/competitions/${validated.competitionId}`);
    return { success: true, data: group };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getGroups(competitionId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      return { success: false, error: "Compétition introuvable" };
    }

    const groups = await prisma.group.findMany({
      where: { competitionId },
      include: {
        events: {
          orderBy: {
            order: "asc",
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
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: groups };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function updateGroup(data: unknown) {
  try {
    const validated = updateGroupSchema.parse(data);

    const group = await prisma.group.findUnique({
      where: { id: validated.id },
      include: { competition: true },
    });

    if (!group) {
      return { success: false, error: "Groupe introuvable" };
    }

    await checkPermission(group.competitionId);

    const updateData: {
      name?: string;
      category?: string;
      maxAthletes?: number;
    } = {};
    if (validated.name) updateData.name = validated.name;
    if (validated.category) updateData.category = validated.category;
    if (validated.maxAthletes) updateData.maxAthletes = validated.maxAthletes;

    const updatedGroup = await prisma.group.update({
      where: { id: validated.id },
      data: updateData,
    });

    revalidatePath("/admin/competitions");
    revalidatePath(`/admin/competitions/${group.competitionId}`);
    return { success: true, data: updatedGroup };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function deleteGroup(id: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { competition: true },
    });

    if (!group) {
      return { success: false, error: "Groupe introuvable" };
    }

    await checkPermission(group.competitionId);

    await prisma.group.delete({
      where: { id },
    });

    revalidatePath("/admin/competitions");
    revalidatePath(`/admin/competitions/${group.competitionId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

