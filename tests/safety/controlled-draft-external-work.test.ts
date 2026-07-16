import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createDraftSafetyReviewContract,
  isControlledDraftExternalAction,
} from "@/lib/controlled-execution-maturity";

describe("Sprint 7D controlled draft external work", () => {
  it("supports draft-only external work without provider execution", () => {
    const draft = createDraftSafetyReviewContract({
      actionType: "draft_email",
      title: "Draft seller follow-up email",
      draftBody: "Draft copy for CEO review only. Do not send.",
      claimSourceCheck: "required",
      complianceCheck: "required",
    });

    assert.equal(draft.actionType, "draft_email");
    assert.equal(draft.executable, false);
    assert.equal(draft.ceoReviewRequired, true);
    assert.equal(draft.providerCalled, false);
    assert.equal(draft.liveExecutionAllowed, false);
    assert.deepEqual(
      draft.forbiddenActions,
      ["send", "publish", "schedule", "create_provider_record", "reply_to_review", "post", "scrape"],
    );
  });

  it("recognizes only approved draft action types", () => {
    assert.equal(isControlledDraftExternalAction("draft_calendar_event"), true);
    assert.equal(isControlledDraftExternalAction("draft_drive_doc"), true);
    assert.equal(isControlledDraftExternalAction("send_email"), false);
    assert.equal(isControlledDraftExternalAction("create_calendar_event"), false);
  });
});
