import { expect, test } from "@playwright/test";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

function loadLocalEnvValue(name: string) {
  if (process.env[name]?.trim()) return process.env[name]?.trim() ?? "";
  for (const path of [".env.local", ".env"]) {
    if (!existsSync(path)) continue;
    const line = readFileSync(path, "utf8")
      .split(/\r?\n/u)
      .find((candidate) => candidate.match(new RegExp(`^\\s*${name}\\s*=`, "u")));
    if (!line) continue;
    const rawValue = line.replace(/^\s*[^=]+=/u, "").trim().replace(/^["']|["']$/gu, "");
    return rawValue.replace(new RegExp(`^${name}=`, "u"), "");
  }

  return "";
}

const approvedDraft = {
  id: "draft-approved",
  directiveId: "campaign-001",
  title: "CEO Final Approval",
  body: "Approved internal draft body.",
  messaging: "Approved internal messaging.",
  cta: "Internal review complete.",
  metadata: {
    sourceLabel: "executive_directive:campaign-001",
    directiveId: "campaign-001",
    output: "CEO Final Approval",
    workItemType: "marketing_draft",
    providerCalled: false,
    liveExecutionAllowed: false,
  },
  department: "Marketing AI",
  output: "CEO Final Approval",
  status: "draft_approved_internal",
  priority: "normal",
  businessGoal: "Prepare campaign safely.",
  createdAt: "2026-07-31T19:00:00.000Z",
  updatedAt: "2026-07-31T20:00:00.000Z",
  lastModifiedBy: "ceo@example.test",
  lastModifiedAt: "2026-07-31T20:00:00.000Z",
  revisionCount: 1,
  approvalStatus: "approved_internal",
  approvalRequired: true,
  knowledgePacks: ["Enterprise Knowledge Platform"],
  sourceRegistryEntries: ["executive_directive:campaign-001"],
  confidence: 72,
  assumptions: ["Draft approval is internal review only."],
  executiveSummary: "Approved internal draft; external execution remains blocked.",
  safetyFlags: {
    providerCalled: false,
    liveExecutionAllowed: false,
    published: false,
    sent: false,
    workflowStarted: false,
    externalExecutionAllowed: false,
    scrapingBlocked: true,
    outreachBlocked: true,
    adsBlocked: true,
    emailBlocked: true,
    smsBlocked: true,
    crmMutationBlocked: true,
    oauthWritesBlocked: true,
  },
  revisions: [
    {
      id: "revision-approved-1",
      action: "approved",
      note: "approved by CEO.",
      reviewer: "ceo@example.test",
      createdAt: "2026-07-31T20:00:00.000Z",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ],
};

const workspaceReport = {
  ok: true,
  title: "CEO Draft Workspace",
  summary: "1 internal department draft is visible for CEO review. Execution remains blocked.",
  totals: {
    departments: 1,
    drafts: 1,
    approved: 1,
    rejected: 0,
    changesRequested: 0,
    pendingReview: 0,
  },
  groups: [
    {
      department: "Marketing AI",
      readyCount: 1,
      pendingCount: 0,
      drafts: [approvedDraft],
    },
  ],
  safetyFlags: approvedDraft.safetyFlags,
};

function toBase64Url(value: Buffer) {
  return value.toString("base64").replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

function createLocalSessionToken(email: string, secret: string) {
  const payload = {
    email: email.trim().toLowerCase(),
    tenantId: "default",
    actorId: email,
    sessionVersion: 1,
    exp: Date.now() + 1000 * 60 * 20,
  };
  const encodedPayload = toBase64Url(Buffer.from(JSON.stringify(payload), "utf8"));
  const signature = toBase64Url(createHmac("sha256", secret).update(encodedPayload).digest());

  return `${encodedPayload}.${signature}`;
}

test("Draft Workspace reload preserves approved terminal state and disables incompatible actions", async ({ page }) => {
  const adminEmail = loadLocalEnvValue("ADMIN_EMAIL");
  const authSecret = loadLocalEnvValue("AUTH_SECRET");
  test.skip(!adminEmail || !authSecret, "Admin auth env is required for Draft Workspace browser evidence.");

  await page.route("**/api/company/drafts", async (route) => {
    await route.fulfill({ json: workspaceReport });
  });
  await page.route("**/api/company/drafts/**", async (route) => {
    throw new Error(`Unexpected draft mutation or preview request: ${route.request().method()} ${route.request().url()}`);
  });

  await page.context().addCookies([
    {
      name: "okcWholesaleAdminSession",
      value: createLocalSessionToken(adminEmail, authSecret),
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.goto("/dashboard/drafts");

  await expect(page.getByRole("heading", { name: "CEO Draft Workspace" })).toBeVisible();
  await expect(page.getByText("Approved by CEO", { exact: true })).toBeVisible();
  await expect(page.getByText("CEO decision is already recorded. Incompatible actions are disabled.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve Draft/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Request Changes/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Reject Draft/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Draft Locked/i })).toBeDisabled();
  await expect(page.getByText("providerCalled:false liveExecutionAllowed:false externalExecutionAllowed:false published:false sent:false workflowStarted:false")).toBeVisible();

  await page.reload();

  await expect(page.getByText("Approved by CEO", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve Draft/i })).toHaveCount(0);
  await page.screenshot({ path: "accessibility-results/draft-workspace-approved-state.png", fullPage: true });
});
