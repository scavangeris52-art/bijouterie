export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: {
        images:   { orderBy: { order: "asc" } },
        category: true,
        reviews:  { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: product });
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { imageUrl, ...data } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(imageUrl && {
          images: {
            deleteMany: { order: 0 },
            create: [{ url: imageUrl, alt: data.nameFr || "", order: 0 }],
          },
        }),
      },
      include: { images: true, category: true },
    });
    return NextResponse.json({ data: product });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
