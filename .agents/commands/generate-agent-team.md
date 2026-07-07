---
name: generate-agent-team
description: Use this once define-concept's Current Milestone Scope has zero blocking Open Questions. Proposes the smallest viable set of specialist agents for the current milestone only.
---
# Generate-Agent-Team Command

## Step 1 — MANDATORY gate check (do this first, exactly as written)
Run: `grep -A5 "Open Questions (BLOCKING)" AGENTS.md`

- If any bullet lines appear under that heading (i.e. it's not immediately
  followed by "(none)" or an empty/### section), STOP.
- Output verbatim to the user: "Cannot generate agent team — these are
  still open: [list the exact lines found]"
- Do not proceed to Step 2 under any circumstances, even if the questions
  seem minor or you believe you could infer reasonable answers.

## Step 2 — Build the task list
From the Decided list ONLY (never Deferred, never past milestones already
archived in memory-decisions.md), enumerate the concrete tasks the current
milestone actually requires.

## Step 3 — Apply the split test to every pair of tasks
Default assumption: one generalist agent. Only split when ALL of these are
true for a given pair:
- Distinct knowledge domain (not just distinct files/components)
- You can state, in one sentence, what each agent must NEVER touch
- Low cross-talk (they wouldn't need to consult each other on every task)

If any test fails, keep them as one agent.

## Step 4 — Define each surviving agent
For each: Name / Scope (owns) / Boundary (never touches) / Trigger (when
to invoke). No vague titles — all four fields required.

## Step 5 — Present for confirmation BEFORE writing anything
Show the proposed team and the reasoning for each split (which test it
passed). Ask the user to confirm, merge, split further, or reject in favor
of a single generalist agent. Do not write to disk until confirmed.

## Step 6 — On confirmation
- Write to `.agents/agent-team.md`
- For each confirmed agent, also write/update a matching
  `blueprint/capabilities/<agent-name>.yaml` using the format in
  `blueprint/capabilities/README.md` (owns/never_touches/trigger/
  consult_before/verification), so `blueprint/routing/router-protocol.md`
  can route to them on every future task-loop run, not just read the
  prose once.
- Update `.agents/pipeline-status.md`: STAGE: build, STATUS: in-progress,
  Next Action: "Run session-start to begin building"
