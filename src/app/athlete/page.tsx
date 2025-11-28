import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import {
  getAthleteProfileForUser,
  getAthleteRegistrations,
  getAthleteResults,
  getAthleteRecords,
  getPersonalRecords,
} from "@/app/actions/athletes";
import { AthleteDashboard } from "@/components/athlete/athlete-dashboard";

export default async function AthleteDashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ATHLETE") {
    redirect("/admin");
  }

  const [profileResult, registrationsResult, resultsResult, recordsResult, personalRecordsResult] =
    await Promise.all([
      getAthleteProfileForUser(session.user.id),
      getAthleteRegistrations(),
      getAthleteResults(),
      getAthleteRecords(),
      getPersonalRecords(),
    ]);

  const athlete = profileResult.success ? profileResult.data : null;
  const registrations = registrationsResult.success
    ? registrationsResult.data || []
    : [];
  const results = resultsResult.success ? resultsResult.data : null;
  const records = recordsResult.success ? recordsResult.data : null;
  const personalRecords = personalRecordsResult.success
    ? personalRecordsResult.data || []
    : [];

  return (
    <AthleteDashboard
      athlete={athlete}
      registrations={registrations}
      results={results}
      records={records}
      personalRecords={personalRecords}
      user={session.user}
    />
  );
}
