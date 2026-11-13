import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/**
 * Opens the API to native (Expo/React Native) and other cross-origin clients.
 * Reflects the Origin header so credentialed requests work on web builds too.
 * Dev-time convenience; lock down to specific origins before deploying.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          ...CORS_HEADERS,
          ...(origin
            ? {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
                Vary: "Origin",
              }
            : { "Access-Control-Allow-Origin": "*" }),
        },
      });
    }

    const response = NextResponse.next();
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Vary", "Origin");
    } else {
      response.headers.set("Access-Control-Allow-Origin", "*");
    }
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
