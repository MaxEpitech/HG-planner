
"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RankedAthlete } from "@/app/actions/ranking";
import { motion } from "framer-motion";

type RankingPreviewProps = {
  athletes: RankedAthlete[];
};

export function RankingPreview({ athletes }: RankingPreviewProps) {
  const t = useTranslations("Home");

  // Take top 3
  const top3 = athletes.slice(0, 3);
  
  if (top3.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-slate-900 px-6 py-12 text-center text-white shadow-2xl md:px-12 md:py-20">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-transparent blur-3xl" />

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold mb-4">
            {t("rankingPreviewBadge")}
        </p>
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
            {t("rankingPreviewTitle")}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-300 mb-12">
            {t("rankingPreviewDesc")}
        </p>

        {/* Podium / List */}
        <div className="mx-auto max-w-3xl grid gap-4 grid-cols-1 md:grid-cols-3 items-end mb-12">
            {/* 2nd Place */}
            {top3[1] && (
                <div className="order-2 md:order-1 flex flex-col items-center">
                   <div className="relative w-full rounded-t-2xl bg-slate-800/50 border border-slate-700/50 p-6 flex flex-col items-center md:h-48 justify-end">
                      <div className="absolute -top-4 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center font-bold text-slate-900 border-4 border-slate-900">
                          2
                      </div>
                      <div className="font-bold text-lg">{top3[1].firstName}</div>
                      <div className="text-sm text-slate-400 mb-2">{top3[1].lastName}</div>
                      <div className="font-mono text-indigo-400 font-bold">{top3[1].totalPoints.toFixed(0)} pts</div>
                   </div>
                </div>
            )}

            {/* 1st Place */}
             {top3[0] && (
                <div className="order-1 md:order-2 flex flex-col items-center z-10">
                   <div className="relative w-full rounded-t-2xl bg-gradient-to-b from-indigo-600/20 to-slate-900 border border-indigo-500/30 p-8 flex flex-col items-center md:h-60 justify-end shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)]">
                      <div className="absolute -top-5 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-bold text-amber-900 border-4 border-slate-900 pb-0.5">
                          1
                      </div>
                      <div className="font-bold text-xl">{top3[0].firstName}</div>
                      <div className="text-sm text-indigo-200/70 mb-2">{top3[0].lastName}</div>
                      <div className="font-mono text-amber-400 font-bold text-2xl">{top3[0].totalPoints.toFixed(0)} pts</div>
                   </div>
                </div>
            )}

            {/* 3rd Place */}
             {top3[2] && (
                <div className="order-3 md:order-3 flex flex-col items-center">
                   <div className="relative w-full rounded-t-2xl bg-slate-800/50 border border-slate-700/50 p-6 flex flex-col items-center md:h-40 justify-end">
                      <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center font-bold text-amber-100 border-4 border-slate-900">
                          3
                      </div>
                      <div className="font-bold text-lg">{top3[2].firstName}</div>
                      <div className="text-sm text-slate-400 mb-2">{top3[2].lastName}</div>
                      <div className="font-mono text-indigo-400 font-bold">{top3[2].totalPoints.toFixed(0)} pts</div>
                   </div>
                </div>
            )}
        </div>

        <Button asChild size="lg" className="rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-all hover:scale-105 active:scale-95">
            <Link href="/ranking">
                {t("rankingPreviewAction")}
            </Link>
        </Button>

      </motion.div>
    </section>
  );
}
