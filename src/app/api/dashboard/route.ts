export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [productCount, orderCount, pendingReviews, revenueAgg, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),
    ]);

    return NextResponse.json({
      data: {
        productCount,
        orderCount,
        pendingReviews,
        revenue: Number(revenueAgg._sum.total ?? 0),
        recentOrders,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
