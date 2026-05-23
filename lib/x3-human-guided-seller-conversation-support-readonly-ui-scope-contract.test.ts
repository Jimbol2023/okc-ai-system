import { createX3HumanGuidedSellerConversationSupportReadonlyUiScopeContract, x3ReadonlyUiAuthorizedSurfaces, x3ReadonlyUiWording } from "./x3-human-guided-seller-conversation-support-readonly-ui-scope-contract";

describe("X3D human-guided seller conversation support read-only UI scope contract", () => {
  it("defines authorized surfaces and safe wording", () => {
    const result = createX3HumanGuidedSellerConversationSupportReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x3ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/human-guided-seller-conversation-support-summary.tsx");
    expect(x3ReadonlyUiWording.followUpLanguage).toMatch(/does not send messages/);
    expect(result.flags.sent).toBe(false);
  });

  it("blocks controls and network behavior", () => {
    const result = createX3HumanGuidedSellerConversationSupportReadonlyUiScopeContract({ sendControlRequested: true, callControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x3_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/send controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/call controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
