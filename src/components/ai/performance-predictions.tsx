"use client";

import { AIInsightCard } from "./ai-insight-card";
import { motion } from "framer-motion";

export function PerformancePredictions() {
  // Mock data - In real app, fetch from AI API
  const predictions = [
    {
      id: 1,
      event: "Pierre (Stone Put)",
      current: "9.50m",
      predicted: "10.15m",
      probability: 85,
      trend: "up"
    },
    {
      id: 2,
      event: "Tronc (Caber Toss)",
      current: "11:00",
      predicted: "12:00",
      probability: 60,
      trend: "stable"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-2 px-1">
        ⚡ Insights IA
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <AIInsightCard 
          title="Prédiction de Performance" 
          type="prediction" 
          confidence={85}
        >
          <div className="space-y-3 mt-2">
            <p className="text-slate-300">
              Basé sur votre progression récente, notre modèle estime que vous pouvez battre votre record au prochain événement.
            </p>
            
            <div className="space-y-2">
              {predictions.map(pred => (
                <div key={pred.id} className="flex items-center justify-between rounded-lg bg-black/20 p-2 text-sm">
                  <span className="text-white font-medium">{pred.event}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 line-through text-xs">{pred.current}</span>
                    <span className="text-fuchsia-300 font-bold flex items-center gap-1">
                      {pred.predicted}
                      <span className="text-[10px]">🚀</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AIInsightCard>

        <AIInsightCard 
          title="Opportunité de Podium" 
          type="recommendation"
          confidence={92}
          icon="🏆"
        >
          <p className="mb-3">
            La compétition <strong className="text-emerald-300">Highland Games Bressuire</strong> correspond parfaitement à votre profil.
          </p>
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-emerald-200">Probabilité de top 3</span>
              <span className="text-xs font-bold text-emerald-300">Haute</span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </div>
        </AIInsightCard>
      </div>
    </div>
  );
}
