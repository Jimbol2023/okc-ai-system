export type AutomationDryRunLead = {
  id: string;
  propertyAddress: string;
  name?: string | null;
  phone?: string | null;
  approvalStatus?: string | null;
  automationStatus?: string | null;
  doNotContact?: boolean | null;
  requiresHumanApproval?: boolean | null;
  nextFollowUpAt?: Date | string | null;
  lastContactedAt?: Date | string | null;
  followUpCount?: number | null;
  suggestedReply?: string | null;
  lastFollowUpMessage?: string | null;
  score?: number | null;
  priority?: string | null;
};

export type AutomationDryRunAction = {
  leadId: string;
  propertyAddress: string;
  automationStatus: string;
  followUpCount: number;
  action: "mock_follow_up_sms";
  dryRun: true;
  automationExecuted: false;
  providerCalled: false;
  wouldSendSms: false;
  wouldSendEmail: false;
  wouldMutateLead: false;
  wouldCreateLeads: false;
  requiresHumanApproval: true;
  reason: string;
  messagePreview: string | null;
  blockedReasons: string[];
};

export type AutomationDryRunPlan = {
  ok: true;
  ranAt: string;
  dryRun: true;
  automationExecuted: false;
  providerCalled: false;
  sent: false;
  wouldSendSms: false;
  wouldSendEmail: false;
  wouldMutateLead: false;
  wouldCreateLeads: false;
  dueLeadCount: number;
  queuedActionCount: number;
  skippedLeadCount: number;
  queuedAutomationActions: AutomationDryRunAction[];
  safety: {
    readOnly: true;
    smsBlocked: true;
    emailBlocked: true;
    providerBlocked: true;
    dbWritesBlocked: true;
    leadCreationBlocked: true;
    liveAutomationBlocked: true;
    requiresHumanApproval: true;
  };
  summary: string;
};

type AutomationDryRunOptions = {
  now?: Date;
  maxActions?: number;
  minHoursBetweenContact?: number;
  maxFollowUpAttempts?: number;
};

const defaultOptions = {
  maxActions: 5,
  minHoursBetweenContact: 12,
  maxFollowUpAttempts: 4,
};

