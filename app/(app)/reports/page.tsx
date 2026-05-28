import { MetricCard } from "@/components/dashboard/metric-card";
import { Topbar } from "@/components/layout/topbar";
import { ReportsTable } from "@/components/reports/reports-table";
import { getWorkspaceSnapshot } from "@/lib/repositories";

export default async function ReportsPage() {
  const snapshot = await getWorkspaceSnapshot();

  return (
    <>
      <Topbar
        title="Reports"
        description="Show clients the difference between raw leads and actual qualified sales opportunities by source, campaign, and salesperson."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ReportsTable rows={snapshot.reportRows} />
        <div className="space-y-4">
          <div className="rounded-[28px] border border-[rgba(112,92,67,0.12)] bg-[rgba(255,251,247,0.9)] p-5 shadow-panel">
            <h2 className="text-lg font-semibold text-[#2f251d]">Salesperson performance</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-3xl bg-white p-4">
                <span>Jude Thomas</span>
                <span className="font-semibold">14 qualified / 3 won</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white p-4">
                <span>Asha Rao</span>
                <span className="font-semibold">11 qualified / 4 won</span>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-[rgba(112,92,67,0.12)] bg-[rgba(255,251,247,0.9)] p-5 shadow-panel">
            <h2 className="text-lg font-semibold text-[#2f251d]">Client viewer mode</h2>
            <p className="mt-3 text-sm text-[#6b5a47]">
              Reports are structured so client viewers can inspect outcomes without editing leads or follow-up records.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
