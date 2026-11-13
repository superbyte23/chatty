import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, follows, posts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, ne, sql, ilike, or, and } from "drizzle-orm";

// GET users (search / explore)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");

    let whereClause = undefined;
    if (session) {
      whereClause = ne(users.id, session.id);
    }
    if (query) {
      const searchCondition = or(
        ilike(users.name, `%${query}%`),
        ilike(users.department, `%${query}%`),
        ilike(users.email, `%${query}%`)
      );
      whereClause = whereClause
        ? and(searchCondition, ne(users.id, session!.id))
        : searchCondition;
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        department: users.department,
        year: users.year,
        bio: users.bio,
        isOnline: users.isOnline,
        postCount: sql<number>`cast(count(distinct ${posts.id}) as int)`,
        followerCount: sql<number>`cast((SELECT count(*) FROM ${follows} f WHERE f.following_id = ${users.id}) as int)`,
        isFollowing: session
          ? sql<boolean>`EXISTS(SELECT 1 FROM ${follows} f WHERE f.follower_id = ${session.id} AND f.following_id = ${users.id})`
          : sql<boolean>`false`,
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.authorId))
      .where(whereClause)
      .groupBy(users.id)
      .limit(limit);

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
