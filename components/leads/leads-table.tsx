import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { Lead } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";

export function LeadsTable({ items }: { items: Lead[] }) {
  return (
    <Panel className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-[rgba(112,92,67,0.1)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f251d]">Live lead queue</h2>
          <p className="text-sm text-[#7a6956]">Searchable, assignable, and campaign-aware.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-[#f3ede3] px-3 py-1.5 text-[#5a4d3f]">High priority</span>
          <span className="rounded-full bg-[#f3ede3] px-3 py-1.5 text-[#5a4d3f]">Meta Ads</span>
        </div>
      </div>
      <div className="space-y-3 p-4 md:hidden">
        {items.map((lead) => (
          <Link
            key={lead.id}
            href={`/leads/${lead.id}`}
            className="block rounded-[24px] border border-[rgba(112,92,67,0.12)] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#352c22]">{lead.name}</p>
                <p className="text-sm text-[#7a6956]">{lead.company}</p>
              </div>
              <Badge tone={lead.qualityStatus}>{lead.qualityStatus}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#8d7862]">Campaign</p>
                <p className="mt-1 text-[#352c22]">{lead.campaign}</p>
              </div>
              <div>
                <p className="text-[#8d7862]">Assigned</p>
                <p className="mt-1 text-[#352c22]">{lead.assignedToName}</p>
              </div>
              <div>
                <p className="text-[#8d7862]">Status</p>
                <p className="mt-1 capitalize text-[#352c22]">{lead.status.replaceAll("_", " ")}</p>
              </div>
              <div>
                <p className="text-[#8d7862]">Next follow-up</p>
                <p className="mt-1 text-[#352c22]">{formatRelativeDate(lead.nextFollowupAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-[rgba(112,92,67,0.1)]">
          <thead className="bg-[#fbf6f0]">
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-[#8d7862]">
              <th className="px-5 py-3">Lead</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Campaign</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Quality</th>
              <th className="px-5 py-3">Assigned</th>
              <th className="px-5 py-3">Last contact</th>
              <th className="px-5 py-3">Next follow-up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(112,92,67,0.08)] bg-white/60">
            {items.map((lead) => (
              <tr key={lead.id} className="align-top text-sm text-[#352c22]">
                <td className="px-5 py-4">
                  <Link href={`/leads/${lead.id}`} className="block rounded-2xl hover:bg-[#faf3ea]">
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-[#7a6956]">{lead.company}</p>
                  </Link>
                </td>
                <td className="px-5 py-4">{lead.source}</td>
                <td className="px-5 py-4">
                  <p>{lead.campaign}</p>
                  <p className="mt-1 text-xs text-[#7a6956]">{lead.city}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="capitalize">{lead.status.replaceAll("_", " ")}</span>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={lead.qualityStatus}>{lead.qualityStatus}</Badge>
                </td>
                <td className="px-5 py-4">
                  <p>{lead.assignedToName}</p>
                  <p className={cn("mt-1 text-xs", lead.priority === "high" ? "text-[#ab3b24]" : "text-[#7a6956]")}>
                    {lead.priority} priority
                  </p>
                </td>
                <td className="px-5 py-4">{formatRelativeDate(lead.lastContactAt)}</td>
                <td className="px-5 py-4">{formatRelativeDate(lead.nextFollowupAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
