---
name: scope-check
description: Run as the last step of auto-memory, before the session log entry is written. Compares what actually changed against what was Decided/Deferred, so drift gets caught the same session it happens instead of surfacing in a code review weeks later.
---
# Scope-Check Command

## Step 1 — Gather the diff
Run: `git diff --stat HEAD` and `git log -1 --format=%H`
If there is no diff (nothing changed this session), report "No changes
this session — scope-check skipped" and stop here.

## Step 2 — Gather the scope
Run: `grep -A30 "Current Milestone Scope" AGENTS.md`
Read the Decided and Deferred lists.

## Step 3 — Compare
For each changed file/area in the diff, ask: does this map to a Decided
item?
- **Maps cleanly** → no action, list it as "in scope" in the report.
- **Maps to a Deferred item** → STOP and flag it: "This session touched
  [X], which is marked Deferred, not Decided. Was this intentional scope
  expansion, or should it be reverted/parked?" Do not silently let it
  pass — the user must answer before auto-memory continues.
- **Maps to neither** (genuinely new ground) → flag it as "Undeclared
  work" and ask the user whether it should be added to Decided
  retroactively, logged as a deliberate one-off, or reverted.

## Step 4 — Write the result
Append the scope-check result as part of the same dated entry auto-memory
is already writing to `.agents/memory-decisions.md` — do not create a
separate file. Format:
```
- **Scope-check**: in-scope | flagged: [item] | undeclared: [item]
```

## Step 5 — Never block silently
This command can pause and ask a question. It must never revert code or
edit files on its own — it only surfaces the mismatch and logs the
outcome the user chooses.
