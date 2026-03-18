"use client";
import { useState } from "react";
import { ShoppingBag, Heart, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";

interface Props { product: Product; locale: string; }

export default function AddToCartSection({ product, locale }: Props) {
  const t           = useTranslations("product");
  const { addItem } = useCartStore();
  const [qty,   setQty]   = useState(1);
  const [liked, setLiked] = useState(false);

  const image = product.images?.[0]?.url || "";

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
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
    }
    toast.success(t("addedToCart"), { className: "toast-rose", duration: 2200, position: "bottom-center" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">{t("quantity")}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-xl bg-salmon-100 text-rose-600 flex items-center justify-center hover:bg-salmon-200 transition-colors">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-semibold text-gray-800">{qty}</span>
          <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-9 h-9 rounded-xl bg-salmon-100 text-rose-600 flex items-center justify-center hover:bg-salmon-200 transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="rose" size="lg" className="flex-1" onClick={handleAdd} disabled={product.stock === 0}>
          <ShoppingBag size={18} />
          {product.stock === 0 ? t("outOfStock") : t("addToCart")}
        </Button>
        <button onClick={() => setLiked(!liked)} className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-rose-400 flex items-center justify-center transition-all hover:bg-rose-50">
          <Heart size={18} className={liked ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
        </button>
      </div>
    </div>
  );
}
