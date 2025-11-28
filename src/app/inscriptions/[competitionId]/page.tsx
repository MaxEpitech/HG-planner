import { notFound } from "next/navigation";
import { getCompetitionForRegistration } from "@/app/actions/registrations";
import { getAthleteProfileForUser } from "@/app/actions/athletes";
import { getSession } from "@/lib/auth/session";
import { RegistrationForm } from "@/components/inscriptions/registration-form";

export const metadata = {
  title: "Inscription - Highland Games Luzarches",
  description: "Formulaire d'inscription à la compétition",
};

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const [competitionResult, session] = await Promise.all([
    getCompetitionForRegistration(competitionId),
    getSession(),
  ]);

  if (!competitionResult.success || !competitionResult.data) {
    notFound();
  }

  let athleteProfile = null;
  if (session?.user?.role === "ATHLETE") {
    const profileResult = await getAthleteProfileForUser(session.user.id);
    if (profileResult.success) {
      athleteProfile = profileResult.data;
    }
  }

  return (
    <RegistrationForm
      competition={competitionResult.data}
      athleteProfile={athleteProfile}
    />
  );
}

