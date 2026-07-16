import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  executeGoogleDriveDraftPilot,
  googleDriveDraftPilotConfirmationPhrase,
} from "@/lib/google-drive-draft-pilot";

const baseInput = {
  actionType: "create_drive_doc_draft" as const,
  title: "J Capital AI OS Preview Pilot",
  body: "This is a controlled Preview-only Google Drive test document.",
  sourceLabel: "sprint-9:google-drive-draft-pilot",
  confirmation: googleDriveDraftPilotConfirmationPhrase,
};

const previewEnv = {
  VERCEL_ENV: "preview",
  NODE_ENV: "test",
  GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "true",
  GOOGLE_DRIVE_TEST_FOLDER_ID: "test-folder-id",
  GOOGLE_OAUTH_CLIENT_ID: "google-client-id",
  GOOGLE_OAUTH_CLIENT_SECRET: "google-client-secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh-token",
} as NodeJS.ProcessEnv;

function createMockDb(options: { failAudit?: boolean } = {}) {
  const auditEvents: Array<Record<string, unknown>> = [];

  return {
    db: {
      revenueAuditEvent: {
        async create(args: { data: Record<string, unknown>; select?: Record<string, boolean> }) {
          if (options.failAudit) throw new Error("audit failed");
          const created = { ...args.data, id: `audit-${auditEvents.length + 1}` };
          auditEvents.push(created);

          if (!args.select) return created;

          return Object.fromEntries(Object.keys(args.select).map((key) => [key, created[key]]));
        },
      },
    },
    auditEvents,
  };
}

function createMockFetch() {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
    const normalized = typeof url === "string" ? url : url instanceof URL ? url.toString() : url.url;
    calls.push({ url: normalized, init });

    if (normalized.includes("oauth2.googleapis.com/token")) {
      return {
        ok: true,
        json: async () => ({ access_token: "mock-access-token" }),
      } as Response;
    }

    if (normalized.includes("www.googleapis.com/upload/drive/v3/files")) {
      return {
        ok: true,
        json: async () => ({ id: "drive-doc-1", webViewLink: "https://docs.google.com/document/d/drive-doc-1" }),
      } as Response;
    }

    return { ok: false, status: 404, json: async () => ({}) } as Response;
  }) as typeof fetch;

  return { mockFetch, calls };
}

describe("Sprint 9 Preview-only Google Drive draft pilot", () => {
  it("blocks local execution before any provider call", async () => {
    const { db } = createMockDb();
    const { mockFetch, calls } = createMockFetch();

    const result = await executeGoogleDriveDraftPilot(baseInput, {
      env: { ...previewEnv, VERCEL_ENV: "development" } as NodeJS.ProcessEnv,
      db,
      fetch: mockFetch,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, "blocked");
    assert.match(result.blockedReason ?? "", /Vercel Preview/);
    assert.equal(result.providerCalled, false);
    assert.equal(calls.length, 0);
  });

  it("blocks Production execution before any provider call", async () => {
    const { db } = createMockDb();
    const { mockFetch, calls } = createMockFetch();

    const result = await executeGoogleDriveDraftPilot(baseInput, {
      env: { ...previewEnv, VERCEL_ENV: "production", NODE_ENV: "production" } as NodeJS.ProcessEnv,
      db,
      fetch: mockFetch,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, "blocked");
    assert.equal(result.providerCalled, false);
    assert.equal(result.liveExecutionAllowed, false);
    assert.equal(calls.length, 0);
  });

  it("requires the exact CEO confirmation phrase", async () => {
    const { db } = createMockDb();
    const { mockFetch, calls } = createMockFetch();

    const result = await executeGoogleDriveDraftPilot(
      {
        ...baseInput,
        confirmation: "WRONG_CONFIRMATION" as typeof googleDriveDraftPilotConfirmationPhrase,
      },
      {
        env: previewEnv,
        db,
        fetch: mockFetch,
        memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
      },
    );

    assert.equal(result.ok, false);
    assert.match(result.blockedReason ?? "", /CEO confirmation phrase/);
    assert.equal(calls.length, 0);
  });

  it("executes exactly one mocked Preview Drive draft document write after gates pass", async () => {
    const { db, auditEvents } = createMockDb();
    const { mockFetch, calls } = createMockFetch();

    const result = await executeGoogleDriveDraftPilot(baseInput, {
      env: previewEnv,
      db,
      fetch: mockFetch,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });

    assert.equal(result.ok, true);
    assert.equal(result.status, "executed");
    assert.equal(result.providerCalled, true);
    assert.equal(result.liveExecutionAllowed, true);
    assert.equal(result.driveDocumentCreated, true);
    assert.equal(result.externalReference, "drive-doc-1");
    assert.equal(result.memoryLogged, true);
    assert.equal(calls.length, 2);
    assert.ok(calls[0].url.includes("oauth2.googleapis.com/token"));
    assert.ok(calls[1].url.includes("www.googleapis.com/upload/drive/v3/files"));
    assert.equal(auditEvents.length, 2);
    assert.equal(JSON.stringify(auditEvents).includes("google-refresh-token"), false);
    assert.equal(JSON.stringify(auditEvents).includes("google-client-secret"), false);
  });

  it("blocks before provider call when preflight audit fails", async () => {
    const { db } = createMockDb({ failAudit: true });
    const { mockFetch, calls } = createMockFetch();

    const result = await executeGoogleDriveDraftPilot(baseInput, {
      env: previewEnv,
      db,
      fetch: mockFetch,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, "blocked");
    assert.match(result.blockedReason ?? "", /Preflight audit/);
    assert.equal(result.providerCalled, false);
    assert.equal(calls.length, 0);
  });

  it("marks manual review required when memory fails after the provider write", async () => {
    const { db } = createMockDb();
    const { mockFetch, calls } = createMockFetch();

    const result = await executeGoogleDriveDraftPilot(baseInput, {
      env: previewEnv,
      db,
      fetch: mockFetch,
      memoryLogger: async () => ({ logged: false, eventId: null, reason: "memory unavailable" }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, "failed_after_provider_write");
    assert.equal(result.providerCalled, true);
    assert.equal(result.driveDocumentCreated, true);
    assert.equal(result.memoryLogged, false);
    assert.match(result.blockedReason ?? "", /Memory write failed/);
    assert.equal(calls.length, 2);
  });
});
