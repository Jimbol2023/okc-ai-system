export type SellerState =
  | "new_uncontacted"
  | "interested"
  | "needs_time"
  | "price_gap"
  | "follow_up_needed"
  | "hot_ready"
  | "cold"
  | "dead"
  | "do_not_contact"
  | "review_required";

export type FollowUpAction =
  | "call"
  | "sms_draft"
  | "email_draft"
  | "task_only"
  | "human_review"
  | "pause"
  | "kill";

export type ConversionPriority =
  | "urgent"
  | "high"
  | "medium"
  | "low"
  | "do_not_pursue";

export type FollowUpRecommendation = {
  sellerState: SellerState;
  priority: ConversionPriority;
  recommendedAction: FollowUpAction;
  nextFollowUpInHours?: number;
  followUpAngle?: string;
  messageGuidance?: string;
  conversionGoal?: string;
  escalationTriggers?: string[];
  stopConditions?: string[];
  risks?: string[];
  requiredVerifications?: string[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
