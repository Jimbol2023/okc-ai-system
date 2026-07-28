import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { getAuthSecret } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const googleScopes = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/business.manage",
];

type GoogleAccount = {
  name?: string;
  accountName?: string;
  type?: string;
  verificationState?: string;
};

type GoogleLocation = {
  name?: string;
  title?: string;
  storefrontAddress?: {
    regionCode?: string;
    postalCode?: string;
    administrativeArea?: string;
    locality?: string;
    addressLines?: string[];
  };
  serviceArea?: unknown;
  websiteUri?: string;
  metadata?: unknown;
};

type DiscoveryLocation = {
  accountResourceName: string;
  locationResourceName: string;
  envValue: string;
  title: string | null;
  websiteUri: string | null;
  storefrontAddress: GoogleLocation["storefrontAddress"] | null;
  serviceArea: unknown | null;
  metadata: unknown | null;
  matchScore: number;
};

type SafeGoogleError = {
  status: number;
  errorStatus: string | null;
  message: string | null;
  details: Array<{ reason: string | null; domain: string | null }>;
};

type GoogleGetResult = {
  response: Response;
  headers: Headers;
  body: Record<string, unknown>;
  safeError: SafeGoogleError | null;
};

const defaultGoogleRateLimitRetryAfterSeconds = 600;
const googleBusinessProfileRateLimitedSafeNextAction = "Wait before generating a new auth URL or retrying discovery.";

function getEnvValue(key: string) {
  return process.env[key]?.trim() ?? "";
}

function signState(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function createState() {
  const issuedAt = Date.now().toString();

  return `${issuedAt}.${signState(issuedAt)}`;
}

function isValidState(state: string) {
  const [issuedAt, signature] = state.split(".");
  if (!issuedAt || !signature) return false;

  const ageMs = Date.now() - Number(issuedAt);
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > 10 * 60 * 1000) return false;

  const expected = signState(issuedAt);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function getRedirectUri(request: Request) {
  const url = new URL(request.url);

  return `${url.origin}${url.pathname}`;
}

function getRequestHost(request: Request) {
  return new URL(request.url).host;
}

function buildAuthUrl(request: Request) {
  const clientId = getEnvValue("GOOGLE_OAUTH_CLIENT_ID");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getRedirectUri(request));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", googleScopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", createState());

  return url.toString();
}

async function exchangeAuthorizationCode(request: Request, code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getEnvValue("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: getEnvValue("GOOGLE_OAUTH_CLIENT_SECRET"),
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(request),
    }),
  });
  const body = (await response.json().catch(() => ({}))) as { access_token?: string; scope?: string };

  return {
    ok: response.ok && Boolean(body.access_token),
    status: response.status,
    accessToken: body.access_token ?? null,
    scopes: typeof body.scope === "string" ? body.scope.split(/\s+/).filter(Boolean).sort() : [],
  };
}

function toBoundedMessage(value: unknown) {
  return typeof value === "string" ? value.slice(0, 240) : null;
}

function safeGoogleError(status: number, body: Record<string, unknown>): SafeGoogleError | null {
  const error = body.error;
  if (!error || typeof error !== "object") return null;

  const errorRecord = error as { status?: unknown; message?: unknown; details?: unknown };
  const rawDetails = Array.isArray(errorRecord.details) ? errorRecord.details : [];

  return {
    status,
    errorStatus: typeof errorRecord.status === "string" ? errorRecord.status : null,
    message: toBoundedMessage(errorRecord.message),
    details: rawDetails.slice(0, 5).map((detail) => {
      const detailRecord = detail && typeof detail === "object" ? (detail as { reason?: unknown; domain?: unknown }) : {};

      return {
        reason: typeof detailRecord.reason === "string" ? detailRecord.reason : null,
        domain: typeof detailRecord.domain === "string" ? detailRecord.domain : null,
      };
    }),
  };
}

async function googleGet(accessToken: string, url: string): Promise<GoogleGetResult> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "X-GOOG-API-FORMAT-VERSION": "2",
    },
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  return { response, headers: response.headers, body, safeError: safeGoogleError(response.status, body) };
}

