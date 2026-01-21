import { getPendingOrganizers, approveOrganizer, rejectOrganizer } from "@/app/actions/organizers";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { PendingOrganizersList } from "@/components/organizer/pending-organizers-list";

export default async function PendingOrganizersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PLATFORM_ADMIN") {
    redirect("/admin");
  }

  const result = await getPendingOrganizers();

  if (!result.success) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            Validation
          </p>
          <h1 className="text-2xl font-semibold">Comptes organisateurs en attente</h1>
        </header>
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {result.error}
        </div>
      </div>
    );
  }

  const pendingOrganizers = result.data || [];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          Validation
        </p>
        <h1 className="text-2xl font-semibold">Comptes organisateurs en attente</h1>
        <p className="text-sm text-zinc-500">
          Validez ou rejetez les demandes de compte organisateur.
        </p>
      </header>

      <PendingOrganizersList
        organizers={pendingOrganizers}
        onApprove={approveOrganizer}
        onReject={rejectOrganizer}
      />
    </div>
  );
}

