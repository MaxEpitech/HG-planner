import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getCompetitions } from "@/app/actions/competitions";

export const metadata = {
  title: "Tableau de bord - Highland Games Luzarches",
  description: "Gérez vos compétitions, inscriptions et résultats",
};

function formatDate(date: Date) {
  try {
    return format(new Date(date), "d MMMM yyyy", { locale: fr });
  } catch {
    return new Date(date).toLocaleDateString("fr-FR");
  }
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Brouillon",
    open: "Ouverte",
    published: "Publiée",
    closed: "Fermée",
  };
  return labels[status] || status;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    open: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    published: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    closed: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  };
  return colors[status] || colors.draft;
}

export default async function AdminDashboardPage() {
  const statsResult = await getDashboardStats();
  const competitionsResult = await getCompetitions();

  if (!statsResult.success || !competitionsResult.success) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="mt-2 text-sm">
            {statsResult.error || competitionsResult.error || "Une erreur est survenue"}
          </p>
        </div>
      </div>
    );
  }

  const stats = statsResult.data!;
  const competitions = competitionsResult.data || [];

  // Calculer les actions prioritaires
  const needsGroups = competitions.some((c) => c._count.groups === 0);
  const needsResults = competitions.some((c) =>
    c.groups.some((g) =>
      g.events.some((e) => e._count.results === 0 && g._count.registrations > 0)
    )
  );

  const nextSteps = [
    {
      title: "Configurer les groupes",
      description: needsGroups
        ? "Ajoutez des groupes à vos compétitions"
        : "Tous les groupes sont configurés",
      href: "/admin/competitions",
      urgent: needsGroups,
    },
    {
      title: "Valider les inscriptions",
      description:
        stats.pendingRegistrations > 0
          ? `${stats.pendingRegistrations} inscription${stats.pendingRegistrations > 1 ? "s" : ""} en attente`
          : "Aucune inscription en attente",
      href: "/admin/athletes",
      urgent: stats.pendingRegistrations > 0,
    },
    {
      title: "Saisir les résultats",
      description: needsResults
        ? "Des résultats sont à enregistrer"
        : "Tous les résultats sont saisis",
      href: "/admin/resultats",
      urgent: needsResults,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero - Prochaine compétition */}
      {stats.nextCompetition ? (
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-400 blur-[180px]" />
            <div className="absolute right-[-10%] top-[-20%] h-80 w-80 rounded-full bg-cyan-400 blur-[200px]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-8 py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                  Prochaine compétition
                </span>
                <h1 className="text-4xl font-semibold">{stats.nextCompetition.name}</h1>
                <div className="space-y-2 text-slate-300">
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-400">📍</span>
                    {stats.nextCompetition.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-400">📅</span>
                    {formatDate(stats.nextCompetition.startDate)}
                    {stats.nextCompetition.startDate.getTime() !==
                      stats.nextCompetition.endDate.getTime() && (
                      <> - {formatDate(stats.nextCompetition.endDate)}</>
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-400">👥</span>
                    {stats.nextCompetition.groupsCount} groupe
                    {stats.nextCompetition.groupsCount > 1 ? "s" : ""} configuré
                    {stats.nextCompetition.groupsCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/admin/competitions/${stats.nextCompetition.id}`}
                  className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
                >
                  Gérer la compétition
                </Link>
                <Link
                  href="/admin/resultats"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Saisir les résultats
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-400 blur-[180px]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-8 py-12">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                Tableau de bord
              </span>
              <h1 className="text-4xl font-semibold">Aucune compétition à venir</h1>
              <p className="text-slate-300">
                Créez votre première compétition pour commencer à gérer vos événements.
              </p>
              <Link
                href="/admin/competitions"
                className="inline-block rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                Créer une compétition
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">
            Compétitions actives
          </p>
          <p className="mt-2 text-4xl font-semibold text-zinc-900 dark:text-white">
            {stats.activeCompetitions}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-300">
            {competitions.length} au total
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-600 dark:text-violet-200">
            Inscriptions en attente
          </p>
          <p className="mt-2 text-4xl font-semibold text-zinc-900 dark:text-white">
            {stats.pendingRegistrations}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-300">à valider</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-200">
            Athlètes inscrits
          </p>
          <p className="mt-2 text-4xl font-semibold text-zinc-900 dark:text-white">
            {stats.totalRegistrations}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-300">
            {stats.availableSpots > 0
              ? `${stats.availableSpots} place${stats.availableSpots > 1 ? "s" : ""} disponible${stats.availableSpots > 1 ? "s" : ""}`
              : "Complet"}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-200">
            Résultats publiés
          </p>
          <p className="mt-2 text-4xl font-semibold text-zinc-900 dark:text-white">
            {stats.totalResults}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-300">enregistrés</p>
        </div>
      </section>

      {/* Compétitions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Vos compétitions
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Gérez vos événements, groupes et inscriptions
          </p>
        </div>
        {competitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="text-lg font-semibold">Aucune compétition</p>
            <p className="mt-2 text-sm text-zinc-500">
              Créez votre première compétition pour commencer
            </p>
            <Link
              href="/admin/competitions"
              className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Créer une compétition
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {competitions.slice(0, 6).map((competition) => (
              <Link
                key={competition.id}
                href={`/admin/competitions/${competition.id}`}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400">
                      {competition.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{competition.location}</p>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatDate(competition.startDate)}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                      <span>{competition._count.groups} groupe{competition._count.groups > 1 ? "s" : ""}</span>
                      <span>
                        {competition.groups.reduce(
                          (sum, g) => sum + g._count.registrations,
                          0
                        )}{" "}
                        inscription
                        {competition.groups.reduce(
                          (sum, g) => sum + g._count.registrations,
                          0
                        ) !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(competition.status)}`}
                  >
                    {getStatusLabel(competition.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {competitions.length > 6 && (
          <div className="text-center">
            <Link
              href="/admin/competitions"
              className="inline-block rounded-full border border-zinc-300 px-6 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Voir toutes les compétitions ({competitions.length})
            </Link>
          </div>
        )}
      </section>

      {/* Checklist */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Actions prioritaires
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Les prochaines étapes pour vos compétitions
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((step) => (
            <Link
              key={step.title}
              href={step.href}
              className={`group rounded-2xl border p-6 text-sm transition ${
                step.urgent
                  ? "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                  : "border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    step.urgent
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {step.urgent ? "!" : "✓"}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      step.urgent
                        ? "text-emerald-400"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      step.urgent
                        ? "text-emerald-300"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
