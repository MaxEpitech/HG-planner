"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { User, PersonalRecord } from "@prisma/client";
import type {
  getAthleteProfileForUser,
  getAthleteRegistrations,
  getAthleteResults,
  getAthleteRecords,
} from "@/app/actions/athletes";
import { AthleteProfileForm } from "./athlete-profile-form";
import { PersonalRecordsForm } from "./personal-records-form";

type AthleteProfileForUser = NonNullable<
  Awaited<ReturnType<typeof getAthleteProfileForUser>>["data"]
>;

type AthleteWithRelations = AthleteProfileForUser;

type RegistrationWithRelations = Awaited<
  ReturnType<typeof getAthleteRegistrations>
>["data"] extends infer T
  ? T extends Array<infer U>
    ? U
    : never
  : never;

type ResultsData = NonNullable<
  Awaited<ReturnType<typeof getAthleteResults>>["data"]
>;

type RecordsData = NonNullable<
  Awaited<ReturnType<typeof getAthleteRecords>>["data"]
>;

type AthleteDashboardProps = {
  athlete: AthleteWithRelations | null;
  registrations: RegistrationWithRelations[];
  results: ResultsData | null;
  records: RecordsData | null;
  personalRecords: PersonalRecord[];
  user: User;
};

type Tab = "inscriptions" | "resultats" | "records" | "profil";

export function AthleteDashboard({
  athlete,
  registrations,
  results,
  records,
  personalRecords,
  user,
}: AthleteDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("inscriptions");
  const router = useRouter();

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "d MMMM yyyy", { locale: fr });
    } catch {
      return new Date(date).toLocaleDateString("fr-FR");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmée";
      case "PENDING":
        return "En attente";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "PENDING":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "CANCELLED":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "inscriptions", label: "Mes inscriptions" },
    { id: "resultats", label: "Mes résultats" },
    { id: "records", label: "Mes records" },
    { id: "profil", label: "Mon profil" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/80 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.4em] uppercase text-emerald-300"
          >
            HG EUROPE
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Espace athlète
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white">
            {athlete?.firstName} {athlete?.lastName}
          </h1>
          {athlete?.club && (
            <p className="mt-2 text-sm text-slate-400">{athlete.club}</p>
          )}
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-white/10 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-t-2xl border-b-2 px-6 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-emerald-400 text-emerald-300 bg-emerald-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          {activeTab === "inscriptions" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                Mes inscriptions
              </h2>
              {registrations.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-slate-400">
                    Vous n&apos;êtes inscrit à aucune compétition pour le moment.
                  </p>
                  <Link
                    href="/inscriptions"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Découvrir les compétitions
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {registrations.map((reg) => {
                    const comp = reg.group.competition;
                    const eventsCount = reg.group.events.length;
                    const resultsCount = reg.group.events.reduce(
                      (sum, event) => sum + event._count.results,
                      0
                    );
                    const progress =
                      eventsCount > 0
                        ? Math.round((resultsCount / eventsCount) * 100)
                        : 0;

                    return (
                      <div
                        key={reg.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-white">
                                {comp.name}
                              </h3>
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                                  reg.status
                                )}`}
                              >
                                {getStatusLabel(reg.status)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-emerald-300">
                              {comp.location}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {formatDate(comp.startDate)}
                              {new Date(comp.startDate).getTime() !==
                                new Date(comp.endDate).getTime() && (
                                <> – {formatDate(comp.endDate)}</>
                              )}
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                              Groupe : <span className="font-semibold">{reg.group.name}</span>{" "}
                              ({reg.group.category})
                            </p>
                            {eventsCount > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                  <span>Progression des résultats</span>
                                  <span>{resultsCount}/{eventsCount} épreuves</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/10">
                                  <div
                                    className="h-2 rounded-full bg-emerald-400"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {comp.status === "published" && (
                            <Link
                              href={`/resultats/${comp.id}/${reg.group.id}`}
                              className="ml-4 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              Voir résultats
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "resultats" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                Mes résultats
              </h2>
              {!results || results.all.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-slate-400">
                    Aucun résultat enregistré pour le moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {results.byCompetition.map((comp) => (
                    <div
                      key={comp.competitionId}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {comp.competitionName}
                      </h3>
                      <div className="space-y-3">
                        {comp.results.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                          >
                            <div>
                              <p className="font-semibold text-white">
                                {result.event.name}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {result.event.group.name} ({result.event.group.category})
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-emerald-300">
                                {result.rank === 1
                                  ? "🥇"
                                  : result.rank === 2
                                  ? "🥈"
                                  : result.rank === 3
                                  ? "🥉"
                                  : `#${result.rank}`}
                              </p>
                              <p className="text-xs text-slate-400">
                                {result.points} point{result.points > 1 ? "s" : ""}
                              </p>
                              {result.performance && (
                                <p className="text-xs text-slate-300 mt-1">
                                  {result.performance}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "records" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Mes records</h2>
              
              {/* Statistiques de compétition */}
              {records && records.totalEvents > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Statistiques de compétition</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Meilleur classement
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.bestRank === 1
                          ? "🥇"
                          : records.bestRank === 2
                          ? "🥈"
                          : records.bestRank === 3
                          ? "🥉"
                          : `#${records.bestRank}`}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Victoires
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.victories}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Podiums
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.podiumCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Compétitions
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.totalCompetitions}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Records personnels */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <PersonalRecordsForm
                  records={personalRecords}
                  athleteGender={athlete?.gender}
                  onRecordAdded={() => router.refresh()}
                />
              </div>

              {/* Message si aucun record du tout */}
              {(!records || records.totalEvents === 0) && personalRecords.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-slate-400">
                    Aucun résultat de compétition enregistré pour le moment.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Vos statistiques apparaîtront ici une fois que vous aurez participé à des compétitions.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "profil" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Mon profil</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <AthleteProfileForm athlete={athlete} user={user} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

