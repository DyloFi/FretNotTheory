---
topic: Music Theory Calculation Engine (Scale/Triad Membership)
tags: [music-theory, scale-membership, triad, pentatonic, tonal-js, teoria-js]
status: confirmed
decided_date: 2026-07-07
summary: Use tonal.js to compute triad/pentatonic scale membership per key rather than hand-rolling interval math or using the unmaintained teoria.js; wrap its pure functions in a small lib/theory.ts adapter that outputs note-name sets AlphaTab's NoteStyle pass can match against.
---

# Research Brief: Music Theory Calculation Engine (Scale/Triad Membership)

Produced by the new mid-task research trigger (`blueprint/research/research-integration.md`),
during `task-loop` PLAN for: "Implement the music theory calculation
engine — determine which notes in the loaded demo song belong to the
active lens (Triads / Pentatonics) for the song's key." Routed to
capability `tab-theory-engine` per `blueprint/routing/router-protocol.md`.

## Question
What's the best free/open-source approach in JS/TS to compute which
notes belong to a given triad or pentatonic scale for an arbitrary key,
in a form that can be matched against AlphaTab's note model to drive
`NoteStyle` coloring?

## Candidate Approaches

### 1. tonal.js (`tonal` on npm)
Functional music theory library — notes, intervals, scales, chords.
`Scale.get("C major pentatonic").notes` and `Chord.degrees("Cm")` map
almost directly onto what this task needs: given a key + lens type,
return the matching note-name set.
- **Pros**: actively used in current showcase projects (React Guitar,
  Chordify-style tools); small (per-module imports keep bundle size
  down, relevant since AlphaTab is already large); pure functions, easy
  to unit test in isolation from AlphaTab; covers scales, triads, and
  enharmonic spelling out of the box.
- **Cons**: another dependency; abstractions are theoretical (works on
  note names, not on AlphaTab's own note objects), so a thin adapter
  layer is still needed to bridge the two.

### 2. teoria.js
An older, well-regarded music theory library with note/scale/chord/
interval objects, referenced as one of tonal's own design inspirations.
- **Pros**: similarly capable API surface (scales including pentatonic,
  chord/triad construction).
- **Cons**: search results show no meaningful activity since around
  2016 — recommendation articles and showcases are all from that era,
  with no evidence of recent maintenance. For a project that already
  carries AlphaTab's maintenance/compatibility risk, adding a second
  stale dependency isn't worth it when a more current option exists.

### 3. Hand-rolled interval math
Compute scale/triad membership directly with a semitone-offset lookup
(e.g. major triad = root, +4, +7 semitones; major pentatonic = root, +2,
+4, +7, +9) against AlphaTab's own `note.realValue`/pitch data, no extra
dependency.
- **Pros**: zero new dependencies; full control; trivial for the two
  MVP lenses (Triads, Pentatonics) specifically.
- **Cons**: reinvents well-tested logic for a domain full of edge cases
  (enharmonic spelling, key signature-aware naming); doesn't scale
  cleanly if "Advanced Theory Lenses" (currently Deferred in AGENTS.md —
  modes, jazz extensions) get picked back up later, at which point
  hand-rolled math would need to grow into its own small theory library
  anyway.

## Recommendation

**Use tonal.js**, wrapped in a small `lib/theory.ts` adapter with one
job: given a key + lens type, return the matching note-name set that
`components/TabPlayer.tsx` can check each AlphaTab note against before
applying `NoteStyle`. This keeps the actual theory math out of the
rendering/UI layer entirely (respecting the `tab-theory-engine` /
`ui-developer` boundary already defined in `agent-team.md`), costs one
small dependency instead of reinventing interval math, and leaves room
to add more lenses later without a rewrite — while avoiding teoria.js's
apparent lack of recent maintenance.

## Sources
- tonal.js GitHub repository and API documentation
- teoria.js GitHub repository (for currency/maintenance comparison)
- npm registry listing for `tonal`

## Honest Limitations
This brief compares theory-computation libraries only; it does not
benchmark actual runtime cost of calling tonal.js functions per-note
against a full song at render time — if profiling later shows this is
a bottleneck, memoizing per-key scale/triad sets (computed once per song
load, not per note) is the obvious fix and should be assumed from the
start rather than added as an afterthought.

**Status: proposed, not yet confirmed.** This was generated live to
demonstrate the new mid-task research trigger — it still needs your
sign-off (or redirect) before the `status` field flips to `confirmed`
and this counts as settled per `research-spike.md` Step 4.
