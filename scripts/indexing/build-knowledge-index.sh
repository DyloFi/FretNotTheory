#!/usr/bin/env bash
# Regenerates blueprint/state/knowledge-index.json from front-matter in
# .agents/research/*.md. Run this after any research-spike brief is
# confirmed (see .agents/commands/research-spike.md Step 5).
set -euo pipefail
cd "$(dirname "$0")/../.."
node scripts/indexing/build-knowledge-index.js
