"use client";

import { useState } from "react";
import Link from "next/link";
import { CreateCompetitionModal } from "./create-competition-modal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Competition = {
  id: string;
  name: string;
  description: string | null;
  location: string;
  startDate: Date;
  endDate: Date;
  status: string;
  _count: {
    groups: number;
  };
  groups: Array<{
    maxAthletes: number;
    _count: {
      registrations: number;
    };
  }>;
};

type CompetitionListProps = {
  competitions: Competition[];
};

export function CompetitionList({ competitions }: CompetitionListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "d MMMM yyyy", { locale: fr });
    } catch {
      return new Date(date).toLocaleDateString("fr-FR");
    }
  };

  const getTotalMaxAthletes = (competition: Competition) => {
    return competition.groups.reduce((sum, group) => sum + group.maxAthletes, 0);
  };

  const getTotalRegistrations = (competition: Competition) => {
    return competition.groups.reduce(
      (sum, group) => sum + group._count.registrations,
      0
    );
  };

  return (
    <>
      <div className="space-y-4">
        {competitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center dark:border-zinc-700 dark:bg-transparent">
            <p className="text-lg font-semibold">Aucune compétition</p>
            <p className="text-sm text-zinc-500">
              Créez votre première compétition pour commencer.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Créer un événement
            </button>
          </div>
        ) : (
          <>
            {competitions.map((competition) => {
              const totalMax = getTotalMaxAthletes(competition);
              const totalReg = getTotalRegistrations(competition);

              return (
                <article
                  key={competition.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <Link
                      href={`/admin/competitions/${competition.id}`}
                      className="text-lg font-semibold text-zinc-900 hover:text-emerald-600 dark:text-zinc-50 dark:hover:text-emerald-400"
                    >
                      {competition.name}
                    </Link>
                    <p className="text-sm text-zinc-500">
                      {formatDate(competition.startDate)}
                      {competition.startDate.getTime() !==
                        competition.endDate.getTime() && (
                        <> - {formatDate(competition.endDate)}</>
                      )}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {competition.location} •                       {competition._count.groups} groupe
                      {competition._count.groups > 1 ? "s" : ""} • {totalReg}/
                      {totalMax} athl&egrave;tes
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
                      {competition.status === "draft"
                        ? "Brouillon"
                        : competition.status === "open"
                          ? "Ouverte"
                          : competition.status}
                    </span>
                    <Link
                      href={`/admin/competitions/${competition.id}`}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      Configurer
                    </Link>
                  </div>
                </article>
              );
            })}

            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center dark:border-zinc-700 dark:bg-transparent">
              <p className="text-lg font-semibold">Nouvelle compétition</p>
              <p className="text-sm text-zinc-500">
                Ajoutez les informations cl&eacute;s et invitez votre &eacute;quipe
                d&apos;organisation.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Créer un événement
              </button>
            </div>
          </>
        )}
      </div>

      <CreateCompetitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

