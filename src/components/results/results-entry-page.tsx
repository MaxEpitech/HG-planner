"use client";

import { useState } from "react";
import Link from "next/link";
import { bulkCreateResults } from "@/app/actions/results";
import { useRouter } from "next/navigation";

type Competition = {
  id: string;
  name: string;
};

type Group = {
  id: string;
  name: string;
  category: string;
  events: Array<{
    id: string;
    name: string;
    order: number;
    _count: {
      results: number;
    };
  }>;
  registrations: Array<{
    id: string;
    athlete: {
      id: string;
      firstName: string;
      lastName: string;
      club: string | null;
    };
  }>;
};

type LeaderboardEntry = {
  athlete: {
    id: string;
    firstName: string;
    lastName: string;
    club: string | null;
  };
  totalPoints: number;
  eventsCompleted: number;
  totalEvents: number;
  results: Array<{
    eventName: string;
    rank: number;
    points: number;
  }>;
};

type ResultsEntryPageProps = {
  competition: Competition;
  group: Group;
  leaderboard: LeaderboardEntry[];
};

export function ResultsEntryPage({
  competition,
  group,
  leaderboard,
}: ResultsEntryPageProps) {
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    group.events?.[0]?.id || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedEvent = group.events?.find((e) => e.id === selectedEventId);

  const handleSubmitResults = async (
    eventId: string,
    results: Array<{ athleteId: string; rank: number; performance?: string }>
  ) => {
    setError("");
    setLoading(true);

    try {
      const result = await bulkCreateResults({
        eventId,
        results,
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
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/resultats"
          className="mb-4 inline-block text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          ← Retour aux résultats
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          {competition.name}
        </p>
        <h1 className="text-2xl font-semibold">
          {group.name} - {group.category}
        </h1>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Saisie des résultats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Saisir les résultats</h2>

          {!group.events || group.events.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500">
                Aucune épreuve configurée pour ce groupe.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Sélectionner une épreuve
                </label>
                <select
                  value={selectedEventId || ""}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  {(group.events || []).map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.order}. {event.name} (
                      {event._count.results > 0
                        ? `${event._count.results} résultat${event._count.results > 1 ? "s" : ""}`
                        : "Aucun résultat"}
                      )
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && (
                <EventResultsForm
                  event={selectedEvent}
                  athletes={(group.registrations || []).map((r) => r.athlete)}
                  onSubmit={handleSubmitResults}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>

        {/* Classement */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Classement</h2>
          {leaderboard.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500">
                Aucun résultat saisi pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.athlete.id}
                  className={`rounded-lg border p-4 ${
                    index === 0
                      ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                      : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {index + 1}. {entry.athlete.firstName}{" "}
                        {entry.athlete.lastName}
                      </p>
                      {entry.athlete.club && (
                        <p className="text-xs text-zinc-500">
                          {entry.athlete.club}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-zinc-400">
                        {entry.eventsCompleted}/{entry.totalEvents} épreuve
                        {entry.totalEvents > 1 ? "s" : ""} complétée
                        {entry.totalEvents > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold">
                        {entry.totalPoints}
                      </p>
                      <p className="text-xs text-zinc-500">points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type EventResultsFormProps = {
  event: {
    id: string;
    name: string;
  };
  athletes: Array<{
    id: string;
    firstName: string;
    lastName: string;
    club: string | null;
  }>;
  onSubmit: (
    eventId: string,
    results: Array<{ athleteId: string; rank: number; performance?: string }>
  ) => Promise<void>;
  loading: boolean;
};

function EventResultsForm({
  event,
  athletes,
  onSubmit,
  loading,
}: EventResultsFormProps) {
  const [results, setResults] = useState<
    Array<{ athleteId: string; rank: number; performance: string }>
  >(
    athletes.map((athlete, index) => ({
      athleteId: athlete.id,
      rank: index + 1,
      performance: "",
    }))
  );

  const handleRankChange = (athleteId: string, newRank: number) => {
    // Échanger les rangs si nécessaire
    const updatedResults = [...results];
    const currentIndex = updatedResults.findIndex(
      (r) => r.athleteId === athleteId
    );
    const existingIndex = updatedResults.findIndex((r) => r.rank === newRank);

    if (existingIndex !== -1 && existingIndex !== currentIndex) {
      updatedResults[existingIndex].rank = updatedResults[currentIndex].rank;
    }

    updatedResults[currentIndex].rank = newRank;
    setResults(updatedResults);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      event.id,
      results.map((r) => ({
        athleteId: r.athleteId,
        rank: r.rank,
        performance: r.performance || undefined,
      }))
    );
  };

  // Trier les résultats par rang
  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="mb-4 font-semibold">{event.name}</h3>
        <div className="space-y-2">
          {sortedResults.map((result) => {
            const athlete = athletes.find((a) => a.id === result.athleteId);
            if (!athlete) return null;

            return (
              <div
                key={result.athleteId}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <input
                  type="number"
                  min="1"
                  max={athletes.length}
                  value={result.rank}
                  onChange={(e) =>
                    handleRankChange(
                      result.athleteId,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                />
                <span className="flex-1 text-sm">
                  {athlete.firstName} {athlete.lastName}
                  {athlete.club && (
                    <span className="text-zinc-500"> ({athlete.club})</span>
                  )}
                </span>
                <input
                  type="text"
                  placeholder="Performance"
                  value={result.performance}
                  onChange={(e) => {
                    const updated = results.map((r) =>
                      r.athleteId === result.athleteId
                        ? { ...r, performance: e.target.value }
                        : r
                    );
                    setResults(updated);
                  }}
                  className="w-24 rounded border border-zinc-300 bg-white px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enregistrement..." : "Enregistrer les résultats"}
      </button>
    </form>
  );
}

