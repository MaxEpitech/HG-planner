import { getCompetitions } from "@/app/actions/competitions";
import { CompetitionList } from "@/components/competitions/competition-list";

export default async function AdminCompetitionsPage() {
  const result = await getCompetitions();

  if (!result.success) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            Gestion
          </p>
          <h1 className="text-2xl font-semibold">Compétitions</h1>
        </header>
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {result.error}
        </div>
      </div>
    );
  }

  const competitions = result.data || [];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          Gestion
        </p>
        <h1 className="text-2xl font-semibold">Compétitions</h1>
        <p className="text-sm text-zinc-500">
          Créez des événements, configurez groupes et attribuez des responsables.
        </p>
      </header>

      <CompetitionList competitions={competitions} />
    </div>
  );
}
