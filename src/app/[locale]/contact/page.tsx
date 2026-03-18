"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactPage() {
  const t      = useTranslations("contact");
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: MapPin, label: t("address"), value: "123 Boulevard Mohammed V, Nador 62000, Maroc" },
    { icon: Phone,  label: t("phone"),   value: "+212 600 000 000", href: "tel:+212600000000" },
    { icon: Mail,   label: t("email"),   value: "contact@bijouterie-nador.ma", href: "mailto:contact@bijouterie-nador.ma" },
    { icon: Clock,  label: t("hours"),   value: t("hoursValue") },
  ];

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Info */}
        <div className="space-y-5">
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
              <div className="w-10 h-10 rounded-xl bg-gradient-rose flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-gray-700 font-medium hover:text-rose-500 transition-colors">{value}</a>
                ) : (
                  <p className="text-sm text-gray-700 font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Google Maps iframe */}
          <div className="rounded-2xl overflow-hidden shadow-sm h-48">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53157.40258097!2d-2.9643!3d35.1740!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7530bad55555555%3A0x0!2sNador%2C%20Morocco!5e0!3m2!1sfr!2sma!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bijouterie Nador sur Google Maps"
            />
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="font-luxury text-xl font-medium text-gray-800 mb-2">{t("success")}</h3>
              <button onClick={() => setSent(false)} className="mt-4 text-rose-500 text-sm font-medium hover:underline">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "name",    label: t("name"),    type: "text"  },
                  { key: "email",   label: t("email"),   type: "email" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-500 mb-1">{label}</label>
                    <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)} type={type} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t("subject")}</label>
                <input value={form.subject} onChange={(e) => set("subject", e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                  placeholder={t("subject")}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t("message")}</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} required rows={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none"
                  placeholder={t("message")}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="rose" size="lg" loading={loading}>
                  {loading ? t("sending") : t("send")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
