# Pipeline Status

> Single source of truth for "where is this project right now." Every
> pipeline command updates this file as its LAST action. Read this first
> if you feel lost — it tells you the next correct command to run.

## Current Stage
STAGE: define-concept
STATUS: not-started

<!--
Valid STAGE values, in order:
  bootstrap-project
  define-concept
  research-spike (only if triggered — see Active Research Questions below)
  generate-agent-team
  build (session-start / auto-memory loop)

Valid STATUS values:
  not-started | in-progress | blocked | complete
-->

## Current Task
<!-- Written by task-loop.md at PLAN, cleared at DONE. Empty = no task
     currently in flight; safe to start a new one or treat IDLE. -->
(none in flight)

## Active Research Questions (BLOCKING generate-agent-team)
<!-- One line per open technical question currently being spiked.
     Remove the line once its research-spike brief is confirmed and the
     item has moved to Decided in AGENTS.md. Empty list = not blocked. -->
- (none)

## Milestone History
<!-- Append one line per completed milestone. Newest at top. -->
- (none yet)

## Next Action
<!-- Written in plain language by whichever command last ran, so the next
     session (or you, re-reading this cold) knows exactly what to do next. -->
Run `define-concept` to lock down the core loop.
