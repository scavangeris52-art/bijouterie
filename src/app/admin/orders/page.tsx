"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import type { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING",    label: "En attente"      },
  { value: "CONFIRMED",  label: "Confirmée"        },
  { value: "PROCESSING", label: "En préparation"   },
  { value: "SHIPPED",    label: "Expédiée"         },
  { value: "DELIVERED",  label: "Livrée"           },
  { value: "CANCELLED",  label: "Annulée"          },
  { value: "REFUNDED",   label: "Remboursée"       },
];

const STATUS_COLORS: Record<string, "orange" | "blue" | "rose" | "green" | "red" | "gray"> = {
  PENDING:    "orange",
  CONFIRMED:  "blue",
  PROCESSING: "rose",
  SHIPPED:    "green",
  DELIVERED:  "green",
  CANCELLED:  "red",
  REFUNDED:   "gray",
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  const load = async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/orders?limit=100" : `/api/orders?status=${filter}&limit=100`;
    const res  = await fetch(url);
    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    toast.success("Statut mis à jour");
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Commandes ({orders.length})</h1>
        <p className="text-sm mt-1" style={{ color: "#8878a0" }}>Gérez et suivez toutes les commandes</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: "all", label: "Toutes" }, ...STATUS_OPTIONS].map((opt) => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: filter === opt.value ? "linear-gradient(135deg,#e91e63,#ef6c57)" : "#1a1230",
              color:      filter === opt.value ? "#fff" : "#8878a0",
              border:     `1px solid ${filter === opt.value ? "transparent" : "#2d2250"}`,
            }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "#8878a0" }}>Chargement...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#8878a0" }}>Aucune commande</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border p-5" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-bold text-base">{order.orderNumber}</span>
                    <Badge variant={STATUS_COLORS[order.status] ?? "gray"}>
                      {STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status}
                    </Badge>
                  </div>
                  <p className="text-xs" style={{ color: "#8878a0" }}>
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: "#e91e63" }}>{formatPrice(Number(order.total))}</p>
                  <p className="text-xs" style={{ color: "#8878a0" }}>Livraison : {Number(order.shippingCost)} MAD</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #2d2250" }}>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#8878a0" }}>Client</p>
                  <p className="text-sm font-medium text-white">{order.customerName}</p>
                  <p className="text-xs" style={{ color: "#8878a0" }}>{order.customerEmail}</p>
                  <p className="text-xs" style={{ color: "#8878a0" }}>{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#8878a0" }}>Livraison</p>
                  <p className="text-sm" style={{ color: "#c4b8d4" }}>{order.shippingAddress}</p>
                  <p className="text-sm" style={{ color: "#c4b8d4" }}>{order.shippingCity} {order.shippingZip}</p>
                  <p className="text-xs mt-1" style={{ color: "#8878a0" }}>Mode : {order.shippingMethod}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#8878a0" }}>Articles</p>
                  <p className="text-sm" style={{ color: "#c4b8d4" }}>
                    {order.items?.map((i) => `${i.product?.nameFr ?? "?"} ×${i.quantity}`).join(", ") || "—"}
                  </p>
                  <div className="mt-3">
                    <label className="block text-xs mb-1" style={{ color: "#8878a0" }}>Changer le statut</label>
                    <select defaultValue={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-rose-500"
                      style={{ background: "#0f0a1a", border: "1px solid #2d2250", color: "#c4b8d4" }}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
