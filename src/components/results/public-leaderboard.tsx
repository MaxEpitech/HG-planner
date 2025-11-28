"use client";

import Link from "next/link";

import { TopNav } from "@/components/public/top-nav";

type Group = {
  id: string;
  name: string;
  category: string;
  competition: {
    id: string;
    name: string;
  };
  events: Array<{
    id: string;
    name: string;
    order: number;
    results: Array<{
      id: string;
      rank: number;
      points: number;
      performance: string | null;
      athlete: {
        id: string;
        firstName: string;
        lastName: string;
        club: string | null;
      };
    }>;
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
    performance: string | null;
  }>;
};

type PublicLeaderboardProps = {
  group: Group;
  leaderboard: LeaderboardEntry[];
};

export function PublicLeaderboard({ group, leaderboard }: PublicLeaderboardProps) {
  const podium = leaderboard.slice(0, 3);
  const hasResults = leaderboard.length > 0;
  const eventCount = group.events.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link
            href="/resultats"
            className="font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            ← Retour aux résultats
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-emerald-200">
            {group.category}
          </span>
        </div>

        <section className="rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
            {group.competition.name}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{group.name}</h1>
          <p className="mt-2 text-sm text-slate-300">
            {leaderboard.length} athlète{leaderboard.length > 1 ? "s" : ""} · {eventCount} épreuve
            {eventCount > 1 ? "s" : ""}
          </p>
        </section>

        {!hasResults ? (
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">Résultats à venir</h2>
            <p className="mt-3 text-sm text-slate-300">
              Les résultats seront publiés dès la fin des épreuves.
            </p>
          </div>
        ) : (
          <>
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-white">Podium & classement</h2>
                <p className="text-sm text-slate-400">
                  Inverse scoring · moins de points = meilleur classement
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {podium.map((entry, index) => (
                  <div
                    key={entry.athlete.id}
                    className={`relative overflow-hidden rounded-[28px] border p-6 shadow-lg ${
                      index === 0
                        ? "border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10"
                        : index === 1
                          ? "border-zinc-200/30 bg-white/5"
                          : "border-amber-300/40 bg-amber-500/10"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {index === 0 ? "1er" : `${index + 1}e`}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {entry.athlete.firstName} {entry.athlete.lastName}
                    </h3>
                    {entry.athlete.club && (
                      <p className="text-xs text-slate-300">{entry.athlete.club}</p>
                    )}
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {entry.totalPoints}
                      <span className="text-base text-slate-300"> pts</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {entry.eventsCompleted}/{entry.totalEvents} épreuves complétées
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="divide-y divide-white/5">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.athlete.id}
                      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                            index === 0
                              ? "bg-emerald-500 text-white"
                              : index === 1
                                ? "bg-slate-400 text-white"
                                : index === 2
                                  ? "bg-amber-500 text-white"
                                  : "bg-white/10 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {entry.athlete.firstName} {entry.athlete.lastName}
                          </p>
                          <p className="text-xs text-slate-300">
                            {entry.eventsCompleted}/{entry.totalEvents} épreuves
                          </p>
                          {entry.athlete.club && (
                            <p className="text-xs text-slate-500">{entry.athlete.club}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-white">{entry.totalPoints}</p>
                        <p className="text-xs text-slate-300">points cumulés</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">Résultats par épreuve</h2>
              <div className="space-y-4">
                {group.events.map((event) => {
                  if (event.results.length === 0) {
                    return null;
                  }

                  return (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
                        <p className="font-semibold text-white">
                          {event.order}. {event.name}
                        </p>
                        <p>
                          {event.results.length} participant
                          {event.results.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {event.results.map((result) => (
                          <div
                            key={result.id}
                            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-base font-semibold text-emerald-300">
                                {result.rank}
                                {result.rank === 1 ? "er" : "e"}
                              </span>
                              <div>
                                <p className="font-semibold">
                                  {result.athlete.firstName} {result.athlete.lastName}
                                </p>
                                <div className="text-xs text-slate-300">
                                  {result.athlete.club && <span>{result.athlete.club} · </span>}
                                  {result.performance ? (
                                    <span>{result.performance}</span>
                                  ) : (
                                    <span>Performance à venir</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-300">
                              {result.points} pt{result.points > 1 ? "s" : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
