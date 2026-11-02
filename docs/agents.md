# Eve agent runtime

Flow defines **how** teams build (skills under `.agents/skills/`). [Vercel Eve](https://vercel.com/eve) is the **default agent runtime** for durable product agents in this template. Official Eve docs ship in `node_modules/eve/docs/` (from the workspace root or `apps/web`) and match the pinned `eve` version in the root `package.json`.

## Layout

| Path                         | Role                                                                  |
| ---------------------------- | --------------------------------------------------------------------- |
| `agents/assistant/`          | Public Eve app: GenUI tools and demo data                             |
| `agents/operator/`           | Protected Eve app: same tools plus operator diagnostics               |
| `lib/agent-tools/`           | Shared typed tool implementations (`defineTool`)                      |
| `lib/agent-instrumentation/` | Shared OpenTelemetry policy for both Eve apps                         |
| `apps/web/next.config.ts`    | `withEve(config, { eveRoot: "../.." })` mounts Eve into Next.js       |
| `.agents/skills/`            | Flow methodology and stack skills for IDE hosts (not copied into Eve) |

Each Eve app follows Eve conventions: `agent/agent.ts`, `agent/instructions.md`, `agent/tools/*.ts`, optional `agent/instrumentation/`.

## What runs where

| Surface                                   | Runtime                          | Purpose                                                |
| ----------------------------------------- | -------------------------------- | ------------------------------------------------------ |
| `/api/mcp`, `/mcp`                        | MCP SDK + shared compose helpers | Streamable HTTP tools and MCP Apps preview for interop |
| `/api/chat`                               | Vercel AI SDK `streamText`       | Lightweight sidebar chat without a full agent loop     |
| `/api/operator/chat`, `/api/mcp/operator` | AI SDK chat + MCP with auth      | Operator diagnostics (see [INTEROP.md](./INTEROP.md))  |
| Eve sessions (CLI / future channels)      | Eve workflow                     | Durable turns, tool approval, subagents, schedules     |

Do not add a second agent framework. Extend Eve for agentic behavior; use the AI SDK only where streaming or structured output is enough.

## Local development

```bash
pnpm dev                 # Next.js via Portless (from repo root)
pnpm build:agents        # eve build for each agents/* workspace
```

Work on one agent interactively:

```bash
cd agents/assistant
pnpm exec eve dev        # TUI, approvals, /traces
```

Model credentials: Gateway (`AI_GATEWAY_API_KEY` or Vercel OIDC on deploy), or `/login` in the Eve TUI. Override models with `EVE_AGENT_MODEL` and `EVE_OPERATOR_MODEL` (Gateway ids). For a fully local model, author a direct `LanguageModel` in `agent/agent.ts` per [Eve agent config](https://vercel.com/eve) (for example an OpenAI-compatible endpoint).

Optional zero-cost HTTP chat without Gateway: set `ANTHROPIC_API_KEY` where `apps/web/lib/ai/resolve-chat-model.ts` allows direct access (see that module and `.env.example`).

## Observability

- **Local:** `eve dev` records traces by default. Use `/traces` in the TUI or the local trace viewer Eve opens.
- **Hosted:** Vercel Agent Runs and AI Gateway session grouping when `apps/web` is deployed on Vercel.
- **OpenTelemetry:** `agent/instrumentation/otel.ts` in each app re-exports `lib/agent-instrumentation/otel.ts`. Prompt and tool payloads are captured only in `development` by default. Add `otelIntegration()` per Eve docs for third-party export—no custom dashboard in the template.

## Privacy and security

Traces and hosted run logs can include prompts, tool arguments, and tool results when capture policy allows. Operator MCP and web surfaces require `OPERATOR_SECRET` (≥16 characters) and **fail closed** when unset. The Operator Eve agent requires human approval the first time `generate_demo_data` runs in a session.

Never commit `.env.local`, API keys, or operator secrets.

## Commands

| Command     | What it checks                           |
| ----------- | ---------------------------------------- |
| `pnpm eval` | Offline GenUI matrix + Eve tool smoke    |
| `pnpm qa`   | Lint, types, unit tests (no live models) |

## Further reading

- [INTEROP.md](./INTEROP.md) — MCP tool names and auth contract with flow-next
- [agent-skills.md](./agent-skills.md) — Flow Skills layout
- [flow-skills decision 0061](https://github.com/gaboesquivel/flow-skills/blob/main/docs/decisions/0061-eve-default-agent-runtime.md)
