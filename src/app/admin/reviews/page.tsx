"use client";
import { useState, useEffect } from "react";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "@/components/ui/StarRating";
import type { Review } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PENDING:  "#f59e0b",
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING:  "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/reviews" : `/api/reviews?status=${filter}`;
    const res  = await fetch(url);
    const data = await res.json();
    setReviews(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const update = async (id: string, status: string) => {
    await fetch(`/api/reviews/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    toast.success(status === "APPROVED" ? "Avis approuvé ✓" : "Avis rejeté");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    toast.success("Avis supprimé");
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Modération des avis</h1>
        <p className="text-sm mt-1" style={{ color: "#8878a0" }}>Approuvez ou rejetez les avis clients</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[{ v: "all", l: "Tous" }, { v: "PENDING", l: "En attente" }, { v: "APPROVED", l: "Approuvés" }, { v: "REJECTED", l: "Rejetés" }].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter(v)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: filter === v ? "linear-gradient(135deg,#e91e63,#ef6c57)" : "#1a1230",
              color:      filter === v ? "#fff" : "#8878a0",
              border:     `1px solid ${filter === v ? "transparent" : "#2d2250"}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: "#8878a0" }}>Chargement...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#8878a0" }}>Aucun avis</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border p-5 flex flex-wrap gap-4 items-start justify-between" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#e91e63,#ef6c57)" }}>
                    {r.authorName.charAt(0)}
                  </div>
                  <span className="text-white font-semibold text-sm">{r.authorName}</span>
                  <StarRating rating={r.rating} size="sm" />
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${STATUS_COLORS[r.status]}20`, color: STATUS_COLORS[r.status] }}>
                    {STATUS_LABELS[r.status]}
                  </span>
                  <span className="text-xs ms-auto" style={{ color: "#8878a0" }}>
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-sm italic" style={{ color: "#c4b8d4" }}>"{r.comment}"</p>
                {r.product && (
                  <p className="text-xs mt-2" style={{ color: "#8878a0" }}>Produit : {r.product.nameFr}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {r.status === "PENDING" && (
                  <>
                    <button onClick={() => update(r.id, "APPROVED")}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                      style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                      <CheckCircle size={13} /> Approuver
                    </button>
                    <button onClick={() => update(r.id, "REJECTED")}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                      <XCircle size={13} /> Rejeter
                    </button>
                  </>
                )}
                <button onClick={() => remove(r.id)}
                  className="p-2 rounded-xl transition-colors"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
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
