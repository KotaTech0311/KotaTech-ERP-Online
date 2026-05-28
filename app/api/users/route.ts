import { NextResponse } from "next/server";
import { assertServerSupabaseConfig, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    assertServerSupabaseConfig();

    const { searchParams } = new URL(req.url);
    const company_id = searchParams.get("company_id");

    if (!company_id) {
      return NextResponse.json(
        { error: "company_id ausente." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("app_users")
      .select("id, full_name, username, role, active, created_at")
      .eq("company_id", company_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Erro ao listar usuários." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    assertServerSupabaseConfig();

    const body = await req.json();

    const {
      company_id,
      full_name,
      username,
      password,
      role,
      active
    } = body;

    if (!company_id || !full_name || !username || !password) {
      return NextResponse.json(
        { error: "Preencha empresa, nome, usuário e senha." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("app_users").insert({
      company_id,
      full_name: String(full_name).trim(),
      username: String(username).trim(),
      password_hash: String(password),
      role: role || "Atendente",
      active: active ?? true
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}
