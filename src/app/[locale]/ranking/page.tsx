
import { getEuropeanRanking } from "@/app/actions/ranking";
import { RankingTable } from "@/components/ranking/ranking-table";
import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Classement Européen | Highland Games Hub",
  description: "Classement officiel des athlètes européens basé sur les records continentaux.",
};

export default async function RankingPage() {
  const [result, t] = await Promise.all([
    getEuropeanRanking(),
    getTranslations("Hero"),
  ]);
  const athletes = result.success ? result.data || [] : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <TopNav />
      
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <PublicPageHero
          badge={t("rankingBadge")}
          title={t("rankingTitle")}
          description={t("rankingDescription")}
        />

        {!result.success ? (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-50/5 p-6 text-rose-100">
            {result.error || t("rankingError")}
          </div>
        ) : athletes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-300">
            <h2 className="text-xl font-semibold text-white">{t("rankingEmptyTitle")}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {t("rankingEmptyDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-200">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  {t("rankingFormula")}
                </p>
             </div>
             
             <RankingTable athletes={athletes} />
          </div>
        )}
      </main>
    </div>
  );
}
