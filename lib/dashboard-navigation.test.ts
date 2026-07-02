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

test("dashboard navigation consolidates security and safety labels", () => {
  const labels = dashboardNavigationItems.map((item) => item.label);

  assert.ok(labels.includes("Security & Governance"));
  assert.ok(labels.includes("Hardening"));
  assert.ok(!labels.includes("Security"));
  assert.ok(!labels.includes("Safety Center"));
});

test("dashboard navigation is grouped like an operating company", () => {
  const groups = new Set(dashboardNavigationItems.map((item) => item.group));

  assert.ok(groups.has("Executive"));
  assert.ok(groups.has("Growth"));
  assert.ok(groups.has("Intelligence"));
  assert.ok(groups.has("Company"));
  assert.ok(groups.has("Security & Governance"));
  assert.equal(dashboardNavigationItems.find((item) => item.href === "/dashboard")?.label, "AI COO");
});

test("filterDashboardNavigationItems matches command palette keywords", () => {
  const results = filterDashboardNavigationItems("probate");

  assert.equal(results[0]?.href, "/dashboard/knowledge");
});
