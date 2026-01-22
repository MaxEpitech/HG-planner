"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

type Competition = {
  id: string;
  name: string;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  groups: Array<{
    id: string;
    maxAthletes: number;
    _count: {
      registrations: number;
    };
  }>;
};

type CompetitionCalendarProps = {
  competitions: Competition[];
};

type CalendarDay = {
  date: Date;
  competitions: Competition[];
};

const daysShort = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CompetitionCalendar({ competitions }: CompetitionCalendarProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  const sortedCompetitions = useMemo(
    () =>
      [...competitions].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    [competitions]
  );

  const quickMonths = useMemo(() => {
    const base = startOfMonth(new Date());
    return Array.from({ length: 6 }, (_, index) => addMonths(base, index));
  }, []);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: CalendarDay[] = [];
    let day = startDate;

    const competitionsByDay: Record<string, Competition[]> = {};
    competitions.forEach((competition) => {
      const key = format(
        typeof competition.startDate === "string"
          ? parseISO(competition.startDate)
          : competition.startDate,
        "yyyy-MM-dd"
      );
      if (!competitionsByDay[key]) {
        competitionsByDay[key] = [];
      }
      competitionsByDay[key].push(competition);
    });

    while (day <= endDate) {
      const key = format(day, "yyyy-MM-dd");
      days.push({
        date: day,
        competitions: competitionsByDay[key] ?? [],
      });
      day = addDays(day, 1);
    }

    return days;
  }, [competitions, currentMonth]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {["calendar", "list"].map((mode) => (
            <button
              key={mode}
              onClick={() => setView(mode as "calendar" | "list")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                view === mode ? "bg-white text-slate-900" : "text-white/70"
              }`}
            >
              {mode === "calendar" ? "Vue calendrier" : "Vue liste"}
            </button>
          ))}
        </div>

        {view === "calendar" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                ◀
              </button>
              <p className="text-sm font-semibold text-white">
                {format(currentMonth, "LLLL yyyy", { locale: fr })}
              </p>
              <button
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                ▶
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickMonths.map((month) => (
                <button
                  key={month.toISOString()}
                  onClick={() => setCurrentMonth(month)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isSameMonth(month, currentMonth)
                      ? "bg-white text-slate-900"
                      : "border border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {format(month, "MMM yyyy", { locale: fr })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {view === "calendar" ? (
        <CalendarGrid days={calendarDays} currentMonth={currentMonth} />
      ) : (
        <ListView competitions={sortedCompetitions} />
      )}
    </section>
  );
}

function CalendarGrid({
  days,
  currentMonth,
}: {
  days: CalendarDay[];
  currentMonth: Date;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 text-white">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {daysShort.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map(({ date, competitions }) => (
          <div
            key={date.toISOString()}
            className={`min-h-[120px] rounded-2xl border p-2 text-xs ${
              isSameMonth(date, currentMonth)
                ? "border-white/10 bg-white/5"
                : "border-white/5 bg-white/0 text-white/30"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                isSameDay(date, new Date()) ? "bg-emerald-500 text-white" : ""
              }`}
            >
              {format(date, "d")}
            </div>
            <div className="mt-2 space-y-1">
              {competitions.map((competition) => {
                const totalSpots = competition.groups.reduce(
                  (sum, group) => sum + group.maxAthletes,
                  0
                );
                const registrations = competition.groups.reduce(
                  (sum, group) => sum + group._count.registrations,
                  0
                );
                const remaining = totalSpots - registrations;

                return (
                  <Link
                    key={competition.id}
                    href={`/inscriptions/${competition.id}`}
                    className="block rounded-xl border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-medium text-white transition hover:border-emerald-300 hover:bg-white/20"
                  >
                    <p className="truncate">{competition.name}</p>
                    <p className="text-[9px] text-emerald-200">
                      {remaining > 0
                        ? `${remaining} place${remaining > 1 ? "s" : ""} dispo`
                        : "Complet"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListView({ competitions }: { competitions: Competition[] }) {
  return (
    <div className="space-y-4">
      {competitions.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
          Aucune compétition publiée pour le moment.
        </div>
      ) : (
        competitions.map((competition) => {
          const totalSpots = competition.groups.reduce(
            (sum, group) => sum + group.maxAthletes,
            0
          );
          const registrations = competition.groups.reduce(
            (sum, group) => sum + group._count.registrations,
            0
          );
          const remaining = totalSpots - registrations;

          return (
            <div
              key={competition.id}
              className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white transition hover:border-emerald-400/40 hover:bg-white/10 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                  {format(
                    typeof competition.startDate === "string"
                      ? parseISO(competition.startDate)
                      : competition.startDate,
                    "EEEE d MMMM",
                    { locale: fr }
                  )}
                </p>
                <h3 className="text-xl font-semibold">{competition.name}</h3>
                <p className="text-xs text-slate-300">{competition.location}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold text-slate-200">
                  {remaining > 0
                    ? `${remaining} place${remaining > 1 ? "s" : ""}`
                    : "Complet"}
                </span>
                <Link
                  href={`/inscriptions/${competition.id}`}
                  className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
                >
                  Voir les groupes
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

