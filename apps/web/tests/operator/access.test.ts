import assert from "node:assert/strict";
import test from "node:test";

import { POST as postOperatorSession } from "../../app/api/operator/session/route";

test("operator session POST fails closed without OPERATOR_SECRET", async () => {
  const previous = process.env.OPERATOR_SECRET;
  delete process.env.OPERATOR_SECRET;
  try {
    const response = await postOperatorSession(
      new Request("http://app.localhost/api/operator/session", {
        body: JSON.stringify({ token: "anything" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );
    assert.equal(response.status, 503);
  } finally {
    if (previous !== undefined) process.env.OPERATOR_SECRET = previous;
  }
});
