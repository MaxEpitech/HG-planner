"use client";

import { useFormState } from "react-dom";
import { useTransition } from "react";
import { createPersonalRecordAction } from "@/app/actions/athletes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getEventsForGender } from "@/lib/data/highland-games-events";
import type { PersonalRecord } from "@prisma/client";

type PersonalRecordsFormProps = {
  records: PersonalRecord[];
  athleteGender: string | null | undefined;
  onRecordAdded: () => void;
};

const initialState = {};

export function PersonalRecordsForm({
  records,
  athleteGender,
  onRecordAdded,
}: PersonalRecordsFormProps) {
  const [state, formAction] = useFormState(createPersonalRecordAction, initialState);
  const [pending, startTransition] = useTransition();

  const availableEvents = getEventsForGender(athleteGender);

  const handleAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
    if (state.success) {
      onRecordAdded();
    }
  };

  const hasError = Boolean(state.error);
  const isSuccess = Boolean(state.success);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Ajouter un record personnel</h3>
        <form action={handleAction} className="space-y-4">
          {hasError && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {state.error}
            </div>
          )}
          {isSuccess && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Record ajouté avec succès !
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="eventName"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Nom de l&apos;épreuve <span className="text-emerald-300">*</span>
              </label>
              <div className="relative">
                <select
                  id="eventName"
                  name="eventName"
                  required
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Sélectionnez une épreuve</option>
                  {availableEvents.map((event) => (
                    <option key={event} value={event} className="text-slate-900">
                      {event}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="h-4 w-4 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="performance"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Performance <span className="text-emerald-300">*</span>
              </label>
              <input
                id="performance"
                name="performance"
                type="text"
                required
                placeholder="Ex: 12.5m"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="date"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Notes
              </label>
              <input
                id="notes"
                name="notes"
                type="text"
                placeholder="Ex: Compétition à Paris"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Ajout..." : "Ajouter le record"}
            </button>
          </div>
        </form>
      </div>

      {records.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Mes records personnels</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{record.eventName}</p>
                    <p className="mt-1 text-sm text-emerald-300">{record.performance}</p>
                    {record.date && (
                      <p className="mt-1 text-xs text-slate-400">
                        {format(new Date(record.date), "d MMMM yyyy", { locale: fr })}
                      </p>
                    )}
                    {record.notes && (
                      <p className="mt-1 text-xs text-slate-300">{record.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

