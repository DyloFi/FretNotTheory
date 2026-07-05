---
name: TypeScript Standards
activation: glob
glob: "{app,components,lib}/**/*.{ts,tsx}"
---

# TypeScript Standards

## Tool Commands
- Build: `pnpm build`
- Lint: `pnpm lint`
- Dev: `pnpm dev`

## Architecture Rules
- Use TypeScript strict mode (already set in tsconfig.json). Never use `any`.
- Don't hand-edit generated shadcn components in `/components/ui` — regenerate or wrap them.
- Supabase client: only ever import from `lib/supabase.ts`, never instantiate a second client.

## Lessons Learned (Compounding Memory)
- (append here as bugs get fixed — same pattern as memory-decisions.md, but scoped to TS files only)
