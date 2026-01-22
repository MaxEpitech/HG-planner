"use client";

import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Competition = {
  id: string;
  name: string;
  location: string;
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
    _count: {
      registrations: number;
    };
  }>;
};

type PublicResultsListProps = {
  competitions: Competition[];
};

export function PublicResultsList({ competitions }: PublicResultsListProps) {
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "d MMMM yyyy", { locale: fr });
    } catch {
      return new Date(date).toLocaleDateString("fr-FR");
    }
  };

  const getTotalResults = (competition: Competition) => {
    return competition.groups.reduce((total, group) => {
      return (
        total +
        group.events.reduce((sum, event) => sum + event._count.results, 0)
      );
    }, 0);
  };

  return (
    <div className="space-y-8">
      {competitions.map((competition) => {
        const totalResults = getTotalResults(competition);

        return (
          <article
            key={competition.id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-600">
                  {formatDate(competition.startDate)} · {competition.location}
                </p>
                <h2 className="text-2xl font-semibold">{competition.name}</h2>
                <p className="text-sm text-slate-500">
                  {totalResults} résultat{totalResults > 1 ? "s" : ""} publiés
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {competition.groups.length} groupes
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {competition.groups.map((group) => {
                const groupResults = group.events.reduce(
                  (sum, event) => sum + event._count.results,
                  0
                );

                if (groupResults === 0) {
                  return null;
                }

                return (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {group.name}
                        </p>
                        <p className="text-xs text-slate-500">{group.category}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {groupResults} résultat{groupResults > 1 ? "s" : ""}
                        </p>
                      </div>
                      <Link
                        href={`/resultats/${competition.id}/${group.id}`}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                      >
                        Voir le classement
                      </Link>
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


