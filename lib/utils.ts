export function brl(value: any) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function stamp(prefix: string) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${prefix}${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export function whatsappLink(phone: string, message: string) {
  const clean = (phone || "").replace(/\D/g, "");
  const number = clean.startsWith("55") ? clean : `55${clean}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function toNumber(value: any) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}
