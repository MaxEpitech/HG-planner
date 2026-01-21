"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UpcomingCompetition = {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  remainingSpots: number;
  totalSpots: number;
};

type UpcomingCompetitionsSectionProps = {
  competitions: UpcomingCompetition[];
};

export function UpcomingCompetitionsSection({
  competitions,
}: UpcomingCompetitionsSectionProps) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-bold mb-1">
            Calendrier
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Prochaines compétitions
          </h2>
        </div>
        <Button variant="link" asChild className="hidden sm:inline-flex text-emerald-600">
          <Link href="/calendrier">
            Voir tout le calendrier →
          </Link>
        </Button>
      </div>

      {competitions.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 border-dashed">
          <p className="text-sm text-muted-foreground">
            Aucun événement à venir pour le moment. Revenez bientôt !
          </p>
        </Card>
              ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {competitions.map((competition, i) => {
            // Calculate badge status
            const isLimitedSpots = competition.remainingSpots > 0 && competition.remainingSpots <= 10;
            const isSoldOut = competition.remainingSpots === 0;
            const daysUntilStart = Math.ceil((competition.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isNewCompetition = daysUntilStart > 30 && daysUntilStart <= 60;
            
            return (
             <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
             >
                <Card className="h-full overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            {format(competition.startDate, "d MMM yyyy", { locale: fr })}
                        </span>
                        
                        {/* Status Badges */}
                        {isLimitedSpots && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                            🔥 {competition.remainingSpots} places
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                            ⚠️ Complet
                          </span>
                        )}
                        {isNewCompetition && !isLimitedSpots && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ⭐ Nouveau
                          </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {competition.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {competition.location}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between font-medium text-sm mb-2">
                            <span className={competition.remainingSpots > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}>
                                {competition.remainingSpots > 0 ? `${competition.remainingSpots} places` : "Complet"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                Sur {competition.totalSpots}
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mb-3 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${((competition.totalSpots - competition.remainingSpots) / competition.totalSpots) * 100}%` }}
                          />
                        </div>
                        
                        <Button asChild className="w-full mt-1 bg-slate-900 hover:bg-emerald-600 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-400 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/20" size="sm">
                            <Link href={`/inscriptions/${competition.id}`}>
                                S&apos;inscrire
                            </Link>
                        </Button>
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
            );
          })}
        </div>
      )}
      
      <div className="mt-6 text-center sm:hidden">
         <Button variant="link" asChild className="text-emerald-600">
          <Link href="/calendrier">
            Voir tout le calendrier →
          </Link>
        </Button>
      </div>
    </section>
  );
}
