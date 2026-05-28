import { Panel } from "@/components/ui/panel";
import { teamMembers } from "@/lib/data";

export function RoleMatrix() {
  return (
    <Panel>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#2f251d]">Workspace access</h2>
        <p className="text-sm text-[#7a6956]">Roles stay narrow so salespeople only see the leads they own.</p>
      </div>
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-3xl border border-[rgba(112,92,67,0.12)] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0e6d8] font-semibold text-[#352c22]">
                {member.avatar}
              </div>
              <div>
                <p className="font-medium text-[#352c22]">{member.name}</p>
                <p className="text-sm capitalize text-[#7a6956]">{member.role.replaceAll("_", " ")}</p>
              </div>
            </div>
            <button className="rounded-full bg-[#f3ede3] px-3 py-1.5 text-sm font-medium text-[#352c22]">Edit role</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
