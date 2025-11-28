import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type UpcomingCompetition = {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  remainingSpots: number;
  totalSpots: number;
};

type UpcomingCompetitionsSectionProps = {
  competitions: UpcomingCompetition[];
};

export function UpcomingCompetitionsSection({
  competitions,
}: UpcomingCompetitionsSectionProps) {
  return (
    <section className="mt-6 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            Calendrier
          </p>
          <h2 className="text-2xl font-semibold">Prochaines compétitions</h2>
        </div>
        <Link
          href="/calendrier"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
        >
          Voir tout le calendrier →
        </Link>
      </div>
      {competitions.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Aucun événement à venir pour le moment. Revenez bientôt !
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {competitions.map((competition) => (
            <article
              key={competition.id}
              className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                {format(competition.startDate, "d MMM yyyy", { locale: fr })}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{competition.name}</h3>
              <p className="text-sm text-zinc-500">{competition.location}</p>
              <p className="mt-3 text-xs text-zinc-400">
                {competition.remainingSpots > 0
                  ? `${competition.remainingSpots} place${
                      competition.remainingSpots > 1 ? "s" : ""
                    } disponibles / ${competition.totalSpots}`
                  : `Complet (${competition.totalSpots})`}
              </p>
              <Link
                href={`/inscriptions/${competition.id}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500"
              >
                S&apos;inscrire →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

