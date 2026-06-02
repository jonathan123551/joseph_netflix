"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { adminApi } from "@/lib/api-admin";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getDonations().then(data => {
      setDonations(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredDonations = donations.filter(d => 
    (!d.anonymous && (
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.email?.toLowerCase().includes(search.toLowerCase())
    )) ||
    d.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-white">Donations</h2>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search donations..." 
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
                <th className="px-6 py-4 font-medium">Donor</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-white/50">Loading donations...</td></tr>
              ) : filteredDonations.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-white/50">No donations found.</td></tr>
              ) : filteredDonations.map((don) => (
                <tr key={don.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white">
                    {don.anonymous ? (
                      <span className="italic text-white/50">Anonymous</span>
                    ) : (
                      don.user?.name || don.user?.email || "Unknown User"
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-green-500">${(don.amount / 100).toFixed(2)}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={don.message}>{don.message || '-'}</td>
                  <td className="px-6 py-4">{new Date(don.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
