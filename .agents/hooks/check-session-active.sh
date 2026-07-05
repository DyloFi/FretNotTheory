#!/bin/bash
# Checks whether this thread ran session-start (marker file present).
# If yes: block the stop and tell the agent to run auto-memory first.
# If no: allow the stop immediately, no action taken.

MARKER=".agents/.session-active"

# Consume stdin safely without hanging if it is a pipe/redirect
if [ ! -t 0 ]; then
  read -t 1 -r -d '' _ || true
fi

if [ -f "$MARKER" ]; then
  rm -f "$MARKER"
  cat <<EOF
{
  "decision": "block",
  "reason": "This thread ran session-start. Before actually ending, run auto-memory: git diff + git log -5, append a dated entry to .agents/memory-decisions.md, update AGENTS.md if a convention changed, run a scope-check against Decided/Deferred scope, update .agents/pipeline-status.md, and report the result. Then stop."
}
EOF
else
  cat <<EOF
{
  "decision": "allow"
}
EOF
fi
