"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Search, Heart, Menu, X, Globe, Diamond } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const locales = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ar", label: "AR", flag: "🇲🇦" },
  { code: "es", label: "ES", flag: "🇪🇸" },
];

export default function Header() {
  const t       = useTranslations("nav");
  const locale  = useLocale();
  const router  = useRouter();
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: `/${locale}`,           label: t("home")    },
    { href: `/${locale}/shop`,      label: t("shop")    },
    { href: `/${locale}/blog`,      label: t("blog")    },
    { href: `/${locale}/about`,     label: t("about")   },
    { href: `/${locale}/contact`,   label: t("contact") },
    { href: `/${locale}/reviews`,   label: t("reviews") },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/") || "/");
  };

  return (
    <>
      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="bg-white rounded-2xl shadow-luxury w-full max-w-xl mx-4 p-6">
            <div className="flex gap-3">
              <input
                autoFocus
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/${locale}/shop?q=${searchQ}`)}
                placeholder={t("search")}
                className="flex-1 bg-cream-100 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-rose-500 transition-colors">
                <X size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur shadow-md" : "bg-white/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-rose flex items-center justify-center group-hover:shadow-rose transition-shadow">
                <Diamond size={16} className="text-white" />
              </div>
              <div>
                <p className="font-luxury text-lg font-semibold text-gray-800 leading-none">Bijouterie</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-rose-500">Nador</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-rose-500",
                    pathname === l.href ? "text-rose-500" : "text-gray-600"
                  )}>
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Locale */}
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-500 transition-colors text-sm">
                  <Globe size={15} />
                  <span className="font-medium">{locale.toUpperCase()}</span>
                </button>
                <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-luxury border border-rose-100 py-2 min-w-[100px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  {locales.map((lc) => (
                    <button key={lc.code} onClick={() => switchLocale(lc.code)}
                      className={cn("w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-rose-50 hover:text-rose-500 transition-colors",
                        locale === lc.code ? "text-rose-500 font-semibold" : "text-gray-600"
                      )}>
                      <span>{lc.flag}</span> {lc.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-500 transition-colors">
                <Search size={19} />
              </button>

              <Link href={`/${locale}/shop`} className="p-2 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-500 transition-colors">
                <Heart size={19} />
              </Link>

              <button onClick={toggleCart} className="relative p-2 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-500 transition-colors">
                <ShoppingBag size={19} />
                {totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-rose text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                    {totalItems()}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-rose-50 text-gray-600 transition-colors">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-rose-100 px-4 py-4 animate-fade-in">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-gray-700 hover:text-rose-500 border-b border-gray-100 last:border-0 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-4 pt-2">
              {locales.map((lc) => (
                <button key={lc.code} onClick={() => { switchLocale(lc.code); setMobileOpen(false); }}
                  className={cn("flex-1 py-2 text-xs font-semibold rounded-lg transition-colors",
                    locale === lc.code ? "bg-gradient-rose text-white" : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500"
                  )}>
                  {lc.flag} {lc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
