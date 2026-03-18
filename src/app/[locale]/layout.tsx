import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoBanner from "@/components/layout/PromoBanner";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HtmlLangSetter from "@/components/layout/HtmlLangSetter";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const locales = ["fr", "en", "ar", "es"];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return { title: "Bijouterie Nador" };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Met à jour <html lang="…" dir="…"> côté client sans re-render */}
      <HtmlLangSetter locale={locale} />

      <div className="min-h-screen flex flex-col" style={{ background: "#fff8f6" }}>
        <PromoBanner message="💎 Livraison offerte dès 1500 MAD | شحن مجاني من 1500 درهم" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <Toaster position="bottom-center" />
      </div>
    </NextIntlClientProvider>
  );
}
