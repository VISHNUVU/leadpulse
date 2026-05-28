import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { getWorkspaceSnapshot } from "@/lib/repositories";

const stages = ["new", "contacted", "qualified", "proposal_sent", "won", "lost"] as const;

export default async function PipelinePage() {
  const snapshot = await getWorkspaceSnapshot();

  return (
    <>
      <Topbar
        title="Pipeline"
        description="A simple status-based pipeline for daily execution. Drag-and-drop can come later after the core workflow proves useful."
      />
      <section className="grid gap-4 xl:grid-cols-6">
        {stages.map((stage) => (
          <Panel key={stage} className="min-h-[420px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold capitalize text-[#2f251d]">{stage.replaceAll("_", " ")}</h2>
              <Badge tone="neutral">{snapshot.leads.filter((lead) => lead.status === stage).length}</Badge>
            </div>
            <div className="space-y-3">
              {snapshot.leads
                .filter((lead) => lead.status === stage)
                .map((lead) => (
                  <div key={lead.id} className="rounded-3xl border border-[rgba(112,92,67,0.12)] bg-white p-4">
                    <p className="font-medium text-[#352c22]">{lead.name}</p>
                    <p className="mt-1 text-sm text-[#6b5a47]">{lead.campaign}</p>
                    <p className="mt-3 text-xs text-[#8d7862]">{lead.assignedToName}</p>
                  </div>
                ))}
            </div>
          </Panel>
        ))}
      </section>
    </>
  );
}
