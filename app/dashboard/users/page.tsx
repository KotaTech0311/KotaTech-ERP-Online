"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";

export default function UsersPage() {
  const [session, setSessionState] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    full_name: "",
    username: "",
    password: "",
    role: "Atendente",
    active: true
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) { location.href = "/login"; return; }
    if (s.role !== "Administrador") { location.href = "/dashboard"; return; }
    setSessionState(s);
    load(s.company_id);
  }, []);

  async function load(company_id: string) {
    const res = await fetch(`/api/users?company_id=${company_id}`);
    const data = await res.json();
    if (res.ok) setRows(data);
  }

  async function save() {
    setMsg("");
    if (!session) return;

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, company_id: session.company_id })
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || "Erro ao criar usuário.");
      return;
    }

    setForm({ full_name: "", username: "", password: "", role: "Atendente", active: true });
    await load(session.company_id);
    setMsg("Usuário criado com sucesso.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Usuários</h1>
      <p className="text-zinc-400">Somente ADM pode cadastrar outros usuários.</p>

      <section className="card p-4 grid md:grid-cols-2 gap-3">
        <input placeholder="Nome completo" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
        <input placeholder="Usuário" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
        <input placeholder="Senha" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option>Administrador</option>
          <option>Atendente</option>
          <option>Técnico</option>
          <option>Financeiro</option>
        </select>
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={form.active} onChange={e=>setForm({...form, active:e.target.checked})}/>
          Ativo
        </label>
        <button onClick={save} className="btn-primary">Criar usuário</button>
        {msg && <p className="text-yellow-300 md:col-span-2">{msg}</p>}
      </section>

      <section className="card p-4 overflow-x-auto">
        <table className="w-full">
          <thead><tr className="text-left text-zinc-400"><th>Nome</th><th>Usuário</th><th>Perfil</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-b border-zinc-800">
                <td className="p-2">{r.full_name}</td>
                <td>{r.username}</td>
                <td>{r.role}</td>
                <td>{r.active ? "Ativo" : "Inativo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
