"use client";

import Link from "next/link";

type HeroStats = {
  totalCompetitions: number;
  totalResults: number;
  totalAthletes?: number;
  totalRegistrations?: number;
};

type HeroSectionProps = {
  stats: HeroStats;
};

const formatter = new Intl.NumberFormat("fr-FR");

export function HeroSection({ stats }: HeroSectionProps) {
  const competitionsCount = formatter.format(stats.totalCompetitions ?? 0);
  const athleteCount = formatter.format(
    stats.totalAthletes ?? stats.totalRegistrations ?? 0
  );
  const resultsCount = formatter.format(stats.totalResults ?? 0);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white.shadow-2xl">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-400 blur-[180px]" />
        <div className="absolute right-[-10%] top-[-20%] h-80 w-80 rounded-full bg-cyan-400 blur-[200px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-8 py-20 lg:grid-cols-[3fr,2fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
            Highland Games            <span className="h-1 w-1 rounded-full bg-emerald-200" />
            Europe
          </span>
          <h1 className="text-5xl font-semibold leading-tight text-white">
            La plateforme officielle pour gérer vos Highland Games en Europe.
          </h1>
          <p className="text-lg text-slate-200">
            Inscriptions, configuration des groupes, gestion des rôles et publication des résultats
            en temps réel. Une seule interface pour vos équipes terrain et votre public.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
            >
              Espace organisateur
            </Link>
            <Link
              href="/resultats"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Calendrier & résultats
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur ">
          <div className="rounded-2xl border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Compétitions</p>
            <p className="text-4xl font-semibold text-white">{competitionsCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-200">Athlètes inscrits</p>
            <p className="text-4xl font-semibold text-white">{athleteCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Résultats publiés</p>
            <p className="text-4xl font-semibold text-white">{resultsCount}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

