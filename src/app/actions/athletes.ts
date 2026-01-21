"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { athleteAccountSchema } from "@/lib/validations/athlete-account";
import { athleteProfileUpdateSchema, personalRecordSchema } from "@/lib/validations/athlete-profile";
import { getCurrentUser } from "@/lib/auth/session";
import { GlobalRole } from "@prisma/client";

export type RegisterAthleteFormState = {
  success?: boolean;
  error?: string;
};

export type UpdateAthleteProfileFormState = {
  success?: boolean;
  error?: string;
};

export type CreatePersonalRecordFormState = {
  success?: boolean;
  error?: string;
};

export async function registerAthleteAccount(data: unknown) {
  try {
    const parsed = athleteAccountSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existingUser) {
      return {
        success: false as const,
        error: "Un compte existe déjà avec cet email.",
      };
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);

    await prisma.user.create({
      data: {
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        passwordHash,
        role: GlobalRole.ATHLETE,
        athleteProfile: {
          create: {
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            club: parsed.club || null,
            phone: parsed.phone || null,
            country: parsed.country || null,
            birthDate: parsed.birthDate ? new Date(parsed.birthDate) : null,
          },
        },
      },
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function getAthleteProfileForUser(userId?: string) {
  try {
    const currentUser = userId
      ? { id: userId }
      : await getCurrentUser();

    if (!currentUser) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: currentUser.id },
      include: {
        registrations: {
          orderBy: { createdAt: "desc" },
          include: {
            group: {
              include: {
                competition: true,
              },
            },
          },
        },
        results: {
          orderBy: { createdAt: "desc" },
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
        },
      },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    return { success: true as const, data: athlete };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function registerAthleteAccountAction(
  _prevState: RegisterAthleteFormState,
  formData: FormData
): Promise<RegisterAthleteFormState> {
  const payload = {
    firstName: (formData.get("firstName") as string) ?? "",
    lastName: (formData.get("lastName") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
    confirmPassword: (formData.get("confirmPassword") as string) ?? "",
    club: (formData.get("club") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    country: (formData.get("country") as string) || undefined,
  };

  const result = await registerAthleteAccount(payload);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

export async function getAthleteRegistrations() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    const registrations = await prisma.registration.findMany({
      where: { athleteId: athlete.id },
      include: {
        group: {
          include: {
            competition: true,
            events: {
              include: {
                _count: {
                  select: { results: true },
                },
              },
            },
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true as const, data: registrations };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function getAthleteResults() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    const results = await prisma.result.findMany({
      where: { athleteId: athlete.id },
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
      orderBy: { createdAt: "desc" },
    });

    // Grouper par compétition
    const resultsByCompetition = results.reduce(
      (acc, result) => {
        const compId = result.event.group.competitionId;
        const compName = result.event.group.competition.name;
        const compDate = result.event.group.competition.startDate;
        if (!acc[compId]) {
          acc[compId] = {
            competitionId: compId,
            competitionName: compName,
            competitionDate: compDate,
            results: [],
          };
        }
        acc[compId].results.push(result);
        return acc;
      },
      {} as Record<
        string,
        {
          competitionId: string;
          competitionName: string;
          competitionDate: Date;
          results: typeof results;
        }
      >
    );

    return {
      success: true as const,
      data: {
        all: results,
        byCompetition: Object.values(resultsByCompetition),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function getAthleteRecords() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    const results = await prisma.result.findMany({
      where: { athleteId: athlete.id },
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

    if (results.length === 0) {
      return {
        success: true as const,
        data: {
          bestRank: null,
          totalCompetitions: 0,
          totalEvents: 0,
          podiumCount: 0,
          victories: 0,
        },
      };
    }

    // Meilleur classement (rank le plus bas = meilleur)
    const bestRank = Math.min(...results.map((r) => r.rank));

    // Nombre de podiums (rank <= 3)
    const podiumCount = results.filter((r) => r.rank <= 3).length;

    // Nombre de victoires (rank === 1)
    const victories = results.filter((r) => r.rank === 1).length;

    // Compétitions uniques
    const uniqueCompetitions = new Set(
      results.map((r) => r.event.group.competitionId)
    );

    return {
      success: true as const,
      data: {
        bestRank,
        totalCompetitions: uniqueCompetitions.size,
        totalEvents: results.length,
        podiumCount,
        victories,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function updateAthleteProfile(data: unknown) {
  try {
    const parsed = athleteProfileUpdateSchema.parse(data);
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    // Mettre à jour le User si firstName ou lastName sont fournis
    if (parsed.firstName !== undefined || parsed.lastName !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(parsed.firstName !== undefined && { firstName: parsed.firstName }),
          ...(parsed.lastName !== undefined && { lastName: parsed.lastName }),
        },
      });
    }

    // Mettre à jour l'Athlete
    await prisma.athlete.update({
      where: { id: athlete.id },
      data: {
        ...(parsed.firstName !== undefined && { firstName: parsed.firstName }),
        ...(parsed.lastName !== undefined && { lastName: parsed.lastName }),
        club: parsed.club !== undefined ? parsed.club || null : undefined,
        phone: parsed.phone !== undefined ? parsed.phone || null : undefined,
        birthDate:
          parsed.birthDate !== undefined
            ? parsed.birthDate
              ? new Date(parsed.birthDate)
              : null
            : undefined,
        country: parsed.country !== undefined ? parsed.country || null : undefined,
        tshirtSize: parsed.tshirtSize !== undefined ? parsed.tshirtSize || null : undefined,
        gender: parsed.gender !== undefined ? (parsed.gender === "" ? null : parsed.gender) : undefined,
      },
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function updateAthleteProfileAction(
  _prevState: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const payload = {
    firstName: (formData.get("firstName") as string) || undefined,
    lastName: (formData.get("lastName") as string) || undefined,
    club: (formData.get("club") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    country: (formData.get("country") as string) || undefined,
    tshirtSize: (formData.get("tshirtSize") as string) || undefined,
    gender: (formData.get("gender") as string) || undefined,
  };

  const result = await updateAthleteProfile(payload);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

export async function getPersonalRecords() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    const records = await prisma.personalRecord.findMany({
      where: { athleteId: athlete.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true as const, data: records };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function createPersonalRecord(data: unknown) {
  try {
    const parsed = personalRecordSchema.parse(data);
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    await prisma.personalRecord.create({
      data: {
        eventName: parsed.eventName,
        performance: parsed.performance,
        date: parsed.date ? new Date(parsed.date) : null,
        notes: parsed.notes || null,
        athleteId: athlete.id,
      },
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function createPersonalRecordAction(
  _prevState: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const payload = {
    eventName: (formData.get("eventName") as string) ?? "",
    performance: (formData.get("performance") as string) ?? "",
    date: (formData.get("date") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = await createPersonalRecord(payload);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

export async function deletePersonalRecord(recordId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const athlete = await prisma.athlete.findUnique({
      where: { userId: user.id },
    });

    if (!athlete) {
      return { success: false as const, error: "Profil athlète introuvable" };
    }

    // Vérifier que le record appartient bien à l'athlète
    const record = await prisma.personalRecord.findUnique({
      where: { id: recordId },
    });

    if (!record || record.athleteId !== athlete.id) {
      return { success: false as const, error: "Record introuvable" };
    }

    await prisma.personalRecord.delete({
      where: { id: recordId },
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

