import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function signIn(page: Page) {
  test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD are required for authenticated dashboard smoke tests.");

  await page.goto("/login");
  await page.getByLabel("Email").fill(adminEmail ?? "");
  await page.getByLabel("Password").fill(adminPassword ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
}

test("login page renders safely", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByText("Use the admin email and password configured for this environment.")).toBeVisible();
});

test("dashboard redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("workflow orchestration readiness API fails closed when unauthenticated", async ({ request }) => {
  const response = await request.get("/api/workflow-orchestration-readiness");
  const data = (await response.json()) as { ok: boolean; error?: string };

  expect(response.status()).toBe(401);
  expect(data.ok).toBe(false);
  expect(data.error).toBe("Unauthorized");
});

test.describe("authenticated dashboard smoke", () => {
  test("Knowledge search UI keeps provider safety badges visible", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/knowledge");

    await expect(page.getByRole("heading", { name: "Search Knowledge Hub" })).toBeVisible();
    await expect(page.getByText("providerCalled:false").first()).toBeVisible();
    await expect(page.getByText("generatedFacts:false")).toBeVisible();
  });

  test("command palette opens with Ctrl+K and shows safety badges", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
    await page.waitForFunction(() => document.readyState === "complete");
    await page.keyboard.press("Control+K");

    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await expect(palette.getByText("providerCalled:false")).toBeVisible();
    await expect(palette.getByText("generatedFacts:false")).toBeVisible();
  });

  test("workflow readiness page and API expose disabled execution flags", async ({ context, page }) => {
    await signIn(page);
    await page.goto("/dashboard/production-readiness");

    await expect(page.getByRole("heading", { name: "n8n-first orchestration, safety locked" })).toBeVisible();
    await expect(page.getByText("liveTriggers:false")).toBeVisible();
    await expect(page.getByText("desktopAutomation:false")).toBeVisible();

    const response = await context.request.get("/api/workflow-orchestration-readiness");
    const data = (await response.json()) as {
      ok: boolean;
      preferredOrchestrator: string;
      safety: {
        noLiveWorkflowTriggers: boolean;
        noDesktopAutomation: boolean;
        noProviderCalls: boolean;
        noOutreach: boolean;
      };
      capabilities: Array<{
        safetyFlags: {
          providerCalled: boolean;
          workflowTriggered: boolean;
          desktopAutomationAuthorized: boolean;
          terminalCommandAuthorized: boolean;
          fileSystemWriteAuthorized: boolean;
          outreachSent: boolean;
        };
      }>;
    };

    expect(response.ok()).toBe(true);
    expect(data.ok).toBe(true);
    expect(data.preferredOrchestrator).toBe("n8n");
    expect(data.safety.noLiveWorkflowTriggers).toBe(true);
    expect(data.safety.noDesktopAutomation).toBe(true);
    expect(data.safety.noProviderCalls).toBe(true);
    expect(data.safety.noOutreach).toBe(true);
    expect(data.capabilities.every((capability) => capability.safetyFlags.providerCalled === false)).toBe(true);
    expect(data.capabilities.every((capability) => capability.safetyFlags.workflowTriggered === false)).toBe(true);
    expect(data.capabilities.every((capability) => capability.safetyFlags.desktopAutomationAuthorized === false)).toBe(true);
    expect(data.capabilities.every((capability) => capability.safetyFlags.terminalCommandAuthorized === false)).toBe(true);
    expect(data.capabilities.every((capability) => capability.safetyFlags.fileSystemWriteAuthorized === false)).toBe(true);
    expect(data.capabilities.every((capability) => capability.safetyFlags.outreachSent === false)).toBe(true);
  });

  test("Safety Center centralizes blocked operational capabilities", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/safety");

    await expect(page.getByRole("heading", { name: "Safety Center" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Provider Readiness", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Workflow Orchestration", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Memory Governance", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "OpenAI + Semantic Search Gates", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Twilio + SMS Boundary", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "n8n Readiness", exact: true })).toBeVisible();
    await expect(page.getByText("providerCalled:false").first()).toBeVisible();
    await expect(page.getByText("workflowTriggered:false").first()).toBeVisible();
    await expect(page.getByText("generatedFacts:false").first()).toBeVisible();
  });

  test("Mobile command center renders PWA help and safety badges", async ({ page }) => {
    await signIn(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard/mobile-command");

    await expect(page.getByRole("heading", { name: "Mobile Command Center" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Add this to your phone" })).toBeVisible();
    await expect(page.getByText("providerCalled:false").first()).toBeVisible();
    await expect(page.getByText("liveExecutionAllowed:false").first()).toBeVisible();
    await expect(page.getByText("outreachSent:false").first()).toBeVisible();
    await expect(page.getByText("approvalRequired:true").first()).toBeVisible();
  });

  test("Referral dashboard renders internal attribution review safely", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/referrals");

    await expect(page.getByRole("heading", { name: "Referral & Partnership Growth" })).toBeVisible();
    await expect(page.getByText("providerCalled:false")).toBeVisible();
    await expect(page.getByText("outreachSent:false")).toBeVisible();
    await expect(page.getByText("published:false")).toBeVisible();
    await expect(page.getByText("liveExecutionAllowed:false")).toBeVisible();
  });

  test("Search Intelligence is mobile-safe, keyboard-readable, and has no detectable accessibility violations", async ({ page }) => {
    await signIn(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard/search-intelligence");
    await expect(page.getByRole("heading", { name: "Professional search decision workspace" })).toBeVisible();
    await expect(page.getByText("providerCalled:false").first()).toBeVisible();
    await expect(page.getByText("externalWrites:false").first()).toBeVisible();
    await expect(page.getByText("liveExecution:false").first()).toBeVisible();
    await page.keyboard.press("Tab");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
