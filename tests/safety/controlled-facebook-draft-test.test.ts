import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildControlledFacebookDraftPayload,
  controlledFacebookDraftIdentity,
  controlledFacebookDraftSafetyFlags,
} from "@/lib/controlled-facebook-draft-test";

test("controlled Facebook draft test stays review-only and approval gated", () => {
  const draft = buildControlledFacebookDraftPayload();

  assert.equal(draft.channel, controlledFacebookDraftIdentity.channel);
  assert.equal(draft.topic, controlledFacebookDraftIdentity.topic);
  assert.equal(draft.sourceLabel, controlledFacebookDraftIdentity.sourceLabel);
  assert.equal(draft.status, "pending_approval");
  assert.equal(draft.createdSource, "controlled_facebook_draft_test");
  assert.equal(draft.safetyFlags.providerCalled, false);
  assert.equal(draft.safetyFlags.published, false);
  assert.equal(draft.safetyFlags.scheduled, false);
  assert.equal(draft.safetyFlags.outreachSent, false);
  assert.equal(draft.safetyFlags.connectorActivated, false);
  assert.equal(draft.safetyFlags.approvalRequired, true);
  assert.deepEqual(draft.safetyFlags, controlledFacebookDraftSafetyFlags);
});

test("controlled Facebook draft educates Oklahoma inherited property owners without pressure claims", () => {
  const draft = buildControlledFacebookDraftPayload();

  assert.match(draft.draftCopy, /Inherited property decisions in Oklahoma/i);
  assert.match(draft.draftCopy, /understand the options/i);
  assert.match(draft.draftCopy, /general education only/i);
  assert.match(draft.draftCopy, /not legal advice/i);
  assert.match(draft.draftCopy, /qualified professional/i);
  assert.doesNotMatch(draft.draftCopy, /cash for houses/i);
  assert.doesNotMatch(draft.draftCopy, /guarantee|guaranteed|promise of any outcome/i);
  assert.doesNotMatch(draft.draftCopy, /act now|limited time|urgent|must sell/i);
  assert.doesNotMatch(draft.draftCopy, /we will buy|we buy houses/i);
});

test("controlled Facebook draft includes referral placeholder and Canva square brief without execution", () => {
  const draft = buildControlledFacebookDraftPayload();

  assert.match(draft.referralLink, /^https:\/\/jcapitalpropertygroup\.com\/sell-your-house\?ref=REFERRAL_PLACEHOLDER/);
  assert.match(draft.draftCopy, /Referral-ready link placeholder/i);
  assert.match(draft.assetNotes, /Canva brief/i);
  assert.match(draft.assetNotes, /1:1 square graphic/i);
  assert.match(draft.assetNotes, /manual review only/i);
  assert.match(draft.assetNotes, /do not create, export, publish, schedule, message, activate connectors, or call providers/i);
});
