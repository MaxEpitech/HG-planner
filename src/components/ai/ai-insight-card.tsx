"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AIInsightCardProps = {
  title: string;
  type: "prediction" | "recommendation" | "alert";
  confidence?: number;
  children: ReactNode;
  icon?: string;
};

export function AIInsightCard({ title, type, confidence, children, icon }: AIInsightCardProps) {
  const getColors = () => {
    switch (type) {
      case "prediction":
        return "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-300";
      case "recommendation":
        return "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300";
      case "alert":
        return "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300";
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "prediction":
        return "🔮";
      case "recommendation":
        return "✨";
      case "alert":
        return "⚠️";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-sm p-5 ${getColors()}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 rounded-xl bg-white/10 p-3 text-2xl">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white/90">{title}</h3>
            {confidence && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/70">
                {confidence}% confiance
              </span>
            )}
          </div>
          
          <div className="text-sm text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
