import { defineConfig, devices } from "@playwright/test";

const devServerCommand = process.platform === "win32" ? "npm.cmd run dev -- -p 3020" : "npm run dev -- -p 3020";

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
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER === "true" ? undefined : {
    command: devServerCommand,
    url: "http://127.0.0.1:3020",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
