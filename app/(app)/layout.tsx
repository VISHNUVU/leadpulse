import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { hasDatabaseConfig } from "@/lib/env";
import { getWorkspaceSnapshot } from "@/lib/repositories";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const snapshot = await getWorkspaceSnapshot();

  if (hasDatabaseConfig()) {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/login");
    }
  }

  const overdueCount = snapshot.followups.filter((followup) => followup.status === "overdue" || followup.status === "due_today").length;

  return (
    <AppShell overdueCount={overdueCount} workspaces={snapshot.workspaces}>
      {children}
    </AppShell>
  );
}
