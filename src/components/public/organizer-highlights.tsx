"use client";

import { useTranslations } from "next-intl";

export function OrganizerHighlights() {
  const t = useTranslations("Home");

  const highlights = [
    {
      title: t("high1Title"),
      description: t("high1Desc"),
    },
    {
      title: t("high2Title"),
      description: t("high2Desc"),
    },
    {
      title: t("high3Title"),
      description: t("high3Desc"),
    },
  ];

  return (
    <section className="mt-6 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
        {t("organizersBadge")}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{t("organizersTitle")}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {highlights.map((highlight) => (
          <div
            key={highlight.title}
            className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {highlight.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {highlight.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

