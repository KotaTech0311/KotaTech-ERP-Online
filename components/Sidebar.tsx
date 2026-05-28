"use client";

import Link from "next/link";
import { clearSession, getSession } from "@/lib/session";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["Dashboard", "/dashboard"],
  ["Clientes", "/dashboard/clients"],
  ["Estoque", "/dashboard/stock"],
  ["Ordens de Serviço", "/dashboard/os"],
  ["Financeiro", "/dashboard/finance"],
  ["Usuários", "/dashboard/users"],
  ["Empresa", "/dashboard/company"]
];

export default function Sidebar() {
  const pathname = usePathname();
  const [session, setSessionState] = useState<any>(null);

  useEffect(() => setSessionState(getSession()), []);

  function logout() {
    clearSession();
    location.href = "/login";
  }

  return (
    <aside className="w-full md:w-72 md:min-h-screen bg-zinc-950 border-r border-zinc-800 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-black">KotaTech</h1>
        <p className="text-sm text-zinc-400">ERP Online Pro</p>
        {session && <p className="text-xs text-zinc-500 mt-1">{session.full_name} · {session.role}</p>}
      </div>
      <nav className="grid gap-2">
        {links.map(([label, href]) => {
          if (label === "Usuários" && session?.role !== "Administrador") return null;
          return (
            <Link key={href} href={href} className={`rounded-xl px-3 py-2 ${pathname === href ? "bg-brand-500" : "bg-zinc-900 hover:bg-zinc-800"}`}>
              {label}
            </Link>
          );
        })}
        <button onClick={logout} className="btn-secondary mt-4">Sair</button>
      </nav>
    </aside>
  );
}
