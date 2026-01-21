"use client";

import { motion } from "framer-motion";

type TrendDirection = "up" | "down" | "stable";

type PerformanceStatProps = {
  label: string;
  value: string | number;
  trend?: {
    direction: TrendDirection;
    percentage: number;
  };
  comparison?: {
    label: string;
    value: string;
  };
  icon?: string;
};

export function PerformanceStat({ 
  label, 
  value, 
  trend, 
  comparison,
  icon 
}: PerformanceStatProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    stable: "text-slate-400",
  };

  const trendIcons = {
    up: "↗",
    down: "↘",
    stable: "→",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
          
          {comparison && (
            <p className="text-xs text-slate-500 mt-2">
              {comparison.label}: <span className="text-slate-400">{comparison.value}</span>
            </p>
          )}
        </div>

        {trend && (
          <div className={`flex flex-col items-end ${trendColors[trend.direction]}`}>
            <span className="text-2xl">{trendIcons[trend.direction]}</span>
            <span className="text-sm font-semibold">
              {trend.percentage > 0 ? "+" : ""}{trend.percentage}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

type MiniBarChartProps = {
  data: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
  title?: string;
};

export function MiniBarChart({ data, maxValue, title }: MiniBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-white font-semibold">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  item.color || "bg-gradient-to-r from-emerald-500 to-emerald-400"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / max) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type PerformanceGridProps = {
  data: {
    bestRank: number | null;
    victories: number;
    podiums: number;
    averageRank: number | null;
    totalEvents: number;
  };
};

export function PerformanceGrid({ data }: PerformanceGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <PerformanceStat
        label="Meilleur Classement"
        value={
          data.bestRank === 1 ? "🥇" :
          data.bestRank === 2 ? "🥈" :
          data.bestRank === 3 ? "🥉" :
          data.bestRank ? `#${data.bestRank}` : "—"
        }
        icon="🏆"
      />
      
      <PerformanceStat
        label="Taux de Victoire"
        value={data.totalEvents > 0 
          ? `${Math.round((data.victories / data.totalEvents) * 100)}%`
          : "—"
        }
        comparison={{
          label: "Victoires",
          value: `${data.victories}/${data.totalEvents}`,
        }}
        trend={data.victories > 0 ? {
          direction: "up",
          percentage: 15
        } : undefined}
      />
      
      <PerformanceStat
        label="Podiums"
        value={data.podiums}
        icon="🥇"
        comparison={{
          label: "Sur total épreuves",
          value: `${Math.round((data.podiums / data.totalEvents) * 100)}%`,
        }}
      />
      
      <PerformanceStat
        label="Rang Moyen"
        value={data.averageRank ? `#${data.averageRank.toFixed(1)}` : "—"}
        icon="📊"
      />
      
      <PerformanceStat
        label="Régularité"
        value={`${data.totalEvents} épreuves`}
        icon="📅"
        trend={{
          direction: data.totalEvents > 5 ? "up" : "stable",
          percentage: 0,
        }}
      />
      
      <PerformanceStat
        label="Progression"
        value="En hausse"
        icon="📈"
        trend={{
          direction: "up",
          percentage: 12,
        }}
      />
    </div>
  );
}
