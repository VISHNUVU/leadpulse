"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dbQuery, dbTransaction } from "@/lib/db";
import { clearSession, getCurrentUser, hashPassword, requireUser, setSession, verifyPassword } from "@/lib/auth";
import { hasDatabaseConfig } from "@/lib/env";
import type { Route } from "next";

function missingEnvRedirect(path: string) {
  redirect(`${path}?error=${encodeURIComponent("Add DATABASE_URL and SESSION_SECRET in .env.local to enable live PostgreSQL auth.")}` as never);
}

export async function signInAction(formData: FormData) {
  const nextPath = String(formData.get("next") ?? "/dashboard") as Route;

  if (!hasDatabaseConfig()) {
    missingEnvRedirect("/login");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const result = await dbQuery<{ id: string; password_hash: string }>(
    "select id, password_hash from users where lower(email) = $1 limit 1",
    [email]
  );
  const user = result.rows[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    redirect("/login?error=Invalid email or password.");
  }

  await setSession(user.id);
  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signUpAction(formData: FormData) {
  if (!hasDatabaseConfig()) {
    missingEnvRedirect("/signup");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    redirect("/signup?error=Full name, email, and password are required.");
  }

  const existing = await dbQuery("select 1 from users where lower(email) = $1 limit 1", [email]);
  if (existing.rowCount) {
    redirect("/signup?error=An account with this email already exists.");
  }

  const inserted = await dbQuery<{ id: string }>(
    `insert into users (email, full_name, password_hash)
     values ($1, $2, $3)
     returning id`,
    [email, fullName, hashPassword(password)]
  );

  await setSession(inserted.rows[0].id);
  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function signOutAction() {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function completeOnboardingAction(formData: FormData) {
  if (!hasDatabaseConfig()) {
    missingEnvRedirect("/onboarding");
  }

  const user = await requireUser();
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const workspaceName = String(formData.get("workspaceName") ?? "").trim();
  const organizationType = String(formData.get("organizationType") ?? "agency");
  const industry = String(formData.get("industry") ?? "General").trim();
  const timezone = String(formData.get("timezone") ?? "Asia/Kolkata").trim();
  const currency = String(formData.get("currency") ?? "INR").trim();

  if (!organizationName || !workspaceName) {
    redirect("/onboarding?error=Organization name and workspace name are required.");
  }

  const existingMembership = await dbQuery("select 1 from workspace_members where user_id = $1 limit 1", [user.id]);
  if (existingMembership.rowCount) {
    redirect("/dashboard");
  }

  await dbTransaction(async (client) => {
    const organizationResult = await client.query<{ id: string }>(
      `insert into organizations (name, type, owner_user_id)
       values ($1, $2, $3)
       returning id`,
      [organizationName, organizationType, user.id]
    );

    const organizationId = organizationResult.rows[0].id;

    const workspaceResult = await client.query<{ id: string }>(
      `insert into workspaces (organization_id, name, industry, timezone, currency)
       values ($1, $2, $3, $4, $5)
       returning id`,
      [organizationId, workspaceName, industry, timezone, currency]
    );

    const workspaceId = workspaceResult.rows[0].id;

    await client.query(
      `insert into workspace_members (workspace_id, user_id, role)
       values ($1, $2, 'owner')`,
      [workspaceId, user.id]
    );

    const pipelineResult = await client.query<{ id: string }>(
      `insert into pipelines (workspace_id, name)
       values ($1, 'Default Pipeline')
       returning id`,
      [workspaceId]
    );

    const pipelineId = pipelineResult.rows[0].id;
    const stageResult = await client.query<{ id: string; name: string }>(
      `insert into pipeline_stages (pipeline_id, name, color, position, is_won, is_lost)
       values
       ($1, 'New', '#D9C0A0', 1, false, false),
       ($1, 'Contacted', '#E2D47B', 2, false, false),
       ($1, 'Qualified', '#7AC49B', 3, false, false),
       ($1, 'Proposal Sent', '#85A9E3', 4, false, false),
       ($1, 'Won', '#1B7F5F', 5, true, false),
       ($1, 'Lost', '#C84B31', 6, false, true)
       returning id, name`,
      [pipelineId]
    );
    const firstStageId = stageResult.rows[0].id;

    await client.query(
      `insert into whatsapp_templates (workspace_id, name, body)
       values
       ($1, 'New enquiry welcome', 'Hi {{name}}, thank you for your enquiry. I''m {{agent}} from {{workspace}}. I can help you with the next steps today.'),
       ($1, 'Follow-up reminder', 'Hi {{name}}, just checking back on your enquiry for {{campaign}}. Would you like me to reserve a call slot for you today?')`,
      [workspaceId]
    );

    const leadResult = await client.query<{ id: string }>(
      `insert into leads (
         workspace_id, assigned_to, pipeline_stage_id, full_name, company_name, phone, email, city,
         source, campaign, status, quality_status, lead_score, priority, budget_estimate,
         first_contact_at, last_contact_at, next_followup_at, created_by
       )
       values (
         $1, $2, $3, 'Rhea Menon', $4, '+91 9876543210', 'rhea@example.com', 'Kochi',
         'Meta Ads', 'Implants - Kochi', 'qualified', 'hot', 91, 'high', 85000,
         now(), now(), now() + interval '4 hours', $2
       )
       returning id`,
      [workspaceId, user.id, firstStageId, workspaceName]
    );
    const leadId = leadResult.rows[0].id;

    await client.query(
      `insert into notes (lead_id, user_id, note)
       values ($1, $2, 'Interested in financing and wants a consultation slot this week.')`,
      [leadId, user.id]
    );

    await client.query(
      `insert into lead_activities (lead_id, user_id, activity_type, description)
       values
       ($1, $2, 'created', 'Seed lead created during onboarding to make the workspace immediately usable.'),
       ($1, $2, 'whatsapp', 'Welcome WhatsApp template queued for first outreach.')`,
      [leadId, user.id]
    );

    await client.query(
      `insert into followups (workspace_id, lead_id, assigned_to, title, due_at, status, channel)
       values ($1, $2, $3, 'Send consultation details and EMI options', now() + interval '4 hours', 'pending', 'whatsapp')`,
      [workspaceId, leadId, user.id]
    );
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
