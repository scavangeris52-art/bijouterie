import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import StarRating from "@/components/ui/StarRating";
import AddToCartSection from "@/components/product/AddToCartSection";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  return { title: product ? `${product.nameFr} | Bijouterie Nador` : "Produit" };
}

export default async function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  const t = await getTranslations("product");
  const locale = params.locale;

  const product = await prisma.product.findUnique({
    where:   { slug: params.slug },
    include: {
      images:   { orderBy: { order: "asc" } },
      category: true,
      reviews:  { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.published) notFound();

  const similar = await prisma.product.findMany({
    where:   { categoryId: product.categoryId, id: { not: product.id }, published: true },
    include: { images: { orderBy: { order: "asc" } }, category: true },
    take: 4,
  });

  const nameKey    = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}`    as "nameFr" | "nameEn" | "nameAr" | "nameEs";
  const descKey    = `desc${locale.charAt(0).toUpperCase() + locale.slice(1)}`    as "descFr" | "descEn" | "descAr" | "descEs";
  const catNameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}`    as "nameFr" | "nameEn" | "nameAr" | "nameEs";

  const name     = product[nameKey] || product.nameFr;
  const desc     = product[descKey] || product.descFr;
  const catName  = product.category[catNameKey] || product.category.nameFr;
  const mainImage = product.images[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800";
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;
  const isPromo = !!product.comparePrice;

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/${locale}/shop`} className="hover:text-rose-500 transition-colors">Boutique</Link>
        <span>/</span>
        <span className="text-rose-500 font-medium">{name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100">
            <Image src={mainImage} alt={name} fill className="object-cover" priority />
            {isPromo && (
              <div className="absolute top-4 left-4 bg-gradient-rose text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Promo
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-cream-100 border-2 border-rose-300 cursor-pointer">
                  <Image src={img.url} alt={img.alt || name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{catName}</p>
          <h1 className="font-luxury text-3xl font-light text-gray-800 mb-4 leading-tight">{name}</h1>

          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="text-sm text-gray-400">({product.reviews.length} avis)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-rose-500">{formatPrice(product.price)}</span>
            {isPromo && product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{desc}</p>

          {/* Specs */}
          <div className="bg-cream-100 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">{t("specifications")}</h3>
            <div className="space-y-2">
              {[
                { label: t("material"), value: product.material },
                { label: t("stone"),    value: product.stone    },
                { label: t("weight"),   value: product.weight   },
                { label: "SKU",         value: product.sku      },
              ].filter((s) => s.value).map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{s.label}</span>
                  <span className="text-gray-800 font-medium">{s.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Disponibilité</span>
                <span className={`font-medium flex items-center gap-1 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
                  {product.stock > 0 ? `${t("inStock")} (${product.stock})` : t("outOfStock")}
                </span>
              </div>
            </div>
          </div>

          {/* Add to cart */}
          <AddToCartSection product={product as never} locale={locale} />
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mb-16">
          <h2 className="font-luxury text-2xl font-light text-gray-800 mb-6">{t("reviews")}</h2>
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-rose flex items-center justify-center text-white font-bold text-xs">
                    {r.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{r.authorName}</p>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                  <span className="ms-auto text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-gray-600 text-sm italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div>
          <h2 className="font-luxury text-2xl font-light text-gray-800 mb-6">{t("similar")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((p) => <ProductCard key={p.id} product={p as never} />)}
          </div>
        </div>
      )}
    </div>
  );
}
