
'use client';

import { RankedAthlete } from "@/app/actions/ranking";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

type RankingTableProps = {
  athletes: RankedAthlete[];
};

export function RankingTable({ athletes }: RankingTableProps) {
  const [expandedAthleteId, setExpandedAthleteId] = useState<string | null>(null);
  const t = useTranslations("Hero");

  const toggleExpand = (id: string) => {
    setExpandedAthleteId(expandedAthleteId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
            <tr>
              <th className="p-4 w-16 text-center">{t("tableRank")}</th>
              <th className="p-4">{t("tableAthlete")}</th>
              <th className="p-4">{t("tableClub")}</th>
              <th className="p-4 text-right">{t("tablePoints")}</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {athletes.map((athlete, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const isExpanded = expandedAthleteId === athlete.id;

              return (
                <>
                  <tr 
                    key={athlete.id} 
                    className={`transition hover:bg-white/5 cursor-pointer ${isExpanded ? 'bg-white/5' : ''}`}
                    onClick={() => toggleExpand(athlete.id)}
                  >
                    <td className="p-4 text-center">
                      {isTop3 ? (
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          rank === 1 ? 'bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/50' :
                          rank === 2 ? 'bg-slate-300/20 text-slate-300 ring-1 ring-slate-300/50' :
                          'bg-amber-700/20 text-amber-600 ring-1 ring-amber-700/50'
                        }`}>
                          {rank}
                        </span>
                      ) : (
                        <span className="font-medium text-slate-500">{rank}</span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {athlete.firstName} {athlete.lastName}
                    </td>
                    <td className="p-4">
                      {athlete.club || "-"}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-400 text-lg">
                      {athlete.totalPoints.toFixed(0)} pts
                    </td>
                    <td className="p-4">
                      <svg 
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-white/5">
                      <td colSpan={5} className="p-0">
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4"
                        >
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                             <div className="col-span-full mb-2 font-semibold text-slate-500 uppercase tracking-wider">
                               {t("tableDetails")}
                             </div>
                             {athlete.details.map((detail) => (
                               <div key={detail.eventName} className="flex justify-between items-center bg-slate-950/50 p-2 rounded border border-white/5">
                                 <span className="text-slate-300">{detail.eventName}</span>
                                 <div className="flex gap-3">
                                   <span className="text-slate-500">{detail.performance}</span>
                                   <span className="font-mono text-emerald-500 font-bold">{detail.points.toFixed(0)} pts</span>
                                 </div>
                               </div>
                             ))}
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
