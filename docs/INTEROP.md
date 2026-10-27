# Interoperability (flow-mono)

Canonical contract: [flow-skills spec 005](https://github.com/gaboesquivel/flow-skills/blob/main/docs/specs/005-flow-templates-interop.md). Normative tool names and env matrices match [flow-next `docs/INTEROP.md`](https://github.com/gaboesquivel/flow-next/blob/main/docs/INTEROP.md) unless noted below.

## Monorepo layout

| Path                                  | Role                                                          |
| ------------------------------------- | ------------------------------------------------------------- |
| `apps/web`                            | Next.js app, MCP, GenUI Studio, HTTP APIs                     |
| `packages/ui`                         | Shared shadcn components and tokens                           |
| `agents/assistant`, `agents/operator` | Eve workspace agents (`withEve` `eveRoot` = repository root)  |
| `lib/agent-tools`                     | Shared Eve tool implementations (import `apps/web/lib/genui`) |

## Operator access

`OPERATOR_SECRET` (min 16 characters) protects `/operator`, `/api/operator/chat`, and `/api/mcp/operator`. Fail closed when unset.

## Chat and inference

Public and Operator HTTP chat use **Vercel AI Gateway** when `AI_GATEWAY_API_KEY` is set. Optional `FLOW_ALLOW_DIRECT_ANTHROPIC=1` with `ANTHROPIC_API_KEY` is for local override only.
