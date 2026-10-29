import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { applyDataPreset, readDatabaseUrl, upsertEnvLine } from "./data-preset.mjs";

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

const appEnvFile = path.join(root, "apps/web/.env.local");
const appEnvText = existsSync(appEnvFile) ? readFileSync(appEnvFile, "utf-8") : "";
const linkFile = path.join(root, ".vercel/project.json");
const link = existsSync(linkFile) ? JSON.parse(readFileSync(linkFile, "utf-8")) : {};
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8"));
const preset = await applyDataPreset({
  env: process.env,
  local: {
    databaseUrl: readDatabaseUrl(appEnvText),
    vercelOrgId: link.orgId,
    vercelProjectId: link.projectId,
  },
  preset: process.env.FLOW_PRESET ?? "minimal",
  projectName: pkg.name,
});
if (!preset.ok) {
  console.error(preset.error);
  process.exit(1);
}
if (preset.databaseUrl) {
  const next = upsertEnvLine({
    key: "DATABASE_URL",
    text: existsSync(appEnvFile) ? readFileSync(appEnvFile, "utf-8") : appEnvText,
    value: preset.databaseUrl,
  });
  if (next.changed) writeFileSync(appEnvFile, next.text);
}
if (preset.vercel) {
  mkdirSync(path.dirname(linkFile), { recursive: true });
  writeFileSync(
    linkFile,
    `${JSON.stringify({ orgId: preset.vercel.orgId, projectId: preset.vercel.projectId }, null, 2)}\n`,
  );
}
if (preset.preset === "neon")
  console.log(preset.reused ? "neon preset reused" : "neon preset configured");

console.log("Setup complete.");
