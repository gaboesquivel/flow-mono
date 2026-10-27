import assert from "node:assert/strict";
import test from "node:test";

import { POST as postOperatorMcp } from "../../app/api/mcp/operator/route";
import { operatorMcpToolNames } from "../../lib/mcp/register-operator-tools";

const mcpHeaders = {
  Accept: "application/json, text/event-stream",
  "Content-Type": "application/json",
};

const mcpPost = (body: unknown, extraHeaders: Record<string, string> = {}) =>
  postOperatorMcp(
    new Request("http://app.localhost/api/mcp/operator", {
      body: JSON.stringify(body),
      headers: { ...mcpHeaders, ...extraHeaders },
      method: "POST",
    }),
  );

test("operator MCP fails closed when OPERATOR_SECRET is unset", async () => {
  const previous = process.env.OPERATOR_SECRET;
  delete process.env.OPERATOR_SECRET;
  try {
    const response = await mcpPost({
      id: 1,
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        capabilities: {},
        clientInfo: { name: "operator-test", version: "1.0.0" },
        protocolVersion: "2025-03-26",
      },
    });
    assert.equal(response.status, 503);
  } finally {
    if (previous !== undefined) process.env.OPERATOR_SECRET = previous;
  }
});

test("operator MCP rejects missing credentials when secret is set", async () => {
  const previous = process.env.OPERATOR_SECRET;
  process.env.OPERATOR_SECRET = "test-operator-secret";
  try {
    const response = await mcpPost({
      id: 2,
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        capabilities: {},
        clientInfo: { name: "operator-test", version: "1.0.0" },
        protocolVersion: "2025-03-26",
      },
    });
    assert.equal(response.status, 401);
  } finally {
    if (previous === undefined) delete process.env.OPERATOR_SECRET;
    else process.env.OPERATOR_SECRET = previous;
  }
});

test("operator MCP lists operator-only tools when authorized", async () => {
  const previous = process.env.OPERATOR_SECRET;
  process.env.OPERATOR_SECRET = "test-operator-secret";
  try {
    const response = await mcpPost(
      {
        id: 3,
        jsonrpc: "2.0",
        method: "tools/list",
        params: {},
      },
      { Authorization: "Bearer test-operator-secret" },
    );
    assert.equal(response.status, 200);
    const json = (await response.json()) as {
      result?: { tools?: { name: string }[] };
    };
    const names = (json.result?.tools ?? []).map((tool) => tool.name).toSorted();
    assert.deepEqual(names, [...operatorMcpToolNames].toSorted());
    assert.equal((names as string[]).includes("compose_ui"), false);
  } finally {
    if (previous === undefined) delete process.env.OPERATOR_SECRET;
    else process.env.OPERATOR_SECRET = previous;
  }
});
