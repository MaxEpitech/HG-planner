"use client";

import { useFormState } from "react-dom";
import { useMemo, useTransition } from "react";

import {
  registerAthleteAccountAction,
  type RegisterAthleteFormState,
} from "@/app/actions/athletes";
import { countries } from "@/lib/data/countries";

const initialState: RegisterAthleteFormState = {};

export function AthleteRegisterForm() {
  const [state, formAction] = useFormState(registerAthleteAccountAction, initialState);
  const [pending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const hasError = Boolean(state.error);
  const isSuccess = Boolean(state.success);

  const fields = useMemo(
    () => [
      { name: "firstName", label: "Prénom", type: "text", required: true },
      { name: "lastName", label: "Nom", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Téléphone", type: "tel", required: false },
      { name: "password", label: "Mot de passe", type: "password", required: true },
      {
        name: "confirmPassword",
        label: "Confirmation du mot de passe",
        type: "password",
        required: true,
      },
      { name: "club", label: "Club", type: "text", required: false },
      { name: "birthDate", label: "Date de naissance", type: "date", required: false },
      { name: "country", label: "Pays", type: "text", required: false },
    ],
    []
  );

  return (
    <form action={handleAction} className="space-y-4">
      {hasError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </div>
      )}
      {isSuccess && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Compte créé avec succès ! Vous pouvez maintenant vous connecter.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const label = (
            <label
              htmlFor={field.name}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
            >
              {field.label}
              {field.required && <span className="text-emerald-300"> *</span>}
            </label>
          );

          if (field.name === "country") {
            return (
              <div key={field.name} className="flex flex-col gap-2">
                {label}
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    className="w-full appearance-none rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 pr-10 text-sm text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)] focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Sélectionnez un pays</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name} className="text-slate-900">
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={field.name} className="flex flex-col gap-2">
              {label}
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400">
        Votre compte vous permettra de suivre vos inscriptions, vos résultats et de vous
        inscrire en un clic aux prochaines compétitions.
      </p>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Création en cours..." : "Créer mon compte"}
        </button>
      </div>
    </form>
  );
}

