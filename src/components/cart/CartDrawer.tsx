"use client";
import { useEffect } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const locale = useLocale();
  const t      = useTranslations("cart");
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-[70] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-rose-500" />
            <h2 className="font-luxury text-lg font-semibold text-gray-800">{t("title")}</h2>
            {items.length > 0 && (
              <span className="bg-gradient-rose text-white text-xs font-bold rounded-full px-2 py-0.5">{items.length}</span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-rose-50 text-gray-500 hover:text-rose-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={52} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">{t("empty")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("emptySubtitle")}</p>
              <Link href={`/${locale}/shop`} onClick={closeCart}
                className="mt-6 px-6 py-2.5 bg-gradient-rose text-white rounded-xl text-sm font-semibold shadow-rose hover:shadow-luxury transition-shadow">
                {t("continueShopping")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const name  = getLocalizedField(item, "name", locale);
                return (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-cream-50 transition-colors">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100">
                      <Image src={item.image} alt={name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{name}</p>
                      <p className="text-rose-500 font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-salmon-100 text-rose-600 flex items-center justify-center hover:bg-salmon-200 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-salmon-100 text-rose-600 flex items-center justify-center hover:bg-salmon-200 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors self-start">
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">{t("total")}</span>
              <span className="text-rose-500 font-bold text-xl">{formatPrice(totalPrice())}</span>
            </div>
            <Link href={`/${locale}/checkout`} onClick={closeCart}>
              <Button variant="rose" size="lg" className="w-full">
                {t("checkout")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
