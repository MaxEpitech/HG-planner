"use client";

import { useState } from "react";
import { deleteGroup } from "@/app/actions/groups";
import { deleteEvent } from "@/app/actions/events";
import { CreateGroupModal } from "./create-group-modal";
import { CreateEventModal } from "./create-event-modal";
import { CompetitionStatusToggle } from "./competition-status-toggle";
import { CompetitionTeamSection } from "./competition-team-section";

type CompetitionDetailProps = {
  competition: {
    id: string;
    name: string;
    description: string | null;
    location: string;
    startDate: Date;
    endDate: Date;
    status: string;
    groups: Array<{
      id: string;
      name: string;
      category: string;
      maxAthletes: number;
      events: Array<{
        id: string;
        name: string;
        order: number;
      }>;
      _count: {
        registrations: number;
      };
    }>;
    permissions: Array<{
      id: string;
      role: "ORGANISATEUR" | "DIRECTEUR_ATHLETIQUE";
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }>;
  };
};

export function CompetitionDetail({ competition }: CompetitionDetailProps) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      return;
    }

    setLoading(groupId);
    try {
      const result = await deleteGroup(groupId);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette épreuve ?")) {
      return;
    }

    setLoading(eventId);
    try {
      const result = await deleteEvent(eventId);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  const handleOpenEventModal = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsEventModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <header>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                Compétition
              </p>
              <h1 className="text-2xl font-semibold">{competition.name}</h1>
              <p className="text-sm text-zinc-500">{competition.location}</p>
            </div>
            <CompetitionStatusToggle
              competitionId={competition.id}
              currentStatus={competition.status}
            />
          </div>
        </header>

        <CompetitionTeamSection
          competitionId={competition.id}
          permissions={competition.permissions || []}
        />

        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Groupes</h2>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                + Ajouter un groupe
              </button>
            </div>

            {competition.groups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <p className="text-sm text-zinc-500">
                  Aucun groupe créé. Créez votre premier groupe pour commencer.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {competition.groups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-zinc-500">
                          {group.category} • {group._count.registrations}/
                          {group.maxAthletes} athlètes
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEventModal(group.id)}
                          className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          + Épreuve
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          disabled={loading === group.id}
                          className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
                        >
                          {loading === group.id ? "..." : "Supprimer"}
                        </button>
                      </div>
                    </div>

                    {group.events.length === 0 ? (
                      <p className="text-xs text-zinc-400">
                        Aucune épreuve configurée
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {group.events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900"
                          >
                            <span>
                              {event.order}. {event.name}
                            </span>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              disabled={loading === event.id}
                              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            >
                              {loading === event.id ? "..." : "Supprimer"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        competitionId={competition.id}
      />

      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedGroupId(null);
        }}
        groupId={selectedGroupId || ""}
      />
    </>
  );
}

