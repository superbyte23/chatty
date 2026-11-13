import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, or, and, desc, sql } from "drizzle-orm";

// GET conversations list
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all unique conversations with last message
    const conversations = await db.execute(sql`
      WITH ranked_messages AS (
        SELECT
          m.*,
          ROW_NUMBER() OVER (
            PARTITION BY
              CASE
                WHEN m.sender_id = ${session.id} THEN m.receiver_id
                ELSE m.sender_id
              END
            ORDER BY m.created_at DESC
          ) as rn,
          CASE
            WHEN m.sender_id = ${session.id} THEN m.receiver_id
            ELSE m.sender_id
          END as other_user_id
        FROM messages m
        WHERE m.sender_id = ${session.id} OR m.receiver_id = ${session.id}
      )
      SELECT
        rm.id,
        rm.content,
        rm.created_at as "createdAt",
        rm.is_read as "isRead",
        rm.sender_id as "senderId",
        rm.receiver_id as "receiverId",
        rm.other_user_id as "otherUserId",
        u.name as "otherUserName",
        u.avatar_url as "otherUserAvatar",
        u.is_online as "otherUserOnline"
      FROM ranked_messages rm
      JOIN users u ON u.id = rm.other_user_id
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC
    `);

    // Get unread counts
    const unreadCounts = await db.execute(sql`
      SELECT
        sender_id as "senderId",
        count(*)::int as "unreadCount"
      FROM messages
      WHERE receiver_id = ${session.id} AND is_read = false
      GROUP BY sender_id
    `);

    const unreadMap = new Map(
      (unreadCounts.rows as Array<{ senderId: string; unreadCount: number }>).map((r) => [
        r.senderId,
        r.unreadCount,
      ])
    );

    const result = (conversations.rows as Array<Record<string, unknown>>).map((c) => ({
      ...c,
      unreadCount: unreadMap.get(c.otherUserId as string) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// SEND message
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content?.trim()) {
      return NextResponse.json(
        { error: "Receiver and content required" },
        { status: 400 }
      );
    }

    const [message] = await db
      .insert(messages)
      .values({
        senderId: session.id,
        receiverId,
        content: content.trim(),
      })
      .returning();

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
