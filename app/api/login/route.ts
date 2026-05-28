import { NextResponse } from "next/server";
import { assertServerSupabaseConfig, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    assertServerSupabaseConfig();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Informe usuário e senha." },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("app_users")
      .select("*")
      .eq("username", String(username).trim())
      .eq("active", true)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const ok = String(password) === String(user.password_hash);

    if (!ok) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user_id: user.id,
      company_id: user.company_id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Erro no login." },
      { status: 500 }
    );
  }
}
