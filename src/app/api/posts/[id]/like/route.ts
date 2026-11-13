import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { likes } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// Toggle like
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.query.likes.findFirst({
      where: and(eq(likes.postId, id), eq(likes.userId, session.id)),
    });

    if (existing) {
      await db
        .delete(likes)
        .where(and(eq(likes.postId, id), eq(likes.userId, session.id)));
      return NextResponse.json({ liked: false });
    }

    await db.insert(likes).values({
      postId: id,
      userId: session.id,
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
