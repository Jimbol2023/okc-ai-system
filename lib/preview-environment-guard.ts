import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

export const previewEnvironmentFile = ".env.preview.local";

export type LogicalDatabaseUrlProof = {
  databaseUrlPresent: boolean;
  directUrlPresent: boolean;
  logicalDatabaseMatch: boolean | null;
  databaseUrlLogicalIdPrefix: string | null;
  directUrlLogicalIdPrefix: string | null;
  databaseUrlEndpointId: string | null;
  directUrlEndpointId: string | null;
  endpointIdentityMatch: boolean | null;
};

export type PreviewEnvFileLoadResult = {
  loaded: boolean;
  path: string;
  requiredKeysPresent: boolean;
  missingOrEmptyKeys: string[];
  appliedKeys: string[];
};

const requiredPreviewDatabaseKeys = ["DATABASE_URL", "DIRECT_URL"] as const;

function sha256Prefix(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 8);
}

function parseEnvFile(path: string) {
  const values = new Map<string, string>();
  if (!existsSync(path)) return values;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    values.set(match[1], match[2].trim().replace(/^["']|["']$/g, ""));
  }

  return values;
}

function normalizeNeonHostname(hostname: string) {
  return hostname
    .toLowerCase()
    .replace(/-pooler(?=\.)/u, "")
    .replace(/\.pooler\./u, ".")
    .replace(/\.c-\d+\./u, ".");
}

export function normalizeNeonEndpointId(value: string | null | undefined) {
  if (!value?.trim()) return null;
  return value.trim().toLowerCase().replace(/-pooler$/u, "");
}

export function parseNeonEndpointId(value: string | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    if (!/^postgres(?:ql)?:$/u.test(url.protocol) || !url.hostname) return null;
    const firstLabel = url.hostname.toLowerCase().split(".")[0];
    return normalizeNeonEndpointId(firstLabel);
  } catch {
    return null;
  }
}

export function hasExplicitProductionDatabaseUrl(env: NodeJS.ProcessEnv) {
  return Object.entries(env).some(([key, value]) => {
    if (!value?.trim()) return false;
    const normalizedKey = key.toUpperCase();
    const namesProduction = /\b(PROD|PRODUCTION)\b/u.test(normalizedKey.replace(/_/gu, " "));
    const namesDatabaseUrl = normalizedKey.includes("DATABASE_URL");
    return namesProduction && namesDatabaseUrl;
  });
}

export function parseLogicalDatabaseUrl(value: string | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    const databaseName = url.pathname.replace(/^\//u, "");
    const schema = url.searchParams.get("schema") ?? "";
    if (!/^postgres(?:ql)?:$/u.test(url.protocol) || !url.hostname || !databaseName) return null;

    return [
      url.protocol.replace(":", ""),
      normalizeNeonHostname(url.hostname),
      databaseName,
      schema,
    ].join("|");
  } catch {
    return null;
  }
}

export function createLogicalDatabaseUrlProof(env: NodeJS.ProcessEnv): LogicalDatabaseUrlProof {
  const databaseUrlLogicalId = parseLogicalDatabaseUrl(env.DATABASE_URL);
  const directUrlLogicalId = parseLogicalDatabaseUrl(env.DIRECT_URL);
  const databaseUrlEndpointId = parseNeonEndpointId(env.DATABASE_URL);
  const directUrlEndpointId = parseNeonEndpointId(env.DIRECT_URL);
  const databaseUrlPresent = Boolean(env.DATABASE_URL?.trim());
  const directUrlPresent = Boolean(env.DIRECT_URL?.trim());
  const logicalDatabaseMatch = databaseUrlPresent && directUrlPresent
    ? Boolean(databaseUrlLogicalId && directUrlLogicalId && databaseUrlLogicalId === directUrlLogicalId)
    : null;
  const endpointIdentityMatch = databaseUrlPresent && directUrlPresent
    ? Boolean(databaseUrlEndpointId && directUrlEndpointId && databaseUrlEndpointId === directUrlEndpointId)
    : null;

  return {
    databaseUrlPresent,
    directUrlPresent,
    logicalDatabaseMatch,
    databaseUrlLogicalIdPrefix: databaseUrlLogicalId ? sha256Prefix(databaseUrlLogicalId) : null,
    directUrlLogicalIdPrefix: directUrlLogicalId ? sha256Prefix(directUrlLogicalId) : null,
    databaseUrlEndpointId,
    directUrlEndpointId,
    endpointIdentityMatch,
  };
}

export function loadPreviewEnvFileStrict(path = previewEnvironmentFile): PreviewEnvFileLoadResult {
  if (!existsSync(path)) {
    return {
      loaded: false,
      path,
      requiredKeysPresent: true,
      missingOrEmptyKeys: [],
      appliedKeys: [],
    };
  }

  const values = parseEnvFile(path);
  const missingOrEmptyKeys = requiredPreviewDatabaseKeys.filter((key) => !values.get(key)?.trim());
  const appliedKeys: string[] = [];

  for (const [key, value] of values) {
    if (!value.trim()) continue;
    process.env[key] = value;
    appliedKeys.push(key);
  }

  return {
    loaded: values.size > 0,
    path,
    requiredKeysPresent: missingOrEmptyKeys.length === 0,
    missingOrEmptyKeys,
    appliedKeys,
  };
}
