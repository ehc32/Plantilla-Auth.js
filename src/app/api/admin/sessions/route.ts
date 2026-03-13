import { db } from "@/db";
import { session, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const parsePositiveInt = (
  value: string | null,
  fallback: number,
  { min = 1, max = Number.MAX_SAFE_INTEGER } = {},
) => {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

export async function GET(req: Request) {
  try {
    const sessionAuth = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionAuth || sessionAuth.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parsePositiveInt(searchParams.get("page"), 1, { min: 1 });
    const limit = parsePositiveInt(searchParams.get("limit"), 10, {
      min: 1,
      max: 100,
    });
    const offset = (page - 1) * limit;
    const email = searchParams.get("email")?.trim();

    const filter = email ? ilike(user.email, `%${email}%`) : undefined;

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
      .where(filter)
      .orderBy(desc(session.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count(session.id) })
      .from(session)
      .leftJoin(user, eq(session.userId, user.id))
      .where(filter);

    return NextResponse.json({
      sessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
