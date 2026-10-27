import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";

import { jsonError, withExtraHeaders } from "@/lib/api/json-error";
import { mergeResponseHeaders } from "@/lib/api/rate-limit-headers";
import { createOperatorMcpServer } from "@/lib/mcp/create-operator-mcp-server";
import { verifyOperatorRequest } from "@/lib/mcp/operator-auth";
import { consumeMcpRateLimit } from "@/lib/mcp/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const operatorDenied = (auth: ReturnType<typeof verifyOperatorRequest>) => {
  if (auth.ok) return null;
  if (auth.code === "not_configured")
    return jsonError({
      code: "operator_unavailable",
      message: "Operator MCP is not configured.",
      resolution: "Set OPERATOR_SECRET in the deployment environment.",
      status: 503,
    });
  return jsonError({
    code: "operator_unauthorized",
    message: "Operator credentials are invalid or missing.",
    resolution: "Send Authorization: Bearer <OPERATOR_SECRET> or X-Operator-Secret.",
    status: 401,
  });
};

const handleOperatorMcp = async (request: Request) => {
  const auth = verifyOperatorRequest(request);
  const denied = operatorDenied(auth);
  if (denied) return denied;

  const { headers: rateHeaders, limited } = consumeMcpRateLimit(request);
  if (limited) return mergeResponseHeaders(limited, rateHeaders);

  const server = createOperatorMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  try {
    const response = await transport.handleRequest(request);
    return mergeResponseHeaders(response, rateHeaders);
  } catch (error) {
    return withExtraHeaders(
      jsonError({
        code: "operator_mcp_handler_error",
        message: error instanceof Error ? error.message : "MCP request failed",
        resolution: "Verify JSON-RPC body and Accept headers for Streamable HTTP.",
        status: 500,
      }),
      rateHeaders,
    );
  } finally {
    await transport.close();
    await server.close();
  }
};

export const POST = handleOperatorMcp;
export const GET = handleOperatorMcp;
export const DELETE = handleOperatorMcp;
export const OPTIONS = () =>
  new Response(null, {
    headers: {
      Allow: "GET, POST, DELETE, OPTIONS",
    },
    status: 204,
  });
