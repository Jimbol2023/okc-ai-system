import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const toolbarStorageKey = "jcapital.accessibility.preferences.v1";
const consentStorageKey = "jcapital_cookie_consent_v1";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ consentKey }) => {
      window.localStorage.setItem(consentKey, "declined");
    },
    { consentKey: consentStorageKey }
  );
});

test("accessibility toolbar opens, closes with Escape, and restores focus", async ({ page }) => {
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open accessibility preferences" });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Enter");

  const panel = page.getByRole("region", { name: "Accessibility preferences" });
  await expect(panel).toBeVisible();
  const closeTrigger = page.getByRole("button", { name: "Close accessibility preferences" }).first();
  await expect(closeTrigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Open accessibility preferences" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Open accessibility preferences" })).toHaveAttribute("aria-expanded", "false");
});

test("accessibility preferences apply, persist, and reset", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open accessibility preferences" }).click();

  await page.getByRole("button", { name: "Larger" }).click();
  await page.getByRole("button", { name: "High contrast" }).click();
  await page.getByRole("button", { name: "Underline links" }).click();
  await page.getByRole("button", { name: "Readable font" }).click();
  await page.getByRole("button", { name: "Enhanced focus" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-text", "increase");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-contrast", "true");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-links", "underline");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-font", "readable");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-focus", "enhanced");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-text", "increase");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-contrast", "true");

  await page.getByRole("button", { name: "Open accessibility preferences" }).click();
  await page.getByRole("button", { name: "Reset preferences" }).click();
  await page.getByRole("button", { name: "Reset", exact: true }).click();

  await expect(page.locator("html")).not.toHaveAttribute("data-jcapital-a11y-text", "increase");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-contrast", "false");
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), toolbarStorageKey)).toBe(null);
});

test("accessibility toolbar supports mobile layout and reduced motion preference", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open accessibility preferences" }).click();
  await expect(page.getByRole("region", { name: "Accessibility preferences" })).toBeVisible();
  await page.getByRole("button", { name: "Reduced motion" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-motion", "reduce");
  await expect(page.getByRole("button", { name: "Reduced motion" })).toHaveAttribute("aria-pressed", "true");
});

test("accessibility toolbar does not block cookie controls and has no axe violations", async ({ page }) => {
  await page.addInitScript(
    ({ consentKey }) => {
      window.localStorage.removeItem(consentKey);
    },
    { consentKey: consentStorageKey }
  );

  await page.goto("/");

  await expect(page.getByRole("button", { name: "Decline Optional" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
  await page.getByRole("button", { name: "Decline Optional" }).click();
  await expect(page.getByRole("button", { name: "Open accessibility preferences" })).toBeVisible();

  const results = await new AxeBuilder({ page }).include(".accessibility-toolbar").analyze();
  expect(results.violations).toEqual([]);
});
