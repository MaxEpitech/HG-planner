import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('copyright', { year })}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t('madeWith')}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/mentions-legales" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
              {t('legal')}
            </Link>
            <Link href="/confidentialite" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
              {t('privacy')}
            </Link>
            <Link href="/contact" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
