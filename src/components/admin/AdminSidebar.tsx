"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingCart, Star, FileText, LogOut, Diamond } from "lucide-react";

const navItems = [
  { href: "/admin",          icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/admin/products", icon: Package,          label: "Produits"   },
  { href: "/admin/orders",   icon: ShoppingCart,     label: "Commandes"  },
  { href: "/admin/reviews",  icon: Star,             label: "Avis"       },
  { href: "/admin/blog",     icon: FileText,         label: "Blog"       },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col border-r" style={{ background: "#1a1230", borderColor: "#2d2250", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "#2d2250" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e91e63,#ef6c57)" }}>
            <Diamond size={14} className="text-white" />
          </div>
          <span className="text-white font-medium text-sm">Bijouterie Nador</span>
        </div>
        <p className="text-rose-500 text-[10px] uppercase tracking-[0.2em] ps-9">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "rgba(233,30,99,0.15)" : "transparent",
                color:      active ? "#e91e63" : "#8878a0",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#c4b8d4"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#8878a0"; }}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "#2d2250" }}>
        <Link href="/fr" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: "#8878a0" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c4b8d4"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8878a0"; }}>
          <Diamond size={17} /> Voir le site
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
          style={{ color: "#ef4444" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <LogOut size={17} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
