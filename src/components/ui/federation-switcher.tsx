"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { getCookie, setCookie } from "cookies-next";

// Types
type FederationContext = {
  name: string;
  slug: string;
  themeColor: string;
};

const FEDERATIONS: FederationContext[] = [
  { name: "Europe (Tout voir)", slug: "EU", themeColor: "#10b981" }, // Emerald (Default)
  { name: "France (AJEF)", slug: "FR", themeColor: "#3b82f6" },      // Blue
  { name: "Holland (Federatie)", slug: "NL", themeColor: "#f97316" },// Orange
];

export function FederationSwitcher() {
  const router = useRouter();
  const [currentFed, setCurrentFed] = useState<string>("EU");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = getCookie("hg_federation_context");
    if (saved) {
      setCurrentFed(saved as string);
    }
  }, []);

  const handleSelect = (slug: string) => {
    setCookie("hg_federation_context", slug, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    setCurrentFed(slug);
    setIsOpen(false);
    router.refresh(); // Refresh to apply context server-side
  };

  const activeFed = FEDERATIONS.find(f => f.slug === currentFed) || FEDERATIONS[0];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
      >
        <span 
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: activeFed.themeColor }}
        />
        <span className="font-medium text-zinc-600 dark:text-gray-300">
           {activeFed.slug}
        </span>
      </button>

      {isOpen && (
        <>
            <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-white/10 bg-white dark:bg-zinc-900 shadow-xl p-1">
            {FEDERATIONS.map((fed) => (
                <button
                key={fed.slug}
                onClick={() => handleSelect(fed.slug)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    currentFed === fed.slug
                    ? "bg-zinc-100 dark:bg-zinc-800 font-medium"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
                >
                <span 
                    className="h-2 w-2 rounded-full" 
                    style={{ backgroundColor: fed.themeColor }}
                />
                <span className="text-zinc-700 dark:text-gray-200">{fed.name}</span>
                </button>
            ))}
            </div>
        </>
      )}
    </div>
  );
}
