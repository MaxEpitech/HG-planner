"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCompetition } from "@/lib/auth/roles";
import { createEventSchema, updateEventSchema } from "@/lib/validations/competition";
import type { GlobalRole } from "@prisma/client";

async function checkPermission(groupId: string) {
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

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      competition: {
        include: { permissions: true },
      },
    },
  });

  if (!group) {
    throw new Error("Groupe introuvable");
  }

  const competition = group.competition;

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

export async function createEvent(data: unknown) {
  try {
    const validated = createEventSchema.parse(data);
    await checkPermission(validated.groupId);

    const event = await prisma.event.create({
      data: {
        name: validated.name,
        order: validated.order,
        groupId: validated.groupId,
      },
    });

    const group = await prisma.group.findUnique({
      where: { id: validated.groupId },
      include: { competition: true },
    });

    revalidatePath("/admin/competitions");
    if (group) {
      revalidatePath(`/admin/competitions/${group.competitionId}`);
    }
    return { success: true, data: event };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getEvents(groupId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const events = await prisma.event.findMany({
      where: { groupId },
      orderBy: {
        order: "asc",
      },
    });

    return { success: true, data: events };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function updateEvent(data: unknown) {
  try {
    const validated = updateEventSchema.parse(data);

    const event = await prisma.event.findUnique({
      where: { id: validated.id },
      include: {
        group: {
          include: { competition: true },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Épreuve introuvable" };
    }

    await checkPermission(event.groupId);

    const updateData: {
      name?: string;
      order?: number;
    } = {};
    if (validated.name) updateData.name = validated.name;
    if (validated.order !== undefined) updateData.order = validated.order;

    const updatedEvent = await prisma.event.update({
      where: { id: validated.id },
      data: updateData,
    });

    revalidatePath("/admin/competitions");
    if (event.group) {
      revalidatePath(`/admin/competitions/${event.group.competitionId}`);
    }
    return { success: true, data: updatedEvent };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function deleteEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        group: {
          include: { competition: true },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Épreuve introuvable" };
    }

    await checkPermission(event.groupId);

    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/admin/competitions");
    if (event.group) {
      revalidatePath(`/admin/competitions/${event.group.competitionId}`);
    }
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

