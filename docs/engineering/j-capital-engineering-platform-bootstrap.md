# J Capital Engineering Platform Bootstrap

## Purpose

This runbook restores the approved delivery chain without changing business architecture:

`Codex -> clean WSL worktree -> Git commit -> GitHub push -> Draft PR -> CI -> isolated Neon branch -> Vercel Preview -> certification -> CEO approval -> Production promotion`

Ubuntu WSL2 is the canonical engineering shell. Native Linux tools must take precedence over Windows shims. Never record tokens, connection strings, client secrets, database passwords, or customer data in this document, terminal transcripts, commits, PRs, or screenshots.

## Authority boundaries

- A Draft PR does not authorize merge, deployment promotion, migration, or provider execution.
- Neon certification must use a named, expiring, zero-customer-data branch that is not the primary branch.
- Vercel database variables must be scoped to the exact Preview Git branch.
- Google Cloud verification is read-only. Do not enable APIs or change IAM from this runbook.
- Production promotion requires the exact CEO approval recorded in the certification packet.
- External writes, publishing, outreach, CRM mutation, scraping, and provider execution remain separately governed.

## 1. WSL baseline

Open Ubuntu WSL2 and verify:

```bash
uname -a
printf '%s\n' "$WSL_DISTRO_NAME"
printf '%s\n' "$PATH" | tr ':' '\n'
```

Expected distribution: `Ubuntu-19A`. `$HOME/.local/bin` must precede Windows paths. The standard login profile already adds it when the directory exists. Start a new login shell after installing tools:

```bash
exec bash -l
```

## 2. GitHub CLI and Git authentication

Install the official Linux `gh` release under `$HOME/.local`, verify its published checksum, and place its binary at `$HOME/.local/bin/gh`. Do not use a `gh.exe` wrapper.

Authenticate and configure Git HTTPS credentials:

```bash
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
gh auth status
stat -c '%a %U:%G %n' "$HOME/.config/gh/hosts.yml"
```

The credential file must be mode `600`. Health checks:

```bash
gh repo view Jimbol2023/okc-ai-system --json nameWithOwner,defaultBranchRef,viewerPermission
git fetch --prune origin
git status -sb
git rev-parse HEAD
git ls-remote --heads origin "refs/heads/$(git branch --show-current)"
```

Publish without rewriting history:

```bash
git push --set-upstream origin "$(git branch --show-current)"
gh pr create --draft --base main --head "$(git branch --show-current)"
gh pr checks --watch
```

### SSH alternative

Use SSH only when an approved GitHub key has been created and registered:

```bash
ssh-keygen -t ed25519 -C "hello@jcapitalpropertygroup.com"
gh ssh-key add "$HOME/.ssh/id_ed25519.pub" --title "J Capital WSL workstation"
ssh -T git@github.com
```

Never copy a private key into the repository or Windows shared folders.

## 3. Neon CLI

Install natively:

```bash
npm install --global --prefix "$HOME/.local" neonctl@latest
neonctl --version
neonctl auth
```

Read-only health checks:

```bash
neonctl projects list --org-id "$NEON_ORG_ID" --output json
neonctl branches list --project-id "$NEON_PROJECT_ID" --output json
```

Before certification, prove the target branch is non-primary, expiring, and contains zero customer rows. Retrieve connection strings directly into an approved secret store or branch-scoped Vercel input; never print them. Deleting an expiring test branch requires explicit approval and an exact branch ID.

## 4. Vercel Preview operator path

Install the pinned Linux CLI and authenticate:

```bash
npm install --global --prefix "$HOME/.local" vercel@58.4.4
vercel whoami
vercel link --yes --project okc-wholesale-ai-system --scope tmm-1
vercel project inspect okc-wholesale-ai-system --scope tmm-1
vercel env ls preview --scope tmm-1
vercel ls okc-wholesale-ai-system --scope tmm-1
```

Use `vercel env add ... preview --git-branch=<exact-branch>` for certification secrets. Verify deployment identity with `vercel inspect <preview-url>`. Use `vercel logs <preview-url>` for diagnostics. Never use `--prod`, `promote`, `rollback`, or production environment commands without the separately approved Production gate.

`vercel link` may create `.env.local`. Confirm it is ignored, mode-restricted where supported, and never commit it.

