# Agent instructions

pnpm and Turborepo monorepo: a Next.js app, a shared UI package, and eve agents. Node 24+, pnpm from `packageManager`.

## Layout

| Path          | Holds                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `apps/web`    | Next.js app (Vercel project root). Read [`apps/web/AGENTS.md`](apps/web/AGENTS.md) before editing it. |
| `packages/ui` | Shared shadcn/ui components, hooks, and styles                                                        |
| `agents/`     | eve backend agents (`assistant`, `operator`)                                                          |
| `tooling/`    | Setup and security scripts                                                                            |

## Commands

| Command               | Does                                                         |
| --------------------- | ------------------------------------------------------------ |
| `pnpm setup`          | Install, create env files, restore skills, apply data preset |
| `pnpm dev`            | Run the web app through portless                             |
| `pnpm build`          | Build every package (Turborepo)                              |
| `pnpm lint`           | oxlint and oxfmt check                                       |
| `pnpm lint:fix`       | Fix lint and formatting                                      |
| `pnpm check-types`    | Type-check every package                                     |
| `pnpm test`           | Web tests and tooling tests                                  |
| `pnpm qa`             | `lint`, `check-types`, and `test`                            |
| `pnpm security:check` | Tracked secret-file check and dependency audit               |
| `pnpm db:migrate`     | Push the Drizzle schema (asks first)                         |
| `pnpm eval`           | Model evals; on demand only, never in CI                     |
| `pnpm skills:update`  | Refresh skills from their sources                            |

## Tools

Do the work yourself: CLI, then MCP, then API, then browser. Hand the user only sign-in, secrets, payment, or consent.

## Context and skills

- Product context lives in root `PRODUCT.md`, `DESIGN.md`, `GLOSSARY.md`, and `ARCHITECTURE.md` once Flow writes them.
- Flow and stack skills are committed under `.agents/skills`; `.claude/skills` links to it. See [docs/agent-skills.md](docs/agent-skills.md).
- Delivery: one draft pull request per spec on `spec/<number>-<slug>`. Drafts run no CI and no preview; marking it ready runs the checks (Flow `build` and `ship`).
- No git hooks; secret and security checks run in ready-PR CI.
