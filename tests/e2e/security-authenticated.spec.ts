import { expect, test } from "@playwright/test";

import { resetSecurityRateLimit } from "@/lib/security-controls";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const certificationRunId = process.env.PHASE1_CERTIFICATION_RUN_ID ?? "local";

test.beforeEach(() => {
  test.skip(!adminEmail || !adminPassword, "Synthetic Preview admin credentials are required.");
});

async function loginThroughBrowser(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(adminEmail!);
  await page.getByLabel("Password").fill(adminPassword!);
  const responsePromise = page.waitForResponse((response) => response.url().endsWith("/api/auth/login") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Sign in" }).click();
  expect((await responsePromise).status()).toBe(200);
  await page.waitForURL(/\/dashboard/);
}

test("login rotates a session and permits protected dashboard and API access", async ({ context, page }) => {
  await loginThroughBrowser(page);
  const firstSession = (await context.cookies()).find((cookie) => cookie.name === "okcWholesaleAdminSession");
  await context.clearCookies({ name: "okcWholesaleAdminSession" });
  await loginThroughBrowser(page);
  const session = (await context.cookies()).find((cookie) => cookie.name === "okcWholesaleAdminSession");
  expect(session?.httpOnly).toBe(true);
  expect(session?.sameSite).toBe("Lax");
  expect(session?.value).not.toBe(firstSession?.value);

  const protectedApi = await context.request.get("/api/workflow-orchestration-readiness");
  expect(protectedApi.ok()).toBe(true);
  expect((await protectedApi.json()).safety.noProviderCalls).toBe(true);
});

test("invalid credentials stay generic and durable login throttling returns Retry-After", async ({ request }) => {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await request.post("/api/auth/login", {
      headers: { Origin: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020" },
      data: { email: `throttle-probe-${certificationRunId}@example.test`, password: "invalid" },
    });
    const body = await response.json();
    expect(body.error).toBe("Invalid email or password.");
    if (attempt <= 5) expect(response.status()).toBe(401);
    if (attempt === 6) {
      expect(response.status()).toBe(429);
      expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
    }
  }
});

test("public intake throttling rejects repeated synthetic submissions without creating a lead", async ({ request }) => {
  const tenantId = process.env.PUBLIC_INTAKE_TENANT_ID!;
  const probeIp = `198.51.100.${(certificationRunId.length % 200) + 1}`;
  const phone = `405555${certificationRunId.replace(/\D/g, "").padEnd(4, "0").slice(-4)}`;
  const propertyAddress = `Phase 1 ${certificationRunId} Test Avenue`;
  const duplicateIdentifier = `${phone}:${propertyAddress}`;

  try {
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const response = await request.post("/api/leads", {
        headers: { "x-vercel-forwarded-for": probeIp },
        data: {
          firstName: "Phase",
          lastName: "Certification",
          email: `phase1-${certificationRunId}@example.test`,
          phone,
          propertyAddress,
          city: "Oklahoma City",
          state: "OK",
          zipCode: "73102",
          message: "Synthetic certification submission",
          source: "phase1_preview_acceptance",
          contactPermission: "internal_review_only",
          consentStatus: "not_granted",
          consentSource: "public_seller_form",
          consentTimestamp: new Date().toISOString(),
          doNotContact: true,
          optOutReason: "Certification fixture",
          website: "",
        },
      });

      if (attempt <= 3) {
        expect(response.status()).toBe(400);
        expect((await response.json()).error).toBe("Submission could not be accepted.");
      } else {
        expect(response.status()).toBe(429);
        expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
      }
    }
  } finally {
    await Promise.all([
      resetSecurityRateLimit({ tenantId, purpose: "public_lead_ip", identifier: probeIp }),
      resetSecurityRateLimit({ tenantId, purpose: "public_lead_duplicate", identifier: duplicateIdentifier }),
    ]);
  }
});

test("cross-origin authenticated mutation is rejected while same-origin logout invalidates the session", async ({ context, page }) => {
  await loginThroughBrowser(page);
  const staleSession = (await context.cookies()).find((cookie) => cookie.name === "okcWholesaleAdminSession");
  expect(staleSession).toBeDefined();

  const rejected = await context.request.post("/api/auth/logout", { headers: { Origin: "https://attacker.invalid" }, maxRedirects: 0 });
  expect(rejected.status()).toBe(403);

  const accepted = await context.request.post("/api/auth/logout", {
    headers: { Origin: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020" },
    maxRedirects: 0,
  });
  expect(accepted.status()).toBe(307);
  await context.addCookies([{ name: staleSession!.name, value: staleSession!.value, url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020" }]);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
});

test("security headers cover public, login, protected, and API responses", async ({ context, page }) => {
  await loginThroughBrowser(page);

  for (const path of ["/", "/login", "/dashboard", "/api/workflow-orchestration-readiness"]) {
    const response = await context.request.get(path);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  }
});
