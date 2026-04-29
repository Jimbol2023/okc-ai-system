"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getActiveDistressFlags } from "@/lib/distress-flags";
import { fetchLeadById, updateLead } from "@/lib/leads-api";
import { type LeadAnalyzer, type LeadFollowUp, type StoredLead } from "@/lib/leads-storage";
import { sendSMS } from "@/lib/outreach";

/* =====================================================
   STEP 2B.8 — AI REPLY REVIEW TYPE EXTENSION
   -----------------------------------------------------
   PURPOSE:
   - Allows this page to safely read the new AI Reply Brain fields.
   - Keeps existing StoredLead type untouched for now.
   - Prevents TypeScript errors while we continue upgrading cleanly.
===================================================== */

type LeadWithAIReply = StoredLead & {
  doNotContact?: boolean | null;
  lastSellerReply?: string | null;
  lastSellerReplyAt?: string | null;
  lastSellerReplyIntent?: string | null;
  lastSellerReplyConfidence?: number | null;
  suggestedReply?: string | null;
  requiresHumanApproval?: boolean | null;
};

/* =====================================================
   FORMAT HELPERS
===================================================== */

function formatLeadTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function parseCurrencyInput(value: string) {
  const cleanedValue = value.replace(/[^\d.-]/g, "");
  const parsedValue = Number(cleanedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

/* =====================================================
   DEAL ANALYZER HELPERS
===================================================== */

function getAnalyzerMetrics(analyzer: LeadAnalyzer) {
  const arv = parseCurrencyInput(analyzer.arv);
  const estimatedRepairs = parseCurrencyInput(analyzer.estimatedRepairs);
  const desiredProfit = analyzer.desiredProfit.trim() ? parseCurrencyInput(analyzer.desiredProfit) : 20000;
  const mao = 0.7 * arv - estimatedRepairs;
  const lowOffer = mao - 5000;
  const estimatedProfit = arv - estimatedRepairs - mao;
  const dealRating = estimatedProfit > 20000 ? "Great Deal" : estimatedProfit > 0 ? "Maybe Deal" : "Bad Deal";

  return {
    desiredProfit,
    mao,
    lowOffer,
    estimatedProfit,
    dealRating
  };
}

/* =====================================================
   FOLLOW-UP MESSAGE HELPERS
===================================================== */

function getSuggestedFollowUpMessage(
  type: LeadFollowUp["type"],
  messages: ReturnType<typeof buildFollowUpMessages>
) {
  if (type === "sms") {
    return messages.sms;
  }

  if (type === "email") {
    return `Subject: ${messages.emailSubject}\n\n${messages.emailBody}`;
  }

  return messages.callScript;
}

function sortFollowUpsByDate(followUps: LeadFollowUp[]) {
  return [...followUps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function isOverdueFollowUp(followUp: LeadFollowUp) {
  return followUp.status === "pending" && new Date(followUp.date).getTime() < Date.now();
}

function getLeadFirstName(lead: StoredLead) {
  return lead.firstName.trim() || "there";
}

function getMotivationSnippet(lead: StoredLead) {
  const activeFlags = getActiveDistressFlags(lead.distressFlags);

  if (activeFlags.length > 0) {
    return activeFlags
      .slice(0, 2)
      .map((flag) => flag.label.toLowerCase())
      .join(" and ");
  }

  if (lead.situationDetails.trim()) {
    return "your situation";
  }

  return "the property";
}

function getToneCopy(priority: StoredLead["priority"]) {
  if (priority === "High") {
    return {
      smsCloser: "If timing is important, I can move quickly. Would you like to talk today?",
      emailIntro: "I wanted to reach out directly because it looks like timing may matter here.",
      callIntro: "I wanted to reach out promptly because it seems like this may be a time-sensitive situation."
    };
  }

  if (priority === "Medium") {
    return {
      smsCloser: "If it would help, I can share a fair cash offer and answer any questions.",
      emailIntro: "I wanted to introduce myself and learn a little more about your situation.",
      callIntro: "I wanted to reach out and see if selling could be helpful for you right now."
    };
  }

  return {
    smsCloser: "If you are open to exploring options, I would be happy to connect.",
    emailIntro: "I wanted to make a quick introduction in case selling is something you are considering.",
    callIntro: "I just wanted to introduce myself and see whether selling is something you would be open to discussing."
  };
}

function buildFollowUpMessages(lead: StoredLead, version: number) {
  const firstName = getLeadFirstName(lead);
  const motivationSnippet = getMotivationSnippet(lead);
  const toneCopy = getToneCopy(lead.priority);
  const smsOpeners = [
    `Hi ${firstName}, I saw your property at ${lead.propertyAddress}.`,
    `Hi ${firstName}, I wanted to reach out about ${lead.propertyAddress}.`,
    `Hi ${firstName}, I came across the property at ${lead.propertyAddress}.`
  ];
  const emailSubjects = [
    `Regarding your property at ${lead.propertyAddress}`,
    `Quick question about ${lead.propertyAddress}`,
    `Following up on ${lead.propertyAddress}`
  ];
  const callOpeners = [
    `Hi ${firstName}, this is OKC Wholesale calling about the property at ${lead.propertyAddress}.`,
    `Hi ${firstName}, this is OKC Wholesale reaching out about ${lead.propertyAddress}.`,
    `Hi ${firstName}, this is OKC Wholesale following up on the property at ${lead.propertyAddress}.`
  ];
  const situationLine = lead.situationDetails.trim()
    ? `I understand there may be some factors around ${motivationSnippet}.`
    : `I saw your property at ${lead.propertyAddress} and wanted to reach out.`;
  const variantIndex = version % smsOpeners.length;

  return {
    sms: `${smsOpeners[variantIndex]} ${toneCopy.smsCloser}`,
    emailSubject: emailSubjects[variantIndex],
    emailBody: `Hi ${firstName},

${toneCopy.emailIntro} ${situationLine}

I buy houses in Oklahoma City and can make a fair cash offer with a timeline that works for you. If you would like, I can learn a bit more about the property and see whether we are a fit.

Best,
OKC Wholesale`,
    callScript: `${callOpeners[variantIndex]} ${toneCopy.callIntro}

I wanted to ask a couple quick questions:
- Are you currently considering selling the property?
- What is the condition of the home right now?
- Do you have a timeline in mind?
- Is there anything specific you would want help solving in the sale?

If it makes sense, I can walk you through a simple cash-offer process and next steps.`
  };
}

/* =====================================================
   MAIN LEAD DETAIL CLIENT COMPONENT
===================================================== */

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const initialLead: LeadWithAIReply | null = null;

  const [lead, setLead] = useState<LeadWithAIReply | null>(initialLead);
  const [noteBody, setNoteBody] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [messageVersion, setMessageVersion] = useState(0);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [followUpType, setFollowUpType] = useState<LeadFollowUp["type"]>("sms");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [smsPhone, setSmsPhone] = useState("");
  const [sendSmsState, setSendSmsState] = useState<"idle" | "sending" | "sent">("idle");
  const [sendSmsError, setSendSmsError] = useState<string | null>(null);
  const [isLoadingLead, setIsLoadingLead] = useState(true);

  /* =====================================================
     STEP 2B.8 — AI REPLY REVIEW STATE
     -----------------------------------------------------
     PURPOSE:
     - Stores editable AI suggested reply.
     - Tracks manual approval send status.
     - Keeps AI reply send flow separate from normal follow-up SMS.
  ===================================================== */

  const [aiReplyText, setAiReplyText] = useState("");
  const [aiReplySendState, setAiReplySendState] = useState<"idle" | "sending" | "sent">("idle");
  const [aiReplyError, setAiReplyError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLead() {
      try {
        const nextLead = (await fetchLeadById(leadId)) as LeadWithAIReply;

        setLead(nextLead);
        setSmsPhone(nextLead.phone);
        setFollowUpMessage(getSuggestedFollowUpMessage("sms", buildFollowUpMessages(nextLead, 0)));

        // STEP 2B.8 — Load AI suggested reply into editable textbox.
        setAiReplyText(nextLead.suggestedReply ?? "");
      } finally {
        setIsLoadingLead(false);
      }
    }

    void loadLead();
  }, [leadId]);

  async function persistLead(nextLead: LeadWithAIReply) {
    setLead(nextLead);

    const savedLead = (await updateLead(nextLead)) as LeadWithAIReply;
    setLead(savedLead);

    return savedLead;
  }

  async function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedNote = noteBody.trim();

    if (!trimmedNote || !lead) {
      setNoteError("Enter a note before saving.");
      return;
    }

    await persistLead({
      ...lead,
      notes: [
        ...lead.notes,
        {
          id: crypto.randomUUID?.() ?? `note-${Date.now()}`,
          body: trimmedNote,
          timestamp: new Date().toISOString()
        }
      ]
    });

    setNoteBody("");
    setNoteError(null);
  }

  async function handleDeleteNote(noteId: string) {
    if (!lead) {
      return;
    }

    await persistLead({
      ...lead,
      notes: lead.notes.filter((note) => note.id !== noteId)
    });
  }

  async function handleAnalyzerChange<Key extends keyof LeadAnalyzer>(key: Key, value: LeadAnalyzer[Key]) {
    if (!lead) {
      return;
    }

    await persistLead({
      ...lead,
      analyzer: {
        ...lead.analyzer,
        [key]: value
      }
    });
  }

  if (isLoadingLead) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/leads" className="inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong">
          Back to leads
        </Link>
        <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6 text-sm leading-6 text-muted">
          Loading lead details...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/leads" className="inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong">
          Back to leads
        </Link>
        <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6 text-sm leading-6 text-muted">
          Lead not found.
        </div>
      </div>
    );
  }

  const analyzerMetrics = getAnalyzerMetrics(lead.analyzer);
  const activeDistressFlags = getActiveDistressFlags(lead.distressFlags);
  const followUpMessages = buildFollowUpMessages(lead, messageVersion);
  const sortedFollowUps = sortFollowUpsByDate(lead.followUps);

  async function handleCopyMessage(label: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessage(label);
      window.setTimeout(() => setCopiedMessage((current) => (current === label ? null : current)), 1500);
    } catch {
      setCopiedMessage(null);
    }
  }

  function handleFollowUpTypeChange(nextType: LeadFollowUp["type"]) {
    setFollowUpType(nextType);
    setFollowUpMessage(getSuggestedFollowUpMessage(nextType, followUpMessages));
  }

  function handleApplySuggestedMessage() {
    setFollowUpMessage(getSuggestedFollowUpMessage(followUpType, followUpMessages));
  }

  async function handleAddFollowUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!followUpDate || !lead) {
      setFollowUpError("Choose a date and time for the follow-up.");
      return;
    }

    if (!followUpMessage.trim()) {
      setFollowUpError("Add a message for the scheduled follow-up.");
      return;
    }

    await persistLead({
      ...lead,
      followUps: [
        ...lead.followUps,
        {
          id: crypto.randomUUID?.() ?? `follow-up-${Date.now()}`,
          date: new Date(followUpDate).toISOString(),
          type: followUpType,
          message: followUpMessage.trim(),
          status: "pending"
        }
      ]
    });

    setFollowUpDate("");
    setFollowUpMessage(getSuggestedFollowUpMessage(followUpType, followUpMessages));
    setFollowUpError(null);
  }

  async function handleUpdateFollowUpStatus(followUpId: string, status: LeadFollowUp["status"]) {
    if (!lead) {
      return;
    }

    await persistLead({
      ...lead,
      followUps: lead.followUps.map((followUp) =>
        followUp.id === followUpId
          ? {
              ...followUp,
              status,
              completedAt: status === "completed" ? new Date().toISOString() : undefined
            }
          : followUp
      )
    });
  }

  async function handleSendSms() {
    if (!lead) {
      return;
    }

    const currentLead = lead;
    const phoneToUse = (currentLead.phone.trim() || smsPhone.trim()).trim();

    if (!phoneToUse) {
      setSendSmsError("Add a phone number before sending an SMS.");
      return;
    }

    if (!followUpMessages.sms.trim()) {
      setSendSmsError("There is no SMS message to send.");
      return;
    }

    setSendSmsError(null);
    setSendSmsState("sending");

    try {
      const result = await sendSMS(phoneToUse, followUpMessages.sms);

      if (!result.ok) {
        throw new Error("SMS send failed.");
      }

      await persistLead({
        ...currentLead,
        phone: phoneToUse,
        followUps: [
          ...currentLead.followUps,
          {
            id: crypto.randomUUID?.() ?? `follow-up-${Date.now()}`,
            date: result.sentAt,
            type: "sms",
            message: followUpMessages.sms,
            status: "completed",
            completedAt: result.sentAt
          }
        ]
      });

      setSendSmsState("sent");

      window.setTimeout(() => {
        setSendSmsState((current) => (current === "sent" ? "idle" : current));
      }, 2000);
    } catch {
      setSendSmsState("idle");
      setSendSmsError("Unable to send the SMS right now.");
    }
  }

  /* =====================================================
     STEP 2B.8 — HUMAN-APPROVED AI REPLY SEND HANDLER
     -----------------------------------------------------
     PURPOSE:
     - Sends only after human clicks button.
     - Uses existing sendSMS helper.
     - Logs the AI-approved reply as completed follow-up.
     - Does NOT auto-send anything.
  ===================================================== */

  async function handleSendApprovedAIReply() {
    if (!lead) {
      return;
    }

    const currentLead = lead;
    const phoneToUse = (currentLead.phone.trim() || smsPhone.trim()).trim();
    const messageToSend = aiReplyText.trim();

    if (!phoneToUse) {
      setAiReplyError("Add a phone number before sending the AI reply.");
      return;
    }

    if (!messageToSend) {
      setAiReplyError("AI reply message is empty.");
      return;
    }

    if (currentLead.doNotContact) {
      setAiReplyError("This lead is marked Do Not Contact. Message was not sent.");
      return;
    }

    setAiReplyError(null);
    setAiReplySendState("sending");

    try {
      const result = await sendSMS(phoneToUse, messageToSend);

      if (!result.ok) {
        throw new Error("AI reply SMS send failed.");
      }

      await persistLead({
        ...currentLead,
        phone: phoneToUse,
        suggestedReply: messageToSend,
        requiresHumanApproval: false,
        followUps: [
          ...currentLead.followUps,
          {
            id: crypto.randomUUID?.() ?? `follow-up-${Date.now()}`,
            date: result.sentAt,
            type: "sms",
            message: messageToSend,
            status: "completed",
            completedAt: result.sentAt
          }
        ]
      });

      setAiReplySendState("sent");

      window.setTimeout(() => {
        setAiReplySendState((current) => (current === "sent" ? "idle" : current));
      }, 2000);
    } catch {
      setAiReplySendState("idle");
      setAiReplyError("Unable to send the AI-approved reply right now.");
    }
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link href="/dashboard/leads" className="inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong">
            Back to leads
          </Link>
          <h1 className="text-3xl font-semibold text-primary">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="text-sm leading-6 text-muted md:text-base">
            Lead details, notes, and follow-ups now persist through the database-backed lead system.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={lead.priority} />
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              lead.status === "contacted" ? "bg-[#dcefe3] text-[#2d6a4f]" : "bg-[#f6e8cc] text-[#9a6a1a]"
            }`}
          >
            {lead.status}
          </span>
        </div>
      </div>

      {/* =====================================================
          LEAD SCORE SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Lead Score</h2>
          <p className="text-sm leading-6 text-muted">Rule-based ranking from the current distress and opportunity signals.</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <DetailItem label="Lead Score" value={String(lead.score)} />
          <DetailItem label="Priority" value={lead.priority} />
          <DetailItem label="Opportunity Score" value={lead.opportunityScore} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <p className="text-sm font-semibold text-primary">Score Breakdown</p>
          <p className="mt-2 text-sm leading-6 text-[#40576b]">{lead.scoreBreakdown}</p>
        </div>
      </section>

      {/* =====================================================
          LEAD INFORMATION SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Name" value={`${lead.firstName} ${lead.lastName}`} />
          <DetailItem label="Phone" value={lead.phone} />
          <DetailItem label="Email" value={lead.email} />
          <DetailItem label="Property Address" value={lead.propertyAddress} />
          <DetailItem label="City / State / ZIP" value={`${lead.city}, ${lead.state} ${lead.zipCode}`} />
          <DetailItem label="Submitted" value={formatLeadTimestamp(lead.timestamp)} />
          <DetailItem label="Status" value={lead.status} />
          <DetailItem label="Source" value={lead.source} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <p className="text-sm font-semibold text-primary">Situation Details</p>
          <p className="mt-2 text-sm leading-6 text-[#40576b]">
            {lead.situationDetails.trim() ? lead.situationDetails : "No situation details provided."}
          </p>
        </div>
      </section>

      {/* =====================================================
          STEP 2B.8 — AI REPLY REVIEW & HUMAN APPROVAL PANEL
      ===================================================== */}

      {lead.lastSellerReply ? (
        <section className="rounded-[1.5rem] border border-[#d8e8f8] bg-[#f7fbff] p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-primary">AI Seller Reply Analysis</h2>
              <p className="text-sm leading-6 text-muted">
                The AI Reply Brain reviewed the seller response. Human approval is required before sending any reply.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
              Human Review
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Seller Reply</p>
            <p className="mt-2 text-sm leading-6 text-[#173447]">{lead.lastSellerReply}</p>
            {lead.lastSellerReplyAt ? (
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                Received {formatLeadTimestamp(lead.lastSellerReplyAt)}
              </p>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <DetailItem label="AI Intent" value={lead.lastSellerReplyIntent || "Unknown"} />
            <DetailItem
              label="Confidence"
              value={typeof lead.lastSellerReplyConfidence === "number" ? lead.lastSellerReplyConfidence.toFixed(2) : "Unknown"}
            />
            <DetailItem label="Approval Required" value={lead.requiresHumanApproval ? "YES" : "NO"} />
          </div>

          <div className="mt-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-primary">AI Suggested Reply / Editable Human Reply</span>
              <textarea
                value={aiReplyText}
                onChange={(event) => setAiReplyText(event.target.value)}
                rows={5}
                placeholder="No suggested reply yet. Type a safe human-approved reply here."
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSendApprovedAIReply}
                disabled={aiReplySendState === "sending" || Boolean(lead.doNotContact)}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] shadow-[0_10px_25px_rgba(216,154,66,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {aiReplySendState === "sending" ? "Sending..." : "Send Approved Reply"}
              </button>

              <button
                type="button"
                onClick={() => setAiReplyText(lead.suggestedReply ?? "")}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
              >
                Reset to AI Suggestion
              </button>
            </div>

            {lead.requiresHumanApproval ? (
              <p className="mt-3 text-sm font-medium text-[#9f3a22]">
                Human approval required. Review or edit the message before sending.
              </p>
            ) : null}

            {lead.doNotContact ? (
              <p className="mt-3 text-sm font-medium text-red-700">
                This lead is marked Do Not Contact. Sending is disabled.
              </p>
            ) : null}

            {aiReplyError ? <p className="mt-3 text-sm text-red-700">{aiReplyError}</p> : null}
            {aiReplySendState === "sent" ? <p className="mt-3 text-sm text-success">AI-approved reply sent ✅</p> : null}
          </div>
        </section>
      ) : null}

      {/* =====================================================
          DISTRESS SIGNALS SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Distress Signals</h2>
          <p className="text-sm leading-6 text-muted">Rules-based opportunity flags from source, seller notes, and mailing details.</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Opportunity Score" value={lead.opportunityScore} />
          <DetailItem label="Mailing Address" value={lead.mailingAddress || "Not provided"} />
          <DetailItem label="County" value={lead.county || "Not provided"} />
          <DetailItem label="Parcel ID" value={lead.parcelId || "Not provided"} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <p className="text-sm font-semibold text-primary">Detected Flags</p>
          {activeDistressFlags.length === 0 ? (
            <p className="mt-2 text-sm leading-6 text-[#40576b]">No distress signals detected yet.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeDistressFlags.map((flag) => (
                <FlagBadge key={flag.key} label={flag.label} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          DEAL ANALYZER SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Deal Analyzer</h2>
          <p className="text-sm leading-6 text-muted">Estimate a working offer range and quick deal quality for this lead.</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <AnalyzerField
            label="ARV (After Repair Value)"
            value={lead.analyzer.arv}
            onChange={(value) => handleAnalyzerChange("arv", value)}
            placeholder="250000"
          />
          <AnalyzerField
            label="Estimated Repairs"
            value={lead.analyzer.estimatedRepairs}
            onChange={(value) => handleAnalyzerChange("estimatedRepairs", value)}
            placeholder="35000"
          />
          <AnalyzerField
            label="Desired Profit"
            value={lead.analyzer.desiredProfit}
            onChange={(value) => handleAnalyzerChange("desiredProfit", value)}
            placeholder="20000"
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="MAO" value={formatCurrency(analyzerMetrics.mao)} />
          <DetailItem
            label="Suggested Offer Range"
            value={`${formatCurrency(analyzerMetrics.mao)} to ${formatCurrency(analyzerMetrics.lowOffer)}`}
          />
          <DetailItem label="Estimated Profit" value={formatCurrency(analyzerMetrics.estimatedProfit)} />
          <DetailItem label="Deal Rating" value={analyzerMetrics.dealRating} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <p className="text-sm font-semibold text-primary">Analyzer Snapshot</p>
          <p className="mt-2 text-sm leading-6 text-[#40576b]">
            Desired profit target: {formatCurrency(analyzerMetrics.desiredProfit)}. Offer range updates live as you type
            and is saved with this lead in local storage.
          </p>
        </div>
      </section>

      {/* =====================================================
          FOLLOW-UP ASSISTANT SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary">Follow-Up Assistant</h2>
            <p className="text-sm leading-6 text-muted">
              Template-based outreach drafts built from this lead’s details, motivation signals, and priority.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMessageVersion((current) => current + 1)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
          >
            Regenerate Message
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <MessageCard
            title="SMS Message"
            content={followUpMessages.sms}
            copied={copiedMessage === "SMS"}
            onCopy={() => handleCopyMessage("SMS", followUpMessages.sms)}
            actions={
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSendSms}
                  disabled={sendSmsState === "sending"}
                  className="inline-flex w-fit rounded-full bg-[#d89a42] px-3 py-2 text-xs font-semibold text-[#102437] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sendSmsState === "sending" ? "Sending..." : "Send SMS"}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyMessage("SMS", followUpMessages.sms)}
                  className="inline-flex w-fit rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
                >
                  {copiedMessage === "SMS" ? "Copied" : "Copy to Clipboard"}
                </button>
              </div>
            }
          />

          {!lead.phone.trim() ? (
            <label className="block rounded-2xl border border-border bg-white px-4 py-4 shadow-sm">
              <span className="mb-2 block text-sm font-medium text-primary">Phone number for SMS</span>
              <input
                type="tel"
                value={smsPhone}
                onChange={(event) => setSmsPhone(event.target.value)}
                placeholder="(405) 555-1234"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
              />
            </label>
          ) : null}

          {sendSmsError ? <p className="text-sm text-red-700">{sendSmsError}</p> : null}
          {sendSmsState === "sent" ? <p className="text-sm text-success">Message Sent ✅</p> : null}

          <MessageCard
            title="Email Message"
            content={`Subject: ${followUpMessages.emailSubject}\n\n${followUpMessages.emailBody}`}
            copied={copiedMessage === "Email"}
            onCopy={() =>
              handleCopyMessage("Email", `Subject: ${followUpMessages.emailSubject}\n\n${followUpMessages.emailBody}`)
            }
          />

          <MessageCard
            title="Call Script"
            content={followUpMessages.callScript}
            copied={copiedMessage === "Call Script"}
            onCopy={() => handleCopyMessage("Call Script", followUpMessages.callScript)}
          />
        </div>
      </section>

      {/* =====================================================
          FOLLOW-UP SCHEDULER SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Follow-Up Scheduler</h2>
          <p className="text-sm leading-6 text-muted">Schedule outreach, keep the draft message, and track what is still pending.</p>
        </div>

        <form onSubmit={handleAddFollowUp} className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-primary">Type</span>
              <select
                value={followUpType}
                onChange={(event) => handleFollowUpTypeChange(event.target.value as LeadFollowUp["type"])}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="call">Call</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-primary">Date & time</span>
              <input
                type="datetime-local"
                value={followUpDate}
                onChange={(event) => setFollowUpDate(event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-primary">Message</span>
            <textarea
              value={followUpMessage}
              onChange={(event) => setFollowUpMessage(event.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleApplySuggestedMessage}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
            >
              Use Suggested Message
            </button>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] shadow-[0_10px_25px_rgba(216,154,66,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e5a64f]"
            >
              Add Follow-Up
            </button>
          </div>

          {followUpError ? <p className="text-xs text-red-700">{followUpError}</p> : null}
        </form>

        <div className="mt-6 space-y-4">
          {sortedFollowUps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-5 text-sm leading-6 text-muted">
              No follow-ups scheduled yet.
            </div>
          ) : (
            sortedFollowUps.map((followUp) => {
              const isOverdue = isOverdueFollowUp(followUp);

              return (
                <article
                  key={followUp.id}
                  className={`rounded-2xl border bg-white px-4 py-4 shadow-sm ${
                    isOverdue ? "border-[#e8b7ae]" : "border-border"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{followUp.type}</span>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                            followUp.status === "completed"
                              ? "bg-[#dcefe3] text-[#2d6a4f]"
                              : isOverdue
                                ? "bg-[#f7ddd7] text-[#9f3a22]"
                                : "bg-[#f6e8cc] text-[#9a6a1a]"
                          }`}
                        >
                          {followUp.status === "completed" ? "Completed" : isOverdue ? "Overdue" : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-muted">{formatLeadTimestamp(followUp.date)}</p>
                      {followUp.completedAt ? (
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                          Completed {formatLeadTimestamp(followUp.completedAt)}
                        </p>
                      ) : null}
                      <pre className="whitespace-pre-wrap text-sm leading-6 text-[#173447] [font-family:inherit]">
                        {followUp.message}
                      </pre>
                    </div>
                    {followUp.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateFollowUpStatus(followUp.id, "completed")}
                        className="inline-flex w-fit rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
                      >
                        Mark Completed
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* =====================================================
          NOTES SECTION
      ===================================================== */}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Notes</h2>
          <p className="text-sm leading-6 text-muted">Add internal follow-up notes for this lead. Notes persist in local storage.</p>
        </div>

        <form onSubmit={handleAddNote} className="mt-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-primary">Add note</span>
            <textarea
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
              placeholder="Log a call outcome, follow-up reminder, or seller detail."
            />
          </label>
          {noteError ? <p className="mt-2 text-xs text-red-700">{noteError}</p> : null}
          <button
            type="submit"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] shadow-[0_10px_25px_rgba(216,154,66,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e5a64f]"
          >
            Save Note
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {lead.notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-5 text-sm leading-6 text-muted">
              No notes yet. Add the first internal note for this lead.
            </div>
          ) : (
            lead.notes.map((note) => (
              <article key={note.id} className="rounded-2xl border border-border bg-white px-4 py-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {formatLeadTimestamp(note.timestamp)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#173447]">{note.body}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="inline-flex w-fit rounded-full border border-[#ead7d7] bg-white px-3 py-2 text-xs font-semibold text-[#8a3d3d] transition hover:border-[#d9b0b0] hover:text-[#6d2f2f]"
                  >
                    Delete Note
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

/* =====================================================
   SMALL UI COMPONENTS
===================================================== */

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#173447]">{value}</p>
    </div>
  );
}

function AnalyzerField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-primary">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
      />
    </label>
  );
}

function FlagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#eef3f8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#355066]">
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: StoredLead["priority"] }) {
  const className =
    priority === "High"
      ? "bg-[#f7ddd7] text-[#9f3a22]"
      : priority === "Medium"
        ? "bg-[#f6e8cc] text-[#9a6a1a]"
        : "bg-[#e7eef5] text-[#355066]";
  const label = priority === "High" ? "High" : priority === "Medium" ? "Medium" : "Low";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>{label}</span>;
}

function MessageCard({
  title,
  content,
  copied,
  onCopy,
  actions
}: {
  title: string;
  content: string;
  copied: boolean;
  onCopy: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">{title}</p>
          <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#173447] [font-family:inherit]">{content}</pre>
        </div>
        {actions ?? (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex w-fit rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
          >
            {copied ? "Copied" : "Copy to Clipboard"}
          </button>
        )}
      </div>
    </article>
  );
}