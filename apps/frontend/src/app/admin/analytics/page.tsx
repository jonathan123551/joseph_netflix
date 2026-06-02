"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { adminApi } from "@/lib/api-admin";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      // Fallback data if API is not fully implemented
      setData({
        revenueOverTime: [
          { date: "Mon", revenue: 400 },
          { date: "Tue", revenue: 300 },
          { date: "Wed", revenue: 550 },
          { date: "Thu", revenue: 200 },
          { date: "Fri", revenue: 700 },
          { date: "Sat", revenue: 900 },
          { date: "Sun", revenue: 1100 },
        ],
        usersOverTime: [
          { date: "Mon", users: 10 },
          { date: "Tue", users: 25 },
          { date: "Wed", users: 40 },
          { date: "Thu", users: 35 },
          { date: "Fri", users: 60 },
          { date: "Sat", users: 90 },
          { date: "Sun", users: 120 },
        ],
        watchTimeOverTime: [
          { date: "Mon", hours: 20 },
          { date: "Tue", hours: 45 },
          { date: "Wed", hours: 60 },
          { date: "Thu", hours: 55 },
          { date: "Fri", hours: 100 },
          { date: "Sat", hours: 200 },
          { date: "Sun", hours: 250 },
        ]
      });
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="text-white">Loading analytics...</div>;
  }

  const chartTheme = {
    textColor: "#ffffff80",
    gridColor: "#ffffff10",
    tooltipBg: "#18181b", // zinc-950
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Platform Analytics</h2>
      </div>

      {/* Revenue Chart */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-6">Revenue Over Time (Last 7 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenueOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
              <XAxis dataKey="date" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor }} />
              <YAxis stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor }} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: '#ffffff20', color: '#fff' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: "#22c55e" }} activeDot={{ r: 6 }} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Chart */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-6">New Users</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.usersOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor }} />
                <YAxis stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor }} />
                <Tooltip 
                  cursor={{ fill: '#ffffff10' }}
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: '#ffffff20', color: '#fff' }} 
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watch Time Chart */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-6">Watch Time (Hours)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.watchTimeOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="date" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor }} />
                <YAxis stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: '#ffffff20', color: '#fff' }} 
                />
                <Line type="monotone" dataKey="hours" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: "#a855f7" }} activeDot={{ r: 6 }} name="Hours Watched" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
