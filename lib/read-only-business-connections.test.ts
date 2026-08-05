import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  createDepartmentRecommendationsFromSnapshots,
  createMorningBriefFromSnapshots,
  readOnlyAdapterDefinitions,
  runReadOnlyBusinessSync,
  validateWeek1Level1ReadOnlyCategories,
  week1Level1ReadOnlyCategories,
  verifyWeek1Level1Snapshots,
  setReadOnlyBusinessConnectionsDbForTest,
  setReadOnlyBusinessConnectionsFetchForTest,
  setReadOnlyBusinessConnectionsLeadLoaderForTest,
  validateReadOnlyAdapterDefinitions,
  type BusinessDataSnapshotRecord,
} from "./read-only-business-connections";
import { createUeipExecutionContext, setUeipRuntimeDependenciesForTest } from "./ueip-runtime-gateway";

const restoreFns: Array<() => void> = [];

function testContext(tenantId = "default") {
  return createUeipExecutionContext({ tenantId, actorId: "test", businessModule: "ai_core", requestOrigin: "test" });
}

afterEach(() => {
  while (restoreFns.length) {
    restoreFns.pop()?.();
  }
});

function createTestDb() {
  const snapshots: BusinessDataSnapshotRecord[] = [];
  const briefings: unknown[] = [];

  return {
    snapshots,
    briefings,
    db: {
      businessDataSnapshot: {
        async upsert(args: unknown) {
          const input = args as { create: BusinessDataSnapshotRecord; update: Partial<BusinessDataSnapshotRecord> };
          const index = snapshots.findIndex(
            (snapshot) =>
              snapshot.tenantId === input.create.tenantId &&
              String(snapshot.snapshotDate) === String(input.create.snapshotDate) &&
              snapshot.provider === input.create.provider &&
              snapshot.category === input.create.category,
          );

          if (index >= 0) {
            snapshots[index] = { ...snapshots[index], ...input.update } as BusinessDataSnapshotRecord;

            return snapshots[index];
          }

          snapshots.push(input.create);

          return input.create;
        },
        async findMany() {
          return snapshots;
        },
      },
      dailyBriefingSnapshot: {
        async create(args: unknown) {
          briefings.push(args);

          return args;
        },
        async findFirst() {
          return null;
        },
      },
    },
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function createUeipTestDb(siteUrl: string) {
  return {
    connectorInstallationState: { async findUnique() { return { id: "search-installation", tenantId: "default", connectorId: "google_search_console", installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: "search-credential", requiredScopes: ["https://www.googleapis.com/auth/webmasters.readonly"], grantedScopes: ["https://www.googleapis.com/auth/webmasters.readonly"], permissionValidation: { authorizedSiteUrls: [siteUrl] } }; } },
    connectorCredentialReference: { async findFirst() { return { id: "search-credential", tenantId: "default", connectorId: "google_search_console", referenceKey: "search-console", secretStorageProvider: "environment", rawSecretStored: false, rawSecretRendered: false, expiresAt: null }; } },
    ueipGatewayAuditEvent: { async create(args: unknown) { return { id: "audit", args }; } },
    enterpriseConnectorHealthEvent: { async create(args: unknown) { return args; } },
  };
}

describe("read-only business connections", () => {
  it("records data gaps without attempting provider calls when credentials are missing", async () => {
    const testDb = createTestDb();
    let calls = 0;

    restoreFns.push(setReadOnlyBusinessConnectionsDbForTest(testDb.db as never));
    restoreFns.push(setReadOnlyBusinessConnectionsLeadLoaderForTest(async () => []));
    restoreFns.push(
      setReadOnlyBusinessConnectionsFetchForTest(async () => {
        calls += 1;

        return jsonResponse({});
      }),
    );

    const report = await runReadOnlyBusinessSync({}, testContext());

    assert.equal(calls, 0);
    assert.equal(report.providerCalled, false);
    assert.equal(report.liveExecutionAllowed, false);
    assert.equal(report.snapshots.length, readOnlyAdapterDefinitions.length + 4);
    assert.ok(report.snapshots.filter((snapshot) => readOnlyAdapterDefinitions.some((definition) => definition.id === snapshot.category)).every((snapshot) => snapshot.status === "data_gap"));
    assert.ok(report.snapshots.some((snapshot) => snapshot.category === "internal_lead_database"));
    assert.ok(report.snapshots.some((snapshot) => snapshot.category === "internal_website_lead_intake"));
    assert.ok(report.dataGaps.some((gap) => gap.includes("Missing required read-only credential")));
  });


  it("fails closed for forbidden Week 1 categories and avoids provider calls in readiness-only mode", async () => {
    const testDb = createTestDb();
    let calls = 0;

    restoreFns.push(setReadOnlyBusinessConnectionsDbForTest(testDb.db as never));
    restoreFns.push(setReadOnlyBusinessConnectionsLeadLoaderForTest(async () => []));
    restoreFns.push(setReadOnlyBusinessConnectionsFetchForTest(async () => {
      calls += 1;
      return jsonResponse({});
    }));

    assert.throws(
      () => validateWeek1Level1ReadOnlyCategories(["search_console_performance"]),
      /week1_level1_forbidden_readonly_category/,
    );

    const report = await runReadOnlyBusinessSync({
      GOOGLE_OAUTH_CLIENT_ID: "google-client",
      GOOGLE_OAUTH_CLIENT_SECRET: "google-secret",
      GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh",
      GOOGLE_ANALYTICS_PROPERTY_ID: "12345",
      GOOGLE_OAUTH_GRANTED_SCOPES: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/calendar.events.readonly",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ].join(" "),
    }, testContext("tenant-week1"), {
      categories: [...week1Level1ReadOnlyCategories],
      syncMode: "week1_level1_ordered",
      allowProviderReads: false,
      persistDailyBriefing: false,
    });
    const verification = verifyWeek1Level1Snapshots("tenant-week1", report.snapshots);

    assert.equal(calls, 0);
    assert.equal(report.providerCalled, false);
    assert.deepEqual(report.snapshots.map((snapshot) => snapshot.category), [...week1Level1ReadOnlyCategories]);
    assert.ok(report.snapshots.filter((snapshot) => !String(snapshot.category).startsWith("internal_")).every((snapshot) => snapshot.status === "data_gap"));
    assert.equal(verification.advisoryExceptions.some((exception) => exception.includes("not fresh evidence")), true);
  });

  it("runs only explicitly selected snapshot categories", async () => {
    const testDb = createTestDb();
    const calls: string[] = [];
    const env = {
      GOOGLE_OAUTH_CLIENT_ID: "google-client",
      GOOGLE_OAUTH_CLIENT_SECRET: "google-secret",
      GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh",
      GOOGLE_OAUTH_GRANTED_SCOPES: "https://www.googleapis.com/auth/gmail.readonly",
    };

    restoreFns.push(setReadOnlyBusinessConnectionsDbForTest(testDb.db as never));
    restoreFns.push(setReadOnlyBusinessConnectionsLeadLoaderForTest(async () => []));
    restoreFns.push(setReadOnlyBusinessConnectionsFetchForTest(async (input) => {
      const url = String(input);
      calls.push(url);
      if (url.includes("oauth2.googleapis.com")) return jsonResponse({ access_token: "access-token" });
      if (url.includes("gmail.googleapis.com")) return jsonResponse({ messages: [] });
      return jsonResponse({});
    }));

    const report = await runReadOnlyBusinessSync(env, testContext(), {
      categories: ["gmail_inbox", "internal_website_lead_intake"],
    });

    assert.deepEqual(report.snapshots.map((snapshot) => snapshot.category), ["gmail_inbox", "internal_website_lead_intake"]);
    assert.ok(calls.some((url) => url.includes("gmail.googleapis.com")));
    assert.equal(calls.some((url) => url.includes("youtube")), false);
    assert.equal(calls.some((url) => url.includes("canva")), false);
    assert.deepEqual(report.integrationsCompleted.sort(), ["Google Workspace", "Website Lead Intake"]);
  });

  it("can refresh idempotent snapshots without creating a duplicate briefing", async () => {
    const testDb = createTestDb();
    restoreFns.push(setReadOnlyBusinessConnectionsDbForTest(testDb.db as never));
    restoreFns.push(setReadOnlyBusinessConnectionsLeadLoaderForTest(async () => []));

    await runReadOnlyBusinessSync({}, testContext(), {
      categories: ["internal_lead_database"],
      persistDailyBriefing: false,
    });

    assert.equal(testDb.snapshots.length, 1);
    assert.equal(testDb.briefings.length, 0);
  });

  it("persists a data gap without a provider call when read-only scope evidence is missing", async () => {
    const testDb = createTestDb();
    let calls = 0;

    restoreFns.push(setReadOnlyBusinessConnectionsDbForTest(testDb.db as never));
    restoreFns.push(setReadOnlyBusinessConnectionsLeadLoaderForTest(async () => []));
    restoreFns.push(setReadOnlyBusinessConnectionsFetchForTest(async () => {
      calls += 1;
      return jsonResponse({});
    }));

    const report = await runReadOnlyBusinessSync({
      GOOGLE_OAUTH_CLIENT_ID: "google-client",
      GOOGLE_OAUTH_CLIENT_SECRET: "google-secret",
      GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh",
      GOOGLE_OAUTH_GRANTED_SCOPES: "https://www.googleapis.com/auth/webmasters.readonly",
    }, testContext(), { categories: ["gmail_inbox"] });

    assert.equal(calls, 0);
    assert.equal(report.providerCalled, false);
    assert.equal(report.snapshots[0]?.status, "data_gap");
    assert.match(report.snapshots[0]?.dataGaps[0] ?? "", /gmail\.readonly/);
    assert.ok(report.snapshots[0]?.observationStart);
    assert.ok(report.snapshots[0]?.observationEnd);
    assert.ok(report.snapshots[0]?.traceId);
    assert.deepEqual(report.snapshots[0]?.reliability, { status: "advisory", providerCalled: false, dataGapCount: 1 });
  });

  it("refreshes OAuth tokens without returning secrets and persists read-only snapshots", async () => {
    const testDb = createTestDb();
    const calls: Array<{ url: string; method: string }> = [];
    const env = {
      VERCEL_ENV: "preview",
      GOOGLE_OAUTH_CLIENT_ID: "google-client",
      GOOGLE_OAUTH_CLIENT_SECRET: "google-secret",
      GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh",
      GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://jcapitalpropertygroup.com/",
      GOOGLE_ANALYTICS_PROPERTY_ID: "12345",
      GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
      YOUTUBE_CHANNEL_ID: "UC123",
      CANVA_OAUTH_CLIENT_ID: "canva-client",
      CANVA_OAUTH_CLIENT_SECRET: "canva-secret",
      CANVA_OAUTH_REFRESH_TOKEN: "canva-refresh",
      GOOGLE_OAUTH_GRANTED_SCOPES: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/calendar.events.readonly",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ].join(" "),
    };

    restoreFns.push(setReadOnlyBusinessConnectionsDbForTest(testDb.db as never));
    restoreFns.push(setReadOnlyBusinessConnectionsLeadLoaderForTest(async () => []));
    const testFetch: typeof fetch = async (input, init) => {
        const url = String(input);
        const method = init?.method ?? "GET";
        calls.push({ url, method });

        if (url.includes("oauth2.googleapis.com") || url.includes("api.canva.com/rest/v1/oauth/token")) return jsonResponse({ access_token: "access-token" });
        if (url.includes("gmail.googleapis.com") && url.includes("/messages/") && !url.endsWith("/messages")) return jsonResponse({ id: "m1", threadId: "t1", snippet: "Seller inquiry", payload: { headers: [{ name: "Subject", value: "Property question" }] } });
        if (url.includes("gmail.googleapis.com")) return jsonResponse({ messages: [{ id: "m1" }] });
        if (url.includes("calendar")) return jsonResponse({ items: [{ id: "e1", summary: "CEO review", start: { dateTime: "2026-07-06T14:00:00.000Z" } }] });
        if (url.includes("drive")) return jsonResponse({ files: [{ id: "d1", name: "Marketing Draft", modifiedTime: "2026-07-06T01:00:00.000Z" }] });
        if (url.includes("searchAnalytics")) return jsonResponse({ rows: [{ keys: ["/resources/inherited-property-oklahoma"], clicks: 2, impressions: 20, ctr: 0.1, position: 3 }] });
        if (url.includes("urlInspection")) return jsonResponse({ inspectionResult: { indexStatusResult: { verdict: "PASS", coverageState: "Indexed" } } });
        if (url.includes("analyticsdata")) return jsonResponse({ rows: [{ dimensionValues: [{ value: "/" }], metricValues: [{ value: "7" }, { value: "5" }, { value: "9" }, { value: "1" }] }] });
        if (url.includes("businessprofileperformance")) return jsonResponse({ multiDailyMetricTimeSeries: [{ dailyMetric: "CALL_CLICKS" }] });
        if (url.includes("youtube/v3/search")) return jsonResponse({ items: [{ id: { videoId: "v1" }, snippet: { title: "Probate basics" } }] });
        if (url.includes("youtubeanalytics")) return jsonResponse({ columnHeaders: [{ name: "views" }, { name: "estimatedMinutesWatched" }], rows: [[11, 44]] });
        if (url.includes("api.canva.com/rest/v1/designs")) return jsonResponse({ items: [{ id: "c1", title: "Seller checklist" }] });

        return jsonResponse({});
      };
    restoreFns.push(setReadOnlyBusinessConnectionsFetchForTest(testFetch));
    restoreFns.push(setUeipRuntimeDependenciesForTest({ db: createUeipTestDb(env.GOOGLE_SEARCH_CONSOLE_SITE_URL) as never, fetcher: testFetch, environment: "preview" }));

    const report = await runReadOnlyBusinessSync(env, testContext());
    const serialized = JSON.stringify(report);

    assert.equal(report.providerCalled, true);
    assert.equal(report.liveExecutionAllowed, false);
    assert.ok(report.snapshots.some((snapshot) => snapshot.category === "gmail_inbox" && snapshot.providerCalled));
    assert.ok(report.morningBrief.overnightSummary.some((line) => line.includes("Gmail")));
    assert.equal(serialized.includes("google-secret"), false);
    assert.equal(serialized.includes("google-refresh"), false);
    assert.equal(serialized.includes("canva-secret"), false);
    assert.equal(serialized.includes("access-token"), false);
    assert.ok(calls.every((call) => ["GET", "POST"].includes(call.method)));
    assert.ok(testDb.briefings.length > 0);
  });

  it("creates morning brief and department recommendations from snapshots, not samples", () => {
    const snapshot: BusinessDataSnapshotRecord = {
      snapshotDate: new Date("2026-07-06T00:00:00.000Z"),
      provider: "Google Search Console",
      connectorId: "google_search_console",
      category: "search_console_performance",
      status: "fresh",
      sourceLabel: "search_console:search_analytics:readonly",
      provenance: "Search Console API.",
      freshness: "2026-07-06T12:00:00.000Z",
      summary: "20 impressions and 2 clicks.",
      metrics: { impressions: 20, clicks: 2 },
      records: [{ page: "/resources/inherited-property-oklahoma" }],
      dataGaps: [],
      assumptions: [],
      safetyFlags: {
        readOnly: true,
        liveExecutionAllowed: false,
        externalWritesBlocked: true,
        publishingBlocked: true,
        emailSendingBlocked: true,
        smsBlocked: true,
        adsBlocked: true,
        crmMutationBlocked: true,
        providerExecutionBlocked: true,
        oauthWritesBlocked: true,
      },
      providerCalled: true,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    };
    const brief = createMorningBriefFromSnapshots([snapshot], "2026-07-06T13:00:00.000Z");
    const recommendations = createDepartmentRecommendationsFromSnapshots([snapshot]);

    assert.equal(brief.providerCalled, true);
    assert.equal(brief.liveExecutionAllowed, false);
    assert.ok(brief.sourceLabels.includes("search_console:search_analytics:readonly"));
    assert.ok(recommendations.every((recommendation) => recommendation.sourceLabel));
    assert.equal(JSON.stringify(brief).includes("sample"), false);
  });

  it("documents approved read-only endpoint methods", () => {
    const definitions = validateReadOnlyAdapterDefinitions();

    assert.equal(definitions.length, readOnlyAdapterDefinitions.length);
    assert.ok(definitions.every((definition) => definition.liveExecutionAllowed === false));
    assert.ok(definitions.every((definition) => definition.approvedRequests.every((request) => request.method === "GET" || request.method === "POST")));
    assert.ok(definitions.every((definition) => definition.forbiddenMethods.includes("DELETE")));
  });
});
