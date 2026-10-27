# flow-mono interoperability

**Canonical migration target:** [flow-skills spec 005](https://github.com/gaboesquivel/flow-skills/blob/main/docs/specs/005-flow-templates-interop.md). [Spec 003](https://github.com/gaboesquivel/flow-skills/blob/main/docs/specs/003-flow-templates-baseline-v2.md) is historical baseline evidence only.

The sections below describe **implemented behavior on `main`** shared with flow-next unless noted. They do **not** claim full spec 005 compliance or spec 005 release gates (REL).

## Monorepo layout

| Path                                  | Role                                                          |
| ------------------------------------- | ------------------------------------------------------------- |
| `apps/web`                            | Next.js app, MCP, GenUI Studio, HTTP APIs                     |
| `packages/ui`                         | Shared shadcn components and tokens                           |
| `agents/assistant`, `agents/operator` | Eve workspace agents (`withEve` `eveRoot` = repository root)  |
| `lib/agent-tools`                     | Shared Eve tool implementations (import `apps/web/lib/genui`) |

`packages/ts` may still be present; spec 005 PRD-6 removal is outstanding.

## Public routes

| Route    | Role                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| `/`      | Replaceable product homepage (minimal stub; adopters replace with their product landing) |
| `/genui` | Public GenUI playground (OpenUI compose + public MCP catalog demos)                      |
| `/dev`   | Developer links                                                                          |

## MCP

| Surface              | HTTP path           | Auth                                                                   |
| -------------------- | ------------------- | ---------------------------------------------------------------------- |
| Assistant (public)   | `/api/mcp`          | None                                                                   |
| Public alias         | `/mcp`              | None (same handler as `/api/mcp`)                                      |
| Operator (protected) | `/api/mcp/operator` | Bearer `OPERATOR_SECRET`, `X-Operator-Secret`, or operator web session |

MCP **server names** are template-specific (`flow-mono` / `flow-next` and `*-operator`); **tool names** match flow-next.

**Protocol note:** Contract tests negotiate MCP `2025-03-26`. Spec 005 target `2026-07-28` and MCP Apps release evidence are **not** claimed here.

## Public MCP tool names

- `health`
- `list_component_catalog`
- `compose_ui`

## Operator-only MCP tool names

- `operator_health`
- `config_status`
- `public_tool_catalog`

Public discovery must list **public** tools only.

## Operator authentication (implemented)

`OPERATOR_SECRET` (minimum 16 characters) protects `/operator`, `/api/operator/chat`, and `/api/mcp/operator`. Web console may use an HMAC session cookie after successful secret verification. **Fail closed** when unset or too short.

**Not implemented:** Operator OAuth/OIDC for web or MCP (spec 005 PROTO-3 / REL-3). Do not describe `OPERATOR_SECRET` as OIDC.

## Chat and inference

Public and Operator HTTP chat use **Vercel AI Gateway** when `AI_GATEWAY_API_KEY` is set. Optional `FLOW_ALLOW_DIRECT_ANTHROPIC=1` with `ANTHROPIC_API_KEY` is for local override only. GenUI offline demos work without credentials.

| Variable             | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `OPERATOR_SECRET`    | Enables Operator MCP and web console when ≥16 chars; fail-closed if unset |
| `AI_GATEWAY_API_KEY` | GenUI compose and HTTP chat via Vercel AI Gateway                         |
| `ANTHROPIC_API_KEY`  | Optional direct chat only with `FLOW_ALLOW_DIRECT_ANTHROPIC=1`            |
| `EVE_AGENT_MODEL`    | Eve default model override                                                |
| `TYPESAFE_API_KEY`   | Optional compose routing                                                  |
| `GENUI_MODEL`        | Optional compose model override                                           |

## Template differences

| Capability | flow-mono            | flow-next          |
| ---------- | -------------------- | ------------------ |
| Layout     | Turborepo `apps/web` | Single Next.js app |

Repositories are **independent** deployments; no runtime dependency between them.

## Spec 005 gaps (outstanding, non-exhaustive)

- Operator OAuth/OIDC (REL-3)
- MCP `2026-07-28` and embedded MCP Apps release evidence (PROTO-1, REL-4–REL-6)
- Full REL release gate evidence on production
- Studio-first public UX per PRD-2 (dogfood uses `/` + `/genui`; see [flow-skills decision 0011](https://github.com/gaboesquivel/flow-skills/blob/main/docs/decisions/0011-homepage-and-genui-playground.md))
