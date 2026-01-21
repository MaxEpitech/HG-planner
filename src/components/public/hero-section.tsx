"use client";

import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  stats: {
    totalCompetitions: number;
    activeCompetitions: number;
    totalResults: number;
    totalAthletes: number;
  };
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function HeroSection({ stats }: HeroSectionProps) {
  const t = useTranslations('Hero');
  const format = useFormatter();

  const competitionsCount = format.number(stats.totalCompetitions ?? 0);
  const athleteCount = format.number(stats.totalAthletes ?? 0);
  const resultsCount = format.number(stats.totalResults ?? 0);

  return (
    <section className="relative overflow-hidden py-12 lg:py-24" style={{ backgroundColor: 'currentColor'}}>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="container px-4 mx-auto"
      >
        <div className="flex flex-col gap-6 mb-12 lg:mb-20">
          <motion.h1 
            className="text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl"
            variants={itemVariants}
          >
            {t('titlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{t('titlePart2')}</span> {t('titlePart3')}
          </motion.h1>
          
          <motion.p 
            className="text-lg text-slate-300 max-w-xl leading-relaxed"
            variants={itemVariants}
          >
            {t('description1')}
            <br />
            {t('description2')}
          </motion.p>
          
          <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
            <Button asChild size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-base shadow-emerald-500/25 shadow-lg relative overflow-hidden group">
              <Link href="/admin">
                <span className="relative z-10">{t('organizerSpace')}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg" className="rounded-full text-base font-medium bg-white/10 hover:bg-white/20 text-white backdrop-blur">
               <Link href="/resultats">
                 {t('viewResults')}
               </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-3"
          variants={itemVariants}
        >
          <StatsCard 
            label={t('statsCompetitions')}
            value={competitionsCount} 
            color="border-cyan-500/30 text-cyan-400" 
            idx={0}
          />
          <StatsCard 
            label={t('statsAthletes')} 
            value={athleteCount} 
            color="border-violet-500/30 text-violet-400" 
            idx={1}
          />
          <StatsCard 
            label={t('statsResults')} 
            value={resultsCount} 
            color="border-emerald-500/30 text-emerald-400" 
            idx={2}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsCard({ label, value, color, idx }: { label: string, value: string, color: string, idx: number }) {
    return (
        <motion.div 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
          className={`group rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-colors ${color}`}
        >
          <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.2em] font-semibold opacity-80 ${color.split(' ')[1]}`}>{label}</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                    {value}
                </p>
              </div>
          </div>
        </motion.div>
    )
}
