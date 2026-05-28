import { CalendarDays, Search, Sparkles } from "lucide-react";

export function Topbar({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-[rgba(112,92,67,0.1)] pb-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.04em] text-[#2e251c] sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b5a47]">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
        <div className="flex min-w-0 items-center gap-3 rounded-full border border-[rgba(112,92,67,0.14)] bg-white px-4 py-2.5 text-sm text-[#6b5a47]">
          <Search className="h-4 w-4" />
          <span className="truncate">Search leads, campaigns, workspaces</span>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-[rgba(112,92,67,0.14)] bg-white px-4 py-2.5 text-sm text-[#352c22]">
          <CalendarDays className="h-4 w-4 text-[#1b7f5f]" />
          24 May 2026 - 28 May 2026
        </div>
        <div className="flex items-center gap-3 rounded-full bg-[#1f1d1a] px-4 py-2.5 text-sm text-white">
          <Sparkles className="h-4 w-4 text-[#6ae2af]" />
          Agency Performance View
        </div>
      </div>
    </header>
  );
}