function parseRetryAfterSeconds(headers: Headers) {
  const retryAfter = headers.get("retry-after")?.trim();

  if (!retryAfter) return defaultGoogleRateLimitRetryAfterSeconds;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);

  const retryAt = Date.parse(retryAfter);
  if (Number.isFinite(retryAt)) {
    return Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
  }

  return defaultGoogleRateLimitRetryAfterSeconds;
}

function isGoogleRateLimitResult(result: GoogleGetResult) {
  const detailRateLimited = result.safeError?.details.some((detail) => detail.reason === "RATE_LIMIT_EXCEEDED") ?? false;

  return result.response.status === 429 || result.safeError?.errorStatus === "RESOURCE_EXHAUSTED" || detailRateLimited;
}

async function getGoogleIdentity(accessToken: string) {
  const result = await googleGet(accessToken, "https://openidconnect.googleapis.com/v1/userinfo");
  const email = typeof result.body.email === "string" ? result.body.email : null;

  return {
    status: result.response.status,
    ok: result.response.ok,
    email,
    safeError: result.safeError,
  };
}

async function getLegacyAccountsDiagnostic(accessToken: string) {
  const result = await googleGet(accessToken, "https://mybusiness.googleapis.com/v4/accounts");

  return {
    status: result.response.status,
    ok: result.response.ok,
    safeError: result.safeError,
  };
}

