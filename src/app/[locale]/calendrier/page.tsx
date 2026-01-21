import { getPublicCompetitions } from "@/app/actions/registrations";
import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";
import { CompetitionCalendar } from "@/components/calendar/competition-calendar";

export const metadata = {
  title: "Calendrier - Highland Games Luzarches",
  description: "Consultez le calendrier des compétitions et les ouvertures d'inscriptions.",
};

export default async function CalendarPage() {
  const result = await getPublicCompetitions();

  const competitions = result.success ? result.data ?? [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <PublicPageHero
          badge="Calendrier"
          title="Planifiez votre saison Highland Games."
          description="Visualisez les événements à venir, leurs périodes d'inscriptions et les capacités restantes. Passez en mode liste pour accéder aux détails complets."
          actions={[
            { label: "Voir les inscriptions ouvertes", href: "/inscriptions" },
            { label: "Consulter les résultats", href: "/resultats", variant: "secondary" },
          ]}
        />

        {!result.success ? (
          <div className="rounded-[32px] border border-rose-500/30 bg-rose-500/10 p-8 text-rose-100">
            {result.error || "Impossible de charger le calendrier pour le moment."}
          </div>
        ) : (
          <CompetitionCalendar competitions={competitions} />
        )}
      </main>
    </div>
  );
}

