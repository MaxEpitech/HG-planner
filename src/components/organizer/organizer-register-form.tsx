"use client";

import { useFormState } from "react-dom";
import { useTransition } from "react";
import {
  registerOrganizerAccountAction,
  type RegisterOrganizerFormState,
} from "@/app/actions/organizers";

const initialState: RegisterOrganizerFormState = {};

export function OrganizerRegisterForm() {
  const [state, formAction] = useFormState(registerOrganizerAccountAction, initialState);
  const [pending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const hasError = Boolean(state.error);
  const isSuccess = Boolean(state.success);

  return (
    <form action={handleAction} className="space-y-4">
      {hasError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </div>
      )}
      {isSuccess && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Votre demande de compte a été envoyée avec succès ! Un administrateur va examiner
          votre demande et vous recevrez une notification une fois votre compte approuvé.
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
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            htmlFor="organizationName"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Nom de l'organisation <span className="text-emerald-300">*</span>
          </label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            required
            placeholder="Ex: Highland Games Luzarches"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Email <span className="text-emerald-300">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Mot de passe <span className="text-emerald-300">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            Confirmation du mot de passe <span className="text-emerald-300">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Votre compte devra être validé par un administrateur avant de pouvoir être utilisé. Vous
        recevrez une notification une fois votre compte approuvé.
      </p>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Envoi en cours..." : "Envoyer la demande"}
        </button>
      </div>
    </form>
  );
}

