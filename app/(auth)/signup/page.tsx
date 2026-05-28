import { signUpAction } from "@/app/actions";
import { LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(250,236,214,0.8),_transparent_35%),linear-gradient(135deg,_#f7efe4_0%,_#fbf7f1_45%,_#efe3d5_100%)] px-4">
      <Panel className="w-full max-w-xl p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8d7862]">LeadPulse</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#2f251d]">Create your agency workspace</h1>
        <p className="mt-3 text-sm text-[#6b5a47]">Capture leads fast, follow up on WhatsApp, and prove campaign quality to clients.</p>
        {params.error ? <p className="mt-4 rounded-2xl bg-[#fce7e3] px-4 py-3 text-sm text-[#ab3b24]">{params.error}</p> : null}
        {params.success ? <p className="mt-4 rounded-2xl bg-[#e8f7ef] px-4 py-3 text-sm text-[#14664c]">{params.success}</p> : null}
        <form action={signUpAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="fullName" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Full name" />
          <input name="email" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Work email" />
          <input className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Organization name" disabled />
          <input className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Primary workspace name" disabled />
          <select className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3">
            <option>Agency</option>
            <option>Clinic</option>
            <option>Real Estate</option>
            <option>Education</option>
          </select>
          <input name="password" type="password" className="rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="Password" />
          <button className="md:col-span-2 mt-2 w-full rounded-full bg-[#1b7f5f] px-4 py-3 font-semibold text-white">Create account</button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-[#6b5a47]">
          <span>Already have an account?</span>
          <LinkButton href="/login" variant="secondary">
            Sign in
          </LinkButton>
        </div>
      </Panel>
    </main>
  );
}
