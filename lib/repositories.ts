import { unstable_noStore as noStore } from "next/cache";
import { activitiesByLead, dashboardMetrics, followups, leads, notesByLead, reportRows, teamMembers, whatsappTemplates, workspaces } from "@/lib/data";
import { dbQuery } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { Activity, DashboardMetric, Followup, Lead, Note, ReportRow, TeamMember, WhatsappTemplate, Workspace } from "@/lib/types";

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

type DbWorkspace = {
  id: string;
  name: string;
  industry: string | null;
  timezone: string;
  currency: string;
  lead_count?: string;
  team_size?: string;
};

type DbMember = {
  id: string;
  full_name: string | null;
  role: TeamMember["role"];
};

type DbLead = {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  source: string | null;
  campaign: string | null;
  status: Lead["status"];
  quality_status: Lead["qualityStatus"];
  lead_score: number | null;
  priority: Lead["priority"] | null;
  budget_estimate: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
  last_contact_at: string | null;
  next_followup_at: string | null;
  created_at: string;
  notes_count?: string;
};

type DbFollowup = {
  id: string;
  lead_id: string;
  title: string;
  due_at: string;
  channel: Followup["channel"] | null;
  completed_at: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
  lead_name: string | null;
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

function mapLead(record: DbLead): Lead {
  return {
    id: record.id,
    name: record.full_name,
    company: record.company_name ?? "Workspace lead",
    phone: record.phone ?? "",
    email: record.email ?? "",
    source: record.source ?? "Manual",
    campaign: record.campaign ?? "Unattributed",
    status: record.status ?? "new",
    qualityStatus: record.quality_status ?? "warm",
    priority: record.priority ?? "medium",
    assignedTo: record.assigned_to ?? "",
    assignedToName: record.assigned_to_name ?? "Unassigned",
    leadScore: Number(record.lead_score ?? 0),
    budget: record.budget_estimate ? `₹${record.budget_estimate}` : "Not set",
    city: record.city ?? "Unknown",
    lastContactAt: record.last_contact_at ?? record.created_at,
    nextFollowupAt: record.next_followup_at ?? record.created_at,
    createdAt: record.created_at,
    notesCount: Number(record.notes_count ?? 0),
    tags: []
  };
}

function mapFollowup(record: DbFollowup): Followup {
  const dueTime = new Date(record.due_at).getTime();
  const now = Date.now();
  let status: Followup["status"] = "upcoming";

  if (record.completed_at) {
    status = "completed";
  } else if (dueTime < now) {
    status = "overdue";
  } else if (new Date(record.due_at).toDateString() === new Date().toDateString()) {
    status = "due_today";
  }

  return {
    id: record.id,
    leadId: record.lead_id,
    leadName: record.lead_name ?? "Unknown lead",
    title: record.title,
    dueAt: record.due_at,
    owner: record.assigned_to_name ?? "Unassigned",
    channel: record.channel ?? "whatsapp",
    status
  };
}

async function getPrimaryWorkspaceId(userId: string) {
  const membershipResult = await dbQuery<{ workspace_id: string }>(
    `select workspace_id
     from workspace_members
     where user_id = $1
     order by created_at asc
     limit 1`,
    [userId]
  );

  return membershipResult.rows[0]?.workspace_id ?? null;
}

export async function getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  noStore();

  if (!hasDatabaseConfig()) {
    return getFallbackSnapshot();
  }

  const user = await getCurrentUser();
  if (!user) {
    return getFallbackSnapshot();
  }

  try {
    const primaryWorkspaceId = await getPrimaryWorkspaceId(user.id);
    if (!primaryWorkspaceId) {
      return getFallbackSnapshot();
    }

    const [workspaceResult, memberResult, leadResult, followupResult, templateResult] = await Promise.all([
      dbQuery<DbWorkspace>(
        `select w.id, w.name, w.industry, w.timezone, w.currency,
                count(distinct l.id)::text as lead_count,
                count(distinct wm.user_id)::text as team_size
         from workspaces w
         left join leads l on l.workspace_id = w.id
         left join workspace_members wm on wm.workspace_id = w.id
         where w.id in (
           select workspace_id from workspace_members where user_id = $1
         )
         group by w.id
         order by w.created_at asc`,
        [user.id]
      ),
      dbQuery<DbMember>(
        `select u.id, u.full_name, wm.role
         from workspace_members wm
         join users u on u.id = wm.user_id
         where wm.workspace_id = $1
         order by wm.created_at asc`,
        [primaryWorkspaceId]
      ),
      dbQuery<DbLead>(
        `select l.*, u.full_name as assigned_to_name,
                (select count(*)::text from notes n where n.lead_id = l.id) as notes_count
         from leads l
         left join users u on u.id = l.assigned_to
         where l.workspace_id = $1
         order by l.created_at desc
         limit 25`,
        [primaryWorkspaceId]
      ),
      dbQuery<DbFollowup>(
        `select f.*, l.full_name as lead_name, u.full_name as assigned_to_name
         from followups f
         join leads l on l.id = f.lead_id
         left join users u on u.id = f.assigned_to
         where f.workspace_id = $1
         order by f.due_at asc`,
        [primaryWorkspaceId]
      ),
      dbQuery<WhatsappTemplate>(
        `select id, name, body
         from whatsapp_templates
         where workspace_id = $1
         order by created_at asc`,
        [primaryWorkspaceId]
      )
    ]);

    const resolvedWorkspaces: Workspace[] = workspaceResult.rows.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      industry: workspace.industry ?? "General",
      timezone: workspace.timezone,
      currency: workspace.currency,
      monthlyLeads: Number(workspace.lead_count ?? 0),
      teamSize: Number(workspace.team_size ?? 0)
    }));

    const resolvedMembers: TeamMember[] = memberResult.rows.map((member) => ({
      id: member.id,
      name: member.full_name ?? "Team member",
      role: member.role,
      avatar: (member.full_name ?? "TM").slice(0, 2).toUpperCase()
    }));

    const resolvedLeads = leadResult.rows.map(mapLead);
    const resolvedFollowups = followupResult.rows.map(mapFollowup);
    const resolvedTemplates = templateResult.rows;

    const newLeadsCount = resolvedLeads.filter((lead) => lead.status === "new").length;
    const qualifiedCount = resolvedLeads.filter((lead) => ["qualified", "proposal_sent", "won"].includes(lead.status)).length;
    const dueTodayCount = resolvedFollowups.filter((followup) => followup.status === "due_today" || followup.status === "overdue").length;
    const firstResponseMinutes = resolvedLeads.length
      ? Math.round(
          resolvedLeads.reduce((total, lead) => {
            const created = new Date(lead.createdAt).getTime();
            const contacted = new Date(lead.lastContactAt).getTime();
            return total + Math.max(0, Math.round((contacted - created) / 60000));
          }, 0) / resolvedLeads.length
        )
      : 0;

    return {
      metrics: [
        { label: "New Leads", value: String(newLeadsCount), trend: "Live from PostgreSQL", tone: "positive" },
        { label: "Due Today", value: String(dueTodayCount), trend: "Overdue items included", tone: dueTodayCount > 0 ? "warning" : "neutral" },
        { label: "Qualified", value: String(qualifiedCount), trend: "Qualified and proposal-ready leads", tone: "positive" },
        { label: "First Response", value: `${firstResponseMinutes || 0} min`, trend: "Calculated from lead activity timestamps", tone: "neutral" }
      ],
      leads: resolvedLeads,
      followups: resolvedFollowups,
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

  if (!hasDatabaseConfig()) {
    return {
      lead: fallbackLead,
      activities: activitiesByLead[leadId] ?? [],
      notes: notesByLead[leadId] ?? []
    };
  }

  try {
    const [leadResult, activityResult, noteResult] = await Promise.all([
      dbQuery<DbLead>(
        `select l.*, u.full_name as assigned_to_name,
                (select count(*)::text from notes n where n.lead_id = l.id) as notes_count
         from leads l
         left join users u on u.id = l.assigned_to
         where l.id = $1
         limit 1`,
        [leadId]
      ),
      dbQuery<{
        id: string;
        activity_type: Activity["type"];
        description: string;
        created_at: string;
        actor: string | null;
      }>(
        `select la.id, la.activity_type, la.description, la.created_at, u.full_name as actor
         from lead_activities la
         left join users u on u.id = la.user_id
         where la.lead_id = $1
         order by la.created_at desc`,
        [leadId]
      ),
      dbQuery<{
        id: string;
        note: string;
        created_at: string;
        author: string | null;
      }>(
        `select n.id, n.note, n.created_at, u.full_name as author
         from notes n
         left join users u on u.id = n.user_id
         where n.lead_id = $1
         order by n.created_at desc`,
        [leadId]
      )
    ]);

    const leadRow = leadResult.rows[0];
    if (!leadRow) {
      return {
        lead: fallbackLead,
        activities: activitiesByLead[leadId] ?? [],
        notes: notesByLead[leadId] ?? []
      };
    }

    return {
      lead: mapLead(leadRow),
      activities:
        activityResult.rows.map((activity) => ({
          id: activity.id,
          type: activity.activity_type ?? "note",
          title: String(activity.activity_type ?? "activity").replaceAll("_", " "),
          description: activity.description,
          createdAt: activity.created_at,
          actor: activity.actor ?? "Team member"
        })) ?? [],
      notes:
        noteResult.rows.map((note) => ({
          id: note.id,
          author: note.author ?? "Team member",
          body: note.note,
          createdAt: note.created_at
        })) ?? []
    };
  } catch {
    return {
      lead: fallbackLead,
      activities: activitiesByLead[leadId] ?? [],
      notes: notesByLead[leadId] ?? []
    };
  }
}
