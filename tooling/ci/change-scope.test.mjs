import assert from "node:assert/strict";
import test from "node:test";

import { isDocsOnly } from "./change-scope.mjs";

test("root and docs/ Markdown skip the full suite", () => {
  assert.equal(isDocsOnly(["README.md"]), true);
  assert.equal(isDocsOnly(["AGENTS.md", "docs/INTEROP.md", "docs/specs/001-x.md"]), true);
});

test("an empty change list runs the full suite", () => {
  assert.equal(isDocsOnly([]), false);
});

test("code, config, or workflow changes run the full suite", () => {
  for (const file of [
    "package.json",
    "pnpm-lock.yaml",
    ".github/workflows/ci.yml",
    "apps/web/app/page.tsx",
    "tooling/ci/change-scope.mjs",
  ])
    assert.equal(isDocsOnly(["README.md", file]), false, file);
});

test("Markdown that code or tests read runs the full suite", () => {
  for (const file of [
    ".agents/skills/build/SKILL.md",
    ".claude/skills/build/SKILL.md",
    "agents/assistant/instructions.md",
    "apps/web/AGENTS.md",
    "packages/ui/README.md",
    "docs/diagram.png",
    "notes.mdx",
  ])
    assert.equal(isDocsOnly([file]), false, file);
});
