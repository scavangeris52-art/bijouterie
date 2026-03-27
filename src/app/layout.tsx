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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "Bijouterie Nador",
    title: "Bijouterie Nador — Joaillerie Artisanale",
    description: "Bijoux artisanaux d'exception à Nador, Maroc",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Bijouterie Nador",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bijouterie Nador",
    description: "Joaillerie artisanale d'exception",
    images: ["/og-image.svg"],
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
