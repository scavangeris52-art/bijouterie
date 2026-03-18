"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";

type Step = 1 | 2 | 3;

const SHIPPING = { standard: 30, express: 60 };

export default function CheckoutPage() {
  const t      = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [step, setStep]       = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [success, setSuccess]   = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "Nador", zip: "62000",
    shipping: "standard" as "standard" | "express",
  });

  const subtotal     = totalPrice();
  const shippingCost = SHIPPING[form.shipping];
  const total        = subtotal + shippingCost;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:    `${form.firstName} ${form.lastName}`,
          customerEmail:   form.email,
          customerPhone:   form.phone,
          shippingAddress: form.address,
          shippingCity:    form.city,
          shippingZip:     form.zip,
          shippingMethod:  form.shipping,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price })),
          subtotal,
          shippingCost,
          total,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNum(data.data.orderNumber);
        clearCart();
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-luxury text-3xl font-light text-gray-800 mb-3">{t("success")}</h1>
          <p className="text-gray-500 mb-2">
            {t("successMessage").replace("{orderNumber}", orderNum)}
          </p>
          <p className="text-rose-500 font-bold text-lg mb-8">{orderNum}</p>
          <Button variant="rose" size="lg" onClick={() => router.push(`/${locale}`)}>
            {t("backToHome")}
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push(`/${locale}/shop`);
    return null;
  }

  const steps = [
    { n: 1, label: t("step1"), icon: Package },
    { n: 2, label: t("step2"), icon: Truck },
    { n: 3, label: t("step3"), icon: CreditCard },
  ];

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      <h1 className="font-luxury text-3xl font-light text-gray-800 mb-8 text-center">{t("title")}</h1>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 ${step >= s.n ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? "bg-gradient-rose text-white shadow-rose-sm" : "bg-rose-100 text-rose-300"}`}>
                {s.n}
              </div>
              <span className="text-xs font-medium text-gray-500 hidden sm:block">{s.label}</span>
            </div>
            {i < 2 && <div className={`h-0.5 w-16 sm:w-24 mx-2 transition-colors ${step > s.n ? "bg-rose-400" : "bg-rose-100"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1 — Coordonnées */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
              <h2 className="font-semibold text-gray-700 mb-5">{t("step1")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "firstName", label: t("firstName") },
                  { key: "lastName",  label: t("lastName")  },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-500 mb-1">{label}</label>
                    <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                      placeholder={label}
                    />
                  </div>
                ))}
                {[
                  { key: "email",   label: t("email"),   type: "email" },
                  { key: "phone",   label: t("phone"),   type: "tel"   },
                  { key: "address", label: t("address"), type: "text", col: "sm:col-span-2" },
                  { key: "city",    label: t("city"),    type: "text"  },
                  { key: "zip",     label: t("zip"),     type: "text"  },
                ].map(({ key, label, type, col }) => (
                  <div key={key} className={col}>
                    <label className="block text-sm text-gray-500 mb-1">{label}</label>
                    <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
                      type={type}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="rose" onClick={() => setStep(2)}
                  disabled={!form.firstName || !form.lastName || !form.email || !form.phone || !form.address}>
                  {t("next")} →
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Livraison */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
              <h2 className="font-semibold text-gray-700 mb-5">{t("step2")}</h2>
              <div className="space-y-3">
                {[
                  { val: "standard", label: t("standardShipping"), time: t("standardTime"), price: 30 },
                  { val: "express",  label: t("expressShipping"),  time: t("expressTime"),  price: 60 },
                ].map((opt) => (
                  <label key={opt.val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.shipping === opt.val ? "border-rose-400 bg-rose-50" : "border-gray-100 hover:border-rose-200"}`}>
                    <input type="radio" name="shipping" value={opt.val} checked={form.shipping === opt.val}
                      onChange={() => set("shipping", opt.val)} className="accent-rose-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{opt.label}</p>
                      <p className="text-sm text-gray-400">{opt.time}</p>
                    </div>
                    <span className="font-bold text-rose-500">{opt.price} MAD</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="salmon" onClick={() => setStep(1)}>← {t("back")}</Button>
                <Button variant="rose"   onClick={() => setStep(3)}>{t("next")} →</Button>
              </div>
            </div>
          )}

          {/* Step 3 — Paiement */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
              <h2 className="font-semibold text-gray-700 mb-5">{t("step3")}</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-cream-100 rounded-xl p-4 text-sm text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">💳 Mode test Stripe</p>
                  <p>Carte : <strong>4242 4242 4242 4242</strong></p>
                  <p>Date : n'importe quelle date future — CVC : 3 chiffres</p>
                </div>
                {[
                  { label: "N° carte",    placeholder: "4242 4242 4242 4242" },
                  { label: "Expiration",  placeholder: "MM / AA" },
                  { label: "CVC",         placeholder: "123" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm text-gray-500 mb-1">{f.label}</label>
                    <input placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="salmon" onClick={() => setStep(2)}>← {t("back")}</Button>
                <Button variant="rose" loading={loading} onClick={placeOrder}>{t("placeOrder")}</Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50 h-fit">
          <h3 className="font-semibold text-gray-700 mb-4">{t("orderSummary")}</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const name = getLocalizedField(item, "name", locale);
              return (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={item.image} alt={name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 font-medium line-clamp-1">{name}</p>
                    <p className="text-xs text-gray-400">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-rose-500 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>{t("shipping")}</span>
              <span>{shippingCost > 0 ? formatPrice(shippingCost) : t("free")}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
              <span>{t("total")}</span>
              <span className="text-rose-500">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
