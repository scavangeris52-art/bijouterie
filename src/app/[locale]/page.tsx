import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import SectionTitle from "@/components/ui/SectionTitle";
import StarRating from "@/components/ui/StarRating";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import NewsletterSection from "@/components/home/NewsletterSection";

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("home");

  const [featured, categories, reviews, posts] = await Promise.all([
    prisma.product.findMany({
      where:   { featured: true, published: true },
      include: { images: { orderBy: { order: "asc" } }, category: true },
      take:    4,
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.review.findMany({ where: { status: "APPROVED" }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({ where: { published: true }, take: 3, orderBy: { createdAt: "desc" } }),
  ]);

  const catNames: Record<string, { nameFr: string; nameEn: string; nameAr: string; nameEs: string }> = {
    bagues:             { nameFr: "Bagues",              nameEn: "Rings",     nameAr: "خواتم",  nameEs: "Anillos"   },
    colliers:           { nameFr: "Colliers",            nameEn: "Necklaces", nameAr: "قلائد",  nameEs: "Collares"  },
    bracelets:          { nameFr: "Bracelets",           nameEn: "Bracelets", nameAr: "أساور",  nameEs: "Pulseras"  },
    "boucles-doreilles":{ nameFr: "Boucles d'oreilles",  nameEn: "Earrings",  nameAr: "أقراط",  nameEs: "Pendientes"},
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"
          alt="Hero bijoux"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block bg-gradient-rose text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6 shadow-rose">
            {t("hero.badge")}
          </span>
          <h1 className="font-luxury text-4xl md:text-6xl font-light leading-tight mb-6">{t("hero.title")}</h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto">{t("hero.subtitle")}</p>
          <Link href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 bg-gradient-rose text-white px-8 py-4 rounded-xl font-semibold text-sm tracking-wide shadow-rose hover:shadow-luxury hover:scale-105 transition-all duration-300">
            {t("hero.cta")} →
          </Link>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <SectionTitle title={t("collections.title")} subtitle={t("collections.subtitle")} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            const displayName = getLocalizedField(cat, "name", locale) || cat.nameFr;
            return (
              <Link key={cat.id} href={`/${locale}/shop?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-cream-100 hover:shadow-luxury transition-all duration-300">
                {cat.image && (
                  <Image src={cat.image} alt={displayName} fill className="object-cover group-hover:scale-106 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-white font-luxury text-lg font-medium">{displayName}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 px-4 bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title={t("featured.title")} subtitle={t("featured.subtitle")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p as never} />)}
            </div>
            <div className="text-center mt-10">
              <Link href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 border-2 border-rose-400 text-rose-500 px-8 py-3 rounded-xl font-semibold text-sm hover:bg-rose-50 transition-colors">
                Voir toute la boutique →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <SectionTitle title={t("reviews.title")} subtitle={t("reviews.subtitle")} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-luxury transition-shadow border border-rose-50">
                <StarRating rating={r.rating} size="md" />
                <p className="text-gray-600 italic mt-3 mb-4 leading-relaxed text-sm">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-rose flex items-center justify-center text-white font-bold text-sm">
                    {r.authorName.charAt(0)}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{r.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section className="py-16 px-4 bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title={t("blog.title")} subtitle={t("blog.subtitle")} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300">
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image src={post.coverImage} alt={getLocalizedField(post, "title", locale) || post.titleFr} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-rose-500 text-xs font-semibold mb-2">
                      {new Date(post.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h3 className="font-luxury text-gray-800 font-medium text-base mb-2 line-clamp-2 group-hover:text-rose-500 transition-colors">
                      {getLocalizedField(post, "title", locale) || post.titleFr}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {getLocalizedField(post, "excerpt", locale) || post.excerptFr}
                    </p>
                    <p className="text-rose-500 text-sm font-medium mt-3">{t("blog.readMore")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterSection locale={locale} />
    </div>
  );
}