## 5. Docker Desktop WSL integration

In Docker Desktop, enable WSL integration for `Ubuntu-19A`, then restart Docker Desktop and the WSL distribution. Do not delete images, volumes, contexts, or containers.

Health checks:

```bash
docker version
docker context ls
docker run --rm hello-world
docker run --rm postgres:17-alpine postgres --version
```

`/mnt/wsl/docker-desktop` and the Docker socket must be present. A Windows/Linux socket mismatch is a failed certification.

## 6. Playwright Linux execution

Install the project-pinned browser:

```bash
npm ci
TMPDIR=/tmp TEMP=/tmp TMP=/tmp ./node_modules/.bin/playwright install chromium
npx playwright install-deps chromium
npm run test:e2e:linux -- --list
```

`install-deps` requires approved administrator access because Chromium depends on Linux system libraries. If it reports a missing library such as `libnspr4.so`, the browser is downloaded but not yet launch-certified.

Run a bounded smoke test through the wrapper:

```bash
npm run test:e2e:linux -- tests/e2e/smoke.spec.ts --project=chromium --workers=1
```

The wrapper forces Linux temp paths and preserves normal Playwright reports, screenshots, videos, and traces under project-configured artifact locations.

## 7. Google Cloud CLI

Install the official Linux x86_64 archive only after matching the SHA256 checksum published on Google's installation page. Authenticate the approved account:

```bash
gcloud auth login hello@jcapitalpropertygroup.com --no-launch-browser
gcloud config set account hello@jcapitalpropertygroup.com
gcloud config set project j-capital-property-production
gcloud auth list --filter=status:ACTIVE
gcloud projects describe j-capital-property-production --format='value(projectId,projectNumber)'
```

Expected project number: `47333888618`. These checks are read-only. Do not run `services enable`, IAM mutation, deployment, secret-version access, or API calls beyond project metadata.

## 8. Codex CLI

```bash
codex --version
git status -sb
git worktree list
```

Codex must operate in a clean isolated worktree, preserve unrelated dirty worktrees, use explicit file staging, and report every skipped gate.

## 9. Environment and credential handling

- Store provider secrets only in approved platform secret stores.
- Scope Preview credentials to the exact Git branch.
- Never paste connection strings or tokens into shell history, logs, issues, or PRs.
- Keep local credential files readable only by the owning user.
- Rotate any credential printed in a transcript or exposed to the wrong environment.
- Recreate synthetic database branches when provenance or credential exposure is uncertain.
- Verify `.env.local`, `.vercel`, Playwright artifacts, and credential files are ignored before committing.

## 10. Workstation recovery

1. Reinstall native WSL CLIs from official, checksummed sources.
2. Reauthenticate GitHub, Neon, Vercel, and Google Cloud individually.
3. Clone or add a clean worktree from GitHub; never recover by copying `.git` metadata.
4. Run read-only identity and project checks.
5. Restore Preview credentials from approved secret stores, never from terminal transcripts.
6. Run TypeScript, lint, unit, safety, build, and Playwright discovery.
7. Prove exact local/remote SHA equality before resuming certification.

## Troubleshooting

- `gh` invokes Windows or reports WSL socket errors: run `command -v gh`, start `bash -l`, and require `$HOME/.local/bin/gh`.
- Git asks for a username: run `gh auth status` and `gh auth setup-git`.
- `docker` points into a missing `/mnt/wsl/docker-desktop`: start/restart Docker Desktop and WSL integration.
- Playwright references `AppData/Local/Temp`: use `npm run test:e2e:linux`.
- Vercel targets the wrong project/team: inspect `.vercel/project.json`, `vercel whoami`, and the explicit `--scope`.
- Neon prompts for an organization: pass the approved `--org-id`; never choose interactively in automation.
- `gcloud` resolves to a Windows path: start a login shell and require `$HOME/.local/bin/gcloud`.

## CEO-independent boundary

The CEO should never install CLIs, copy credentials, select database branches, manage Vercel variables, inspect logs, start recurring jobs, or execute recovery commands. Engineering/Codex owns these operator procedures. The CEO supplies only one-time account consent when required and explicit approval for merge, Production migration, governed external execution, and Production promotion.
