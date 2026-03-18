"use client";
import { useRouter } from "next/navigation";
import { cn, getLocalizedField } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Category {
  id: string; slug: string; nameFr: string; nameEn: string; nameAr: string; nameEs: string;
}

interface ShopFiltersProps {
  categories: Category[];
  locale: string;
  activeCategory?: string;
}

export default function ShopFilters({ categories, locale, activeCategory }: ShopFiltersProps) {
  const t      = useTranslations("shop");
  const router = useRouter();
  const set = (slug?: string) => {
    const url = slug ? `/${locale}/shop?category=${slug}` : `/${locale}/shop`;
    router.push(url);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-2">
      <button onClick={() => set()} className={cn(
        "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
        !activeCategory ? "bg-gradient-rose text-white shadow-rose-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500"
      )}>
        {t("all")}
      </button>
      {categories.map((cat) => (
        <button key={cat.id} onClick={() => set(cat.slug)} className={cn(
          "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
          activeCategory === cat.slug ? "bg-gradient-rose text-white shadow-rose-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500"
        )}>
          {getLocalizedField(cat, "name", locale) || cat.nameFr}
        </button>
      ))}
    </div>
  );
}
