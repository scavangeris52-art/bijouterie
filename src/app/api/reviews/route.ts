import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  rating:      z.number().int().min(1).max(5),
  comment:     z.string().min(5),
  authorName:  z.string().min(1),
  authorEmail: z.string().email(),
  productId:   z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status    = searchParams.get("status");
    const productId = searchParams.get("productId");

    const where: Record<string, unknown> = {};
    if (status)    where.status    = status;
    if (productId) where.productId = productId;

    const reviews = await prisma.review.findMany({
      where,
      include: { product: { include: { images: { take: 1 } } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: reviews });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = reviewSchema.parse(body);
    const review = await prisma.review.create({ data: parsed });
    return NextResponse.json({ data: review }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
