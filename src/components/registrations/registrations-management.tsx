"use client";

import { useState, useMemo } from "react";
import { updateRegistrationStatus, bulkUpdateRegistrationStatus } from "@/app/actions/registrations-admin";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RegistrationStatus } from "@prisma/client";

type Registration = {
  id: string;
  status: RegistrationStatus;
  createdAt: Date;
  athlete: {
    id: string;
    firstName: string;
    lastName: string;
    club: string | null;
    email: string | null;
    phone: string | null;
  };
  group: {
    id: string;
    name: string;
    category: string;
    competition: {
      id: string;
      name: string;
    };
  };
};

type Competition = {
  id: string;
  name: string;
  groups: Array<{
    id: string;
    name: string;
  }>;
};

type RegistrationsManagementProps = {
  registrations: Registration[];
  competitions: Competition[];
};

const statusLabels: Record<RegistrationStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
};

const statusColors: Record<RegistrationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  CONFIRMED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export function RegistrationsManagement({
  registrations,
  competitions,
}: RegistrationsManagementProps) {
  const router = useRouter();
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>("all");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<RegistrationStatus | "all">("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      if (selectedCompetitionId !== "all" && reg.group.competition.id !== selectedCompetitionId) {
        return false;
      }
      if (selectedGroupId !== "all" && reg.group.id !== selectedGroupId) {
        return false;
      }
      if (selectedStatus !== "all" && reg.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [registrations, selectedCompetitionId, selectedGroupId, selectedStatus]);

  const availableGroups = useMemo(() => {
    if (selectedCompetitionId === "all") {
      return [];
    }
    const competition = competitions.find((c) => c.id === selectedCompetitionId);
    return competition?.groups || [];
  }, [competitions, selectedCompetitionId]);

  const handleStatusChange = async (registrationId: string, status: RegistrationStatus) => {
    setLoading(registrationId);
    try {
      const result = await updateRegistrationStatus(registrationId, status);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  const handleBulkStatusChange = async (status: RegistrationStatus) => {
    if (selectedIds.size === 0) {
      alert("Sélectionnez au moins une inscription");
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir ${status === "CONFIRMED" ? "confirmer" : status === "CANCELLED" ? "annuler" : "mettre en attente"} ${selectedIds.size} inscription(s) ?`)) {
      return;
    }

    setLoading("bulk");
    try {
      const result = await bulkUpdateRegistrationStatus(Array.from(selectedIds), status);
      if (result.success) {
        setSelectedIds(new Set());
        router.refresh();
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRegistrations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRegistrations.map((r) => r.id)));
    }
  };

  const stats = useMemo(() => {
    const total = filteredRegistrations.length;
    const pending = filteredRegistrations.filter((r) => r.status === "PENDING").length;
    const confirmed = filteredRegistrations.filter((r) => r.status === "CONFIRMED").length;
    const cancelled = filteredRegistrations.filter((r) => r.status === "CANCELLED").length;
    return { total, pending, confirmed, cancelled };
  }, [filteredRegistrations]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          Inscriptions
        </p>
        <h1 className="text-2xl font-semibold">Gestion des inscriptions</h1>
        <p className="text-sm text-zinc-500">
          Visualisez et gérez les inscriptions par compétition et groupe.
        </p>
      </header>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">En attente</p>
          <p className="text-2xl font-semibold text-yellow-800 dark:text-yellow-200">{stats.pending}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Confirmées</p>
          <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">{stats.confirmed}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-xs text-red-600 dark:text-red-400">Annulées</p>
          <p className="text-2xl font-semibold text-red-800 dark:text-red-200">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Compétition
            </label>
            <select
              value={selectedCompetitionId}
              onChange={(e) => {
                setSelectedCompetitionId(e.target.value);
                setSelectedGroupId("all");
              }}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="all">Toutes les compétitions</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Groupe
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={selectedCompetitionId === "all"}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="all">Tous les groupes</option>
              {availableGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as RegistrationStatus | "all")}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedIds.size > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              {selectedIds.size} inscription(s) sélectionnée(s)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusChange("CONFIRMED")}
                disabled={loading === "bulk"}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading === "bulk" ? "..." : "Confirmer"}
              </button>
              <button
                onClick={() => handleBulkStatusChange("CANCELLED")}
                disabled={loading === "bulk"}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading === "bulk" ? "..." : "Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des inscriptions */}
      {filteredRegistrations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">Aucune inscription trouvée</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredRegistrations.length && filteredRegistrations.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium">Sélectionner tout</span>
          </div>
          {filteredRegistrations.map((registration) => (
            <div
              key={registration.id}
              className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(registration.id)}
                onChange={() => toggleSelection(registration.id)}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <p className="font-semibold">
                  {registration.athlete.firstName} {registration.athlete.lastName}
                </p>
                <p className="text-sm text-zinc-500">
                  {registration.group.competition.name} • {registration.group.name} ({registration.group.category})
                </p>
                {registration.athlete.club && (
                  <p className="text-xs text-zinc-400">{registration.athlete.club}</p>
                )}
                {registration.athlete.email && (
                  <p className="text-xs text-zinc-400">{registration.athlete.email}</p>
                )}
                <p className="mt-1 text-xs text-zinc-400">
                  Inscrit le {format(new Date(registration.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[registration.status]}`}>
                  {statusLabels[registration.status]}
                </span>
                <div className="flex gap-2">
                  {registration.status !== "CONFIRMED" && (
                    <button
                      onClick={() => handleStatusChange(registration.id, "CONFIRMED")}
                      disabled={loading === registration.id}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading === registration.id ? "..." : "Confirmer"}
                    </button>
                  )}
                  {registration.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleStatusChange(registration.id, "CANCELLED")}
                      disabled={loading === registration.id}
                      className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading === registration.id ? "..." : "Annuler"}
                    </button>
                  )}
                  {registration.status !== "PENDING" && (
                    <button
                      onClick={() => handleStatusChange(registration.id, "PENDING")}
                      disabled={loading === registration.id}
                      className="rounded-lg bg-yellow-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-yellow-700 disabled:opacity-50"
                    >
                      {loading === registration.id ? "..." : "Remettre en attente"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

