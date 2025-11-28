type TimelineItem = {
  label: string;
  title: string;
  description: string;
  status: "done" | "in-progress" | "up-next";
};

const statusStyles: Record<TimelineItem["status"], string> = {
  done: "bg-emerald-600",
  "in-progress": "bg-amber-500",
  "up-next": "bg-zinc-300",
};

export function RoadmapTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
        Roadmap
      </p>
      <h2 className="mt-2 text-2xl font-semibold">
        Une plateforme pensée pour l&apos;organisation moderne
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="relative space-y-2 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${statusStyles[item.status]}`}
            />
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {item.label}
            </p>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-zinc-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

