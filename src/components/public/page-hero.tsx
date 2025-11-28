"use client";

import Link from "next/link";

type Action = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type PublicPageHeroProps = {
  badge?: string;
  title: string;
  description: string;
  actions?: Action[];
};

export function PublicPageHero({
  badge,
  title,
  description,
  actions = [],
}: PublicPageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-emerald-300 blur-[140px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400 blur-[200px]" />
      </div>
      <div className="relative space-y-6">
        {badge ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
            {badge}
          </span>
        ) : null}
        <h1 className="text-4xl font-semibold leading-tight">{title}</h1>
        <p className="text-lg text-slate-200 max-w-3xl">{description}</p>
        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  action.variant === "secondary"
                    ? "border border-white/40 text-white hover:bg-white/10"
                    : "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

