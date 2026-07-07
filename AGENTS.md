# Project Core Map (AGENTS.md)

> Read this file first, every session. Keep it under 200 lines.
> This is a TEMPLATE — after cloning for a new project, fill in the
> [PROJECT NAME], [PROJECT DESCRIPTION], and any stack deviations below.

## Project
- Name: FretNotTheory
- One-line description: A music theory learning and practice tool for guitarists.
- Status: scaffold

## Tech Stack (default — only deviate if the project needs it)
- Frontend: Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui
- Backend/DB/Auth: Supabase (Postgres, Auth, Storage)
- Hosting: Vercel (frontend + API routes)
- Package manager: pnpm
- Memory: Mem0 (via MCP, configured globally at ~/.gemini/config/mcp_config.json — do not duplicate the key here or in any committed file)

## Directory Conventions
- `/app` — routes and pages (App Router)
- `/components` — shared React components
- `/components/ui` — shadcn/ui primitives (generated, avoid hand-editing)
- `/lib` — utilities, Supabase client, helpers
- `/lib/supabase.ts` — single source of truth for the Supabase client
- `.agents/` — memory system (see below), not app code
- `blueprint/` — non-destructive extension layer; wires `.agents/agent-team.md`
  and `.agents/research/` back into the ongoing loop (see
  `blueprint/README.md`)
- `blueprint/capabilities/` — ui-developer.yaml and tab-theory-engine.yaml,
  the structured form of this project's confirmed agent-team.md
- `blueprint/routing/` — the PLAN-step logic that matches a task to one of
  the two capabilities above
- `blueprint/research/` — mid-task research trigger + how findings get
  folded back into future tasks' context
- `blueprint/state/knowledge-index.json` — queryable index over confirmed
  `.agents/research/` briefs (currently: guitar-tab-rendering)

## Build & Test Commands
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Keep these in `.env.local` (already gitignored). Never commit real keys.

## MCP Servers
Global config lives at `~/.gemini/config/mcp_config.json` (not committed —
contains keys/tokens).
- **Active**: mem0 (cross-project memory), sequential-thinking (free,
  local, no credentials — reasoning aid), supabase (queries/manages your
  Supabase project directly instead of manual SQL)
- **Deferred, not added** (add only if a real project's `define-concept`
  run surfaces an actual need, not speculatively): Linear/Notion (task
  tracking — no multi-person collaboration yet), Netlify (deployment — no
  project ready to deploy yet), MongoDB/Pinecone (Supabase already covers
  DB + vector search), Perplexity web-session workaround (explicitly
  avoided — uses unofficial tooling against account terms)

## Agent Guidelines & Anti-Patterns
- Check `.agents/memory-decisions.md` before making architectural changes or
  re-deciding something that was already decided.
- Don't introduce a second UI kit, CSS framework, or state library — this
  project uses Tailwind + shadcn/ui and React state/hooks unless a
  memory-decisions.md entry says otherwise.
- Don't hand-edit generated shadcn components in `/components/ui` — instead
  regenerate or wrap them.
- Update this file or `.agents/memory-decisions.md` whenever a correction is
  made or a new convention is adopted.
- If Mem0 (MCP) is connected, prefer querying it for cross-project patterns
  before asking the user to re-explain something.
- Before starting IMPLEMENT, consult `blueprint/capabilities/` (ui-developer
  vs tab-theory-engine) via `blueprint/routing/router-protocol.md` — don't
  guess which of the two agents owns a task. If a genuine research unknown
  blocks a task mid-loop, follow `blueprint/research/research-integration.md`.

## Session Protocol
These now live as real command files in `.agents/commands/` (not global-only
config), so the pipeline is portable across tools, not tied to one machine's
Antigravity setup:
- Start of session: `run session-start` (`.agents/commands/session-start.md`) — reads this file + memory-decisions.md, checks git status, aligns context, and creates `.agents/.session-active` so auto-memory knows this was a real working session.
- End of session: `run auto-memory` (`.agents/commands/auto-memory.md`) — manual only. There is no working Stop-hook trigger — the previous hook-based attempt was confirmed broken and has been removed (see 2026-07-05 and 2026-07-06 memory-decisions.md entries). You must run this yourself before closing the thread. Diffs the session, appends a dated entry to memory-decisions.md, runs `scope-check`, updates this file if a convention changed, syncs to Mem0 if connected.
- New project: `run bootstrap-project` (`.agents/commands/bootstrap-project.md`) — copies this template, detects the stack, and fills in this file automatically.
- Mid-session drift check: `run scope-check` (`.agents/commands/scope-check.md`) — runs automatically as the last step of auto-memory; compares the session's diff against Decided/Deferred and flags anything undeclared before it gets logged as settled.
- Casual/chat threads: if you never run `session-start`, no marker exists — brainstorming and quick questions don't get logged as project decisions.

## Full Pipeline (for new/extending scope)
1. `run bootstrap-project` — stack + memory skeleton
2. `run define-concept` — locks core loop into Decided/Deferred/Open below;
   forces a preference-vs-research fork on every open item (see
   `.agents/commands/define-concept.md`)
3. `run research-spike` — only for items marked type: research; one
   question per spike, output is a brief in `.agents/research/`
4. `run generate-agent-team` — gated on zero blocking Open Questions;
   proposes smallest viable agent team, confirmed by you before writing
5. `run session-start` → for each feature/fix, `run task-loop` (PLAN →
   IMPLEMENT → VERIFY → CRITIQUE → REFLECT, uses `compose-context`
   internally) → `run auto-memory` at session end (which runs
   `scope-check`) — normal working loop
6. Scope grows → back to step 2 for the new increment only

Check `.agents/pipeline-status.md` any time you're unsure what stage this
project is at or what to run next.

## Current Milestone Scope
### Decided
- Core Loop: Interactive guitar tablature player and theory visualizer with dynamic, toggleable "Theory Lenses" that overlay musical concepts (decided 2026-07-06)
- MVP Scope: A single pre-loaded demo song file with two initial theory lenses (Triads and Pentatonics) to validate the visualization engine (decided 2026-07-06)
- Tab Rendering & Highlighting: Use AlphaTab to parse/render Guitar Pro/MusicXML files. The default behavior is highlight-in-place (color matching notes, leaving everything else visible). An additional 'Isolate' toggle will be built in a second pass to remove/reflow notes showing only the lens-matching notes. (decided 2026-07-06, revised 2026-07-06)

### Deferred
- Web Scraping & Search (ultimate-guitar.com, songsterr.com, etc.) — not now, revisit later
- AI Tab Generation (generating tabs from audio files) — not now, revisit later
- User Accounts & Auth (Next-Auth/Supabase Auth, profiles) — not now, revisit later
- File Uploads (allowing users to upload their own `.gp3/4/5/gpx/musicxml` files) — not now, revisit later
- Advanced Theory Lenses (modes, jazz extensions, microtonality) — not now, revisit later
- Multi-track Synthesis (focus on guitar track only) — not now, revisit later

### Open Questions (BLOCKING)
- (none)

## System Dependencies
<!-- Homebrew-installed tools this project needs outside node_modules.
     Empty = pure JS project, folder delete is a full clean slate. -->
- (none yet)