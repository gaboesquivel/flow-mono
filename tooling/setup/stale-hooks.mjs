import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

// Hooks the removed simple-git-hooks setup installed; it marked each with SKIP_SIMPLE_GIT_HOOKS.
const hookNames = ["pre-commit", "pre-push"];
const marker = "SKIP_SIMPLE_GIT_HOOKS";

// Deletes simple-git-hooks hooks so an old clone stops calling removed scripts; other hooks stay.
export const removeStaleHooks = (hooksDir) => {
  const removed = [];
  for (const name of hookNames) {
    const file = path.join(hooksDir, name);
    if (!existsSync(file) || !readFileSync(file, "utf-8").includes(marker)) continue;
    rmSync(file);
    removed.push(name);
  }
  return removed;
};
