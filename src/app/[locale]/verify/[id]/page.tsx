import { notFound } from "next/navigation";

type CertificateVerificationPageProps = {
  params: {
    id: string;
  };
};

export default async function CertificateVerificationPage({
  params,
}: CertificateVerificationPageProps) {
  const certificateId = params.id;

  // TODO: Vérifier le certificat dans la base de données
  // Pour l'instant, on simule une vérification
  const isValid = certificateId.length >= 8;

  if (!isValid) {
    notFound();
  }

  // Simulation de données de certificat
  const certificateData = {
    id: certificateId,
    athleteName: "Jean Dupont",
    competitionName: "Highland Games Paris 2026",
    date: "15 juin 2026",
    type: "participation",
    verified: true,
    issuedAt: new Date(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏴</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Highland Games Europe
          </h1>
          <p className="text-slate-400">Vérification de Certificat</p>
        </div>

        {/* Verification Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          {certificateData.verified ? (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex-shrink-0 text-3xl">✓</div>
                <div>
                  <h2 className="text-lg font-semibold text-emerald-300">
                    Certificat Vérifié
                  </h2>
                  <p className="text-sm text-emerald-200/80">
                    Ce certificat est authentique et a été émis par Highland Games Europe
                  </p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                  Détails du Certificat
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      ID Certificat
                    </p>
                    <p className="text-lg font-mono text-white">
                      {certificateData.id}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Type
                    </p>
                    <p className="text-lg font-semibold text-emerald-300 capitalize">
                      {certificateData.type}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Athlète
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {certificateData.athleteName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Compétition
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {certificateData.competitionName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Date
                    </p>
                    <p className="text-lg  text-white">
                      {certificateData.date}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Émis le
                    </p>
                    <p className="text-lg text-white">
                      {certificateData.issuedAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-xl">🔒</div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">
                      Sécurité
                    </h4>
                    <p className="text-sm text-blue-200/80">
                      Ce certificat est protégé par un identifiant unique et ne peut être falsifié.
                      Tous les certificats Highland Games Europe sont vérifiables publiquement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-rose-400 mb-2">
                Certificat Non Valide
              </h2>
              <p className="text-slate-400">
                Ce certificat n'a pas pu être vérifié dans notre système.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
