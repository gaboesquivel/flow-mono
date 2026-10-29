#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { exit } from "node:process";

export const parseNulPaths = (buffer) =>
  Buffer.from(buffer)
    .toString("utf-8")
    .split("\0")
    .filter((file) => file.length > 0);

const codePattern = /\.(?:[cm]?[jt]sx?|mjs)$/u;

const isVendoredAgentSkill = (file) => file.startsWith(".agents/skills/");

export const classifyStagedPaths = (paths) => {
  const code = [];
  for (const file of paths) {
    if (codePattern.test(file) && !isVendoredAgentSkill(file)) code.push(file);
  }
  return { code };
};

export const readStagedPaths = ({ cwd = process.cwd() } = {}) => {
  const result = spawnSync("git", ["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMR"], {
    cwd,
    encoding: "buffer",
  });
  if (result.status !== 0) return { ok: false, paths: [] };
  return { ok: true, paths: parseNulPaths(result.stdout) };
};

const run = ({ args, cmd }) => {
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  return result.status ?? 1;
};

export const stagedChecks = (paths) => {
  const { code } = classifyStagedPaths(paths);
  const checks = [];
  if (code.length > 0) {
    checks.push(
      {
        args: [...code],
        cmd: "oxlint",
        label: "oxlint staged",
      },
      {
        args: ["--check", "--no-error-on-unmatched-pattern", ...code],
        cmd: "oxfmt",
        label: "oxfmt staged",
      },
    );
  }
  return checks;
};

const main = () => {
  const { ok, paths } = readStagedPaths();
  if (!ok) {
    console.error("Could not read staged files.");
    exit(1);
  }
  if (paths.length === 0) exit(0);

  for (const check of stagedChecks(paths)) {
    const status = run(check);
    if (status !== 0) {
      console.error(`${check.label} failed.`);
      exit(status);
    }
  }
};

if (import.meta.url === `file://${process.argv[1]}`) main();
