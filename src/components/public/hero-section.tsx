"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type HeroStats = {
  totalCompetitions: number;
  totalResults: number;
  totalAthletes?: number;
  totalRegistrations?: number;
};

type HeroSectionProps = {
  stats: HeroStats;
};

const formatter = new Intl.NumberFormat("fr-FR");

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HeroSection({ stats }: HeroSectionProps) {
  const competitionsCount = formatter.format(stats.totalCompetitions ?? 0);
  const athleteCount = formatter.format(
    stats.totalAthletes ?? stats.totalRegistrations ?? 0
  );
  const resultsCount = formatter.format(stats.totalResults ?? 0);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pb-20 pt-24 lg:pt-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-32 top-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_70%)]" />
      </div>

      <motion.div 
        className="relative z-10 mx-auto grid max-w-6xl gap-12 px-8 lg:grid-cols-[1.5fr,1fr] lg:items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 border border-emerald-500/20 backdrop-blur-sm shadow-inner shadow-emerald-500/10">
              Highland Games
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Europe
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl" // Updated typography
            variants={itemVariants}
          >
            La référence <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Highland Games</span> en Europe.
          </motion.h1>
          
          <motion.p 
            className="text-lg text-slate-300 max-w-xl leading-relaxed"
            variants={itemVariants}
          >
            Inscriptions, gestion des groupes, résultats en direct.
            <br />
            Une expérience premium pour organisateurs et athlètes.
          </motion.p>
          
          <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
            <Button asChild size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-base shadow-emerald-500/25 shadow-lg relative overflow-hidden group">
              <Link href="/admin">
                <span className="relative z-10">Espace Organisateur</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg" className="rounded-full text-base font-medium">
               <Link href="/resultats">
                 Consulter les résultats
               </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-1"
          variants={itemVariants}
        >
          <StatsCard 
            label="Compétitions" 
            value={competitionsCount} 
            color="border-cyan-500/30 text-cyan-400" 
            idx={0}
          />
          <StatsCard 
            label="Athlètes Inscrits" 
            value={athleteCount} 
            color="border-violet-500/30 text-violet-400" 
            idx={1}
          />
          <StatsCard 
            label="Résultats Publiés" 
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
              {/* Optional Icon could go here */}
          </div>
        </motion.div>
    )
}

