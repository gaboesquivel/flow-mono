import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { removeStaleHooks } from "./stale-hooks.mjs";

const simpleGitHook = `#!/bin/sh
if [ "$SKIP_SIMPLE_GIT_HOOKS" = "1" ]; then
    exit 0
fi
pnpm run hooks:pre-commit
`;

const withHooksDir = (run) => {
  const dir = mkdtempSync(path.join(tmpdir(), "stale-hooks-"));
  try {
    run(dir);
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
};

test("removeStaleHooks deletes simple-git-hooks pre-commit and pre-push", () => {
  withHooksDir((dir) => {
    writeFileSync(path.join(dir, "pre-commit"), simpleGitHook);
    writeFileSync(path.join(dir, "pre-push"), simpleGitHook);
    assert.deepEqual(removeStaleHooks(dir), ["pre-commit", "pre-push"]);
    assert.equal(existsSync(path.join(dir, "pre-commit")), false);
    assert.equal(existsSync(path.join(dir, "pre-push")), false);
  });
});

test("removeStaleHooks keeps hooks it did not install", () => {
  withHooksDir((dir) => {
    writeFileSync(path.join(dir, "pre-commit"), "#!/bin/sh\nnpx lint-staged\n");
    writeFileSync(path.join(dir, "pre-commit.sample"), simpleGitHook);
    writeFileSync(path.join(dir, "commit-msg"), simpleGitHook);
    assert.deepEqual(removeStaleHooks(dir), []);
    assert.equal(existsSync(path.join(dir, "pre-commit")), true);
    assert.equal(existsSync(path.join(dir, "pre-commit.sample")), true);
    assert.equal(existsSync(path.join(dir, "commit-msg")), true);
  });
});

test("removeStaleHooks tolerates a missing hooks directory", () => {
  withHooksDir((dir) => {
    assert.deepEqual(removeStaleHooks(path.join(dir, "missing")), []);
  });
});
