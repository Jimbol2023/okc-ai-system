#!/usr/bin/env bash
set -euo pipefail

linux_repo="${PHASE3_LINUX_REPO:-/home/sabiu/projects/okc-wholesale-ai-system-git}"
windows_repo="${PHASE3_WINDOWS_REPO:-/mnt/c/projects/okc-wholesale-ai-system-git}"
review_token="${PHASE3_COPY_REVIEWED:-}"
packet_path="${PHASE3_EVIDENCE_PACKET:-docs/engineering/phase3-promotion-evidence-packet.md}"
preflight_summary_path="${PHASE3_PREFLIGHT_SUMMARY:-docs/engineering/phase3-three-file-diff-summary.txt}"

files=(
  "lib/phase3-professional-promotion-gate.ts"
  "tests/safety/phase3-professional-promotion-gate.test.ts"
  "docs/engineering/phase3-professional-promotion-gate.md"
)

commands=(
  "pwd"
  "git status --short --branch"
  "git diff --check"
  "npx tsc --noEmit"
  "npm run lint"
  "npm run test:safety"
  "npm run build"
  "npx tsx --test tests/safety/phase3-professional-promotion-gate.test.ts"
)

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "environment_dependency_defect: this script must run from Linux/WSL" >&2
  exit 1
fi

if [[ ! -d "$linux_repo/.git" ]]; then
  echo "environment_dependency_defect: Linux repo not found at $linux_repo" >&2
  exit 1
fi

if [[ ! -d "$windows_repo/.git" ]]; then
  echo "environment_dependency_defect: Windows repo not found at $windows_repo" >&2
  exit 1
fi

cd "$linux_repo"
mkdir -p "$(dirname "$packet_path")"
mkdir -p "$(dirname "$preflight_summary_path")"

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

status_before="$tmp_dir/status-before.txt"
status_after="$tmp_dir/status-after.txt"
diff_summary="$tmp_dir/three-file-diff-summary.txt"
command_log="$tmp_dir/verification-commands.txt"

{
  echo "## Linux Repo"
  git -C "$linux_repo" status --short --branch
  echo
  echo "## Windows Repo"
  git -C "$windows_repo" status --short --branch
} >"$status_before"

: >"$diff_summary"
copy_required=false
copy_blocked=false

for file in "${files[@]}"; do
  linux_file="$linux_repo/$file"
  windows_file="$windows_repo/$file"

  if [[ ! -f "$windows_file" ]]; then
    echo "missing_windows_file:$file" | tee -a "$diff_summary" >&2
    copy_blocked=true
    continue
  fi

  if [[ ! -f "$linux_file" ]]; then
    echo "linux_missing:$file" | tee -a "$diff_summary"
    copy_required=true
    continue
  fi

  if cmp -s "$windows_file" "$linux_file"; then
    echo "identical:$file" >>"$diff_summary"
    continue
  fi

  echo "differs:$file" >>"$diff_summary"
  git diff --no-index -- "$linux_file" "$windows_file" >>"$diff_summary" || true
  linux_status="$(git -C "$linux_repo" status --short -- "$file")"
  if [[ -n "$linux_status" ]]; then
    echo "manual_merge_required:$file:$linux_status" | tee -a "$diff_summary" >&2
    copy_blocked=true
  else
    copy_required=true
  fi
done

if [[ "$copy_blocked" == "true" ]]; then
  cp "$diff_summary" "$preflight_summary_path"
  echo "linux_windows_parity_defect: manual merge required before promotion" >&2
  echo "Review persisted diff summary at $linux_repo/$preflight_summary_path" >&2
  exit 1
fi

if [[ "$copy_required" == "true" ]]; then
  cp "$diff_summary" "$preflight_summary_path"
  if [[ "$review_token" != "YES" ]]; then
    echo "linux_windows_parity_defect: reviewed copy required" >&2
    echo "Review persisted diff summary at $linux_repo/$preflight_summary_path, then rerun with PHASE3_COPY_REVIEWED=YES if the Windows three-file changes should be reproduced." >&2
    exit 1
  fi

  for file in "${files[@]}"; do
    mkdir -p "$(dirname "$linux_repo/$file")"
    cp "$windows_repo/$file" "$linux_repo/$file"
  done
fi

cp "$diff_summary" "$preflight_summary_path"

: >"$command_log"
overall_status="pass"
for command in "${commands[@]}"; do
  {
    echo
    echo "### $command"
  } >>"$command_log"
  if bash -lc "$command" >>"$command_log" 2>&1; then
    echo "PASS: $command" >>"$command_log"
  else
    echo "FAIL: $command" >>"$command_log"
    overall_status="fail"
    break
  fi
done

git -C "$linux_repo" status --short --branch >"$status_after"

phase4_blocked="unknown"
if grep -q 'phase4Status = "blocked_until_phase3_promotion"' "$linux_repo/lib/phase3-professional-promotion-gate.ts"; then
  phase4_blocked="confirmed"
fi

{
  echo "# Phase 3 Promotion Evidence Packet"
  echo
  echo "- Canonical path: \`$linux_repo\`"
  echo "- Windows comparison path: \`$windows_repo\`"
  echo "- Generated at: \`$(date -u +"%Y-%m-%dT%H:%M:%SZ")\`"
  echo "- Overall verification status: \`$overall_status\`"
  echo "- Phase 4 blocked status: \`$phase4_blocked\`"
  echo "- Human go/no-go decision: \`pending\`"
  echo "- Three-file preflight summary: \`$preflight_summary_path\`"
  echo
  echo "## Git Status Before"
  echo
  echo '```text'
  cat "$status_before"
  echo '```'
  echo
  echo "## Three-File Diff Summary"
  echo
  echo '```text'
  cat "$diff_summary"
  echo '```'
  echo
  echo "## Verification Commands"
  echo
  echo '```text'
  cat "$command_log"
  echo '```'
  echo
  echo "## Git Status After"
  echo
  echo '```text'
  cat "$status_after"
  echo '```'
  echo
  echo "## Failure Classification"
  echo
  if [[ "$overall_status" == "pass" ]]; then
    echo "- None recorded by this script."
  else
    echo "- Classify before remediation: test defect, product defect, environment/dependency defect, or Linux/Windows parity defect."
  fi
  echo
  echo "## Remaining Risks"
  echo
  echo "- Phase 3 is not promoted until a human go/no-go owner reviews this packet."
  echo "- Passing Phase 3 does not authorize provider writes, publishing, outreach, CRM mutation, workflow execution, or Phase 4."
} >"$packet_path"

echo "phase3_evidence_packet_written:$linux_repo/$packet_path"

if [[ "$overall_status" != "pass" ]]; then
  exit 1
fi
