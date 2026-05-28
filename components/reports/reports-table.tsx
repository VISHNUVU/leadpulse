import { Panel } from "@/components/ui/panel";
import { ReportRow } from "@/lib/types";

export function ReportsTable({ rows }: { rows: ReportRow[] }) {
  return (
    <Panel className="overflow-hidden p-0">
      <div className="border-b border-[rgba(112,92,67,0.1)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[#2f251d]">Source and campaign performance</h2>
        <p className="text-sm text-[#7a6956]">The reporting wedge that agencies can show to clients.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[rgba(112,92,67,0.1)]">
          <thead className="bg-[#fbf6f0] text-left text-xs uppercase tracking-[0.2em] text-[#8d7862]">
            <tr>
              <th className="px-5 py-3">Channel</th>
              <th className="px-5 py-3">Leads</th>
              <th className="px-5 py-3">Qualified</th>
              <th className="px-5 py-3">Won</th>
              <th className="px-5 py-3">First response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(112,92,67,0.08)] bg-white/60 text-sm text-[#352c22]">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-5 py-4 font-medium">{row.label}</td>
                <td className="px-5 py-4">{row.leads}</td>
                <td className="px-5 py-4">{row.qualified}</td>
                <td className="px-5 py-4">{row.won}</td>
                <td className="px-5 py-4">{row.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
