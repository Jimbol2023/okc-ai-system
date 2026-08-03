import { mkdir, writeFile } from "node:fs/promises";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

type PageAuditResult = {
  path: string;
  axeCriticalViolations: number;
  axeSeriousViolations: number;
  keyboardFocusableElements: number;
  visibleFocusPassed: boolean;
  screenReaderStructurePassed: boolean;
  toolbarPassed: boolean | null;
  servedUrl: string;
  eyebrowClasses: string[];
};

const reportPath = "accessibility-results/accessibility-certification/playwright-a11y.json";
const publicPaths = ["/", "/accessibility", "/contact", "/resources/education"];
const unauthenticatedPaths = ["/login"];
const consentStorageKey = "jcapital_cookie_consent_v1";
const toolbarStorageKey = "jcapital.accessibility.preferences.v1";

async function preparePage(page: Page) {
  await page.addInitScript(
    ({ consentKey, toolbarKey }) => {
      window.localStorage.setItem(consentKey, "declined");
      window.localStorage.removeItem(toolbarKey);
    },
    { consentKey: consentStorageKey, toolbarKey: toolbarStorageKey },
  );
}

async function assertVisibleFocus(page: Page) {
  await page.keyboard.press("Tab");

  return page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active || active === document.body) return false;
    const style = getComputedStyle(active);
    const rect = active.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0;
    const hasFocusIndicator =
      style.outlineStyle !== "none" ||
      Number.parseFloat(style.outlineWidth) > 0 ||
      style.boxShadow !== "none" ||
      active.className.toString().includes("focus:");

    return visible && hasFocusIndicator;
  });
}

async function countKeyboardStops(page: Page) {
  const labels: string[] = [];

  for (let index = 0; index < 16; index += 1) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body) return "";
      return [
        active.tagName.toLowerCase(),
        active.getAttribute("aria-label") ?? "",
        active.textContent?.trim().slice(0, 80) ?? "",
        active.getAttribute("href") ?? "",
      ].join("|");
    });
    if (label) labels.push(label);
  }

  return new Set(labels).size;
}

async function assertScreenReaderStructure(page: Page, path: string) {
  const main = page.locator("main").first();
  await expect(main, `${path} should expose a main landmark`).toBeVisible();
  await expect(page.locator("h1, h2").first(), `${path} should expose a semantic heading`).toBeVisible();

  const unlabeledControls = await page.locator("button, input, select, textarea").evaluateAll((elements) =>
    elements.filter((element) => {
      const htmlElement = element as HTMLElement;
      const ariaLabel = htmlElement.getAttribute("aria-label")?.trim();
      const labelledBy = htmlElement.getAttribute("aria-labelledby")?.trim();
      const text = htmlElement.textContent?.trim();
      const input = htmlElement as HTMLInputElement;
      const id = htmlElement.getAttribute("id");
      const wrappingLabel = htmlElement.closest("label");
      const explicitLabel = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;

      return !ariaLabel && !labelledBy && !text && !input.value && !wrappingLabel && !explicitLabel;
    }).length,
  );

  expect(unlabeledControls, `${path} should not have unlabeled controls`).toBe(0);
}

async function assertToolbar(page: Page, path: string) {
  const trigger = page.getByRole("button", { name: "Open accessibility preferences" });
  await expect(trigger, `${path} should expose the accessibility toolbar`).toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Enter");

  const panel = page.getByRole("region", { name: "Accessibility preferences" });
  await expect(panel).toBeVisible();
  const contrast = page.getByRole("button", { name: "High contrast" });
  const focus = page.getByRole("button", { name: "Enhanced focus" });
  if ((await contrast.getAttribute("aria-pressed")) !== "true") await contrast.click();
  if ((await focus.getAttribute("aria-pressed")) !== "true") await focus.click();
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-contrast", "true");
  await expect(page.locator("html")).toHaveAttribute("data-jcapital-a11y-focus", "enhanced");
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Open accessibility preferences" })).toBeFocused();
}

async function auditPage(page: Page, path: string, toolbarExpected: boolean): Promise<PageAuditResult> {
  await preparePage(page);
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  const servedUrl = page.url();
  const eyebrowClasses = await page.locator(".tracking-\\[0\\.22em\\]").evaluateAll((elements) =>
    elements.slice(0, 2).map((element) => element.getAttribute("class") ?? ""),
  );
  console.log(JSON.stringify({ path, servedUrl, eyebrowClasses }));

  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const critical = axe.violations.filter((violation) => violation.impact === "critical");
  const serious = axe.violations.filter((violation) => violation.impact === "serious");
  const visibleFocusPassed = await assertVisibleFocus(page);
  const keyboardFocusableElements = await countKeyboardStops(page);

  await assertScreenReaderStructure(page, path);
  if (toolbarExpected) await assertToolbar(page, path);

  expect(critical, `${path} should have zero critical axe violations`).toEqual([]);
  expect(serious, `${path} should have zero serious axe violations`).toEqual([]);
  expect(visibleFocusPassed, `${path} should show visible focus`).toBe(true);
  expect(keyboardFocusableElements, `${path} should expose keyboard reachable controls/links`).toBeGreaterThan(0);

  return {
    path,
    servedUrl,
    eyebrowClasses,
    axeCriticalViolations: critical.length,
    axeSeriousViolations: serious.length,
    keyboardFocusableElements,
    visibleFocusPassed,
    screenReaderStructurePassed: true,
    toolbarPassed: toolbarExpected ? true : null,
  };
}

test("release accessibility certification passes representative public and admin entry pages", async ({ page }) => {
  const results: PageAuditResult[] = [];

  for (const path of publicPaths) {
    results.push(await auditPage(page, path, true));
  }
  for (const path of unauthenticatedPaths) {
    results.push(await auditPage(page, path, false));
  }

  await mkdir("accessibility-results/accessibility-certification", { recursive: true });
  await writeFile(
    reportPath,
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      wcagTarget: "WCAG 2.2 AA",
      pages: results,
      providerCalled: false,
      liveExecutionAllowed: false,
    }, null, 2)}\n`,
  );
});
