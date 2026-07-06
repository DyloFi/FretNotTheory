---
name: compose-context
description: Run as the first action of PLAN in task-loop, for any task beyond a one-line fix. Builds working context fresh for this task instead of re-reading everything accumulated so far. Context is a cache, not storage — rebuild it, don't carry it forward.
---
# Compose-Context Command

## Principle
Do not re-read the whole thread history or every file touched so far as
"context." Rebuild only what this specific task needs, in this order,
and stop as soon as it's enough to act.

## Step 1 — Goal
State the task in one sentence. If it can't be stated in one sentence,
it's not a task yet — go back to `task-loop`'s PLAN step and split it.

## Step 2 — Read in this order, stopping early if sufficient
1. `AGENTS.md` — Current Milestone Scope only (not the whole file if
   already loaded this session via session-start).
2. `.agents/pipeline-status.md` — Current Task block, if one exists from
   an interrupted prior attempt.
3. `.agents/memory-decisions.md` — grep for terms relevant to this task's
   goal (file names, feature names, prior error messages). Do NOT read
   the full file top to bottom. Two or three matching entries is normal;
   more than five is a sign the search terms are too broad.
4. Files this task will actually touch — read them now, not from memory
   of an earlier pass in this thread. Code drifts; assumptions about it
   shouldn't.
5. Most recent relevant tool output only if this task is a continuation
   of one that just ran (e.g. re-fixing a build error) — otherwise skip.

## Step 3 — Compression check
Before handing off to IMPLEMENT, state back in 2-4 bullets: what's
actually relevant to this task from what was just read. If a bullet
doesn't change what you're about to build, it doesn't belong here.

## Step 4 — Flag gaps, don't guess
If Step 2 surfaces a contradiction (e.g. two memory-decisions entries
disagree, or AGENTS.md's Decided list doesn't cover this task) — stop
and flag it. Do not silently pick one and proceed; that's how scope
drift and repeated mistakes both start.

## Step 5 — Scope gate (hard check, not advisory)
Before handing off to IMPLEMENT, explicitly check the plan's concrete
steps against AGENTS.md's Deferred list from Step 2. This is a real
gate, not a note-and-proceed: if any planned step touches something
listed as Deferred (e.g. plan calls for fetching something from the web
when "Web Scraping & Search" is Deferred), STOP before IMPLEMENT and ask
the user to confirm this is an intentional, approved exception — do not
proceed on the assumption that "just this once" is fine. Log the
resolution either way in the eventual REFLECT note.

## Step 6 — Provenance check
Confirm `.agents/memory-decisions.md`'s header comment names the
current project. If it names a different project, or has no project
name at all, STOP — do not treat any entries in that file as this
project's history until this is resolved. This is the check that would
have caught cross-project confusion immediately instead of requiring a
manual investigation.
