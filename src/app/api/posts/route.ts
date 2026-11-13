import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users, likes, comments } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc, sql, and } from "drizzle-orm";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
  imageUrl: z.string().optional(),
});

// GET all posts (feed)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const postsData = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorName: users.name,
        authorAvatar: users.avatarUrl,
        authorDepartment: users.department,
        authorYear: users.year,
        likeCount: sql<number>`cast(count(distinct ${likes.id}) as int)`,
        commentCount: sql<number>`cast(count(distinct ${comments.id}) as int)`,
        userLiked: session
          ? sql<boolean>`bool_or(${likes.userId} = ${session.id})`
          : sql<boolean>`false`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(userId ? eq(posts.authorId, userId) : undefined)
      .groupBy(posts.id, users.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(postsData);
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// CREATE a post
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [post] = await db
      .insert(posts)
      .values({
        authorId: session.id,
        content: parsed.data.content,
        imageUrl: parsed.data.imageUrl,
      })
      .returning();

    return NextResponse.json({
      ...post,
      authorName: session.name,
      authorAvatar: session.avatarUrl,
      authorDepartment: session.department,
      authorYear: session.year,
      likeCount: 0,
      commentCount: 0,
      userLiked: false,
    });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
