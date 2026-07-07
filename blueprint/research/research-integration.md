# Research Integration

Referenced from `.agents/commands/compose-context.md` (context read order)
and `.agents/commands/task-loop.md` (PLAN and IMPLEMENT). Closes the loop
`research-spike.md` left open: a brief gets written once, then nothing
ever reads it again on future tasks.

## Two ways a research question can start

1. **Pre-declared**: `define-concept` flags an Open Question as type
   `research`. Unchanged — still gated by `research-spike.md` as written.
2. **Mid-task** (new): PLAN or IMPLEMENT surfaces a genuine feasibility or
   tradeoff unknown — not "what's the syntax," but "which of these
   approaches actually works / is licensable / performs adequately." When
   this happens:
   - STOP the current IMPLEMENT step.
   - Check `blueprint/state/knowledge-index.json` first — has this (or a
     close variant) already been answered? If yes, cite the existing
     brief in `.agents/research/` and resume immediately, no new spike.
   - If no, run `research-spike.md`'s existing Step 0/1/2/3/4 exactly as
     written (lock the question, confirm done-criteria with the user
     *before* researching, write the brief, confirm the brief with the
     user before it counts as decided). A mid-task trigger does not skip
     the human confirmation gate.
   - Once confirmed: run `scripts/indexing/build-knowledge-index.sh` to
     fold the new brief into the index.
   - Resume PLAN/IMPLEMENT informed by the brief's recommendation.

## Making past research visible to future tasks

`compose-context.md` Step 2 gets one more read source (see the additive
edit in that file): before treating something as unknown, check
`blueprint/state/knowledge-index.json` for entries whose tags overlap
this task's keywords, and read the matching brief(s). This is the concrete
fix for the gap where `.agents/research/*.md` existed but was never in
any command's read order.

## Promotion rule (why this doesn't erode the human-in-the-loop gate)

A finding only counts as usable knowledge once it has passed
`research-spike.md`'s Step 4 — the user confirms, redirects, or narrows
it. An agent must never treat its own unconfirmed research as fact.

The index does allow one intermediate state, `status: proposed` — a
brief that's been written and indexed (so it's visible and reviewable)
but not yet confirmed. PLAN/IMPLEMENT must never cite a `proposed` entry
as settled fact, only `confirmed`. The moment the user confirms or
redirects it, flip the front-matter `status` field and re-run
`build-knowledge-index.sh` — a one-line change, not a new brief.

## What this deliberately doesn't do yet

No automatic relevance ranking beyond keyword/tag match, no
confidence-weighted retrieval, no pruning of superseded entries. Add a
`status: superseded` value and a real ranking pass only once the index
has enough real entries for keyword match to start producing false
positives — not speculatively.
