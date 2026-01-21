"use client";

import { motion } from "framer-motion";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number; // percentage
  trend?: "up" | "down" | "neutral";
  icon?: string;
  color?: "emerald" | "blue" | "violet" | "amber";
};

export function StatCard({ title, value, change, trend, icon, color = "emerald" }: StatCardProps) {
  const getColors = () => {
    switch (color) {
      case "emerald": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "blue": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "violet": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "amber": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-slate-400";
    if (trend === "up") return "text-emerald-400";
    if (trend === "down") return "text-rose-400";
    return "text-slate-400";
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border p-6 backdrop-blur-sm ${getColors()}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      
      {change !== undefined && (
        <div className={`mt-4 flex items-center text-sm ${getTrendColor()}`}>
          <span className="font-semibold">
            {change > 0 ? "+" : ""}{change}%
          </span>
          <span className="ml-2 opacity-60 text-[10px] uppercase">vs mois dernier</span>
        </div>
      )}
    </motion.div>
  );
}
