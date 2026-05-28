import { Topbar } from "@/components/layout/topbar";
import { RoleMatrix } from "@/components/settings/role-matrix";
import { Panel } from "@/components/ui/panel";
import { getWorkspaceSnapshot } from "@/lib/repositories";

export default async function SettingsPage() {
  const snapshot = await getWorkspaceSnapshot();

  return (
    <>
      <Topbar
        title="Settings"
        description="Manage workspace roles, WhatsApp templates, and the pieces that matter for an agency-first multi-tenant CRM."
      />
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RoleMatrix />
        <div className="space-y-4">
          <Panel>
            <h2 className="text-lg font-semibold text-[#2f251d]">WhatsApp templates</h2>
            <div className="mt-4 space-y-3">
              {snapshot.whatsappTemplates.map((template) => (
                <div key={template.id} className="rounded-3xl bg-white p-4">
                  <p className="font-medium text-[#352c22]">{template.name}</p>
                  <p className="mt-2 text-sm text-[#6b5a47]">{template.body}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <h2 className="text-lg font-semibold text-[#2f251d]">Workspace roster</h2>
            <div className="mt-4 space-y-3">
              {snapshot.workspaces.map((workspace) => (
                <div key={workspace.id} className="rounded-3xl bg-white p-4">
                  <p className="font-medium text-[#352c22]">{workspace.name}</p>
                  <p className="mt-1 text-sm text-[#6b5a47]">
                    {workspace.industry} • {workspace.teamSize} team members • {workspace.timezone}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
