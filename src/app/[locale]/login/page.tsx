import { useTranslations } from "next-intl";

// ...

export default function AdminLoginPage() {
  const t = useTranslations('Auth');
  // ...

      if (result?.error) {
        setError(t('errorIncorrect'));
      } else {
        // ...
        if (role === "ATHLETE") {
          setError(t('errorAthleteAccount'));
        } else {
         // ...
        }
      }
    } catch {
      setError(t('errorGeneric'));
    } finally {
      // ...
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <PublicPageHero
          badge={t('adminBadge')}
          title={t('adminLoginTitle')}
          description={t('adminLoginDesc')}
          actions={[
            { label: t('createOrganizerAccount'), href: "/admin/inscription", variant: "secondary" },
            { label: t('athleteLoginAction'), href: "/athlete/login" },
          ]}
        />

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                {t('authentication')}
              </p>
              <h2 className="text-2xl font-semibold">{t('loginIdentifiers')}</h2>
            </div>
            <Link
              href="/admin/inscription"
              className="text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline"
            >
              {t('noAccount')}
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
                  {t('email')} <span className="text-emerald-300">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholderEmail')}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                >
                  {t('password')} <span className="text-emerald-300">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('placeholderPassword')}
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
                {loading ? t('loggingIn') : t('loginButton')}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
