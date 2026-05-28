import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[rgba(112,92,67,0.12)] bg-[rgba(255,251,247,0.9)] p-5 shadow-panel backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
