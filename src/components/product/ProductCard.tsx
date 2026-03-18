"use client";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { Product } from "@/types";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale    = useLocale();
  const t         = useTranslations("product");
  const { addItem } = useCartStore();
  const [liked, setLiked] = useState(false);

  const name     = getLocalizedField(product, "name", locale);
  const image    = product.images?.[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600";
  const isPromo  = !!product.comparePrice;
  const discount = isPromo
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id:     product.id,
      slug:   product.slug,
      nameFr: product.nameFr,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      nameEs: product.nameEs,
      price:  Number(product.price),
      image,
      stock:  product.stock,
    });
    toast.success(t("addedToCart"), {
      className: "toast-rose",
      duration: 2200,
      position: "bottom-center",
    });
  };

  return (
    <Link href={`/${locale}/shop/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-luxury transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/5] product-image-zoom bg-cream-100">
          <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-1.5">
            {isPromo && (
              <Badge variant="rose" className="text-[10px] px-2 py-0.5 font-bold">
                -{discount}%
              </Badge>
            )}
            {product.stock === 0 && <Badge variant="gray" className="text-[10px]">{t("outOfStock")}</Badge>}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : "text-gray-500"} />
          </button>

          {/* Add to cart overlay */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-rose text-white py-3 flex items-center justify-center gap-2 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <ShoppingBag size={16} />
                {t("addToCart")}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category?.nameFr}</p>
          <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-rose-500 transition-colors mb-2">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-bold">{formatPrice(product.price)}</span>
            {isPromo && product.comparePrice && (
              <span className="text-gray-400 text-sm line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
