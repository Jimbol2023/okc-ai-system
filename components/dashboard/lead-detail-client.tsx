"use client";

/* =====================================================
   LEAD DETAIL CLIENT — SAFE PRO VERSION
   - Fixes missing export issue
   - Fixes JSX type errors
   - Keeps AI Reply + Human Approval system
   - Keeps DNC protection
   - Clean + production safe
===================================================== */

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

/* =============================
   COMPONENT
============================= */

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch(`/api/leads/${leadId}`);
        const data = await res.json();

        setLead(data);

        if (data?.suggestedReply) {
          setAiReplyText(data.suggestedReply);
        }
      } catch (err) {
        console.error("Failed to load lead:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [leadId]);

  /* =============================
     SEND APPROVED REPLY
  ============================= */

  async function handleSendApprovedAIReply() {
    if (!lead) return;

    if (lead.doNotContact) {
      setAiReplyError(
        "This lead is marked Do Not Contact. Message was not sent."
      );
      return;
    }

    try {
      setAiReplySendState("sending");
      setAiReplyError(null);

      await fetch("/api/send-sms", {
        method: "POST",
        body: JSON.stringify({
          phoneNumbers: [lead.phone],
          message: aiReplyText,
          leadId: lead.id,
        }),
      });

      setAiReplySendState("sent");
    } catch (err) {
      setAiReplyError("Failed to send reply");
      setAiReplySendState("idle");
    }
  }

  /* =============================
     HELPERS
  ============================= */

  function formatDate(date?: string | null) {
    if (!date) return "Unknown";
    return new Date(date).toLocaleString();
  }

  /* =============================
     LOADING STATE
  ============================= */

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted">
        Loading lead details...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-sm text-red-600">
        Lead not found
      </div>
    );
  }

  /* =============================
     MAIN UI
  ============================= */

  return (
    <div className="space-y-6 p-6">
      {/* ============================================
          BASIC LEAD INFO
      ============================================ */}

      <section className="border rounded-xl p-4 bg-white">
        <h2 className="text-lg font-bold mb-2">Lead Info</h2>

        <p><strong>Name:</strong> {lead.name || "N/A"}</p>
        <p><strong>Phone:</strong> {lead.phone || "N/A"}</p>
        <p><strong>Address:</strong> {lead.propertyAddress || "N/A"}</p>
      </section>

      {/* ============================================
          STEP 2B.8 — AI REPLY REVIEW PANEL
      ============================================ */}

      {lead.lastSellerReply ? (
        <section className="border rounded-xl p-5 bg-[#f7fbff]">
          <h2 className="text-xl font-bold mb-2">
            AI Seller Reply Analysis
          </h2>

          <p className="text-sm mb-4">
            Human approval required before sending any reply.
          </p>

          {/* Seller Message */}
          <div className="border p-3 rounded mb-4 bg-white">
            <p className="text-xs text-gray-500 mb-1">Seller Reply</p>
            <p>{lead.lastSellerReply}</p>
            <p className="text-xs mt-2 text-gray-400">
              {formatDate(lead.lastSellerReplyAt)}
            </p>
          </div>

          {/* AI Insights */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            <div>
              <strong>Intent:</strong>{" "}
              {lead.lastSellerReplyIntent || "Unknown"}
            </div>

            <div>
              <strong>Confidence:</strong>{" "}
              {typeof lead.lastSellerReplyConfidence === "number"
                ? lead.lastSellerReplyConfidence.toFixed(2)
                : "Unknown"}
            </div>

            <div>
              <strong>Approval:</strong>{" "}
              {lead.requiresHumanApproval ? "YES" : "NO"}
            </div>
          </div>

          {/* Editable Reply */}
          <textarea
            value={aiReplyText}
            onChange={(e) => setAiReplyText(e.target.value)}
            rows={5}
            className="w-full border rounded p-3 mb-3"
            placeholder="Edit or approve AI reply..."
          />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSendApprovedAIReply}
              disabled={
                aiReplySendState === "sending" || !!lead.doNotContact
              }
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {aiReplySendState === "sending"
                ? "Sending..."
                : "Send Approved Reply"}
            </button>

            <button
              onClick={() =>
                setAiReplyText(lead.suggestedReply || "")
              }
              className="border px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>

          {/* Status Messages */}
          {lead.doNotContact && (
            <p className="text-red-600 mt-2">
              Do Not Contact — sending disabled
            </p>
          )}

          {aiReplyError && (
            <p className="text-red-600 mt-2">{aiReplyError}</p>
          )}

          {aiReplySendState === "sent" && (
            <p className="text-green-600 mt-2">
              Reply sent successfully
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}