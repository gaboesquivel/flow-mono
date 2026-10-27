export type OperatorAuthResult =
  | { ok: true }
  | { code: "not_configured" | "unauthorized"; ok: false };

export const verifyOperatorRequest = (request: Request): OperatorAuthResult => {
  const secret = process.env.OPERATOR_SECRET?.trim();
  if (!secret) return { code: "not_configured", ok: false };

  const authorization = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-operator-secret");
  const bearer =
    authorization?.startsWith("Bearer ") === true
      ? authorization.slice("Bearer ".length).trim()
      : null;
  const token = bearer ?? headerSecret?.trim() ?? "";

  if (!token || token !== secret) return { code: "unauthorized", ok: false };
  return { ok: true };
};
