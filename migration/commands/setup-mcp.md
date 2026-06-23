---
description: One-time setup of the Ext JS -> Angular migration framework — install/verify Playwright + Chrome DevTools MCP, wire agents/commands into .claude, and sanity-check config.
argument-hint: (none)
---

Set up the migration framework so the parity eval and agents work. Do these in order and report
what succeeded / what the user must do manually.

1. **Browser MCPs** (the eval depends on both):
   - Playwright MCP — tell the user to run: `claude plugin install playwright@claude-plugins-official`
     (interactive; you cannot run it for them). If they prefer config-only, the project-root
     `.mcp.json` already declares a `playwright` server.
   - Chrome DevTools MCP — already declared in the project-root `.mcp.json`
     (`npx chrome-devtools-mcp@latest`, repo: https://github.com/ChromeDevTools/chrome-devtools-mcp).
   - Ask the user to restart Claude Code and confirm both show connected via `/mcp`.
2. **Wire agents + commands into the harness** (so they're first-class): copy or symlink
   `.migration/agents/*` → `.claude/agents/` and `.migration/commands/*` → `.claude/commands/migration/`
   (the `migration/` subfolder yields the `/migration:*` namespace). Offer to do this with Bash.
3. **Validate config**: read `.migration/config/migration.config.yaml`; confirm `source.code_path`,
   `source.run.url`, `target.code_path`, `target.run.url`, and `viewports` are set to real values.
   List anything still at its placeholder default.
4. **Check both apps are reachable** (if URLs are set): a quick HEAD/GET to the legacy and Angular
   URLs; report which are up.
5. Print the next step: `/migration:plan` to build the 150-page ledger.

Report a short checklist of done / todo. Do not proceed to planning automatically.
