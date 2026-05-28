import { FollowupsBoard } from "@/components/followups/followups-board";
import { Topbar } from "@/components/layout/topbar";
import { Panel } from "@/components/ui/panel";
import { getWorkspaceSnapshot } from "@/lib/repositories";

export default async function FollowUpsPage() {
  const snapshot = await getWorkspaceSnapshot();

  return (
    <>
      <Topbar
        title="Follow-ups"
        description="Split due, overdue, upcoming, and completed follow-ups so managers can see leakage before it becomes lost revenue."
      />
      <section className="mb-4 grid gap-4 md:grid-cols-3">
        <Panel>
          <p className="text-sm text-[#7a6956]">Due today</p>
          <p className="mt-2 text-2xl font-semibold text-[#352c22]">
            {snapshot.followups.filter((item) => item.status === "due_today").length}
          </p>
        </Panel>
        <Panel>
          <p className="text-sm text-[#7a6956]">Overdue</p>
          <p className="mt-2 text-2xl font-semibold text-[#ab3b24]">
            {snapshot.followups.filter((item) => item.status === "overdue").length}
          </p>
        </Panel>
        <Panel>
          <p className="text-sm text-[#7a6956]">Completion rate</p>
          <p className="mt-2 text-2xl font-semibold text-[#1b7f5f]">82%</p>
        </Panel>
      </section>
      <FollowupsBoard items={snapshot.followups} />
    </>
  );
}
