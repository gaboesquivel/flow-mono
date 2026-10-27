# flow-mono

Minimal Turborepo template for agent-first Next.js apps: public Assistant (chat, MCP, OpenUI GenUI) and protected Operator diagnostics.

## Prerequisites

- Node.js 24+
- [pnpm](https://pnpm.io) 12.14 (see `packageManager` in `package.json`)

## Quick start

```bash
pnpm install
pnpm setup
pnpm dev
```

Open the Portless URL (typically `http://app.localhost:1355`).

## Scripts

| Script                | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `pnpm setup`          | Check env and create `.env.local` from examples |
| `pnpm setup:portless` | Trust Portless proxy                            |
| `pnpm dev`            | Dev server via Portless                         |
| `pnpm dev:app`        | Next.js only                                    |
| `pnpm qa`             | Lint, types, tests                              |
| `pnpm build`          | Production build                                |
| `pnpm eval`           | Offline GenUI matrix + Eve smoke evals          |

## Structure

- `apps/web` — Next.js app, MCP, GenUI, Eve agent tools
- `packages/ui` — shadcn `base-nova` components and tokens

## Operator access

Set `OPERATOR_SECRET` in the environment. Call protected routes with `Authorization: Bearer <secret>` or `X-Operator-Secret`. Without configuration, operator surfaces fail closed.

Public MCP: `POST /api/mcp`. Operator MCP: `POST /api/mcp/operator`.

## Deploy

Vercel-first; configure `apps/web` as the project root or use the included `vercel.json`.
