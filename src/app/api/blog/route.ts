export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const limit     = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (published !== "all") where.published = published !== "false";

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take:    limit,
    });
    return NextResponse.json({ data: posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const post = await prisma.blogPost.create({ data: body });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
