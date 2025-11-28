"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCompetition } from "@/lib/auth/roles";

async function ensureCompetitionAccess(competitionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Non authentifié");
  }

  if (user.role === "PLATFORM_ADMIN") {
    return user;
  }

  if (!canManageCompetition(user.role)) {
    throw new Error("Vous n'avez pas les permissions nécessaires");
  }

  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: {
      ownerId: true,
      permissions: {
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });

  if (!competition) {
    throw new Error("Compétition introuvable");
  }

  if (competition.ownerId !== user.id) {
    const hasAccess = competition.permissions.some(
      (permission) =>
        permission.userId === user.id && permission.role === "ORGANISATEUR"
    );

    if (!hasAccess) {
      throw new Error("Vous n'avez pas accès à cette compétition");
    }
  }

  return user;
}

export async function addCompetitionPermission({
  competitionId,
  email,
  role,
}: {
  competitionId: string;
  email: string;
  role: "ORGANISATEUR" | "DIRECTEUR_ATHLETIQUE";
}) {
  try {
    await ensureCompetitionAccess(competitionId);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, error: "Email requis" };
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return {
        success: false,
        error: "Aucun utilisateur trouvé avec cet email",
      };
    }

    if (user.role === "PLATFORM_ADMIN") {
      return {
        success: false,
        error: "Les administrateurs plateforme ont déjà accès à toutes les compétitions",
      };
    }

    await prisma.competitionPermission.create({
      data: {
        competitionId,
        userId: user.id,
        role,
      },
    });

    revalidatePath(`/admin/competitions/${competitionId}`);
    revalidatePath("/admin/competitions");
    revalidatePath("/admin/resultats");

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Cet utilisateur possède déjà ce rôle sur la compétition",
      };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function removeCompetitionPermission({
  competitionId,
  permissionId,
}: {
  competitionId: string;
  permissionId: string;
}) {
  try {
    await ensureCompetitionAccess(competitionId);

    await prisma.competitionPermission.delete({
      where: { id: permissionId },
    });

    revalidatePath(`/admin/competitions/${competitionId}`);
    revalidatePath("/admin/competitions");
    revalidatePath("/admin/resultats");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

