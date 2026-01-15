"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <section className="mt-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-3">
          {title}
        </span>
        {subtitle && (
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {subtitle}
          </h2>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="h-full border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors shadow-sm hover:shadow-md bg-white dark:bg-slate-900/80">
                <CardHeader className="pb-2">
                    {feature.badge && (
                        <div className="mb-2">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                {feature.badge}
                            </span>
                        </div>
                    )}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                    </p>
                </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

