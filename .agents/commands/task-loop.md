---
name: task-loop
description: Run for each distinct unit of work within a session (roughly one feature/fix/endpoint — the same granularity the README says deserves its own thread). Not run for trivial one-line changes. Makes the agent's state explicit and observable instead of silently jumping straight to code.
---
# Task-Loop Command

## States
```
IDLE → PLAN → IMPLEMENT → VERIFY → CRITIQUE → REFLECT → DONE
                 ↑____________________|
                 (VERIFY or CRITIQUE failure loops back to IMPLEMENT)
```
The current state always lives in `.agents/pipeline-status.md` under
"Current Task" (added by Step 0 below) — read that section first if
resuming a task started in a prior message, rather than assuming IDLE.

## Step 0 — Enter PLAN, log it
Write to `.agents/pipeline-status.md`:
```
## Current Task
TASK: <one-sentence description>
STATE: PLAN
```

## PLAN
1. Run `compose-context` (`.agents/commands/compose-context.md`) —
   including its Step 5 scope gate and Step 6 provenance check. Do not
   proceed to IMPLEMENT if either of those stopped with a question.
2. From the compressed context, write the concrete plan: what files
   change, what the smallest correct version looks like, what could go
   wrong. 3-6 bullets, not a design doc.
3. If the plan reveals this is actually 2+ unrelated tasks, stop and say
   so — split it, run task-loop separately for each.
4. Update STATE: IMPLEMENT in pipeline-status.md.

## IMPLEMENT
Do the work described in the plan. Nothing outside it — if something
outside the plan turns out to be necessary, note it, finish the current
plan first, then decide whether the new item is its own task.
Update STATE: VERIFY when done.

## VERIFY
Run the existing `.agents/workflows/verify.md` (build + lint,
self-healing). If it fails and gets fixed, that's normal — stay in
VERIFY, don't treat a caught bug as a loop failure. If it reveals the
plan itself was wrong (not just a typo), go back to STATE: IMPLEMENT, or
to PLAN if the approach itself needs rethinking.
Update STATE: CRITIQUE when verify is clean.

## CRITIQUE
This is different from `scope-check` (which checks scope drift at
session end). This checks the work itself, right now, against its own
plan:
- Does the implementation actually do what Step PLAN said, or did it
  quietly drift while being built?
- Any edge case the plan didn't consider that's now visible in the
  actual code?
- Is there a simpler version that does the same job?
If critique finds a real problem, go back to IMPLEMENT (or PLAN, if the
problem is in the approach). If critique is clean, say so briefly and
move on — this is not a second full code review, it's a gut-check.
Update STATE: REFLECT.

## REFLECT
One or two sentences: what was learned that's worth carrying forward
(not what was built — that's evident from the diff). Only write this
down if it's genuinely non-obvious — a naming convention, a gotcha, a
reason an alternative was rejected. This is a candidate line for
`auto-memory` to pick up at session end, not a new file — hold it in the
response, don't write it to disk yet (auto-memory does that once per
session, not once per task, or memory-decisions.md turns into noise).
Update STATE: DONE.

## Step Final — Clear the task
Remove the "Current Task" block from `pipeline-status.md` (it's for
in-flight tracking, not history — `auto-memory` and `scope-check` are
what write durable history at session end).