function scoreLocation(location: GoogleLocation) {
  const haystack = [
    location.title,
    location.websiteUri,
    JSON.stringify(location.storefrontAddress ?? {}),
    JSON.stringify(location.serviceArea ?? {}),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 0;
  if (haystack.includes("j capital property group")) score += 100;
  if (haystack.includes("j capital")) score += 60;
  if (haystack.includes("jcapitalpropertygroup.com")) score += 80;
  if (haystack.includes("oklahoma")) score += 10;

  return score;
}

async function discoverLocations(accessToken: string) {
  const accountsResult = await googleGet(accessToken, "https://mybusinessaccountmanagement.googleapis.com/v1/accounts");
  const accounts = Array.isArray(accountsResult.body.accounts) ? (accountsResult.body.accounts as GoogleAccount[]) : [];
  const locations: DiscoveryLocation[] = [];
  const locationAttempts: Array<{ accountResourceName: string; status: number; ok: boolean; safeError: SafeGoogleError | null }> = [];

  if (!accountsResult.response.ok) {
    const rateLimited = isGoogleRateLimitResult(accountsResult);

    return {
      ok: false,
      errorType: rateLimited ? "google_business_profile_rate_limited" : undefined,
      retryAfterSeconds: rateLimited ? parseRetryAfterSeconds(accountsResult.headers) : undefined,
      safeNextAction: rateLimited ? googleBusinessProfileRateLimitedSafeNextAction : undefined,
      accountsStatus: accountsResult.response.status,
      accountsError: accountsResult.safeError,
      accounts: [],
      locations: [],
      locationAttempts,
    };
  }

  for (const account of accounts) {
    if (!account.name) continue;

    const url = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations`);
    url.searchParams.set("readMask", "name,title,storefrontAddress,serviceArea,websiteUri,metadata");
    url.searchParams.set("pageSize", "100");

    const locationsResult = await googleGet(accessToken, url.toString());
    locationAttempts.push({
      accountResourceName: account.name,
      status: locationsResult.response.status,
      ok: locationsResult.response.ok,
      safeError: locationsResult.safeError,
    });

    if (!locationsResult.response.ok) continue;

    const accountLocations = Array.isArray(locationsResult.body.locations) ? (locationsResult.body.locations as GoogleLocation[]) : [];

    for (const location of accountLocations) {
      if (!location.name) continue;

      locations.push({
        accountResourceName: account.name,
        locationResourceName: location.name,
        envValue: `${account.name}/${location.name}`,
        title: location.title ?? null,
        websiteUri: location.websiteUri ?? null,
        storefrontAddress: location.storefrontAddress ?? null,
        serviceArea: location.serviceArea ?? null,
        metadata: location.metadata ?? null,
        matchScore: scoreLocation(location),
      });
    }
  }

  return {
    ok: true,
    accountsStatus: accountsResult.response.status,
    accountsError: accountsResult.safeError,
    accounts,
    locations,
    locationAttempts,
  };
}

export async function GET(request: Request) {
  const clientId = getEnvValue("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = getEnvValue("GOOGLE_OAUTH_CLIENT_SECRET");
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim();
  const state = url.searchParams.get("state")?.trim() ?? "";

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      ok: false,
      errorType: "missing_oauth_client_configuration",
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  }

  if (!code) {
    if (!(await isAdminRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const response = NextResponse.json({
      ok: true,
      action: "open_auth_url_as_google_business_profile_owner_or_manager",
      redirectUri: getRedirectUri(request),
      requiredScope: "https://www.googleapis.com/auth/business.manage",
      authUrl: buildAuthUrl(request),
      providerCalled: false,
      liveExecutionAllowed: false,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  }

  const stateValid = isValidState(state);
  console.info("GBP discovery OAuth callback reached", {
    hasCode: Boolean(code),
    hasState: Boolean(state),
    stateValid,
    host: getRequestHost(request),
  });

  if (!stateValid) {
    return NextResponse.json(
      {
        ok: false,
        errorType: "invalid_state",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  const token = await exchangeAuthorizationCode(request, code);

  if (!token.ok || !token.accessToken) {
    return NextResponse.json(
      {
        ok: false,
        errorType: "authorization_code_exchange_failed",
        oauthStatus: token.status,
        providerCalled: true,
        liveExecutionAllowed: false,
      },
      { status: 502 },
    );
  }

  const identity = await getGoogleIdentity(token.accessToken);
  const legacyAccountsDiagnostic = await getLegacyAccountsDiagnostic(token.accessToken);
  const discovery = await discoverLocations(token.accessToken);
  const bestMatch = discovery.locations
    .filter((location) => location.matchScore > 0)
    .sort((left, right) => right.matchScore - left.matchScore)[0] ?? null;
  const response = NextResponse.json({
    ok: discovery.ok,
    errorType: discovery.errorType,
    retryAfterSeconds: discovery.retryAfterSeconds,
    safeNextAction: discovery.safeNextAction,
    consentedGoogleEmail: identity.email,
    identityStatus: identity.status,
    identityError: identity.safeError,
    grantedScopes: token.scopes,
    hasBusinessManageScope: token.scopes.includes("https://www.googleapis.com/auth/business.manage"),
    accountsStatus: discovery.accountsStatus,
    accountsError: discovery.accountsError,
    legacyAccountsDiagnostic,
    accounts: discovery.accounts.map((account) => ({
      resourceName: account.name ?? null,
      accountName: account.accountName ?? null,
      type: account.type ?? null,
      verificationState: account.verificationState ?? null,
    })),
    locations: discovery.locations.map((location) => ({
      accountResourceName: location.accountResourceName,
      locationResourceName: location.locationResourceName,
      title: location.title,
      websiteUri: location.websiteUri,
      storefrontAddress: location.storefrontAddress,
      serviceArea: location.serviceArea,
      metadata: location.metadata,
      matchScore: location.matchScore,
    })),
    locationAttempts: discovery.locationAttempts,
    bestMatch: bestMatch
      ? {
          accountResourceName: bestMatch.accountResourceName,
          locationResourceName: bestMatch.locationResourceName,
          title: bestMatch.title,
          websiteUri: bestMatch.websiteUri,
          storefrontAddress: bestMatch.storefrontAddress,
          serviceArea: bestMatch.serviceArea,
          metadata: bestMatch.metadata,
          matchScore: bestMatch.matchScore,
        }
      : null,
    exactEnvValue: bestMatch ? `GOOGLE_BUSINESS_PROFILE_LOCATION_ID=${bestMatch.envValue}` : null,
    providerCalled: true,
    liveExecutionAllowed: false,
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
