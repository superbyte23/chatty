import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { follows, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// Toggle follow
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId || userId === session.id) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    const existing = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, session.id),
        eq(follows.followingId, userId)
      ),
    });

    if (existing) {
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, session.id),
            eq(follows.followingId, userId)
          )
        );
      return NextResponse.json({ following: false });
    }

    await db.insert(follows).values({
      followerId: session.id,
      followingId: userId,
    });

    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET followers/following for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "followers"; // 'followers' | 'following'

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    let data;
    if (type === "followers") {
      data = await db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          department: users.department,
          bio: users.bio,
          isOnline: users.isOnline,
        })
        .from(follows)
        .innerJoin(users, eq(follows.followerId, users.id))
        .where(eq(follows.followingId, userId));
    } else {
      data = await db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          department: users.department,
          bio: users.bio,
          isOnline: users.isOnline,
        })
        .from(follows)
        .innerJoin(users, eq(follows.followingId, users.id))
        .where(eq(follows.followerId, userId));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get follows error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
