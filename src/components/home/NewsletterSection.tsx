"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export default function NewsletterSection({ locale }: { locale: string }) {
  const t       = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [done,  setDone]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await fetch("/api/newsletter", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, locale }),
    });
    setLoading(false);
    setDone(true);
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-4xl mb-4">💎</div>
        <h2 className="font-luxury text-3xl font-light text-white mb-3">{t("title")}</h2>
        <p className="text-gray-400 mb-8">{t("subtitle")}</p>
        {done ? (
          <div className="bg-green-500/20 text-green-400 rounded-xl px-6 py-4 font-medium">{t("success")}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              required
              className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
            />
            <Button type="submit" loading={loading} size="md">{t("button")}</Button>
          </form>
        )}
      </div>
    </section>
  );
}
