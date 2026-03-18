import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProviders from "@/components/admin/AdminProviders";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <AdminProviders>
      <div className="flex min-h-screen admin-scroll" style={{ background: "#0f0a1a" }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto" style={{ background: "#0f0a1a" }}>
          {children}
        </main>
      </div>
    </AdminProviders>
  );
}
