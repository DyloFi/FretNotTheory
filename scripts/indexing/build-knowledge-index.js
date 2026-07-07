#!/usr/bin/env node
/**
 * Scans .agents/research/*.md for a leading YAML-ish front-matter block:
 *
 *   ---
 *   topic: Short Topic Name
 *   tags: [tag-one, tag-two]
 *   status: confirmed
 *   decided_date: 2026-07-06
 *   summary: One or two sentence recommendation.
 *   ---
 *
 * and regenerates blueprint/state/knowledge-index.json from it.
 * No dependencies (no js-yaml) - the format above is intentionally simple
 * enough for a small hand-rolled parser. If a brief has no front-matter,
 * it's skipped with a warning, not guessed at.
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = process.cwd();
const RESEARCH_DIR = path.join(REPO_ROOT, ".agents", "research");
const OUT_PATH = path.join(REPO_ROOT, "blueprint", "state", "knowledge-index.json");

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const entry = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    let val = rawVal.trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    entry[key] = val;
  }
  return entry;
}

function main() {
  if (!fs.existsSync(RESEARCH_DIR)) {
    console.warn(`No ${RESEARCH_DIR} directory found - writing empty index.`);
    fs.writeFileSync(OUT_PATH, "[]\n");
    return;
  }

  const files = fs
    .readdirSync(RESEARCH_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const index = [];
  for (const file of files) {
    const fullPath = path.join(RESEARCH_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const fm = parseFrontMatter(raw);
    if (!fm) {
      console.warn(`Skipping ${file}: no front-matter block found.`);
      continue;
    }
    const required = ["topic", "tags", "status", "decided_date", "summary"];
    const missing = required.filter((k) => !(k in fm));
    if (missing.length) {
      console.warn(`Skipping ${file}: missing front-matter field(s): ${missing.join(", ")}`);
      continue;
    }
    index.push({
      topic: fm.topic,
      tags: Array.isArray(fm.tags) ? fm.tags : [fm.tags],
      brief_path: path.join(".agents", "research", file),
      decided_date: fm.decided_date,
      status: fm.status,
      summary: fm.summary,
    });
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + "\n");
  console.log(`Wrote ${index.length} entr${index.length === 1 ? "y" : "ies"} to ${path.relative(REPO_ROOT, OUT_PATH)}`);
}

main();
