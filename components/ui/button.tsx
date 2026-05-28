import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import type { Route } from "next";

const styles = {
  primary: "bg-[#1b7f5f] text-white hover:bg-[#15664c]",
  secondary: "bg-[#f0e6d8] text-[#352c22] hover:bg-[#e4d5c1]",
  ghost: "bg-transparent text-[#352c22] hover:bg-[#f6efe6]",
  danger: "bg-[#c84b31] text-white hover:bg-[#ab3b24]"
};

const shared =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b7f5f]";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: Route;
  children: ReactNode;
  variant?: keyof typeof styles;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(shared, styles[variant], className)} {...props} />;
}

export function LinkButton({ className, variant = "primary", href, children, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(shared, styles[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
