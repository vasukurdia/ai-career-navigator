"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Map,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chat", icon: MessageSquare, label: "AI Advisor" },
  { href: "/resume", icon: FileText, label: "Resume" },
  { href: "/roadmap", icon: Map, label: "Roadmap" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 flex flex-col z-20 shadow-sm">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold text-foreground">
            AI Career<span className="text-gradient"> Navigator</span>
          </span>
        </Link>
      </div>

      {/* AI Badge */}
      <div className="mx-4 mt-4 mb-2 flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-teal-700">Gemini AI Active</span>
        <Sparkles className="w-3 h-3 text-teal-500 ml-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-teal-600" : "text-slate-400"
                )}
              />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Signout */}
      <div className="p-3 border-t border-slate-100">
        <SignOutButton redirectUrl="/">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group">
            <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
