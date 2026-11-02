import "server-only";

// Apsauga nuo automatinių užklausų:
//  1. „honeypot“ laukas, kurio žmogus nemato, o botai užpildo;
//  2. minimalus formos pildymo laikas;
//  3. užklausų skaičiaus ribojimas pagal IP (atmintyje);
//  4. pasirinktinai – Cloudflare Turnstile (jei nustatytas TURNSTILE_SECRET_KEY).

export const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const g = globalThis as unknown as { __rate?: Map<string, number[]> };
const hits: Map<string, number[]> = (g.__rate ??= new Map());

export function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export function looksLikeBot(honeypot: string, startedAt: number, now = Date.now()): boolean {
  if (honeypot.trim() !== "") return true;
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  return now - startedAt < MIN_FILL_MS;
}

export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("[turnstile] patikra nepavyko", e);
    return false;
  }
}
