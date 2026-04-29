"use client";

/* =====================================================
   LEAD DETAIL CLIENT — SAFE PRO VERSION
   -----------------------------------------------------
   FIXES:
   - Correctly reads API response: { ok: true, lead }
   - Restores LeadDetailClient named export
   - Shows AI Reply Panel when lastSellerReply exists
   - Keeps human approval before sending
   - Keeps DNC protection
   - Uses existing /api/send-sms route safely
===================================================== */

import Link from "next/link";
import { useEffect, useState } from "react";

/* =============================
   TYPES
============================= */

type Lead = {
  id: string;
  name?: string | null;
  phone?: string | null;
  propertyAddress?: string | null;

  lastSellerReply?: string | null;
  lastSellerReplyAt?: string | null;
  lastSellerReplyIntent?: string | null;
  lastSellerReplyConfidence?: number | null;

  requiresHumanApproval?: boolean | null;
  suggestedReply?: string | null;

  doNotContact?: boolean | null;
};

type LeadApiResponse = {
  ok: boolean;
  lead?: Lead;
  error?: string;
};

/* =============================
   COMPONENT
============================= */

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [aiReplyText, setAiReplyText] = useState("");
  const [aiReplySendState, setAiReplySendState] =
    useState<"idle" | "sending" | "sent">("idle");
  const [aiReplyError, setAiReplyError] = useState<string | null>(null);

  /* =============================
     FETCH LEAD
  ============================= */

  useEffect(() => {
    async function loadLead() {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch(`/api/leads/${leadId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as LeadApiResponse;

        if (!res.ok || !data.ok || !data.lead) {
          setLead(null);
          setLoadError(data.error || "Unable to load lead.");
          return;
        }

        setLead(data.lead);
        setAiReplyText(data.lead.suggestedReply ?? "");
      } catch (error) {
        console.error("Failed to load lead:", error);
        setLead(null);
        setLoadError("Failed to load lead.");
      } finally {
        setLoading(false);
      }
    }

    void loadLead();
  }, [leadId]);

  /* =============================
     SEND APPROVED REPLY
  ============================= */

  async function handleSendApprovedAIReply() {
    if (!lead) return;

    if (lead.doNotContact) {
      setAiReplyError("This lead is marked Do Not Contact. Message was not sent.");
      return;
    }

    if (!lead.phone) {
      setAiReplyError("Lead phone number is missing.");
      return;
    }

    if (!aiReplyText.trim()) {
      setAiReplyError("Reply message is empty.");
      return;
    }

    try {
      setAiReplySendState("sending");
      setAiReplyError(null);

      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumbers: [lead.phone],
          message: aiReplyText.trim(),
          dealId: lead.id,
        }),
      });

      if (!res.ok) {
        throw new Error("SMS send failed.");
      }

      setAiReplySendState("sent");
    } catch (error) {
      console.error("Failed to send approved AI reply:", error);
      setAiReplyError("Failed to send reply.");
      setAiReplySendState("idle");
    }
  }

  /* =============================
     HELPERS
  ============================= */

  function formatDate(date?: string | null) {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleString();
  }

  /* =============================
     LOADING STATE
  ============================= */

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex text-sm font-semibold text-primary"
        >
          ← Back to leads
        </Link>

        <div className="rounded-xl border bg-white p-6 text-sm text-muted">
          Loading lead details...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6 p-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex text-sm font-semibold text-primary"
        >
          ← Back to leads
        </Link>

        <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
          {loadError || "Lead not found."}
        </div>
      </div>
    );
  }

  /* =============================
     MAIN UI
  ============================= */

  return (
    <div className="space-y-6 p-6">
      {/* ============================================
          BACK LINK
      ============================================ */}

      <Link
        href="/dashboard/leads"
        className="inline-flex text-sm font-semibold text-primary"
      >
        ← Back to leads
      </Link>

      {/* ============================================
          BASIC LEAD INFO
      ============================================ */}

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-lg font-bold">Lead Info</h2>

        <p>
          <strong>Name:</strong> {lead.name || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {lead.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {lead.propertyAddress || "N/A"}
        </p>
      </section>

      {/* ============================================
          STEP 2B.8 — AI REPLY REVIEW PANEL
      ============================================ */}

      {lead.lastSellerReply ? (
        <section className="rounded-xl border-2 border-blue-300 bg-[#f7fbff] p-5">
          <h2 className="mb-2 text-xl font-bold text-blue-950">
            AI Seller Reply Analysis
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Human approval required before sending any reply.
          </p>

          {/* Seller Message */}
          <div className="mb-4 rounded border bg-white p-3">
            <p className="mb-1 text-xs text-gray-500">Seller Reply</p>
            <p>{lead.lastSellerReply}</p>
            <p className="mt-2 text-xs text-gray-400">
              {formatDate(lead.lastSellerReplyAt)}
            </p>
          </div>

          {/* AI Insights */}
          <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded border bg-white p-3">
              <strong>Intent:</strong>{" "}
              {lead.lastSellerReplyIntent || "Unknown"}
            </div>

            <div className="rounded border bg-white p-3">
              <strong>Confidence:</strong>{" "}
              {typeof lead.lastSellerReplyConfidence === "number"
                ? `${(lead.lastSellerReplyConfidence * 100).toFixed(0)}%`
                : "Unknown"}
            </div>

            <div className="rounded border bg-white p-3">
              <strong>Approval:</strong>{" "}
              {lead.requiresHumanApproval ? "YES" : "NO"}
            </div>
          </div>

          {/* Editable Reply */}
          <textarea
            value={aiReplyText}
            onChange={(event) => setAiReplyText(event.target.value)}
            rows={5}
            className="mb-3 w-full rounded border p-3"
            placeholder="Edit or approve AI reply..."
          />

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSendApprovedAIReply}
              disabled={aiReplySendState === "sending" || !!lead.doNotContact}
              className="rounded bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
            >
              {aiReplySendState === "sending"
                ? "Sending..."
                : "Send Approved Reply"}
            </button>

            <button
              type="button"
              onClick={() => setAiReplyText(lead.suggestedReply || "")}
              className="rounded border px-4 py-2"
            >
              Reset
            </button>
          </div>

          {/* Status Messages */}
          {lead.doNotContact ? (
            <p className="mt-2 text-red-600">
              Do Not Contact — sending disabled
            </p>
          ) : null}

          {aiReplyError ? (
            <p className="mt-2 text-red-600">{aiReplyError}</p>
          ) : null}

          {aiReplySendState === "sent" ? (
            <p className="mt-2 text-green-600">
              Reply sent successfully.
            </p>
          ) : null}
        </section>
      ) : (
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-2 text-lg font-bold">AI Seller Reply Analysis</h2>
          <p className="text-sm text-gray-600">
            No seller reply has been captured for this lead yet.
          </p>
        </section>
      )}
    </div>
  );
}