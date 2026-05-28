import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const tones = {
  hot: "bg-[#e8f7ef] text-[#14664c]",
  warm: "bg-[#fff1dd] text-[#9a5d11]",
  cold: "bg-[#ebeaf8] text-[#4b4e99]",
  junk: "bg-[#fce7e3] text-[#ab3b24]",
  success: "bg-[#e8f7ef] text-[#14664c]",
  neutral: "bg-[#f3ede3] text-[#5a4d3f]",
  danger: "bg-[#fce7e3] text-[#ab3b24]"
};

type BadgeTone = keyof typeof tones;

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)} {...props} />
  );
}
