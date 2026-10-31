# flow-mono

Minimal Turborepo template for agent-first Next.js apps: public Assistant (chat, MCP, OpenUI GenUI) and protected Operator diagnostics.

## Prerequisites

- Node.js 24+
- [pnpm](https://pnpm.io) 12.14 (see `packageManager` in `package.json`)

## Quick start

```bash
gh repo create my-app --private --template gaboesquivel/flow-mono --clone
cd my-app
pnpm setup
```

Then ask your agent to `/start` (or say "start a new project"): Flow's skills ship in this repository, so it defines the product, renames the template, and makes the initial commit. Run `pnpm dev` and open the Portless URL (typically `app.localhost`).

**First deployment.** Import the repository in [Vercel](https://vercel.com/new) with `apps/web` as the root directory; every push to `main` deploys. No environment variables are required: without `AI_GATEWAY_API_KEY` generation falls back to built-in content, and Operator stays closed until `OPERATOR_SECRET` is set. For a database, run setup with `FLOW_PRESET=neon` (needs `NEON_API_KEY` and `VERCEL_TOKEN`); production builds apply the schema.

## Scripts

| Script                | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `pnpm setup`          | Dependencies, `.env.local` files, optional Neon |
| `pnpm setup:portless` | Trust Portless proxy                            |
| `pnpm dev`            | Dev server via Portless                         |
| `pnpm dev:app`        | Next.js only                                    |
| `pnpm qa`             | Lint, types, tests                              |
| `pnpm format`         | Format files in place (CI only checks)          |
| `pnpm build`          | Production build                                |
| `pnpm eval`           | Offline GenUI matrix + Eve smoke evals          |

## Structure

- `apps/web` — Next.js app, MCP, GenUI, Eve agent tools
- `packages/ui` — shadcn `base-nova` components and tokens

## Operator access

Set `OPERATOR_SECRET` in the environment (minimum 16 characters). Call protected routes with `Authorization: Bearer <secret>` or `X-Operator-Secret`, or use `/operator/access` for the web console. Without configuration, operator surfaces fail closed.

- **Assistant** — `/`, `/genui`, `/api/chat`, `/api/mcp`, `/mcp`
- **Operator** — `/operator`, `/api/operator/chat`, `/api/mcp/operator`

Cross-template contract: [docs/INTEROP.md](./docs/INTEROP.md).

Agent skills: [docs/agent-skills.md](./docs/agent-skills.md).

## Deploy

Vercel-first; the project root is `apps/web`, whose `vercel.json` installs from the workspace root and runs `scripts/vercel-build.mjs` (schema on production builds with `DATABASE_URL`, then the web build).
