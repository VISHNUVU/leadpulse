import { LeadDetailRail } from "@/components/leads/lead-detail-rail";
import { LeadsTable } from "@/components/leads/leads-table";
import { Topbar } from "@/components/layout/topbar";
import { Panel } from "@/components/ui/panel";
import { getLeadDetails, getWorkspaceSnapshot } from "@/lib/repositories";

export default async function LeadsPage() {
  const snapshot = await getWorkspaceSnapshot();
  const primaryLead = snapshot.leads[0];
  const leadDetails = primaryLead ? await getLeadDetails(primaryLead.id) : null;

  return (
    <>
      <Topbar
        title="Leads"
        description="Track every lead from campaign source to follow-up owner, with quality status and next action visible at a glance."
      />
      <section className="mb-4 grid gap-4 lg:grid-cols-3">
        <Panel>
          <p className="text-sm text-[#7a6956]">Filters</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {["Meta Ads", "Google Ads", "High priority", "Qualified", "Assigned to me"].map((filter) => (
              <span key={filter} className="rounded-full bg-[#f3ede3] px-3 py-1.5 text-[#5a4d3f]">
                {filter}
              </span>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-sm text-[#7a6956]">Bulk actions</p>
          <p className="mt-3 text-lg font-semibold text-[#352c22]">Assign owner, update stage, export selection</p>
        </Panel>
        <Panel>
          <p className="text-sm text-[#7a6956]">Capture paths</p>
          <p className="mt-3 text-lg font-semibold text-[#352c22]">Manual entry, CSV import, Meta or form integrations next.</p>
        </Panel>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.6fr_0.85fr]">
        <LeadsTable items={snapshot.leads} />
        {primaryLead && leadDetails ? (
          <LeadDetailRail lead={primaryLead} activities={leadDetails.activities} notes={leadDetails.notes} />
        ) : null}
      </section>
    </>
  );
}
