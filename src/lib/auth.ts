import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const DEV_JWT_SECRET = "raj-agro-secret-jwt-token-key-2026-production-change-me";
const AUTH_COOKIE_NAME = "rajagro_admin_token";

function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV !== "production") return DEV_JWT_SECRET;
  throw new Error("JWT_SECRET must be configured in production.");
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function requireAdminAuth(req?: NextRequest): Promise<{ authorized: boolean; payload?: JWTPayload; response?: NextResponse }> {
  let token: string | undefined;

  if (req) {
    // Check Authorization Header or Cookie
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    }
  } else {
    const session = await getAuthSession();
    if (session && session.role === "ADMIN") {
      return { authorized: true, payload: session };
    }
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized access" }, { status: 401 }),
    };
  }

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Authentication token missing" }, { status: 401 }),
    };
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Invalid or expired authorization token" }, { status: 401 }),
    };
  }

  return { authorized: true, payload };
}
