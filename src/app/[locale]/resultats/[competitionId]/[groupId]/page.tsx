import { notFound } from "next/navigation";
import { getPublicLeaderboardForGroup } from "@/app/actions/results-public";
import { PublicLeaderboard } from "@/components/results/public-leaderboard";

export const metadata = {
  title: "Classement - Highland Games Luzarches",
  description: "Classement détaillé du groupe",
};

export default async function PublicGroupLeaderboardPage({
  params,
}: {
  params: Promise<{ competitionId: string; groupId: string }>;
}) {
  const { groupId } = await params;
  const result = await getPublicLeaderboardForGroup(groupId);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <PublicLeaderboard
      group={result.data.group}
      leaderboard={result.data.leaderboard}
    />
  );
}


