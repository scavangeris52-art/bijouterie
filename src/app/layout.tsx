import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bijouterie Nador — Joaillerie Artisanale",
    template: "%s | Bijouterie Nador",
  },
  description:
    "Bijoux artisanaux d'exception à Nador, Maroc. Bagues, colliers, bracelets et boucles d'oreilles en or 18K, argent 925 et pierres précieuses.",
  keywords: ["bijouterie", "nador", "maroc", "bijoux", "or", "diamant", "artisanal"],
  authors: [{ name: "Bijouterie Nador" }],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "Bijouterie Nador",
  },
};

/**
 * Root layout — fournit <html> et <body> une seule fois.
 * suppressHydrationWarning est nécessaire car lang/dir sont
 * mis à jour dynamiquement par le layout [locale].
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
