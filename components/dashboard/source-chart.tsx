import { Panel } from "@/components/ui/panel";
import { reportRows } from "@/lib/data";

export function SourceChart() {
  const max = Math.max(...reportRows.map((row) => row.leads));

  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2f251d]">Lead source quality</h2>
          <p className="text-sm text-[#7a6956]">Which campaigns turn into qualified opportunities.</p>
        </div>
        <p className="text-sm text-[#1b7f5f]">Workspace specific</p>
      </div>
      <div className="space-y-4">
        {reportRows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex flex-col gap-1 text-sm text-[#5a4d3f] sm:flex-row sm:items-center sm:justify-between">
              <span>{row.label}</span>
              <span>
                {row.qualified}/{row.leads} qualified
              </span>
            </div>
            <div className="h-3 rounded-full bg-[#efe3d5]">
              <div
                className="h-3 rounded-full bg-[linear-gradient(90deg,_#1b7f5f_0%,_#54d0a1_100%)]"
                style={{ width: `${(row.leads / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
