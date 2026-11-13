import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, follows, posts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql, and } from "drizzle-orm";

// GET user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    const userData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        department: users.department,
        year: users.year,
        bio: users.bio,
        isOnline: users.isOnline,
        createdAt: users.createdAt,
        postCount: sql<number>`cast(count(distinct ${posts.id}) as int)`,
        followerCount: sql<number>`cast((SELECT count(*) FROM ${follows} f WHERE f.following_id = ${users.id}) as int)`,
        followingCount: sql<number>`cast((SELECT count(*) FROM ${follows} f WHERE f.follower_id = ${users.id}) as int)`,
        isFollowing: session
          ? sql<boolean>`EXISTS(SELECT 1 FROM ${follows} f WHERE f.follower_id = ${session.id} AND f.following_id = ${users.id})`
          : sql<boolean>`false`,
        isOwn: session ? sql<boolean>`${users.id} = ${session.id}` : sql<boolean>`false`,
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.authorId))
      .where(eq(users.id, id))
      .groupBy(users.id);

    if (!userData.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData[0]);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, bio, department, year } = body;

    const [updated] = await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(department !== undefined && { department }),
        ...(year !== undefined && { year }),
      })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      avatarUrl: updated.avatarUrl,
      department: updated.department,
      year: updated.year,
      bio: updated.bio,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
