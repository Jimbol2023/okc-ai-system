import { defineConfig, devices } from "@playwright/test";

const playwrightPort = process.env.PLAYWRIGHT_PORT ?? "3020";
const playwrightBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${playwrightPort}`;
const devServerCommand = process.platform === "win32" ? `npm.cmd run dev -- -p ${playwrightPort}` : `npm run dev -- -p ${playwrightPort}`;
const useBuiltInWebServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER !== "true" && process.platform !== "win32";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  globalSetup: process.platform === "win32" ? "./tests/e2e/playwright-global-setup.ts" : undefined,
  use: {
    baseURL: playwrightBaseUrl,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: useBuiltInWebServer ? {
    command: devServerCommand,
    url: playwrightBaseUrl,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER !== "false",
    timeout: 120_000,
  } : undefined,
});
