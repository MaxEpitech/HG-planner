"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
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
import { EmptyState } from "@/components/ui/empty-state";
import Image from "next/image";
import { BadgeShowcase } from "@/components/ui/badge";
import { BADGES, isBadgeUnlocked, getBadgeProgress } from "@/lib/badges";
import { PerformanceGrid } from "@/components/ui/performance-stats";
import { CompetitionTimeline, registrationsToTimeline } from "@/components/ui/timeline";
import { SmartRecommendations } from "@/components/ai/smart-recommendations";
import { PerformancePredictions } from "@/components/ai/performance-predictions";

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

import { useTranslations } from "next-intl";

// ...

function formatDate(date: Date) {
  try {
    return format(new Date(date), "d MMMM yyyy", { locale: fr });
  } catch {
    return new Date(date).toLocaleDateString("fr-FR");
  }
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    CONFIRMED: "border-emerald-500 text-emerald-500 bg-emerald-500/10",
    PENDING: "border-amber-500 text-amber-500 bg-amber-500/10",
    CANCELLED: "border-red-500 text-red-500 bg-red-500/10",
    WAITLIST: "border-slate-500 text-slate-500 bg-slate-500/10",
  };
  return colors[status] || "border-slate-500 text-slate-500 bg-slate-500/10";
}

