#!/bin/bash
set -e
echo "Resetting project to clean slate..."
rm -rf node_modules .next .venv pnpm-lock.yaml
pnpm install
echo "Done. If this didn't fix it, the problem isn't dependencies."
