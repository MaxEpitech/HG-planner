"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type TimelineStatus = "upcoming" | "ongoing" | "completed" | "past";

type TimelineEvent = {
  id: string;
  title: string;
  date: Date;
  status: TimelineStatus;
  icon?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type CompetitionTimelineProps = {
  events: TimelineEvent[];
};

export function CompetitionTimeline({ events }: CompetitionTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const getStatusColor = (status: TimelineStatus) => {
    switch (status) {
      case "upcoming":
        return {
          dot: "bg-emerald-500",
          line: "bg-emerald-500/30",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "ongoing":
        return {
          dot: "bg-amber-500 animate-pulse",
          line: "bg-amber-500/30",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "completed":
        return {
          dot: "bg-blue-500",
          line: "bg-blue-500/30",
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
      case "past":
        return {
          dot: "bg-slate-600",
          line: "bg-slate-700/30",
          badge: "bg-slate-700/10 text-slate-400 border-slate-600/20",
        };
    }
  };

  const getStatusLabel = (status: TimelineStatus) => {
    switch (status) {
      case "upcoming":
        return "À venir";
      case "ongoing":
        return "En cours";
      case "completed":
        return "Terminé";
      case "past":
        return "Passé";
    }
  };

  return (
    <div className="relative space-y-8">
      {sortedEvents.map((event, index) => {
        const colors = getStatusColor(event.status);
        const isLast = index === sortedEvents.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8"
          >
            {/* Vertical line */}
            {!isLast && (
              <div
                className={`absolute left-2 top-6 h-full w-0.5 ${colors.line}`}
              />
            )}

            {/* Dot */}
            <div
              className={`absolute left-0 top-1.5 h-4 w-4 rounded-full ${colors.dot} ring-4 ring-slate-950`}
            />

            {/* Content card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {event.icon && <span className="text-xl">{event.icon}</span>}
                    <h4 className="text-base font-semibold text-white">
                      {event.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>📅 {format(event.date, "d MMMM yyyy", { locale: fr })}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${colors.badge}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  </div>

                  {event.description && (
                    <p className="mt-2 text-sm text-slate-400">
                      {event.description}
                    </p>
                  )}
                </div>

                {event.action && (
                  <button
                    onClick={event.action.onClick}
                    className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
                  >
                    {event.action.label}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Helper function to convert registrations to timeline events
export function registrationsToTimeline(
  registrations: Array<{
    id: string;
    competition: { name: string; startDate: Date };
    status: string;
  }>
): TimelineEvent[] {
  return registrations.map((reg) => {
    const now = new Date();
    const startDate = new Date(reg.competition.startDate);
    const isUpcoming = startDate > now;
    const isPast = startDate < now;

    let status: TimelineStatus = "past";
    if (isUpcoming) {
      status = reg.status === "CONFIRMED" ? "upcoming" : "ongoing";
    } else if (reg.status === "CONFIRMED") {
      status = "completed";
    }

    return {
      id: reg.id,
      title: reg.competition.name,
      date: startDate,
      status,
      icon: status === "upcoming" ? "🎯" : status === "completed" ? "✅" : "📍",
      description:
        reg.status === "CONFIRMED"
          ? "Inscription confirmée"
          : "En attente de confirmation",
    };
  });
}
