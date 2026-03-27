export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";
import { z } from "zod";

const productSchema = z.object({
  nameFr:       z.string().min(1),
  nameEn:       z.string().min(1),
  nameAr:       z.string().min(1),
  nameEs:       z.string().min(1),
  descFr:       z.string().default(""),
  descEn:       z.string().default(""),
  descAr:       z.string().default(""),
  descEs:       z.string().default(""),
  price:        z.number().positive(),
  comparePrice: z.number().nullable().optional(),
  stock:        z.number().int().min(0),
  material:     z.string().nullable().optional(),
  stone:        z.string().nullable().optional(),
  weight:       z.string().nullable().optional(),
  featured:     z.boolean().default(false),
  published:    z.boolean().default(true),
  categoryId:   z.string(),
  imageUrl:     z.string().url().optional(),
  slug:         z.string().optional(),
  sku:          z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get("category");
    const featured  = searchParams.get("featured");
    const published = searchParams.get("published");
    const q         = searchParams.get("q");
    const limit     = parseInt(searchParams.get("limit") || "50");
    const page      = parseInt(searchParams.get("page") || "1");

    const where: Record<string, unknown> = {};
    if (category)  where.category = { slug: category };
    if (featured === "true") where.featured = true;
    if (published !== "all") where.published = published !== "false";
    if (q) {
      where.OR = [
        { nameFr: { contains: q, mode: "insensitive" } },
        { nameEn: { contains: q, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { order: "asc" } }, category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ data: products, total, page, limit, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Check authentication for admin-only endpoint
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const body   = await req.json();
    const parsed = productSchema.parse(body);

    const slug = parsed.slug || parsed.nameFr.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const sku  = parsed.sku || `BJ-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        ...parsed,
        slug,
        sku,
        images: parsed.imageUrl
          ? { create: [{ url: parsed.imageUrl, alt: parsed.nameFr, order: 0 }] }
          : undefined,
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
