"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";

export default function AthleteLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();
        const role = session?.user?.role;

        if (role === "ATHLETE") {
          router.push("/athlete");
          router.refresh();
        } else {
          setError("Ce compte n'est pas un compte athlète. Utilisez la page de connexion administrateur.");
        }
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <PublicPageHero
          badge="Espace athlète"
          title="Connectez-vous à votre espace athlète"
          description="Accédez à vos inscriptions, vos résultats et vos records personnels."
          actions={[
            { label: "Créer un compte", href: "/athlete/inscription", variant: "secondary" },
            { label: "Calendrier des compétitions", href: "/calendrier" },
          ]}
        />

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Connexion athlète
              </p>
              <h2 className="text-2xl font-semibold">Identifiants de connexion</h2>
            </div>
            <Link
              href="/athlete/inscription"
              className="text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline"
            >
              Pas encore de compte ? Inscrivez-vous →
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-1">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                >
                  Email <span className="text-emerald-300">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                >
                  Mot de passe <span className="text-emerald-300">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

