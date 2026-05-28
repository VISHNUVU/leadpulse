import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { Followup } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

const groups = [
  { key: "overdue", label: "Overdue" },
  { key: "due_today", label: "Due today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" }
] as const;

export function FollowupsBoard({ items }: { items: Followup[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {groups.map((group) => (
        <Panel key={group.key}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2f251d]">{group.label}</h2>
            <Badge tone={group.key === "overdue" ? "danger" : "neutral"}>
              {items.filter((item) => item.status === group.key).length}
            </Badge>
          </div>
          <div className="space-y-3">
            {items
              .filter((item) => item.status === group.key)
              .map((item) => (
                <Link key={item.id} href={`/leads/${item.leadId}`} className="block rounded-3xl border border-[rgba(112,92,67,0.12)] bg-white p-4 transition hover:bg-[#faf3ea]">
                  <p className="font-medium text-[#352c22]">{item.leadName}</p>
                  <p className="mt-1 text-sm text-[#6b5a47]">{item.title}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#8d7862]">
                    <span className="capitalize">{item.channel}</span>
                    <span>{formatRelativeDate(item.dueAt)}</span>
                  </div>
                </Link>
              ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}
