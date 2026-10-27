import { execSync } from "node:child_process";
import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..", "..");

const ensureEnv = ({ dest, example }) => {
  if (existsSync(dest)) return;
  if (existsSync(example)) {
    copyFileSync(example, dest);
    console.log(`Created ${path.relative(root, dest)} from example`);
    return;
  }
  writeFileSync(dest, "# Local overrides\n");
  console.log(`Created empty ${path.relative(root, dest)}`);
};

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 24) {
  console.warn(`Warning: Node ${process.version} — Node 24+ is recommended.`);
}

if (!existsSync(path.join(root, "node_modules"))) {
  console.log("Run pnpm install to install dependencies.");
}

ensureEnv({
  dest: path.join(root, ".env.local"),
  example: path.join(root, ".env.example"),
});
ensureEnv({
  dest: path.join(root, "apps/web/.env.local"),
  example: path.join(root, "apps/web/.env.example"),
});

const skipSkills =
  process.env.FLOW_SETUP_SKIP_SKILLS === "1" || process.env.FLOW_SETUP_SKIP_SKILLS === "true";

const agentsDir = path.join(root, ".agents");
if (!skipSkills && existsSync(path.join(agentsDir, "skills-lock.json"))) {
  if (!existsSync(path.join(agentsDir, "node_modules")))
    execSync("pnpm install", { cwd: agentsDir, stdio: "inherit" });
  execSync("pnpm skills:install", { cwd: agentsDir, stdio: "inherit" });
}

console.log("Setup complete.");
