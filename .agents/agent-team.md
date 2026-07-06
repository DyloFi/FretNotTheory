# Agent Team Configuration

This document defines the specialist agents authorized for the MVP milestone of FretNotTheory.

## 1. UI Developer
*   **Role**: UI Layout & Styling
*   **Scope (Owns)**: The main layout, page routing, sidebar/controls, visual theme, Tailwind/shadcn components, and state management of active lenses.
*   **Boundary (Never Touches)**: Must NEVER touch `lib/theory.ts` (theory math) or the internal drawing logic of the `TabPlayer` component wrapper.
*   **Trigger**: Invoked to construct the user interface layout, design components, and hook up page state.

## 2. Tab & Theory Engine Developer
*   **Role**: AlphaTab & Music Theory logic
*   **Scope (Owns)**: Low-level integration with AlphaTab, note traversing, note styling (`NoteStyle`), audio/playback state, and mathematical music theory helper functions.
*   **Boundary (Never Touches)**: Must NEVER touch `app/page.tsx` or modify visual styles, general layout, or CSS outside the tab canvas wrapper.
*   **Trigger**: Invoked to implement AlphaTab rendering, note coloring algorithms, and music theory calculation logic.
