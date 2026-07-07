# Evolving Project Decisions & Lessons
<!-- project: FretNotTheory -->

> Append-only. Newest entries at the top. One entry per decision/fix.
> Format:
> ## [YYYY-MM-DD] Short title
> - **Context**: what was happening
> - **Decision/Fix**: what was done
> - **Note**: anything future-you needs to not repeat the mistake

## [2026-07-06] Researched AlphaTab note highlighting and created Implementation Plan
- **Context**: Needed to plan the implementation of dynamic theory lenses (Triads and Pentatonics) and playback controls.
- **Decision/Fix**: Discovered that AlphaTab's `Note` class has a `realValue` property containing the MIDI key number, and a `style` property of type `NoteStyle` to customize individual note styling dynamically. Created a detailed implementation plan (`implementation_plan.md`) for the theory engine and control UI.
- **Note**: None.
- **Scope-check**: in-scope

## [2026-07-06] Rendered local guitar tab via AlphaTab in Next.js
- **Context**: Needed to verify that AlphaTab can parse and render a local tablature file in Next.js without hitting external servers or CDNs.
- **Decision/Fix**: Created a custom client-side dynamic React component `TabPlayer` that loads a locally generated `public/demo.musicxml` file. Copied Bravura SMuFL font files from `node_modules/@coderline/alphatab/dist/font/` into `public/font/` and pointed `core.fontDirectory` to `/font/` to prevent 404/CORS errors during offline rendering.
- **Note**: Always use `fontDirectory: "/font/"` with trailing slash, and import the player component dynamically in Next.js (`ssr: false`) to avoid server-side document/window undefined compilation errors.
- **Scope-check**: in-scope

## [2026-07-06] Revised: Tab Rendering & Highlighting
- **Context**: The original plan was to build both highlight (color matching notes, leave others visible) and filter/isolate (remove non-matching notes) programmatically using AlphaTab.
- **Decision/Fix**: Split the rendering behavior. Default behavior is "highlight-in-place" (color matching notes, leave everything else visible). The "Isolate" toggle (removing/reflowing notes) will be built as a second, harder pass in a separate task. Highlight is simpler and will be implemented first.
- **Note**: Modifying the Score model to delete notes is much more invasive than modifying style properties. Splitting these into two phases prevents scope creep in the initial implementation.
- **Scope-check**: in-scope

