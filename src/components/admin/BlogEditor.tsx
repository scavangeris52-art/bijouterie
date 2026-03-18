"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface BlogEditorProps {
  postId?: string;
  isNew?: boolean;
}

const EMPTY = {
  titleFr: "", titleEn: "", titleAr: "", titleEs: "",
  excerptFr: "", excerptEn: "", excerptAr: "", excerptEs: "",
  contentFr: "", contentEn: "", contentAr: "", contentEs: "",
  coverImage: "", tags: "", published: false, slug: "",
};

export default function BlogEditor({ postId, isNew }: BlogEditorProps) {
  const router = useRouter();
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!isNew && postId) {
      fetch(`/api/blog/${postId}`)
        .then((r) => r.json())
        .then((d) => {
          const p = d.data;
          if (!p) return;
          setForm({
            titleFr: p.titleFr || "", titleEn: p.titleEn || "", titleAr: p.titleAr || "", titleEs: p.titleEs || "",
            excerptFr: p.excerptFr || "", excerptEn: p.excerptEn || "", excerptAr: p.excerptAr || "", excerptEs: p.excerptEs || "",
            contentFr: p.contentFr || "", contentEn: p.contentEn || "", contentAr: p.contentAr || "", contentEs: p.contentEs || "",
            coverImage: p.coverImage || "", tags: (p.tags || []).join(", "),
            published: p.published || false, slug: p.slug || "",
          });
          setPreview(p.coverImage || "");
        });
    }
  }, [postId, isNew]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.titleFr) { toast.error("Le titre FR est requis"); return; }
    setLoading(true);
    const slug = form.slug || form.titleFr.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const body = { ...form, slug, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const url    = isNew ? "/api/blog" : `/api/blog/${postId}`;
    const method = isNew ? "POST" : "PATCH";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    if (res.ok) {
      toast.success("Article sauvegardé ✓");
      router.push("/admin/blog");
    } else {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const inputCls   = "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors";
  const inputStyle = { background: "#0f0a1a", border: "1px solid #2d2250", color: "#c4b8d4" };
  const labelCls   = "block text-xs uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "#8878a0" };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{isNew ? "Nouvel article" : "Modifier l'article"}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push("/admin/blog")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border"
            style={{ borderColor: "#2d2250", color: "#8878a0" }}>
            <X size={15} /> Annuler
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e91e63,#ef6c57)" }}>
            <Save size={15} /> {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Titres + contenus multilingues */}
        <div className="xl:col-span-2 space-y-5">
          {/* Titres */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-4 text-sm">Titres</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "titleFr", label: "🇫🇷 Titre FR", dir: "ltr" },
                { key: "titleEn", label: "🇬🇧 Title EN", dir: "ltr" },
                { key: "titleAr", label: "🇲🇦 العنوان",  dir: "rtl" },
                { key: "titleEs", label: "🇪🇸 Título ES", dir: "ltr" },
              ].map(({ key, label, dir }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <input value={(form as Record<string, unknown>)[key] as string} onChange={(e) => set(key, e.target.value)}
                    dir={dir} className={inputCls} style={inputStyle} placeholder={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Excerpts */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-4 text-sm">Extraits (résumé)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "excerptFr", label: "🇫🇷 Extrait FR", dir: "ltr" },
                { key: "excerptEn", label: "🇬🇧 Excerpt EN", dir: "ltr" },
                { key: "excerptAr", label: "🇲🇦 المقتطف",    dir: "rtl" },
                { key: "excerptEs", label: "🇪🇸 Extracto ES", dir: "ltr" },
              ].map(({ key, label, dir }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <textarea value={(form as Record<string, unknown>)[key] as string} onChange={(e) => set(key, e.target.value)}
                    dir={dir} rows={3} className={`${inputCls} resize-none`} style={inputStyle} placeholder={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Content FR */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-4 text-sm">Contenus</h3>
            <div className="space-y-4">
              {[
                { key: "contentFr", label: "🇫🇷 Contenu FR", dir: "ltr" },
                { key: "contentEn", label: "🇬🇧 Content EN", dir: "ltr" },
                { key: "contentAr", label: "🇲🇦 المحتوى",    dir: "rtl" },
                { key: "contentEs", label: "🇪🇸 Contenido ES", dir: "ltr" },
              ].map(({ key, label, dir }) => (
                <div key={key}>
                  <label className={labelCls} style={labelStyle}>{label}</label>
                  <textarea value={(form as Record<string, unknown>)[key] as string} onChange={(e) => set(key, e.target.value)}
                    dir={dir} rows={6} className={`${inputCls} resize-none`} style={inputStyle} placeholder={label} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Cover */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-3 text-sm flex items-center gap-2"><ImageIcon size={15} /> Image de couverture</h3>
            {preview && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3" style={{ background: "#0f0a1a" }}>
                <Image src={preview} alt="cover" fill className="object-cover" />
              </div>
            )}
            <label className={labelCls} style={labelStyle}>URL</label>
            <input value={form.coverImage} onChange={(e) => { set("coverImage", e.target.value); setPreview(e.target.value); }}
              className={inputCls} style={inputStyle} placeholder="https://..." />
          </div>

          {/* Meta */}
          <div className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <h3 className="text-white font-medium mb-3 text-sm">Paramètres</h3>
            <div className="space-y-3">
              <div>
                <label className={labelCls} style={labelStyle}>Slug (URL)</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                  className={inputCls} style={inputStyle} placeholder="mon-article" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Tags (séparés par virgule)</label>
                <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
                  className={inputCls} style={inputStyle} placeholder="bijoux, or, tendances" />
              </div>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)}
                  className="accent-rose-500 w-4 h-4" />
                <span className="text-sm" style={{ color: "#c4b8d4" }}>Publier l'article</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
