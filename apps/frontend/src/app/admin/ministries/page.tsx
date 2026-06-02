"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { adminApi } from "@/lib/api-admin";

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getMinistries().then(data => {
      setMinistries(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredMinistries = ministries.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-white">Ministries</h2>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search ministries..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/5 text-white/90">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-white/50">Loading ministries...</td></tr>
              ) : filteredMinistries.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-white/50">No ministries found.</td></tr>
              ) : filteredMinistries.map((min) => (
                <tr key={min.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{min.name}</td>
                  <td className="px-6 py-4">{min.email || min.contact}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full border bg-green-500/10 text-green-500 border-green-500/20">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
