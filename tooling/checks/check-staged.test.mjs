import assert from "node:assert/strict";
import test from "node:test";

import { classifyStagedPaths, parseNulPaths, stagedChecks } from "./check-staged.mjs";

test("parses NUL-delimited paths", () => {
  assert.deepEqual(parseNulPaths(Buffer.from("a.ts\0b.mjs\0")), ["a.ts", "b.mjs"]);
});

test("classifies staged code files", () => {
  const groups = classifyStagedPaths(["apps/web/app/page.tsx", "README.md"]);
  assert.deepEqual(groups.code, ["apps/web/app/page.tsx"]);
});

test("staged checks run oxlint and oxfmt for code", () => {
  const checks = stagedChecks(["apps/web/lib/env.ts"]);
  assert.equal(checks.length, 2);
  assert.equal(checks[0]?.cmd, "oxlint");
  assert.equal(checks[1]?.cmd, "oxfmt");
});
