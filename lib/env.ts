function getRequiredEnv(name: "DATABASE_URL" | "ADMIN_EMAIL" | "ADMIN_PASSWORD" | "AUTH_SECRET") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}.`);
  }

  return value;
}

export function getDatabaseUrl() {
  return getRequiredEnv("DATABASE_URL");
}

export function getAdminEmail() {
  return getRequiredEnv("ADMIN_EMAIL").toLowerCase();
}

export function getAdminPassword() {
  return getRequiredEnv("ADMIN_PASSWORD");
}

export function getAuthSecret() {
  return getRequiredEnv("AUTH_SECRET");
}

export function getAppUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!value) {
    return "http://localhost:3000";
  }

  try {
    return new URL(value).toString();
  } catch {
    return "http://localhost:3000";
  }
}
