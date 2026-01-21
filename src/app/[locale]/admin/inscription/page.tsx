import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";
import { OrganizerRegisterForm } from "@/components/organizer/organizer-register-form";

export const metadata = {
  title: "Créer un compte organisateur - Highland Games",
  description:
    "Demandez votre compte organisateur pour créer et gérer vos compétitions Highland Games.",
};

export default function OrganizerRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <PublicPageHero
          badge="Espace organisateur"
          title="Demandez votre compte organisateur"
          description="Créez votre demande de compte pour organiser des compétitions Highland Games. Votre compte devra être validé par un administrateur avant d'être actif."
          actions={[
            { label: "Se connecter", href: "/login", variant: "secondary" },
            { label: "Connexion athlète", href: "/athlete/login" },
          ]}
        />

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Demande de compte
              </p>
              <h2 className="text-2xl font-semibold">Informations personnelles</h2>
            </div>
            <a
              href="/login"
              className="text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline"
            >
              Déjà inscrit ? Connectez-vous →
            </a>
          </div>
          <OrganizerRegisterForm />
        </section>
      </main>
    </div>
  );
}

