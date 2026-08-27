import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { describe, expect, it, beforeEach } from "vitest";
import { middleware } from "../middleware";

const secret = "middleware-test-secret";

async function createToken(role: "staff" | "attendee") {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(secret));
}

function createRequest(cookies: Record<string, string> = {}) {
  const request = new NextRequest("https://example.com/verify");
  Object.entries(cookies).forEach(([name, value]) => request.cookies.set(name, value));
  return request;
}

describe("Middleware Role-Redirect Integration Tests", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = secret;
  });

  it("redirects to /login?next=/verify when auth_token cookie is missing", async () => {
    const res = await middleware(createRequest());
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://example.com/login?next=%2Fverify");
  });

  it("passes through when valid auth_token and staff user_role are present", async () => {
    const token = await createToken("staff");
    const res = await middleware(createRequest({ auth_token: token, user_role: "staff" }));
    expect(res.status).toBe(200);
  });

  it("redirects attendee role from /verify to /dashboard", async () => {
    const token = await createToken("attendee");
    const res = await middleware(createRequest({ auth_token: token, user_role: "attendee" }));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://example.com/dashboard");
  });
});
