---
workspace: SuperMercado
workspace_id: 157205
instance: x8ki-letl-twmt.n7.xano.io
cli_profile: default
generated: 2026-08-15
---

# Xano Development Playbook: SuperMercado

## Quick Reference

| Key | Value |
|-----|-------|
| Workspace ID | 157205 |
| Instance | x8ki-letl-twmt.n7.xano.io (Free plan) |
| CLI Profile | `default` (workspace + branch already set — no `-w`/`-b` needed) |
| App Status | 🟢 Production (live users/data) |
| Live/only Branch | `v1` (there is no separate dev branch) |
| Deploy Method | `workspace push` (sandbox is **not available** on the Free plan) |
| Workspace Push | Always enabled on Free plan (the `allow_push` toggle is a no-op here — API returns `ERROR_FATAL: Allow Push is not available on the Free plan. Push is always enabled for Free plan workspaces.`) |
| Data Source | Single (`live`) — no separate test data source |
| Team | Solo dev (Alessandro) |

## Development Rules

1. **There is no isolation layer.** No sandbox (Free plan), no dev branch (`v1` is the only branch and it's live), no test data source. Every push is a production change. Treat every push like a production deploy.
2. **Always run `xano workspace push -d ./xano -p default --dry-run` first** and show the user the preview before any real push. Never use `--force`.
3. **Never use `--truncate`, `--delete`, `--records`, or `--no-transaction`** without explicit user confirmation in that specific conversation — these can wipe/overwrite live data or disable rollback.
4. **Validate XanoScript before pushing**: `xano_validate_xanoscript` (file_path/directory) on anything edited.
5. Pull before editing to stay in sync: `xano workspace pull -d ./xano -p default`. The `xano/` folder is gitignored — it's a working copy, not source of truth (the Xano workspace is).
6. A pull→push round-trip can show spurious diffs (e.g., GUID normalization) even with no real edits — read the dry-run diff carefully before assuming a change is real.
7. No specific tables/endpoints/env vars were flagged as off-limits, but given this is solo-maintained production data with no test copy, default to caution on anything touching `user`, `account`, `employee_auth`, or orders/payments-related tables.

## How to Deploy Changes

### Editing an existing endpoint/table/function
1. Pull latest: `xano workspace pull -d ./xano -p default`
2. Edit the relevant `.xs` file(s) under `./xano`
3. Validate: `xano_validate_xanoscript` (MCP tool) on the changed file(s)
4. Preview: `xano workspace push -d ./xano -p default --dry-run`
5. Show the user the diff, get explicit go-ahead
6. Push for real: `xano workspace push -d ./xano -p default`

### Creating a new endpoint/table/function
1. Create the `.xs` file locally under `./xano`, following existing patterns (see sibling files in `xano/api/super_mercado/`, `xano/table/`, `xano/function/`)
2. Validate, dry-run, confirm, push (same as above)

## No-Go Zones

- **Tables:** none explicitly flagged — apply extra caution on `user`, `account`, `employee_auth`, `orders` since this is live data with no test copy
- **Endpoints:** none flagged
- **Functions:** none flagged
- **Env Vars:** none flagged — note `xano workspace pull --env` / `push --env` would touch these; avoid unless asked

## Troubleshooting

### If push shows unexpected diffs with no local edits
Likely GUID/formatting normalization from the pull/push round trip. Diff carefully; don't push if the change isn't one you made intentionally.

### If `workspace push` fails
- Re-pull to make sure the local copy isn't stale: `xano workspace pull -d ./xano -p default`
- Re-run with `--dry-run` to see the actual error/diff

### Sandbox commands
Not usable on this plan (`xano sandbox get` returns `Access Denied. Not supported with Free plan.`). If the user upgrades the Xano plan later, re-run `/xano-init` to switch this playbook over to the sandbox workflow.
