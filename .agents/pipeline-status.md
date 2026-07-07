# Pipeline Status

> Single source of truth for "where is this project right now." Every
> pipeline command updates this file as its LAST action. Read this first
> if you feel lost — it tells you the next correct command to run.

## Current Stage
STAGE: build
STATUS: in-progress

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
- [2026-07-07] `blueprint/` layer added: agent-team.md's two agents
  (UI Developer, Tab & Theory Engine Developer) ported into structured
  capability files so task-loop's PLAN step routes to them on every task
  instead of only reading the roster once; existing guitar-tab-rendering
  brief retrofitted with front-matter and indexed into
  blueprint/state/knowledge-index.json; mid-task research trigger added
  so future unknowns get resolved and folded back in, not orphaned. Also
  produced .agents/research/theory-calculation-engine.md (status:
  proposed, tonal.js recommendation) as a live test of the new trigger —
  not yet confirmed, not yet built.
- [2026-07-06] Successfully integrated and rendered local guitar tablature using AlphaTab in Next.js.
- [2026-07-06] Completed concept definition and research spike validating AlphaTab for rendering and dynamic note highlighting.

## Next Action
<!-- Written in plain language by whichever command last ran, so the next
     session (or you, re-reading this cold) knows exactly what to do next. -->
The soundfont/playback task is complete. Ready for the next feature task
or to finalize the working session by running auto-memory. Before
starting the music theory calculation engine specifically: read
.agents/research/theory-calculation-engine.md (status: proposed) and
either confirm it (flip status to "confirmed", re-run
scripts/indexing/build-knowledge-index.sh) or redirect it — that's the
one open loop from today's blueprint-layer work.
