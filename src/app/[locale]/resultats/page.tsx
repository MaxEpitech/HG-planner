import { getPublicCompetitionsWithResults } from "@/app/actions/results-public";
import { PublicResultsList } from "@/components/results/public-results-list";
import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";

export const metadata = {
  title: "Résultats - Highland Games Luzarches",
  description: "Consultez les résultats et classements des compétitions de Highland Games",
};

export default async function PublicResultsPage() {
  const result = await getPublicCompetitionsWithResults();
  const competitions = result.success ? result?.data || [] : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <PublicPageHero
          badge="Résultats"
          title="Classements, podiums et performances des Highland Games."
          description="Consultez les derniers résultats officiels, suivez les performances par groupe et revivez chaque épreuve grâce à des classements détaillés."
          actions={[
            { label: "S'inscrire à une compétition", href: "/inscriptions", variant: "secondary" },
          ]}
        />

        {!result.success ? (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-50/5 p-6 text-rose-100">
            {result.error || "Impossible de charger les résultats pour le moment."}
          </div>
        ) : competitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-300">
            <h2 className="text-2xl font-semibold text-white">Aucun résultat disponible</h2>
            <p className="mt-2 text-sm text-slate-400">
              Les compétitions sont en cours. Revenez après la publication officielle.
            </p>
          </div>
        ) : (
          <PublicResultsList competitions={competitions} />
        )}
      </main>
    </div>
  );
}
