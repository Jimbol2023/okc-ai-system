import { expect, test, type Page } from "@playwright/test";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function signIn(page: Page) {
  test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD are required for authenticated Exception Inbox tests.");
  await page.goto("/login");
  await page.getByLabel("Email").fill(adminEmail ?? "");
  await page.getByLabel("Password").fill(adminPassword ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("CEO Exception Inbox", () => {
  test("renders before operating controls and keeps controls secondary", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard");
    const inbox = page.getByRole("heading", { name: "CEO Exception Inbox" });
    await expect(inbox).toBeVisible();
    await expect(page.getByText("No CEO action required. Scheduled internal work completed, and no legitimate record-specific exception is pending.")).toBeVisible();
    const controls = page.getByText("Operations/Admin controls");
    await expect(controls).toBeVisible();
    await expect(page.getByRole("button", { name: "Run Daily Startup Now" })).not.toBeVisible();
    await controls.click();
    await expect(page.getByRole("button", { name: "Run Daily Startup Now" })).toBeVisible();
  });

  test("renders active decisions and normally expands only the highest three", async ({ page }) => {
    await signIn(page);
    const items = Array.from({ length: 5 }, (_, index) => ({
      canonicalKey: `default:fresh_business_draft:draft-${index}:v1`,
      exceptionType: "fresh_business_draft",
      priority: index === 0 ? "high" : "normal",
      riskLevel: index === 0 ? "high" : "medium",
      sourceRecordType: "AiCompanyDraftQueueItem",
      sourceRecordId: `draft-${index}`,
      decisionRequested: `Review record-specific draft ${index + 1}`,
      businessReason: "A fresh business draft requires a CEO decision now.",
      recommendedDecision: "Approve or request changes for internal preparation only.",
      missingEvidence: index === 0 ? ["verified property evidence"] : [],
      contactPosture: { doNotContact: false, consentStatus: "affirmed" },
      auditStatus: "not_required_before_decision",
      reviewHref: "/dashboard/drafts",
      reviewMinutes: 1,
      prohibitedActions: ["Provider calls", "External execution"],
      externalActionAuthorized: false,
    }));
    await page.route("**/api/company/ceo-exception-inbox", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          generatedAt: "2026-08-06T18:00:00.000Z",
          tenantId: "default",
          status: "action_required",
          estimatedReviewMinutes: 5,
          items,
          excludedCounts: { reviewBudgetDeferred: 2 },
          safety: { readOnly: true, externalExecutionAllowed: false },
        }),
      });
    });
    await page.goto("/dashboard");
    await expect(page.getByText("Review record-specific draft 1")).toBeVisible();
    await expect(page.getByText("verified property evidence")).toBeVisible();
    const safetyStatements = page.getByText("External action authorized: false", { exact: true });
    await expect(safetyStatements).toHaveCount(items.length);
    for (const statement of await safetyStatements.all()) await expect(statement).toBeVisible();
    await expect(page.getByText(/Safety contract error|External action authorized: true/i)).toHaveCount(0);
    await expect(page.getByText("5 minute review", { exact: true })).toBeVisible();
    await expect(page.getByText("2 lower-priority decision(s) remain queued outside today's seven-minute budget.", { exact: true })).toBeVisible();
    const decisionDetails = page.locator("details").filter({ has: page.getByText(/Review record-specific draft/) });
    await expect(decisionDetails).toHaveCount(5);
    await expect(decisionDetails.nth(0)).toHaveAttribute("open", "");
    await expect(decisionDetails.nth(1)).toHaveAttribute("open", "");
    await expect(decisionDetails.nth(2)).toHaveAttribute("open", "");
    await expect(decisionDetails.nth(3)).not.toHaveAttribute("open", "");
    await expect(decisionDetails.nth(4)).not.toHaveAttribute("open", "");
    await expect(page.getByText("Operations/Admin controls")).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole("heading", { name: "CEO Exception Inbox" })).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasHorizontalOverflow).toBe(false);
  });
});
