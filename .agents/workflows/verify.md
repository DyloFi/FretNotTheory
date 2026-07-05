---
name: verify
description: "Build and lint, self-healing any failures. No test step until a test runner is actually added."
---

1. Run `pnpm build`.
   - If it fails, read the compiler/build output, locate the responsible file, fix it, and rebuild.
   - Repeat until the build is clean.
2. Run `pnpm lint`.
   - Fix any reported issues and re-run until there are zero warnings.
3. Report what was fixed, if anything, before ending.

Note: no test step — this project has no test script or test runner configured yet.
If one gets added later, insert a test step here between build and lint.
