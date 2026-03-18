import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Blog | Bijouterie Nador" };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("blog");

  const posts = await prisma.blogPost.findMany({
    where:   { published: true },
    orderBy: { createdAt: "desc" },
  });

  const titleKey   = `title${locale.charAt(0).toUpperCase() + locale.slice(1)}`   as "titleFr"   | "titleEn"   | "titleAr"   | "titleEs";
  const excerptKey = `excerpt${locale.charAt(0).toUpperCase() + locale.slice(1)}` as "excerptFr" | "excerptEn" | "excerptAr" | "excerptEs";

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />

      {posts.length === 0 ? (
        <p className="text-center text-gray-400 py-20">{t("noPosts")}</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => {
            const title   = post[titleKey]   || post.titleFr;
            const excerpt = post[excerptKey] || post.excerptFr;
            return (
              <Link key={post.id} href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row gap-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 border border-rose-50">
                {post.coverImage && (
                  <div className="relative w-full sm:w-60 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <Image src={post.coverImage} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-center">
                  <p className="text-rose-500 text-xs font-semibold mb-2">
                    {new Date(post.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                  <h2 className="font-luxury text-xl font-medium text-gray-800 mb-3 group-hover:text-rose-500 transition-colors">{title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
                  <span className="text-rose-500 text-sm font-semibold mt-4">{t("readMore")}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
