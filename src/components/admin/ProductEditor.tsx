"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Category { id: string; slug: string; nameFr: string; }

interface ProductEditorProps {
  productId?: string;
  isNew?: boolean;
}

const EMPTY = {
  nameFr: "", nameEn: "", nameAr: "", nameEs: "",
  descFr: "", descEn: "", descAr: "", descEs: "",
  price: "", comparePrice: "", stock: "0",
  material: "", stone: "", weight: "",
  categoryId: "", imageUrl: "",
  featured: false, published: true,
};

export default function ProductEditor({ productId, isNew }: ProductEditorProps) {
  const router = useRouter();
  const [form, setForm]         = useState(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState("");

  useEffect(() => {
    fetch("/api/products?published=all&limit=100")
      .then((r) => r.json())
      .then(() => {});
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  }, []);

  useEffect(() => {
    if (!isNew && productId) {
      fetch(`/api/products/${productId}`)
        .then((r) => r.json())
        .then((d) => {
          const p = d.data;
          if (!p) return;
          setForm({
            nameFr: p.nameFr || "", nameEn: p.nameEn || "", nameAr: p.nameAr || "", nameEs: p.nameEs || "",
            descFr: p.descFr || "", descEn: p.descEn || "", descAr: p.descAr || "", descEs: p.descEs || "",
            price:        String(p.price || ""),
            comparePrice: String(p.comparePrice || ""),
            stock:        String(p.stock || 0),
            material: p.material || "", stone: p.stone || "", weight: p.weight || "",
            categoryId: p.categoryId || "",
            imageUrl: p.images?.[0]?.url || "",
            featured: p.featured || false,
            published: p.published ?? true,
          });
          setPreview(p.images?.[0]?.url || "");
        });
    }
  }, [productId, isNew]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nameFr || !form.price || !form.categoryId) {
      toast.error("Nom FR, prix et catégorie sont requis");
      return;
    }
    setLoading(true);
    const body = {
      ...form,
      price:        parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock:        parseInt(form.stock),
    };
    const url    = isNew ? "/api/products" : `/api/products/${productId}`;
    const method = isNew ? "POST" : "PATCH";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    if (res.ok) {
      toast.success("Produit sauvegardé ✓");
      router.push("/admin/products");
    } else {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors";
  const inputStyle = { background: "#0f0a1a", border: "1px solid #2d2250", color: "#c4b8d4" };
  const labelCls   = "block text-xs uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "#8878a0" };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{isNew ? "Nouveau produit" : "Modifier le produit"}</h1>
          <p className="text-sm mt-1" style={{ color: "#8878a0" }}>Remplissez les informations en 4 langues</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push("/admin/products")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: "#2d2250", color: "#8878a0" }}>
            <X size={15} /> Annuler
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e91e63,#ef6c57)" }}>
            <Save size={15} /> {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — Multilingue */}
        <div className="xl:col-span-2 space-y-6">
          {/* Noms */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-4 text-sm">Noms multilingues</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "nameFr", label: "🇫🇷 Nom Français",  dir: "ltr" },
                { key: "nameEn", label: "🇬🇧 Nom Anglais",   dir: "ltr" },
                { key: "nameAr", label: "🇲🇦 الاسم بالعربية", dir: "rtl" },
                { key: "nameEs", label: "🇪🇸 Nombre Español", dir: "ltr" },
              ].map(({ key, label, dir }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
                    dir={dir} className={inputCls} style={inputStyle} placeholder={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-4 text-sm">Descriptions multilingues</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "descFr", label: "🇫🇷 Description FR", dir: "ltr" },
                { key: "descEn", label: "🇬🇧 Description EN", dir: "ltr" },
                { key: "descAr", label: "🇲🇦 الوصف بالعربية",  dir: "rtl" },
                { key: "descEs", label: "🇪🇸 Descripción ES", dir: "ltr" },
              ].map(({ key, label, dir }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <textarea value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
                    dir={dir} rows={3} className={`${inputCls} resize-none`} style={inputStyle} placeholder={label} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Détails */}
        <div className="space-y-5">
          {/* Image */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-3 text-sm flex items-center gap-2"><ImageIcon size={15} /> Image</h3>
            {preview && (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3" style={{ background: "#0f0a1a" }}>
                <Image src={preview} alt="preview" fill className="object-cover" />
              </div>
            )}
            <label className={labelCls} style={labelStyle}>URL de l'image</label>
            <input value={form.imageUrl} onChange={(e) => { set("imageUrl", e.target.value); setPreview(e.target.value); }}
              className={inputCls} style={inputStyle} placeholder="https://..." />
          </div>

          {/* Prix & Stock */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-3 text-sm">Prix & Stock</h3>
            <div className="space-y-3">
              {[
                { key: "price",        label: "Prix (MAD)",    type: "number" },
                { key: "comparePrice", label: "Prix barré",    type: "number" },
                { key: "stock",        label: "Stock",         type: "number" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
                    type={type} min="0" className={inputCls} style={inputStyle} placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-3 text-sm">Caractéristiques</h3>
            <div className="space-y-3">
              <div>
                <label className={labelCls} style={labelStyle}>Catégorie</label>
                <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option value="">Sélectionner...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
                </select>
              </div>
              {[
                { key: "material", label: "Matériau",  ph: "Or 18K, Argent 925..." },
                { key: "stone",    label: "Pierre",    ph: "Diamant, Rubis..."     },
                { key: "weight",   label: "Poids",     ph: "3.2g"                  },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <input value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
                    className={inputCls} style={inputStyle} placeholder={ph} />
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-3 text-sm">Options</h3>
            {[
              { key: "featured", label: "Produit vedette (page d'accueil)" },
              { key: "published", label: "Publié (visible sur le site)" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={(form as Record<string, boolean>)[key]}
                  onChange={(e) => set(key, e.target.checked)} className="accent-rose-500 w-4 h-4" />
                <span className="text-sm" style={{ color: "#c4b8d4" }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
