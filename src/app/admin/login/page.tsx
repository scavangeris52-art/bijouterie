"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Diamond, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4"
      style={{ background: "#0f0a1a" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-rose flex items-center justify-center mx-auto mb-4 shadow-rose">
            <Diamond size={28} className="text-white" />
          </div>
          <h1 className="font-luxury text-2xl font-light text-white">Bijouterie Nador</h1>
          <p className="text-rose-500 text-xs uppercase tracking-[0.2em] mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border" style={{ background: "#1a1230", borderColor: "#2d2250" }}>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-rose-500" />
            <h2 className="text-white font-medium">Connexion</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
              <strong>{error}</strong>
              <div className="text-xs mt-1 opacity-70">Test : admin@nador.ma / admin123</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nador.ma"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
                style={{ background: "#0f0a1a", border: "1px solid #2d2250" }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
                  style={{ background: "#0f0a1a", border: "1px solid #2d2250" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-400 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #e91e63, #ef6c57)", boxShadow: "0 6px 24px rgba(233,30,99,0.35)" }}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/fr" className="text-sm text-gray-600 hover:text-rose-400 transition-colors">← Retour au site</a>
        </div>
      </div>
    </div>
  );
}
