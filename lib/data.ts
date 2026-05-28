import {
  Activity,
  DashboardMetric,
  Followup,
  Lead,
  Note,
  ReportRow,
  TeamMember,
  WhatsappTemplate,
  Workspace
} from "@/lib/types";

export const workspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Nova Dental Clinic",
    industry: "Dental",
    timezone: "Asia/Kolkata",
    currency: "INR",
    monthlyLeads: 524,
    teamSize: 6
  },
  {
    id: "ws-2",
    name: "Skyline Estates",
    industry: "Real Estate",
    timezone: "Asia/Dubai",
    currency: "AED",
    monthlyLeads: 287,
    teamSize: 4
  }
];

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Vishnu VU", role: "owner", avatar: "VV" },
  { id: "tm-2", name: "Asha Rao", role: "manager", avatar: "AR" },
  { id: "tm-3", name: "Jude Thomas", role: "salesperson", avatar: "JT" },
  { id: "tm-4", name: "Maya Khan", role: "client_viewer", avatar: "MK" }
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Rhea Menon",
    company: "Nova Dental Clinic",
    phone: "+91 9876543210",
    email: "rhea@example.com",
    source: "Meta Ads",
    campaign: "Implants - Kochi",
    status: "qualified",
    qualityStatus: "hot",
    priority: "high",
    assignedTo: "tm-3",
    assignedToName: "Jude Thomas",
    leadScore: 91,
    budget: "₹85,000",
    city: "Kochi",
    lastContactAt: "2026-05-28T09:00:00+05:30",
    nextFollowupAt: "2026-05-28T17:30:00+05:30",
    createdAt: "2026-05-27T11:30:00+05:30",
    notesCount: 3,
    tags: ["implant", "urgent"]
  },
  {
    id: "lead-2",
    name: "Ahmed Faris",
    company: "Skyline Estates",
    phone: "+971 501112223",
    email: "ahmed@example.com",
    source: "Google Ads",
    campaign: "Downtown Villas",
    status: "contacted",
    qualityStatus: "warm",
    priority: "medium",
    assignedTo: "tm-2",
    assignedToName: "Asha Rao",
    leadScore: 73,
    budget: "AED 1.8M",
    city: "Dubai",
    lastContactAt: "2026-05-28T10:20:00+04:00",
    nextFollowupAt: "2026-05-29T11:00:00+04:00",
    createdAt: "2026-05-27T15:15:00+04:00",
    notesCount: 1,
    tags: ["villa", "investor"]
  },
  {
    id: "lead-3",
    name: "Megha Nair",
    company: "Nova Dental Clinic",
    phone: "+91 9123412345",
    email: "megha@example.com",
    source: "Website Form",
    campaign: "Invisalign Landing Page",
    status: "new",
    qualityStatus: "warm",
    priority: "high",
    assignedTo: "tm-3",
    assignedToName: "Jude Thomas",
    leadScore: 68,
    budget: "₹1,20,000",
    city: "Trivandrum",
    lastContactAt: "2026-05-28T08:05:00+05:30",
    nextFollowupAt: "2026-05-28T14:00:00+05:30",
    createdAt: "2026-05-28T07:40:00+05:30",
    notesCount: 0,
    tags: ["invisalign"]
  },
  {
    id: "lead-4",
    name: "Clara John",
    company: "Nova Dental Clinic",
    phone: "+91 9988776655",
    email: "clara@example.com",
    source: "Meta Ads",
    campaign: "Smile Makeover",
    status: "proposal_sent",
    qualityStatus: "hot",
    priority: "medium",
    assignedTo: "tm-2",
    assignedToName: "Asha Rao",
    leadScore: 84,
    budget: "₹60,000",
    city: "Kottayam",
    lastContactAt: "2026-05-27T19:45:00+05:30",
    nextFollowupAt: "2026-05-30T10:30:00+05:30",
    createdAt: "2026-05-25T13:20:00+05:30",
    notesCount: 4,
    tags: ["makeover", "proposal"]
  }
];

