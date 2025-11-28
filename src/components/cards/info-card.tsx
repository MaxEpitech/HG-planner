type InfoCardProps = {
  title: string;
  subtitle?: string;
  items: Array<{
    label: string;
    description: string;
  }>;
};

export function InfoCard({ title, subtitle, items }: InfoCardProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          {title}
        </p>
        {subtitle ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        ) : null}
      </header>
      <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
        {items.map((item) => (
          <li key={item.label}>
            <p className="font-semibold">{item.label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

