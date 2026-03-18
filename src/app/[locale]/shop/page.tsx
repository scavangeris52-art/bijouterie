import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import SectionTitle from "@/components/ui/SectionTitle";
import ShopFilters from "@/components/shop/ShopFilters";
import type { Metadata } from "next";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return { title: "Boutique | Bijouterie Nador" };
}

export default async function ShopPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string; q?: string };
}) {
  const t          = await getTranslations("shop");
  const { category, q } = searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        published: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(q ? { OR: [{ nameFr: { contains: q, mode: "insensitive" } }, { nameEn: { contains: q, mode: "insensitive" } }] } : {}),
      },
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <ShopFilters categories={categories} locale={locale} activeCategory={category} />
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">{t("noProducts")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {products.map((p) => <ProductCard key={p.id} product={p as never} />)}
        </div>
      )}
    </div>
  );
}
