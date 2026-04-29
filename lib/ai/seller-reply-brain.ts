// lib/ai/seller-reply-brain.ts

/**
 * Seller Reply Brain
 * Step 2B.7
 *
 * Purpose:
 * - Read incoming seller SMS replies
 * - Classify seller intent safely
 * - Suggest the next safe human-reviewed action
 *
 * IMPORTANT:
 * This file does NOT send messages.
 * Auto-replies must wait until Human Approval Agent is added.
 */

export type SellerReplyIntent =
  | "interested"
  | "not_interested"
  | "question"
  | "angry"
  | "wrong_number"
  | "stop"
  | "needs_human";

export type SellerReplyClassification = {
  intent: SellerReplyIntent;
  confidence: number;
  reason: string;
  suggestedReply: string | null;
  requiresHumanApproval: boolean;
};

/**
 * Normalize incoming seller text for safer classification.
 */
function normalizeReply(message: string): string {
  return message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s?!.]/g, "");
}

/**
 * Detect seller intent using safe rule-based logic.
 * Later, this can be upgraded with OpenAI after Human Approval Agent is active.
 */
export function classifySellerReply(message: string): SellerReplyClassification {
  const text = normalizeReply(message);

  // STOP / opt-out language
  const stopWords = [
    "stop",
    "unsubscribe",
    "remove me",
    "do not text",
    "dont text",
    "do not contact",
    "leave me alone",
  ];

  if (stopWords.some((word) => text.includes(word))) {
    return {
      intent: "stop",
      confidence: 0.99,
      reason: "Seller used opt-out language.",
      suggestedReply: null,
      requiresHumanApproval: false,
    };
  }

  // Wrong number
  const wrongNumberWords = [
    "wrong number",
    "wrong person",
    "not me",
    "i dont own",
    "i do not own",
    "not my house",
    "not my property",
  ];

  if (wrongNumberWords.some((word) => text.includes(word))) {
    return {
      intent: "wrong_number",
      confidence: 0.95,
      reason: "Seller indicated this may be the wrong person or wrong property.",
      suggestedReply:
        "Sorry about that. We’ll update our records and won’t contact you about this property again.",
      requiresHumanApproval: true,
    };
  }

  // Angry / hostile
  const angryWords = [
    "scam",
    "lawsuit",
    "sue",
    "harass",
    "harassing",
    "reported",
    "police",
    "attorney",
    "lawyer",
    "fraud",
  ];

  if (angryWords.some((word) => text.includes(word))) {
    return {
      intent: "angry",
      confidence: 0.9,
      reason: "Seller used hostile, legal, or complaint-related language.",
      suggestedReply:
        "I apologize. We’ll stop contacting you and update our records.",
      requiresHumanApproval: true,
    };
  }

  // Interested
  const interestedWords = [
    "yes",
    "interested",
    "call me",
    "how much",
    "offer",
    "cash offer",
    "tell me more",
    "what can you pay",
    "i might sell",
    "maybe",
    "depends",
  ];

  if (interestedWords.some((word) => text.includes(word))) {
    return {
      intent: "interested",
      confidence: 0.85,
      reason: "Seller showed possible interest or asked about an offer.",
      suggestedReply:
        "Thanks. I can help with that. What price range would make sense for you, and is the property currently occupied or vacant?",
      requiresHumanApproval: true,
    };
  }

  // Not interested
  const notInterestedWords = [
    "not interested",
    "no thanks",
    "no thank you",
    "not selling",
    "dont want to sell",
    "do not want to sell",
    "never selling",
  ];

  if (notInterestedWords.some((word) => text.includes(word))) {
    return {
      intent: "not_interested",
      confidence: 0.9,
      reason: "Seller clearly said they are not interested.",
      suggestedReply:
        "No problem. Thank you for letting me know. I’ll update my notes.",
      requiresHumanApproval: true,
    };
  }

  // Question
  if (
    text.includes("?") ||
    text.startsWith("who") ||
    text.startsWith("what") ||
    text.startsWith("where") ||
    text.startsWith("why") ||
    text.startsWith("how")
  ) {
    return {
      intent: "question",
      confidence: 0.8,
      reason: "Seller asked a question.",
      suggestedReply:
        "Great question. I’m a local buyer looking at properties in the area. Are you open to a simple cash offer?",
      requiresHumanApproval: true,
    };
  }

  // Default fallback
  return {
    intent: "needs_human",
    confidence: 0.5,
    reason: "Reply was unclear and needs manual review.",
    suggestedReply: null,
    requiresHumanApproval: true,
  };
}