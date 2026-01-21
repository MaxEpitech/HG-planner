"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    if (standalone) return; // Don't show if already installed

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds or on scroll
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50"
      >
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl backdrop-blur">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>

          {/* Icon */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-4xl">📱</div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Installer Highland Games
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Accédez rapidement depuis votre écran d'accueil et profitez d'une expérience optimisée.
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-4 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Accès instantané
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Mode hors-ligne
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Notifications push
                </li>
              </ul>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition"
                >
                  Installer
                </button>
                <button
                  onClick={handleDismiss}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// iOS Install Instructions
export function IOSInstallInstructions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-blue-500/10 border-b border-blue-500/30 p-4"
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3">
        <div className="text-2xl">📲</div>
        <div className="flex-1">
          <p className="text-sm text-blue-100 font-semibold mb-1">
            Installer sur iOS
          </p>
          <p className="text-xs text-blue-200/80">
            Appuyez sur <strong>Partager</strong> <span className="inline-block">⎋</span> puis <strong>Sur l'écran d'accueil</strong>
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-blue-200 hover:text-white"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
