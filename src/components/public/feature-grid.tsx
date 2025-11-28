type Feature = {
  title: string;
  description: string;
  badge?: string;
};

type FeatureGridProps = {
  title: string;
  subtitle?: string;
  features: Feature[];
};

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <section className="mt-6 space-y-4 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          {title}
        </p>
        {subtitle ? (
          <p className="text-sm text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            {feature.badge ? (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                {feature.badge}
              </span>
            ) : null}
            <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {feature.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

