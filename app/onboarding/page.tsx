import { completeOnboardingAction } from "@/app/actions";
import { LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default async function OnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8d7862]">Onboarding</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#2f251d]">Create your first organization and workspace</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#6b5a47]">
          This is where you wire the real Supabase-backed organization, workspace, and membership creation flow after auth succeeds.
        </p>
        {params.error ? <p className="mt-4 rounded-2xl bg-[#fce7e3] px-4 py-3 text-sm text-[#ab3b24]">{params.error}</p> : null}
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <h2 className="text-lg font-semibold text-[#2f251d]">1. Organization</h2>
          <p className="mt-3 text-sm text-[#6b5a47]">Agency or business account with owner-level access.</p>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold text-[#2f251d]">2. Workspace</h2>
          <p className="mt-3 text-sm text-[#6b5a47]">A client or business unit where leads, reports, and follow-ups live.</p>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold text-[#2f251d]">3. Team</h2>
          <p className="mt-3 text-sm text-[#6b5a47]">Invite managers, salespeople, and client viewers with narrow permissions.</p>
        </Panel>
      </section>
      <form action={completeOnboardingAction} className="mt-8 grid gap-4 rounded-[28px] border border-[rgba(112,92,67,0.12)] bg-[rgba(255,251,247,0.9)] p-6 shadow-panel md:grid-cols-2">
        <input name="organizationName" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Organization name" />
        <input name="workspaceName" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Workspace name" />
        <select name="organizationType" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3">
          <option value="agency">Agency</option>
          <option value="business">Business</option>
        </select>
        <input name="industry" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Industry" />
        <input name="timezone" defaultValue="Asia/Kolkata" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" />
        <input name="currency" defaultValue="INR" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" />
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button className="rounded-full bg-[#1b7f5f] px-4 py-3 font-semibold text-white">Create organization and workspace</button>
          <LinkButton href="/dashboard" variant="secondary">
            Continue in demo mode
          </LinkButton>
        </div>
      </form>
    </main>
  );
}
