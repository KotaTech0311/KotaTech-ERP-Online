export type AppSession = { user_id: string; company_id: string; username: string; full_name: string; role: string; };
export function getSession(): AppSession | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("kotatech_session"); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function setSession(data: AppSession) { if (typeof window !== "undefined") localStorage.setItem("kotatech_session", JSON.stringify(data)); }
export function clearSession() { if (typeof window !== "undefined") localStorage.removeItem("kotatech_session"); }
