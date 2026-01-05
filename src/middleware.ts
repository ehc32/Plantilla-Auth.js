import { isPublicPath } from "@/lib/public-paths";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = getSessionCookie(request);

    // Allow access to public paths without authentication
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // If user is trying to access auth pages (login/register)
    if (pathname.startsWith("/auth/")) {
        // Intentionally ALLOW access even if session exists, to prevent redirect loops.
        // The UI will handle showing "Go to Dashboard" if logged in.
        return NextResponse.next();
    }

    // For protected paths (dashboard, admin, etc), check authentication
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
