---
name: session-start
description: Run at the start of every real working session (not casual/chat threads). Loads project state and confirms the agent is grounded before any work begins.
---
# Session-Start Command

## Step 1 — Load hot + warm memory
- Read `AGENTS.md` in full.
- Read `.agents/memory-decisions.md`, most recent 5 entries minimum.
- Read `.agents/pipeline-status.md` for current stage and Next Action.

## Step 2 — Check git status
Run: `git status --short` and `git log -3 --oneline`
If there are uncommitted changes from a previous session, surface them —
don't assume they're yours or safe to ignore.

## Step 3 — Summarize back to the user (short, not a wall of text)
- Current stage (from pipeline-status.md)
- Last 1-2 decisions logged (from memory-decisions.md)
- Any open/blocking questions (from AGENTS.md)
- The Next Action line, verbatim

## Step 4 — Mark this as a real session
Create the marker file: `.agents/.session-active`
This is what tells `auto-memory` at the end of this thread that real
work happened here, as opposed to a casual/chat thread that shouldn't
generate a memory entry.

## Step 5 — Ready check
End with a short "ready to work" confirmation. Do not start building
anything yet — this command only orients, it doesn't act.
