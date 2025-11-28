"use client";

import { useState } from "react";
import { updateCompetition } from "@/app/actions/competitions";
import { useRouter } from "next/navigation";

type CompetitionStatusToggleProps = {
  competitionId: string;
  currentStatus: string;
};

export function CompetitionStatusToggle({
  competitionId,
  currentStatus,
}: CompetitionStatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOpen = currentStatus === "open" || currentStatus === "published";

  const handleToggle = async () => {
    setError("");
    setLoading(true);

    try {
      const newStatus = isOpen ? "draft" : "open";
      const result = await updateCompetition({
        id: competitionId,
        status: newStatus,
      });

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-lg bg-red-50 p-2 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          isOpen
            ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
        } disabled:opacity-50`}
      >
        {loading
          ? "..."
          : isOpen
            ? "Fermer les inscriptions"
            : "Ouvrir les inscriptions"}
      </button>
      <p className="text-xs text-zinc-500">
        {isOpen
          ? "Les inscriptions sont ouvertes au public"
          : "Les inscriptions sont fermées (brouillon)"}
      </p>
    </div>
  );
}

