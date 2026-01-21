import Link from "next/link";

import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";
import { AthleteRegisterForm } from "@/components/athlete/athlete-register-form";

export const metadata = {
  title: "Créer un compte athlète - Highland Games Luzarches",
  description:
    "Créez votre espace athlète pour suivre vos inscriptions, vos performances et vos résultats.",
};

export default function AthleteRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <PublicPageHero
          badge="Espace athlète"
          title="Créez votre compte et suivez vos compétitions."
          description="Un accès unique pour vous inscrire plus rapidement, suivre l'état de vos demandes et retrouver vos résultats historiques."
          actions={[
            { label: "Se connecter", href: "/login", variant: "secondary" },
            { label: "Calendrier des compétitions", href: "/calendrier" },
          ]}
        />

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Création de compte
              </p>
              <h2 className="text-2xl font-semibold">Informations personnelles</h2>
            </div>
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline"
            >
              Déjà inscrit ? Connectez-vous →
            </Link>
          </div>
          <AthleteRegisterForm />
        </section>
      </main>
    </div>
  );
}

