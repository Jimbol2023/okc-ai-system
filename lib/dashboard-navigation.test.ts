import assert from "node:assert/strict";
import test from "node:test";

import { dashboardNavigationItems, filterDashboardNavigationItems } from "@/lib/dashboard-navigation";

test("dashboard navigation includes core operating pages", () => {
  const hrefs = dashboardNavigationItems.map((item) => item.href);

  assert.ok(hrefs.includes("/dashboard/leads"));
  assert.ok(hrefs.includes("/dashboard/knowledge"));
  assert.ok(hrefs.includes("/dashboard/properties"));
  assert.ok(hrefs.includes("/dashboard/marketing"));
  assert.ok(hrefs.includes("/dashboard/drafts"));
});

test("dashboard navigation consolidates security and safety labels", () => {
  const labels = dashboardNavigationItems.map((item) => item.label);

  assert.ok(labels.includes("Security & Governance"));
  assert.ok(labels.includes("Hardening"));
  assert.ok(!labels.includes("Security"));
  assert.ok(!labels.includes("Safety Center"));
});

test("filterDashboardNavigationItems matches command palette keywords", () => {
  const results = filterDashboardNavigationItems("probate");

  assert.equal(results[0]?.href, "/dashboard/knowledge");
});

test("filterDashboardNavigationItems exposes the CEO Draft Workspace", () => {
  assert.equal(filterDashboardNavigationItems("ceo review")[0]?.href, "/dashboard/drafts");
  assert.equal(filterDashboardNavigationItems("workspace")[0]?.href, "/dashboard/drafts");
});