export const activitiesByLead: Record<string, Activity[]> = {
  "lead-1": [
    {
      id: "act-1",
      type: "created",
      title: "Lead captured from Meta Ads",
      description: "Captured with source and campaign tags from implants campaign.",
      createdAt: "2026-05-27T11:30:00+05:30",
      actor: "System"
    },
    {
      id: "act-2",
      type: "whatsapp",
      title: "WhatsApp intro sent",
      description: "Template 'New enquiry welcome' used by Jude Thomas.",
      createdAt: "2026-05-27T11:41:00+05:30",
      actor: "Jude Thomas"
    },
    {
      id: "act-3",
      type: "followup",
      title: "Consultation follow-up scheduled",
      description: "Reminder set for today 5:30 PM.",
      createdAt: "2026-05-28T09:02:00+05:30",
      actor: "Jude Thomas"
    }
  ]
};

export const notesByLead: Record<string, Note[]> = {
  "lead-1": [
    {
      id: "note-1",
      author: "Jude Thomas",
      body: "Interested in implants package. Wants EMI options before booking consult.",
      createdAt: "2026-05-27T12:10:00+05:30"
    },
    {
      id: "note-2",
      author: "Asha Rao",
      body: "High intent. Keep first response under 10 minutes for similar campaigns.",
      createdAt: "2026-05-28T09:15:00+05:30"
    }
  ]
};

export const followups: Followup[] = [
  {
    id: "fu-1",
    leadId: "lead-1",
    leadName: "Rhea Menon",
    title: "Send EMI options and confirm consultation slot",
    dueAt: "2026-05-28T17:30:00+05:30",
    owner: "Jude Thomas",
    channel: "whatsapp",
    status: "due_today"
  },
  {
    id: "fu-2",
    leadId: "lead-3",
    leadName: "Megha Nair",
    title: "First response within 10 minutes",
    dueAt: "2026-05-28T14:00:00+05:30",
    owner: "Jude Thomas",
    channel: "call",
    status: "overdue"
  },
  {
    id: "fu-3",
    leadId: "lead-2",
    leadName: "Ahmed Faris",
    title: "Share villa brochure and payment plan",
    dueAt: "2026-05-29T11:00:00+04:00",
    owner: "Asha Rao",
    channel: "whatsapp",
    status: "upcoming"
  },
  {
    id: "fu-4",
    leadId: "lead-4",
    leadName: "Clara John",
    title: "Review proposal feedback",
    dueAt: "2026-05-27T17:00:00+05:30",
    owner: "Asha Rao",
    channel: "meeting",
    status: "completed"
  }
];

export const dashboardMetrics: DashboardMetric[] = [
  { label: "New Leads", value: "128", trend: "+18% vs last week", tone: "positive" },
  { label: "Due Today", value: "19", trend: "6 overdue need action", tone: "warning" },
  { label: "Qualified", value: "43", trend: "34% qualification rate", tone: "positive" },
  { label: "First Response", value: "12 min", trend: "Down from 19 min", tone: "positive" }
];

export const reportRows: ReportRow[] = [
  { label: "Meta Ads", leads: 212, qualified: 76, won: 18, responseTime: "11 min" },
  { label: "Google Ads", leads: 97, qualified: 31, won: 9, responseTime: "18 min" },
  { label: "Website Forms", leads: 53, qualified: 17, won: 4, responseTime: "9 min" },
  { label: "Referral", leads: 21, qualified: 14, won: 8, responseTime: "22 min" }
];

export const whatsappTemplates: WhatsappTemplate[] = [
  {
    id: "wt-1",
    name: "New enquiry welcome",
    body: "Hi {{name}}, thank you for your enquiry. I’m {{agent}} from {{workspace}}. I can help you with the next steps today."
  },
  {
    id: "wt-2",
    name: "Follow-up reminder",
    body: "Hi {{name}}, just checking back on your enquiry for {{campaign}}. Would you like me to reserve a call slot for you today?"
  }
];
