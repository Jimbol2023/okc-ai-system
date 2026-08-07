import { z } from "zod";

export const previewOnlyGeocodingProviderCertificationApprovalPhrase =
  "CEO_APPROVES_PREVIEW_ONLY_GEOCODING_PROVIDER_CERTIFICATION_READ_ONLY_SINGLE_PROVIDER_NO_PRODUCTION_NO_OUTREACH_NO_CRM_MUTATION_NO_EXTERNAL_EXECUTION" as const;

export const previewOnlyGeocodingProviderId = "google_maps_geocoding" as const;

export const previewOnlyGeocodingSafetyFlags = {
  previewOnly: true,
  readOnly: true,
  singleProvider: previewOnlyGeocodingProviderId,
  providerWrite: false,
  sent: false,
  published: false,
  scraping: false,
  skipTracing: false,
  directMail: false,
  outreach: false,
  crmMutated: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
} as const;

export const previewOnlyGeocodeRequestSchema = z.object({
  approvalPhrase: z.literal(previewOnlyGeocodingProviderCertificationApprovalPhrase),
  provider: z.literal(previewOnlyGeocodingProviderId).optional().default(previewOnlyGeocodingProviderId),
  propertyAddress: z.string().trim().min(3).max(300),
  city: z.string().trim().max(120).optional().default(""),
  state: z.string().trim().max(80).optional().default(""),
  zipCode: z.string().trim().max(20).optional().default(""),
});

export type PreviewOnlyGeocodeRequest = z.infer<typeof previewOnlyGeocodeRequestSchema>;

export type PreviewOnlyGeocodeBlockedResult = {
  ok: false;
  status: "blocked";
  reason:
    | "not_preview_environment"
    | "missing_provider_credential"
    | "provider_http_error"
    | "provider_zero_results"
    | "provider_malformed_response";
  detail: string;
  provider: typeof previewOnlyGeocodingProviderId;
  providerCalled: boolean;
  safetyFlags: typeof previewOnlyGeocodingSafetyFlags;
};

export type PreviewOnlyGeocodeSuccessResult = {
  ok: true;
  status: "preview_certified";
  provider: typeof previewOnlyGeocodingProviderId;
  query: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  locationType: string;
  partialMatch: boolean;
  providerCalled: true;
  providerWrite: false;
  persisted: false;
  crmMutated: false;
  liveExecutionAllowed: false;
  safetyFlags: typeof previewOnlyGeocodingSafetyFlags;
};

export type PreviewOnlyGeocodeResult = PreviewOnlyGeocodeBlockedResult | PreviewOnlyGeocodeSuccessResult;

type GeocodeFetcher = (url: string) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

type RunPreviewOnlyGeocodeInput = {
  request: PreviewOnlyGeocodeRequest;
  env?: NodeJS.ProcessEnv;
  fetcher?: GeocodeFetcher;
};

function isPreviewEnvironment(env: NodeJS.ProcessEnv) {
  return env.VERCEL_ENV === "preview" || env.PROPERTY_GEOCODE_PREVIEW_CERTIFICATION_ENV === "preview";
}

function getProviderCredential(env: NodeJS.ProcessEnv) {
  return env.GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

export function createPreviewOnlyGeocodeQuery(input: PreviewOnlyGeocodeRequest) {
  return [input.propertyAddress, input.city, input.state, input.zipCode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

function blocked(reason: PreviewOnlyGeocodeBlockedResult["reason"], detail: string, providerCalled = false): PreviewOnlyGeocodeBlockedResult {
  return {
    ok: false,
    status: "blocked",
    reason,
    detail,
    provider: previewOnlyGeocodingProviderId,
    providerCalled,
    safetyFlags: previewOnlyGeocodingSafetyFlags,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function runPreviewOnlyGeocodeCertification(input: RunPreviewOnlyGeocodeInput): Promise<PreviewOnlyGeocodeResult> {
  const env = input.env ?? process.env;
  const fetcher = input.fetcher ?? ((url: string) => fetch(url));

  if (!isPreviewEnvironment(env)) {
    return blocked("not_preview_environment", "Preview-only geocoding certification is blocked outside Vercel Preview.");
  }

  const credential = getProviderCredential(env);
  if (!credential) {
    return blocked("missing_provider_credential", "GOOGLE_MAPS_API_KEY is required in Preview for this read-only certification.");
  }

  const query = createPreviewOnlyGeocodeQuery(input.request);
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", credential);

  const response = await fetcher(url.toString());
  if (!response.ok) {
    return blocked("provider_http_error", `Geocoding provider returned HTTP ${response.status}.`, true);
  }

  const body = asRecord(await response.json());
  const status = typeof body.status === "string" ? body.status : "";
  if (status !== "OK") {
    return blocked("provider_zero_results", `Geocoding provider returned status ${status || "UNKNOWN"}.`, true);
  }

  const firstResult = Array.isArray(body.results) ? asRecord(body.results[0]) : {};
  const geometry = asRecord(firstResult.geometry);
  const location = asRecord(geometry.location);
  const latitude = asNumber(location.lat);
  const longitude = asNumber(location.lng);
  const formattedAddress = typeof firstResult.formatted_address === "string" ? firstResult.formatted_address : "";

  if (!formattedAddress || latitude === null || longitude === null) {
    return blocked("provider_malformed_response", "Geocoding provider response did not include a formatted address and coordinates.", true);
  }

  return {
    ok: true,
    status: "preview_certified",
    provider: previewOnlyGeocodingProviderId,
    query,
    formattedAddress,
    latitude,
    longitude,
    locationType: typeof geometry.location_type === "string" ? geometry.location_type : "unknown",
    partialMatch: firstResult.partial_match === true,
    providerCalled: true,
    providerWrite: false,
    persisted: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    safetyFlags: previewOnlyGeocodingSafetyFlags,
  };
}

export function assertPreviewOnlyGeocodeCertificationSafety(result: PreviewOnlyGeocodeResult) {
  if (
    result.safetyFlags.providerWrite ||
    result.safetyFlags.sent ||
    result.safetyFlags.published ||
    result.safetyFlags.scraping ||
    result.safetyFlags.skipTracing ||
    result.safetyFlags.directMail ||
    result.safetyFlags.outreach ||
    result.safetyFlags.crmMutated ||
    result.safetyFlags.externalExecutionAllowed ||
    result.safetyFlags.liveExecutionAllowed
  ) {
    throw new Error("Preview-only geocoding certification attempted an unsafe action.");
  }

  if (result.ok && (result.provider !== previewOnlyGeocodingProviderId || result.persisted || result.crmMutated || result.liveExecutionAllowed)) {
    throw new Error("Preview-only geocoding certification violated its single-provider, no-persistence contract.");
  }
}
