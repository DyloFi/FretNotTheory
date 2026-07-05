---
name: bootstrap-project
description: Run once, when starting a brand new project from this template. Copies the template in, detects the real stack, and fills in AGENTS.md placeholders.
---
# Bootstrap-Project Command

## Step 1 — Copy the template
Copy this template's contents into the target project directory (the
canonical source is wherever this repo is checked out — e.g.
`~/Templates/antigravity-blueprint/` — do not assume a hardcoded path if
the user's setup differs; confirm the source path if unclear).

## Step 2 — Detect the actual stack
Look for `package.json`, `go.mod`, `Cargo.toml`, or similar. If the
target isn't empty and already has a different stack, do NOT force the
template's Next.js/Supabase defaults — instead:
- Update AGENTS.md's Tech Stack section to reflect what's actually there
- Flag any conflicting convention (e.g. existing CSS framework vs.
  Tailwind) as an Open Question for `define-concept` to resolve, not a
  silent override

## Step 3 — Fill in AGENTS.md placeholders
Replace `[PROJECT NAME]` and `[PROJECT DESCRIPTION]` with real values —
ask the user if not obvious from context (README, package.json name
field, directory name).

## Step 4 — Reset memory files for the new project (mandatory, not judgment-based)
The template repo you're copying from is itself a working project — it
accumulates real `memory-decisions.md` entries and `pipeline-status.md`
milestone history as it gets improved. None of that belongs in a project
bootstrapped from it; carrying it over creates false provenance (a new
project's memory log claiming decisions it never made). This step is
mechanical, run every time, regardless of what the template currently
contains:

1. Overwrite `.agents/memory-decisions.md` with only its header block
   (the "Evolving Project Decisions & Lessons" title + format
   instructions) plus one line: `(no entries yet — this project's first
   real session will start the log)`. Delete every dated entry and the
   `[TEMPLATE]` example, unconditionally.
2. In `.agents/pipeline-status.md`, clear the `## Milestone History`
   section back to `- (none yet)`. Clear `## Current Task` back to
   `(none in flight)`. Clear `## Active Research Questions` back to
   `- (none)`.
3. In `AGENTS.md`, confirm the "Current Milestone Scope" section
   (Decided/Deferred/Open Questions) is still the untouched
   `(none yet)` template state — if the source template has somehow
   accumulated real entries there too, reset it the same way.

Do this before Step 3's placeholder fill-in, not after — it's easy to
forget once the project starts feeling "real."

## Step 5 — Update pipeline-status.md
- STAGE: define-concept
- STATUS: not-started
- Next Action: "Run define-concept to lock down the core loop"

## Step 6 — Report
Summarize: detected stack, what was filled in, what was flagged as a
conflict (if anything), and the next command to run.
