import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE  = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const LOCALES = ["fr", "en", "ar", "es"];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    [products, posts] = await Promise.all([
      prisma.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB not available at build time
  }

  const staticPages = ["", "/shop", "/blog", "/about", "/contact", "/reviews"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url:          `${BASE}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
    for (const p of products) {
      entries.push({
        url:          `${BASE}/${locale}/shop/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    for (const b of posts) {
      entries.push({
        url:          `${BASE}/${locale}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
