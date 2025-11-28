import { getPublicCompetitions } from "@/app/actions/registrations";
import { PublicCompetitionList } from "@/components/inscriptions/public-competition-list";
import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";

export const metadata = {
  title: "Inscriptions - Highland Games Luzarches",
  description: "Inscrivez-vous aux compétitions de Highland Games",
};

export default async function InscriptionsPage() {
  const result = await getPublicCompetitions();
  const competitions = result.success ? result.data || [] : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <PublicPageHero
          badge="Inscriptions"
          title="Choisissez votre compétition, réservez votre place et rejoignez l'arène."
          description="Toutes les inscriptions officielles des Highland Games de Luzarches. Sélectionnez votre catégorie, consultez les places disponibles et confirmez votre participation en quelques minutes."
          actions={[
            { label: "Voir le calendrier", href: "/resultats", variant: "secondary" },
          ]}
        />

        {!result.success ? (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-50/5 p-6 text-rose-100">
            {result.error || "Une erreur est survenue. Réessayez plus tard."}
          </div>
        ) : competitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-300">
            <h2 className="text-2xl font-semibold text-white">Aucune compétition ouverte</h2>
            <p className="mt-2 text-sm text-slate-400">
              Les inscriptions n&apos;ont pas encore commencé. Revenez très prochainement !
            </p>
          </div>
        ) : (
          <PublicCompetitionList competitions={competitions} />
        )}
      </main>
    </div>
  );
}
