import { unstable_noStore as noStore } from "next/cache";
import { activitiesByLead, dashboardMetrics, followups, leads, notesByLead, reportRows, teamMembers, whatsappTemplates, workspaces } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase";
import { Activity, DashboardMetric, Followup, Lead, Note, ReportRow, TeamMember, WhatsappTemplate, Workspace } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/env";

type WorkspaceSnapshot = {
  metrics: DashboardMetric[];
  leads: Lead[];
  followups: Followup[];
  reportRows: ReportRow[];
  workspaces: Workspace[];
  teamMembers: TeamMember[];
  whatsappTemplates: WhatsappTemplate[];
};

type LeadDetails = {
  lead: Lead | null;
  activities: Activity[];
  notes: Note[];
};

function getFallbackSnapshot(): WorkspaceSnapshot {
  return {
    metrics: dashboardMetrics,
    leads,
    followups,
    reportRows,
    workspaces,
    teamMembers,
    whatsappTemplates
  };
}

function mapLead(record: Record<string, unknown>, membersById: Map<string, TeamMember>): Lead {
  const assignedTo = String(record.assigned_to ?? "");
  const member = membersById.get(assignedTo);
  return {
    id: String(record.id),
    name: String(record.full_name ?? "Unnamed lead"),
    company: String(record.company_name ?? "Workspace lead"),
    phone: String(record.phone ?? ""),
    email: String(record.email ?? ""),
    source: String(record.source ?? "Manual"),
    campaign: String(record.campaign ?? "Unattributed"),
    status: (record.status as Lead["status"]) ?? "new",
    qualityStatus: (record.quality_status as Lead["qualityStatus"]) ?? "warm",
    priority: (record.priority as Lead["priority"]) ?? "medium",
    assignedTo,
    assignedToName: member?.name ?? "Unassigned",
    leadScore: Number(record.lead_score ?? 0),
    budget: record.budget_estimate ? `₹${record.budget_estimate}` : "Not set",
    city: String(record.city ?? "Unknown"),
    lastContactAt: String(record.last_contact_at ?? record.created_at ?? new Date().toISOString()),
    nextFollowupAt: String(record.next_followup_at ?? record.created_at ?? new Date().toISOString()),
    createdAt: String(record.created_at ?? new Date().toISOString()),
    notesCount: Number(record.notes_count ?? 0),
    tags: []
  };
}

function mapFollowup(record: Record<string, unknown>, leadsById: Map<string, Lead>, membersById: Map<string, TeamMember>): Followup {
  const leadId = String(record.lead_id ?? "");
  const lead = leadsById.get(leadId);
  const owner = membersById.get(String(record.assigned_to ?? ""));
  const dueAt = String(record.due_at ?? new Date().toISOString());
  const completedAt = record.completed_at ? String(record.completed_at) : null;
  const now = Date.now();
  const dueTime = new Date(dueAt).getTime();

  let status: Followup["status"] = "upcoming";
  if (completedAt) {
    status = "completed";
  } else if (dueTime < now) {
    status = "overdue";
  } else if (new Date(dueAt).toDateString() === new Date().toDateString()) {
    status = "due_today";
  }

  return {
    id: String(record.id),
    leadId,
    leadName: lead?.name ?? "Unknown lead",
    title: String(record.title ?? "Follow-up"),
    dueAt,
    owner: owner?.name ?? "Unassigned",
    channel: (record.channel as Followup["channel"]) ?? "whatsapp",
    status
  };
}

