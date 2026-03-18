"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ]   = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch(`/api/products?published=all&q=${q}&limit=100`);
    const data = await res.json();
    setProducts(data.data || []);
    setLoading(false);
  }, [q]);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (p: Product) => {
    await fetch(`/api/products/${p.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ published: !p.published }),
    });
    toast.success(p.published ? "Produit masqué" : "Produit publié");
    load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Produit supprimé");
    load();
  };

  const stockColor = (stock: number) =>
    stock === 0 ? "#ef4444" : stock <= 5 ? "#f59e0b" : "#22c55e";

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Produits ({products.length})</h1>
          <p className="text-sm mt-1" style={{ color: "#8878a0" }}>Gérez votre catalogue</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg,#e91e63,#ef6c57)", boxShadow: "0 4px 16px rgba(233,30,99,0.3)" }}>
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8878a0" }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit..."
          className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
          style={{ background: "#1a1230", border: "1px solid #2d2250", color: "#c4b8d4" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2d2250" }}>
                {["Image", "Produit", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider" style={{ color: "#8878a0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center" style={{ color: "#8878a0" }}>Chargement...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center" style={{ color: "#8878a0" }}>Aucun produit</td></tr>
              ) : products.map((p) => {
                const image = p.images?.[0]?.url;
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #2d225040" }} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      {image ? (
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden" style={{ background: "#0f0a1a" }}>
                          <Image src={image} alt={p.nameFr} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg" style={{ background: "#2d2250" }}>💎</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{p.nameFr}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#8878a0" }}>{p.category?.nameFr} · {p.material}</p>
                    </td>
                    <td className="px-5 py-4 font-bold" style={{ color: "#e91e63" }}>{formatPrice(p.price)}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold" style={{ color: stockColor(p.stock) }}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(p)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        style={{
                          background: p.published ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color:      p.published ? "#22c55e" : "#ef4444",
                        }}>
                        {p.published ? <Eye size={13} /> : <EyeOff size={13} />}
                        {p.published ? "Publié" : "Masqué"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${p.id}`}
                          className="p-2 rounded-lg transition-colors"
                          style={{ background: "rgba(233,30,99,0.1)", color: "#e91e63" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(233,30,99,0.2)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(233,30,99,0.1)"; }}>
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
