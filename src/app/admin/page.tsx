import { Package, ShoppingCart, TrendingUp, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const STATUS_COLORS: Record<string, "orange" | "blue" | "rose" | "green" | "red" | "gray"> = {
  PENDING:    "orange",
  CONFIRMED:  "blue",
  PROCESSING: "rose",
  SHIPPED:    "green",
  DELIVERED:  "green",
  CANCELLED:  "red",
  REFUNDED:   "gray",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:    "En attente",
  CONFIRMED:  "Confirmée",
  PROCESSING: "En préparation",
  SHIPPED:    "Expédiée",
  DELIVERED:  "Livrée",
  CANCELLED:  "Annulée",
  REFUNDED:   "Remboursée",
};

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingReviews, revenueAgg, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true }, take: 2 } },
    }),
  ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  const kpis = [
    { label: "Produits",       value: productCount,        icon: Package,       color: "#e91e63" },
    { label: "Commandes",      value: orderCount,           icon: ShoppingCart,  color: "#ef6c57" },
    { label: "Revenus",        value: formatPrice(revenue), icon: TrendingUp,    color: "#66bb6a" },
    { label: "Avis en attente",value: pendingReviews,       icon: Star,          color: "#fbbf24" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#8878a0" }}>Vue d'ensemble de votre boutique</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5 border" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider" style={{ color: "#8878a0" }}>{label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={17} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#2d2250" }}>
          <h2 className="text-white font-medium">Dernières commandes</h2>
          <a href="/admin/orders" className="text-xs font-medium hover:text-white transition-colors" style={{ color: "#e91e63" }}>
            Voir toutes →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2d2250" }}>
                {["N° Commande", "Client", "Articles", "Total", "Statut", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs uppercase tracking-wider" style={{ color: "#8878a0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #2d225040" }}
                  className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{order.orderNumber}</td>
                  <td className="px-6 py-4" style={{ color: "#c4b8d4" }}>{order.customerName}</td>
                  <td className="px-6 py-4" style={{ color: "#8878a0" }}>
                    {order.items.map((i) => `${i.product.nameFr} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-6 py-4 font-bold" style={{ color: "#e91e63" }}>{formatPrice(Number(order.total))}</td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_COLORS[order.status] ?? "gray"}>{STATUS_LABELS[order.status] ?? order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: "#8878a0" }}>
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center" style={{ color: "#8878a0" }}>Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
