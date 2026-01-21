"use client";

import { AIInsightCard } from "./ai-insight-card";
import { motion } from "framer-motion";

export function SmartRecommendations() {
  const recommendations = [
    {
      id: 1,
      type: "competition",
      title: "Highland Games Luzarches",
      date: "24 Septembre 2026",
      matchScore: 95,
      reason: "Proche de chez vous & catégorie Open B parfaite pour votre niveau."
    },
    {
      id: 2,
      type: "training",
      title: "Focus: Poids en Hauteur",
      reason: "Vos stats montrent une marge de progression de 15% sur cet événement."
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-2 px-1">
        🎯 Recommandations pour vous
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec) => (
          <AIInsightCard
            key={rec.id}
            title={rec.type === "competition" ? "Compétition Suggérée" : "Conseil Entraînement"}
            type="recommendation"
            confidence={rec.matchScore}
            icon={rec.type === "competition" ? "🎫" : "💪"}
          >
            <div>
              <p className="font-semibold text-white mb-1">{rec.title}</p>
              <p className="text-sm text-slate-300 mb-3">{rec.reason}</p>
              
              {rec.type === "competition" && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">{rec.date}</span>
                  <button className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-500/30 transition">
                    Voir détails
                  </button>
                </div>
              )}
            </div>
          </AIInsightCard>
        ))}
      </div>
    </div>
  );
}
