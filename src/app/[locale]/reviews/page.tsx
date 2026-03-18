"use client";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import type { Review } from "@/types";

export default function ReviewsPage() {
  const t      = useTranslations("reviews");
  const locale = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ authorName: "", authorEmail: "", rating: 5, comment: "", productId: "" });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/reviews?status=APPROVED")
      .then((r) => r.json())
      .then((d) => setReviews(d.data || []));
  }, []);

  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/reviews", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    setLoading(false);
    setSubmitted(true);
  };

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as "nameFr" | "nameEn" | "nameAr" | "nameEs";

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />

      {/* Average */}
      {reviews.length > 0 && (
        <div className="text-center mb-12">
          <div className="font-luxury text-6xl font-light text-rose-500 mb-2">{avg.toFixed(1)}</div>
          <StarRating rating={Math.round(avg)} size="lg" />
          <p className="text-gray-400 text-sm mt-2">{t("totalReviews").replace("{count}", String(reviews.length))}</p>
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <p className="text-center text-gray-400 py-10">{t("noReviews")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {reviews.map((r) => {
            const productName = r.product ? ((r.product as Record<string, string>)[nameKey] || r.product.nameFr) : null;
            const productImage = r.product?.images?.[0]?.url;
            return (
              <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 hover:shadow-luxury transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.authorName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 text-sm">{r.authorName}</span>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <StarRating rating={r.rating} size="sm" />
                    <p className="text-gray-600 text-sm italic mt-2 leading-relaxed">"{r.comment}"</p>
                    {productName && r.product && (
                      <Link href={`/${locale}/shop/${r.product.slug}`}
                        className="flex items-center gap-2 mt-3 bg-cream-100 rounded-xl p-2 hover:bg-rose-50 transition-colors">
                        {productImage && (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={productImage} alt={productName} fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-xs text-rose-500 font-medium">{productName}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Write Review Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
        <h2 className="font-luxury text-2xl font-light text-gray-800 mb-6">{t("writeReview")}</h2>
        {submitted ? (
          <div className="text-center py-8 text-green-600">
            <div className="text-3xl mb-3">✅</div>
            <p className="font-medium">{t("pending")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "authorName",  label: t("yourName"),  type: "text"  },
                { key: "authorEmail", label: t("yourEmail"), type: "email" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-500 mb-1">{label}</label>
                  <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)} type={type} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">{t("yourRating")}</label>
              <StarRating rating={form.rating} size="lg" interactive onChange={(v) => set("rating", v)} />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t("yourReview")}</label>
              <textarea value={form.comment} onChange={(e) => set("comment", e.target.value)} required rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="rose" loading={loading}>{t("submit")}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
