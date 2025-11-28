import { notFound } from "next/navigation";
import { getCompetition } from "@/app/actions/competitions";
import { CompetitionDetail } from "@/components/competitions/competition-detail";

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCompetition(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <CompetitionDetail competition={result.data} />;
}

