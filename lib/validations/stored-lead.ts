import { z } from "zod";

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "negotiating",
  "under_contract",
  "closed"
]);

const leadNoteSchema = z.object({
  id: z.string().min(1),
  body: z.string(),
  timestamp: z.string().min(1)
});

const leadFollowUpSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(["sms", "email", "call"]),
  message: z.string(),
  status: z.enum(["pending", "completed"]),
  completedAt: z.string().optional()
});

const leadAnalyzerSchema = z.object({
  arv: z.string(),
  estimatedRepairs: z.string(),
  desiredProfit: z.string()
});

const distressFlagsSchema = z.object({
  taxDelinquent: z.boolean(),
  inheritedProperty: z.boolean(),
  vacantProperty: z.boolean(),
  foreclosureRisk: z.boolean(),
  majorRepairs: z.boolean(),
  tiredLandlord: z.boolean(),
  urgentTimeline: z.boolean(),
  outOfStateOwner: z.boolean()
});

const approvalHistoryItemSchema = z.object({
  action: z.string(),
  fromStatus: z.string(),
  toStatus: z.string(),
  note: z.string().optional(),
  at: z.string()
});

const mockOutreachHistoryItemSchema = z.object({
  id: z.string(),
  at: z.string(),
  provider: z.enum(["mock", "not_called"]),
  mode: z.enum(["simulation", "live_disabled"]),
  simulated: z.boolean(),
  blocked: z.boolean(),
  sent: z.literal(false),
  wouldSend: z.literal(false),
  providerCalled: z.literal(false).optional(),
  targetPhone: z.string().nullable().optional(),
  messagePreview: z.string().nullable().optional(),
  reasonCodes: z.array(z.string()),
  reasons: z.array(z.string()),
  missingRequirements: z.array(z.string())
});

export const storedLeadSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().min(1),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  propertyAddress: z.string().min(1),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  ownerName: z.string(),
  mailingAddress: z.string(),
  county: z.string(),
  parcelId: z.string(),
  situationDetails: z.string(),
  source: z.string().min(1),
  status: leadStatusSchema,
  notes: z.array(leadNoteSchema),
  followUps: z.array(leadFollowUpSchema),
  analyzer: leadAnalyzerSchema,
  distressFlags: distressFlagsSchema,
  opportunityScore: z.enum(["Low", "Medium", "High"]),
  score: z.number(),
  priority: z.enum(["High", "Medium", "Low"]),
  scoreBreakdown: z.string(),
  lastContactedAt: z.union([z.string(), z.date(), z.null()]).optional(),
  nextFollowUpAt: z.union([z.string(), z.date(), z.null()]).optional(),
  followUpCount: z.number().optional(),
  lastFollowUpMessage: z.string().nullable().optional(),
  suggestedReply: z.string().nullable().optional(),
  automationStatus: z.string().nullable().optional(),
  approvalStatus: z.string().nullable().optional(),
  doNotContact: z.boolean().nullable().optional(),
  requiresHumanApproval: z.boolean().nullable().optional(),
  lastSellerReply: z.string().nullable().optional(),
  isHot: z.boolean().nullable().optional(),
  latestApprovalAction: z.string().nullable().optional(),
  latestApprovalNote: z.string().nullable().optional(),
  latestApprovalAt: z.string().nullable().optional(),
  approvalHistory: z.array(approvalHistoryItemSchema).optional(),
  latestMockOutreachAt: z.string().nullable().optional(),
  latestMockOutreachResult: z.string().nullable().optional(),
  latestMockOutreachMessage: z.string().nullable().optional(),
  latestMockOutreachBlockedReasons: z.array(z.string()).optional(),
  mockOutreachHistory: z.array(mockOutreachHistoryItemSchema).optional()
});

export const storedLeadArraySchema = z.array(storedLeadSchema);

export type StoredLeadInput = z.infer<typeof storedLeadSchema>;
export type LeadStatusInput = z.infer<typeof leadStatusSchema>;
