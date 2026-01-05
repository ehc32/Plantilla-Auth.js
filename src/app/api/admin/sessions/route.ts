import { db } from "@/db";
import { session, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const sessionAuth = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionAuth || sessionAuth.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessions = await db
            .select({
                id: session.id,
                token: session.token,
                userId: session.userId,
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                },
            })
            .from(session)
            .leftJoin(user, eq(session.userId, user.id))
            .orderBy(desc(session.createdAt));

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
