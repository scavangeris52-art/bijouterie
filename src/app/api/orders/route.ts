export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const orderSchema = z.object({
  customerName:    z.string().min(1),
  customerEmail:   z.string().email(),
  customerPhone:   z.string().min(1),
  shippingAddress: z.string().min(1),
  shippingCity:    z.string().min(1),
  shippingZip:     z.string().default("62000"),
  shippingMethod:  z.enum(["standard", "express"]).default("standard"),
  items: z.array(z.object({
    productId: z.string(),
    quantity:  z.number().int().positive(),
    price:     z.number().positive(),
  })),
  subtotal:     z.number().positive(),
  shippingCost: z.number().min(0),
  total:        z.number().positive(),
  paymentId:    z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit  = parseInt(searchParams.get("limit") || "20");
    const page   = parseInt(searchParams.get("page") || "1");

    const where = status ? { status: status as never } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
        orderBy: { createdAt: "desc" },
        take:    limit,
        skip:    (page - 1) * limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ data: orders, total, page, limit, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = orderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        orderNumber:     generateOrderNumber(),
        customerName:    parsed.customerName,
        customerEmail:   parsed.customerEmail,
        customerPhone:   parsed.customerPhone,
        shippingAddress: parsed.shippingAddress,
        shippingCity:    parsed.shippingCity,
        shippingZip:     parsed.shippingZip,
        shippingMethod:  parsed.shippingMethod,
        subtotal:        parsed.subtotal,
        shippingCost:    parsed.shippingCost,
        total:           parsed.total,
        paymentId:       parsed.paymentId,
        paidAt:          parsed.paymentId ? new Date() : undefined,
        items: {
          create: parsed.items.map((i) => ({
            productId: i.productId,
            quantity:  i.quantity,
            price:     i.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
