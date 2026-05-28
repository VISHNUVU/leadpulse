import { MessageCircle, NotebookPen, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { whatsappTemplates } from "@/lib/data";
import { Activity, Lead, Note } from "@/lib/types";
import { createWhatsAppLink, formatRelativeDate } from "@/lib/utils";

export function LeadDetailRail({
  lead,
  notes = [],
  activities = [],
  templateBody
}: {
  lead: Lead;
  notes?: Note[];
  activities?: Activity[];
  templateBody?: string;
}) {
  const template = whatsappTemplates[0];
  const message = (templateBody ?? template.body)
    .replace("{{name}}", lead.name)
    .replace("{{agent}}", lead.assignedToName)
    .replace("{{workspace}}", lead.company)
    .replace("{{campaign}}", lead.campaign);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#7a6956]">Selected lead</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#2f251d]">{lead.name}</h2>
            <p className="mt-1 text-sm text-[#6b5a47]">{lead.company}</p>
          </div>
          <Badge tone={lead.qualityStatus}>{lead.qualityStatus}</Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-[#f8f1e7] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8d7862]">Budget</p>
            <p className="mt-2 text-lg font-semibold">{lead.budget}</p>
          </div>
          <div className="rounded-3xl bg-[#f8f1e7] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8d7862]">Lead score</p>
            <p className="mt-2 text-lg font-semibold">{lead.leadScore}/100</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href={createWhatsAppLink(lead.phone, message)} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp now
          </LinkButton>
          <LinkButton href={`tel:${lead.phone}`} variant="secondary" className="gap-2">
            <PhoneCall className="h-4 w-4" />
            Call lead
          </LinkButton>
        </div>

        <div className="mt-5 rounded-3xl border border-[rgba(112,92,67,0.12)] bg-white p-4">
          <p className="text-sm font-semibold text-[#352c22]">Template to send</p>
          <p className="mt-2 text-sm text-[#6b5a47]">{message}</p>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-[#1b7f5f]" />
          <h3 className="text-lg font-semibold text-[#2f251d]">Notes</h3>
        </div>
        <div className="mt-4 space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-[#7a6956]">No notes yet. First response quality should be logged here.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-3xl bg-[#fbf6f0] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-[#352c22]">{note.author}</p>
                  <p className="text-xs text-[#7a6956]">{formatRelativeDate(note.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm text-[#6b5a47]">{note.body}</p>
              </div>
            ))
          )}
        </div>
      </Panel>

      <Panel>
        <h3 className="text-lg font-semibold text-[#2f251d]">Timeline</h3>
        <div className="mt-4 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border-l border-[#d7c6b5] pl-4">
              <p className="font-medium text-[#352c22]">{activity.title}</p>
              <p className="mt-1 text-sm text-[#6b5a47]">{activity.description}</p>
              <p className="mt-1 text-xs text-[#8d7862]">
                {activity.actor} • {formatRelativeDate(activity.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
