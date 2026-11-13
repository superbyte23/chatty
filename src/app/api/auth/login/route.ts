import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  createToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const authHeaders = { "Cache-Control": "no-store, max-age=0" };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email address and password" },
        { status: 400, headers: authHeaders }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.query.users.findFirst({
      where: sql`lower(${users.email}) = ${email}`,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: authHeaders }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: authHeaders }
      );
    }

    // Set user online
    await db
      .update(users)
      .set({ isOnline: true, lastSeen: new Date() })
      .where(eq(users.id, user.id));

    const token = createToken(user.id);
    const isSecure = request.nextUrl.protocol === "https:";

    const response = NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        department: user.department,
        year: user.year,
        bio: user.bio,
        token,
      },
      { headers: authHeaders }
    );
    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions(isSecure)
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "We couldn't sign you in. Please try again." },
      { status: 500, headers: authHeaders }
    );
  }
}
