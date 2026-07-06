# Research Brief: Guitar Tablature Rendering & Dynamic Highlighting

## Question
How to parse, render, and dynamically filter/highlight notes in the guitar tab using a free and open-source library in Next.js/React?

---

## Candidate Approaches

### 1. AlphaTab (`@coderline/alphatab`)
**Overview**: A robust, cross-platform engine built specifically for parsing, rendering, and playing guitar tablature and sheet music. Natively supports Guitar Pro formats (`.gp3`, `.gp4`, `.gp5`, `.gpx`) and MusicXML.

*   **Highlighting/Filtering Method**:
    *   Traverse the parsed score object model using the `scoreLoaded` event.
    *   Style individual notes using `note.style = new alphaTab.model.NoteStyle()` and setting `note.style.color = '#ff0000'`, followed by calling `api.render()` to paint changes.
    *   Filter out notes (to isolate pentatonics or triads) by temporarily removing or graying out notes in the loaded Score model and re-rendering.
*   **Pros**:
    *   Deep, out-of-the-box support for all Guitar Pro file formats (which represent 90%+ of guitar tabs online).
    *   Supports guitar-specific ornaments (bends, slides, hammer-ons/pull-offs, vibrato, etc.).
    *   Includes a built-in midi/audio playback engine with a fretboard visualizer.
*   **Cons**:
    *   Written in C# and transpiled to JS, leading to a large bundle size and a highly imperatively styled API.
    *   Needs to be dynamically imported with `ssr: false` in Next.js because it accesses browser-only APIs (`window`, `Canvas`, `Worker`).
    *   `api.render()` recalculates the layout of the entire sheet, which can be computationally expensive if triggered in rapid succession.

### 2. VexFlow (`vexflow`)
**Overview**: The standard low-level open-source library for rendering music notation and guitar tablature directly to HTML5 Canvas or SVG.

*   **Highlighting/Filtering Method**:
    *   Instantiate `TabNote` or `StaveNote` objects and call `note.setStyle({ fillStyle: '#ff0000', strokeStyle: '#ff0000' })` prior to calling `formatter.format()` and `stave.draw()`.
    *   Dynamic rendering is highly performant because VexFlow draws only the requested measures/elements on Canvas/SVG.
*   **Pros**:
    *   Extremely lightweight and performant.
    *   Full layout and style control, mapping very naturally to React's declarative state changes.
*   **Cons**:
    *   **No native file parsers**: VexFlow does not parse `.gp5`, `.gpx`, or `.musicxml` files. We would have to write or integrate a separate complex parser to translate these formats into VexFlow's layout parameters.
    *   No built-in audio playback or synthesizer.

### 3. OpenSheetMusicDisplay (OSMD)
**Overview**: A high-level library designed to render MusicXML sheets inside browser SVG containers, utilizing VexFlow under the hood.

*   **Highlighting/Filtering Method**:
    *   Highlights can be applied dynamically by overriding the default cursor class, or by modifying individual SVG DOM nodes post-render.
*   **Pros**:
    *   Natively parses MusicXML files.
    *   Clean layout.
*   **Cons**:
    *   Does not support Guitar Pro format natively (only MusicXML).
    *   Tablature is secondary to standard sheet notation; rendering guitar ornaments (bends, slides) is less robust than AlphaTab.
    *   Dynamic highlighting of non-sequential notes simultaneously requires extending the cursor system or manually querying SVG DOM nodes, which is fragile.

---

## Recommendation

**We recommend AlphaTab.**

### Reasoning
For an interactive guitar-learning app, the ability to read Guitar Pro files (`.gp5`, `.gpx`) is critical because they are the standard format for accurate guitar tablature. Standard MusicXML files are rare in the guitar community compared to Guitar Pro files. 
Additionally, AlphaTab provides built-in guitar ornaments (bends, slides) and a synchronized audio engine out of the box. Although its bundle size is large and it requires dynamic importing in Next.js, its built-in API support for traversing/styling notes and rendering custom note colors makes it the only feasible solution that doesn't require writing a custom Guitar Pro file parser from scratch.

---

## Sources
- AlphaTab Documentation (styling/rendering): [alphatab.net/docs](https://www.alphatab.net/docs/)
- AlphaTab GitHub: [github.com/coderline/alphatab](https://github.com/coderline/alphatab)
- VexFlow Documentation: [vexflow.com](https://www.vexflow.com/)
- OpenSheetMusicDisplay: [opensheetmusicdisplay.org](https://opensheetmusicdisplay.org/)

---

## Honest Limitations
*   **React Integration**: There are no official, actively-maintained React bindings for AlphaTab. We will need to write our own custom React wrapper component that safely manages the DOM mount point, initializes the API inside `useEffect`, and controls rendering.
*   **Performance**: Dynamically toggling lenses will trigger a full re-layout and re-render in AlphaTab, which could cause a visual blink or a brief lag of 50–200ms depending on song length. We should mitigate this by keeping the rendering scoped to specific sections/measures if possible, or optimizing state updates to prevent duplicate redraw calls.
