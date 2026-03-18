"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import type { BlogPost } from "@/types";

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res  = await fetch("/api/blog?published=all&limit=100");
    const data = await res.json();
    setPosts(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (p: BlogPost) => {
    await fetch(`/api/blog/${p.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ published: !p.published }),
    });
    toast.success(p.published ? "Article masqué" : "Article publié");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    toast.success("Article supprimé");
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog ({posts.length})</h1>
          <p className="text-sm mt-1" style={{ color: "#8878a0" }}>Gérez vos articles de blog</p>
        </div>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
          style={{ background: "linear-gradient(135deg,#e91e63,#ef6c57)" }}>
          <Plus size={16} /> Nouvel article
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: "#8878a0" }}>Chargement...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#8878a0" }}>Aucun article</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="rounded-2xl border p-4 flex items-center gap-4" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
              {p.coverImage && (
                <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#0f0a1a" }}>
                  <Image src={p.coverImage} alt={p.titleFr} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm line-clamp-1">{p.titleFr}</p>
                <p className="text-xs mt-0.5" style={{ color: "#8878a0" }}>
                  {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  {p.tags.length > 0 && ` · ${p.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggle(p)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{
                    background: p.published ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color:      p.published ? "#22c55e" : "#ef4444",
                  }}>
                  {p.published ? <Eye size={12} /> : <EyeOff size={12} />}
                  {p.published ? "Publié" : "Brouillon"}
                </button>
                <Link href={`/admin/blog/${p.id}`}
                  className="p-2 rounded-lg" style={{ background: "rgba(233,30,99,0.1)", color: "#e91e63" }}>
                  <Pencil size={14} />
                </Link>
                <button onClick={() => remove(p.id)}
                  className="p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
