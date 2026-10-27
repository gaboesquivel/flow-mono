# flow-mono ↔ flow-next interoperability contract

Both templates implement [Flow Templates baseline v2](https://github.com/gaboesquivel/flow-skills/blob/main/docs/specs/003-flow-templates-baseline-v2.md). Canonical copy is maintained in both repos; update them together.

See [flow-next `docs/INTEROP.md`](https://github.com/gaboesquivel/flow-next/blob/main/docs/INTEROP.md) for the full contract (MCP paths, shared tool names, environment variables, and template differences).

Both templates expose `/operator`, `/api/operator/chat`, and `/api/mcp/operator` behind the same `OPERATOR_SECRET` contract.
