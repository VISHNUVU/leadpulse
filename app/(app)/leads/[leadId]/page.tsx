import { notFound } from "next/navigation";
import { LeadDetailRail } from "@/components/leads/lead-detail-rail";
import { Topbar } from "@/components/layout/topbar";
import { Panel } from "@/components/ui/panel";
import { getLeadDetails } from "@/lib/repositories";

export default async function LeadProfilePage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const leadDetails = await getLeadDetails(leadId);
  const lead = leadDetails.lead;

  if (!lead) {
    notFound();
  }

  return (
    <>
      <Topbar
        title={lead.name}
        description="Lead profile keeps source context, qualification, WhatsApp outreach, notes, and follow-up history in one place."
      />
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-lg font-semibold text-[#2f251d]">Lead snapshot</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-[#7a6956]">Phone</dt>
              <dd className="mt-1 font-medium text-[#352c22]">{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-[#7a6956]">Email</dt>
              <dd className="mt-1 font-medium text-[#352c22]">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-[#7a6956]">Campaign</dt>
              <dd className="mt-1 font-medium text-[#352c22]">{lead.campaign}</dd>
            </div>
            <div>
              <dt className="text-[#7a6956]">Assigned to</dt>
              <dd className="mt-1 font-medium text-[#352c22]">{lead.assignedToName}</dd>
            </div>
          </dl>
        </Panel>
        <LeadDetailRail lead={lead} activities={leadDetails.activities} notes={leadDetails.notes} />
      </section>
    </>
  );
}
