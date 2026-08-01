import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import logoUrl from "@/assets/lumtech-logo.png";

export interface DocLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface DocClient {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface DocProject {
  project_number?: string | null;
  title?: string | null;
}

export interface GenerateDocOptions {
  kind: "QUOTATION" | "INVOICE";
  number: string;
  issueDate: string; // ISO date
  dueOrExpiryLabel: string; // "Valid Until" or "Due Date"
  dueOrExpiryDate?: string | null;
  status?: string | null;
  client: DocClient;
  project?: DocProject | null;
  items: DocLineItem[];
  vatRate?: number; // e.g. 0.15
  notes?: string;
}

const COMPANY = {
  name: "Lum Tech Building Solutions (Pty) Ltd",
  address: "5 Woodford Pl, Hayfields, Pietermaritzburg, 3201, South Africa",
  phone: "+27 63 412 7228",
  email: "projects@lumtechsolutions.co.za",
  web: "building.lumtechsolutions.co.za",
  credentials: "NHBRC Registered  •  CIDB Registered",
};

async function loadImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function barcodeDataUrl(value: string): string {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, value, {
    format: "CODE128",
    displayValue: true,
    fontSize: 12,
    height: 40,
    margin: 4,
  });
  return canvas.toDataURL("image/png");
}

const zar = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

export async function generateDocumentPdf(opts: GenerateDocOptions): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 40;

  // --- Header: logo + company details ---
  try {
    const logoData = await loadImageAsDataUrl(logoUrl);
    // logo aspect ratio ~5.8:1 (see asset processing notes) - render at fixed height
    const logoHeight = 34;
    const logoWidth = logoHeight * 5.8;
    doc.addImage(logoData, "PNG", margin, y, logoWidth, logoHeight);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(COMPANY.name, margin, y + 20);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const companyLines = [COMPANY.address, `${COMPANY.phone}  |  ${COMPANY.email}`, COMPANY.credentials];
  let cy = y;
  companyLines.forEach((line) => {
    doc.text(line, pageWidth - margin, cy, { align: "right" });
    cy += 12;
  });

  y += 60;
  doc.setDrawColor(210, 210, 210);
  doc.line(margin, y, pageWidth - margin, y);
  y += 30;

  // --- Document title + number ---
  doc.setTextColor(20, 20, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(opts.kind === "QUOTATION" ? "QUOTATION" : "TAX INVOICE", margin, y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`${opts.kind === "QUOTATION" ? "Quote" : "Invoice"} #: ${opts.number}`, pageWidth - margin, y - 16, { align: "right" });
  doc.text(`Date: ${opts.issueDate}`, pageWidth - margin, y, { align: "right" });
  if (opts.dueOrExpiryDate) {
    doc.text(`${opts.dueOrExpiryLabel}: ${opts.dueOrExpiryDate}`, pageWidth - margin, y + 16, { align: "right" });
  }
  if (opts.project?.project_number) {
    doc.text(`Project #: ${opts.project.project_number}`, pageWidth - margin, y + 32, { align: "right" });
  }

  y += 40;

  // --- Bill To / Project ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILL TO", margin, y);
  if (opts.project?.title) {
    doc.text("PROJECT", pageWidth / 2, y);
  }
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const clientLines = [opts.client.name, opts.client.address, opts.client.phone, opts.client.email].filter(Boolean) as string[];
  let by = y;
  clientLines.forEach((line) => {
    doc.text(line, margin, by);
    by += 14;
  });
  if (opts.project?.title) {
    doc.text(opts.project.title, pageWidth / 2, y);
  }

  y = Math.max(by, y + 14) + 20;

  // --- Line items table ---
  const col = {
    desc: margin,
    qty: pageWidth - margin - 220,
    price: pageWidth - margin - 150,
    total: pageWidth - margin,
  };

  doc.setFillColor(20, 30, 55);
  doc.rect(margin, y, pageWidth - margin * 2, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DESCRIPTION", col.desc + 8, y + 16);
  doc.text("QTY", col.qty, y + 16, { align: "right" });
  doc.text("UNIT PRICE", col.price, y + 16, { align: "right" });
  doc.text("TOTAL", col.total, y + 16, { align: "right" });
  y += 24;

  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);

  let subtotal = 0;
  opts.items.forEach((item, idx) => {
    const lineTotal = item.quantity * item.unit_price;
    subtotal += lineTotal;
    const rowHeight = 22;
    if (idx % 2 === 1) {
      doc.setFillColor(246, 247, 249);
      doc.rect(margin, y, pageWidth - margin * 2, rowHeight, "F");
    }
    const descLines = doc.splitTextToSize(item.description, col.qty - col.desc - 20);
    doc.text(descLines, col.desc + 8, y + 14);
    doc.text(String(item.quantity), col.qty, y + 14, { align: "right" });
    doc.text(zar(item.unit_price), col.price, y + 14, { align: "right" });
    doc.text(zar(lineTotal), col.total, y + 14, { align: "right" });
    y += Math.max(rowHeight, descLines.length * 12 + 8);
  });

  y += 10;
  doc.setDrawColor(210, 210, 210);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  const vatRate = opts.vatRate ?? 0.15;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  const totalsX = pageWidth - margin - 150;
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", totalsX, y, { align: "left" });
  doc.text(zar(subtotal), pageWidth - margin, y, { align: "right" });
  y += 16;
  doc.text(`VAT (${Math.round(vatRate * 100)}%)`, totalsX, y, { align: "left" });
  doc.text(zar(vat), pageWidth - margin, y, { align: "right" });
  y += 10;
  doc.setDrawColor(210, 210, 210);
  doc.line(totalsX - 10, y, pageWidth - margin, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", totalsX, y, { align: "left" });
  doc.text(zar(total), pageWidth - margin, y, { align: "right" });
  y += 30;

  if (opts.status) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(150, 60, 20);
    doc.text(`Status: ${opts.status}`, margin, y);
    y += 24;
  }

  if (opts.notes) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    const noteLines = doc.splitTextToSize(opts.notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 12 + 10;
  }

  // --- Barcode footer ---
  const barcode = barcodeDataUrl(opts.number);
  const pageHeight = doc.internal.pageSize.getHeight();
  const barcodeY = pageHeight - 90;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, barcodeY - 10, pageWidth - margin, barcodeY - 10);
  doc.addImage(barcode, "PNG", margin, barcodeY, 180, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    `${COMPANY.name}  •  ${COMPANY.web}  •  This document was generated electronically.`,
    pageWidth - margin,
    pageHeight - 30,
    { align: "right" }
  );

  return doc;
}
