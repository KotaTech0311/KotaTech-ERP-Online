"use client";
import {useEffect,useState} from "react";import {supabase} from "@/lib/supabase";import {getSession} from "@/lib/session";
export default function Company(){const[id,setId]=useState("");const[form,setForm]=useState<any>({name:"KotaTech"});useEffect(()=>{boot()},[]);
async function boot(){const s=getSession();if (!s) { location.href = "/login"; return; }const{data:c,error}=await supabase.from("companies").select("*").eq("id",s.company_id).single();if(error)return alert(error.message);setId(c.id);setForm(c)}
async function save(){const r=await supabase.from("companies").update({...form,updated_at:new Date().toISOString()}).eq("id",id);if(r.error)return alert(r.error.message);alert("Empresa salva.")}
return <div className="space-y-6"><h1 className="text-3xl font-black">Empresa</h1><section className="card p-4 grid md:grid-cols-2 gap-3">{["name","trade_name","document","phone","whatsapp","email","address","city","state","zip_code","footer_notes"].map(k=><input key={k} placeholder={k} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}<button className="btn-primary" onClick={save}>Salvar</button></section></div>}
