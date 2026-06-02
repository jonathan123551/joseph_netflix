"use client";

import { Users, Film, DollarSign, TrendingUp, Search, Bell, Settings, PieChart, ShoppingCart, Heart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-16">
        <div className="text-white/40 font-serif tracking-widest text-lg uppercase animate-pulse">Loading administration...</div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: TrendingUp },
    { name: "Analytics", href: "/admin/analytics", icon: PieChart },
    { name: "Movies", href: "/admin/movies", icon: Film },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Donations", href: "/admin/donations", icon: Heart },
    { name: "Ministries", href: "/admin/ministries", icon: Users }, // we can use another icon if needed
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-white/10 flex-shrink-0 p-6 flex flex-col gap-8 hidden md:flex">
        <div className="space-y-6">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Overview</div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto space-y-2">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors font-medium">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-white/60 text-sm">Manage movies, users, and platform settings.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-md bg-zinc-900 border border-white/10 text-white/70 hover:text-white">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
