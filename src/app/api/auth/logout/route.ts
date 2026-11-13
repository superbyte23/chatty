import { NextResponse } from "next/server";
import { clearSession, getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await db
        .update(users)
        .set({ isOnline: false, lastSeen: new Date() })
        .where(eq(users.id, session.id));
    }
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
