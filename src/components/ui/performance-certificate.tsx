"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type PerformanceCertificateData = {
  athleteName: string;
  achievementType: "podium" | "victory" | "record";
  rank?: number;
  competitionName: string;
  eventName: string;
  performance: string;
  date: string;
  certificateId: string;
};

type PerformanceCertificateProps = {
  data: PerformanceCertificateData;
  onDownload?: () => void;
};

export function PerformanceCertificate({ data, onDownload }: PerformanceCertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getAchievementDetails = () => {
    switch (data.achievementType) {
      case "victory":
        return { title: "CERTIFICAT DE VICTOIRE", emoji: "🏆", color: "#fbbf24" };
      case "podium":
        const podiumEmoji = data.rank === 1 ? "🥇" : data.rank === 2 ? "🥈" : "🥉";
        return { title: "CERTIFICAT DE PODIUM", emoji: podiumEmoji, color: "#10b981" };
      case "record":
        return { title: "CERTIFICAT DE RECORD", emoji: "⭐", color: "#a855f7" };
    }
  };

  const generatePDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const details = getAchievementDetails();

    canvas.width = 842;
    canvas.height = 595;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 842, 595);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 842, 595);

    // Border
    ctx.strokeStyle = details.color;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 802, 555);

    ctx.strokeStyle = details.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 782, 535);

    // Achievement emoji (large)
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.fillText(details.emoji, 421, 100);

    // Logo
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px Arial";
    ctx.fillText("🏴 HIGHLAND GAMES EUROPE", 421, 140);

    // Title
    ctx.fillStyle = details.color;
    ctx.font = "bold 42px Arial";
    ctx.fillText(details.title, 421, 190);

    ctx.strokeStyle = details.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 205);
    ctx.lineTo(642, 205);
    ctx.stroke();

    // Main text
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "22px Arial";
    ctx.fillText("Décerné à", 421, 250);

    // Athlete name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Arial";
    ctx.fillText(data.athleteName.toUpperCase(), 421, 295);

    // Achievement description
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px Arial";
    
    if (data.achievementType === "podium") {
      const rankText = data.rank === 1 ? "1ère" : data.rank === 2 ? "2ème" : "3ème";
      ctx.fillText(`Pour sa ${rankText} place en`, 421, 335);
    } else if (data.achievementType === "victory") {
      ctx.fillText("Pour sa victoire en", 421, 335);
    } else {
      ctx.fillText("Pour son record en", 421, 335);
    }

    // Event name
    ctx.fillStyle = details.color;
    ctx.font = "bold 26px Arial";
    ctx.fillText(data.eventName, 421, 375);

    // Competition details
    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px Arial";
    ctx.fillText(data.competitionName, 421, 410);
    ctx.fillText(data.date, 421, 440);

    // Performance
    if (data.performance) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Performance: ${data.performance}`, 421, 480);
    }

    // Certificate ID
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`ID: ${data.certificateId}`, 50, 565);

    // Signature line
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(600, 530);
    ctx.lineTo(750, 530);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Organisateur", 675, 550);

    // Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `certificat_${data.achievementType}_${data.athleteName.replace(/\s+/g, "_")}_${data.certificateId.slice(0, 8)}.png`;
    link.href = dataUrl;
    link.click();

    onDownload?.();
  };

  const details = getAchievementDetails();

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {details.emoji} Certificat de Performance
        </h3>
        
        <div className="relative aspect-[842/595] max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-4 shadow-2xl p-8" style={{ borderColor: details.color }}>
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="text-6xl mb-2">{details.emoji}</div>
            
            <div className="text-emerald-500 text-lg font-bold">
              🏴 HIGHLAND GAMES EUROPE
            </div>
            
            <h2 className="text-3xl font-bold mb-2" style={{ color: details.color }}>
              {details.title}
            </h2>
            
            <div className="h-0.5 w-48 mx-auto" style={{ backgroundColor: details.color }} />

            <div className="space-y-3 mt-4">
              <p className="text-slate-300">Décerné à</p>
              <p className="text-white text-2xl font-bold">
                {data.athleteName.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 text-sm">
                {data.achievementType === "podium" && `${data.rank === 1 ? "1ère" : data.rank === 2 ? "2ème" : "3ème"} place en`}
                {data.achievementType === "victory" && "Pour sa victoire en"}
                {data.achievementType === "record" && "Pour son record en"}
              </p>
              <p className="text-xl font-bold" style={{ color: details.color }}>
                {data.eventName}
              </p>
              <p className="text-slate-400 text-sm">{data.competitionName}</p>
              <p className="text-slate-400 text-sm">{data.date}</p>
              {data.performance && (
                <p className="text-white text-lg font-semibold mt-3">
                  Performance: {data.performance}
                </p>
              )}
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-slate-500">
              ID: {data.certificateId.slice(0, 12)}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePDF}
          className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition"
          style={{ backgroundColor: details.color }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger
        </motion.button>
      </div>
    </div>
  );
}
