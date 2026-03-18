import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  return { title: post ? `${post.titleFr} | Blog Bijouterie Nador` : "Article" };
}

export default async function BlogPostPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const titleKey   = `title${locale.charAt(0).toUpperCase() + locale.slice(1)}`   as "titleFr"   | "titleEn"   | "titleAr"   | "titleEs";
  const contentKey = `content${locale.charAt(0).toUpperCase() + locale.slice(1)}` as "contentFr" | "contentEn" | "contentAr" | "contentEs";

  const title   = post[titleKey]   || post.titleFr;
  const content = post[contentKey] || post.contentFr;

  // Related posts
  const related = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <article className="py-12 px-4 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/${locale}/blog`} className="hover:text-rose-500 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-rose-500 font-medium line-clamp-1">{title}</span>
      </nav>

      {/* Cover */}
      {post.coverImage && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image src={post.coverImage} alt={title} fill className="object-cover" priority />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-rose-500 text-sm font-semibold">
            {new Date(post.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="bg-rose-100 text-rose-600 text-xs px-3 py-1 rounded-full font-medium">#{tag}</span>
          ))}
        </div>
        <h1 className="font-luxury text-3xl md:text-4xl font-light text-gray-800 leading-tight">{title}</h1>
      </div>

      {/* Content */}
      <div className="prose prose-rose max-w-none text-gray-600 leading-relaxed text-base">
        {content.split("\n\n").map((para, i) => {
          if (para.startsWith("## ")) {
            return <h2 key={i} className="font-luxury text-2xl font-light text-gray-800 mt-8 mb-4 border-l-4 border-rose-400 pl-4">{para.replace("## ", "")}</h2>;
          }
          if (para.startsWith("# ")) {
            return <h1 key={i} className="font-luxury text-3xl font-light text-gray-800 mt-6 mb-4">{para.replace("# ", "")}</h1>;
          }
          return <p key={i} className="mb-4">{para}</p>;
        })}
      </div>

      {/* Back + Share */}
      <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
        <Link href={`/${locale}/blog`} className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium text-sm transition-colors">
          ← Retour au blog
        </Link>
        <div className="flex gap-2">
          {["Twitter", "Facebook"].map((s) => (
            <span key={s} className="text-xs bg-gray-100 hover:bg-rose-100 hover:text-rose-500 text-gray-500 px-3 py-1.5 rounded-full cursor-pointer transition-colors">{s}</span>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-luxury text-2xl font-light text-gray-800 mb-6">Articles similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/${locale}/blog/${r.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-rose-50">
                {r.coverImage && (
                  <div className="relative h-32 overflow-hidden">
                    <Image src={r.coverImage} alt={(r as Record<string, string>)[titleKey] || r.titleFr} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs text-rose-500 mb-1">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                  <h3 className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-rose-500 transition-colors">
                    {(r as Record<string, string>)[titleKey] || r.titleFr}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
