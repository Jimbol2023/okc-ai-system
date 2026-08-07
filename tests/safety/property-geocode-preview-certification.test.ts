import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createSessionToken,
  AUTH_COOKIE_NAME,
} from "@/lib/auth";
import { POST } from "@/app/api/company/property-opportunities/geocode-preview/route";
import {
  assertPreviewOnlyGeocodeCertificationSafety,
  previewOnlyGeocodingProviderCertificationApprovalPhrase,
  previewOnlyGeocodeRequestSchema,
  runPreviewOnlyGeocodeCertification,
} from "@/lib/property-geocode-preview-certification";

const approvedRequest = previewOnlyGeocodeRequestSchema.parse({
  approvalPhrase: previewOnlyGeocodingProviderCertificationApprovalPhrase,
  provider: "google_maps_geocoding",
  propertyAddress: "901 Cert Preview Geocode Ave",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
});

function mockFetcher(body: unknown, options: { ok?: boolean; status?: number } = {}) {
  return async (url: string) => {
    assert.match(url, /^https:\/\/maps\.googleapis\.com\/maps\/api\/geocode\/json\?/);
    assert.equal(new URL(url).searchParams.get("key"), "preview-key");
    return {
      ok: options.ok ?? true,
      status: options.status ?? 200,
      json: async () => body,
    };
  };
}

test("preview-only geocode certification calls exactly one read-only provider and does not persist", async () => {
  const result = await runPreviewOnlyGeocodeCertification({
    request: approvedRequest,
    env: { VERCEL_ENV: "preview", GOOGLE_MAPS_API_KEY: "preview-key" } as NodeJS.ProcessEnv,
    fetcher: mockFetcher({
      status: "OK",
      results: [
        {
          formatted_address: "901 Cert Preview Geocode Ave, Oklahoma City, OK 73102, USA",
          geometry: {
            location: { lat: 35.4676, lng: -97.5164 },
            location_type: "ROOFTOP",
          },
        },
      ],
    }),
  });

  assert.equal(result.ok, true);
  assert.equal(result.provider, "google_maps_geocoding");
  assert.equal(result.providerCalled, true);
  assert.equal(result.providerWrite, false);
  assert.equal(result.persisted, false);
  assert.equal(result.crmMutated, false);
  assert.equal(result.liveExecutionAllowed, false);
  assertPreviewOnlyGeocodeCertificationSafety(result);
});

test("preview-only geocode certification blocks outside Preview before provider call", async () => {
  let calls = 0;
  const result = await runPreviewOnlyGeocodeCertification({
    request: approvedRequest,
    env: { VERCEL_ENV: "production", GOOGLE_MAPS_API_KEY: "preview-key" } as NodeJS.ProcessEnv,
    fetcher: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "not_preview_environment");
  assert.equal(result.providerCalled, false);
  assert.equal(calls, 0);
  assertPreviewOnlyGeocodeCertificationSafety(result);
});

test("preview-only geocode certification blocks missing credential before provider call", async () => {
  let calls = 0;
  const result = await runPreviewOnlyGeocodeCertification({
    request: approvedRequest,
    env: { VERCEL_ENV: "preview" } as NodeJS.ProcessEnv,
    fetcher: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "missing_provider_credential");
  assert.equal(result.providerCalled, false);
  assert.equal(calls, 0);
  assertPreviewOnlyGeocodeCertificationSafety(result);
});

test("preview-only geocode certification requires exact approval phrase and single provider", () => {
  assert.equal(previewOnlyGeocodeRequestSchema.safeParse({ ...approvedRequest, approvalPhrase: "APPROVED" }).success, false);
  assert.equal(previewOnlyGeocodeRequestSchema.safeParse({ ...approvedRequest, provider: "mapbox_geocoding" }).success, false);
});

test("preview-only geocode certification fails closed on provider zero results", async () => {
  const result = await runPreviewOnlyGeocodeCertification({
    request: approvedRequest,
    env: { VERCEL_ENV: "preview", GOOGLE_MAPS_API_KEY: "preview-key" } as NodeJS.ProcessEnv,
    fetcher: mockFetcher({ status: "ZERO_RESULTS", results: [] }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "provider_zero_results");
  assert.equal(result.providerCalled, true);
  assertPreviewOnlyGeocodeCertificationSafety(result);
});

test("preview-only geocode certification fails closed on a bounded provider timeout", async () => {
  const result = await runPreviewOnlyGeocodeCertification({
    request: approvedRequest,
    env: {
      VERCEL_ENV: "preview",
      GOOGLE_MAPS_API_KEY: "preview-key",
      PROPERTY_GEOCODE_PREVIEW_TIMEOUT_MS: "1",
    } as NodeJS.ProcessEnv,
    fetcher: async () => new Promise((resolve) => {
      setTimeout(() => resolve({
        ok: true,
        status: 200,
        json: async () => ({ status: "OK", results: [] }),
      }), 50);
    }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "provider_timeout");
  assert.equal(result.providerCalled, true);
  assertPreviewOnlyGeocodeCertificationSafety(result);
});

test("authenticated Preview geocode API returns no-store read-only certification response", async () => {
  const originalEnv = {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    AUTH_SECRET: process.env.AUTH_SECRET,
    VERCEL_ENV: process.env.VERCEL_ENV,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  };
  const originalFetch = globalThis.fetch;

  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_PASSWORD = "safe-local-password";
  process.env.AUTH_SECRET = "a".repeat(40);
  process.env.VERCEL_ENV = "preview";
  process.env.GOOGLE_MAPS_API_KEY = "preview-key";
  globalThis.fetch = mockFetcher({
    status: "OK",
    results: [
      {
        formatted_address: "901 Cert Preview Geocode Ave, Oklahoma City, OK 73102, USA",
        geometry: {
          location: { lat: 35.4676, lng: -97.5164 },
          location_type: "ROOFTOP",
        },
      },
    ],
  }) as typeof fetch;

  try {
    const token = await createSessionToken("admin@example.com", { tenantId: "cert-alpha-property-engine", actorId: "route-test" });
    const response = await POST(new Request("https://preview.example.test/api/company/property-opportunities/geocode-preview", {
      method: "POST",
      headers: {
        cookie: `${AUTH_COOKIE_NAME}=${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(approvedRequest),
    }));
    const body = await response.json() as {
      ok: boolean;
      result: { providerCalled: boolean; persisted: boolean; providerWrite: boolean };
      crmMutated: boolean;
      liveExecutionAllowed: boolean;
    };

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(body.ok, true);
    assert.equal(body.result.providerCalled, true);
    assert.equal(body.result.persisted, false);
    assert.equal(body.result.providerWrite, false);
    assert.equal(body.crmMutated, false);
    assert.equal(body.liveExecutionAllowed, false);
  } finally {
    globalThis.fetch = originalFetch;
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }
});
