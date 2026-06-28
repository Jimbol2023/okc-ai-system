export const salesAttributionStatuses = ["manual_review", "confirmed", "unknown", "rejected"] as const;

export type SalesAttributionStatus = (typeof salesAttributionStatuses)[number];

export const salesAssistApprovalStatuses = ["pending_manual_review", "approved_for_manual_use", "rejected"] as const;

export type SalesAssistApprovalStatus = (typeof salesAssistApprovalStatuses)[number];

export const futureApiReviewStatuses = ["blocked_now", "future_gated", "not_recommended_yet"] as const;

export type FutureApiReviewStatus = (typeof futureApiReviewStatuses)[number];
