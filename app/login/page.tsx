"use client";

import { useState } from "react";
import { setSession } from "@/lib/session";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Erro ao entrar.");
      return;
    }

    setSession(data);
    location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950">
      <section className="card p-6 w-full max-w-md">
        <h1 className="text-3xl font-black">KotaTech ERP</h1>
        <p className="text-zinc-400 mb-5">Login por nome de usuário.</p>

        <label className="block mb-3">
          <span className="text-sm text-zinc-400">Usuário</span>
          <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mt-1" />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-zinc-400">Senha</span>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full mt-1" onKeyDown={e=>{if(e.key==="Enter")submit()}} />
        </label>

        <button onClick={submit} disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando..." : "Acessar"}
        </button>

        {msg && <p className="mt-4 text-yellow-300 text-sm">{msg}</p>}

        <div className="mt-6 text-xs text-zinc-500">
          <p>Login inicial:</p>
          <p>Usuário: admin</p>
          <p>Senha: admin123</p>
        </div>
      </section>
    </main>
  );
}
