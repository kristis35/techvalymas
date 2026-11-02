"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/orders";
import { confirmToCustomer, notifyAdmin } from "@/lib/mail";
import { getService, type DeviceType } from "@/lib/services";
import { looksLikeBot, rateLimited, verifyTurnstile } from "@/lib/spam";

export type OrderFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

const schema = z
  .object({
    device: z.enum(["pc", "keyboard", "console", "other"], { message: "Pasirinkite įrenginio tipą" }),
    service: z.string().min(1, "Pasirinkite paslaugą"),
    name: z.string().trim().min(2, "Įveskite vardą").max(100, "Per ilgas vardas"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s()-]{7,20}$/, "Įveskite teisingą telefono numerį"),
    email: z.string().trim().toLowerCase().email("Įveskite teisingą el. pašto adresą").max(200),
    pickup: z.boolean(),
    address: z.string().trim().max(300, "Per ilgas adresas"),
    comment: z.string().trim().max(2000, "Komentaras per ilgas (iki 2000 simbolių)"),
    consent: z.literal(true, { message: "Būtina sutikti su asmens duomenų tvarkymu" }),
  })
  .superRefine((v, ctx) => {
    const service = getService(v.service);
    if (!service) ctx.addIssue({ code: "custom", path: ["service"], message: "Pasirinkite paslaugą" });
    else if (service.device !== v.device)
      ctx.addIssue({ code: "custom", path: ["service"], message: "Paslauga neatitinka įrenginio tipo" });
    if (v.pickup && v.address.length < 3)
      ctx.addIssue({ code: "custom", path: ["address"], message: "Nurodykite adresą arba rajoną paėmimui" });
  });

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : "";
};

export async function submitOrder(_prev: OrderFormState, fd: FormData): Promise<OrderFormState> {
  const values = {
    device: str(fd, "device"),
    service: str(fd, "service"),
    name: str(fd, "name"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    pickup: str(fd, "pickup") === "on" ? "on" : "",
    address: str(fd, "address"),
    comment: str(fd, "comment"),
    consent: str(fd, "consent") === "on" ? "on" : "",
  };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  // Botams grąžiname „sėkmę“, kad neišduotume, jog buvo atpažinti.
  if (looksLikeBot(str(fd, "website"), Number(str(fd, "startedAt")))) {
    console.warn(`[order] atmesta kaip botas (ip=${ip})`);
    return { ok: true };
  }
  if (rateLimited(ip)) {
    return { ok: false, values, message: "Per daug užklausų. Pabandykite po kelių minučių arba paskambinkite mums." };
  }
  if (!(await verifyTurnstile(str(fd, "cf-turnstile-response") || null, ip))) {
    return { ok: false, values, message: "Nepavyko patvirtinti, kad nesate robotas. Bandykite dar kartą." };
  }

  const parsed = schema.safeParse({
    ...values,
    pickup: values.pickup === "on",
    consent: values.consent === "on",
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { ok: false, values, errors, message: "Patikrinkite pažymėtus laukus." };
  }

  const d = parsed.data;
  try {
    const order = await createOrder({
      device: d.device satisfies DeviceType,
      service: d.service,
      name: d.name,
      phone: d.phone,
      email: d.email,
      pickup: d.pickup,
      address: d.pickup ? d.address : d.address || null,
      comment: d.comment || null,
      source: str(fd, "source").slice(0, 200) || null,
    });

    // Laiškai siunčiami jau išsiuntus atsakymą klientui, kad forma neužtruktų.
    after(async () => {
      const results = await Promise.allSettled([notifyAdmin(order), confirmToCustomer(order)]);
      for (const r of results) if (r.status === "rejected") console.error("[mail] klaida", r.reason);
    });

    return { ok: true };
  } catch (e) {
    console.error("[order] nepavyko išsaugoti", e);
    return {
      ok: false,
      values,
      message: "Įvyko klaida išsaugant užklausą. Pabandykite dar kartą arba susisiekite telefonu.",
    };
  }
}
