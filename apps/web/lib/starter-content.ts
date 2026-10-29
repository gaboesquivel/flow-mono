export const starterHomeMarkdown = `# Flow Mono

Turborepo template with MCP-first APIs, OpenUI GenUI, and agent discovery surfaces.

## Capabilities

- **Web:** prompt-driven UI generation with OpenUI Lang and shadcn components (\`POST /api/genui/compose\`).
- **Chat:** public assistant at \`/api/chat\` (optional \`ANTHROPIC_API_KEY\`).
- **MCP (Assistant):** Streamable HTTP at \`/api/mcp\` — \`health\`, \`list_component_catalog\`, \`compose_ui\`.
- **MCP (Operator):** \`/api/mcp/operator\` when \`OPERATOR_SECRET\` is set (diagnostics only; fail-closed otherwise).
- **Discovery:** \`llms.txt\`, \`.well-known/mcp/*\`, OpenAPI at \`/openapi.json\`.

## Quick start

1. \`pnpm install\` and \`pnpm setup\`.
2. Optional: \`AI_GATEWAY_API_KEY\` for open-ended generation outside Vercel (on Vercel, OIDC authenticates the AI Gateway).
3. \`pnpm dev\` and open the home page. The GenUI playground is at \`/genui\`.
4. Try: "customer support dashboard" or "template capability overview".

No database or login is required for the demo.
`;
