"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Diamond, MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const t      = useTranslations("footer");
  const tNav   = useTranslations("nav");
  const locale = useLocale();

  const links = [
    { href: `/${locale}`,          label: tNav("home")    },
    { href: `/${locale}/shop`,     label: tNav("shop")    },
    { href: `/${locale}/blog`,     label: tNav("blog")    },
    { href: `/${locale}/about`,    label: tNav("about")   },
    { href: `/${locale}/contact`,  label: tNav("contact") },
    { href: `/${locale}/reviews`,  label: tNav("reviews") },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-rose flex items-center justify-center">
                <Diamond size={16} className="text-white" />
              </div>
              <div>
                <p className="font-luxury text-white text-lg font-semibold leading-none">Bijouterie</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-rose-400">Nador</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{t("description")}</p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-rose-500 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-rose-500 transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("links")}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-rose-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <span>123 Boulevard Mohammed V, Nador 62000, Maroc</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={15} className="text-rose-400 flex-shrink-0" />
                <a href="tel:+212600000000" className="hover:text-rose-400 transition-colors">+212 600 000 000</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={15} className="text-rose-400 flex-shrink-0" />
                <a href="mailto:contact@bijouterie-nador.ma" className="hover:text-rose-400 transition-colors">contact@bijouterie-nador.ma</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={15} className="text-rose-400 flex-shrink-0" />
                <span>Lun–Sam : 9h–20h</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("legal")}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">{t("legal")}</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">{t("privacy")}</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">{t("terms")}</Link></li>
              <li>
                <Link href="/admin/login" className="text-sm text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-1">
                  <span>🔒</span> {t("admin")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Bijouterie Nador. {t("rights")}</p>
          <p className="text-xs text-gray-500">{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
