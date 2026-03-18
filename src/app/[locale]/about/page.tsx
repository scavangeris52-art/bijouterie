import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "À propos | Bijouterie Nador" };
}

const stats = [
  { key: "years",   value: "15+", icon: "⭐" },
  { key: "pieces",  value: "5000+", icon: "💍" },
  { key: "clients", value: "3000+", icon: "👤" },
];

const values = [
  { key: "quality",       icon: "🏆" },
  { key: "craftsmanship", icon: "✋" },
  { key: "trust",         icon: "🤝" },
];

// Helper pour éviter le cast TypeScript sur la fonction t
type AboutKey = "years" | "pieces" | "clients" | "ourValues" | "quality" | "qualityDesc" | "craftsmanship" | "craftsmanshipDesc" | "trust" | "trustDesc";

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("about");
  const tKey = (key: AboutKey) => t(key);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 to-cream-100 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title={t("title")} subtitle={t("subtitle")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">
            <div>
              <p className="text-gray-600 leading-relaxed text-lg">{t("story")}</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.key} className="text-center bg-white rounded-2xl p-4 shadow-sm border border-rose-100">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="font-luxury text-2xl font-bold text-rose-500">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{tKey(s.key as AboutKey)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-luxury">
              <Image
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"
                alt="Atelier bijouterie Nador"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title={t("ourValues")} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.key} className="text-center p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-cream-100 border border-rose-100 hover:shadow-luxury transition-shadow">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-luxury text-xl font-medium text-gray-800 mb-3">{tKey(v.key as AboutKey)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tKey(`${v.key}Desc` as AboutKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-3xl mb-4">💎</div>
          <h2 className="font-luxury text-3xl font-light text-white mb-4">Venez nous rendre visite</h2>
          <p className="text-gray-400 mb-6">123 Boulevard Mohammed V, Nador 62000, Maroc</p>
          <a href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-gradient-rose text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-rose hover:shadow-luxury transition-all">
            Nous contacter →
          </a>
        </div>
      </section>
    </div>
  );
}
