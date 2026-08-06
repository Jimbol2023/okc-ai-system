export { getCeoExceptionInbox } from "@/lib/ceo-exception-inbox";

export const internalOnlyExceptionInboxFailure = {
  ok: false,
  error: "Unable to load the CEO Exception Inbox.",
  providerCalled: false,
  outreach: false,
  sent: false,
  published: false,
  scraping: false,
  crmMutation: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
} as const;
