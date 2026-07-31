import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function signIn(page: Page) {
  test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD are required for authenticated CEO scorecard tests.");

  await page.goto("/login");
  await page.getByLabel("Email").fill(adminEmail ?? "");
  await page.getByLabel("Password").fill(adminPassword ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("CEO operating scorecard", () => {
  test("renders scorecard summary with blocked execution states", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/command-center");

    const scorecard = page.getByTestId("ceo-operating-scorecard");
    await expect(scorecard).toBeVisible();
    await expect(page.getByRole("heading", { name: "Daily operating loop control" })).toBeVisible();
    await expect(page.getByText("Increase source-attributed qualified seller conversations")).toBeVisible();
    await expect(scorecard.getByText("read-only").first()).toBeVisible();
    await expect(scorecard.getByText("providerCalled:false").first()).toBeVisible();
    await expect(scorecard.getByText("external:false").first()).toBeVisible();
    await expect(scorecard.getByText("blocked_until_phase3_promotion").first()).toBeVisible();
  });

  test("supports mobile layout and keyboard navigation to drill-down links", async ({ page }) => {
    await signIn(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard/command-center");

    await expect(page.getByTestId("ceo-operating-scorecard")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Scorecard drill-down links" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Revenue" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "KPI Movement" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Controlled Operating Loop" })).toBeVisible();
  });

  test("has no detectable accessibility violations in the scorecard container", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/command-center");

    await expect(page.getByTestId("ceo-operating-scorecard")).toBeVisible();
    const results = await new AxeBuilder({ page }).include("[data-testid='ceo-operating-scorecard']").analyze();
    expect(results.violations).toEqual([]);
  });
});
