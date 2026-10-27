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

console.log("Setup complete.");
