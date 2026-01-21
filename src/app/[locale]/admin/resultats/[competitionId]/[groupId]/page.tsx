import { notFound } from "next/navigation";
import { getCompetition } from "@/app/actions/competitions";
import { getLeaderboardForGroup } from "@/app/actions/results";
import { ResultsEntryPage } from "@/components/results/results-entry-page";

export default async function GroupResultsPage({
  params,
}: {
  params: Promise<{ competitionId: string; groupId: string }>;
}) {
  const { competitionId, groupId } = await params;

  const [competitionResult, leaderboardResult] = await Promise.all([
    getCompetition(competitionId),
    getLeaderboardForGroup(groupId),
  ]);

  if (!competitionResult.success || !competitionResult.data) {
    notFound();
  }

  const group = competitionResult.data.groups.find((g) => g.id === groupId);

  if (!group) {
    notFound();
  }

  return (
    <ResultsEntryPage
      competition={competitionResult.data}
      group={group}
      leaderboard={
        leaderboardResult.success ? leaderboardResult.data || [] : []
      }
    />
  );
}

