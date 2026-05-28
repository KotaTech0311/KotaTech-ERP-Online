import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { brl } from "./utils";

export async function generateOsPdf(kind: "entrada" | "orcamento" | "saida", data: any) {
  const doc = new jsPDF("p", "mm", "a4");
  const title = kind === "entrada" ? "OS DE ENTRADA" : kind === "orcamento" ? "ORÇAMENTO" : "OS DE SAÍDA";

  doc.setFontSize(16);
  doc.text("KotaTech ERP", 14, 14);
  doc.setFontSize(12);
  doc.text(title, 14, 23);

  doc.setFontSize(10);
  let y = 34;
  const lines = [
    ["OS", data.os?.os_number],
    ["Cliente", data.os?.client_name],
    ["Equipamento", data.os?.device_desc],
    ["Status", data.os?.status],
    ["Defeito", data.os?.issue_reported],
    ["Diagnóstico", data.os?.diagnosis],
    ["Serviço realizado", data.os?.service_done],
    ["Garantia", data.os?.warranty],
    ["Total", brl(data.os?.total_value)]
  ];

  for (const [k, v] of lines) {
    if (v) {
      const text = `${k}: ${String(v)}`;
      const split = doc.splitTextToSize(text, 180);
      doc.text(split, 14, y);
      y += split.length * 6;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }
  }

  if (data.items?.length) {
    autoTable(doc, {
      startY: y + 2,
      head: [["Item", "Qtd", "Unit.", "Total"]],
      body: data.items.map((i: any) => [i.description, i.quantity, brl(i.unit_value), brl(i.total_value)])
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  const imgs = data.images || [];
  if (imgs.length) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    doc.text("Fotos:", 14, y);
    y += 5;
    let x = 14;
    for (const img of imgs.slice(0, 6)) {
      try {
        doc.addImage(img.url, "JPEG", x, y, 38, 28);
        x += 45;
        if (x > 160) {
          x = 14;
          y += 35;
        }
      } catch {}
    }
    y += 40;
  }

  if (data.signature) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    try {
      doc.text("Assinatura:", 14, y);
      doc.addImage(data.signature, "PNG", 14, y + 3, 60, 25);
    } catch {}
  }

  doc.save(`${title}_${data.os?.os_number || "os"}.pdf`);
}