export function AthleteDashboard({
  athlete,
  registrations,
  results,
  records,
  personalRecords,
  user,
}: AthleteDashboardProps) {
  const t = useTranslations('AthleteDashboard');
  const [activeTab, setActiveTab] = useState<Tab>("inscriptions");
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const router = useRouter();

  // ...

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return t('statusConfirmed');
      case "PENDING":
        return t('statusPending');
      case "CANCELLED":
        return t('statusCancelled');
      default:
        return status;
    }
  };

  // ...

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "inscriptions", label: t('tabRegistrations') },
    { id: "resultats", label: t('tabResults') },
    { id: "records", label: t('tabRecords') },
    { id: "profil", label: t('tabProfile') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/80 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* ... Link ... */}
            <Link
             href="/"
             className="flex items-center gap-3"
           >
             <Image 
               src="/hg_europe.png" 
               alt="Highland Games Europe" 
               width={40} 
               height={40}
               className="h-10 w-auto"
             />
           </Link>
          <div className="flex items-center gap-4">
             {/* Avatar logic unchanged */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-bold">
                  {athlete ? `${athlete.firstName?.[0] || ''}${athlete.lastName?.[0] || ''}` : user.email?.[0]?.toUpperCase()}
                </div>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            {t('athleteSpace')}
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
              {/* AI Recommendations */}
              <SmartRecommendations />

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {t('tabRegistrations')}
                </h2>
                
                {/* View toggle */}
                {registrations.length > 0 && (
                  <div className="flex gap-2 rounded-lg bg-white/5 p-1">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        viewMode === "list"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      📋 {t('viewList')}
                    </button>
                    <button
                      onClick={() => setViewMode("timeline")}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        viewMode === "timeline"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      📅 {t('viewTimeline')}
                    </button>
                  </div>
                )}
              </div>
              
              {registrations.length === 0 ? (
                <EmptyState
                  variant="competition"
                  title={t('emptyCompetitionsTitle')}
                  description={t('emptyCompetitionsDesc')}
                  action={{
                    label: t('discoverCompetitions'),
                    href: "/calendrier",
                  }}
                />
              ) : viewMode === "timeline" ? (
                <CompetitionTimeline
                  events={registrationsToTimeline(
                    registrations.map((reg) => ({
                      id: reg.id,
                      competition: {
                        name: reg.group.competition.name,
                        startDate: reg.group.competition.startDate,
                      },
                      status: reg.status,
                    }))
                  )}
                />
              ) : (
                <div className="grid gap-4">
                  {registrations.map((reg) => {
                    // ... comp, eventsCount logic ...
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
                             {/* Badge logic */}
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
                                  <span>{t('progressResults')}</span>
                                  <span>{resultsCount}/{eventsCount} {t('events')}</span>
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
                              {t('viewResults')}
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
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white">
                {t('tabResults')}
              </h2>
              {!results || results.all.length === 0 ? (
                <EmptyState
                  variant="results"
                  title={t('emptyResultsTitle')}
                  description={t('emptyResultsDesc')}
                  action={{
                    label: t('registerCompetition'),
                    href: "/calendrier",
                  }}
                />
              ) : (
                <div className="space-y-8">
                  {/* AI Predictions */}
                  <PerformancePredictions />

                  {/* Performance Overview */}
                  {records && records.totalEvents > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">{t('performanceOverview')}</h3>
                      <PerformanceGrid
                        data={{
                          bestRank: records.bestRank,
                          victories: records.victories || 0,
                          podiums: records.podiumCount || 0,
                          averageRank: records.totalEvents > 0
                            ? results.all.reduce((sum, r) => sum + r.rank, 0) / results.all.length
                            : null,
                          totalEvents: records.totalEvents || 0,
                        }}
                      />
                    </div>
                  )}

                  {/* Results by Competition */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">{t('resultsByCompetition')}</h3>
                    <div className="space-y-6">
                      {results.byCompetition.map((comp) => {
                        const compDate = new Date(comp.competitionDate);
                        const isPast = compDate < new Date();
                        
                        return (
                          <div
                            key={comp.competitionId}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-white">
                                  {comp.competitionName}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">
                                  {format(compDate, "d MMMM yyyy", { locale: fr })}
                                </p>
                              </div>
                              
                              {/* Certificate download button */}
                              {isPast && (
                                <button
                                  onClick={() => {
                                    // Generate certificate
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return;
                                    
                                    canvas.width = 842;
                                    canvas.height = 595;
                                    
                                    // Background
                                    const gradient = ctx.createLinearGradient(0, 0, 842, 595);
                                    gradient.addColorStop(0, '#0f172a');
                                    gradient.addColorStop(1, '#1e293b');
                                    ctx.fillStyle = gradient;
                                    ctx.fillRect(0, 0, 842, 595);
                                    
                                    // Border
                                    ctx.strokeStyle = '#10b981';
                                    ctx.lineWidth = 8;
                                    ctx.strokeRect(20, 20, 802, 555);
                                    
                                    ctx.strokeStyle = '#34d399';
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(30, 30, 782, 535);
                                    
                                    // Logo
                                    ctx.fillStyle = '#10b981';
                                    ctx.font = 'bold 24px Arial';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('🏴 HIGHLAND GAMES EUROPE', 421, 80);
                                    
                                    // Title
                                    ctx.fillStyle = '#fbbf24';
                                    ctx.font = 'bold 48px Arial';
                                    ctx.fillText(t('certTitle'), 421, 150);
                                    
                                    ctx.strokeStyle = '#10b981';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(200, 170);
                                    ctx.lineTo(642, 170);
                                    ctx.stroke();
                                    
                                    // Content
                                    ctx.fillStyle = '#e2e8f0';
                                    ctx.font = '24px Arial';
                                    ctx.fillText(t('certAwardedTo'), 421, 220);
                                    
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 36px Arial';
                                    const athleteName = athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Athlète';
                                    ctx.fillText(athleteName.toUpperCase(), 421, 270);
                                    
                                    ctx.fillStyle = '#cbd5e1';
                                    ctx.font = '20px Arial';
                                    ctx.fillText(t('certParticipation'), 421, 320);
                                    
                                    ctx.fillStyle = '#10b981';
                                    ctx.font = 'bold 28px Arial';
                                    ctx.fillText(comp.competitionName, 421, 360);
                                    
                                    ctx.fillStyle = '#94a3b8';
                                    ctx.font = '18px Arial';
                                    ctx.fillText(format(compDate, "d MMMM yyyy", { locale: fr }), 421, 400);
                                    
                                    // Download
                                    const dataUrl = canvas.toDataURL('image/png');
                                    const link = document.createElement('a');
                                    link.download = `certificat_${athleteName.replace(/\s+/g, '_')}_${comp.competitionId.slice(0, 8)}.png`;
                                    link.href = dataUrl;
                                    link.click();
                                  }}
                                  className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {t('certificate')}
                                </button>
                              )}
                            </div>
                          <div className="space-y-3">
                            {comp.results.map((result) => (
                              <div
                                key={result.id}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
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
                                    {result.points} {result.points > 1 ? t('points') : t('point')}
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
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "records" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white">{t('tabRecords')}</h2>
              
              {/* Statistiques de compétition */}
              {records && records.totalEvents > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">{t('competitionStats')}</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {t('statBestRank')}
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
                        {t('statVictories')}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.victories}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {t('statPodiums')}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.podiumCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {t('statCompetitions')}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">
                        {records.totalCompetitions}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Badge Showcase Logic Unchanged */}
              {records && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <BadgeShowcase
                    badges={Object.values(BADGES).map(badge => ({
                      badge,
                      unlocked: isBadgeUnlocked(badge, {
                        competitions: records.totalCompetitions || 0,
                        victories: records.victories || 0,
                        podiumCount: records.podiumCount || 0,
                        bestRank: records.bestRank,
                        totalEvents: records.totalEvents || 0,
                      }),
                      progress: getBadgeProgress(badge, {
                        competitions: records.totalCompetitions || 0,
                        victories: records.victories || 0,
                        podiumCount: records.podiumCount || 0,
                        bestRank: records.bestRank,
                        totalEvents: records.totalEvents || 0,
                      }),
                    }))}
                    onBadgeClick={(badge) => {
                      // Could show badge modal with details
                      console.log("Badge clicked:", badge);
                    }}
                  />
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
                    {t('emptyRecordsTitle')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {t('emptyRecordsDesc')}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "profil" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">{t('tabProfile')}</h2>
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

