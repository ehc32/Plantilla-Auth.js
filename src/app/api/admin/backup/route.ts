import { db } from "@/db";
import { account, session, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { count, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_ROWS_PER_TABLE = 5000;

async function requireAdmin() {
  const sessionAuth = await auth.api.getSession({ headers: await headers() });
  return sessionAuth && sessionAuth.user.role === "admin";
}

export async function GET(request: Request) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") ?? "summary";

    const [[usersCount], [sessionsCount], [accountsCount]] = await Promise.all([
      db.select({ count: count(user.id) }).from(user),
      db.select({ count: count(session.id) }).from(session),
      db.select({ count: count(account.id) }).from(account),
    ]);

    const summary = {
      generatedAt: new Date().toISOString(),
      totals: {
        users: usersCount.count,
        sessions: sessionsCount.count,
        accounts: accountsCount.count,
      },
      cappedExport: MAX_ROWS_PER_TABLE,
    };

    if (mode === "summary") {
      return NextResponse.json(summary);
    }

    const [users, sessions, accounts] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          banned: user.banned,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .orderBy(desc(user.createdAt))
        .limit(MAX_ROWS_PER_TABLE),
      db
        .select({
          id: session.id,
          userId: session.userId,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
        })
        .from(session)
        .orderBy(desc(session.createdAt))
        .limit(MAX_ROWS_PER_TABLE),
      db
        .select({
          id: account.id,
          userId: account.userId,
          providerId: account.providerId,
          accountId: account.accountId,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        })
        .from(account)
        .orderBy(desc(account.createdAt))
        .limit(MAX_ROWS_PER_TABLE),
    ]);

    return NextResponse.json({
      ...summary,
      data: {
        users,
        sessions,
        accounts,
      },
    });
  } catch (error) {
    console.error("Backup generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate backup" },
      { status: 500 },
    );
  }
}
