export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: params.id }, { orderNumber: params.id }] },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
