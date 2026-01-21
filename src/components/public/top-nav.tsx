"use client";

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';
import { useSession } from "next-auth/react";
import { GlobalRole } from "@prisma/client";
import Image from "next/image";

import { FederationSwitcher } from "@/components/ui/federation-switcher";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function TopNav() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/", label: t('home') },
    { href: "/calendrier", label: t('calendar') },
    { href: "/resultats", label: t('results') },
    { href: "/records", label: t('records') },
    { href: "/ranking", label: t('ranking') },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-zinc-950/80 border-b border-white/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/hg_europe.png" 
            alt="Highland Games Europe" 
            width={40} 
            height={40}
            className="h-10 w-auto"
          />
          <span className="hidden lg:inline text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            HG Europe
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-emerald-600 ${
                pathname === link.href ? "text-emerald-600 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {!session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/athlete/login"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                {t('athleteLogin')}
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
              >
                {t('organizerLogin')}
              </Link>
            </div>
          ) : session.user.role === GlobalRole.ATHLETE ? (
            <Link
              href="/athlete"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
            >
              {t('mySpace')}
            </Link>
          ) : (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
            >
              {t('organizerSpace')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
