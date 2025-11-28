import Link from "next/link";
import { HeroSection } from "@/components/public/hero-section";
import { FeatureGrid } from "@/components/public/feature-grid";
import { TopNav } from "@/components/public/top-nav";
import { UpcomingCompetitionsSection } from "@/components/public/upcoming-competitions";
import { OrganizerHighlights } from "@/components/public/organizer-highlights";
import { getPublicStats } from "@/app/actions/public-stats";
import { getPublicCompetitions } from "@/app/actions/registrations";

const athleteFeatures = [
  {
    title: "Parcours d'inscription clair",
    description:
      "Choix des groupes, suivi du statut, confirmations en temps réel.",
    badge: "Athlètes",
  },
  {
    title: "Profil complet",
    description: "Club, catégorie, records : toutes vos infos centralisées.",
  },
  {
    title: "Résultats publics",
    description: "Classements mis à jour après chaque épreuve.",
  },
];

export default async function Home() {
  const [statsResult, competitionsResult] = await Promise.all([
    getPublicStats(),
    getPublicCompetitions(),
  ]);

  const heroStats =
    statsResult.success && statsResult.data
      ? statsResult.data
      : {
          totalCompetitions: 0,
          activeCompetitions: 0,
          totalResults: 0,
          totalAthletes: 0,
        };

  const now = new Date();
  const upcomingCompetitions =
    competitionsResult.success && competitionsResult.data
      ? competitionsResult.data
          .filter((competition) => new Date(competition.startDate) >= now)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          .slice(0, 3)
          .map((competition) => {
            const totalSpots = competition.groups.reduce(
              (sum, group) => sum + group.maxAthletes,
              0
            );
            const registrations = competition.groups.reduce(
              (sum, group) => sum + group._count.registrations,
              0
            );

            return {
              id: competition.id,
              name: competition.name,
              location: competition.location,
              startDate: new Date(competition.startDate),
              remainingSpots: Math.max(0, totalSpots - registrations),
              totalSpots,
            };
          })
      : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfccb,_#ecfdf5,_#f8fafc)] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <TopNav />
      <main className="">
        <HeroSection stats={heroStats} />

        <div className="mx-auto flex flex-col gap-16 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <UpcomingCompetitionsSection competitions={upcomingCompetitions} />

            <FeatureGrid
              title="Pour les athlètes & le public"
              features={athleteFeatures}
            />

            <OrganizerHighlights />

            <section className="mt-6 rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                Vous êtes athlète ?
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Créez votre compte et suivez vos compétitions
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Inscrivez-vous rapidement, consultez vos résultats et vos
                records en temps réel.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/athlete/inscription"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Créer mon compte athlète
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Se connecter
                </Link>
              </div>
            </section>

            <section className="mt-6 rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                Organisateur
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Lancez votre prochaine compétition en quelques minutes.
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Configurez vos groupes, envoyez vos invitations et partagez les
                résultats en direct.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/admin"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Accéder à l&apos;interface organisateur
                </Link>
                <Link
                  href="/inscriptions"
                  className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Préparer les inscriptions
                </Link>
                <Link
                  href="/resultats"
                  className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Voir les résultats
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
