# Phase 3 Professional Promotion Gate

## Status

Phase 2.5 is `hardening_complete_with_legacy_remediation_open`.

Phase 3 remains `calibration_ready` until the discovered legacy suite, calibration cohort, blind-validation cohort, and human go/no-go gate pass.

Phase 4 remains blocked. Passing evidence does not authorize publishing, provider writes, outreach, CRM mutation, workflow execution, or approval-as-execution.

## Canonical Workspace

Final verification must run from:

```bash
/home/sabiu/projects/okc-wholesale-ai-system-git
```

The old mounted-drive path `/mnt/c/projects/okc-wholesale-ai-system-git` is not canonical for promotion work.

## Professional Operating Roles

- Case lead: `marketing-intelligence-director`.
- Contributors: `senior-seo-director`, `senior-analytics-specialist`, `local-visibility-specialist`, and `content-intelligence-strategist`.
- Independent QA: `marketing-quality-reviewer`.
- Final authority: named human go/no-go owner.

Every professional output must include evidence references, unsupported-claim checks, assumptions, missing data, a no-action fallback, recommendation outcome, provider contribution, and explicit no-execution flags.

## Legacy Remediation Matrix

| Legacy failure | Cause | Correct action |
| --- | --- | --- |
| False authorization match | Defective regex | Fix semantic test assertion |
| Old contract wording | Stale assertion | Update the test contract |
| Actual compatibility regression | Product defect | Fix implementation |
| Nonterminating historical batch | Runner/process defect | Keep timeout and repair the test or process |

Safe negative language such as "No publishing is authorized" must never be interpreted as granting publishing authority.

## Promotion Evidence

Calibration requires 10 supervised cases. Blind validation requires 20 cases after scoring, QA rubric, materiality policy, and expected-output rules are frozen.

Each case records preparation time, human review time, QA defects, unsupported claims caught, CEO usefulness rating, evidence gaps, recommendation outcome, provider contribution if any, and no-action fallback quality.

Promotion still requires a green discovered suite, no hidden exclusions, no skipped tests, zero invented metrics, every seeded critical defect detected, at least 25% median review-time improvement, at least 80% useful-or-better CEO ratings, no harmful-error increase, independent QA, and human go/no-go approval.

## Verification

Run final verification from the canonical Linux workspace only:

```bash
npx prisma validate
npx tsc --noEmit
npm run lint
npm run test:unit:all
npm run test:safety
npm run build:storybook
npm run build
npm run test:pressure:professional-cases:isolated
npm run test:e2e
```

Security testing is local/staging only unless a separate written scope authorizes external targets.
