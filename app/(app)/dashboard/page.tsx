import { MetricCard } from "@/components/dashboard/metric-card";
import { OverdueList } from "@/components/dashboard/overdue-list";
import { SourceChart } from "@/components/dashboard/source-chart";
import { LeadDetailRail } from "@/components/leads/lead-detail-rail";
import { LeadsTable } from "@/components/leads/leads-table";
import { Topbar } from "@/components/layout/topbar";
import { getLeadDetails, getWorkspaceSnapshot } from "@/lib/repositories";

export default async function DashboardPage() {
  const snapshot = await getWorkspaceSnapshot();
  const primaryLead = snapshot.leads[0];
  const leadDetails = primaryLead ? await getLeadDetails(primaryLead.id) : null;

  return (
    <>
      <Topbar
        title="Campaign lead command center"
        description="Keep response time low, surface overdue follow-ups, and show clients which campaigns are turning into qualified sales opportunities."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.9fr]">
        <div className="space-y-4">
          <LeadsTable items={snapshot.leads} />
          <div className="grid gap-4 xl:grid-cols-2">
            <SourceChart />
            <OverdueList />
          </div>
        </div>
        {primaryLead && leadDetails ? (
          <LeadDetailRail lead={primaryLead} activities={leadDetails.activities} notes={leadDetails.notes} />
        ) : null}
      </section>
    </>
  );
}
