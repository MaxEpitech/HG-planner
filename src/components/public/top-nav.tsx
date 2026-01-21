"use client";

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { GlobalRole } from "@prisma/client";
import Image from "next/image";

import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function TopNav() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/", label: t('home') },
    { href: "/calendrier", label: t('calendar') },
    { href: "/resultats", label: t('results') },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-zinc-950/80 border-b border-white/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image 
            src="/hg_europe.png" 
            alt="Highland Games Europe" 
            width={48} 
            height={48}
            className="h-12 w-auto"
          />
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
          <LanguageSwitcher />
          {!session ? (
            <>
              <Link
                href="/athlete/inscription"
                className="hidden sm:inline-block rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                {t('createAthleteAccount')}
              </Link>
              <Link
                href="/athlete/login"
                className="hidden sm:inline-block rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                {t('athleteLogin')}
              </Link>
              <Link
                href="/admin/inscription"
                className="hidden sm:inline-block rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                {t('becomeOrganizer')}
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                {t('organizerLogin')}
              </Link>
            </>
          ) : session.user.role === GlobalRole.ATHLETE ? (
            <Link
              href="/athlete"
              className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            >
              {t('mySpace')}
            </Link>
          ) : (
            <Link
              href="/admin"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              {t('organizerSpace')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
