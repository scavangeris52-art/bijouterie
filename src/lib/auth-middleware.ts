import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth";

/**
 * Middleware to protect admin API routes
 * Returns 401 if user is not authenticated or not an admin
 */
export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Please log in" },
      { status: 401 }
    );
  }

  return null; // null means auth check passed
}

/**
 * Middleware to protect admin API routes with role checking
 * Returns 401 if user is not authenticated
 * Returns 403 if user doesn't have required role
 */
export async function requireAdminRole(req: NextRequest, requiredRole: "ADMIN" | "SUPER_ADMIN" = "ADMIN") {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Please log in" },
      { status: 401 }
    );
  }

  const userRole = (session.user as { role?: string }).role;

  if (requiredRole === "SUPER_ADMIN" && userRole !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Super admin access required" },
      { status: 403 }
    );
  }

  return null; // null means auth check passed
}
