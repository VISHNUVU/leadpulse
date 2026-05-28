import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PoolClient } from "pg";
import { dbQuery } from "@/lib/db";
import { getSessionCookieName } from "@/lib/env";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

type SessionUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, derived] = storedHash.split(":");
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(derived, "hex");
  return timingSafeEqual(actual, expected);
}

export async function setSession(userId: string, client?: PoolClient) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  if (client) {
    await client.query(
      `insert into sessions (user_id, token_hash, expires_at)
       values ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );
  } else {
    await dbQuery(
      `insert into sessions (user_id, token_hash, expires_at)
       values ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: expiresAt
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (token) {
    await dbQuery("delete from sessions where token_hash = $1", [hashToken(token)]);
  }

  cookieStore.delete(getSessionCookieName());
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return null;
  }

  const result = await dbQuery<SessionUser>(
    `select users.id, users.email, users.full_name, users.phone
     from sessions
     join users on users.id = sessions.user_id
     where sessions.token_hash = $1
       and sessions.expires_at > now()
     limit 1`,
    [hashToken(token)]
  );

  return result.rows[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
