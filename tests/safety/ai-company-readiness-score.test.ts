import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiCompanyReadinessScore } from "@/lib/ai-company-readiness-score";
import { createAiWorkforceCommandCenterFromInputs } from "@/lib/ai-collaboration-engine";
import { createAiEmployeeToolboxReadinessFromInputs } from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";

function inputs() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt: "2026-07-09T13:00:00.000Z" });
  const toolbox = createAiEmployeeToolboxReadinessFromInputs({ workforce, generatedAt: "2026-07-09T13:00:00.000Z" });
  const dailyRevenueOperatingLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt: "2026-07-09T13:00:00.000Z" });
  const commandCenter = createAiWorkforceCommandCenterFromInputs({ workforce, toolbox, dailyRevenueOperatingLoop });

  return { workforce, toolbox, dailyRevenueOperatingLoop, commandCenter };
}

test("readiness score separates internal readiness from external readiness", () => {
  const { workforce, toolbox, dailyRevenueOperatingLoop, commandCenter } = inputs();
  const score = createAiCompanyReadinessScore({
    workforce,
    toolbox,
    dailyRevenueOperatingLoop,
    collaborationRequestCount: commandCenter.requests.length,
    employeesRepresentedInCommandCenter: commandCenter.employees.length,
  });

  assert.ok(score.internalOperationalReadiness.overall > score.externalOperationalReadiness.overall);
  assert.ok(score.internalOperationalReadiness.workforce >= 90);
  assert.equal(score.internalOperationalReadiness.operatingLoop, 100);
  assert.equal(score.internalOperationalReadiness.ceoReview, 100);
  assert.ok(score.externalOperationalReadiness.overall <= 35);
  assert.equal(score.externalOperationalReadiness.publishing, 0);
  assert.equal(score.externalOperationalReadiness.communications, 0);
  assert.equal(score.externalOperationalReadiness.automation, 0);
});

test("overall AI company readiness uses honest internal/external weighting", () => {
  const { workforce, toolbox, dailyRevenueOperatingLoop, commandCenter } = inputs();
  const score = createAiCompanyReadinessScore({
    workforce,
    toolbox,
    dailyRevenueOperatingLoop,
    collaborationRequestCount: commandCenter.requests.length,
    employeesRepresentedInCommandCenter: commandCenter.employees.length,
  });

  assert.ok(score.overallAiCompanyReadiness >= 0);
  assert.ok(score.overallAiCompanyReadiness <= 100);
  assert.ok(score.overallAiCompanyReadiness < score.internalOperationalReadiness.overall);
  assert.equal(score.safety.providerCalled, false);
  assert.equal(score.safety.liveExecutionAllowed, false);
  assert.equal(score.safety.externalExecutionAllowed, false);
});
