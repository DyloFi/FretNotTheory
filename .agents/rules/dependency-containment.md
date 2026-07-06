---
trigger: always_on
---

# Dependency & Environment Containment Rule

Applies always, every session, every agent — not invoked, just followed.

## Principle
If this project folder gets deleted, the only other cleanup that should
ever be needed is Homebrew (for system tools you explicitly approved) —
never shell config, never global npm/pip, never system-wide state.

## Node/JS dependencies
- Only ever install with pnpm add <pkg> (or -D for dev). NEVER
  pnpm add -g, npm install -g, or sudo npm.
- Node itself comes from Homebrew (brew install node) or is pinned via
  .nvmrc / engines.node in package.json — never silently rely on a
  different Node install method (nvm, volta, fnm) without flagging it.
- node_modules/, .next/, pnpm-lock.yaml are the only things a JS
  install should ever touch. If a step needs to write outside this
  folder — a global config file, a shell rc file, /usr/local — STOP
  and ask the user first. Never proceed silently.

## Non-JS dependencies (Python, system binaries, ML tooling)
This project's later phases (audio-to-tab transcription) will likely
need Python packages and system tools. These are the real source of
"lost dependency" pain, not pnpm:
- Any Python work happens in a project-local virtual environment only:
  .venv/ inside this project folder, via python -m venv .venv.
  NEVER install Python packages globally or into system/conda Python.
- Any system-level tool (ffmpeg, sox, etc.) must be installed via
  Homebrew, with the exact command reported to the user BEFORE running
  it: This needs ffmpeg for audio decoding. Run brew install ffmpeg —
  proceed once that's done? Never silently shell out to a system-wide
  install.
- Log every new system-level (Homebrew) dependency in AGENTS.md's
  System Dependencies section, so a full teardown has one place to
  check what to brew uninstall.

## Reporting
Any task-loop run that adds a dependency (JS or Python) states so
explicitly in CRITIQUE: package name, why it's needed, project-local vs.
Homebrew.

## The reset contract
A full project reset is always exactly:

rm -rf node_modules .next .venv pnpm-lock.yaml
pnpm install

If this stops being sufficient for a clean slate, that's a bug — flag it
in memory-decisions.md immediately rather than working around it.