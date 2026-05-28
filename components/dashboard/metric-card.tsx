import { DashboardMetric } from "@/lib/types";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Panel className="space-y-2">
      <p className="text-sm text-[#7a6956]">{metric.label}</p>
      <p className="text-3xl font-semibold tracking-[-0.04em] text-[#2f251d]">{metric.value}</p>
      <p
        className={cn(
          "text-sm",
          metric.tone === "positive" && "text-[#1b7f5f]",
          metric.tone === "warning" && "text-[#9a5d11]",
          metric.tone === "neutral" && "text-[#7a6956]"
        )}
      >
        {metric.trend}
      </p>
    </Panel>
  );
}
