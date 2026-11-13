import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  createToken,
  getSessionCookieOptions,
  hashPassword,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const authHeaders = { "Cache-Control": "no-store, max-age=0" };

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  department: z.string().trim().optional(),
  year: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Please complete your name, a valid email, and a password of at least 6 characters.",
        },
        { status: 400, headers: authHeaders }
      );
    }

    const { name, email, password, department, year } = parsed.data;

    // Check if email already exists (case-insensitive)
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with that email already exists. Try signing in instead.",
        },
        { status: 409, headers: authHeaders }
      );
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        department: department || "",
        year: year || "",
        isOnline: true,
      })
      .returning();

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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "We couldn't create your account. Please try again." },
      { status: 500, headers: authHeaders }
    );
  }
}
