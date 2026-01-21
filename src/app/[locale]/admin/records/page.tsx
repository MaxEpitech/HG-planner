"use client";

import { useEffect, useState } from "react";
import { getOfficialRecords, deleteOfficialRecord, createOfficialRecord } from "@/app/actions/official-records";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type OfficialRecord = {
  id: string;
  eventName: string;
  category: string;
  scope: string;
  performance: string;
  athleteName: string;
  date: Date | null;
  location: string | null;
};

export default function AdminRecordsPage() {
  const [records, setRecords] = useState<OfficialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterScope, setFilterScope] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    category: "Open A",
    scope: "France",
    performance: "",
    athleteName: "",
    location: "",
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const res = await getOfficialRecords();
    if (res.success && res.data) {
      setRecords(res.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce record ?")) return;
    await deleteOfficialRecord(id);
    loadRecords();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createOfficialRecord(formData);
      
      if (!res.success) {
        alert(res.error || "Une erreur est survenue");
        return;
      }

      setIsFormOpen(false);
      loadRecords();
      // Reset form
      setFormData({ ...formData, eventName: "", performance: "", athleteName: "" });
    } catch (err) {
      console.error(err);
      alert("Erreur technique");
    }
  };

  const filteredRecords = filterScope === "all" 
    ? records 
    : records.filter(r => r.scope === filterScope);

  const scopes = Array.from(new Set(records.map(r => r.scope))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Records Officiels</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Ajouter un Record
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 pb-4 overflow-x-auto">
        <button
          onClick={() => setFilterScope("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
            filterScope === "all" ? "bg-white text-slate-900" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          Tout voir
        </button>
        {scopes.map(scope => (
          <button
            key={scope}
            onClick={() => setFilterScope(scope)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              filterScope === scope ? "bg-white text-slate-900" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {scope}
          </button>
        ))}
      </div>

      {/* Add Form (Simple Inline for now) */}
      {isFormOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-6 rounded-xl border border-white/10 mb-6"
        >
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <input 
              placeholder="Épreuve (ex: Pierre)" 
              required
              className="bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
              value={formData.eventName}
              onChange={e => setFormData({...formData, eventName: e.target.value})}
            />
            <input 
              placeholder="Catégorie (ex: Open A)" 
              required
              className="bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            />
            <select
              className="bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
              value={formData.scope}
              onChange={e => setFormData({...formData, scope: e.target.value})}
            >
              <option value="France">France</option>
              <option value="Europe">Europe</option>
              <option value="Belgique">Belgique</option>
              <option value="Allemagne">Allemagne</option>
              <option value="Suisse">Suisse</option>
              <option value="Hollande">Hollande</option>
            </select>
            <input 
              placeholder="Performance (ex: 10.50m)" 
              required
              className="bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
              value={formData.performance}
              onChange={e => setFormData({...formData, performance: e.target.value})}
            />
            <input 
              placeholder="Athlète (ex: Scott Rider)" 
              required
              className="bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
              value={formData.athleteName}
              onChange={e => setFormData({...formData, athleteName: e.target.value})}
            />
            <input 
              placeholder="Lieu (ex: Bressuire)" 
              className="bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
            
            <div className="flex gap-2 lg:col-span-3 justify-end mt-2">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-medium"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
            <tr>
              <th className="p-4">Portée</th>
              <th className="p-4">Épreuve</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Performance</th>
              <th className="p-4">Athlète</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Chargement...</td></tr>
            ) : filteredRecords.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucun record trouvé.</td></tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-medium text-white">{record.scope}</td>
                  <td className="p-4">{record.eventName}</td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-white/10">
                      {record.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-emerald-400">{record.performance}</td>
                  <td className="p-4 text-white">
                    {record.athleteName}
                    {record.date && (
                      <span className="block text-xs text-slate-500">
                        {format(new Date(record.date), "d MMM yyyy", { locale: fr })}
                        {record.location && ` • ${record.location}`}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="text-slate-500 hover:text-red-400 p-2"
                      title="Supprimer"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