function getTime(value?: Date | string | null) {
  if (!value) return 0;
  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isDueForFollowUp(lead: AutomationDryRunLead, now: Date) {
  const nextFollowUpTime = getTime(lead.nextFollowUpAt);

  return nextFollowUpTime > 0 && nextFollowUpTime <= now.getTime();
}

function wasContactedTooRecently(lead: AutomationDryRunLead, now: Date, minHoursBetweenContact: number) {
  const lastContactedTime = getTime(lead.lastContactedAt);

  if (lastContactedTime <= 0) return false;

  const hoursSinceLastContact = (now.getTime() - lastContactedTime) / (1000 * 60 * 60);

  return hoursSinceLastContact < minHoursBetweenContact;
}

function normalizePhoneForPreview(phone?: string | null) {
  const trimmedPhone = phone?.trim() ?? "";

  if (/^\+\d{10,15}$/.test(trimmedPhone)) return trimmedPhone;

  const digits = trimmedPhone.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return "";
}

function buildFollowUpMessage(lead: AutomationDryRunLead, maxFollowUpAttempts: number) {
  const followUpCount = lead.followUpCount ?? 0;
  const firstName = lead.name?.split(" ")[0] || "";

  if (lead.suggestedReply?.trim()) return lead.suggestedReply.trim();
  if (lead.lastFollowUpMessage?.trim()) return lead.lastFollowUpMessage.trim();
  if (followUpCount >= maxFollowUpAttempts) return null;

  if (followUpCount === 0) {
    return `Hi ${firstName}, I came across your property at ${lead.propertyAddress}. Would you consider an offer if it made sense?`;
  }

  if (followUpCount === 1) {
    return `Hey ${firstName}, just following up on ${lead.propertyAddress}. Let me know if you'd be open to discussing a possible offer.`;
  }

  if (followUpCount === 2) {
    return `Hi ${firstName}, I wanted to reach out again about ${lead.propertyAddress}. I can put together a quick offer if you're even slightly considering selling.`;
  }

  return `Hey ${firstName}, I have not heard back regarding ${lead.propertyAddress}, so I will assume it is not a good time. If anything changes, feel free to reach out anytime.`;
}

function getBlockedReasons(lead: AutomationDryRunLead, now: Date, options: Required<AutomationDryRunOptions>) {
  const blockedReasons: string[] = [];
  const normalizedPhone = normalizePhoneForPreview(lead.phone);

  if (lead.automationStatus !== "scheduled") blockedReasons.push("automation_not_scheduled");
  if (!isDueForFollowUp(lead, now)) blockedReasons.push("follow_up_not_due");
  if (lead.doNotContact) blockedReasons.push("do_not_contact");
  if (!normalizedPhone) blockedReasons.push("missing_or_invalid_phone");
  if ((lead.followUpCount ?? 0) >= options.maxFollowUpAttempts) blockedReasons.push("max_follow_ups_reached");
  if (wasContactedTooRecently(lead, now, options.minHoursBetweenContact)) blockedReasons.push("recent_contact_window");
  if (lead.approvalStatus !== "approved_for_outreach") blockedReasons.push("not_approved_for_outreach");
  if (lead.requiresHumanApproval) blockedReasons.push("requires_human_review");

  return blockedReasons;
}

function createDryRunAction(lead: AutomationDryRunLead, now: Date, options: Required<AutomationDryRunOptions>): AutomationDryRunAction | null {
  const blockedReasons = getBlockedReasons(lead, now, options);
  const messagePreview = buildFollowUpMessage(lead, options.maxFollowUpAttempts);

  if (!messagePreview) blockedReasons.push("missing_message");

  if (blockedReasons.length > 0) {
    return null;
  }

  return {
    leadId: lead.id,
    propertyAddress: lead.propertyAddress,
    automationStatus: lead.automationStatus ?? "unknown",
    followUpCount: lead.followUpCount ?? 0,
    action: "mock_follow_up_sms",
    dryRun: true,
    automationExecuted: false,
    providerCalled: false,
    wouldSendSms: false,
    wouldSendEmail: false,
    wouldMutateLead: false,
    wouldCreateLeads: false,
    requiresHumanApproval: true,
    reason: "Eligible for advisory dry-run planning only. No live automation or provider execution is available here.",
    messagePreview,
    blockedReasons: [],
  };
}

export function planAutomationDryRun(leads: AutomationDryRunLead[], options: AutomationDryRunOptions = {}): AutomationDryRunPlan {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
    now: options.now ?? new Date(),
  };
  const dueLeads = leads.filter((lead) => isDueForFollowUp(lead, resolvedOptions.now));
  const queuedAutomationActions = dueLeads
    .map((lead) => createDryRunAction(lead, resolvedOptions.now, resolvedOptions))
    .filter((action): action is AutomationDryRunAction => Boolean(action))
    .slice(0, resolvedOptions.maxActions);
  const skippedLeadCount = dueLeads.length - queuedAutomationActions.length;

  return {
    ok: true,
    ranAt: resolvedOptions.now.toISOString(),
    dryRun: true,
    automationExecuted: false,
    providerCalled: false,
    sent: false,
    wouldSendSms: false,
    wouldSendEmail: false,
    wouldMutateLead: false,
    wouldCreateLeads: false,
    dueLeadCount: dueLeads.length,
    queuedActionCount: queuedAutomationActions.length,
    skippedLeadCount,
    queuedAutomationActions,
    safety: {
      readOnly: true,
      smsBlocked: true,
      emailBlocked: true,
      providerBlocked: true,
      dbWritesBlocked: true,
      leadCreationBlocked: true,
      liveAutomationBlocked: true,
      requiresHumanApproval: true,
    },
    summary:
      `${dueLeads.length} due follow-ups reviewed. ` +
      `${queuedAutomationActions.length} advisory actions planned. ` +
      `${skippedLeadCount} leads skipped by safety gates. ` +
      "Dry-run planning did not create leads, mutate records, send SMS, send email, or call providers.",
  };
}
