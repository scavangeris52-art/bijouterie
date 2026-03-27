export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

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
