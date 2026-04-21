"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function DashboardHeader() {
  const { user } = useUser();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{greeting},</span>
        <span className="text-sm font-semibold text-foreground leading-tight">
          {user?.firstName || "there"} 👋
        </span>
      </div>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: { avatarBox: "w-8 h-8" },
        }}
      />
    </header>
  );
}