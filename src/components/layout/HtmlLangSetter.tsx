"use client";
import { useEffect } from "react";

/**
 * Composant client léger qui met à jour les attributs lang et dir
 * sur l'élément <html> racine sans avoir besoin de l'imbriquer.
 */
export default function HtmlLangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", locale);
    html.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }, [locale]);

  return null;
}
