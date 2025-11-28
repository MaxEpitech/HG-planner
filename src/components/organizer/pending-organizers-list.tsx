"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { User } from "@prisma/client";
import { approveOrganizer, rejectOrganizer } from "@/app/actions/organizers";
import { useRouter } from "next/navigation";

type PendingOrganizersListProps = {
  organizers: User[];
  onApprove: (userId: string) => Promise<{ success: boolean; error?: string }>;
  onReject: (userId: string) => Promise<{ success: boolean; error?: string }>;
};

export function PendingOrganizersList({
  organizers,
  onApprove,
  onReject,
}: PendingOrganizersListProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setProcessing(userId);
    setError(null);
    try {
      const result = await onApprove(userId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir rejeter cette demande ? Cette action est irréversible.")) {
      return;
    }
    setProcessing(userId);
    setError(null);
    try {
      const result = await onReject(userId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setProcessing(null);
    }
  };

  if (organizers.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">
          Aucune demande de compte organisateur en attente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Organisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Date de demande
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
              {organizers.map((organizer) => (
                <tr key={organizer.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                    {organizer.firstName} {organizer.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {organizer.organizationName || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {organizer.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {format(new Date(organizer.createdAt), "d MMMM yyyy", { locale: fr })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(organizer.id)}
                        disabled={processing === organizer.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === organizer.id ? "Traitement..." : "Approuver"}
                      </button>
                      <button
                        onClick={() => handleReject(organizer.id)}
                        disabled={processing === organizer.id}
                        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        Rejeter
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

