# Agent skills (template bundle)

This template ships a curated [Agent Skills](https://agentskills.io) lockfile for the stack in [baseline v2](https://github.com/gaboesquivel/flow-skills/blob/main/docs/specs/003-flow-templates-baseline-v2.md): Next.js, React, Eve, AI SDK / Gateway, OpenUI GenUI, MCP, shadcn, Vitest, Playwright, Portless, Turborepo, and Matt Pocock engineering skills for specs and implementation.

This is **not** the [Flow Skills](https://github.com/gaboesquivel/flow-skills) methodology catalog.

## Layout

| Path | Purpose |
| --- | --- |
| `.agents/skills-lock.json` | Pinned upstream skills and hashes |
| `.agents/skills/<name>/` | Symlinks for agents (after install) |
| `.agents/.agents/skills/<name>/` | Vendored skill trees (committed in the template) |

## Commands

```bash
pnpm skills:install   # refresh from lock (also runs in pnpm setup)
pnpm skills:update    # bump lock from upstream (maintainers)
```

After install, invoke skills explicitly in your agent host (for example `/to-spec`, or open `.agents/skills/eve/SKILL.md`).

## Curated skills

Same as [flow-next `docs/agent-skills.md`](https://github.com/gaboesquivel/flow-next/blob/main/docs/agent-skills.md), plus **`turborepo`** for monorepo layout.
