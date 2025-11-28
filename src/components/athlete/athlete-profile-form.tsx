"use client";

import { useFormState } from "react-dom";
import { useTransition } from "react";
import { updateAthleteProfileAction } from "@/app/actions/athletes";
import { countries } from "@/lib/data/countries";
import type { Athlete, User } from "@prisma/client";

type AthleteProfileFormProps = {
  athlete: Athlete | null;
  user: User;
};

const tshirtSizes = [
  { value: "", label: "Sélectionnez une taille" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "XXXL", label: "XXXL" },
];

const genders = [
  { value: "", label: "Sélectionnez un genre" },
  { value: "M", label: "Homme" },
  { value: "F", label: "Femme" },
];

const initialState = {};

export function AthleteProfileForm({ athlete, user }: AthleteProfileFormProps) {
  const [state, formAction] = useFormState(updateAthleteProfileAction, initialState);
  const [pending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const hasError = Boolean(state.error);
  const isSuccess = Boolean(state.success);

  return (
    <form action={handleAction} className="space-y-6">
      {hasError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </div>
      )}
      {isSuccess && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Profil mis à jour avec succès !
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="firstName"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Prénom <span className="text-emerald-300">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={athlete?.firstName || user.firstName ||  ""}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="lastName"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Nom <span className="text-emerald-300">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            defaultValue={athlete?.lastName || user.name?.split(" ").slice(1).join(" ") || ""}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="club"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Club
          </label>
          <input
            id="club"
            name="club"
            type="text"
            defaultValue={athlete?.club || ""}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={athlete?.phone || ""}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="birthDate"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Date de naissance
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={
              athlete?.birthDate
                ? new Date(athlete.birthDate).toISOString().split("T")[0]
                : ""
            }
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="country"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Pays
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              defaultValue={athlete?.country || ""}
            >
              <option value="">Sélectionnez un pays</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name} className="text-slate-900">
                  {country.name}
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
            htmlFor="gender"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Genre
          </label>
          <div className="relative">
            <select
              id="gender"
              name="gender"
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              defaultValue={athlete?.gender || ""}
            >
              {genders.map((gender) => (
                <option key={gender.value} value={gender.value} className="text-slate-900">
                  {gender.label}
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
            htmlFor="tshirtSize"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Taille de T-shirt
          </label>
          <div className="relative">
            <select
              id="tshirtSize"
              name="tshirtSize"
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              defaultValue={athlete?.tshirtSize || ""}
            >
              {tshirtSizes.map((size) => (
                <option key={size.value} value={size.value} className="text-slate-900">
                  {size.label}
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
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}