export async function getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  noStore();

  if (!hasSupabaseEnv()) {
    return getFallbackSnapshot();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return getFallbackSnapshot();
    }

    const { data: memberships } = await supabase
      .from("workspace_members")
      .select("workspace_id, role, profiles:user_id(id, full_name)")
      .order("created_at", { ascending: true });

    const primaryWorkspaceId = memberships?.[0]?.workspace_id;
    if (!primaryWorkspaceId) {
      return getFallbackSnapshot();
    }

    const { data: workspaceRows } = await supabase
      .from("workspaces")
      .select("id, name, industry, timezone, currency")
      .order("created_at", { ascending: true });

    const resolvedWorkspaces: Workspace[] =
      workspaceRows?.map((workspace) => ({
        id: String(workspace.id),
        name: String(workspace.name),
        industry: String(workspace.industry ?? "General"),
        timezone: String(workspace.timezone ?? "Asia/Kolkata"),
        currency: String(workspace.currency ?? "INR"),
        monthlyLeads: 0,
        teamSize: 0
      })) ?? workspaces;

    const { data: memberRows } = await supabase
      .from("workspace_members")
      .select("user_id, role, profiles:user_id(full_name)")
      .eq("workspace_id", primaryWorkspaceId);

    const resolvedMembers: TeamMember[] =
      memberRows?.map((member, index) => ({
        id: String(member.user_id),
        name: String((member.profiles as { full_name?: string } | null)?.full_name ?? "Team member"),
        role: member.role,
        avatar: String(((member.profiles as { full_name?: string } | null)?.full_name ?? "TM").slice(0, 2)).toUpperCase()
      })) ?? teamMembers;

    const membersById = new Map(resolvedMembers.map((member) => [member.id, member]));

    const { data: leadRows } = await supabase
      .from("leads")
      .select("*")
      .eq("workspace_id", primaryWorkspaceId)
      .order("created_at", { ascending: false });

    const resolvedLeads = (leadRows?.map((lead) => mapLead(lead, membersById)) ?? []).slice(0, 25);
    const leadsById = new Map(resolvedLeads.map((lead) => [lead.id, lead]));

    const { data: followupRows } = await supabase
      .from("followups")
      .select("*")
      .eq("workspace_id", primaryWorkspaceId)
      .order("due_at", { ascending: true });

    const resolvedFollowups = followupRows?.map((followup) => mapFollowup(followup, leadsById, membersById)) ?? [];

    const { data: templateRows } = await supabase
      .from("whatsapp_templates")
      .select("id, name, body")
      .eq("workspace_id", primaryWorkspaceId)
      .order("created_at", { ascending: true });

    const resolvedTemplates =
      templateRows?.map((template) => ({
        id: String(template.id),
        name: String(template.name),
        body: String(template.body)
      })) ?? whatsappTemplates;

    const newLeadsCount = resolvedLeads.filter((lead) => lead.status === "new").length;
    const qualifiedCount = resolvedLeads.filter((lead) => lead.status === "qualified" || lead.status === "proposal_sent" || lead.status === "won").length;
    const dueTodayCount = resolvedFollowups.filter((followup) => followup.status === "due_today" || followup.status === "overdue").length;

    const resolvedMetrics: DashboardMetric[] = [
      { label: "New Leads", value: String(newLeadsCount), trend: "Live from workspace data", tone: "positive" },
      { label: "Due Today", value: String(dueTodayCount), trend: "Includes overdue follow-ups", tone: dueTodayCount > 0 ? "warning" : "neutral" },
      { label: "Qualified", value: String(qualifiedCount), trend: "Qualified and proposal-ready leads", tone: "positive" },
      { label: "First Response", value: "Track next", trend: "Wire activity timestamps for SLA reporting", tone: "neutral" }
    ];

    return {
      metrics: resolvedMetrics,
      leads: resolvedLeads.length > 0 ? resolvedLeads : leads,
      followups: resolvedFollowups.length > 0 ? resolvedFollowups : followups,
      reportRows,
      workspaces: resolvedWorkspaces,
      teamMembers: resolvedMembers,
      whatsappTemplates: resolvedTemplates
    };
  } catch {
    return getFallbackSnapshot();
  }
}

export async function getLeadDetails(leadId: string): Promise<LeadDetails> {
  const snapshot = await getWorkspaceSnapshot();
  const fallbackLead = snapshot.leads.find((lead) => lead.id === leadId) ?? null;

  if (!hasSupabaseEnv()) {
    return {
      lead: fallbackLead,
      activities: activitiesByLead[leadId] ?? [],
      notes: notesByLead[leadId] ?? []
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: leadRow } = await supabase.from("leads").select("*").eq("id", leadId).maybeSingle();

    if (!leadRow) {
      return {
        lead: fallbackLead,
        activities: activitiesByLead[leadId] ?? [],
        notes: notesByLead[leadId] ?? []
      };
    }

    const membersById = new Map(snapshot.teamMembers.map((member) => [member.id, member]));
    const lead = mapLead(leadRow, membersById);

    const { data: activityRows } = await supabase
      .from("lead_activities")
      .select("id, activity_type, description, created_at, profiles:user_id(full_name)")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    const { data: noteRows } = await supabase
      .from("notes")
      .select("id, note, created_at, profiles:user_id(full_name)")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    return {
      lead,
      activities:
        activityRows?.map((activity) => ({
          id: String(activity.id),
          type: (activity.activity_type as Activity["type"]) ?? "note",
          title: String(activity.activity_type ?? "activity").replaceAll("_", " "),
          description: String(activity.description ?? ""),
          createdAt: String(activity.created_at ?? new Date().toISOString()),
          actor: String((activity.profiles as { full_name?: string } | null)?.full_name ?? "Team member")
        })) ?? activitiesByLead[leadId] ?? [],
      notes:
        noteRows?.map((note) => ({
          id: String(note.id),
          author: String((note.profiles as { full_name?: string } | null)?.full_name ?? "Team member"),
          body: String(note.note ?? ""),
          createdAt: String(note.created_at ?? new Date().toISOString())
        })) ?? notesByLead[leadId] ?? []
    };
  } catch {
    return {
      lead: fallbackLead,
      activities: activitiesByLead[leadId] ?? [],
      notes: notesByLead[leadId] ?? []
    };
  }
}
