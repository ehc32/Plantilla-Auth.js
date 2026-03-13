import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUsers } from "@/utils/users";

const parsePositiveInt = (
  value: string | null,
  fallback: number,
  { min = 1, max = Number.MAX_SAFE_INTEGER } = {},
) => {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parsePositiveInt(searchParams.get("page"), 1, { min: 1 });
    const limit = parsePositiveInt(searchParams.get("limit"), 10, {
      min: 1,
      max: 100,
    });
    const offset = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || undefined;
    const sortDirectionRaw = searchParams.get("sortDirection");
    const sortDirection =
      sortDirectionRaw === "asc" || sortDirectionRaw === "desc"
        ? sortDirectionRaw
        : undefined;

    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;
    const email = searchParams.get("email") || undefined;
    const name = searchParams.get("name") || undefined;

    const { users, total } = await getUsers({
      limit,
      offset,
      sortBy,
      sortDirection,
      role,
      status,
      email,
      name,
    });

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
