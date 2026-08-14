import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "rajagro_admin_token";
const DEV_JWT_SECRET = "raj-agro-secret-jwt-token-key-2026-production-change-me";

function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV !== "production") return DEV_JWT_SECRET;
  return "";
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyAdminToken(token: string) {
  const secret = getJwtSecret();
  if (!secret) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(`${header}.${payload}`)
    );

    if (!validSignature) return false;

    const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
    if (claims.exp && Date.now() >= claims.exp * 1000) return false;

    return claims.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authorized = token ? await verifyAdminToken(token) : false;

  if (!authorized && !isLoginRoute) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authorized && isLoginRoute) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
