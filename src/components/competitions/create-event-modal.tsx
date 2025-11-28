"use client";

import { useState, useEffect } from "react";
import { createEvent, getEvents } from "@/app/actions/events";
import { useRouter } from "next/navigation";

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
};

export function CreateEventModal({
  isOpen,
  onClose,
  groupId,
}: CreateEventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextOrder, setNextOrder] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    order: 1,
  });

  useEffect(() => {
    if (isOpen && groupId) {
      // Récupérer le prochain ordre disponible
      getEvents(groupId).then((result) => {
        if (result.success && result.data) {
          const maxOrder = result.data.reduce(
            (max, event) => Math.max(max, event.order),
            0
          );
          setNextOrder(maxOrder + 1);
          setFormData({ name: "", order: maxOrder + 1 });
        }
      });
    }
  }, [isOpen, groupId]);

  if (!isOpen || !groupId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createEvent({
        ...formData,
        groupId,
        order: Number(formData.order),
      });

      if (result.success) {
        router.refresh();
        onClose();
        setFormData({ name: "", order: nextOrder });
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
          <h2 className="text-xl font-semibold">Nouvelle épreuve</h2>
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
              Nom de l&apos;&eacute;preuve *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ex: Lancer de pierre, Toss du caber&hellip;"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Ordre *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 1,
                })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Ordre d&apos;ex&eacute;cution de l&apos;&eacute;preuve dans le groupe
            </p>
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

