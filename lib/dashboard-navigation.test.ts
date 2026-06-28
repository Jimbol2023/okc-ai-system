import assert from "node:assert/strict";
import test from "node:test";

import { dashboardNavigationItems, filterDashboardNavigationItems } from "@/lib/dashboard-navigation";

test("dashboard navigation includes core operating pages", () => {
  const hrefs = dashboardNavigationItems.map((item) => item.href);

  assert.ok(hrefs.includes("/dashboard/leads"));
  assert.ok(hrefs.includes("/dashboard/knowledge"));
  assert.ok(hrefs.includes("/dashboard/properties"));
  assert.ok(hrefs.includes("/dashboard/marketing"));
});

test("filterDashboardNavigationItems matches command palette keywords", () => {
  const results = filterDashboardNavigationItems("probate");

  assert.equal(results[0]?.href, "/dashboard/knowledge");
});
