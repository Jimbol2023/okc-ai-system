import { expect, test, type Page } from "@playwright/test";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function signIn(page: Page) {
  test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD are required for authenticated dashboard smoke tests.");

  await page.goto("/login");
  await page.getByLabel("Email").fill(adminEmail ?? "");
  await page.getByLabel("Password").fill(adminPassword ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
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
    await expect(page.getByText("providerCalled:false")).toBeVisible();
    await expect(page.getByText("generatedFacts:false")).toBeVisible();
  });

  test("command palette opens with Ctrl+K and shows safety badges", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard");
    await page.keyboard.press("Control+K");

    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await expect(page.getByText("providerCalled:false")).toBeVisible();
    await expect(page.getByText("generatedFacts:false")).toBeVisible();
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
    await expect(page.getByText("Provider Readiness")).toBeVisible();
    await expect(page.getByText("Workflow Orchestration")).toBeVisible();
    await expect(page.getByText("AI Memory Governance")).toBeVisible();
    await expect(page.getByText("OpenAI + Semantic Search Gates")).toBeVisible();
    await expect(page.getByText("Twilio + SMS Boundary")).toBeVisible();
    await expect(page.getByText("n8n Readiness")).toBeVisible();
    await expect(page.getByText("providerCalled:false")).toBeVisible();
    await expect(page.getByText("workflowTriggered:false")).toBeVisible();
    await expect(page.getByText("generatedFacts:false")).toBeVisible();
  });
});
