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
          {competitions.map((competition, i) => (
             <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
             >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                        <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            {format(competition.startDate, "d MMM yyyy", { locale: fr })}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
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
                        <div className="flex items-center justify-between font-medium text-sm">
                            <span className={competition.remainingSpots > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}>
                                {competition.remainingSpots > 0 ? `${competition.remainingSpots} places` : "Complet"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                Sur {competition.totalSpots}
                            </span>
                        </div>
                        
                        <Button asChild className="w-full mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" size="sm">
                            <Link href={`/inscriptions/${competition.id}`}>
                                S&apos;inscrire
                            </Link>
                        </Button>
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
          ))}
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
