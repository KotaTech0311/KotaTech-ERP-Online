"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export default function Clients() {
  const [s, setS] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: "", phone: "", whatsapp: "", email: "", document: "", address: "", notes: "" });
  const [id, setId] = useState("");

  useEffect(() => {
    const ss = getSession();
    if (!ss) {
      location.href = "/login";
      return;
    }
    setS(ss);
    load(ss.company_id);
  }, []);

  async function load(cid = s?.company_id) {
    if (!cid) return;
    const { data } = await supabase.from("clients").select("*").eq("company_id", cid).order("created_at", { ascending: false });
    setRows(data || []);
  }

  async function save() {
    if (!s) return;
    if (!form.name) return alert("Informe o nome.");
    const p = { ...form, company_id: s.company_id, updated_at: new Date().toISOString() };
    const r = id ? await supabase.from("clients").update(p).eq("id", id) : await supabase.from("clients").insert(p);
    if (r.error) return alert(r.error.message);
    setId("");
    setForm({ name: "", phone: "", whatsapp: "", email: "", document: "", address: "", notes: "" });
    load();
  }

  async function del() {
    if (!id) return alert("Selecione um cliente.");
    if (!confirm("Excluir cliente?")) return;
    await supabase.from("clients").delete().eq("id", id);
    setId("");
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Clientes</h1>
      <section className="card p-4 grid md:grid-cols-2 gap-3">
        {["name", "phone", "whatsapp", "email", "document", "address", "notes"].map((k) => (
          <input key={k} placeholder={k} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="btn-primary" onClick={save}>Salvar</button>
        <button className="btn-danger" onClick={del}>Excluir</button>
      </section>
      <section className="card p-4 overflow-x-auto">
        <table className="w-full">
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} onClick={() => { setId(r.id); setForm(r); }} className="border-b border-zinc-800 cursor-pointer hover:bg-zinc-800">
                <td className="p-2">{r.name}</td>
                <td>{r.whatsapp}</td>
                <td>{r.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
