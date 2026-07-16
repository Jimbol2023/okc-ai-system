# Phase 3 Canonical Linux Promotion Runbook

## Purpose

This runbook promotes Phase 3 only from the canonical Linux workspace:

```bash
/home/sabiu/projects/okc-wholesale-ai-system-git
```

It must not copy the full repository. It compares and reproduces only the Phase 3 promotion gate files.

## Required Files

- `lib/phase3-professional-promotion-gate.ts`
- `tests/safety/phase3-professional-promotion-gate.test.ts`
- `docs/engineering/phase3-professional-promotion-gate.md`

## Integrity Check

From Ubuntu WSL:

```bash
git -C /home/sabiu/projects/okc-wholesale-ai-system-git status
git -C /mnt/c/projects/okc-wholesale-ai-system-git status
```

Then run the guarded promotion script:

```bash
cd /home/sabiu/projects/okc-wholesale-ai-system-git
bash /mnt/c/projects/okc-wholesale-ai-system-git/scripts/phase3-canonical-linux-promotion.sh
```

If the script reports `reviewed copy required`, inspect the three-file diff summary it prints. If the Windows changes are the intended source of truth and Linux has no newer edits to preserve, rerun:

```bash
PHASE3_COPY_REVIEWED=YES bash /mnt/c/projects/okc-wholesale-ai-system-git/scripts/phase3-canonical-linux-promotion.sh
```

If the script reports `manual_merge_required`, merge the named file manually. Do not overwrite it.

## Verification Commands

The script runs:

```bash
pwd
git status --short --branch
git diff --check
npx tsc --noEmit
npm run lint
npm run test:safety
npm run build
npx tsx --test tests/safety/phase3-professional-promotion-gate.test.ts
```

## Evidence Packet

The script writes:

```bash
docs/engineering/phase3-promotion-evidence-packet.md
```

The packet records canonical path, status before and after, three-file diff summary, command results, focused test result, Phase 4 blocked confirmation, remaining risks, and a pending human go/no-go decision.

## Failure Handling

If verification fails, classify the failure before remediation:

- test defect,
- product defect,
- environment/dependency defect,
- Linux/Windows parity defect.

Do not weaken safety assertions, skip tests, hide files, or promote Phase 4 from a partial result.
