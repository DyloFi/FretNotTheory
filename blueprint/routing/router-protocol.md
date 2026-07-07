# Router Protocol

Referenced from `.agents/commands/task-loop.md` PLAN, step 1.5. This is
the piece that was missing: `generate-agent-team` produces a confirmed
roster, but nothing re-consulted it on every subsequent task. This does.

## Step 1 — Load the roster
- If `.agents/agent-team.md` exists, that is the authoritative roster for
  this project's current milestone. Use it.
- If it doesn't exist yet (no `generate-agent-team` run so far), fall
  back to `blueprint/capabilities/*.yaml` directly — this lets task-loop
  work even on day-one projects, but note in REFLECT that a
  milestone-specific team hasn't been generated yet if the project has
  grown past 2-3 tasks.

## Step 2 — Match
State the current task in one sentence (already required by
compose-context Step 1). Compare it against each candidate's Scope/Owns
field.

- **Exactly one match** → route here. Carry its Boundary/Never-Touches
  into the plan as a hard constraint CRITIQUE will check later.
- **Zero matches** → STOP. Do not proceed to IMPLEMENT and do not invent
  a new capability on the fly. Tell the user: "No existing
  capability/agent owns this task. Options: (a) expand [closest
  candidate]'s scope, (b) treat this as a new capability to confirm at
  the next `generate-agent-team` run." This mirrors
  `generate-agent-team`'s own confirm-before-write discipline — routing
  gaps get the same treatment as team-composition gaps.
- **Multiple matches** → prefer the narrowest/most specific `owns`. If the
  task genuinely spans two owners (e.g. touches both backend and
  database), note both boundaries in the plan and keep it a single
  task-loop run unless `.agents/docs/agent-orchestration.md`'s fanout
  criteria (distinct domain + statable boundary + low cross-talk) are
  independently met — don't split into parallel agents just because two
  capabilities are mentioned.

## Step 3 — Record it
The plan written in task-loop's PLAN step must name the routed capability
and its `never_touches`/Boundary line verbatim. This is what lets
CRITIQUE check "did the implementation stay inside its lane" as a
concrete, checkable fact instead of a vibe.

## What this deliberately doesn't do yet
No automatic multi-owner context merging, no dependency-graph-based file
selection, no confidence scoring on the match. If routing ambiguity turns
out to be frequent in practice, that's the signal to build the fuller
Context Broker — not before.
