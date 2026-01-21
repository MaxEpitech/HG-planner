"use client";

import { useState } from "react";
import { StatCard } from "./stat-card";
import { SimpleBarChart } from "./simple-bar-chart";

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "year">("30d");

  // Mock Data
  const stats = [
    { title: "Inscriptions Totales", value: 142, change: 12, trend: "up", icon: "📝", color: "emerald" },
    { title: "Taux Remplissage", value: "88%", change: 5, trend: "up", icon: "📊", color: "blue" },
    { title: "Licences Actives", value: 315, change: 8, trend: "up", icon: "🆔", color: "violet" },
    { title: "Revenu Est.", value: "4,250€", change: -2, trend: "down", icon: "💰", color: "amber" },
  ] as const;

  const barData = [
    { label: "Bressuire", value: 45 },
    { label: "Luzarches", value: 32 },
    { label: "Kaysersberg", value: 28 },
    { label: "Muletron", value: 20 },
    { label: "St Michel", value: 15 },
  ];

  const demographyData = [
    { label: "Open A", value: 85, color: "bg-emerald-500" },
    { label: "Open B", value: 65, color: "bg-emerald-400" },
    { label: "Masters", value: 45, color: "bg-teal-500" },
    { label: "Femmes", value: 32, color: "bg-fuchsia-500" },
    { label: "Légers", value: 18, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Organisateur</h2>
          <p className="text-slate-400">Vue d'ensemble des performances de la saison 2026</p>
        </div>
        
        <div className="flex rounded-lg bg-white/5 p-1">
          {(["7d", "30d", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                period === p
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p === "7d" ? "7 Jours" : p === "30d" ? "30 Jours" : "Année"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Competitions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">Compétitions les plus populaires</h3>
          <SimpleBarChart data={barData} barColor="bg-blue-500" />
        </div>

        {/* Demographics */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">Démographie par Catégorie</h3>
          <SimpleBarChart data={demographyData} />
        </div>
      </div>

      {/* Insights Section */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <div className="flex gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-amber-200">Insight IA</h3>
            <p className="mt-1 text-sm text-amber-200/80">
              Le taux de remplissage pour la catégorie "Masters" a augmenté de 15% par rapport à l'année dernière. 
              Considérez d'ajouter plus de spots pour cette catégorie à Bressuire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
