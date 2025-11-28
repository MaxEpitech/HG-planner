"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Competition = {
  id: string;
  name: string;
  description: string | null;
  location: string;
  startDate: Date;
  endDate: Date;
  groups: Array<{
    id: string;
    name: string;
    category: string;
    maxAthletes: number;
    _count: {
      registrations: number;
    };
  }>;
};

type PublicCompetitionListProps = {
  competitions: Competition[];
};

export function PublicCompetitionList({ competitions }: PublicCompetitionListProps) {
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "d MMMM yyyy", { locale: fr });
    } catch {
      return new Date(date).toLocaleDateString("fr-FR");
    }
  };

  const getAvailableSpots = (group: Competition["groups"][0]) => {
    return Math.max(0, group.maxAthletes - group._count.registrations);
  };

  const getTotalAvailableSpots = (competition: Competition) => {
    return competition.groups.reduce(
      (sum, group) => sum + getAvailableSpots(group),
      0
    );
  };

  return (
    <div className="space-y-8">
      {competitions.map((competition) => {
        const totalAvailable = getTotalAvailableSpots(competition);
        const hasAvailableSpots = totalAvailable > 0;

        return (
          <article
            key={competition.id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                  {formatDate(competition.startDate)} · {competition.location}
                </p>
                <h2 className="text-2xl font-semibold">{competition.name}</h2>
                {competition.description ? (
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {competition.description}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                    {competition.groups.length} groupes
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                    {totalAvailable} places restantes
                  </span>
                </div>
              </div>
              <Link
                href={`/inscriptions/${competition.id}`}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  hasAvailableSpots
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {hasAvailableSpots ? "S'inscrire" : "Complet"}
              </Link>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {competition.groups.map((group) => {
                const available = getAvailableSpots(group);
                const isFull = available === 0;
                return (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{group.name}</p>
                        <p className="text-xs text-slate-500">{group.category}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isFull
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                        }`}
                      >
                        {isFull ? "Complet" : `${available} place${available > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
}

