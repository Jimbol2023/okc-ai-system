# Workflow Orchestration Readiness

This audit covers n8n, Microsoft Power Automate Desktop, Playwright, terminal access, and file system access.

Recommended direction:

- Use n8n as the preferred future workflow orchestration layer.
- Use Playwright for local end-to-end testing only.
- Keep Microsoft Power Automate Desktop attended-only and blocked until a desktop automation policy exists.
- Keep terminal and file system access outside dashboard UI unless a future governed developer workflow adds allowlists and audit logs.

Current safety boundary:

- No live workflow triggers.
- No provider calls.
- No outreach.
- No CRM mutation.
- No desktop automation from the web dashboard.
- No terminal execution from the web dashboard.
- No file system writes from the web dashboard.
- No secrets are read from or exposed through `.env.local`.

n8n readiness sequence:

1. Draft workflows with all triggers disabled.
2. Document input data, output data, and business owner.
3. Add dry-run mode.
4. Add approval gates.
5. Add kill switch.
6. Add audit logging.
7. Review credential storage outside git.
8. Enable only one low-risk internal workflow after operator approval.

Power Automate Desktop readiness sequence:

1. Keep flows attended-only.
2. Prohibit hidden UI clicking.
3. Prohibit credential capture.
4. Require screen-change safety checks.
5. Require manual confirmation before any external app action.
6. Keep desktop automation separate from dashboard buttons.

Playwright testing policy:

- Target local or dedicated dev URLs only.
- Do not log into real provider accounts.
- Do not send SMS, email, calls, ads, posts, or provider requests.
- Use screenshots and accessibility checks for dashboard regressions.
- Block or mock provider domains when tests expand beyond local UI.

Terminal and file system policy:

- Terminal commands stay developer-only.
- File writes stay developer-only.
- No dashboard shell.
- No generic file browser.
- No `.env.local` exposure.
- Destructive commands require explicit human approval.

The current implementation is an authenticated read-only API audit at `/api/workflow-orchestration-readiness`.
