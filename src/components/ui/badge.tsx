"use client";

import { motion } from "framer-motion";
import type { Badge as BadgeType } from "@/lib/badges";

type BadgeProps = {
  badge: BadgeType;
  unlocked: boolean;
  progress?: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
};

export function Badge({ 
  badge, 
  unlocked, 
  progress = 0, 
  size = "md", 
  showProgress = false,
  onClick 
}: BadgeProps) {
  const sizes = {
    sm: {
      container: "w-20 h-20",
      icon: "text-2xl",
      name: "text-xs",
    },
    md: {
      container: "w-28 h-28",
      icon: "text-4xl",
      name: "text-sm",
    },
    lg: {
      container: "w-36 h-36",
      icon: "text-5xl",
      name: "text-base",
    },
  };

  const rarityColors = {
    common: "from-slate-400 to-slate-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-amber-400 to-amber-600",
  };

  const rarityGlow = {
    common: "shadow-slate-500/20",
    rare: "shadow-blue-500/30",
    epic: "shadow-purple-500/40",
    legendary: "shadow-amber-500/50",
  };

  return (
    <motion.div
      className={`relative ${sizes[size].container} cursor-pointer group`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Badge background */}
      <div
        className={`absolute inset-0 rounded-full ${
          unlocked
            ? `bg-gradient-to-br ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]} shadow-lg`
            : "bg-slate-700/50 border-2 border-dashed border-slate-600"
        } transition-all duration-300`}
      >
        {/* Glow effect for unlocked badges */}
        {unlocked && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-0 group-hover:opacity-30 blur-xl transition-opacity`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Icon */}
      <div className={`relative z-10 flex h-full items-center justify-center ${sizes[size].icon}`}>
        <span className={`select-none ${!unlocked && "grayscale opacity-30"}`}>
          {badge.icon}
        </span>
      </div>

      {/* Progress ring for locked badges */}
      {!unlocked && showProgress && progress > 0 && (
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 36 36"
        >
          <path
            className="stroke-current text-emerald-500/30"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-current text-emerald-500"
            strokeWidth="2"
            strokeDasharray={`${progress}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      )}

      {/* Badge name tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <p className={`${sizes[size].name} font-semibold text-white px-2 py-1 rounded-md bg-slate-900/90 backdrop-blur`}>
          {badge.name}
        </p>
      </div>

      {/* Lock icon for locked badges */}
      {!unlocked && (
        <div className="absolute bottom-0 right-0 bg-slate-800 rounded-full p-1 border-2 border-slate-700">
          <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

type BadgeShowcaseProps = {
  badges: Array<{ badge: BadgeType; unlocked: boolean; progress: number }>;
  onBadgeClick?: (badge: BadgeType) => void;
};

export function BadgeShowcase({ badges, onBadgeClick }: BadgeShowcaseProps) {
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Collection de Badges</h3>
          <p className="text-sm text-slate-400 mt-1">
            {unlockedCount} / {totalCount} badges débloqués
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-400">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </div>
          <p className="text-xs text-slate-500">Complétion</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 pt-4">
        {badges.map(({ badge, unlocked, progress }) => (
          <Badge
            key={badge.id}
            badge={badge}
            unlocked={unlocked}
            progress={progress}
            showProgress
            onClick={() => onBadgeClick?.(badge)}
          />
        ))}
      </div>
    </div>
  );
}
