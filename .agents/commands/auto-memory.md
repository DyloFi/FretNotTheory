---
name: auto-memory
description: Run manually at the end of a real working session (one that started with session-start). Do not run on casual/chat threads with no marker file.
---
# Auto-Memory Command

## Step 0 — Confirm this session counts
Check for `.agents/.session-active`. If it doesn't exist, stop and tell
the user this looks like a casual thread — no session-start was run, so
there's nothing to log. (There is no automatic Stop-hook trigger for
this — Antigravity does not reliably invoke Stop hooks. See the
2026-07-05 memory-decisions.md entry. This command must be run by hand.)

## Step 1 — Diff the session
Run: `git diff` and `git log -5 --oneline`
Read the actual changes, not just file names.

## Step 2 — Write the dated entry
Append to `.agents/memory-decisions.md`, newest at top, using the
existing format:
```
## [YYYY-MM-DD] Short title
- **Context**: what was happening
- **Decision/Fix**: what was done
- **Note**: anything future-you needs to not repeat the mistake
```

## Step 3 — Update AGENTS.md if a convention changed
Only touch AGENTS.md if this session established or revised a
project-wide convention (stack choice, directory rule, anti-pattern).
Routine feature work does not require an AGENTS.md edit.

## Step 4 — Run scope-check
Run the `scope-check` command now (see `.agents/commands/scope-check.md`).
Its result gets appended as part of this same dated entry — do not
write two separate entries.

## Step 5 — Sync to Mem0 (if connected)
If the Mem0 MCP server is active, push the key facts from this entry so
other projects/sessions can retrieve them cross-project.

## Step 6 — Clean up and report
- Delete `.agents/.session-active`
- Update `.agents/pipeline-status.md` if the stage or Next Action changed
- Report what was written, in 2-3 sentences, before ending the thread
