# Blueprint Layer

> Non-destructive extension. Nothing in `.agents/` is removed or replaced —
> this folder adds the wiring that `.agents/` was missing, and a handful of
> small, additive hooks point `.agents/commands/*.md` at it.

## Why this exists

`generate-agent-team` and `research-spike` already do real work: they
produce a confirmed specialist roster and confirmed research briefs. The
gap was never "not enough infrastructure" — it's that nothing *read those
outputs back*. `task-loop`'s PLAN step never re-consulted `agent-team.md`,
and `compose-context` never checked `.agents/research/` at all. So
delegation happened once and was forgotten, and research got filed and
orphaned. This layer closes those two loops:

1. **Capability Registry** (`capabilities/`) — turns the one-shot prose
   roster into a queryable set of owns/boundary/trigger definitions, so
   PLAN can route to the right specialist on every task, not just the
   first one.
2. **Router Protocol** (`routing/router-protocol.md`) — the matching logic
   itself: task → capability, with an explicit "stop and flag, don't
   invent" rule when nothing fits.
3. **Research Integration** (`research/research-integration.md`) — lets a
   real unknown surface *mid-task*, not just during `define-concept`, and
   guarantees the resulting brief gets folded into every future task's
   context instead of sitting unread in `.agents/research/`.
4. **Knowledge Index** (`state/knowledge-index.json`) — the small piece of
   durable state needed to make (3) queryable instead of requiring a full
   re-read of every brief on every task.

## What's deliberately NOT built today

The original 3-phase report also specified a full Context Broker (file
selection via dependency graph), a Capability Registry with automatic
multi-agent fanout, an Executive Governor (loop-count halting, confidence
thresholds), and a Metrics Engine. Those stay out for now, for the same
reason `.agents/core/retrieval/README.md` already gives: *"do not add
automated retrieval until the memory stores have real data and the core
task loop has produced retrieval pain worth solving."* Today's build IS
that evidence-gathering step for the router and research pieces
specifically — everything else stays a contract until this lighter
version has been exercised on a real project and shown where it still
hurts.

Drift-prevention for routing is folded directly into the router protocol
(stop and ask when no capability fits) rather than a separate governance
layer — the smallest version of Phase 3's intent, without the extra
machinery.

## How a task-loop run actually uses this now

```
PLAN
 ├─ compose-context (unchanged, plus: check knowledge-index.json first)
 ├─ NEW: router-protocol.md — which capability owns this task?
 │        no match → stop, flag gap, don't proceed un-owned
 └─ if a genuine unknown surfaces → research-integration.md's mid-task
    path (scoped spike, user-confirmed, indexed) → resume PLAN informed
IMPLEMENT → VERIFY → CRITIQUE (now also checks: did it stay inside the
routed capability's boundary?) → REFLECT → STORE → DONE
```

## Graduation path

If, after real use, routing needs to consider multiple owners per task,
or the knowledge index needs ranking beyond keyword match, that's the
signal to build the fuller Context Broker from the original report. Not
before.
