import type { GlobalRole as PrismaGlobalRole } from "@prisma/client";

export const GLOBAL_ROLES = [
  "PLATFORM_ADMIN",
  "ORGANISATEUR",
  "DIRECTEUR_ATHLETIQUE",
  "ATHLETE",
] as const;

export type GlobalRole = (typeof GLOBAL_ROLES)[number];

export const COMPETITION_ROLES = ["ORGANISATEUR", "DIRECTEUR_ATHLETIQUE"] as const;

export type CompetitionRole = (typeof COMPETITION_ROLES)[number];

export const roleLabels: Record<GlobalRole | CompetitionRole, string> = {
  PLATFORM_ADMIN: "Admin plateforme",
  ORGANISATEUR: "Organisateur",
  DIRECTEUR_ATHLETIQUE: "Directeur Athlétique",
  ATHLETE: "Athlète",
};

export const GLOBAL_ROLES_WITH_LABELS = [
  { value: "PLATFORM_ADMIN" as PrismaGlobalRole, label: "Admin plateforme" },
  { value: "ORGANISATEUR" as PrismaGlobalRole, label: "Organisateur" },
  {
    value: "DIRECTEUR_ATHLETIQUE" as PrismaGlobalRole,
    label: "Directeur Athlétique",
  },
  { value: "ATHLETE" as PrismaGlobalRole, label: "Athlète" },
];

export const canManageCompetition = (role: GlobalRole) =>
  role === "PLATFORM_ADMIN" || role === "ORGANISATEUR";

export const canRecordResults = (role: GlobalRole | CompetitionRole) =>
  role === "PLATFORM_ADMIN" || role === "ORGANISATEUR" || role === "DIRECTEUR_ATHLETIQUE";

