---
name: research-spike
description: Use this when define-concept has flagged an Open Question as type "research" — a technical/feasibility unknown that requires investigation, not a personal preference decision.
---
# Research-Spike Command

## Step 0 — Confirm this should be a spike at all
Read the flagged question from AGENTS.md's Open Questions list. If it
covers more than one distinct technical unknown (e.g. "audio-to-tab AND
hand-position AND theory cross-referencing" bundled together), STOP and
tell the user this needs to be split into separate spikes, one per
question. Do not proceed on a bundled question.

## Step 1 — Lock the question and done-criteria BEFORE researching
State back to the user, for confirmation:
- The exact one-sentence question being researched
- Definition of done: "2-4 candidate approaches, their tradeoffs, and one
  recommendation, with sources"

Do not start researching until this is confirmed. This is the time-box
equivalent for a solo, non-timed workflow — the boundary is scope, not a
clock.

## Step 2 — Research
Search for current best practices, frameworks, libraries, or approaches
relevant to the locked question only. Stay inside the question's scope —
if research surfaces an interesting but unrelated tangent, note it as a
one-line "worth a future spike" mention, do not follow it.

## Step 3 — Write the brief
Create `.agents/research/<short-topic-name>.md` with:
- The question
- 2-4 candidate approaches with tradeoffs
- One recommendation with reasoning
- Sources
- Any honest limitations in what was found

## Step 4 — Confirm with user
Show the brief. Ask the user to confirm, redirect, or request a narrower
follow-up spike. Do not touch AGENTS.md until confirmed.

## Step 5 — On confirmation
- Move the item from "Open Questions (BLOCKING)" to "Decided" in
  AGENTS.md, citing the brief file path instead of re-explaining reasoning
  inline.
- Update `.agents/pipeline-status.md`: remove this line from Active
  Research Questions. If that list is now empty AND no preference-type
  Open Questions remain, set STATUS: complete for the define-concept
  stage and Next Action: "Run generate-agent-team".
