type DecisionRecord = Record<string, unknown>;
type FlagRecord = Record<string, boolean>;

export function assertAllExecutionDecisionsNotAuthorized(result: DecisionRecord, label: string) {
  const unsafeDecisions = Object.entries(result).filter(
    ([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized",
  );

  if (unsafeDecisions.length > 0) {
    throw new Error(`${label} decisions must remain not_authorized.`);
  }
}

export function assertOnlyAllowedTrueFlags(flags: FlagRecord, allowedTrueFlags: string[], label: string) {
  const allowedTrue = new Set(allowedTrueFlags);
  const unsafeTrue = Object.entries(flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);

  if (unsafeTrue.length > 0) {
    throw new Error(`${label} blocked flags cannot turn true.`);
  }
}

export function assertNoUnsafeRoadmapAuthorizationWording(text: string, label: string) {
  const sentences = text
    .split(/[.!?\n]/)
    .map((sentence) => sentence.trim().toLowerCase())
    .filter(Boolean);

  const unsafePatterns = [
    /\bgo[- ]?live\b.*\b(authorized|approved|allowed|enabled|ready)\b/,
    /\bgo live\b/,
    /\bprovider(s)?\b.*\b(activation|activated|activate|enabled|approved|allowed|authorized)\b/,
    /\bmay activate\b.*\bprovider(s)?\b/,
    /\bcredential(s)?\b.*\b(read|reads|access|approved|allowed|authorized|enabled)\b/,
    /\bread credentials\b/,
    /\benv\b.*\b(read|reads|access|approved|allowed|authorized|enabled)\b/,
    /\bscan(s|ning)?\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\brun scans\b/,
    /\bexploit execution\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bnetwork calls?\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bauth\/security mutation\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bmutate\b.*\b(auth|security|crm|storage|schema|api|route|lead)\b/,
    /\broute\/api\/ui\/schema\/storage changes\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bcrm mutation\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\blead mutation\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\baudit writing\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bremediation execution\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bexecute remediation\b/,
    /\boutreach\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bruntime jobs?\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bcampaign(s)?\b.*\b(activation|launch|launched|enabled|approved|allowed|authorized)\b/,
    /\blaunch campaigns\b/,
    /\bspend increases?\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bai (legal|security) approval\b.*\b(authorized|approved|allowed|enabled)\b/,
    /\bfurther roadmap implementation\b.*\b(authorized|approved|allowed|enabled)\b/,
  ];

  const safeNegationPattern = /\b(no|not|cannot|can't|do not|does not|may not|must not|without|blocked|forbidden)\b/;
  const unsafeSentence = sentences.find((sentence) => {
    const hasPositiveAuthorization = /\b(authorized|approved|allowed|enabled|ready|launch|launched|activate|activated)\b/.test(sentence);

    if (/\bmay not\b/.test(sentence) || /\bdo not\b/.test(sentence) || /\bcannot\b/.test(sentence) || /\bmust not\b/.test(sentence)) {
      return false;
    }

    if (safeNegationPattern.test(sentence) && !hasPositiveAuthorization) {
      return false;
    }

    if (safeNegationPattern.test(sentence) && /\b(is|are|remain|remains)\s+(not\s+)?authorized\b/.test(sentence)) {
      return false;
    }

    return unsafePatterns.some((pattern) => pattern.test(sentence));
  });

  if (unsafeSentence) {
    throw new Error(`${label} wording must not imply unsafe authorization.`);
  }
}
