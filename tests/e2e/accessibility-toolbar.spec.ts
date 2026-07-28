import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const toolbarStorageKey = "jcapital.accessibility.preferences.v1";
const consentStorageKey = "jcapital_cookie_consent_v1";

async function showCookieNotice(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(
    ({ consentKey }) => {
      window.localStorage.removeItem(consentKey);
      window.dispatchEvent(new Event("jcapital-cookie-consent-change"));
    },
    { consentKey: consentStorageKey }
  );
  await expect(page.getByRole("region", { name: "Cookie notice" })).toBeVisible();
}

async function getCookieToolbarLayout(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const cookieNotice = document.querySelector<HTMLElement>('[aria-label="Cookie notice"]');
    const toolbar = document.querySelector<HTMLElement>(".accessibility-toolbar");
    const trigger = document.querySelector<HTMLElement>(".accessibility-toolbar__trigger");

    if (!cookieNotice || !toolbar || !trigger) {
      throw new Error("Cookie notice and accessibility toolbar must be mounted.");
    }

    const cookieRect = cookieNotice.getBoundingClientRect();
    const toolbarRect = toolbar.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const hitTarget = document.elementFromPoint(
      triggerRect.left + triggerRect.width / 2,
      triggerRect.top + triggerRect.height / 2
    );

    return {
      cookieHeight: cookieRect.height,
      cookieTop: cookieRect.top,
      toolbarBottom: toolbarRect.bottom,
      triggerHit: hitTarget?.closest(".accessibility-toolbar__trigger") === trigger,
      offset: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cookie-consent-offset")),
    };
  });
}

async function expectToolbarAboveCookieNotice(page: import("@playwright/test").Page) {
  await expect
    .poll(async () => {
      const layout = await getCookieToolbarLayout(page);
      return {
        offsetMatchesHeight: Math.abs(layout.offset - layout.cookieHeight) < 1,
        toolbarClearsCookie: layout.toolbarBottom <= layout.cookieTop,
        triggerHit: layout.triggerHit,
      };
    })
    .toEqual({
      offsetMatchesHeight: true,
      toolbarClearsCookie: true,
      triggerHit: true,
    });
}

test.describe("with a saved consent choice", () => {
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
});

test("accessibility toolbar does not block cookie controls and has no axe violations", async ({ page }) => {
  await showCookieNotice(page);

  await expect(page.getByRole("button", { name: "Decline Optional" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
  await expectToolbarAboveCookieNotice(page);
  await page.getByRole("button", { name: "Decline Optional" }).click();
  await expect(page.getByRole("button", { name: "Open accessibility preferences" })).toBeVisible();

  const results = await new AxeBuilder({ page }).include(".accessibility-toolbar").analyze();
  expect(results.violations).toEqual([]);
});

test("cookie notice offsets the toolbar and accepting consent restores its desktop edge position", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  await showCookieNotice(page);

  await expectToolbarAboveCookieNotice(page);

  const trigger = page.getByRole("button", { name: "Open accessibility preferences" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Accessibility preferences" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Accept" }).click();
  await expect(page.getByRole("region", { name: "Cookie notice" })).toBeHidden();
  await expect.poll(() => page.locator("html").evaluate((root) => getComputedStyle(root).getPropertyValue("--cookie-consent-offset").trim())).toBe("0px");
  await expect
    .poll(() => page.locator(".accessibility-toolbar").evaluate((toolbar) => window.innerHeight - toolbar.getBoundingClientRect().bottom))
    .toBe(16);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("declining optional consent restores the toolbar mobile edge position without blocking Accept", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await showCookieNotice(page);

  await expectToolbarAboveCookieNotice(page);
  await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
  await page.getByRole("button", { name: "Decline Optional" }).click();
  await expect(page.getByRole("region", { name: "Cookie notice" })).toBeHidden();
  await expect
    .poll(() => page.locator(".accessibility-toolbar").evaluate((toolbar) => window.innerHeight - toolbar.getBoundingClientRect().bottom))
    .toBe(12);
});

test("toolbar offset follows viewport and cookie notice height changes at mobile and 200% equivalent width", async ({ page }) => {
  await showCookieNotice(page);
  await expectToolbarAboveCookieNotice(page);

  const desktopHeight = (await getCookieToolbarLayout(page)).cookieHeight;
  await page.setViewportSize({ width: 390, height: 844 });
  await expectToolbarAboveCookieNotice(page);
  const mobileHeight = (await getCookieToolbarLayout(page)).cookieHeight;
  expect(mobileHeight).toBeGreaterThan(desktopHeight);

  await page.locator('[aria-label="Cookie notice"]').evaluate((notice) => {
    (notice as HTMLElement).style.paddingBottom = "5rem";
  });
  await expectToolbarAboveCookieNotice(page);

  await page.setViewportSize({ width: 640, height: 400 });
  await expectToolbarAboveCookieNotice(page);
  await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
});

test("MutationObserver fallback updates the toolbar offset when ResizeObserver is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "ResizeObserver", { configurable: true, value: undefined });
  });
  await showCookieNotice(page);
  await expectToolbarAboveCookieNotice(page);

  const initialOffset = (await getCookieToolbarLayout(page)).offset;
  await page.locator('[aria-label="Cookie notice"] p').nth(1).evaluate((paragraph) => {
    paragraph.textContent = `${paragraph.textContent} ${"Additional notice text that changes the rendered banner height. ".repeat(8)}`;
  });
  await expectToolbarAboveCookieNotice(page);
  expect((await getCookieToolbarLayout(page)).offset).toBeGreaterThan(initialOffset);
});
