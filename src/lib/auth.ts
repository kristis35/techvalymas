import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Labai paprasta administratoriaus autentifikacija: vienas slaptažodis (ADMIN_PASSWORD),
// sesija – HMAC pasirašytas slapukas su galiojimo laiku.

const COOKIE = "admin_session";
const MAX_AGE_S = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("Nenustatytas ADMIN_PASSWORD");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Lyginame HMAC reikšmes, kad laikas nepriklausytų nuo slaptažodžio ilgio.
  return safeEqual(sign(`pw:${password}`), sign(`pw:${expected}`));
}

export async function startSession() {
  const exp = String(Date.now() + MAX_AGE_S * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  // Slapukas skaitomas pirmiausia, kad puslapis visada būtų generuojamas užklausos metu.
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value || !adminConfigured()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  await connection();
  return Number(exp) > Date.now();
}
