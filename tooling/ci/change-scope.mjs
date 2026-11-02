#!/usr/bin/env node
// CI change scope: decides whether a pull request needs the full suite.
// Only Markdown at the repository root or under `docs/` counts as docs-only;
// anything else, an empty list, or an unreadable diff runs everything.
// Runs on the runner's preinstalled Node, before setup, so it uses builtins only.

import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { argv, env } from "node:process";

const docsOnlyPath = /^(?:docs\/.+|[^/]+)\.md$/u;

/** True when every changed path is root or `docs/` Markdown. */
export const isDocsOnly = (files) =>
  files.length > 0 && files.every((file) => docsOnlyPath.test(file));

/** Files a pull request merge commit changes against its base (first parent). */
const changedFiles = () =>
  execFileSync("git", ["diff", "--name-only", "HEAD^1", "HEAD"], { encoding: "utf-8" })
    .split("\n")
    .filter((line) => line.length > 0);

const scope = () => {
  if (env.GITHUB_EVENT_NAME !== "pull_request")
    return { full: true, reason: env.GITHUB_EVENT_NAME ?? "local run" };
  try {
    const files = changedFiles();
    return { full: !isDocsOnly(files), reason: `${files.length} changed file(s)` };
  } catch {
    return { full: true, reason: "diff unavailable" };
  }
};

if (argv[1] === import.meta.filename) {
  const { full, reason } = scope();
  console.log(`full=${full} (${reason})`);
  if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `full=${full}\n`);
}
