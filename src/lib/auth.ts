import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "kcc-chat-secret";
export const SESSION_COOKIE_NAME = "kcc_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  department: string;
  year: string;
  bio: string;
}

export function getSessionCookieOptions(isSecure: boolean) {
  return {
    httpOnly: true,
    secure: isSecure,
    // "none" allows the cookie to work inside embedded preview iframes over
    // HTTPS; "lax" is used as a safe fallback when the connection is HTTP.
    sameSite: isSecure ? ("none" as const) : ("lax" as const),
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

/**
 * Reads the active session token from either the httpOnly cookie or an
 * `Authorization: Bearer <token>` header. Supporting both means authentication
 * keeps working in embedded preview iframes where cookies can be blocked.
 */
async function readSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (cookieToken) return cookieToken;
  } catch {
    // cookies() can throw when there is no request context; ignore.
  }

  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  } catch {
    // headers() can throw when there is no request context; ignore.
  }

  return null;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const token = await readSessionToken();
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
      columns: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        department: true,
        year: true,
        bio: true,
      },
    });

    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? "",
      department: user.department ?? "",
      year: user.year ?? "",
      bio: user.bio ?? "",
    };
  } catch {
    return null;
  }
}

export async function setSession(userId: string, isSecure = true) {
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    createToken(userId),
    getSessionCookieOptions(isSecure)
  );
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
