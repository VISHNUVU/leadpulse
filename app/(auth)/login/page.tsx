import { signInAction } from "@/app/actions";
import { LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(250,236,214,0.8),_transparent_35%),linear-gradient(135deg,_#f7efe4_0%,_#fbf7f1_45%,_#efe3d5_100%)] px-4">
      <Panel className="w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8d7862]">LeadPulse</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#2f251d]">Sign in to your workspace</h1>
        <p className="mt-3 text-sm text-[#6b5a47]">
          Use Supabase Auth for email/password and magic links. This screen is ready for the real auth action wiring.
        </p>
        {params.error ? <p className="mt-4 rounded-2xl bg-[#fce7e3] px-4 py-3 text-sm text-[#ab3b24]">{params.error}</p> : null}
        <form action={signInAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          <label className="block">
            <span className="mb-2 block text-sm text-[#5a4d3f]">Email</span>
            <input name="email" className="w-full rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="you@company.com" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-[#5a4d3f]">Password</span>
            <input name="password" type="password" className="w-full rounded-2xl border border-[rgba(112,92,67,0.14)] bg-white px-4 py-3" placeholder="••••••••" />
          </label>
          <button className="w-full rounded-full bg-[#1b7f5f] px-4 py-3 font-semibold text-white">Sign in</button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-[#6b5a47]">
          <span>Need a new account?</span>
          <LinkButton href="/signup" variant="secondary">
            Create account
          </LinkButton>
        </div>
      </Panel>
    </main>
  );
}
