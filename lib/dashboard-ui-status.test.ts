import assert from "node:assert/strict";
import test from "node:test";

import { getDashboardStatusClasses, getDashboardStatusLabel } from "@/lib/dashboard-ui-status";

test("dashboard status labels are human readable", () => {
  assert.equal(getDashboardStatusLabel("good"), "Healthy");
  assert.equal(getDashboardStatusLabel("watch"), "Watch");
  assert.equal(getDashboardStatusLabel("urgent"), "Needs Attention");
  assert.equal(getDashboardStatusLabel("missing"), "Missing");
});

test("dashboard status classes preserve contrast tokens", () => {
  assert.match(getDashboardStatusClasses("urgent"), /text-red-900/);
  assert.match(getDashboardStatusClasses("good"), /text-emerald-900/);
});
