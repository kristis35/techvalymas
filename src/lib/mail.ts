import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "./site";
import { getDevice, getService } from "./services";
import type { Order } from "./orders";

// El. laiškų siuntimas: Resend (RESEND_API_KEY) arba SMTP (SMTP_HOST).
// Jei niekas nesukonfigūruota – laiškas tik išvedamas į serverio žurnalą.

type Mail = { to: string; subject: string; text: string; html: string; replyTo?: string };

async function send(mail: Mail) {
  const from = process.env.MAIL_FROM ?? `${site.name} <no-reply@localhost>`;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) throw new Error(`Resend klaida ${res.status}: ${await res.text()}`);
    return;
  }

  if (process.env.SMTP_HOST) {
    const g = globalThis as unknown as { __smtp?: Transporter };
    g.__smtp ??= nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await g.__smtp.sendMail({ from, ...mail });
    return;
  }

  console.info(`[mail] (nesukonfigūruota, laiškas nesiųstas) → ${mail.to}: ${mail.subject}\n${mail.text}`);
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function orderLines(o: Order): [string, string][] {
  return [
    ["Įrenginys", getDevice(o.device)?.label ?? o.device],
    ["Paslauga", getService(o.service)?.name ?? o.service],
    ["Vardas", o.name],
    ["Telefonas", o.phone],
    ["El. paštas", o.email],
    ["Paėmimas", o.pickup ? `Taip – ${o.address ?? ""}` : "Ne, atneš pats"],
    ["Komentaras", o.comment ?? "—"],
  ];
}

const toText = (lines: [string, string][]) => lines.map(([k, v]) => `${k}: ${v}`).join("\n");
const toHtml = (lines: [string, string][]) =>
  `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${lines
    .map(
      ([k, v]) =>
        `<tr><td style="color:#555;vertical-align:top"><b>${esc(k)}</b></td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;

export async function notifyAdmin(o: Order) {
  const to = process.env.ADMIN_EMAIL;
  if (!to) {
    console.warn("[mail] ADMIN_EMAIL nenustatytas – pranešimas administratoriui nesiunčiamas.");
    return;
  }
  const lines = orderLines(o);
  const adminUrl = `${site.url}/admin`;
  await send({
    to,
    replyTo: o.email,
    subject: `Nauja užklausa: ${getService(o.service)?.name ?? o.service} – ${o.name}`,
    text: `Gauta nauja valymo užklausa.\n\n${toText(lines)}\n\nAdministravimas: ${adminUrl}`,
    html: `<p style="font-family:sans-serif">Gauta nauja valymo užklausa.</p>${toHtml(lines)}<p style="font-family:sans-serif"><a href="${esc(adminUrl)}">Atidaryti administravimą</a></p>`,
  });
}

export async function confirmToCustomer(o: Order) {
  const lines = orderLines(o).filter(([k]) => k !== "El. paštas");
  const intro = `Sveiki, ${o.name}!\n\nGavome jūsų valymo užklausą. Tai dar nėra patvirtinta rezervacija – susisieksime su jumis per 1 darbo dieną ir suderinsime tikslią kainą, laiką bei įrenginio perdavimą.`;
  const outro = `Jei turite klausimų, skambinkite ${site.phone} arba atsakykite į šį laišką.\n\nPagarbiai,\n${site.name}`;
  await send({
    to: o.email,
    replyTo: process.env.ADMIN_EMAIL,
    subject: `${site.name}: gavome jūsų užklausą`,
    text: `${intro}\n\nJūsų užklausa:\n${toText(lines)}\n\n${outro}`,
    html: `<div style="font-family:sans-serif;font-size:14px;line-height:1.5">${esc(intro).replace(/\n/g, "<br>")}<h3>Jūsų užklausa</h3>${toHtml(lines)}<p>${esc(outro).replace(/\n/g, "<br>")}</p></div>`,
  });
}
