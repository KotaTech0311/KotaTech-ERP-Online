"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { brl } from "@/lib/utils";

export default function Dashboard() {
  const [session, setSessionState] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});
  const [money, setMoney] = useState({ receive: 0, pay: 0 });

  useEffect(()=>{ boot(); }, []);

  async function boot() {
    const s = getSession();
    if (!s) { location.href = "/login"; return; }
    setSessionState(s);
    const tables = ["clients","stock_items","service_orders","financial_entries"];
    const c:any = {};
    for (const t of tables) {
      const { count } = await supabase.from(t).select("*", { count:"exact", head:true }).eq("company_id", s.company_id);
      c[t] = count || 0;
    }
    setCounts(c);
    const { data: fin } = await supabase.from("financial_entries").select("*").eq("company_id", s.company_id);
    setMoney({
      receive: (fin||[]).filter((x:any)=>x.type==="receivable"&&x.status!=="Pago").reduce((sum:number,x:any)=>sum+Number(x.amount||0),0),
      pay: (fin||[]).filter((x:any)=>x.type==="payable"&&x.status!=="Pago").reduce((sum:number,x:any)=>sum+Number(x.amount||0),0)
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Dashboard</h1>
      {session && <p className="text-zinc-400">Bem-vindo, {session.full_name}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Clientes" value={counts.clients||0}/>
        <Card title="Estoque" value={counts.stock_items||0}/>
        <Card title="OS" value={counts.service_orders||0}/>
        <Card title="Financeiro" value={counts.financial_entries||0}/>
        <Card title="A receber" value={brl(money.receive)}/>
        <Card title="A pagar" value={brl(money.pay)}/>
      </div>
    </div>
  );
}
function Card({title,value}:any){return <div className="card p-4"><p className="text-zinc-400">{title}</p><p className="text-3xl font-black">{value}</p></div>}
