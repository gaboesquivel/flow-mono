# flow-mono ↔ flow-next interoperability contract

Both templates implement [Flow Templates baseline v2](https://github.com/gaboesquivel/flow-skills/blob/main/docs/specs/003-flow-templates-baseline-v2.md). Canonical copy is maintained in both repos; update them together.

See [flow-next `docs/INTEROP.md`](https://github.com/gaboesquivel/flow-next/blob/main/docs/INTEROP.md) for the full contract (MCP paths, shared tool names, environment variables, and template differences).

**flow-mono notes:** Operator is MCP-only today (`POST /api/mcp/operator` with `OPERATOR_SECRET`). Protected web chat and `/operator` UI live in **flow-next** until added here.
