import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const authHeaders = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: authHeaders }
    );
  }
  return NextResponse.json(session, { headers: authHeaders });
}
