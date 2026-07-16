function getRequiredEnv(name: "DATABASE_URL" | "ADMIN_EMAIL" | "ADMIN_PASSWORD" | "AUTH_SECRET") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}.`);
  }

  return value;
}

export type EnvironmentValidationItem = {
  key: string;
  required: boolean;
  present: boolean;
  valid: boolean;
  severity: "info" | "warning" | "blocker";
  message: string;
};

export type EnvironmentValidationReport = {
  ok: boolean;
  environment: string;
  appUrl: string;
  coreReady: boolean;
  phase4LiveSmsReady: boolean;
  approvedExecutionExternalEnabled: boolean;
  approvedExecutionProductionSmokePassed: boolean;
  approvedExecutionExternalReady: boolean;
  killSwitchActive: boolean;
  items: EnvironmentValidationItem[];
  blockers: string[];
  warnings: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
};

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

function getEnvValue(name: string) {
  return process.env[name]?.trim() ?? "";
}

function isTruthyEnv(value: string) {
  return value.toLowerCase() === "true" || value === "1";
}

function addValidationItem(
  items: EnvironmentValidationItem[],
  input: Omit<EnvironmentValidationItem, "present" | "valid"> & {
    value: string;
    validate?: (value: string) => boolean;
  },
) {
  const present = input.value.length > 0;
  const valid = present && (input.validate ? input.validate(input.value) : true);

  items.push({
    key: input.key,
    required: input.required,
    present,
    valid: input.required ? valid : !present || valid,
    severity: input.severity,
    message: input.message,
  });
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidPhone(value: string) {
  return /^\+\d{10,15}$/.test(value);
}

function isStrongSecret(value: string) {
  return value.length >= 32;
}

export function getPhase4LiveSmsConfig() {
  const allowlistedRecipients = getEnvValue("PHASE4_ALLOWLISTED_SMS_RECIPIENTS")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  return {
    liveSmsEnabled: isTruthyEnv(getEnvValue("PHASE4_LIVE_SMS_ENABLED")),
    smsKillSwitchActive: isTruthyEnv(getEnvValue("PHASE4_SMS_KILL_SWITCH")),
    allowlistedRecipients,
    twilioAccountSid: getEnvValue("TWILIO_ACCOUNT_SID"),
    twilioAuthToken: getEnvValue("TWILIO_AUTH_TOKEN"),
    twilioFromNumber: getEnvValue("TWILIO_FROM_NUMBER"),
    twilioWebhookAuthToken: getEnvValue("TWILIO_WEBHOOK_AUTH_TOKEN"),
  };
}

export function validateProductionEnvironment(): EnvironmentValidationReport {
  const items: EnvironmentValidationItem[] = [];
  const phase4 = getPhase4LiveSmsConfig();
  const appUrl = getEnvValue("NEXT_PUBLIC_APP_URL") || getAppUrl();
  const isProductionRuntime = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  addValidationItem(items, {
    key: "DATABASE_URL",
    required: true,
    value: getEnvValue("DATABASE_URL"),
    severity: "blocker",
    message: "Primary database connection string is required.",
  });
  addValidationItem(items, {
    key: "DIRECT_URL",
    required: true,
    value: getEnvValue("DIRECT_URL"),
    severity: "blocker",
    message: "Direct database connection string is required for Supabase/Prisma migrations.",
  });
  addValidationItem(items, {
    key: "AUTH_SECRET",
    required: true,
    value: getEnvValue("AUTH_SECRET"),
    validate: isStrongSecret,
    severity: "blocker",
    message: "Auth secret must exist and be at least 32 characters.",
  });
  addValidationItem(items, {
    key: "ADMIN_EMAIL",
    required: true,
    value: getEnvValue("ADMIN_EMAIL"),
    validate: (value) => value.includes("@"),
    severity: "blocker",
    message: "Admin email is required.",
  });
  addValidationItem(items, {
    key: "ADMIN_PASSWORD",
    required: true,
    value: getEnvValue("ADMIN_PASSWORD"),
    validate: (value) => value.length >= 12,
    severity: "blocker",
    message: "Admin password must be configured and at least 12 characters.",
  });
  addValidationItem(items, {
    key: "NEXT_PUBLIC_APP_URL",
    required: true,
    value: appUrl,
    validate: isValidUrl,
    severity: "blocker",
    message: "Public app URL is required for production callbacks and deployment health.",
  });
  addValidationItem(items, {
    key: "PHASE4_LIVE_SMS_ENABLED",
    required: true,
    value: getEnvValue("PHASE4_LIVE_SMS_ENABLED"),
    validate: (value) => ["true", "false", "1", "0"].includes(value.toLowerCase()),
    severity: "blocker",
    message: "Phase 4 live SMS switch must be explicit.",
  });
  addValidationItem(items, {
    key: "PHASE4_SMS_KILL_SWITCH",
    required: true,
    value: getEnvValue("PHASE4_SMS_KILL_SWITCH"),
    validate: (value) => ["true", "false", "1", "0"].includes(value.toLowerCase()),
    severity: "blocker",
    message: "Phase 4 SMS kill switch must be explicit.",
  });
  addValidationItem(items, {
    key: "PHASE4_ALLOWLISTED_SMS_RECIPIENTS",
    required: phase4.liveSmsEnabled,
    value: phase4.allowlistedRecipients.join(","),
    severity: "blocker",
    message: "Allowlisted recipients are required before controlled live SMS.",
  });
  addValidationItem(items, {
    key: "TWILIO_ACCOUNT_SID",
    required: phase4.liveSmsEnabled,
    value: phase4.twilioAccountSid,
    validate: (value) => /^AC[a-zA-Z0-9]{32}$/.test(value),
    severity: "blocker",
    message: "Twilio account SID is required for controlled live SMS.",
  });
  addValidationItem(items, {
    key: "TWILIO_AUTH_TOKEN",
    required: phase4.liveSmsEnabled,
    value: phase4.twilioAuthToken,
    validate: (value) => value.length >= 16,
    severity: "blocker",
    message: "Twilio auth token is required for controlled live SMS.",
  });
  addValidationItem(items, {
    key: "TWILIO_FROM_NUMBER",
    required: phase4.liveSmsEnabled,
    value: phase4.twilioFromNumber,
    validate: isValidPhone,
    severity: "blocker",
    message: "Twilio from number must be E.164 formatted.",
  });
  addValidationItem(items, {
    key: "TWILIO_WEBHOOK_AUTH_TOKEN",
    required: isProductionRuntime,
    value: phase4.twilioWebhookAuthToken,
    validate: (value) => value.length >= 16,
    severity: "blocker",
    message: "Twilio webhook token is required in production.",
  });
  addValidationItem(items, {
    key: "APPROVED_EXECUTION_ENABLED",
    required: false,
    value: getEnvValue("APPROVED_EXECUTION_ENABLED"),
    validate: (value) => ["true", "false", "1", "0"].includes(value.toLowerCase()),
    severity: getEnvValue("APPROVED_EXECUTION_ENABLED") === "true" ? "warning" : "info",
    message: "External approved execution should stay false or unset for first production start.",
  });
  addValidationItem(items, {
    key: "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED",
    required: getEnvValue("APPROVED_EXECUTION_ENABLED") === "true" && isProductionRuntime,
    value: getEnvValue("APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED"),
    validate: (value) => ["true", "false", "1", "0"].includes(value.toLowerCase()),
    severity: "blocker",
    message: "Production smoke approval must be explicit before external approved execution can run.",
  });

  const blockers = items
    .filter((item) => item.required && !item.valid && item.severity === "blocker")
    .map((item) => `${item.key}: ${item.message}`);
  const warnings = items
    .filter((item) => (!item.required && !item.valid) || item.severity === "warning")
    .map((item) => `${item.key}: ${item.message}`);
  const coreKeys = ["DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD", "NEXT_PUBLIC_APP_URL"];
  const smsKeys = [
    "PHASE4_LIVE_SMS_ENABLED",
    "PHASE4_SMS_KILL_SWITCH",
    "PHASE4_ALLOWLISTED_SMS_RECIPIENTS",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_FROM_NUMBER",
  ];
  const approvedExecutionExternalEnabled = getEnvValue("APPROVED_EXECUTION_ENABLED") === "true";
  const approvedExecutionProductionSmokePassed =
    !isProductionRuntime || getEnvValue("APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED") === "true";

  return {
    ok: blockers.length === 0,
    environment: process.env.NODE_ENV ?? "development",
    appUrl,
    coreReady: items.filter((item) => coreKeys.includes(item.key)).every((item) => item.valid),
    phase4LiveSmsReady:
      phase4.liveSmsEnabled &&
      !phase4.smsKillSwitchActive &&
      items.filter((item) => smsKeys.includes(item.key)).every((item) => item.valid),
    approvedExecutionExternalEnabled,
    approvedExecutionProductionSmokePassed,
    approvedExecutionExternalReady: approvedExecutionExternalEnabled && approvedExecutionProductionSmokePassed,
    killSwitchActive: phase4.smsKillSwitchActive,
    items,
    blockers,
    warnings,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
