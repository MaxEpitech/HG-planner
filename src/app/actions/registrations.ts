"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createAthleteAndRegistrationSchema } from "@/lib/validations/registration";
import { getCurrentUser } from "@/lib/auth/session";

export async function getPublicCompetitions() {
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
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    console.log(`[getPublicCompetitions] Found ${competitions.length} competitions with status open/published`);
    if (competitions.length > 0) {
      console.log(`[getPublicCompetitions] First ID: ${competitions[0].id}, Status: ${competitions[0].status}`);
    }

    return { success: true, data: competitions };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getCompetitionForRegistration(id: string) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            _count: {
              select: {
                registrations: true,
              },
            },
            events: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!competition) {
      return { success: false, error: "Compétition introuvable" };
    }

    if (competition.status !== "open" && competition.status !== "published") {
      return {
        success: false,
        error: "Les inscriptions ne sont pas ouvertes pour cette compétition",
      };
    }

    return { success: true, data: competition };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function createAthleteAndRegistration(data: unknown) {
  try {
    const validated = createAthleteAndRegistrationSchema.parse(data);
    const sessionUser = await getCurrentUser();

    // Vérifier que le groupe existe et n'est pas plein
    const group = await prisma.group.findUnique({
      where: { id: validated.groupId },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
        competition: true,
      },
    });

    if (!group) {
      return { success: false, error: "Groupe introuvable" };
    }

    if (group.competitionId !== validated.competitionId) {
      return {
        success: false,
        error: "Le groupe n'appartient pas à cette compétition",
      };
    }

    if (group.competition.status !== "open" && group.competition.status !== "published") {
      return {
        success: false,
        error: "Les inscriptions ne sont pas ouvertes pour cette compétition",
      };
    }

    if (group._count.registrations >= group.maxAthletes) {
      return {
        success: false,
        error: "Ce groupe est complet",
      };
    }

    // Chercher un profil athlète existant (lié à l'utilisateur ou via email)
    let athlete = null;

    if (sessionUser?.role === "ATHLETE") {
      athlete = await prisma.athlete.findUnique({
        where: { userId: sessionUser.id },
      });
    }

    if (!athlete && validated.email && validated.email.trim() !== "") {
      athlete = await prisma.athlete.findFirst({
        where: {
          email: validated.email,
          firstName: validated.firstName,
          lastName: validated.lastName,
        },
      });
    }

    if (athlete) {
      athlete = await prisma.athlete.update({
        where: { id: athlete.id },
        data: {
          firstName: validated.firstName,
          lastName: validated.lastName,
          club: validated.club || null,
          email: validated.email && validated.email.trim() !== "" ? validated.email : null,
          phone: validated.phone || null,
          birthDate: validated.birthDate ? new Date(validated.birthDate) : null,
          country: validated.country || null,
          userId: sessionUser?.role === "ATHLETE" ? sessionUser.id : athlete.userId,
        },
      });
    } else {
      athlete = await prisma.athlete.create({
        data: {
          firstName: validated.firstName,
          lastName: validated.lastName,
          club: validated.club || null,
          email: validated.email && validated.email.trim() !== "" ? validated.email : null,
          phone: validated.phone || null,
          birthDate: validated.birthDate ? new Date(validated.birthDate) : null,
          country: validated.country || null,
          userId: sessionUser?.role === "ATHLETE" ? sessionUser.id : null,
        },
      });
    }

    // Vérifier si l'athlète n'est pas déjà inscrit à ce groupe
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        athleteId_groupId: {
          athleteId: athlete.id,
          groupId: validated.groupId,
        },
      },
    });

    if (existingRegistration) {
      return {
        success: false,
        error: "Vous êtes déjà inscrit à ce groupe",
      };
    }

    // Créer l'inscription
    const registration = await prisma.registration.create({
      data: {
        athleteId: athlete.id,
        groupId: validated.groupId,
        status: "PENDING",
      },
      include: {
        athlete: true,
        group: {
          include: {
            competition: true,
          },
        },
      },
    });

    revalidatePath("/inscriptions");
    revalidatePath(`/inscriptions/${validated.competitionId}`);
    revalidatePath("/admin/competitions");
    revalidatePath(`/admin/competitions/${validated.competitionId}`);

    return { success: true, data: registration };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

