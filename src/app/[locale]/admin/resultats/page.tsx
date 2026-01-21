import { getCompetitions } from "@/app/actions/competitions";
import { ResultsOverview } from "@/components/results/results-overview";

export default async function AdminResultsPage() {
  const result = await getCompetitions();

  if (!result.success) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            Scoring
          </p>
          <h1 className="text-2xl font-semibold">Résultats & classements</h1>
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
          Scoring
        </p>
        <h1 className="text-2xl font-semibold">Résultats & classements</h1>
        <p className="text-sm text-zinc-500">
          Saisissez les classements par épreuve, nous calculons les points
          cumulés (score minimal gagnant).
        </p>
      </header>

      <ResultsOverview competitions={competitions} />
    </div>
  );
}
