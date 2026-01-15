import Link from "next/link";
import { HeroSection } from "@/components/public/hero-section";
import { FeatureGrid } from "@/components/public/feature-grid";
import { TopNav } from "@/components/public/top-nav";
import { UpcomingCompetitionsSection } from "@/components/public/upcoming-competitions";
import { OrganizerHighlights } from "@/components/public/organizer-highlights";
import { getPublicStats } from "@/app/actions/public-stats";
import { getPublicCompetitions } from "@/app/actions/registrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-transparent text-foreground">
      <TopNav />
      <main>
        <HeroSection stats={heroStats} />

        <div className="mx-auto flex flex-col gap-24 px-6 py-24 max-w-7xl">
            <UpcomingCompetitionsSection competitions={upcomingCompetitions} />

            <FeatureGrid
              title="Pour les athlètes & le public"
              features={athleteFeatures}
            />

            <OrganizerHighlights />

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12 text-center">
                <Card className="relative overflow-hidden border-emerald-100 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950">
                    <CardContent className="p-10 flex flex-col items-center justify-center h-full space-y-6">
                         <div className="space-y-2">
                             <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-bold">
                                Vous êtes athlète ?
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Rejoignez la compétition
                            </h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Inscrivez-vous, suivez vos performances et accédez à vos records en un clic.
                            </p>
                         </div>
                         <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                <Link href="/athlete/inscription">
                                    Créer mon compte
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full">
                                <Link href="/login">
                                    Se connecter
                                </Link>
                            </Button>
                         </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <CardContent className="p-10 flex flex-col items-center justify-center h-full space-y-6">
                         <div className="space-y-2">
                             <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold">
                                Organisateur
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Gérez vos événements
                            </h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Une suite d&apos;outils complète pour vos Highland Games : inscriptions, groupes, résultats.
                            </p>
                         </div>
                         <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
                                <Link href="/admin">
                                    Interface organisateur
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full">
                                <Link href="/inscriptions">
                                    Inscriptions
                                </Link>
                            </Button>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
