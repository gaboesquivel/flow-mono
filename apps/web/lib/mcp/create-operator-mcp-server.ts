import { McpServer } from "@modelcontextprotocol/server";

import { registerOperatorMcpTools } from "./register-operator-tools";

export const createOperatorMcpServer = () => {
  const server = new McpServer({
    name: "flow-mono-operator",
    version: "1.0.0",
  });

  registerOperatorMcpTools(server);
  return server;
};
