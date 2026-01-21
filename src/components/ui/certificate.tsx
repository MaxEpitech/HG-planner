"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type CertificateData = {
  athleteName: string;
  competitionName: string;
  location: string;
  date: string;
  category: string;
  certificateId: string;
};

type CompetitionCertificateProps = {
  data: CertificateData;
  onDownload?: () => void;
};

export function CompetitionCertificate({ data, onDownload }: CompetitionCertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (A4 landscape: 297mm x 210mm @ 72 DPI = 842 x 595)
    canvas.width = 842;
    canvas.height = 595;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 842, 595);
    gradient.addColorStop(0, "#0f172a"); // slate-900
    gradient.addColorStop(1, "#1e293b"); // slate-800
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 842, 595);

    // Border
    ctx.strokeStyle = "#10b981"; // emerald-500
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 802, 555);

    // Inner border
    ctx.strokeStyle = "#34d399"; // emerald-400
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 782, 535);

    // Logo area (placeholder - would use actual logo)
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏴 HIGHLAND GAMES EUROPE", 421, 80);

    // Title
    ctx.fillStyle = "#fbbf24"; // amber-400
    ctx.font = "bold 48px Arial";
    ctx.fillText("CERTIFICAT DE PARTICIPATION", 421, 150);

    // Decorative line
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 170);
    ctx.lineTo(642, 170);
    ctx.stroke();

    // Main text
    ctx.fillStyle = "#e2e8f0"; // slate-200
    ctx.font = "24px Arial";
    ctx.fillText("Décerné à", 421, 220);

    // Athlete name (highlighted)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.fillText(data.athleteName.toUpperCase(), 421, 270);

    // Competition details
    ctx.fillStyle = "#cbd5e1"; // slate-300
    ctx.font = "20px Arial";
    ctx.fillText("Pour sa participation à", 421, 320);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 28px Arial";
    ctx.fillText(data.competitionName, 421, 360);

    // Date and location
    ctx.fillStyle = "#94a3b8"; // slate-400
    ctx.font = "18px Arial";
    ctx.fillText(`${data.location} • ${data.date}`, 421, 400);
    ctx.fillText(`Catégorie: ${data.category}`, 421, 430);

    // QR Code placeholder
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(50, 450, 100, 100);
    ctx.fillStyle = "#000000";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("QR Code", 70, 505);
    ctx.fillText(data.certificateId.slice(0, 10), 60, 520);

    // Signature line
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(600, 520);
    ctx.lineTo(750, 520);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Organisateur", 675, 540);

    // Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `certificat_${data.athleteName.replace(/\s+/g, "_")}_${data.certificateId.slice(0, 8)}.png`;
    link.href = dataUrl;
    link.click();

    onDownload?.();
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4">
          📜 Aperçu du Certificat
        </h3>
        
        <div className="relative aspect-[842/595] max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-4 border-emerald-500 p-8 shadow-2xl">
          {/* Preview content */}
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="text-emerald-500 text-2xl font-bold">
              🏴 HIGHLAND GAMES EUROPE
            </div>
            
            <div>
              <h2 className="text-amber-400 text-4xl font-bold mb-2">
                CERTIFICAT DE PARTICIPATION
              </h2>
              <div className="h-0.5 w-64 mx-auto bg-emerald-500" />
            </div>

            <div className="space-y-4">
              <p className="text-slate-300 text-lg">Décerné à</p>
              <p className="text-white text-3xl font-bold">
                {data.athleteName.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300">Pour sa participation à</p>
              <p className="text-emerald-400 text-2xl font-bold">
                {data.competitionName}
              </p>
              <p className="text-slate-400 text-sm">
                {data.location} • {data.date}
              </p>
              <p className="text-slate-400 text-sm">
                Catégorie: {data.category}
              </p>
            </div>

            <div className="absolute bottom-6 left-6 text-xs text-slate-500">
              ID: {data.certificateId.slice(0, 12)}
            </div>
          </div>
        </div>

        {/* Hidden canvas for PDF generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePDF}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger le certificat
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partager
        </motion.button>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
        <p className="text-sm text-blue-100">
          💡 <strong>Astuce:</strong> Ce certificat contient un identifiant unique pour vérification.
          Vous pouvez le partager sur les réseaux sociaux ou l'imprimer.
        </p>
      </div>
    </div>
  );
}
