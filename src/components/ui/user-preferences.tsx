"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type UserPreferencesProps = {
  currentPreferences?: {
    profileVisibility?: "public" | "private" | "friends";
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    shareResults?: boolean;
    language?: "fr" | "en" | "de";
    units?: "metric" | "imperial";
  };
  onSave: (preferences: any) => Promise<void>;
};

export function UserPreferences({ currentPreferences, onSave }: UserPreferencesProps) {
  const [visibility, setVisibility] = useState(currentPreferences?.profileVisibility || "public");
  const [emailNotifs, setEmailNotifs] = useState(currentPreferences?.emailNotifications ?? true);
  const [pushNotifs, setPushNotifs] = useState(currentPreferences?.pushNotifications ?? false);
  const [shareResults, setShareResults] = useState(currentPreferences?.shareResults ?? true);
  const [language, setLanguage] = useState(currentPreferences?.language || "fr");
  const [units, setUnits] = useState(currentPreferences?.units || "metric");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        profileVisibility: visibility,
        emailNotifications: emailNotifs,
        pushNotifications: pushNotifs,
        shareResults,
        language,
        units,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Privacy Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          🔒 Confidentialité
        </h3>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm font-semibold text-white">
              Visibilité du profil
            </label>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              Qui peut voir votre profil et vos performances
            </p>
            <div className="grid gap-2">
              {[
                { value: "public", label: "🌐 Public", desc: "Visible par tous" },
                { value: "private", label: "🔒 Privé", desc: "Visible uniquement par vous" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVisibility(option.value as any)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    visibility === option.value
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{option.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{option.desc}</p>
                    </div>
                    {visibility === option.value && (
                      <span className="text-emerald-400">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-white">
                  Partager mes résultats
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Autoriser le partage de vos résultats publiquement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareResults(!shareResults)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  shareResults ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    shareResults ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          🔔 Notifications
        </h3>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-white">
                  Notifications Email
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Recevoir des emails pour les événements importants
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifs ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifs ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-white">
                  Notifications Push
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Recevoir des notifications sur vos appareils
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifs(!pushNotifs)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifs ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifs ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          ⚙️ Préférences
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Langue
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="fr" className="text-slate-900">🇫🇷 Français</option>
              <option value="en" className="text-slate-900">🇬🇧 English</option>
              <option value="de" className="text-slate-900">🇩🇪 Deutsch</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Unités de mesure
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnits("metric")}
                className={`rounded-xl border p-3 text-sm font-semibold transition-all ${
                  units === "metric"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white hover:border-white/20"
                }`}
              >
                📏 Métrique (kg, m)
              </button>
              <button
                type="button"
                onClick={() => setUnits("imperial")}
                className={`rounded-xl border p-3 text-sm font-semibold transition-all ${
                  units === "imperial"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white hover:border-white/20"
                }`}
              >
                📐 Impérial (lb, ft)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Enregistrement..." : "💾 Sauvegarder les préférences"}
        </motion.button>
      </div>
    </div>
  );
}
