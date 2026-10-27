import { verifyOperatorRequest as verifyAccess } from "@/lib/auth/operator-access";

export type OperatorAuthResult =
  | { ok: true }
  | { code: "not_configured" | "unauthorized"; ok: false };

export const verifyOperatorRequest = (request: Request): OperatorAuthResult => {
  const access = verifyAccess(request);
  if (access.ok) return { ok: true };
  if (access.reason === "disabled") return { code: "not_configured", ok: false };
  return { code: "unauthorized", ok: false };
};
