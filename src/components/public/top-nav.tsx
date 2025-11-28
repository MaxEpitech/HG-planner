"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { GlobalRole } from "@prisma/client";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/resultats", label: "Résultats" },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-zinc-950/80 border-b border-white/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-sm font-semibold tracking-[0.4em] uppercase text-emerald-600">
          HG EUROPE
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-emerald-600 ${
                pathname === link.href ? "text-emerald-600" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <Link
                href="/athlete/inscription"
                className="hidden sm:inline-block rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                Créer un compte athlète
              </Link>
              <Link
                href="/athlete/login"
                className="hidden sm:inline-block rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                Connexion athlète
              </Link>
              <Link
                href="/admin/inscription"
                className="hidden sm:inline-block rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                Devenir organisateur
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Connexion organisateur
              </Link>
            </>
          ) : session.user.role === GlobalRole.ATHLETE ? (
            <Link
              href="/athlete"
              className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            >
              Mon espace
            </Link>
          ) : (
            <Link
              href="/admin"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Espace organisateur
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

