export type WorkspaceRole =
  | "owner"
  | "admin"
  | "manager"
  | "salesperson"
  | "client_viewer";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost";

export type QualityStatus = "hot" | "warm" | "cold" | "junk";

export type FollowupStatus = "due_today" | "overdue" | "upcoming" | "completed";

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  timezone: string;
  currency: string;
  monthlyLeads: number;
  teamSize: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: WorkspaceRole;
  avatar: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  campaign: string;
  status: LeadStatus;
  qualityStatus: QualityStatus;
  priority: "high" | "medium" | "low";
  assignedTo: string;
  assignedToName: string;
  leadScore: number;
  budget: string;
  city: string;
  lastContactAt: string;
  nextFollowupAt: string;
  createdAt: string;
  notesCount: number;
  tags: string[];
}

export interface Activity {
  id: string;
  type: "created" | "call" | "whatsapp" | "note" | "status_change" | "followup";
  title: string;
  description: string;
  createdAt: string;
  actor: string;
}

export interface Note {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Followup {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  dueAt: string;
  owner: string;
  channel: "whatsapp" | "call" | "meeting";
  status: FollowupStatus;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  tone: "neutral" | "positive" | "warning";
}

export interface ReportRow {
  label: string;
  leads: number;
  qualified: number;
  won: number;
  responseTime: string;
}

export interface WhatsappTemplate {
  id: string;
  name: string;
  body: string;
}
