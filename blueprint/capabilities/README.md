# Capability Registry

Each file in this folder is one specialist definition. This is the
**template's generic starter set** — the default roster a brand-new
project inherits before it has run `generate-agent-team` for its own
milestone.

Once a project runs `generate-agent-team`, that project's
`.agents/agent-team.md` becomes the authoritative, milestone-specific
roster and takes priority over these generic files (see
`../routing/router-protocol.md`). Projects are free to add, rename, or
delete capability files here to match their own confirmed team — these
generic ones are a starting point, not a fixed catalog.

## Format

```yaml
capability: <short_id>              # matches file name, no spaces
name: <Human Readable Name>
owns: >
  One or two sentences: the concrete scope this capability is
  responsible for. Specific enough that a task description can be
  matched against it.
never_touches: >
  One sentence: the explicit boundary. What this capability must not
  change even if it would be convenient to.
trigger: >
  One sentence: what kind of task description should route here.
consult_before: >
  What this capability must check before acting (e.g. an existing
  finding in the knowledge index, another capability's boundary).
  "none" if there's nothing extra beyond the normal compose-context read.
verification: >
  How CRITIQUE checks this capability's output specifically, beyond the
  generic task-loop CRITIQUE questions.
```

## How PLAN queries this (summary — full logic in router-protocol.md)

1. Read `.agents/agent-team.md` if it exists; else read every `*.yaml`
   here.
2. Match the task's one-sentence description against each candidate's
   `owns`.
3. Exactly one match → route there, carry its `never_touches` into the
   plan as a hard constraint.
4. Zero matches → stop, flag the gap. Do not invent a capability on the
   fly.
5. Multiple matches → prefer the narrowest `owns`; if genuinely
   overlapping, note both boundaries, keep it one task-loop run unless
   `.agents/docs/agent-orchestration.md`'s fanout criteria are
   independently met.
