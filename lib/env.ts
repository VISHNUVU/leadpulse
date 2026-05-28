export function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return url;
}

export function getSessionCookieName() {
  return process.env.SESSION_COOKIE_NAME || "leadpulse_session";
}

export function getSessionSecret() {
  return process.env.SESSION_SECRET || "leadpulse-local-session-secret";
}
