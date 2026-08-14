"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white">M/s Raj Agro Engineering</h1>
          <p className="text-xs text-gray-400">Admin Control Center Portal</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
