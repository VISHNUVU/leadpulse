"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { hasSupabaseEnv } from "@/lib/env";
import type { Route } from "next";

function missingEnvRedirect(path: string) {
  redirect(`${path}?error=${encodeURIComponent("Add Supabase credentials in .env.local to enable live auth.")}` as never);
}

export async function signInAction(formData: FormData) {
  const nextPath = String(formData.get("next") ?? "/dashboard") as Route;

  if (!hasSupabaseEnv()) {
    missingEnvRedirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signUpAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    missingEnvRedirect("/signup");
  }

  const supabase = await createSupabaseServerClient();
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session) {
    redirect(`/signup?success=${encodeURIComponent("Account created. Check your email to confirm your signup.")}`);
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function signOutAction() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function completeOnboardingAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    missingEnvRedirect("/onboarding");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Please sign in first.");
  }

  const organizationName = String(formData.get("organizationName") ?? "");
  const workspaceName = String(formData.get("workspaceName") ?? "");
  const organizationType = String(formData.get("organizationType") ?? "agency");
  const industry = String(formData.get("industry") ?? "General");
  const timezone = String(formData.get("timezone") ?? "Asia/Kolkata");
  const currency = String(formData.get("currency") ?? "INR");

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email ?? "",
    full_name: user.user_metadata.full_name ?? null
  });

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .insert({
      name: organizationName,
      type: organizationType,
      owner_user_id: user.id
    })
    .select("id")
    .single();

  if (organizationError || !organization) {
    redirect(`/onboarding?error=${encodeURIComponent(organizationError?.message ?? "Could not create organization.")}`);
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      organization_id: organization.id,
      name: workspaceName,
      industry,
      timezone,
      currency
    })
    .select("id")
    .single();

  if (workspaceError || !workspace) {
    redirect(`/onboarding?error=${encodeURIComponent(workspaceError?.message ?? "Could not create workspace.")}`);
  }

  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner"
  });

  const { data: pipeline } = await supabase
    .from("pipelines")
    .insert({
      workspace_id: workspace.id,
      name: "Default Pipeline"
    })
    .select("id")
    .single();

  if (pipeline) {
    await supabase.from("pipeline_stages").insert([
      { pipeline_id: pipeline.id, name: "New", color: "#D9C0A0", position: 1 },
      { pipeline_id: pipeline.id, name: "Contacted", color: "#E2D47B", position: 2 },
      { pipeline_id: pipeline.id, name: "Qualified", color: "#7AC49B", position: 3 },
      { pipeline_id: pipeline.id, name: "Proposal Sent", color: "#85A9E3", position: 4 },
      { pipeline_id: pipeline.id, name: "Won", color: "#1B7F5F", position: 5, is_won: true },
      { pipeline_id: pipeline.id, name: "Lost", color: "#C84B31", position: 6, is_lost: true }
    ]);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
