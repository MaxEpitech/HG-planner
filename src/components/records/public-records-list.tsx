"use client";

import { OfficialRecord } from "@prisma/client";
import { useLocale } from "next-intl";

interface PublicRecordsListProps {
  records: OfficialRecord[];
}

export function PublicRecordsList({ records }: PublicRecordsListProps) {
  const locale = useLocale();
  
  // Grouper par portée (Scope)
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.scope]) {
      acc[record.scope] = [];
    }
    acc[record.scope].push(record);
    return acc;
  }, {} as Record<string, OfficialRecord[]>);

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-300">
        <h2 className="text-xl font-semibold text-white">Aucun record disponible</h2>
        <p className="mt-2 text-sm text-slate-400">
          Aucun record officiel n'a encore été enregistré pour ce contexte.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(groupedRecords).sort().map(([scopeName, scopeRecords]) => (
        <div key={scopeName} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${
                scopeName === 'Europe' ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />
              Records {scopeName}
            </h3>
            <span className="text-sm text-slate-400">{scopeRecords.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Épreuve</th>
                  <th className="px-6 py-3 font-semibold">Catégorie</th>
                  <th className="px-6 py-3 font-semibold">Performance</th>
                  <th className="px-6 py-3 font-semibold">Athlète</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Lieu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {scopeRecords.map((record) => (
                  <tr key={record.id} className="transition hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{record.eventName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{record.performance}</td>
                    <td className="px-6 py-4 text-emerald-300">{record.athleteName}</td>
                    <td className="px-6 py-4">
                      {record.date ? new Date(record.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                    </td>
                    <td className="px-6 py-4">{record.location || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
