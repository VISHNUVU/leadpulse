"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChartBarBig, ClipboardCheck, LayoutDashboard, ListTodo, Settings, Users } from "lucide-react";
import { ReactNode } from "react";
import { Workspace } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Route } from "next";

const navigation: Array<{ href: Route; label: string; icon: typeof LayoutDashboard }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: ClipboardCheck },
  { href: "/follow-ups", label: "Follow-ups", icon: ListTodo },
  { href: "/reports", label: "Reports", icon: ChartBarBig },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({
  children,
  workspaces,
  overdueCount
}: {
  children: ReactNode;
  workspaces: Workspace[];
  overdueCount: number;
}) {
  const currentPath = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(250,236,214,0.85),_transparent_40%),linear-gradient(135deg,_#f7efe4_0%,_#fbf7f1_48%,_#efe3d5_100%)] text-[#261f19]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:grid-cols-[272px_1fr]">
        <aside className="rounded-[32px] bg-[#1f1d1a] p-4 text-[#f8f1e7] shadow-panel lg:p-5">
          <div className="mb-5 flex items-start justify-between gap-4 lg:mb-8 lg:block">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#cdb89f]">LeadPulse</p>
              <h1 className="mt-2 text-2xl font-semibold">CRM</h1>
              <p className="mt-2 max-w-[18rem] text-sm text-[#d7c6b5]">WhatsApp-first lead conversion control for agencies.</p>
            </div>
            <div className="rounded-full border border-[#3b352d] bg-[#28251f] px-3 py-2 text-right lg:hidden">
              <p className="text-xs uppercase tracking-[0.2em] text-[#bfa88e]">Overdue</p>
              <p className="mt-1 font-semibold">{overdueCount}</p>
            </div>
          </div>

          <div className="mb-5 rounded-[24px] border border-white/10 bg-white/5 p-4 lg:mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#bfa88e]">Workspace</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="rounded-2xl bg-white/5 p-3">
                  <p className="font-medium">{workspace.name}</p>
                  <p className="text-sm text-[#d7c6b5]">{workspace.industry} • {workspace.monthlyLeads} leads/mo</p>
                </div>
              ))}
            </div>
          </div>

          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-1.5 lg:overflow-visible lg:px-0 lg:pb-0">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = currentPath.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm transition lg:shrink",
                    active ? "bg-[#f4e8d7] text-[#231d16]" : "text-[#f8f1e7] hover:bg-white/8"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 hidden rounded-[24px] border border-[#3b352d] bg-[#28251f] p-4 lg:block">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#1b7f5f] p-2 text-white">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{overdueCount} follow-ups overdue</p>
                <p className="text-sm text-[#cdb89f]">Follow-up speed is your wedge.</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="rounded-[32px] border border-white/40 bg-[rgba(255,251,247,0.68)] p-3 shadow-panel backdrop-blur sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
