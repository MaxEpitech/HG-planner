"use client";

import { useState } from "react";
import { createGroup } from "@/app/actions/groups";
import { useRouter } from "next/navigation";
import { competitionCategories } from "@/lib/data/competition-categories";
import { competitionFormats, type CompetitionFormat } from "@/lib/data/competition-formats";

type CreateGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
};

export function CreateGroupModal({
  isOpen,
  onClose,
  competitionId,
}: CreateGroupModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    maxAthletes: 10,
    format: "" as CompetitionFormat | "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createGroup({
        ...formData,
        competitionId,
        maxAthletes: Number(formData.maxAthletes),
        format: formData.format as CompetitionFormat,
      });

      if (result.success) {
        router.refresh();
        onClose();
        setFormData({
          name: "",
          category: "",
          maxAthletes: 10,
          format: "",
        });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nouveau groupe</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nom du groupe *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Catégorie *
            </label>
            <div className="relative mt-1">
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">Sélectionnez une catégorie</option>
                {competitionCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Format de compétition *
            </label>
            <div className="relative mt-1">
              <select
                required
                value={formData.format}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    format: e.target.value as CompetitionFormat,
                  })
                }
                className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">Sélectionnez un format</option>
                {Object.entries(competitionFormats).map(([key, format]) => (
                  <option key={key} value={key}>
                    {format.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
            {formData.format && (
              <p className="mt-1 text-xs text-zinc-500">
                {competitionFormats[formData.format as CompetitionFormat].events.length} épreuves
                seront créées automatiquement
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre maximum d&apos;athl&egrave;tes *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.maxAthletes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxAthletes: parseInt(e.target.value) || 10,
                })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

