"use client";

import { useState, useTransition } from "react";
import { addCompetitionPermission, removeCompetitionPermission } from "@/app/actions/competition-permissions";
import type { CompetitionRole } from "@prisma/client";

type Permission = {
  id: string;
  role: CompetitionRole;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

type CompetitionTeamSectionProps = {
  competitionId: string;
  permissions: Permission[];
};

const roleLabels: Record<CompetitionRole, string> = {
  ORGANISATEUR: "Organisateur",
  DIRECTEUR_ATHLETIQUE: "Directeur Athlétique",
};

export function CompetitionTeamSection({
  competitionId,
  permissions,
}: CompetitionTeamSectionProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CompetitionRole>("DIRECTEUR_ATHLETIQUE");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    startTransition(async () => {
      const result = await addCompetitionPermission({
        competitionId,
        email,
        role,
      });

      if (!result.success) {
        setError(result.error || "Impossible d'ajouter ce responsable");
      } else {
        setSuccessMessage("Responsable ajouté avec succès");
        setEmail("");
        setRole("DIRECTEUR_ATHLETIQUE");
      }
    });
  };

  const handleRemove = (permissionId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce responsable ?")) {
      return;
    }

    setError("");
    setSuccessMessage("");

    startTransition(async () => {
      const result = await removeCompetitionPermission({
        competitionId,
        permissionId,
      });

      if (!result.success) {
        setError(result.error || "Impossible de retirer ce responsable");
      } else {
        setSuccessMessage("Responsable retiré");
      }
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            Équipe
          </p>
          <h2 className="text-xl font-semibold">Responsables</h2>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
          {successMessage}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Ajouter un responsable
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
          />
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as CompetitionRole)
            }
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="DIRECTEUR_ATHLETIQUE">Directeur Athlétique</option>
            <option value="ORGANISATEUR">Organisateur</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? "Ajout..." : "Ajouter"}
          </button>
        </form>
        <p className="mt-2 text-xs text-zinc-500">
          L&apos;utilisateur doit déjà disposer d&apos;un compte pour être invité.
        </p>
      </div>

      <div className="space-y-2">
        {permissions.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Aucun responsable supplémentaire pour l&apos;instant.
          </p>
        ) : (
          permissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div>
                <p className="font-semibold">
                  {permission.user.firstName} {permission.user.lastName}
                </p>
                <p className="text-xs text-zinc-500">{permission.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                  {roleLabels[permission.role]}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(permission.id)}
                  disabled={isPending}
                  className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

