---
name: define-concept
description: Use this after bootstrap-project (first run) or any time you're extending an existing project's scope (later runs). Locks down the real product concept before any team or code gets generated against it.
---
# Define-Concept Command

## Step 0 — Check for existing scope
Run: `grep -A20 "Current Milestone Scope" AGENTS.md`

- If nothing found (empty project): proceed to Step 1, full interview.
- If a Decided list already exists: summarize it back to the user in 2-3
  sentences ("Currently decided: ..."), then only ask about what's new for
  this increment. Do NOT re-ask questions already answered in a prior
  Decided entry.

## Step 1 — Interview
Ask the user, one question at a time, until each of the following is
either answered concretely or explicitly marked unresolved:
- What's the core loop? (What does one full use of this look like, start
  to finish?)
- What's the smallest first version worth building?
- What's explicitly out of scope for now (deferred, not deleted)?

## Step 2 — For each unresolved item, force this exact fork (DO NOT SKIP)
Ask the user directly, verbatim in spirit:

  "Is this something you just need to decide for yourself (a preference),
  or something we'd need to go find out about — current tools, methods,
  what's actually possible (research)?"

Do not classify this yourself. Do not infer it from context. The user's
answer alone determines the category:
- "Decide for myself" → stays as an Open Question in AGENTS.md, resolved
  whenever the user is ready. Does NOT trigger research-spike.
- "Need to find out" → flag it as a Research Question and tell the user to
  run `research-spike` on it before continuing to generate-agent-team.

## Step 3 — Write to AGENTS.md
Update (or create) the "Current Milestone Scope" section using this exact
format (headings must match verbatim — other commands grep for them):

```
## Current Milestone Scope
### Decided
- [item] (decided YYYY-MM-DD)

### Deferred
- [item] — not now, revisit later

### Open Questions (BLOCKING)
- [item] — type: preference | research
```

## Step 4 — Update pipeline-status.md
- STAGE: define-concept
- STATUS: complete if Open Questions (BLOCKING) is empty, otherwise blocked
- If blocked and any items are type: research, list them under
  "Active Research Questions" and set Next Action to:
  "Run research-spike on: [question]"
- If blocked and items are type: preference only, set Next Action to:
  "Resolve open preference questions above, then re-run define-concept"
- If complete, set Next Action to: "Run generate-agent-team"

## Step 5 — Conflict handling (for later re-runs only)
If anything in this run would contradict an existing Decided item:
1. STOP. Do not silently overwrite it.
2. Show the user the exact conflict: old decision vs. new statement.
3. Ask for explicit confirmation to revise.
4. If confirmed: move the old item to `.agents/memory-decisions.md` as a
   dated entry ("Revised: [old] → [new], because [reason]"), then update
   AGENTS.md with the new Decided item.
