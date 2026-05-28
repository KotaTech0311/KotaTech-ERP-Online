"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { brl } from "@/lib/utils";

export default function Stock() {
  const [s, setS] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: "", category: "", quantity: 0, cost: 0, sale_price: 0, notes: "" });
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
    const { data } = await supabase.from("stock_items").select("*").eq("company_id", cid).order("name");
    setRows(data || []);
  }

  async function save() {
    if (!s) return;
    if (!form.name) return alert("Nome obrigatório.");
    const p = { ...form, company_id: s.company_id, updated_at: new Date().toISOString() };
    const r = id ? await supabase.from("stock_items").update(p).eq("id", id) : await supabase.from("stock_items").insert(p);
    if (r.error) return alert(r.error.message);
    setId("");
    setForm({ name: "", category: "", quantity: 0, cost: 0, sale_price: 0, notes: "" });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Estoque</h1>
      <section className="card p-4 grid md:grid-cols-3 gap-3">
        {["name", "category", "quantity", "cost", "sale_price", "notes"].map((k) => (
          <input key={k} placeholder={k} type={["quantity", "cost", "sale_price"].includes(k) ? "number" : "text"} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="btn-primary" onClick={save}>Salvar</button>
      </section>
      <section className="card p-4 overflow-x-auto">
        <table className="w-full">
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} onClick={() => { setId(r.id); setForm(r); }} className="border-b border-zinc-800 cursor-pointer hover:bg-zinc-800">
                <td className="p-2">{r.name}</td>
                <td>{r.quantity}</td>
                <td>{brl(r.sale_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
