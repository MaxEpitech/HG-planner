export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <svg
            className="w-32 h-32 mx-auto text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Mode Hors-ligne
        </h1>
        <p className="text-slate-400 mb-8">
          Vous n'êtes pas connecté à Internet. Certaines fonctionnalités peuvent être limitées.
        </p>

        {/* Cached Content Info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            Contenu disponible hors-ligne
          </h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Votre dashboard
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Vos inscriptions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Vos résultats récents
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Vos certificats téléchargés
            </li>
          </ul>
        </div>

        {/* Actions */}
        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition"
        >
          🔄 Réessayer
        </button>

        <p className="text-xs text-slate-500 mt-6">
          Les modifications effectuées hors-ligne seront synchronisées automatiquement lors de la reconnexion.
        </p>
      </div>
    </div>
  );
}
