// =====================================================
// STEP 2B.6C — OPT-OUT KEYWORD DETECTOR
// Detects seller messages that mean "do not contact"
// =====================================================

// Note: includes common typos like "dont"
const OPT_OUT_KEYWORDS = [
  "stop",
  "unsubscribe",
  "remove me",
  "do not contact",
  "dont contact",
  "don't contact",
  "wrong number",
  "not interested",
  "leave me alone",
  "no more texts",
  "quit",
  "cancel"
];

export function detectOptOut(message: string | null | undefined) {
  if (!message) {
    return {
      isOptOut: false,
      reason: null
    };
  }

  const normalizedMessage = message.toLowerCase().trim();

  const matchedKeyword = OPT_OUT_KEYWORDS.find((keyword) =>
    normalizedMessage.includes(keyword)
  );

  return {
    isOptOut: !!matchedKeyword,
    reason: matchedKeyword ?? null
  };
}