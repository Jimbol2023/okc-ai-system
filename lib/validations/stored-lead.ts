import { z } from "zod";

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

export const storedLeadSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().min(1),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().min(1),
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
  status: z.enum(["new", "contacted"]),
  notes: z.array(leadNoteSchema),
  followUps: z.array(leadFollowUpSchema),
  analyzer: leadAnalyzerSchema,
  distressFlags: distressFlagsSchema,
  opportunityScore: z.enum(["Low", "Medium", "High"]),
  score: z.number(),
  priority: z.enum(["High", "Medium", "Low"]),
  scoreBreakdown: z.string()
});

export const storedLeadArraySchema = z.array(storedLeadSchema);

export type StoredLeadInput = z.infer<typeof storedLeadSchema>;
