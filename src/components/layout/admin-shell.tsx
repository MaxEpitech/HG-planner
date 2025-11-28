"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { GlobalRole } from "@prisma/client";

type AdminShellProps = {
  role: { value: GlobalRole; label: string };
  children: React.ReactNode;
};

const baseLinks = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/competitions", label: "Compétitions" },
  { href: "/admin/athletes", label: "Athlètes" },
  { href: "/admin/resultats", label: "Résultats" },
];

const adminOnlyLinks = [
  { href: "/admin/organisateurs", label: "Validation organisateurs" },
];

export function AdminShell({ children, role }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-8 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <aside className="lg:w-64">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Admin Highland Games
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Rôle actif&nbsp;:{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {role.label}
              </span>
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Déconnexion
            </button>
          </div>
          <nav className="mt-4 space-y-1">
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm font-medium transition",
                  "text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            {role.value === "PLATFORM_ADMIN" &&
              adminOnlyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium transition",
                    "text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </aside>
        <main className="flex-1">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

