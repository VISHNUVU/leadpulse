import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { Followup } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

export function OverdueList({ items }: { items: Followup[] }) {
  const overdue = items.filter((item) => item.status === "overdue" || item.status === "due_today");

  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2f251d]">Follow-up command center</h2>
          <p className="text-sm text-[#7a6956]">The list your managers should clear first.</p>
        </div>
        <Link href="/follow-ups" className="text-sm font-semibold text-[#1b7f5f]">
          Open queue
        </Link>
      </div>
      <div className="space-y-3">
        {overdue.map((item) => (
          <div key={item.id} className="rounded-3xl border border-[rgba(112,92,67,0.12)] bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[#2f251d]">{item.leadName}</p>
                <p className="text-sm text-[#6b5a47]">{item.title}</p>
              </div>
              <div className="text-right text-sm text-[#7a6956]">
                <p>{item.owner}</p>
                <p>{formatRelativeDate(item.dueAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
