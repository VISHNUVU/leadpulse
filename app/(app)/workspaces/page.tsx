import { Topbar } from "@/components/layout/topbar";
import { LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getWorkspaceSnapshot } from "@/lib/repositories";

export default async function WorkspacesPage() {
  const snapshot = await getWorkspaceSnapshot();

  return (
    <>
      <Topbar
        title="Client workspaces"
        description="Agencies can run multiple client accounts while keeping data, reports, and team access properly isolated."
      />
      <section className="grid gap-4 lg:grid-cols-2">
        {snapshot.workspaces.map((workspace) => (
          <Panel key={workspace.id}>
            <p className="text-sm text-[#7a6956]">{workspace.industry}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#2f251d]">{workspace.name}</h2>
            <p className="mt-2 text-sm text-[#6b5a47]">
              {workspace.monthlyLeads} leads per month • {workspace.teamSize} users • {workspace.currency}
            </p>
            <div className="mt-5 flex gap-3">
              <LinkButton href="/dashboard">Open workspace</LinkButton>
              <LinkButton href="/settings" variant="secondary">
                Manage access
              </LinkButton>
            </div>
          </Panel>
        ))}
      </section>
    </>
  );
}
