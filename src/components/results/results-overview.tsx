"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Competition = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  groups: Array<{
    id: string;
    name: string;
    category: string;
    events: Array<{
      id: string;
      name: string;
      _count: {
        results: number;
      };
    }>;
  }>;
};

type ResultsOverviewProps = {
  competitions: Competition[];
};

export function ResultsOverview({ competitions }: ResultsOverviewProps) {
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "d MMMM yyyy", { locale: fr });
    } catch {
      return new Date(date).toLocaleDateString("fr-FR");
    }
  };

  if (competitions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center dark:border-zinc-700 dark:bg-transparent">
        <p className="text-lg font-semibold">Aucune compétition</p>
        <p className="mt-2 text-sm text-zinc-500">
          Créez une compétition pour commencer à saisir les résultats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {competitions.map((competition) => (
        <article
          key={competition.id}
          className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{competition.name}</h2>
            <p className="text-sm text-zinc-500">
              {formatDate(competition.startDate)}
              {competition.startDate.getTime() !==
                competition.endDate.getTime() && (
                <> - {formatDate(competition.endDate)}</>
              )}
            </p>
          </div>

          <div className="space-y-3">
            {(competition.groups || []).map((group) => (
              <div
                key={group.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-xs text-zinc-500">{group.category}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {group.events.length} épreuve
                      {group.events.length > 1 ? "s" : ""} configurée
                      {group.events.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/admin/resultats/${competition.id}/${group.id}`}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                  >
                    Saisir les résultats
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

