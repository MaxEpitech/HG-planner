
import { getOfficialRecords } from "@/app/actions/official-records";
import { PublicRecordsList } from "@/components/records/public-records-list";
import { TopNav } from "@/components/public/top-nav";
import { PublicPageHero } from "@/components/public/page-hero";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: "Hero"});
  return {
    title: `${t('recordsTitle')} | Highland Games Hub`,
    description: t('recordsDescription')
  };
}

export const dynamic = 'force-dynamic';

export default async function PublicRecordsPage() {
  const [result, t] = await Promise.all([
    getOfficialRecords(),
    getTranslations("Hero"),
  ]);
  const records = result.success ? result?.data || [] : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <TopNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <PublicPageHero
          badge={t("recordsBadge")}
          title={t("recordsTitle")}
          description={t("recordsDescription")}
        />

        {!result.success ? (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-50/5 p-6 text-rose-100">
            {result.error || t("recordsError")}
          </div>
        ) : (
          <PublicRecordsList records={records} />
        )}
      </main>
    </div>
  );
}
