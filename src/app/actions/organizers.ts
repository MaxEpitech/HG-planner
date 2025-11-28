"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { organizerAccountSchema } from "@/lib/validations/organizer-account";
import { GlobalRole } from "@prisma/client";

export type RegisterOrganizerFormState = {
  success?: boolean;
  error?: string;
};

export async function registerOrganizerAccount(data: unknown) {
  try {
    const parsed = organizerAccountSchema.parse(data);

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
        organizationName: parsed.organizationName,
        passwordHash,
        role: GlobalRole.ORGANISATEUR,
        isApproved: false, // Doit être approuvé par l'admin
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

export async function registerOrganizerAccountAction(
  _prevState: RegisterOrganizerFormState,
  formData: FormData
): Promise<RegisterOrganizerFormState> {
  const payload = {
    firstName: (formData.get("firstName") as string) ?? "",
    lastName: (formData.get("lastName") as string) ?? "",
    organizationName: (formData.get("organizationName") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
    confirmPassword: (formData.get("confirmPassword") as string) ?? "",
  };

  const result = await registerOrganizerAccount(payload);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

export async function getPendingOrganizers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: GlobalRole.ORGANISATEUR,
        isApproved: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true as const, data: users };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function approveOrganizer(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

export async function rejectOrganizer(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Une erreur est survenue" };
  }
}

