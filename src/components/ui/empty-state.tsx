"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  variant?: "default" | "competition" | "results";
};

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const illustrations = {
    default: (
      <svg className="w-32 h-32 text-slate-300 dark:text-slate-700" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <text x="50" y="60" fontSize="40" textAnchor="middle" className="select-none">{icon}</text>
      </svg>
    ),
    competition: (
      <svg className="w-40 h-40 text-slate-300 dark:text-slate-700" viewBox="0 0 120 120" fill="none">
        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          <path d="M40 70 L50 50 L70 65 L80 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <text x="60" y="75" fontSize="48" textAnchor="middle" className="select-none">🏆</text>
        </motion.g>
      </svg>
    ),
    results: (
      <svg className="w-40 h-40 text-slate-300 dark:text-slate-700" viewBox="0 0 120 120" fill="none">
        <motion.g
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <rect x="30" y="60" width="15" height="40" fill="currentColor" opacity="0.3" rx="2" />
          <rect x="52.5" y="40" width="15" height="60" fill="currentColor" opacity="0.5" rx="2" />
          <rect x="75" y="50" width="15" height="50" fill="currentColor" opacity="0.4" rx="2" />
          <text x="60" y="30" fontSize="28" textAnchor="middle" className="select-none">📊</text>
        </motion.g>
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-12 text-center"
    >
      <div className="flex justify-center mb-6">
        {illustrations[variant]}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
        {description}
      </p>
      
      {action && (
        <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <Link href={action.href}>
            {action.label}
          </Link>
        </Button>
      )}
    </motion.div>
  );
}
