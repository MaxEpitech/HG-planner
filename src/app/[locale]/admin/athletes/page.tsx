import { getRegistrations } from "@/app/actions/registrations-admin";
import { getCompetitions } from "@/app/actions/competitions";
import { RegistrationsManagement } from "@/components/registrations/registrations-management";

export default async function AdminAthletesPage() {
  const [registrationsResult, competitionsResult] = await Promise.all([
    getRegistrations(),
    getCompetitions(),
  ]);

  if (!registrationsResult.success) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            Inscriptions
          </p>
          <h1 className="text-2xl font-semibold">Athlètes</h1>
        </header>
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {registrationsResult.error}
        </div>
      </div>
    );
  }

  const registrations = registrationsResult.data || [];
  const competitions = competitionsResult.success
    ? competitionsResult.data || []
    : [];

  return (
    <RegistrationsManagement
      registrations={registrations}
      competitions={competitions}
    />
  );
}
