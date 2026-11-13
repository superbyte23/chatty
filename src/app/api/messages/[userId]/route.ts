import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, or, desc, sql } from "drizzle-orm";

// GET message thread with a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const thread = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        isRead: messages.isRead,
        senderName: sql<string>`sender.name`,
        senderAvatar: sql<string>`sender.avatar_url`,
      })
      .from(messages)
      .innerJoin(
        sql`users sender ON sender.id = ${messages.senderId}`,
        sql`true`
      )
      .where(
        or(
          and(
            eq(messages.senderId, session.id),
            eq(messages.receiverId, userId)
          ),
          and(
            eq(messages.senderId, userId),
            eq(messages.receiverId, session.id)
          )
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    // Mark messages as read
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(eq(messages.senderId, userId), eq(messages.receiverId, session.id))
      );

    // Get other user info
    const otherUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        avatarUrl: true,
        isOnline: true,
      },
    });

    return NextResponse.json({ messages: thread.reverse(), user: otherUser });
  } catch (error) {
    console.error("Get thread error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
