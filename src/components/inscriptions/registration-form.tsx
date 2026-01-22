"use client";

import { useState, useEffect } from "react";
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { createAthleteAndRegistration } from "@/app/actions/registrations";
import { TopNav } from "@/components/public/top-nav";
import { countries } from "@/lib/data/countries";
import type { getAthleteProfileForUser } from "@/app/actions/athletes";

type Competition = {
  id: string;
  name: string;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
  groups: Array<{
    id: string;
    name: string;
    category: string;
    maxAthletes: number;
    _count: {
      registrations: number;
    };
    events: Array<{
      id: string;
      name: string;
      order: number;
    }>;
  }>;
};

type AthleteProfile = NonNullable<
  Awaited<ReturnType<typeof getAthleteProfileForUser>>["data"]
>;

type RegistrationFormProps = {
  competition: Competition;
  athleteProfile?: AthleteProfile | null;
};

const formatDate = (date: string | Date) => {
  try {
    return format(new Date(date), "d MMMM yyyy", { locale: fr });
  } catch {
    return new Date(date).toLocaleDateString("fr-FR");
  }
};

export function RegistrationForm({
  competition,
  athleteProfile,
}: RegistrationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: athleteProfile?.firstName || "",
    lastName: athleteProfile?.lastName || "",
    club: athleteProfile?.club || "",
    email: athleteProfile?.email || "",
    phone: athleteProfile?.phone || "",
    birthDate: athleteProfile?.birthDate
      ? format(new Date(athleteProfile.birthDate), "yyyy-MM-dd")
      : "",
    country: athleteProfile?.country || "",
    groupId: "",
  });

  useEffect(() => {
    if (athleteProfile) {
      setFormData({
        firstName: athleteProfile.firstName || "",
        lastName: athleteProfile.lastName || "",
        club: athleteProfile.club || "",
        email: athleteProfile.email || "",
        phone: athleteProfile.phone || "",
        birthDate: athleteProfile.birthDate
          ? format(new Date(athleteProfile.birthDate), "yyyy-MM-dd")
          : "",
        country: athleteProfile.country || "",
        groupId: "",
      });
    }
  }, [athleteProfile]);

  const availableGroups = competition.groups.filter(
    (group) => group._count.registrations < group.maxAthletes
  );

  const uniqueEvents = Array.from(
    new Set(
      competition.groups.flatMap((group) =>
        group.events.map((event) => event.name)
      )
    )
  );

  const totalSpots = competition.groups.reduce(
    (sum, group) => sum + group.maxAthletes,
    0
  );

  const totalRegistrations = competition.groups.reduce(
    (sum, group) => sum + group._count.registrations,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createAthleteAndRegistration({
        ...formData,
        competitionId: competition.id,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        birthDate: formData.birthDate || undefined,
        country: formData.country || undefined,
        club: formData.club || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/inscriptions");
        }, 2800);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

const renderShell = (content: ReactNode) => (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        {content}
      </main>
    </div>
  );

  if (success) {
    return renderShell(
      <div className="mx-auto max-w-2xl rounded-[32px] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-300">
          ✓
        </div>
        <h1 className="text-3xl font-semibold text-white">Inscription enregistrée</h1>
        <p className="mt-3 text-sm text-slate-300">
          Nous vous confirmerons votre participation par email dès validation par l&apos;organisation.
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.5em] text-emerald-300">
          Redirection automatique
        </p>
      </div>
    );
  }

  if (availableGroups.length === 0) {
    return renderShell(
      <div className="mx-auto max-w-2xl rounded-[32px] border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-amber-500/10 p-10 text-center shadow-2xl">
        <h1 className="text-3xl font-semibold text-white">Inscriptions complètes</h1>
        <p className="mt-3 text-sm text-slate-200">
          Tous les groupes de cette compétition ont atteint leur capacité maximale.
        </p>
        <Link
          href="/inscriptions"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          Découvrir d&apos;autres compétitions
        </Link>
      </div>
    );
  }

  return renderShell(
    <>
      <Link
        href="/inscriptions"
        className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
      >
        ← Retour aux compétitions
      </Link>

      <div className="grid gap-8 lg:grid-cols-[44%_56%]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
            Compétition
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-white">{competition.name}</h1>
          <p className="mt-1 text-sm text-emerald-200">{competition.location}</p>
          <p className="mt-1 text-sm text-slate-300">
            {formatDate(competition.startDate)}
            {new Date(competition.startDate).getTime() !==
              new Date(competition.endDate).getTime() && (
              <> – {formatDate(competition.endDate)}</>
            )}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Groupes</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {competition.groups.length}
              </p>
              <p className="text-xs text-slate-400">catégories ouvertes</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Places</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {totalSpots - totalRegistrations}
              </p>
              <p className="text-xs text-slate-400">restantes / {totalSpots}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Programme</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {uniqueEvents.length === 0 ? (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    Programme en cours de finalisation
                  </span>
                ) : (
                  uniqueEvents.map((event) => (
                    <span
                      key={event}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {event}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Groupes disponibles
              </p>
              <div className="mt-3 space-y-2">
                {availableGroups.map((group) => {
                  const available = group.maxAthletes - group._count.registrations;
                  const progress = Math.round(
                    (group._count.registrations / group.maxAthletes) * 100
                  );

                  return (
                    <div
                      key={group.id}
                      className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-white">{group.name}</p>
                          <p className="text-xs text-slate-300">{group.category}</p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-300">
                          {available} place{available > 1 ? "s" : ""} dispo
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-emerald-400"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white p-8 text-slate-900 shadow-2xl dark:bg-zinc-950 dark:text-white">
          <h2 className="text-2xl font-semibold">Formulaire d&apos;inscription</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Les champs marqués d&apos;une * sont obligatoires.
          </p>

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Prénom *"
                value={formData.firstName}
                onChange={(value) => setFormData({ ...formData, firstName: value })}
                required
              />
              <InputField
                label="Nom *"
                value={formData.lastName}
                onChange={(value) => setFormData({ ...formData, lastName: value })}
                required
              />
            </div>

            <SelectField
              label="Groupe *"
              value={formData.groupId}
              onChange={(value) => setFormData({ ...formData, groupId: value })}
              options={availableGroups.map((group) => {
                const available = group.maxAthletes - group._count.registrations;
                return {
                  value: group.id,
                  label: `${group.name} (${group.category}) – ${available} place${
                    available > 1 ? "s" : ""
                  } disponible${available > 1 ? "s" : ""}`,
                };
              })}
              placeholder="Sélectionnez un groupe"
              required
            />

            <InputField
              label="Club"
              value={formData.club}
              onChange={(value) => setFormData({ ...formData, club: value })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
              />
              <InputField
                label="Téléphone"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Date de naissance"
                type="date"
                value={formData.birthDate}
                onChange={(value) => setFormData({ ...formData, birthDate: value })}
              />
              <SelectField
                label="Pays"
                value={formData.country}
                onChange={(value) => setFormData({ ...formData, country: value })}
                options={[
                  { value: "", label: "Sélectionnez un pays" },
                  ...countries.map((country) => ({
                    value: country.name,
                    label: country.name,
                  })),
                ]}
                placeholder="Sélectionnez un pays"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4">
              <Link
                href="/inscriptions"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "S'inscrire"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
};

function InputField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-500"
      />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  required?: boolean;
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
        {label}
      </label>
      <div className="relative mt-2 w-full">
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-300"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-white/60">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

